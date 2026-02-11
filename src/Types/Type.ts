// Definizione della struttura base di una Macchina
export type Machine = {
  id: string
  lineId: string
  name: string
  type: string
  plc: {
    vendor: string
    model: string
  }
  order: number
  // Telemetrie associate alla macchina, se presenti, altrimenti sarà un array vuoto
  telemetries: Telemetry[]
}

// Estensione del tipo Macchina che garantisce la presenza di telemetrie
// Oggetto che possiede tutte le proprietà di Machine e aggiunge un array di telemetrie
export type MachineWithTelemetries = Machine & {
  telemetries: Telemetry[]
}

// Definizione della struttura di una Linea di produzione
export type Line = {
  id: string
  name: string
  description: string
  order: number
  machines: Machine[]
  telemetries: Telemetry[]
  status: 'positive' | 'wait' | 'alarm'
}

// Definizione dei dati inviati dai sensori (Telemetria)
export type Telemetry = {
  machineId: string
  type: string
  ts: string // Timestamp del segnale (momento esatto in cui il dato è stato generato: formato data)
  reported: {
    state: 'RUN' | 'IDLE' | 'OFFLINE' | 'FAULT' | 'STOP'
    orderCode: string
    temperature: number
    pressure: number
    alarms: // O array vuoto o array che rappresenta gli allarmi attivi sul macchinario
      | [
          {
            code: string
            message: string
            locking: boolean // Indica se l'allarme blocca la produzione
          },
        ]
      | [] // Può essere un array vuoto se non ci sono allarmi
  }
}

// Proprietà attese dai componenti che leggono file o flussi dati
export type ReadFileProps = {
  setMachines: (machines: Machine[]) => void
  setLines: (lines: Line[]) => void
  setTelemetries: (telemetries: Telemetry[]) => void
}

// Proprietà per componenti che mostrano lo stato generale delle linee
export type StatusProps = {
  lineMachines: Line[]
}
