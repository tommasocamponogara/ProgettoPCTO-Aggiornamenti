/**
 * In questo file viene gestita la pagina di dettaglio di ogni singolo macchinario.
 * Si occupa di mostrare l'immagine della macchina, le sue specifiche tecniche
 * e la lista di tutti i segnali (telemetrie) ricevuti.
 */

import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { MachineImg } from '../componenti/MachineImg'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Machine } from '../Types/Type'
import { MachineDescTable } from '../componenti/MachineDescTable'
import { MachineTelemetries } from '../componenti/MachineTelemetries'
import { getMachines } from '../utils/api'
import { Notification } from '../componenti/ToastNotification'

/**
 * Viene creato il componente che organizza i dati della macchina in una vista a tre colonne.
 */
export function MachineDescription() {
  /**
   * Recupero dei dati:
   * Viene prelevato l'oggetto "machine" che è stato passato durante il cambio di pagina.
   * Si assume che i dati siano stati inviati dal componente precedente (es. la lista macchine).
   */
  const posizione = useLocation()
  const { machineId } = useParams()

  // Se la pagina arriva da un click, i dati possono essere già presenti nello "state".
  // Se invece si fa refresh, potrebbe non esserci nulla e allora carichiamo da API.
  const [macchina, setMacchina] = useState<Machine | undefined>(posizione.state?.machine)

  useEffect(() => {
    // Se non c'è un ID valido, non facciamo chiamate inutili
    if (!machineId) return

    // Funzione che ricarica la macchina dal backend
    const aggiornaMacchina = () => {
      getMachines().then((lista) => {
        const trovata = lista.find((m) => m.id === machineId)
        setMacchina(trovata)
      })
    }

    // Primo caricamento immediato
    aggiornaMacchina()

    // Polling ogni secondo per avere telemetrie aggiornate anche nella pagina dettaglio
    const timer = setInterval(aggiornaMacchina, 1000)

    // Pulizia timer quando si esce dalla pagina
    return () => clearInterval(timer)
  }, [machineId])

  return (
    <div className="min-h-screen flex bg-slate-800 text-slate-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <Notification />

        {/**
         * STRUTTURA DELLA PAGINA (Sistema a tre colonne):
         * Le informazioni vengono organizzate in tre blocchi verticali per una lettura chiara.
         */}
        {!macchina ? (
          // Se la macchina non è ancora caricata, si mostra un messaggio semplice.
          <div className="flex justify-center items-center mt-28 h-[calc(100vh-6rem)] text-slate-400">
            Caricamento dati macchina...
          </div>
        ) : (
          <div className="flex justify-center items-center gap-3 p-6 mt-28 h-[calc(100vh-6rem)]">
            {/* COLONNA 1: Viene mostrata l'immagine o l'icona del macchinario */}
            <div className="flex flex-col justify-center items-center w-1/4">
              <MachineImg machine={macchina} />
            </div>

            {/* COLONNA 2: Viene mostrata la tabella con i dati tecnici (Marca, Modello, PLC) */}
            <div className="flex flex-col justify-center items-center w-1/4">
              <MachineDescTable machine={macchina} />
            </div>

            {/* COLONNA 3: Viene mostrato l'elenco dei segnali e degli allarmi.
                Questa parte ha uno scorrimento (scroll) dedicato per non allungare tutta la pagina. */}
            <div className="flex flex-col justify-center items-center max-h-[36rem] overflow-auto">
              <MachineTelemetries machine={macchina} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
