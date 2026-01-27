import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { data } from 'react-router-dom'
import type { Line, Machine, Telemetry } from '../Types/Type'
import { getLines, getMachines, getTelemetries } from '../utils/api'
import { Widget_Dashboard } from '../componenti/Widget_Dashboard'
import { getDetailsLineMachine } from '../utils/getDetailsLineMachine'

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [telemetries, setTelemetries] = useState<Telemetry[]>([])

  useEffect(() => {
    getMachines().then((machines) => setMachines(machines))
    getLines().then((lines) => setLines(lines))
    getTelemetries().then((telemetries) => setTelemetries(telemetries))
    //setMachines(SetStatus({ telemetries, lines }))
  }, [])

  return (
    <>
      <Sidebar />
      <Topbar />
      <Widget_Dashboard lines={lines} telemetries={telemetries} />
    </>
  )
}
