// .verbose() serve a dare messaggi di errore più dettagliati se qualcosa va storto
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./factory.db', (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Connesso al database')
  }
})

db.run('PRAGMA foreign_keys = ON', (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Chiavi esterne attivate')
  }
})

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS lines (
        id_line TEXT PRIMARY KEY, 
        name TEXT, 
        description TEXT, 
        order_nr INTEGER)
    `,
    (err) => {
      if (err) {
        console.error(err.message)
      } else {
        console.log('Tabella lines creata correttamente')
      }
    },
  )
  db.run(
    `CREATE TABLE IF NOT EXISTS machines (
        id_machine TEXT PRIMARY KEY,
        name TEXT,
        type TEXT,
        plc_vendor TEXT,
        dataCollection TEXT,
        plc_model TEXT,
        order_nr INTEGER,
        id_line TEXT,
        FOREIGN KEY (id_line) REFERENCES lines(id_line))
    `,
    (err) => {
      if (err) {
        console.error(err.message)
      } else {
        console.log('Tabella machines creata correttamente')
      }
    },
  )
  db.run(
    `CREATE TABLE IF NOT EXISTS telemetries (
        ts TEXT, id_machine TEXT,
        state TEXT, 
        orderCode TEXT,
        alarms TEXT,
        PRIMARY KEY (ts, id_machine),
        FOREIGN KEY (id_machine) REFERENCES machines(id_machine))
    `,
    (err) => {
      if (err) {
        console.error(err.message)
      } else {
        console.log('Tabella telemetries creata correttamente')
      }
    },
  )
  db.run(
    `CREATE TABLE IF NOT EXISTS errors (
        code TEXT, id_machine TEXT,
        message TEXT, 
        PRIMARY KEY (code, id_machine),
        FOREIGN KEY (id_machine) REFERENCES machines(id_machine))
    `,
    (err) => {
      if (err) {
        console.error(err.message)
      } else {
        console.log('Tabella errors creata correttamente')
      }
    },
  )
})

module.exports = db
