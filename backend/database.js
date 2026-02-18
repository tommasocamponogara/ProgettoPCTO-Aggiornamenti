/**
 * Modulo di persistenza dati basato su SQLite3.
 * Configurato per gestire gli errori basati sul TIPO di macchinario.
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
 */
db.serialize(() => {
  // 1. Tabella 'lines'
  db.run(`CREATE TABLE IF NOT EXISTS lines (
        id_line TEXT PRIMARY KEY, 
        name TEXT, 
        description TEXT, 
        order_nr INTEGER)`)

  // 2. Tabella 'machines'
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

  // 3. Tabella 'telemetries'
  db.run(`CREATE TABLE IF NOT EXISTS telemetries (
        ts TEXT, 
        id_machine TEXT,
        state TEXT, 
        orderCode TEXT,
        data TEXT, 
        alarms TEXT, 
        PRIMARY KEY (ts, id_machine),
        FOREIGN KEY (id_machine) REFERENCES machines(id_machine))`)

  // 4. Tabella 'errors' - MODIFICATA: rimosso il vincolo FOREIGN KEY per permettere l'uso dei TIPI
  db.run(
    `CREATE TABLE IF NOT EXISTS errors (
        code TEXT, 
        type_machine TEXT, 
        message TEXT, 
        PRIMARY KEY (code, type_machine))`,
    (err) => {
      if (!err) {
        console.log('Schema errors inizializzato. Esecuzione seeding...')
        popolaDatiDefault()
      }
    },
  )
})

