import { useEffect } from 'react'
import { getLines } from '../utils/api'
import { Navigate, useNavigate } from 'react-router-dom'
import type { Line } from '../Types/Type'

type TableLinesProps = {
  lines: Line[]
}

export function TableLines({ lines }: TableLinesProps) {
  const navigate = useNavigate()
  const statusLine = 'wait'
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800">
      <table className="w-3/4 max-w-5xl border-collapse rounded-lg overflow-hidden shadow-lg shadow-black/40">
        <thead className="bg-amber-700 text-slate-900">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              ID#
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              Linea
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              Stato
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              N. Macchine
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
              Descrizione
            </th>
          </tr>
        </thead>

        <tbody className="bg-slate-900 text-slate-200 divide-y divide-slate-700">
          {lines.map((line, index) => (
            <tr key={line.id} className="hover:bg-slate-800 transition-colors">
              <td className="px-6 py-4 hover:cursor-pointer" onClick={() => navigate(`${line.id}`)}>
                {'#' + line.id}
              </td>
              <td className="px-6 py-4">{line.name}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    statusLine === 'positive'
                      ? 'bg-green-500 text-slate-900'
                      : statusLine === 'wait'
                        ? 'bg-amber-500 text-slate-900'
                        : 'bg-red-500 text-slate-900'
                  }`}
                >
                  {statusLine === 'positive'
                    ? 'Attiva'
                    : statusLine === 'wait'
                      ? 'Attesa'
                      : 'Allarme'}
                </span>
              </td>{' '}
              {/* Collegare con lo stato macchinari della linea*/}
              <td className="px-6 py-4">{line.machines.length}</td>
              <td className="px-6 py-4">{line.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
