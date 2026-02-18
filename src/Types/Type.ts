/**
 * In questo file vengono definite le "forme" dei dati.
 */

/**
 * Viene definita la struttura di una Macchina.
 * Contiene i dati tecnici, il produttore del computer di controllo (PLC)
 * e la lista dei segnali che invia.
 */
export type Machine = {
  id: string // Il codice unico della macchina
  lineId: string // A quale linea appartiene
  name: string // Il nome della macchina
  type: string // Il tipo (es. Robot, Pressa)
  plc: {
    vendor: string // La marca (es. Siemens)
    model: string // Il modello del pezzo
  }
  order: number // La posizione nella fila
  telemetries: Telemetry[] // La lista dei segnali ricevuti
}

/**
 * Si definisce una Linea di produzione.
 * Una linea è un insieme di macchine e ha uno stato che indica se tutto va bene o no.
 */
export type Line = {
  id: string
  name: string
  description: string
  order: number
  machines: Machine[] // Tutte le macchine di questa linea
  telemetries: Telemetry[] // Tutti i segnali di tutte le macchine della linea
  status: 'positive' | 'wait' | 'alarm' // Stato: Verde (ok), Giallo (attesa), Rosso (allarme)
}

/**
 * Viene definita la Telemetria (il segnale che arriva dai sensori).
 * Si stabilisce quali informazioni vengono inviate ogni pochi secondi dalle macchine.
 */
export type Telemetry = {
  machineId: string // Da quale macchina arriva il segnale
  id_machine?: string // Alias alternativo usato in alcune risposte backend
  type: string // Che tipo di dato è
  ts: string // L'ora esatta in cui è stato creato il dato (Timestamp)

  // Informazioni rapide sullo stato attuale
  state?: 'RUN' | 'IDLE' | 'OFFLINE' | 'FAULT' | 'STOP'
  orderCode?: string // Cosa sta producendo in questo momento
  alarms?:
    | {
        code: string // Codice errore
        message: string // Cosa sta succedendo
        locking: boolean // Vero se la macchina si è bloccata
      }[]
    | []

  /**
   * Sezione "reported" (Dati riportati).
   * Qui si trovano i valori fisici misurati dai sensori.
   */
  reported: {
    state: 'RUN' | 'IDLE' | 'OFFLINE' | 'FAULT' | 'STOP'
    orderCode: string
    alarms:
      | {
          // Eventuali errori trovati
          code: string // Codice errore
          message: string // Cosa sta succedendo
          locking: boolean // Vero se la macchina si è bloccata
        }[]
      | []
    [key: string]: unknown // Campi sensore dinamici (rpm, speed, pressure, ecc.)
  }
}

/**
 * Si definiscono le regole per i componenti che leggono i file.
 * Serve a spiegare al programma come salvare le liste di macchine e linee una volta caricate.
 */
export type ReadFileProps = {
  setMachines: (machines: Machine[]) => void
  setLines: (lines: Line[]) => void
  setTelemetries: (telemetries: Telemetry[]) => void
}
