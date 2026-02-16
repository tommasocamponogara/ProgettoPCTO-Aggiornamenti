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
  // Stati per gestire il criterio di ordinamento/filtro e il testo cercato
  const [order, setOrder] = useState<'' | 'IdMachine' | 'IdLine'>('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  var printedMachines: PrintedMachine[] = []

  // Prepara i dati da stampare prendendo l'ultima telemetria per ogni macchina
  machines.forEach((machine) => {
    const telemetries = [...machine.telemetries].sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts))
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

  // Applica i filtri in base alla selezione dell'utente
  if (order === 'IdMachine') {
    printedMachines = printedMachines.filter((machine) =>
      machine.machinesId.toLowerCase().includes(search.toLowerCase()),
    )
  }
  if (order === 'IdLine') {
    printedMachines = printedMachines.filter((machine) =>
      machine.lineId.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800 font-mono ">
      <div className="w-11/12 max-w-7xl mt-20">
        {/* Controlli di Filtro e Ricerca */}
        <div className="flex gap-4 mb-6 items-center">
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as typeof order)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 hover:border-amber-400 transition-all duration-200"
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
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 w-64 placeholder:text-slate-500 hover:border-amber-400 transition-all duration-200"
          />
        </div>
        <button
          className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors"
          onClick={() => navigate('/dashboard/machines/ManageMachines')}
        >
          Aggiungi Macchinario
        </button>

        {/* Intestazione Tabella */}
        <div className="grid grid-cols-[110px_270px_100px_260px_100px_300px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-lg font-semibold text-center rounded border-b border-slate-700">
          <div>ID#</div>
          <div>NOME</div>
          <div>LINEA</div>
          <div>STATO</div>
          <div>ORDINE</div>
          <div>ULTIMO AGGIORNAMENTO</div>
        </div>

        {/* Lista Macchine */}
        <div className="max-h-150 overflow-y-auto space-y-2 bg-slate-800 p-2 rounded-b-lg">
          {printedMachines.length === 0 && (
            <div className="text-center text-slate-400 p-6 border border-slate-700 rounded-lg bg-slate-900">
              NESSUN MACCHINARIO PRESENTE
            </div>
          )}

          {printedMachines.map((machinetoprint, index) => (
            <div
              key={index}
              className={`hover:bg-slate-800 transition-colors shadow-lg shadow-black/40 grid grid-cols-[110px_260px_100px_260px_100px_300px] border-l-4 text-center gap-4 items-center px-6 py-4 rounded-lg bg-slate-900 ${machinetoprint.state === 'RUN' ? 'border-green-500' : machinetoprint.state === 'IDLE' ? 'border-yellow-600' : 'border-red-600'}`}
            >
              <div
                onClick={() =>
                  navigate(`${machinetoprint.machinesId}`, {
                    state: { machine: machines.find((m) => m.id === machinetoprint.machinesId) },
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
                {machinetoprint.lastUpdate.map((alarm, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-1">
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
