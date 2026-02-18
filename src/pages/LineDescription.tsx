/**
 * In questo file viene gestita la pagina che mostra i dettagli di una specifica linea.
 * Si occupa di capire quale linea è stata cliccata, scaricare i suoi dati dal server
 * e comporre la pagina unendo i vari pezzi come la barra laterale e il grafico della linea.
 */

import { useParams } from 'react-router-dom'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { LineSynoptic } from './LineSynoptic'
import { LegendSinoptic } from '../componenti/LegendSinoptic'
import { getLine } from '../utils/api'
import { useEffect, useState } from 'react'
import type { Line } from '../Types/Type'
import { Notification } from '../componenti/ToastNotification'

export function LineDescription() {
  /**
   * Si recupera l'indirizzo della pagina per capire quale linea mostrare.
   * Viene preso l'ID della linea (es. "line-1") tramite i parametri della rotta.
   */
  const { lineId } = useParams()

  /**
   * Si crea una variabile di stato per memorizzare i dati della linea.
   * All'inizio è vuota, verrà riempita dopo aver ricevuto risposta dal server.
   */
  const [linea, setLinea] = useState<Line>()

  /**
   * Viene avviata la richiesta dei dati ogni volta che l'ID della linea cambia.
   * Se viene trovato un ID valido, si interroga il database per avere le informazioni complete.
   */
  useEffect(() => {
    // Se non c'è un ID linea valido, non facciamo richieste
    if (!lineId) return

    // Funzione unica che aggiorna i dati della linea
    const aggiornaLinea = () => {
      getLine(lineId).then((datiRicevuti) => setLinea(datiRicevuti))
    }

    // Primo caricamento immediato
    aggiornaLinea()

    // Aggiornamento automatico ogni 5 secondi
    const timer = setInterval(aggiornaLinea, 5000)

    // Pulizia timer quando si esce dalla pagina
    return () => clearInterval(timer)
  }, [lineId])

  return (
    <>
      {/* Vengono mostrate le barre di navigazione fisse (laterale e superiore) oltre che le eventuali modifiche*/}
      <Sidebar />
      <Topbar />
      <Notification />

      {/**
       * Viene mostrato il grafico della linea (Sinottico) solo se i dati sono stati caricati.
       * Se "linea" esiste, si passano i nomi e i macchinari al componente grafico.
       */}
      {linea ? (
        <LineSynoptic lineName={linea.name} machines={linea.machines} line={linea} />
      ) : (
        <div className="text-slate-400 text-center pt-40">Caricamento linea in corso...</div>
      )}

      {/* Viene mostrata la legenda per spiegare il significato dei colori e delle icone */}
      <LegendSinoptic />
    </>
  )
}
