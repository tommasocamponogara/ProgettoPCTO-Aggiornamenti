import { useLocation } from 'react-router-dom'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { LineSynoptic } from './LineSynoptic'
import { LegendSinoptic } from '../componenti/LegendSinoptic'
import { getLine } from '../utils/api'
import { useEffect, useState } from 'react'
import type { Line } from '../Types/Type'

export function LineDescription() {
  // Hook per accedere alle informazioni dell'URL corrente
  const location = useLocation()
  // Estrae l'ID della linea prendendo l'ultima parte dell'indirizzo URL
  const lineId = location.pathname.split('/').pop()

  // Stato per memorizzare i dati della singola linea selezionata
  const [line, setLine] = useState<Line>()

  // Effetto che si attiva ogni volta che l'ID della linea cambia
  useEffect(() => {
    if (lineId) {
      // Chiama l'API per ottenere i dettagli della linea specifica
      getLine(lineId).then((l) => setLine(l))
    }
  }, [lineId])

  return (
    <>
      <Sidebar />
      <Topbar />
      {/* Mostra il sinottico della linea solo se i dati della linea sono stati caricati */}
      {line && <LineSynoptic lineName={line.name} machines={line.machines} line={line} />}
      <LegendSinoptic />
    </>
  )
}
