/**
 * Modulo di persistenza dati basato su SQLite3.
 * Gestisce la connessione al database, la definizione dello schema relazionale
 * e il popolamento iniziale delle tabelle per l'ambiente di produzione simulato.
 */

const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./factory.db', (err) => {
  if (err) {
    console.error(`Errore di connessione: ${err.message}`)
  } else {
    console.log('Connessione al database stabilita.')
  }
})

/**
 * Inizializzazione dello Schema.
 * Utilizzo di db.serialize() per garantire l'esecuzione sequenziale dei comandi.
 */
db.serialize(() => {
  // 1. Tabella 'lines': definisce i cluster logici della fabbrica.
  db.run(`CREATE TABLE IF NOT EXISTS lines (
        id_line TEXT PRIMARY KEY, 
        name TEXT, 
        description TEXT, 
        order_nr INTEGER)`)

  // 2. Tabella 'machines': definisce le unità operative.
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

  // 3. Tabella 'telemetries': archivio cronologico dei dati provenienti dal campo.
  db.run(
    `CREATE TABLE IF NOT EXISTS telemetries (
        ts TEXT, 
        id_machine TEXT,
        state TEXT, 
        orderCode TEXT,
        data TEXT, 
        alarms TEXT, 
        PRIMARY KEY (ts, id_machine),
        FOREIGN KEY (id_machine) REFERENCES machines(id_machine))`,
    (err) => {
      if (!err) console.log('Schema telemetries inizializzato.')
    },
  )

  // 4. Tabella 'errors': catalogo codificato delle anomalie per specifico macchinario.
  db.run(
    `CREATE TABLE IF NOT EXISTS errors (
        code TEXT, 
        id_machine TEXT,
        message TEXT, 
        PRIMARY KEY (code, id_machine),
        FOREIGN KEY (id_machine) REFERENCES machines(id_machine))`,
    (err) => {
      if (!err) {
        console.log('Schema errors inizializzato. Esecuzione seeding dati di default...')
        popolaDatiDefault()
      }
    },
  )
})

/**
 * Inserisce i dati minimi necessari al funzionamento della simulazione.
 * Utilizza l'istruzione 'INSERT OR IGNORE' per evitare conflitti in caso di riavvii multipli.
 */
function popolaDatiDefault() {
  db.serialize(() => {
    // Definizione della linea di produzione predefinita.
    db.run(`INSERT OR IGNORE INTO lines VALUES ('line-1', 'Main Line', 'Linea Principale', 1)`)

    // Configurazione del parco macchine iniziale.
    const listaMacchine = [
      [
        'Press-01',
        'Pressa Idraulica',
        'PRESS',
        'Siemens',
        JSON.stringify(['temperature', 'pressure']),
        'S7-1500',
        10,
        'line-1',
      ],
      [
        'Cnc-01',
        'Tornio CNC',
        'CNC',
        'Fanuc',
        JSON.stringify(['rpm', 'temperature']),
        'Series 0i',
        20,
        'line-1',
      ],
      [
        'Robot-01',
        'Robot ABB',
        'ROBOT',
        'ABB',
        JSON.stringify(['speed', 'partsChecked']),
        'IRC5',
        30,
        'line-1',
      ],
      [
        'Packer-01',
        'Imballatrice Automatica',
        'PACKER',
        'Siemens',
        JSON.stringify(['speed', 'temperature']),
        'S7-1200',
        40,
        'line-1',
      ],
      [
        'Qc-01',
        'Stazione Controllo Qualità',
        'QC',
        'Beckhoff',
        JSON.stringify(['partsChecked', 'speed']),
        'CX2040',
        50,
        'line-1',
      ],
    ]

    // 1. Si prepara il "modello" per le macchine
    const inserisciM = db.prepare(`INSERT OR IGNORE INTO machines VALUES (?,?,?,?,?,?,?,?)`)

    // 2. Per ogni macchina presente nella lista, si riempie il modello e si salva
    listaMacchine.forEach((m) => inserisciM.run(m))

    // 3. Si comunica al database che abbiamo finito con questo modello
    inserisciM.finalize()

    // --- Lista degli errori comuni ---
    const listaErrori = [
      ['E01', 'Press-01', 'Pressione Bassa'],
      ['E02', 'Press-01', 'Pompa Calda'],
      ['E01', 'Cnc-01', 'Punta Usurata'],
      ['E01', 'Robot-01', 'Urto Rilevato'],
      ['E01', 'Packer-01', 'Nastro Fermo'],
    ]

    // 4. Si prepara il "modello" per gli errori
    const inserisciE = db.prepare(
      `INSERT OR IGNORE INTO errors (code, id_machine, message) VALUES (?, ?, ?)`,
    )

    // 5. Si inserisce ogni errore della lista nel database
    listaErrori.forEach((err) => inserisciE.run(err))

    // 6. Si chiude il modello degli errori
    inserisciE.finalize()

    console.log('Salvataggio iniziale completato.')
  })
}

module.exports = db
