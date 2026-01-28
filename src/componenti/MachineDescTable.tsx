import type { Machine } from '../Types/Type'

type MachineDescTableProp = {
  machine: Machine
}

export function MachineDescTable({ machine }: MachineDescTableProp) {
  return (
    <div>
      <div className="max-w-4xl mx-auto overflow-x-auto rounded-lg shadow-lg shadow-black/40">
        <table className="w-full border-collapse">
          <thead className="bg-amber-700 text-slate-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                ID#
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Linea
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Tipologia
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Produttore
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Modello
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 text-slate-200 divide-y divide-slate-700 text-center">
            <tr className="hover:bg-slate-800 transition-colors">
              <td className="px-6 py-4">{machine.id}</td>
              <td className="px-6 py-4">{machine.lineId}</td>
              <td className="px-6 py-4">{machine.name}</td>
              <td className="px-6 py-4">{machine.type}</td>
              <td className="px-6 py-4">{machine.plc.vendor}</td>
              <td className="px-6 py-4">{machine.plc.model}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