function popolaDatiDefault() {
  db.serialize(() => {
    // 1. Inserimento Linea
    db.run(`INSERT OR IGNORE INTO lines VALUES ('Line-1', 'Main Line', 'Linea Principale', 1)`)

    // 2. Configurazione Macchine (ID specifici)
    const listaMacchine = [
      [
        'Press-01',
        'Pressa Idraulica',
        'PRESS',
        'Siemens',
        JSON.stringify(['temperature', 'pressure']),
        'S7-1500',
        10,
        'Line-1',
      ],
      [
        'Cnc-01',
        'Tornio CNC',
        'CNC',
        'Fanuc',
        JSON.stringify(['rpm', 'temperature']),
        'Series 0i',
        20,
        'Line-1',
      ],
      [
        'Robot-01',
        'Robot ABB',
        'ROBOT',
        'ABB',
        JSON.stringify(['speed', 'partsChecked']),
        'IRC5',
        30,
        'Line-1',
      ],
      [
        'Packer-01',
        'Imballatrice Automatica',
        'PACKER',
        'Siemens',
        JSON.stringify(['speed', 'temperature']),
        'S7-1200',
        40,
        'Line-1',
      ],
      [
        'Qc-01',
        'Stazione Controllo Qualità',
        'QC',
        'Beckhoff',
        JSON.stringify(['partsChecked', 'speed']),
        'CX2040',
        50,
        'Line-1',
      ],
    ]

    const inserisciM = db.prepare(`INSERT OR IGNORE INTO machines VALUES (?,?,?,?,?,?,?,?)`)
    listaMacchine.forEach((m) => inserisciM.run(m))
    inserisciM.finalize()

    // 3. Lista degli errori basata sul TIPO (10 per ogni tipo)
    const listaErrori = [
      // Errori per tipo PRESS
      ['E01', 'PRESS', 'Pressione Sotto Soglia'],
      ['E02', 'PRESS', 'Surriscaldamento Circuito Idraulico'],
      ['E03', 'PRESS', 'Livello Olio Insufficiente'],
      ['E04', 'PRESS', 'Usura Guarnizione Pistone'],
      ['E05', 'PRESS', 'Ciclo di Compressione Incompleto'],
      ['E06', 'PRESS', 'Anomalia Valvola di Sfiato'],
      ['E07', 'PRESS', 'Guasto Sensore di Tonnellaggio'],
      ['E08', 'PRESS', 'Interruzione Alimentazione Elettrica'],
      ['E09', 'PRESS', 'Barriera di Sicurezza Interrotta'],
      ['E10', 'PRESS', 'Sovraccarico Motore Pompa'],

      // Errori per tipo CNC
      ['E01', 'CNC', 'Usura Utensile Rilevata'],
      ['E02', 'CNC', 'Errore Posizionamento Asse'],
      ['E03', 'CNC', 'Flusso Refrigerante Assente'],
      ['E04', 'CNC', 'Velocità Rotazione Incoerente'],
      ['E05', 'CNC', 'Malfunzionamento Cambio Utensile'],
      ['E06', 'CNC', 'Vibrazioni Oltre Limite'],
      ['E07', 'CNC', 'Blocco Porta Operatore'],
      ['E08', 'CNC', 'Errore Lettura File Programma'],
      ['E09', 'CNC', 'Temperatura Mandrino Critica'],
      ['E10', 'CNC', 'Raggiungimento Fine Corsa'],

      // Errori per tipo ROBOT
      ['E01', 'ROBOT', 'Collisione Rilevata'],
      ['E02', 'ROBOT', 'Errore Encoder Giunto'],
      ['E03', 'ROBOT', 'Timeout Comunicazione Controller'],
      ['E04', 'ROBOT', 'Batteria Tampone Scarica'],
      ['E05', 'ROBOT', 'Carico Utile Eccessivo'],
      ['E06', 'ROBOT', 'Singolarità Cinematica Raggiunta'],
      ['E07', 'ROBOT', 'Perdita Pressione Pinza'],
      ['E08', 'ROBOT', 'Area di Lavoro Ostruita'],
      ['E09', 'ROBOT', 'Errore Sincronizzazione Assi'],
      ['E10', 'ROBOT', 'Arresto di Emergenza Attivo'],

      // Errori per tipo PACKER
      ['E01', 'PACKER', 'Inceppamento Materiale Imballo'],
      ['E02', 'PACKER', 'Esaurimento Scorte Magazzino'],
      ['E03', 'PACKER', 'Mancata Formazione Scatola'],
      ['E04', 'PACKER', 'Temperatura Saldatrice Bassa'],
      ['E05', 'PACKER', 'Errore Lettura Codice a Barre'],
      ['E06', 'PACKER', 'Sfasamento Nastro Trasportatore'],
      ['E07', 'PACKER', 'Errore Sistema di Etichettatura'],
      ['E08', 'PACKER', 'Surriscaldamento Motore Traino'],
      ['E09', 'PACKER', 'Sensore Presenza Prodotto Guasto'],
      ['E10', 'PACKER', 'Protezione Mobile Aperta'],

      // Errori per tipo QC
      ['E01', 'QC', 'Ottica Sensore Oscurata'],
      ['E02', 'QC', 'Illuminazione Ispezione Insufficiente'],
      ['E03', 'QC', 'Errore Elaborazione Immagine'],
      ['E04', 'QC', 'Mancata Corrispondenza Master'],
      ['E05', 'QC', 'Scostamento Tolleranza Dimensionale'],
      ['E06', 'QC', 'Cadenza Produttiva Troppo Alta'],
      ['E07', 'QC', 'Attuatore Scarto Bloccato'],
      ['E08', 'QC', 'Errore Trigger Esterno'],
      ['E09', 'QC', 'Disconnessione Server Qualità'],
      ['E10', 'QC', 'Errore Bilancia di Precisione'],
    ]

    // 4. Inserimento Errori
    const inserisciE = db.prepare(
      `INSERT OR IGNORE INTO errors (code, type_machine, message) VALUES (?, ?, ?)`,
    )
    listaErrori.forEach((err) => inserisciE.run(err))
    inserisciE.finalize()

    console.log('Salvataggio completato: 50 errori inseriti per categoria.')
  })
}

module.exports = db
