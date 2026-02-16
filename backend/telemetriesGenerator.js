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

function randomFloat(min, max) {
  const randomVal = lcg.range(min, max)
  return randomVal / 10
}

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

    const indiceM = lcg.range(0, machines.length - 1)
    const macchinaScelta = machines[indiceM]
    const idMacchina = macchinaScelta.id_machine

    const stati = ['RUN', 'IDLE', 'OFFLINE', 'FAULT', 'STOP']
    const indiceS = lcg.range(0, stati.length - 1)
    const statoScelto = stati[indiceS]

    console.log(`Macchina: ${idMacchina} | Stato scelto: ${statoScelto}`)

    // 3. Generazione valori sensori basata su dataCollection
    const sensors = JSON.parse(macchinaScelta.dataCollection || '[]')
    let reportedData = {}

    sensors.forEach((s) => {
      if (statoScelto === 'OFFLINE') {
        reportedData[s] = null
      } else if (statoScelto === 'STOP' || statoScelto === 'IDLE') {
        reportedData[s] = 0
      } else {
        if (s === 'temperature') reportedData[s] = randomFloat(400, 950)
        if (s === 'rpm') reportedData[s] = lcg.range(10000, 50000)
        if (s === 'pressure') reportedData[s] = randomFloat(800, 1200)
        if (s === 'partsChecked') reportedData[s] = lcg.range(10000, 50000)
        if (s === 'speed') reportedData[s] = randomFloat(5, 50)
      }
    })

    // 4. Logica condizionale per gli errori
    if (statoScelto === 'FAULT') {
      gestisciErroreESalva(idMacchina, statoScelto, reportedData)
    } else {
      salvaNelDatabase(idMacchina, statoScelto, reportedData, '[]')
    }
  })
}

function gestisciErroreESalva(idMacchina, stato, reportedData) {
  db.all('SELECT code, message FROM errors WHERE id_machine = ?', [idMacchina], (err, errors) => {
    let alarmData = '[]'

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

    salvaNelDatabase(idMacchina, stato, reportedData, alarmData)
  })
}

function salvaNelDatabase(idMacchina, stato, dataObj, allarmeJson) {
  const ts = new Date().toISOString()
  const orderCode = 'ORD-' + lcg.range(100000, 999999)
  const dataJson = JSON.stringify(dataObj)

  const sql = `INSERT INTO telemetries (ts, id_machine, state, orderCode, data, alarms) VALUES (?, ?, ?, ?, ?, ?)`

  db.run(sql, [ts, idMacchina, stato, orderCode, dataJson, allarmeJson], function (err) {
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
