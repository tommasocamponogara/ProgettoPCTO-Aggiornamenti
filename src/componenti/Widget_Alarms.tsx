/**
 * In questo file viene gestita la tabella degli allarmi.
 * Il componente analizza tutti i segnali (telemetrie) ricevuti e, se trova dei guasti,
 * li mostra in una lista ordinata per data e ora, evidenziando quelli più gravi.
 */

import React from 'react'

/**
 * Si definisce come è fatto un singolo allarme nella lista.
 */
type AlarmItem = {
  machineId: string // Quale macchina ha il problema
  errorMess: string // Cosa sta succedendo (il messaggio)
  errorNumb: string // Il codice dell'errore (es. E01)
  lock: boolean // Vero se la macchina si è fermata del tutto
  date: Date // Quando è successo
  details: any // I dati dei sensori (es. temperatura) in quel momento
}

/**
 * Componente Widget_Alarms
 * Riceve come "input" la lista di tutte le telemetrie registrate.
 */
export function Widget_Alarms({ telemetries }: { telemetries: any[] }) {
  /**
   * Trasformazione dei dati:
   * Una singola telemetria potrebbe contenere più errori contemporaneamente.
   * Qui si "spacchettano" i dati per creare una lista dove ogni riga è un singolo errore.
   */
  const listaAllarmi: AlarmItem[] = []

  telemetries.forEach((t) => {
    // Si controlla se nella telemetria ci sono allarmi
    if (t.alarms && Array.isArray(t.alarms)) {
      t.alarms.forEach((allarmeSingolo: any) => {
        // Si aggiunge l'errore alla nostra lista "pulita"
        listaAllarmi.push({
          machineId: t.id_machine,
          errorMess: allarmeSingolo.message,
          errorNumb: allarmeSingolo.code,
          lock: allarmeSingolo.locking,
          date: new Date(t.ts),
          details: t.sensors, // Si salvano i valori dei sensori per capire il contesto
        })
      })
    }
  })

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800 font-mono">
      <div className="w-11/12 max-w-6xl mt-20">
        {/* INTESTAZIONE: I titoli delle colonne della tabella */}
        <div className="grid grid-cols-[150px_100px_250px_150px_150px_120px_80px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-sm font-bold rounded-t">
          <div>MACCHINA</div>
          <div>CODICE</div>
          <div>MESSAGGIO</div>
          <div>DATA</div>
          <div>ORA</div>
          <div>VALORI</div>
          <div>STATO</div>
        </div>

        {/* LISTA DEGLI ERRORI: Dove compaiono le righe una sotto l'altra */}
        <div className="max-h-150 overflow-y-auto space-y-2 bg-slate-900 p-2 rounded-b-lg">
          {listaAllarmi.length === 0 ? (
            // Messaggio mostrato se tutto funziona bene
            <div className="text-center text-slate-400 p-6 italic">
              NESSUN ALLARME ATTIVO - TUTTI I SISTEMI SONO OK
            </div>
          ) : (
            listaAllarmi.map((alarm, index) => (
              <div
                key={index}
                className={`grid grid-cols-[150px_100px_250px_150px_150px_120px_80px] gap-4 items-center px-6 py-4 rounded border-l-4 transition-all ${
                  alarm.lock
                    ? 'border-red-500 bg-slate-800 hover:bg-red-950' // Rosso se la macchina è bloccata
                    : 'border-yellow-500 bg-slate-800 hover:bg-amber-900' // Giallo se è solo un avviso
                }`}
              >
                <div className="text-slate-200 font-bold uppercase">{alarm.machineId}</div>
                <div className="text-slate-400">{alarm.errorNumb}</div>
                <div className="text-slate-200 text-sm">{alarm.errorMess}</div>

                {/* Data e Ora formattate in modo leggibile */}
                <div className="text-slate-300">{alarm.date.toLocaleDateString()}</div>
                <div className="text-slate-300 font-light">{alarm.date.toLocaleTimeString()}</div>

                {/* Valori dei sensori al momento del guasto */}
                <div className="text-amber-500 text-xs italic">
                  {alarm.details.temperature ? `${alarm.details.temperature}°C ` : ''}
                  {alarm.details.rpm ? `${alarm.details.rpm} RPM` : ''}
                </div>

                {/* Etichetta di gravità (BLOCK o WARN) */}
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
