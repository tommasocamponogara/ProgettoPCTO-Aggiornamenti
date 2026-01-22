import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/sidebar'
import { Topbar } from '../componenti/Topbar'
import { data } from 'react-router-dom'

type Machine = {
  id: String
  lineId: String
  name: String
  type: String
  plc: {
    vendor: String
    model: String
  }
  order: Number
}

type Line = {
  id: String
  name: String
  description: String
  order: Number
}

type Telemetry = {
  machineId: String
  type: String
  ts: String
  reported: {
    state: String
    orderCode: String
    temperature: Number
    pressure: Number
    alarms:
      | [
          {
            code: String
            message: String
            locking: Boolean
          },
        ]
      | []
  }
}

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [telemetries, setTelemetries] = useState<Telemetry[]>([])

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/machines').then((res) => res.json()),
      fetch('http://localhost:3000/lines').then((res) => res.json()),
      fetch('http://localhost:3000/telemetries').then((res) => res.json()),
    ])
      .then(([machinesData, linesData, telemetriesData]) => {
        setMachines(machinesData)
        setLines(linesData)
        setTelemetries(telemetriesData)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <>
      <Sidebar />
      <Topbar />
      <div className="flex">
        <div className="m-90">
          <h3>Macchine</h3>
          <p>Numero macchine:</p>
          {machines.length}
        </div>

        <div className="m-90">
          <h3>Linee</h3>
          <p>Numero linee:</p>
          {lines.length}
        </div>

        <div className="m-90">
          <h3>Telemetrie</h3>
          <p>Numero dati raccolti:</p>
          {telemetries.length}
        </div>
      </div>
    </>
  )
}
