/**
 * In questo file viene gestito il "motore" che crea i dati finti.
 * Serve a simulare una fabbrica vera, creando ogni pochi secondi dei segnali
 * (temperature, stati, errori) per le macchine salvate nel database.
 */

const { LCG } = require('./randomGenerator')
const lcg = new LCG() // Si usa questo strumento per creare numeri casuali "ordinati"

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./factory.db', (err) => {
  if (err) {
    console.error('Errore connessione DB:', err.message)
  } else {
    console.log('Generatore collegato al database correttamente')
  }
})

/**
 * Viene creata una singola telemetria (un pacchetto di dati).
 * 1. Si scelgono le macchine dal database.
 * 2. Si seleziona una macchina a caso e le si assegna uno stato (es. RUN o FAULT).
 * 3. Si inventano i valori dei sensori in base al tipo di macchina.
 */
function generaTelemetria() {
  db.all('SELECT id_machine, dataCollection FROM machines', (err, listaMacchine) => {
    if (err || listaMacchine.length === 0) return

    // Si sceglie una macchina a sorte tra quelle disponibili
    const indiceM = Math.floor(Math.random() * listaMacchine.length)
    const macchinaScelta = listaMacchine[indiceM]
    const idMacchina = macchinaScelta.id_machine

    // Si decide cosa sta facendo la macchina (accesa, spenta, rotta, ecc.)
    const statiPossibili = ['RUN', 'IDLE', 'OFFLINE', 'FAULT', 'STOP']
    const statoScelto = statiPossibili[Math.floor(Math.random() * statiPossibili.length)]

    // Si leggono quali sensori ha la macchina e si inventano i numeri
    const sensori = JSON.parse(macchinaScelta.dataCollection || '["temperature"]')
    let datiSensori = {}

    sensori.forEach((s) => {
      if (statoScelto === 'OFFLINE') {
        datiSensori[s] = null // Se è spenta, non c'è segnale
      } else if (statoScelto === 'STOP' || statoScelto === 'IDLE') {
        datiSensori[s] = 0 // Se è ferma, i valori sono a zero
      } else {
        // Se è accesa, si inventano numeri realistici
        if (s === 'temperature') datiSensori[s] = (Math.random() * (95 - 40) + 40).toFixed(1)
        if (s === 'rpm') datiSensori[s] = Math.floor(Math.random() * (5000 - 1000) + 1000)
        if (s === 'pressure') datiSensori[s] = (Math.random() * (12 - 8) + 8).toFixed(1)
        if (s === 'speed') datiSensori[s] = (Math.random() * 50).toFixed(1)
      }
    })

    console.log(`Generazione dati per: ${idMacchina} | Stato: ${statoScelto}`)

    // Se la macchina è in errore (FAULT), si cerca un messaggio di guasto specifico
    if (statoScelto === 'FAULT') {
      gestisciErroreESalva(idMacchina, statoScelto, datiSensori)
    } else {
      salvaNelDatabase(idMacchina, statoScelto, datiSensori, '[]')
    }
  })
}

/**
 * Viene cercato un errore specifico nel database se la macchina è guasta.
 */
function gestisciErroreESalva(idMacchina, stato, datiSensori) {
  db.all(
    'SELECT code, message FROM errors WHERE id_machine = ?',
    [idMacchina],
    (err, listaErrori) => {
      let allarmeJson = '[]'

      if (!err && listaErrori.length > 0) {
        // Si sceglie un errore a caso tra quelli che la macchina può avere
        const indiceE = lcg.range(0, listaErrori.length - 1)
        const errore = listaErrori[indiceE]

        const allarmeOggetto = {
          code: errore.code,
          message: errore.message,
          locking: true,
        }
        allarmeJson = JSON.stringify([allarmeOggetto])
      }

      salvaNelDatabase(idMacchina, stato, datiSensori, allarmeJson)
    },
  )
}

/**
 * Si salvano i dati finali nella tabella 'telemetries'.
 * Viene aggiunto il timestamp (l'ora esatta) e un codice ordine finto.
 */
function salvaNelDatabase(idMacchina, stato, oggettoDati, allarmeJson) {
  const oraAttuale = new Date().toISOString()
  const codiceOrdine = 'ORD-' + lcg.range(100000, 999999)
  const datiJson = JSON.stringify(oggettoDati)

  const sql = `INSERT INTO telemetries (ts, id_machine, state, orderCode, data, alarms) VALUES (?, ?, ?, ?, ?, ?)`

  db.run(sql, [oraAttuale, idMacchina, stato, codiceOrdine, datiJson, allarmeJson], (err) => {
    if (err) {
      console.error('Errore durante il salvataggio:', err.message)
    } else {
      console.log(`>>> Segnale salvato per ${idMacchina}`)
    }
  })
}

/**
 * Viene gestito il ciclo continuo.
 * Il generatore crea un dato, aspetta qualche secondo e poi ricomincia.
 */
let attivo = false

function cicloInfinito() {
  if (!attivo) return
  // Si aspetta un tempo casuale tra 4 e 6 secondi
  const secondiAttesa = lcg.range(4, 6)

  setTimeout(() => {
    generaTelemetria()
    cicloInfinito()
  }, secondiAttesa * 1000)
}

module.exports = {
  // Funzione per far partire la creazione dei dati
  start: () => {
    if (!attivo) {
      attivo = true
      cicloInfinito()
      console.log('GENERATORE AUTOMATICO AVVIATO')
    }
  },
  // Funzione per fermare tutto
  stop: () => {
    attivo = false
    console.log('GENERATORE AUTOMATICO FERMATO')
  },
}
