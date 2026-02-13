const express = require('express')
const app = express()
const port = 3000

const cors = require('cors')
app.use(cors())

const db = require('./database.js')

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Creare/Modificare/Visualizzare/Eliminare le linee
app.get('/lines', (req, res) => {
  // Chiediamo a SQLite di rinominare le colonne solo per questa risposta
  const sql = `
    SELECT 
      id_line AS id, 
      name, 
      description, 
      order_nr AS "order" 
    FROM lines
  `

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante la ricerca: ' + err.message })
    }

    res.json(rows)
  })
})

app.get('/lines/:id', (req, res) => {
  const id = req.params.id
  db.get('SELECT * FROM lines WHERE id_line = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante la ricerca' })
    }
    if (!row) {
      return res.status(404).json({ message: 'Linea non trovata' })
    }
    res.json(row)
  })
})

app.post('/lines', (req, res) => {
  const { id_line, name, description, order_nr } = req.body

  db.run(
    `INSERT INTO lines (
    id_line, 
    name, 
    description, 
    order_nr) 
    VALUES (?, ?, ?, ?)`,
    [id_line, name, description, order_nr],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Errore durante l'inserimento" })
      }
      res.status(201).json({ message: 'Linea creata', id: id_line })
    },
  )
})

app.put('/lines/:id', (req, res) => {
  const id = req.params.id
  const { name, description, order_nr } = req.body

  db.run(
    `UPDATE lines SET name = ?, description = ?, order_nr = ? WHERE id_line = ?`,
    [name, description, order_nr, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Errore durante l'aggiornamento" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Nessuna linea trovata con questo ID' })
      }
      res.status(200).json({ message: 'Linea modificata', id: id })
    },
  )
})

app.delete('/lines/:id', (req, res) => {
  const id = req.params.id

  db.run(`DELETE FROM lines WHERE id_line = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Errore durante l'eliminazione" })
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Nessuna linea trovata con questo ID' })
    }
    res.status(200).json({ message: 'Linea eliminata' })
  })
})

// Creare/Modificare/Visualizzare/Eliminare i macchinari
app.get('/machines', (req, res) => {
  db.all('SELECT * FROM machines', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante la ricerca' })
    } else {
      res.json(rows)
    }
  })
})

app.get('/machines/:id', (req, res) => {
  const id = req.params.id
  db.get('SELECT * FROM machines WHERE id_machine = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante la ricerca' })
    }
    if (!row) {
      return res.status(404).json({ message: 'Macchinario non trovato' })
    }
    res.json(row)
  })
})

app.post('/machines', (req, res) => {
  const { id_machine, name, type, plc_vendor, plc_model, order_nr, id_line } = req.body

  db.run(
    `INSERT INTO machines (
    id_machine, name, type, plc_vendor, plc_model, order_nr, id_line
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id_machine, name, type, plc_vendor, plc_model, order_nr, id_line],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Errore durante l'inserimento" })
      }
      res.status(201).json({ message: 'Macchinario creato', id: id_line })
    },
  )
})

app.put('/machines/:id', (req, res) => {
  const id = req.params.id
  const { name, type, plc_vendor, plc_model, order_nr, id_line } = req.body

  db.run(
    `UPDATE machines SET name = ?, type = ?, plc_vendor = ?, plc_model = ?, order_nr = ?, id_line = ? WHERE id_machine = ?`,
    [name, type, plc_vendor, plc_model, order_nr, id_line, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Errore durante l'aggiornamento" })
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Nessun macchinario trovato con questo ID' })
      }
      res.status(200).json({ message: 'Macchinario modificato', id: id })
    },
  )
})

app.delete('/machines/:id', (req, res) => {
  const id = req.params.id

  db.run(`DELETE FROM machines WHERE id_machine = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Errore durante l'eliminazione" })
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Nessun macchinario trovato con questo ID' })
    }
    res.status(200).json({ message: 'Macchinario eliminato' })
  })
})

// Visualizzare le telemetrie
app.get('/telemetries', (req, res) => {
  db.all('SELECT * FROM telemetries', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Errore durante l'eliminazione" })
    } else {
      res.json(rows)
    }
  })
})
