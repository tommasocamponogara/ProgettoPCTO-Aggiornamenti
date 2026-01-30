import { useNavigate } from 'react-router-dom'
import type { Line, Telemetry } from '../Types/Type'

type WidgetDashboardProps = {
  lines: Line[]
  telemetries: Telemetry[]
}

export function Widget_Dashboard({ lines, telemetries }: WidgetDashboardProps) {
  const n_macchinari = lines.reduce((acc, line) => acc + line.machines.length, 0)
  const navigate = useNavigate()

  const listaconta: string[] = []
  for (const telemetry of telemetries) {
    if (telemetry.reported.alarms.length !== 0 && !listaconta.includes(telemetry.machineId)) {
      listaconta.push(telemetry.machineId)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800 font-mono font-semi">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-7xl px-10">
        <div
          onClick={() => navigate(`/dashboard/linee`)}
          className="bg-slate-900 border-b-4 border-amber-700 rounded-2xl p-10 text-center shadow-lg shadow-black/40 hover:scale-[1.05] hover:cursor-pointer transition-transform"
        >
          <p className="text-slate-300 uppercase tracking-widest text-lg">Linee</p>
          <div className="w-16 h-1 bg-amber-600 mx-auto my-4 rounded-full" />
          <p className="text-8xl font-extrabold text-amber-600">{lines.length}</p>
        </div>

        <div
          onClick={() => navigate(`/dashboard/macchinari`)}
          className="bg-slate-900 border-b-4 border-amber-700 rounded-2xl p-10 text-center shadow-lg shadow-black/40 hover:scale-[1.05] hover:cursor-pointer transition-transform"
        >
          <p className="text-slate-300 uppercase tracking-widest text-lg">Macchinari</p>
          <div className="w-16 h-1 bg-amber-600 mx-auto my-4 rounded-full" />
          <p className="text-8xl font-extrabold text-amber-600">{n_macchinari}</p>
        </div>

        <div
          onClick={() => navigate(`/dashboard/allarmi`)}
          className={`bg-slate-900 border-b-4 ${listaconta.length > 0 ? 'border-red-500' : 'border-green-500'} rounded-2xl p-10 text-center shadow-lg shadow-black/40 hover:scale-[1.05] hover:cursor-pointer transition-transform`}
        >
          <p className="text-slate-300 uppercase tracking-widest text-lg">Macchinari in allarme</p>
          <div
            className={`w-16 h-1  mx-auto my-4 rounded-full ${listaconta.length > 0 ? 'border-red-500 bg-red-500' : 'border-green-500 bg-green-500'}`}
          />
          <p
            className={`text-8xl font-extrabold ${listaconta.length > 0 ? 'text-red-600' : 'text-green-600'}`}
          >
            {listaconta.length}
          </p>
        </div>
      </div>
    </div>
  )
}
