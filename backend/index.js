const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

// Si importano i file esterni per gestire il database e la creazione automatica dei dati
const db = require('./database.js')
const generatore = require('./telemetriesGenerator')

app.use(cors())
app.use(express.json())

// Si avvia il server e si fa partire il generatore di dati automatici
// Esegue in backend sempre a meno di comando specifico di stop
app.listen(port, () => {
  console.log(`Server avviato sulla porta ${port}`)
  generatore.start()
})

// --- GESTIONE DELLE LINEE DI PRODUZIONE ---

/**
 * Si recuperano tutte le linee dal database.
 */
app.get('/lines', (req, res) => {
  const sql = `SELECT id_line AS id, name, description, order_nr AS "order" FROM lines`
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Errore nel caricamento linee' })
    res.json(rows)
  })
})

/**
 * Si cerca una singola linea specifica usando il suo codice ID.
 */
app.get('/lines/:id', (req, res) => {
  db.get('SELECT * FROM lines WHERE id_line = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Errore nella ricerca' })
    if (!row) return res.status(404).json({ message: 'Linea non trovata' })
    res.json(row)
  })
})

/**
 * Si aggiunge una nuova linea nel database con i dati inviati dal form.
 */
app.post('/lines', (req, res) => {
  const { id_line, name, description, order_nr } = req.body
  db.run(
    `INSERT INTO lines (id_line, name, description, order_nr) VALUES (?, ?, ?, ?)`,
    [id_line, name, description, order_nr],
    (err) => {
      if (err) return res.status(500).json({ error: 'Errore nel salvataggio' })
      res.status(201).json({ message: 'Linea creata' })
    },
  )
})

/**
 * Si modificano i dati di una linea già esistente.
 */
app.put('/lines/:id', (req, res) => {
  const { name, description, order_nr } = req.body
  db.run(
    `UPDATE lines SET name = ?, description = ?, order_nr = ? WHERE id_line = ?`,
    [name, description, order_nr, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: "Errore nell'aggiornamento" })
      res.status(200).json({ message: 'Linea modificata' })
    },
  )
})

/**
 * Si cancella una linea dal database.
 */
app.delete('/lines/:id', (req, res) => {
  db.run(`DELETE FROM lines WHERE id_line = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'Errore nella cancellazione' })
    res.status(200).json({ message: 'Linea eliminata' })
  })
})

// --- GESTIONE DEI MACCHINARI ---

/**
 * Si recuperano tutti i macchinari e si "incollano" le ultime 10 telemetrie ricevute per ognuno.
 */
app.get('/machines', (req, res) => {
  // Si dice al browser di non salvare i vecchi dati (cache) per avere sempre quelli nuovi
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  db.all(`SELECT * FROM machines`, (err, machines) => {
    if (err) return res.status(500).json({ error: err.message })

    db.all(`SELECT * FROM telemetries ORDER BY ts DESC`, (err, allTelemetrie) => {
      if (err) return res.status(500).json({ error: err.message })

      // Si organizza la lista finale: per ogni macchina si filtrano i suoi segnali
      const datiFinali = machines.map((m) => {
        const mId = String(m.id_machine || m.id || '').trim()

        const segnaliFiltrati = allTelemetrie
          .filter((t) => String(t.id_machine).trim() === mId)
          .slice(0, 10) // Si tengono solo le 10 telemetrie più recenti

        return {
          id: mId,
          name: m.name,
          lineId: m.id_line || 'L-01',
          type: m.type,
          telemetries: segnaliFiltrati,
        }
      })
      res.json(datiFinali)
    })
  })
})

app.get('/machines/:id', (req, res) => {
  db.get('SELECT * FROM machines WHERE id_machine = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Errore nella ricerca' })
    if (!row) return res.status(404).json({ message: 'Macchinario non trovato' })
    res.json(row)
  })
})

/**
 * Si aggiunge un nuovo macchinario.
 * Vengono scelti automaticamente i sensori giusti per ogni macchinario.
 */
app.post('/machines', (req, res) => {
  const { id, name, type, plc, lineId, order } = req.body

  const modelliSensori = {
    CNC: ['rpm', 'temperature', 'tool_wear'],
    PRESS: ['pressure', 'temperature', 'hydraulic_level'],
    PACKER: ['speed', 'package_count'],
    ROBOT: ['joint_angle', 'speed'],
    QC: ['camera_status', 'accuracy_rate'],
  }

  const sensoriScelti = modelliSensori[type] || ['status', 'temperature']

  db.run(
    `INSERT INTO machines (id_machine, name, type, plc_vendor, plc_model, order_nr, id_line, dataCollection) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, type, plc?.vendor, plc?.model, order || 0, lineId, JSON.stringify(sensoriScelti)],
    (err) => {
      if (err) return res.status(500).json({ error: 'Errore creazione macchina' })
      res.status(201).json({ message: 'Macchinario creato' })
    },
  )
})

/**
 * Si modificano i dati di un macchinario già esistente.
 */
app.put('/machines/:id', (req, res) => {
  const machineId = req.params.id
  const { name, type, plc, lineId, order } = req.body

  db.run(
    `UPDATE machines
     SET name = ?, type = ?, plc = ?, lineId = ?, "order" = ?
     WHERE id = ?`,
    [name, type, plc, lineId, order, machineId],
    function (err) {
      if (err) return res.status(500).json({ error: "Errore nell'aggiornamento" })
      if (this.changes === 0) return res.status(404).json({ error: 'Macchinario non trovato' })
      res.status(200).json({ message: 'Macchinario modificato' })
    },
  )
})

/**
 * Si cancella un macchinario dal database.
 */
app.delete('/machines/:id', (req, res) => {
  db.run(`DELETE FROM machines WHERE id_machine = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'Errore nella cancellazione' })
    res.status(200).json({ message: 'Macchinario eliminato' })
  })
})

// --- GESTIONE DEI SEGNALI (TELEMETRIE) ---

/**
 * Si visualizza la lista di tutti i segnali registrati, dai più nuovi ai più vecchi.
 */
app.get('/telemetries', (req, res) => {
  db.all('SELECT * FROM telemetries ORDER BY ts DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Errore lettura segnali' })
    res.json(rows)
  })
})

/**
 * Si estraggono solo i segnali critici (quelli con stato FAULT o STOP).
 * Si trasforma il testo dei sensori in formato JSON.
 */
app.get('/telemetries/critical', (req, res) => {
  const sql = `SELECT * FROM telemetries WHERE state IN ('FAULT', 'STOP') ORDER BY ts DESC`
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })

    const segnaliFormattati = rows.map((row) => ({
      ts: row.ts,
      id_machine: row.id_machine,
      state: row.state,
      sensors: row.data ? JSON.parse(row.data) : {},
      alarms: row.alarms ? JSON.parse(row.alarms) : [],
    }))
    res.json(segnaliFormattati)
  })
})

/**
 * Si controlla il generatore: si può avviare o fermare.
 * Se viene fermato, vengono eliminate le telemetries dal database.
 */
app.get('/telemetries-generator/:comando', (req, res) => {
  const { comando } = req.params

  if (comando === 'start') {
    generatore.start()
    res.json({ status: 'avviato' })
  } else {
    generatore.stop()
    db.run(`DELETE FROM telemetries`, (err) => {
      if (err) return res.status(500).json({ message: 'Errore pulizia dati' })
      res.json({ status: 'fermato e pulito' })
    })
  }
})
