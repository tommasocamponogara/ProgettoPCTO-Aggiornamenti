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
  const id_machine = req.body.id
  const name = req.body.name
  const type = req.body.type
  const plc_vendor = req.body.plc.vendor
  const plc_model = req.body.plc.model
  const id_line = req.body.id_line
  const order_nr = req.body.order

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
      return res.status(500).json({ error: 'Errore durante la visualizzazione' })
    } else {
      res.json(rows)
    }
  })
})

// Visualizzare telemetrie con allarmi
app.get('/telemetries/critical', (req, res) => {
  const sql = `
    SELECT * FROM telemetries 
    WHERE state = 'FAULT' OR state = 'STOP' 
  `

  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Errore query critiche:', err.message)
      return res.status(500).json({ error: err.message })
    }

    const formattedRows = rows.map((row) => {
      let parsedData = {}
      let parsedAlarms = []

      try {
        parsedData = row.data ? JSON.parse(row.data) : {}

        // Trasforma la stringa JSON della colonna 'alarms' in array
        parsedAlarms = row.alarms ? JSON.parse(row.alarms) : []
      } catch (e) {
        console.error('Errore nel parsing JSON per la macchina:', row.id_machine)
      }

      return {
        ts: row.ts,
        id_machine: row.id_machine,
        state: row.state,
        orderCode: row.orderCode,
        sensors: parsedData, // Contiene RPM, Temperature, ecc.
        alarms: parsedAlarms, // Contiene l'array degli allarmi [{code, message, locking}]
      }
    })

    res.json(formattedRows)
  })
})

// Far partire la registrazione di telemetrie
const generatore = require('./telemetriesGenerator')

app.get('/telemetries-generator/:comando', (req, res) => {
  const { comando } = req.params

  if (comando === 'start') {
    generatore.start()
    res.json({ status: 'running' })
  } else {
    generatore.stop()
    res.json({ status: 'stopped' })
  }
})

// Visualizzare errori
app.get('/errors', (req, res) => {
  db.all('SELECT * FROM errors', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante la visualizzazione' })
    } else {
      res.json(rows)
    }
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
