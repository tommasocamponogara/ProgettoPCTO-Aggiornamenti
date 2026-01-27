import type { Machine } from '../Types/Type'
type WidgetAlarmsProps = { machines: Machine[] }
type Alarm = { machinesId: string; errorMess: string; errorNumb: string; lock: boolean }

export function Widget_Alarms({ machines }: WidgetAlarmsProps) {
  const alarmList: Alarm[] = []

  machines.forEach((machine) => {
    machine.telemetries.forEach((telemetry) => {
      telemetry.reported.alarms.forEach((picked_alarm) => {
        alarmList.push({
          machinesId: telemetry.machineId,
          errorMess: picked_alarm.message,
          errorNumb: picked_alarm.code,
          lock: picked_alarm.locking,
        })
      })
    })
  })

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800">
      <div className="w-11/12 max-w-6xl mt-20">
        {/* HEADER */}
        <div className="grid grid-cols-[150px_115px_1fr_140px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-sm font-semibold rounded border-b border-slate-700">
          <div>MACCHINA</div>
          <div>CODICE</div>
          <div>MESSAGGIO</div>
          <div className="text-center">STATO</div>
        </div>

        {/* SCROLL CONTAINER */}
        <div className="max-h-150 overflow-y-auto space-y-2 bg-slate-800 p-2 rounded-b-lg">
          {alarmList.length === 0 && (
            <div className="text-center text-slate-400 p-6 border border-slate-700 rounded-lg bg-slate-900">
              NESSUN ALLARME ATTIVO
            </div>
          )}

          {alarmList.map((alarm, index) => (
            <div
              key={index}
              className={`grid grid-cols-[150px_100px_1fr_120px] gap-4 items-center px-6 py-4 rounded-lg border-l-4 transition
                ${
                  alarm.lock
                    ? 'bg-slate-900 border-red-500 hover:bg-red-900'
                    : 'bg-slate-900 border-yellow-600 hover:bg-amber-800'
                }
              `}
            >
              {/* Macchina */}
              <div className="text-slate-200 font-semibold truncate">{alarm.machinesId}</div>

              {/* Codice */}
              <div className="text-slate-200 font-semibold">{alarm.errorNumb}</div>

              {/* Messaggio */}
              <div className="text-slate-200 font-semibold break-word">{alarm.errorMess}</div>

              {/* Stato */}
              <div className="text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    alarm.lock ? 'bg-red-600 text-red-100' : 'bg-yellow-500 text-green-100'
                  }`}
                >
                  {alarm.lock ? 'BLOCCATO' : 'ATTIVO'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
