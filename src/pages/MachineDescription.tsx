/**
 *
 * NON FUNZIONA, DA SISTEMARE
 * In questo file viene gestita la pagina di dettaglio di ogni singolo macchinario.
 * Si occupa di mostrare l'immagine della macchina, le sue specifiche tecniche
 * e la lista di tutti i segnali (telemetrie) ricevuti.
 */

import { useLocation } from 'react-router-dom'
import { MachineImg } from '../componenti/MachineImg'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Machine } from '../Types/Type'
import { MachineDescTable } from '../componenti/MachineDescTable'
import { MachineTelemetries } from '../componenti/MachineTelemetries'

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
  const macchina: Machine = posizione.state?.machine

  return (
    <div className="min-h-screen flex bg-slate-800 text-slate-200">
      {/* Viene inserita la barra di navigazione laterale */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Viene inserita la barra di navigazione superiore */}
        <Topbar />

        {/**
         * STRUTTURA DELLA PAGINA (Sistema a tre colonne):
         * Le informazioni vengono organizzate in tre blocchi verticali per una lettura chiara.
         */}
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
      </div>
    </div>
  )
}
