import { useNavigate } from 'react-router-dom'
import type { Machine, Telemetry } from '../Types/Type'
import { useState } from 'react'
type WidgetMachineProps = { machines: Machine[] }
type PrintedMachine = {
  machinesId: string
  lineId: string
  name: string
  state: string
  order: Telemetry['reported']['orderCode']
  lastUpdate: Telemetry['reported']['alarms']
}

export function Widget_Machines({ machines }: WidgetMachineProps) {
  const [order, setOrder] = useState<'' | 'IdMachine' | 'IdLine'>('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  var printedMachines: PrintedMachine[] = []

  machines.forEach((machine) => {
    const telemetries = machine.telemetries

    telemetries.sort((a, b) => {
      return Date.parse(b.ts) - Date.parse(a.ts)
    })

    const lastTelemetry = telemetries[0]

    printedMachines.push({
      machinesId: machine.id,
      lineId: machine.lineId,
      name: machine.name,
      state: lastTelemetry ? lastTelemetry.reported.state : 'N/D',
      order: lastTelemetry ? lastTelemetry.reported.orderCode : '',
      lastUpdate: lastTelemetry ? lastTelemetry.reported.alarms : [],
    })
  })
  if (order === 'IdMachine') {
    printedMachines = printedMachines.filter((machine) =>
      machine.machinesId.includes(search.toLocaleLowerCase()),
    )
  }
  if (order === 'IdLine') {
    printedMachines = printedMachines.filter((machine) =>
      machine.lineId.includes(search.toLocaleLowerCase()),
    )
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800">
      <div className="w-11/12 max-w-7xl mt-20">
        <div className="flex gap-4 mb-6 items-center">
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as typeof order)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 
               focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
               hover:border-amber-400 transition-all duration-200"
          >
            <option value="">MOSTRA TUTTI</option>
            <option value="IdMachine">ID MACCHINARIO</option>
            <option value="IdLine">ID LINEA</option>
          </select>

          <input
            type="text"
            placeholder="Cerca..."
            value={search}
            disabled={order === ''}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 w-64
               placeholder:text-slate-500
               focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
               hover:border-amber-400 transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-[110px_270px_100px_260px_100px_300px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-sm font-semibold text-center rounded border-b border-slate-700">
          <div>ID#</div>
          <div>NOME</div>
          <div>LINEA</div>
          <div>STATO</div>
          <div>ORDINE</div>
          <div>ULTIMO AGGIORNAMENTO</div>
        </div>

        <div className="max-h-150 overflow-y-auto space-y-2 bg-slate-800 p-2 rounded-b-lg">
          {printedMachines.length === 0 && (
            <div className="text-center text-slate-400 p-6 border border-slate-700 rounded-lg bg-slate-900">
              NESSUN MACCHINARIO PRESENTE
            </div>
          )}

          {printedMachines.map((machinetoprint, index) => (
            <div
              key={index}
              className={`hover:bg-slate-800 transition-colors shadow-lg shadow-black/40 grid grid-cols-[110px_260px_100px_260px_100px_300px] border-l-4 text-center gap-4 items-center px-6 py-4 rounded-lg bg-slate-900
                ${
                  machinetoprint.state === 'RUN'
                    ? 'bg-slate-900 border-green-500 '
                    : machinetoprint.state === 'IDLE'
                      ? 'bg-slate-900 border-yellow-600'
                      : 'bg-slate-900 border-red-600 '
                }
                `}
            >
              <div
                onClick={() =>
                  navigate(`${machines[index].id}`, {
                    state: { machine: machines[index] },
                  })
                }
                className="text-slate-200 font-semibold truncate hover:cursor-pointer hover:text-amber-400"
              >
                {machinetoprint.machinesId}
              </div>
              <div className="text-slate-200 font-semibold">{machinetoprint.name}</div>
              <div className="text-slate-200 font-semibold">{machinetoprint.lineId}</div>
              <div className="text-slate-200 font-semibold">{machinetoprint.state}</div>
              <div className="text-slate-200 font-semibold">{machinetoprint.order}</div>
              <div className="text-slate-400 text-sm space-y-1">
                {machinetoprint.lastUpdate.map((alarm, index) => (
                  <div key={index} className="flex items-center justify-center gap-1">
                    <span className="text-red-400">•</span>
                    <span className="font-semibold">{alarm.message}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
