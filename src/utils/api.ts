import type { Line, Machine, Telemetry } from '../Types/Type'
import { getDetailsLineMachine } from './getDetailsLineMachine'

/**
 * Questa funzione serve a "pulire" i dati che arrivano dal server.
 * I dati vengono messi in ordine per evitare errori nel resto del programma.
 */
function normalizeTelemetry(raw: any): Telemetry {
  // Si estrae l'ID della macchina cercando tra i nomi di proprietà possibili
  const idMacchina = raw.machineId || raw.id_machine || ''

  // Viene stabilito lo stato operativo (RUN, STOP, ecc.). Se assente, si imposta OFFLINE.
  // Alcuni endpoint usano "state", altri usano "reported.state".
  const statoVerificato = String(raw.state || raw.reported?.state || 'OFFLINE').toUpperCase()

  // Stessa logica anche per il codice ordine
  const codiceOrdine = String(raw.orderCode || raw.reported?.orderCode || '---')

  // Sensori dinamici: manteniamo tutti i campi reali invece di forzare temperature/pressure
  let datiSensori: Record<string, unknown> = {}

  if (raw.reported && typeof raw.reported === 'object') {
    for (const [key, value] of Object.entries(raw.reported)) {
      if (!['state', 'orderCode', 'alarms'].includes(key)) {
        datiSensori[key] = value
      }
    }
  }

  if (typeof raw.data === 'string') {
    try {
      const parsed = JSON.parse(raw.data)
      if (parsed && typeof parsed === 'object') {
        datiSensori = { ...datiSensori, ...parsed }
      }
    } catch (e) {
      // Se il JSON non e valido, manteniamo solo i dati gia raccolti
    }
  } else if (raw.data && typeof raw.data === 'object') {
    datiSensori = { ...datiSensori, ...raw.data }
  }

  // Gli allarmi possono arrivare come array o come stringa JSON ("[]")
  let listaAllarmi = raw.alarms || raw.reported?.alarms || []
  if (typeof listaAllarmi === 'string') {
    try {
      listaAllarmi = JSON.parse(listaAllarmi)
    } catch (e) {
      listaAllarmi = []
    }
  }

  // Si crea l'oggetto finale correttamente formattato per il frontend
  return {
    machineId: String(idMacchina),
    id_machine: String(idMacchina),
    type: raw.type || '',
    ts: raw.ts || '',
    reported: {
      ...datiSensori,
      state: statoVerificato,
      orderCode: codiceOrdine,
      alarms: Array.isArray(listaAllarmi) ? listaAllarmi : [],
    },
    // Si mantengono questi campi esterni per facilitare l'accesso rapido ai dati
    state: statoVerificato,
    orderCode: codiceOrdine,
    alarms: Array.isArray(listaAllarmi) ? listaAllarmi : [],
  } as Telemetry
}

/**
 * Questa funzione sistema i campi delle macchine.
 * Serve per evitare crash se alcuni campi non arrivano dal backend.
 */
function normalizeMachine(raw: any, segnaliMacchina: Telemetry[]): Machine {
  const idMacchina = String(raw.id || raw.id_machine || '').trim()
  const linea = String(raw.lineId || raw.id_line || 'Senza Linea')
  const plcVendor = String(raw.plc?.vendor || raw.plc_vendor || 'N/D')
  const plcModel = String(raw.plc?.model || raw.plc_model || 'N/D')

  return {
    id: idMacchina,
    lineId: linea,
    name: String(raw.name || 'Macchina Ignota'),
    type: String(raw.type || 'N/D'),
    plc: {
      vendor: plcVendor,
      model: plcModel,
    },
    order: Number(raw.order || raw.order_nr || 0),
    telemetries: segnaliMacchina,
  }
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
  const listaFinale: Machine[] = []

  // Per ogni macchina presente nell'elenco...
  for (let macchina of listaMacchine || []) {
    // Si cercano i segnali che corrispondono all'ID di questa macchina
    const segnaliMacchina = tutteTelemetrie.filter((t) => {
      return t.machineId === macchina.id || t.machineId === macchina.id_machine
    })

    // La macchina viene "ripulita" e aggiunta alla lista finale
    listaFinale.push(normalizeMachine(macchina, segnaliMacchina))
  }

  return listaFinale
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
