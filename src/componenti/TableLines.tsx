import { useEffect, useState } from 'react'
import { getLines } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import type { Line } from '../Types/Type'
import { getDetailsLineMachine } from '../utils/getDetailsLineMachine'

export function TableLines() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([])

  // Al caricamento recupera le linee per avere i dati aggiornati dal database
  useEffect(() => {
    getLines().then((lines) => setLines(lines))
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800 w-full font-mono">
      <div className="max-h-[70vh] overflow-y-auto w-3/4 max-w-5xl rounded-lg shadow-lg shadow-black/40">
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
            </tr>
          </thead>
          <tbody className="bg-slate-900 text-slate-200 divide-y divide-slate-700 text-center">
            {lines.map((line) => {
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
                  <td className="px-6 py-4">{line.description}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
