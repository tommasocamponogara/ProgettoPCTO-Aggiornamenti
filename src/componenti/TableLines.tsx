import { useEffect, useState } from 'react'
import { getLines } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import type { Line } from '../Types/Type'
import { getDetailsLineMachine } from '../utils/getDetailsLineMachine'
import { ManageLines } from '../pages/ManageLines'
import { deleteLine } from '../pages/ManageLines'

// Componente che mostra una tabella con le linee di produzione (cioe quando l'utente clicca su linee nella sidebar, viene mostrata una tabella con tutte le linee presenti nel database)

export function TableLines() {
  const navigate = useNavigate()
  // Crea un array vuoto di oggetti di tipo Line e un funzione per aggiornarlo
  const [lines, setLines] = useState<Line[]>([])

  // Al caricamento recupera le linee per avere i dati aggiornati dal database
  useEffect(() => {
    // Quando il componente viene montato, chiama la funzione getLines presente in API.ts, per recuperare le linee di produzione dal database, per poi aggiornare lo stato del componente
    getLines().then((lines) => setLines(lines))
  }, [lines])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800 w-full font-mono">
      <div className="max-h-[70vh] overflow-y-auto w-3/4 max-w-5xl rounded-lg shadow-lg shadow-black/40">
        <button
          onClick={() => navigate('/dashboard/lines/ManageLines')}
          className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors"
        >
          Aggiungi Linea
        </button>
        <table className="w-full border-collapse">
          <thead className="bg-amber-700 text-slate-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-center text-lg font-semibold uppercase tracking-wider">
                ID#
              </th>
              <th className="px-6 py-4 text-center text-lg font-semibold uppercase tracking-wider">
                Linea
              </th>
              <th className="px-6 py-4 text-center text-lg font-semibold uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-4 text-center text-lg font-semibold uppercase tracking-wider">
                N. Macchine
              </th>
              <th className="px-6 py-4 text-center text-lg font-semibold uppercase tracking-wider">
                Descrizione
              </th>
              <th className="px-6 py-4 text-center text-lg font-semibold uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>

          <tbody className="bg-slate-900 text-slate-200 divide-y divide-slate-700 text-center">
            {lines.map((line) => {
              // Per ogni linea di produzione recupera il numero di allarmi attivi per quella linea (grazie alla funzione numbersOfAlarms definita in getDetailsLineMachine)
              // Calcola il numero di allarmi attivi per ogni singola linea
              const { numbersOfAlarms } = getDetailsLineMachine()
              const lineNumberAlarms = numbersOfAlarms(line.machines)
              return (
                <tr key={line.id} className="hover:bg-slate-800 transition-colors">
                  <td
                    className="px-6 py-4 hover:cursor-pointer hover:text-amber-400"
                    onClick={() => navigate(`${line.id}`)}
                  >
                    {'#' + line.id}
                  </td>
                  <td className="px-6 py-4">{line.name}</td>
                  <td className="px-6 py-4">
                    {/* Badge colorato in base allo stato della linea */}
                    <span
                      className={`inline-flex items-center justify-center w-25 h-6 rounded-full text-xs font-semibold ${
                        line.status === 'positive'
                          ? 'bg-green-500 text-slate-900'
                          : line.status === 'wait'
                            ? 'bg-amber-500 text-slate-900'
                            : 'bg-red-500 text-slate-900'
                      }`}
                    >
                      {line.status === 'positive'
                        ? `Attiva (${lineNumberAlarms})`
                        : line.status === 'wait'
                          ? `Attesa (${lineNumberAlarms})`
                          : `Bloccata (${lineNumberAlarms})`}
                    </span>
                  </td>
                  <td className="px-6 py-4">{line.machines.length}</td>

                  <td className="px-6 py-4 max-w-xs truncate" title={line.description}>
                    {line.description}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/lines/ManageLines/${line.id}`)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => deleteLine(line.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
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
