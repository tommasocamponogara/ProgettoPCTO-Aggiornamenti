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

// Dati
const LINES = [
  {
    id: 'line-1',
    name: 'Linea 1 - Assemblaggio',
    description: 'Linea di assemblaggio demo',
    order: 1,
  },
]

const MACHINES = [
  {
    id: 'press-01',
    lineId: 'line-1',
    name: 'Pressa Idraulica 01',
    type: 'PRESS',
    plc: {
      vendor: 'Siemens',
      model: 'S7-1500',
    },
    order: 10,
  },
  {
    id: 'robot-01',
    lineId: 'line-1',
    name: 'Robot Manipolatore 01',
    type: 'ROBOT',
    plc: {
      vendor: 'ABB',
      model: 'IRC5',
    },
    order: 20,
  },
  {
    id: 'cnc-01',
    lineId: 'line-1',
    name: 'Centro di Lavoro CNC 01',
    type: 'CNC',
    plc: {
      vendor: 'Fanuc',
      model: 'Series 0i-MF',
    },
    order: 30,
  },
  {
    id: 'qc-01',
    lineId: 'line-1',
    name: 'Stazione Controllo Qualità',
    type: 'QC',
    plc: {
      vendor: 'Beckhoff',
      model: 'CX2040',
    },
    order: 40,
  },
  {
    id: 'packer-01',
    lineId: 'line-1',
    name: 'Imballatrice Automatica',
    type: 'PACKER',
    plc: {
      vendor: 'Siemens',
      model: 'S7-1200',
    },
    order: 50,
  },
]

const TELEMETRIES = [
  {
    machineId: 'press-01',
    type: 'PRESS',
    ts: '2026-01-07T09:20:15Z',
    reported: {
      state: 'IDLE',
      orderCode: '2590002',
      temperature: 63.8,
      pressure: 94.1,
      alarms: [],
    },
  },
  {
    machineId: 'robot-01',
    type: 'ROBOT',
    ts: '2026-01-07T09:20:18Z',
    reported: {
      state: 'IDLE',
      orderCode: '2590012',
      cicleTime: 842,
      alarms: [
        {
          code: '512',
          message: 'Riduzione velocita asse 4',
          locking: false,
        },
      ],
    },
  },
  {
    machineId: 'cnc-01',
    type: 'CNC',
    ts: '2026-01-07T09:20:22Z',
    reported: {
      state: 'RUN',
      orderCode: '2570002',
      rpm: 5000,
      temperature: 78.6,
      alarms: [],
    },
  },
  {
    machineId: 'qc-01',
    type: 'QC',
    ts: '2026-01-07T09:20:25Z',
    reported: {
      state: 'RUN',
      orderCode: '2590002',
      partsChecked: 1830,
      rejectRate: 0.012,
      alarms: [],
    },
  },
  {
    machineId: 'packer-01',
    type: 'PACKER',
    ts: '2026-01-07T09:20:30Z',
    reported: {
      state: 'STOP',
      orderCode: '2590002',
      speed: 0,
      temperature: 41.3,
      alarms: [
        {
          code: '104',
          message: 'Mancanza film imballo',
          locking: true,
        },
      ],
    },
  },
  {
    machineId: 'press-01',
    type: 'PRESS',
    ts: '2026-01-07T09:21:15Z',
    reported: {
      state: 'RUN',
      orderCode: '2590002',
      temperature: 64.6,
      pressure: 96.7,
      alarms: [],
    },
  },
  {
    machineId: 'robot-01',
    type: 'ROBOT',
    ts: '2026-01-07T09:21:18Z',
    reported: {
      state: 'RUN',
      orderCode: '2590012',
      cicleTime: 818,
      alarms: [],
    },
  },
  {
    machineId: 'cnc-01',
    type: 'CNC',
    ts: '2026-01-07T09:21:22Z',
    reported: {
      state: 'FAULT',
      orderCode: '2570002',
      rpm: 0,
      temperature: 92.4,
      alarms: [
        {
          code: '3001',
          message: 'Sovratemperatura mandrino',
          locking: true,
        },
      ],
    },
  },
  {
    machineId: 'qc-01',
    type: 'QC',
    ts: '2026-01-07T09:21:25Z',
    reported: {
      state: 'RUN',
      orderCode: '2590002',
      partsChecked: 1856,
      rejectRate: 0.013,
      alarms: [
        {
          code: '220',
          message: 'Soglia scarti in aumento',
          locking: false,
        },
      ],
    },
  },
  {
    machineId: 'packer-01',
    type: 'PACKER',
    ts: '2026-01-07T09:21:30Z',
    reported: {
      state: 'STOP',
      orderCode: '2590002',
      speed: 0,
      temperature: 41.1,
      alarms: [
        {
          code: '104',
          message: 'Mancanza film imballo',
          locking: true,
        },
      ],
    },
  },
  {
    machineId: 'press-01',
    type: 'PRESS',
    ts: '2026-01-07T09:22:15Z',
    reported: {
      state: 'RUN',
      orderCode: '2590002',
      temperature: 65.2,
      pressure: 97.9,
      alarms: [],
    },
  },
  {
    machineId: 'robot-01',
    type: 'ROBOT',
    ts: '2026-01-07T09:22:18Z',
    reported: {
      state: 'RUN',
      orderCode: '2590012',
      cicleTime: 835,
      alarms: [],
    },
  },
  {
    machineId: 'cnc-01',
    type: 'CNC',
    ts: '2026-01-07T09:22:22Z',
    reported: {
      state: 'OFFLINE',
      orderCode: '2570002',
      rpm: 0,
      temperature: null,
      alarms: [
        {
          code: '9000',
          message: 'Perdita comunicazione PLC',
          locking: true,
        },
      ],
    },
  },
  {
    machineId: 'qc-01',
    type: 'QC',
    ts: '2026-01-07T09:22:25Z',
    reported: {
      state: 'RUN',
      orderCode: '2590002',
      partsChecked: 1883,
      rejectRate: 0.012,
      alarms: [],
    },
  },
  {
    machineId: 'packer-01',
    type: 'PACKER',
    ts: '2026-01-07T09:22:30Z',
    reported: {
      state: 'IDLE',
      orderCode: '2590002',
      speed: 0,
      temperature: 40.9,
      alarms: [],
    },
  },
]
