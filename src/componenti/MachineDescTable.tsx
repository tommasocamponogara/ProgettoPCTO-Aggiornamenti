import type { Machine } from '../Types/Type'
import { getLastTelemetry } from '../utils/getLastTelemetry'

type MachineDescTableProp = {
  machine: Machine
}

export function MachineDescTable({ machine }: MachineDescTableProp) {
  // Ottiene l'ultimo stato registrato per la macchina
  const lastTelemetr = getLastTelemetry({ machine })

  // Organizza i dati in una struttura a coppie [etichetta, valore]
  const machineDetails: [string, string | undefined][] = [
    ['ID#', machine.id],
    ['Linea', machine.lineId],
    ['Nome', machine.name],
    ['Tipologia', machine.type],
    ['Produttore', machine.plc.vendor],
    ['Modello', machine.plc.model],
    ['Stato Attuale', lastTelemetr?.reported.state],
  ]

  return (
    <div className="max-w-md w-full flex justify-center items-center overflow-hidden rounded-lg shadow-lg shadow-black/40 bg-slate-900 text-slate-200 font-mono">
      <table className="w-full border-collapse">
        <tbody>
          {machineDetails.map(([label, value]) => (
            <tr key={label} className="hover:bg-slate-800 transition-colors">
              <td className="px-6 py-3 font-semibold bg-slate-700 text-slate-100 w-36">{label}</td>
              <td className="px-6 py-3">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
