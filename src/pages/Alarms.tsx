import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Machine } from '../Types/Type'
import { getMachines } from '../utils/api'
import { Widget_Alarms } from '../componenti/Widget_Alarms'

export default function Dashboard() {
  // Stato per memorizzare la lista delle macchine ottenute dall'API
  const [telemetries, setTelemetries] = useState([])

  useEffect(() => {
    // Esempio di chiamata diretta alla tua nuova API
    fetch('http://localhost:3000/telemetries/critical')
      .then((res) => res.json())
      .then((data) => setTelemetries(data))
  }, [])

  return (
    <>
      {/* Componenti di navigazione dell'interfaccia */}
      <Sidebar />
      <Topbar />
      {/* Widget che mostra gli allarmi passando la lista delle macchine come proprietà */}
      <Widget_Alarms telemetries={telemetries} />
    </>
  )
}
