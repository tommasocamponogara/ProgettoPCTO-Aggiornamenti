/**
  Dashboard()
  Tiene in stato lines e telemetries.
    Dentro useEffect definisce aggiornaDashboard() che ricarica dati da API.
    Esegue subito un fetch iniziale.
    Avvia polling ogni 5 secondi.
    Cleanup: clearInterval(timer) quando esci dalla pagina.
 */

import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Line, Telemetry } from '../Types/Type'
import { getLines, getTelemetries } from '../utils/api'
import { Widget_Dashboard } from '../componenti/Widget_Dashboard'
import { Notification } from '../componenti/ToastNotification'

export default function Dashboard() {
  // Stati per gestire i diversi set di dati necessari alla dashboard
  const [lines, setLines] = useState<Line[]>([])
  const [telemetries, setTelemetries] = useState<Telemetry[]>([])

  // Effetto per popolare tutti i dati all'avvio del componente
  useEffect(() => {
    // Funzione unica per aggiornare i dati
    const aggiornaDashboard = () => {
      getLines().then((lines) => setLines(lines))
      getTelemetries().then((telemetries) => setTelemetries(telemetries))
    }

    // Primo caricamento
    aggiornaDashboard()

    // Polling ogni secondo
    const timer = setInterval(aggiornaDashboard, 1000)

    // Pulizia timer quando il componente si smonta
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Sidebar />
      <Topbar />
      <Notification />
      {/* Widget principale che riceve le linee e le telemetrie per la visualizzazione */}
      <Widget_Dashboard lines={lines} telemetries={telemetries} />
    </>
  )
}
