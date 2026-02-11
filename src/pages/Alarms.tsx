import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Machine } from '../Types/Type'
import { getMachines } from '../utils/api'
import { Widget_Alarms } from '../componenti/Widget_Alarms'

export default function Dashboard() {
  // Stato per memorizzare la lista delle macchine ottenute dall'API
  const [machines, setMachines] = useState<Machine[]>([])

  // Hook che viene eseguito al caricamento del componente
  useEffect(() => {
    // Recupera i dati delle macchine e aggiorna lo stato
    getMachines().then((machines) => setMachines(machines))
  }, [])

  return (
    <>
      {/* Componenti di navigazione dell'interfaccia */}
      <Sidebar />
      <Topbar />
      {/* Widget che mostra gli allarmi passando la lista delle macchine come proprietà */}
      <Widget_Alarms machines={machines} />
    </>
  )
}
