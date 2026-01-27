import type { Machine, Telemetry } from '../Types/Type'
type WidgetMachineProps = { machines: Machine[] }
type PrintedMachine = {
  machinesId: string
  name: string
  state: string
  order: number
  lastUpdate: Telemetry['reported']['alarms']
}

export function Widget_Machines({ machines }: WidgetMachineProps) {
  const printedMachines: PrintedMachine[] = []

  machines.forEach((machine) => {
    const telemetries = machine.telemetries

    telemetries.sort((a, b) => {
      return Date.parse(b.ts) - Date.parse(a.ts)
    })

    const lastTelemetry = telemetries[0]

    printedMachines.push({
      machinesId: machine.id,
      name: machine.name,
      state: lastTelemetry ? lastTelemetry.reported.state : 'N/D',
      order: machine.order,
      lastUpdate: lastTelemetry ? lastTelemetry.reported.alarms : [],
    })
  })

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800">
      <div className="w-11/12 max-w-6xl mt-20">
        <div className="grid grid-cols-[110px_250px_260px_100px_300px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-sm font-semibold text-center rounded border-b border-slate-700">
          <div>ID#</div>
          <div>NOME</div>
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

          {printedMachines.map((machine, index) => (
            <div
              key={index}
              className={`grid grid-cols-[110px_240px_260px_100px_300px] border-l-4 text-center gap-4 items-center px-6 py-4 rounded-lg bg-slate-900
                ${
                  machine.state === 'RUN'
                    ? 'bg-slate-900 border-green-500 hover:bg-green-900'
                    : machine.state === 'IDLE'
                      ? 'bg-slate-900 border-yellow-600 hover:bg-yellow-800'
                      : 'bg-slate-900 border-red-600 hover:bg-red-800'
                }
                `}
            >
              <div className="text-slate-200 font-semibold truncate">{machine.machinesId}</div>
              <div className="text-slate-200 font-semibold">{machine.name}</div>
              <div className="text-slate-200 font-semibold">{machine.state}</div>
              <div className="text-slate-200 font-semibold">{machine.order}</div>
              <div className="text-slate-400 text-sm space-y-1">
                {machine.lastUpdate.map((alarm, index) => (
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
