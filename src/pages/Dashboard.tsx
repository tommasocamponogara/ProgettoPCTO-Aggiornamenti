import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/sidebar'
import { Topbar } from '../componenti/Topbar'
import { data } from 'react-router-dom'
import type { Line, Machine, Telemetry } from '../Types/Type'
import { getLines, getMachines, getTelemetries } from '../utils/api'

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [telemetries, setTelemetries] = useState<Telemetry[]>([])

  useEffect(() => {
    getMachines().then((machines) => setMachines(machines))
    getLines().then((lines) => setLines(lines))
    getTelemetries().then((telemetries) => setTelemetries(telemetries))
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
