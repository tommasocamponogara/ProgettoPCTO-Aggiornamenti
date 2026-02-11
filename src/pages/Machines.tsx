import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { Widget_Machines } from '../componenti/Widget_Machine'
import { getMachines } from '../utils/api'
import type { Machine } from '../Types/Type'

export default function Machines() {
  // Stato locale per contenere l'array di macchine
  const [machines, setMachines] = useState<Machine[]>([])

  // Al caricamento, interroga l'API per ottenere tutte le macchine
  useEffect(() => {
    getMachines().then((machines) => setMachines(machines))
  }, [])

  return (
    <>
      <Sidebar />
      <Topbar />
      {/* Visualizza il widget che contiene la griglia o lista delle macchine */}
      <Widget_Machines machines={machines} />
    </>
  )
}
