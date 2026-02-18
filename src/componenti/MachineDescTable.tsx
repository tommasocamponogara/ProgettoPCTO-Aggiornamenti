import type { Machine } from '../Types/Type'
import { getLastTelemetry } from '../utils/getLastTelemetry'

type MachineDescTableProp = {
  machine: Machine
}

export function MachineDescTable({ machine }: MachineDescTableProp) {
  const lastTelemetr = getLastTelemetry({ machine })

  // Costruiamo la lista solo se machine esiste
  const machineDetails: [string, string | undefined][] = [
    ['ID#', machine.id],
    ['Linea', machine.lineId],
    ['Nome', machine.name],
    ['Tipologia', machine.type],
    // Usiamo l'Optional Chaining ?. per sicurezza
    // Modifica la riga dell'ordine e dei PLC così:
    ['Produttore', machine.plc?.vendor || 'N/D'],
    ['Modello', machine.plc?.model || 'N/D'],
    ['Ordine', machine.order !== undefined ? String(machine.order) : 'N/D'],
    ['Stato Attuale', lastTelemetr?.reported.state],
  ]

  return (
    <div className="max-w-md w-full flex justify-center items-center overflow-hidden rounded-lg shadow-lg shadow-black/40 bg-slate-900 text-slate-200 font-mono">
      <table className="w-full border-collapse">
        <tbody>
          {machineDetails.map(([label, value]) => (
            <tr key={label} className="hover:bg-slate-800 transition-colors">
              <td className="px-6 py-3 font-semibold bg-slate-700 text-slate-100 w-36 text-sm">
                {label}
              </td>
              <td className="px-6 py-3 text-sm">{value || 'N/D'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
