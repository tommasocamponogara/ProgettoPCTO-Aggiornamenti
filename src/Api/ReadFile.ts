import express from 'express'
import fs from 'fs/promises'

const app = express()
const PORT = 3000

app.get('/factory-state', async (req, res) => {
  try {
    const [machines, lines, telemetries] = await Promise.all([
      fs.readFile('../database/machines.json', 'utf-8'),
      fs.readFile('../database/lines.json', 'utf-8'),
      fs.readFile('./', 'utf-8'),
    ])
    res.json({
      machines: JSON.parse(machines),
      lines: JSON.parse(lines),
      telemetries: JSON.parse(telemetries),
    })
  } catch (errore) {
    res.status(500).send('Errore del server')
  }
})

app.listen(PORT, () => console.log('Server avviato su ${PORT}'))
