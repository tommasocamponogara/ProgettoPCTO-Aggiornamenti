/**
 * In questo file viene gestita la pagina principale di monitoraggio dei macchinari.
 * Si occupa di recuperare la lista di tutte le macchine e di aggiornare i dati
 * automaticamente ogni 5 secondi, in modo da mostrare sempre le informazioni più recenti.
 */

import { useEffect, useState } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { Widget_Machines } from '../componenti/Widget_Machine'
import { getMachines } from '../utils/api'
import type { Machine } from '../Types/Type'

export default function Machines() {
  /**
   * Stato locale:
   * Viene creato uno spazio in memoria per conservare l'elenco dei macchinari.
   */
  const [listaMacchine, setListaMacchine] = useState<Machine[]>([])

  /**
   * Funzione di aggiornamento:
   * Viene effettuata una chiamata al server per ottenere i dati aggiornati.
   * I nuovi dati vengono salvati nello stato per attivare l'aggiornamento visivo della pagina.
   */
  const aggiornaDati = () => {
    getMachines()
      .then((dati) => {
        // Si crea una copia dei dati per essere sicuri che React si accorga del cambiamento
        setListaMacchine([...dati])
      })
      .catch((err) => console.error('Errore durante il recupero dei dati:', err))
  }

  /**
   * Gestione del tempo (Polling):
   * Quando la pagina viene aperta, i dati vengono caricati subito.
   * Viene poi impostato un timer che ripete l'aggiornamento ogni 5000 millisecondi (5 secondi).
   */
  // Nel componente che contiene <Widget_Machines />
  useEffect(() => {
    const fetchDati = () => {
      getMachines().then((res) => setListaMacchine(res))
    }

    fetchDati() // Carica subito
    const interval = setInterval(fetchDati, 5000) // Aggiorna ogni 5 secondi

    return () => clearInterval(interval)
  }, [])
  return (
    <>
      {/* Vengono inseriti i componenti fissi della struttura (menu laterale e barra superiore) */}
      <Sidebar />
      <Topbar />

      {/**
       * Visualizzazione:
       * La lista delle macchine viene passata al componente "Widget_Machines",
       * che si occuperà di disegnarle graficamente sullo schermo.
       */}
      <Widget_Machines machines={listaMacchine} />
    </>
  )
}
