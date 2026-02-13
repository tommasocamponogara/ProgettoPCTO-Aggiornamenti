const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
const port = 4000
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/lines', (req, res) => {
  res.send(database.lines)
})

app.get('/lines/:id', (req, res) => {
  const id = req.params.id
  const line = database.lines.find((l) => l.id == id)
  if (!line) {
    res.status(404).send({ error: 'Linea non trovata' })
  }
  res.send(line)
})

app.post('/lines', (req, res) => {
  const body = req.body
  const esisteGia = database.lines.find((linea) => linea.id === body.id)
  if (esisteGia) {
    res.status(400).send({ error: 'Linea con questo ID già esistente' })
    return
  }
  database.lines.push({
    id: body.id,
    name: body.name,
    description: body.description,
    order: body.order,
  })
})

app.put('/lines/:id', (req, res) => {
  const id = req.params.id
  const body = req.body
  const line = database.lines.find((l) => l.id == id)
  line.name = body.name
  line.description = body.description

  // TODO: modifica la linea e la restituisce
})

app.delete('/lines/:id', (req, res) => {
  const id = req.params.id
  const lineIndex = database.lines.findIndex((l) => l.id == id)
  if (lineIndex === -1) {
    res.status(404).send({ error: 'Linea non trovata' })
  }
  database.lines.splice(lineIndex, 1)
  res.send({ message: 'Linea eliminata con successo' })
  // TODO: elimina la linea
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const database = {
  machines: [
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
    {
      id: 'press-03',
      lineId: 'line-2',
      name: 'Pressa Idraulica 03',
      type: 'PRESS',
      plc: {
        vendor: 'Siemens',
        model: 'S7-1500',
      },
      order: 10,
    },
  ],
  lines: [
    {
      id: 'line-1',
      name: 'Linea 1 - Assemblaggio',
      description: 'Linea di assemblaggio demo',
      order: 1,
    },
    {
      id: 'line-2',
      name: 'Linea 2 - Verniciatura',
      description: 'Linea di verniciatura demo',
      order: 2,
    },
  ],
  telemetries: [
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
      ts: '2026-01-28T09:22:30Z',
      reported: {
        state: 'STOP',
        orderCode: '2590002',
        speed: 0,
        temperature: 40.9,
        alarms: [
          {
            code: '9000',
            message: 'Perdita comunicazione PACKER',
            locking: true,
          },
        ],
      },
    },
    {
      machineId: 'press-03',
      type: 'QC',
      ts: '2026-01-07T09:22:25Z',
      reported: {
        state: 'FAULT',
        orderCode: '2590002',
        partsChecked: 1883,
        rejectRate: 0.012,
        alarms: [
          {
            code: '9000',
            message: 'Perdita comunicazione PACKER',
            locking: true,
          },
        ],
      },
    },
    {
      machineId: 'press-03',
      type: 'QC',
      ts: '2026-01-30T22:28:25Z',
      reported: {
        state: 'FAULT',
        orderCode: '2590002',
        partsChecked: 1883,
        rejectRate: 0.012,
        alarms: [
          {
            code: '9000',
            message: 'Perdita comunicazione PACKER',
            locking: true,
          },
        ],
      },
    },
  ],
}
