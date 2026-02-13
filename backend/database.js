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
        order INTEGER)
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
        plc_model TEXT,
        order INTEGER,
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
  db.run()
})
