import type { Machine } from '../Types/Type'
import React from 'react'

// Parte di codice riferita a Widget_Alarms, componente che mostra la lista degli allarmi
// attivi sulle macchine, ordinati per data e ora di attivazione

type AlarmItem = {
  id: string
  code: string
  message: string
  isLocking: boolean
  timestamp: Date
}

type WidgetAlarmsProps = {
  telemetries: any[]
}

// 2. Colleghiamo il tipo alle Props usando i due punti :
export function Widget_Alarms({ telemetries }: WidgetAlarmsProps) {
  // 3. Diciamo che alarmList è un array di AlarmItem
  const alarmList: AlarmItem[] = []

  telemetries.forEach((t) => {
    // Aggiungiamo un controllo extra per sicurezza
    if (t.alarms && Array.isArray(t.alarms)) {
      t.alarms.forEach((a) => {
        alarmList.push({
          id: t.id_machine,
          code: a.code,
          message: a.message,
          isLocking: a.locking,
          timestamp: new Date(t.ts),
        })
      })
    }
  })

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800 font-mono">
      <div className="w-11/12 max-w-6xl mt-20">
        {/* INTESTAZIONE TABELLA */}
        <div className="grid grid-cols-[150px_100px_300px_150px_150px_100px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-lg font-semibold rounded-t border-b border-slate-700">
          <div>MACCHINA</div>
          <div>CODICE</div>
          <div>MESSAGGIO</div>
          <div>DATA</div>
          <div>ORA</div>
          <div>STATO</div>
        </div>

        {/* CORPO DELLA TABELLA */}
        <div className="max-h-150 overflow-y-auto space-y-2 bg-slate-900 p-2 rounded-b-lg">
          {alarmList.length === 0 ? (
            <div className="text-center text-slate-400 p-6">NESSUN ALLARME ATTIVO</div>
          ) : (
            alarmList.map((alarm, index) => (
              <div
                key={index}
                className={`grid grid-cols-[150px_100px_300px_150px_150px_100px] gap-4 items-center px-6 py-4 rounded border-l-4 ${
                  alarm.isLocking ? 'border-red-500 bg-slate-800' : 'border-yellow-500 bg-slate-800'
                }`}
              >
                <div className="text-slate-200">{alarm.id}</div>
                <div className="text-slate-400">{alarm.code}</div>
                <div className="text-slate-200">{alarm.message}</div>
                <div className="text-slate-300">{alarm.timestamp.toLocaleDateString()}</div>
                <div className="text-slate-300">{alarm.timestamp.toLocaleTimeString()}</div>

                {/* ETICHETTA STATO */}
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      alarm.isLocking ? 'bg-red-600 text-white' : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {alarm.isLocking ? 'BLOCK' : 'WARN'}
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
