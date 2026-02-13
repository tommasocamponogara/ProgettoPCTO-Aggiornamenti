import type { Line, Machine, Telemetry } from '../Types/Type'
import { getDetailsLineMachine } from './getDetailsLineMachine'

// Recupera la lista completa delle telemetrie dal server
export async function getTelemetries(): Promise<Telemetry[]> {
  // fetch(): Invia una richiesta HTTP all'indirizzo specificato
  // .json(): Trasforma la risposta del server in un oggetto JavaScript (o array) manipolabile
  const telemetries: Telemetry[] = await (await fetch('http://localhost:3000/telemetries')).json()
  return telemetries
}

// Recupera le macchine e associa a ciascuna le proprie telemetrie
export async function getMachines(): Promise<Machine[]> {
  const machines = await (await fetch('http://localhost:3000/machines')).json()
  const telemetries: Telemetry[] = await (await fetch('http://localhost:3000/telemetries')).json()
  for (const machine of machines) {
    // Filtra le telemetrie appartenenti alla macchina specifica
    const lineTelemetries = telemetries.filter((t) => t.machineId === machine.id)
    machine['telemetries'] = lineTelemetries
  }
  return machines
}

// Recupera i dati di una singola macchina tramite il suo ID
export async function getMachine(id: string): Promise<Machine | undefined> {
  try {
    const response = await fetch(`http://localhost:3000/machines/${id}`)
    return response.json()
  } catch (error) {
    return undefined // Ritorna undefined in caso di errore nella chiamata
  }
}

// Recupera tutte le linee e arricchisce i dati con macchine e stato operativo
export async function getLines(): Promise<Line[]> {
  const machines: Machine[] = await getMachines()

  const lines = await (await fetch('http://localhost:4000/lines')).json()
  for (const line of lines) {
    // Associa le macchine che appartengono a questa linea
    const lineMachines = machines.filter((m) => m.lineId === line.id)
    line['machines'] = lineMachines

    // Calcola lo stato della linea (positivo, wait, alarm) basandosi sulle macchine
    const { setLineStatus } = getDetailsLineMachine()
    line['status'] = setLineStatus(lineMachines)
  }

  return lines
}

// Cerca una singola linea specifica all'interno dell'elenco completo
export async function getLine(id: string): Promise<Line | undefined> {
  const lines: Line[] = await getLines()
  return lines.find((l) => l.id === id)
}
