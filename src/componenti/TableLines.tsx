import { useEffect } from 'react'
import { getLines } from '../utils/api'
import { Navigate, useNavigate } from 'react-router-dom'
import type { Line } from '../Types/Type'

type TableLinesProps = {
  lines: Line[]
}

export function TableLines({ lines }: TableLinesProps) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800 w-full">
      <div className="max-h-[70vh] overflow-y-auto w-3/4 max-w-5xl rounded-lg shadow-lg shadow-black/40">
        <table className="w-full border-collapse">
          <thead className="bg-amber-700 text-slate-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                ID#
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                Linea
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                N. Macchine
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                Descrizione
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 text-slate-200 divide-y divide-slate-700 text-center">
            {lines.map((line) => (
              <tr key={line.id} className="hover:bg-slate-800 transition-colors">
                <td
                  className="px-6 py-4 hover:cursor-pointer"
                  onClick={() => navigate(`${line.id}`)}
                >
                  {'#' + line.id}
                </td>
                <td className="px-6 py-4">{line.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center justify-center w-20 h-6 rounded-full text-xs font-semibold ${
                      line.status === 'positive'
                        ? 'bg-green-500 text-slate-900'
                        : line.status === 'wait'
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-red-500 text-slate-900'
                    }`}
                  >
                    {line.status === 'positive'
                      ? 'Attiva'
                      : line.status === 'wait'
                        ? 'Attesa'
                        : 'Allarme'}
                  </span>
                </td>
                <td className="px-6 py-4">{line.machines.length}</td>
                <td className="px-6 py-4">{line.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
