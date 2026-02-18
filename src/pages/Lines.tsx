import { useState, useEffect } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { TableLines } from '../componenti/TableLines'
import { Topbar } from '../componenti/Topbar'
import type { Line } from '../Types/Type'
import { getLines } from '../utils/api'
import { Notification } from '../componenti/ToastNotification'

export default function Lines() {
  // Stato per le linee (anche se qui viene usato solo per il trigger del caricamento)
  const [, setLines] = useState<Line[]>([])

  useEffect(() => {
    // Caricamento iniziale dei dati delle linee
    getLines().then((lines) => setLines(lines))
  }, [])

  return (
    <>
      <Sidebar />
      <Topbar />
      <Notification />
      {/* Componente tabella che visualizzerà i dati delle linee */}
      <TableLines />
    </>
  )
}
