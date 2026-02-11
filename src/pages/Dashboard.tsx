import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Line, Machine, Telemetry } from '../Types/Type'
import { getLines, getMachines, getTelemetries } from '../utils/api'
import { Widget_Dashboard } from '../componenti/Widget_Dashboard'

export default function Dashboard() {
  // Stati per gestire i diversi set di dati necessari alla dashboard
  const [, setMachines] = useState<Machine[]>([]) // Nota: machines non viene usato direttamente qui
  const [lines, setLines] = useState<Line[]>([])
  const [telemetries, setTelemetries] = useState<Telemetry[]>([])

  // Effetto per popolare tutti i dati all'avvio del componente
  useEffect(() => {
    getMachines().then((machines) => setMachines(machines))
    getLines().then((lines) => setLines(lines))
    getTelemetries().then((telemetries) => setTelemetries(telemetries))
  }, [])

  return (
    <>
      <Sidebar />
      <Topbar />
      {/* Widget principale che riceve le linee e le telemetrie per la visualizzazione */}
      <Widget_Dashboard lines={lines} telemetries={telemetries} />
    </>
  )
}
