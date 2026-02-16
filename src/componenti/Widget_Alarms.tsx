import React from 'react'

// Definiamo il tipo per il singolo allarme che visualizzeremo nella riga
type AlarmItem = {
  machineId: string
  errorMess: string
  errorNumb: string
  lock: boolean
  date: Date
  details: any // Qui salviamo i sensori (RPM, Temp) per usarli se serve
}

// Il componente riceve "telemetries" che è l'array di oggetti formattati da index.js
export function Widget_Alarms({ telemetries }: { telemetries: any[] }) {
  const alarmList: AlarmItem[] = []

  telemetries.forEach((t) => {
    // Verifichiamo che ci siano allarmi nell'array
    if (t.alarms && Array.isArray(t.alarms)) {
      t.alarms.forEach((picked_alarm: any) => {
        alarmList.push({
          machineId: t.id_machine,
          errorMess: picked_alarm.message,
          errorNumb: picked_alarm.code,
          lock: picked_alarm.locking,
          date: new Date(t.ts),
          details: t.sensors, // Passiamo i sensori (es. t.sensors.temperature)
        })
      })
    }
  })

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800 font-mono">
      <div className="w-11/12 max-w-6xl mt-20">
        {/* INTESTAZIONE TABELLA*/}
        <div className="grid grid-cols-[150px_100px_250px_150px_150px_120px_80px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-sm font-bold rounded-t border-b border-slate-700">
          <div>MACCHINA</div>
          <div>CODICE</div>
          <div>MESSAGGIO</div>
          <div>DATA</div>
          <div>ORA</div>
          <div>VALORI</div>
          <div>STATO</div>
        </div>

        <div className="max-h-150 overflow-y-auto space-y-2 bg-slate-900 p-2 rounded-b-lg">
          {alarmList.length === 0 ? (
            <div className="text-center text-slate-400 p-6">NESSUN ALLARME ATTIVO</div>
          ) : (
            alarmList.map((alarm, index) => (
              <div
                key={index}
                className={`grid grid-cols-[150px_100px_250px_150px_150px_120px_80px] gap-4 items-center px-6 py-4 rounded border-l-4 transition-all ${
                  alarm.lock
                    ? 'border-red-500 bg-slate-800 hover:bg-red-950'
                    : 'border-yellow-500 bg-slate-800 hover:bg-amber-900'
                }`}
              >
                <div className="text-slate-200 font-bold uppercase">{alarm.machineId}</div>
                <div className="text-slate-400">{alarm.errorNumb}</div>
                <div className="text-slate-200 text-sm">{alarm.errorMess}</div>
                <div className="text-slate-300">{alarm.date.toLocaleDateString()}</div>
                <div className="text-slate-300 font-light">{alarm.date.toLocaleTimeString()}</div>

                {/* Visualizzazione dinamica dei sensori (es: Temp o RPM) */}
                <div className="text-amber-500 text-xs italic">
                  {alarm.details.temperature ? `${alarm.details.temperature}°C ` : ''}
                  {alarm.details.rpm ? `${alarm.details.rpm} RPM` : ''}
                </div>

                <div className="flex justify-center">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-black ${
                      alarm.lock ? 'bg-red-600 text-white' : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {alarm.lock ? 'BLOCK' : 'WARN'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
