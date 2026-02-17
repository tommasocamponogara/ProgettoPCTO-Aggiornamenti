import type { Line, Machine, Telemetry } from '../Types/Type'
import { getDetailsLineMachine } from './getDetailsLineMachine'

/**
 * Questa funzione serve a "pulire" i dati che arrivano dal server.
 * I dati vengono messi in ordine per evitare errori nel resto del programma.
 */
function normalizeTelemetry(raw: any): Telemetry {
  // Si estrae l'ID della macchina cercando tra i nomi di proprietà possibili
  const idMacchina = raw.machineId || raw.id_machine || ''

  // Viene stabilito lo stato operativo (RUN, STOP, ecc.). Se assente, si imposta OFFLINE
  const statoVerificato = String(raw.state || 'OFFLINE').toUpperCase()

  // Se i dati dei sensori arrivano come testo, vengono convertiti in un oggetto leggibile
  let datiSensori = raw.data
  if (typeof raw.data === 'string') {
    try {
      datiSensori = JSON.parse(raw.data)
    } catch (e) {
      datiSensori = {}
    }
  }

  // Si crea l'oggetto finale correttamente formattato per il frontend
  return {
    machineId: String(idMacchina),
    type: raw.type || '',
    ts: raw.ts || '',
    reported: {
      state: statoVerificato,
      orderCode: raw.orderCode || '---',
      temperature: datiSensori?.temperature || 0,
      pressure: datiSensori?.pressure || 0,
      alarms: raw.alarms || [],
    },
    // Si mantengono questi campi esterni per facilitare l'accesso rapido ai dati
    state: statoVerificato,
    orderCode: raw.orderCode || '---',
    alarms: raw.alarms || [],
  } as Telemetry
}

/**
 * Si recupera la lista di tutte le telemetrie dal database.
 * Ogni dato viene trasformato e pulito prima di essere restituito.
 */
export async function getTelemetries(): Promise<Telemetry[]> {
  const risposta = await fetch('http://localhost:3000/telemetries')
  const datiGrezzi = await risposta.json()

  // Ogni elemento viene processato con la funzione di normalizzazione definita sopra
  return (datiGrezzi || []).map((dato: any) => normalizeTelemetry(dato))
}

/**
 * Si ottiene l'elenco delle macchine e si inseriscono i relativi segnali (telemetrie).
 */
export async function getMachines(): Promise<Machine[]> {
  const rispostaMacchine = await fetch('http://localhost:3000/machines')
  const listaMacchine = await rispostaMacchine.json()

  const tutteTelemetrie = await getTelemetries()

  // Per ogni macchina presente nell'elenco...
  for (let macchina of listaMacchine || []) {
    // Si cercano i segnali che corrispondono all'ID di questa macchina
    const segnaliMacchina = tutteTelemetrie.filter((t) => {
      return t.machineId === macchina.id || t.machineId === macchina.id_machine
    })

    // I segnali corrispondenti vengono salvati all'interno dell'oggetto macchina
    macchina.telemetries = segnaliMacchina
  }

  return listaMacchine
}

/**
 * Si recuperano i dati di una singola macchina specifica tramite il suo ID.
 */
export async function getMachine(id: string): Promise<Machine | undefined> {
  try {
    const risposta = await fetch(`http://localhost:3000/machines/${id}`)
    return await risposta.json()
  } catch (errore) {
    console.log('Errore: macchina non trovata')
    return undefined
  }
}

/**
 * Si caricano tutte le linee della fabbrica e si associano le rispettive macchine.
 */
export async function getLines(): Promise<Line[]> {
  const tutteLeMacchine = await getMachines()

  const rispostaLinee = await fetch('http://localhost:3000/lines')
  const listaLinee = await rispostaLinee.json()

  for (let linea of listaLinee || []) {
    // Si individuano le macchine che appartengono a questa linea specifica
    const macchineDellaLinea = tutteLeMacchine.filter((m) => m.lineId === linea.id)
    linea.machines = macchineDellaLinea

    // Si interroga un modulo esterno per determinare lo stato visivo della linea
    const utility = getDetailsLineMachine()
    linea.status = utility.setLineStatus(macchineDellaLinea)
  }

  return listaLinee
}

/**
 * Si effettua la ricerca di una singola linea specifica tramite ID.
 */
export async function getLine(id: string): Promise<Line | undefined> {
  const linee = await getLines()
  return linee.find((l) => l.id === id)
}
