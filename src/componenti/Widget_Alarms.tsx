import type { Machine } from '../Types/Type'

// Parte di codice riferita a Widget_Alarms, componente che mostra la lista degli allarmi
// attivi sulle macchine, ordinati per data e ora di attivazione

type WidgetAlarmsProps = { machines: Machine[] }
type Alarm = {
  machinesId: string
  errorMess: string
  errorNumb: string
  lock: boolean
  date: Date
}

export function Widget_Alarms({ machines }: WidgetAlarmsProps) {
  const alarmList: Alarm[] = []

  // Estrae tutti gli allarmi nidificati all'interno delle telemetrie di ogni macchina
  machines.forEach((machine) => {
    machine.telemetries.forEach((telemetry) => {
      telemetry.reported.alarms.forEach((picked_alarm) => {
        alarmList.push({
          machinesId: telemetry.machineId,
          errorMess: picked_alarm.message,
          errorNumb: picked_alarm.code,
          lock: picked_alarm.locking,
          date: new Date(telemetry.ts),
        })
      })
    })
  })

  // Ordina gli allarmi in ordine cronologico decrescente
  const alarmListOrdinata = alarmList.sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800 font-mono">
      <div className="w-11/12 max-w-6xl mt-20">
        <div className="grid grid-cols-[150px_150px_282px_195px_163px_50px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-lg font-semibold rounded border-b border-slate-700">
          <div>MACCHINA</div>
          <div>CODICE</div>
          <div>MESSAGGIO</div>
          <div>DATA</div>
          <div>ORA</div>
          <div>STATO</div>
        </div>

        <div className="max-h-150 overflow-y-auto space-y-2 bg-slate-800 p-2 rounded-b-lg">
          {alarmList.length === 0 && (
            <div className="text-center text-slate-400 p-6 border border-slate-700 rounded-lg bg-slate-900">
              NESSUN ALLARME ATTIVO
            </div>
          )}

          {alarmListOrdinata.map((alarm, index) => (
            <div
              key={index}
              className={`grid grid-cols-[150px_100px_300px_200px_175px_50px] gap-4 items-center px-6 py-4 rounded-lg border-l-4 transition ${alarm.lock ? 'bg-slate-900 border-red-500 hover:bg-red-900' : 'bg-slate-900 border-yellow-600 hover:bg-amber-800'}`}
            >
              <div className="text-slate-200 font-semibold truncate">{alarm.machinesId}</div>
              <div className="text-slate-200 font-semibold">{alarm.errorNumb}</div>
              <div className="text-slate-200 font-semibold break-word">{alarm.errorMess}</div>
              <div className="text-slate-200 font-semibold break-word">
                {alarm.date.toLocaleDateString()}
              </div>
              <div className="text-slate-200 font-semibold break-word">
                {alarm.date.toLocaleTimeString()}
              </div>
              <div className="flex justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${alarm.lock ? 'bg-red-600 text-white' : 'bg-yellow-500 text-white'}`}
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
