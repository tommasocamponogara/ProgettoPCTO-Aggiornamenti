// .verbose() serve a dare messaggi di errore più dettagliati se qualcosa va storto
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./factory.db', (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Connesso al database')
  }
})

// Attivazione chiavi esterne per mantenere l'integrità dei dati tra tabelle
db.run('PRAGMA foreign_keys = ON', (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Chiavi esterne attivate')
  }
})

db.serialize(() => {
  // 1. Creazione Tabella Lines
  db.run(`CREATE TABLE IF NOT EXISTS lines (
        id_line TEXT PRIMARY KEY, 
        name TEXT, 
        description TEXT, 
        order_nr INTEGER)`)

  // 2. Creazione Tabella Machines
  db.run(`CREATE TABLE IF NOT EXISTS machines (
        id_machine TEXT PRIMARY KEY,
        name TEXT,
        type TEXT,
        plc_vendor TEXT,
        dataCollection TEXT,
        plc_model TEXT,
        order_nr INTEGER,
        id_line TEXT,
        FOREIGN KEY (id_line) REFERENCES lines(id_line))`)

  // 3. Creazione Tabella Telemetries (con colonna data per i sensori)
  db.run(
    `CREATE TABLE IF NOT EXISTS telemetries (
        ts TEXT, id_machine TEXT,
        state TEXT, 
        orderCode TEXT,
        data TEXT, 
        alarms TEXT,
        PRIMARY KEY (ts, id_machine),
        FOREIGN KEY (id_machine) REFERENCES machines(id_machine))`,
    (err) => {
      if (!err) console.log('Tabella telemetries pronta')
    },
  )

  // 4. Creazione Tabella Errors
  db.run(
    `CREATE TABLE IF NOT EXISTS errors (
        code TEXT, id_machine TEXT,
        message TEXT, 
        PRIMARY KEY (code, id_machine),
        FOREIGN KEY (id_machine) REFERENCES machines(id_machine))`,
    (err) => {
      if (!err) {
        console.log('Tabella errors pronta. Inserimento macchine di default...')
        popolaDatiDefault()
      }
    },
  )
})

// Funzione per inserire le linee e le macchine se non esistono già
function popolaDatiDefault() {
  db.serialize(() => {
    // Inserimento linea principale
    db.run(`INSERT OR IGNORE INTO lines VALUES ('line-1', 'Main Line', 'Linea Principale', 1)`)

    // Inserimento configurazione macchine
    const machines = [
      [
        'press-01',
        'Pressa Idraulica',
        'PRESS',
        'Siemens',
        JSON.stringify(['temperature', 'pressure']),
        'S7-1500',
        10,
        'line-1',
      ],
      [
        'cnc-01',
        'Tornio CNC',
        'CNC',
        'Fanuc',
        JSON.stringify(['rpm', 'temperature']),
        'Series 0i',
        20,
        'line-1',
      ],
      [
        'robot-01',
        'Robot ABB',
        'ROBOT',
        'ABB',
        JSON.stringify(['speed', 'partsChecked']),
        'IRC5',
        30,
        'line-1',
      ],
      [
        'packer-01',
        'Imballatrice Automatica',
        'PACKER',
        'Siemens',
        JSON.stringify(['speed', 'temperature']),
        'S7-1200',
        40,
        'line-1',
      ],
      [
        'qc-01',
        'Stazione Controllo Qualità',
        'QC',
        'Beckhoff',
        JSON.stringify(['partsChecked', 'speed']),
        'CX2040',
        50,
        'line-1',
      ],
    ]

    const stmtM = db.prepare(`INSERT OR IGNORE INTO machines VALUES (?,?,?,?,?,?,?,?)`)
    machines.forEach((m) => stmtM.run(m))
    stmtM.finalize()

    console.log('Macchine inserite correttamente!')
  })
}

module.exports = db
