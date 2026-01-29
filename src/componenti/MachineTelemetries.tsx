import type { Machine } from '../Types/Type'
import { getLastTelemetry } from '../utils/getLastTelemetry'

type MachineTelemetriesProp = {
  machine: Machine
}

export function MachineTelemetries({ machine }: MachineTelemetriesProp) {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="max-w-4xl w-full overflow-x-auto rounded-lg shadow-lg shadow-black/40">
        <table className="w-full border-collapse">
          <thead className="bg-amber-700 text-slate-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Ora
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Codice Ordine
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Dettaglio
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Segnalazione
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 text-slate-200 divide-y divide-slate-700 text-center">
            {machine.telemetries
              .slice()
              .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
              .map((telemetry, index) => {
                const date = new Date(telemetry.ts)
                const ora = date.toLocaleTimeString('it-IT')
                const data = date.toLocaleDateString('it-IT')
                return (
                  <tr key={index} className="hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4">{ora}</td>
                    <td className="px-6 py-4">{data}</td>
                    <td className="px-6 py-4">{telemetry.reported.state}</td>
                    <td className="px-6 py-4">{telemetry.reported.orderCode}</td>
                    <td className="px-6 py-4">
                      {Object.entries(telemetry.reported ?? {})
                        .filter(([key]) => !['state', 'orderCode', 'alarms'].includes(key))
                        .map(([key, value]) => (
                          <div key={key}>
                            <span className="text-slate-400 mr-1">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                    </td>
                    <td className="px-6 py-4">
                      {telemetry.reported?.alarms.map((details, idx) => (
                        <div key={idx}>
                          {details.code} - {details.message}
                        </div>
                      ))}
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
