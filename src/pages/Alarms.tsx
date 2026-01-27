import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Machine } from '../Types/Type'
import { getMachines } from '../utils/api'
import { Widget_Alarms } from '../componenti/Widget_Alarms'

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([])

  useEffect(() => {
    getMachines().then((machines) => setMachines(machines))
    //setMachines(SetStatus({ telemetries, lines }))
  }, [])
  return (
    <>
      <Sidebar />
      <Topbar />
      <Widget_Alarms machines={machines} />
    </>
  )
}
