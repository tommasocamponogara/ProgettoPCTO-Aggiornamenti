import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { Widget_Machines } from '../componenti/Widget_Machine'
import { getMachines } from '../utils/api'
import type { Machine } from '../Types/Type'

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([])

  useEffect(() => {
    getMachines().then((machines) => setMachines(machines))
    //setMachines(SetStatus({ telemetries, lines }))
  }, [])
  return (
    <>
      <Sidebar />
      <Topbar />
      <Widget_Machines machines={machines} />
    </>
  )
}
