/**
 * In questo file viene gestita la tabella che mostra tutte le linee di produzione.
 * Si occupa di scaricare i dati dal database, mostrare se una linea è attiva o bloccata
 * e fornire i tasti per aggiungere, modificare o eliminare le linee.
 */

import { useEffect, useState } from 'react'
import { getLines } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import type { Line } from '../Types/Type'
import { getDetailsLineMachine } from '../utils/getDetailsLineMachine'
import { deleteLine } from '../pages/ManageLines'

/**
 * Viene creato il componente che visualizza l'elenco delle linee.
 */
export function TableLines() {
  const navigate = useNavigate()

  // Si crea uno spazio in memoria (stato) per conservare la lista delle linee
  const [lines, setLines] = useState<Line[]>([])

  /**
   * Viene attivato il recupero delle linee non appena la pagina si carica.
   * Si usa un array di dipendenze vuoto [] per evitare di chiedere i dati all'infinito.
   */
  useEffect(() => {
    getLines().then((datiRicevuti) => setLines(datiRicevuti))
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800 w-full font-mono">
      <div className="max-h-[70vh] overflow-y-auto w-3/4 max-w-5xl rounded-lg shadow-lg">
        {/* Pulsante per andare alla pagina di creazione di una nuova linea */}
        <button
          onClick={() => navigate('/dashboard/lines/ManageLines')}
          className="px-4 py-2 mb-4 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400"
        >
          + Aggiungi Linea
        </button>

        <table className="w-full border-collapse">
          {/* Intestazione della tabella con i titoli delle colonne */}
          <thead className="bg-amber-700 text-slate-900 sticky top-0">
            <tr>
              <th className="px-6 py-4">ID#</th>
              <th className="px-6 py-4">Linea</th>
              <th className="px-6 py-4">Stato</th>
              <th className="px-6 py-4">N. Macchine</th>
              <th className="px-6 py-4">Descrizione</th>
              <th className="px-6 py-4">Azioni</th>
            </tr>
          </thead>

          {/* Corpo della tabella dove vengono mostrate le righe con i dati */}
          <tbody className="bg-slate-900 text-slate-200 divide-y divide-slate-700 text-center">
            {lines.map((line) => {
              // Si calcola quanti allarmi sono attivi per questa linea
              const { numbersOfAlarms } = getDetailsLineMachine()
              const numeroAllarmi = numbersOfAlarms(line.machines)

              return (
                <tr key={line.id} className="hover:bg-slate-800 transition-colors">
                  {/* Codice ID: cliccando qui si apre il dettaglio della linea */}
                  <td
                    className="px-6 py-4 cursor-pointer hover:text-amber-400"
                    onClick={() => navigate(`${line.id}`)}
                  >
                    {'#' + line.id}
                  </td>

                  <td className="px-6 py-4">{line.name}</td>

                  {/* Badge colorato che cambia in base allo stato della linea */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        line.status === 'positive'
                          ? 'bg-green-500 text-slate-900'
                          : line.status === 'wait'
                            ? 'bg-amber-500 text-slate-900'
                            : 'bg-red-500 text-slate-900'
                      }`}
                    >
                      {line.status === 'positive'
                        ? `Attiva (${numeroAllarmi})`
                        : line.status === 'wait'
                          ? `Attesa (${numeroAllarmi})`
                          : `Bloccata (${numeroAllarmi})`}
                    </span>
                  </td>

                  <td className="px-6 py-4">{line.machines.length}</td>

                  {/* Descrizione: se è troppo lunga viene tagliata con dei puntini (...) */}
                  <td className="px-6 py-4 max-w-xs truncate" title={line.description}>
                    {line.description}
                  </td>

                  {/* Tasti per modificare i dati o eliminare la linea */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/lines/ManageLines/${line.id}`)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => deleteLine(line.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded"
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
