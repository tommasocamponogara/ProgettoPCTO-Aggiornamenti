/**
 * In questo file viene gestita la pagina principale degli allarmi.
 * Funge da centro di controllo: scarica dal server tutte le segnalazioni
 * urgenti (telemetrie critiche) e le mostra all'utente attraverso i componenti della pagina.
 */

import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { Widget_Alarms } from '../componenti/Widget_Alarms'

export default function Dashboard() {
  /**
   * Stato locale:
   * Viene creato uno spazio in memoria per conservare i segnali (telemetrie)
   * che contengono errori o guasti.
   */
  const [segnaliCritici, setSegnaliCritici] = useState([])

  /**
   * Recupero dei dati:
   * Non appena la pagina viene aperta, viene inviata una richiesta al server.
   * Si richiede specificamente l'indirizzo "/telemetries/critical" per scaricare
   * solo i dati che hanno problemi, evitando di caricare quelli inutili.
   */
  useEffect(() => {
    // Si interroga il server per avere la lista dei guasti
    fetch('http://localhost:3000/telemetries/critical')
      .then((risposta) => risposta.json())
      .then((dati) => {
        // I dati ricevuti vengono salvati nello stato per mostrarli a video
        setSegnaliCritici(dati)
      })
      .catch((errore) => {
        console.error('Errore nel recupero dei segnali critici:', errore)
      })
  }, []) // Le parentesi vuote indicano di farlo solo una volta all'apertura

  return (
    <>
      {/* Vengono inseriti i componenti della barra laterale e superiore */}
      <Sidebar />
      <Topbar />

      {/**
       * Visualizzazione:
       * I segnali scaricati vengono passati al "Widget_Alarms", che è il componente
       * che si occupa di disegnare la tabella degli allarmi che abbiamo visto.
       */}
      <Widget_Alarms telemetries={segnaliCritici} />
    </>
  )
}
