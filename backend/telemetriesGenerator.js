const { LCG } = require('./randomGenerator')
const lcg = new LCG()
const { check } = require('./')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./factory.db', (err) => {
  if (err) {
    console.error('Errore connessione DB:', err.message)
  } else {
    console.log('Generatore connesso al database')
  }
})

function generaTelemetria() {
  db.all('SELECT id_machine FROM machines', (err, machines) => {
    if (err) {
      console.error('Errore recupero macchine:', err.message)
      return
    }
    if (machines.length === 0) {
      console.log('Nessuna macchina trovata nel DB')
      return
    }

    // 1. Scelta della macchina
    const indiceM = lcg.range(0, machines.length - 1)
    const idMacchina = machines[indiceM].id_machine

    // 2. Scelta dello stato
    const stati = ['RUN', 'IDLE', 'OFFLINE', 'FAULT', 'STOP']
    const indiceS = lcg.range(0, stati.length - 1)
    const statoScelto = stati[indiceS]

    console.log(`Macchina: ${idMacchina} | Stato scelto: ${statoScelto}`)

    // 3. Logica condizionale: se FAULT cerca l'errore, altrimenti salva subito
    if (statoScelto === 'FAULT') {
      gestisciErroreESalva(idMacchina, statoScelto)
    } else {
      salvaNelDatabase(idMacchina, statoScelto, '')
    }
  })
}

function gestisciErroreESalva(idMacchina, stato) {
  db.all('SELECT code, message FROM errors WHERE id_machine = ?', [idMacchina], (err, errors) => {
    let alarmData = ''

    if (!err && errors.length > 0) {
      const indiceE = lcg.range(0, errors.length - 1)
      const erroreScelto = errors[indiceE]

      const allarmeOggetto = {
        code: erroreScelto.code,
        message: erroreScelto.message,
        locking: true,
      }

      alarmData = JSON.stringify([allarmeOggetto])
    }

    salvaNelDatabase(idMacchina, stato, alarmData)
  })
}

function salvaNelDatabase(idMacchina, stato, allarmeJson) {
  const ts = new Date().toISOString()
  const orderCode = 'ORD-' + lcg.range(1000, 9999)

  const sql = `INSERT INTO telemetries (ts, id_machine, state, orderCode, alarms) VALUES (?, ?, ?, ?, ?)`

  db.run(sql, [ts, idMacchina, stato, orderCode, allarmeJson], function (err) {
    if (err) {
      console.error('Errore salvataggio telemetria:', err.message)
    } else {
      console.log(`>>> Telemetria salvata | Macchina: ${idMacchina} | Stato: ${stato}`)
    }
  })
}

let isRunning = false

function loop() {
  if (!isRunning) return
  const secondiAttesa = lcg.range(1, 10)

  setTimeout(() => {
    generaTelemetria()
    loop()
  }, secondiAttesa * 1000)
}

if (check) {
  loop()
}

// Funzioni per controllare il ciclo
module.exports = {
  start: () => {
    if (!isRunning) {
      isRunning = true
      loop()
      console.log('REGISTRAZIONE AVVIATA')
    }
  },
  stop: () => {
    isRunning = false
    console.log('REGISTRAZIONE FERMATA')
  },
}
