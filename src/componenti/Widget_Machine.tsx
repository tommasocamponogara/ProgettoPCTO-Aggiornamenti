import { useNavigate } from 'react-router-dom'
import type { Machine } from '../Types/Type'
import { useState, useEffect } from 'react'

type WidgetMachineProps = { machines: Machine[] }

type PrintedMachine = {
  machinesId: string
  lineId: string
  name: string
  state: string
  order: string
  lastUpdate: any[]
  lastTs: string
}

export function Widget_Machines({ machines }: WidgetMachineProps) {
  const [order, setOrder] = useState<'' | 'IdMachine' | 'IdLine'>('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (machines.length > 0) {
      console.log('Dati ricevuti:', machines)
    }
  }, [machines])

  // --- LOGICA DI TRASFORMAZIONE DATI (STANDARD) ---
  const printedMachines: PrintedMachine[] = (machines || []).map((machine) => {
    const rawId = machine.id || (machine as any).id_machine || 'N/D'
    const telemetries = Array.isArray(machine.telemetries) ? machine.telemetries : []

    // Ordiniamo per data decrescente
    const sortedTele = [...telemetries].sort((a, b) => {
      return new Date(b.ts || 0).getTime() - new Date(a.ts || 0).getTime()
    })
    const lastTelemetry = sortedTele[0]

    let parsedAlarms = []
    if (lastTelemetry?.alarms) {
      try {
        parsedAlarms =
          typeof lastTelemetry.alarms === 'string'
            ? JSON.parse(lastTelemetry.alarms)
            : lastTelemetry.alarms
      } catch (e) {
        parsedAlarms = []
      }
    }

    return {
      machinesId: String(rawId).trim(),
      lineId: String(machine.lineId || (machine as any).id_line || 'Senza Linea'),
      name: machine.name || 'Macchina Ignota',
      state: (lastTelemetry?.state || 'OFFLINE').toUpperCase(),
      order: String(lastTelemetry?.orderCode || machine.order || '---'),
      lastUpdate: Array.isArray(parsedAlarms) ? parsedAlarms : [],
      lastTs: lastTelemetry?.ts || '',
    }
  })

  // --- FILTRO RICERCA ---
  const filteredMachines = printedMachines.filter((m) => {
    if (order === 'IdMachine') return m.machinesId.toLowerCase().includes(search.toLowerCase())
    if (order === 'IdLine') return m.lineId.toLowerCase().includes(search.toLowerCase())
    return true
  })

  // --- GESTIONE COLORI ---
  // Restituisce le classi CSS esatte per Bordo e Quadratino in base allo stato
  const getStatusStyles = (state: string) => {
    switch (state) {
      case 'RUN':
        return { border: 'border-green-600', box: 'bg-green-600' }
      case 'IDLE':
        return { border: 'border-orange-500', box: 'bg-orange-500' } // Arancione come richiesto
      case 'STOP':
        return { border: 'border-red-600', box: 'bg-red-600' }
      case 'FAULT':
        return { border: 'border-pink-600', box: 'bg-pink-600' } // Rosa come richiesto
      default:
        return { border: 'border-gray-500', box: 'bg-gray-500' } // OFFLINE/Grigio
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800 font-mono">
      <div className="w-11/12 max-w-7xl mt-20">
        {/* BARRA SUPERIORE (Filtri e Bottone) */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as typeof order)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 outline-none focus:border-amber-500"
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
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 w-64 outline-none focus:border-amber-500"
            />
          </div>

          <button
            className="px-6 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400"
            onClick={() => navigate('/dashboard/machines/ManageMachines')}
          >
            + Aggiungi Macchinario
          </button>
        </div>

        {/* INTESTAZIONE TABELLA */}
        <div className="grid grid-cols-[120px_1fr_120px_150px_180px_250px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-sm font-bold text-center rounded-t-xl shadow-xl">
          <div>ID MACCHINA</div>
          <div>DESCRIZIONE</div>
          <div>LINEA</div>
          <div>STATO</div>
          <div>ORDINE</div>
          <div>DIAGNOSTICA / ALLARMI</div>
        </div>

        {/* CORPO TABELLA */}
        <div className="max-h-[600px] overflow-y-auto bg-slate-900/40 p-2 rounded-b-xl border border-slate-700">
          {filteredMachines.length === 0 ? (
            <div className="text-center text-slate-500 p-12">Nessun dato trovato.</div>
          ) : (
            filteredMachines.map((m, index) => {
              // Recupero lo stile specifico per questa riga
              const styles = getStatusStyles(m.state)

              return (
                <div
                  key={`${m.machinesId}-${index}`}
                  // Qui applico il bordo colorato dinamico e mantengo il "riquadro" scuro
                  className={`grid grid-cols-[120px_1fr_120px_150px_180px_250px] gap-4 items-center px-6 py-4 rounded-lg bg-slate-900/80 mb-2 border-l-4 ${styles.border}`}
                >
                  {/* ID Macchina */}
                  <div
                    onClick={() => navigate(`${m.machinesId}`)}
                    className="text-amber-500 font-bold cursor-pointer hover:underline"
                  >
                    {m.machinesId}
                  </div>

                  <div className="text-slate-100">{m.name}</div>
                  <div className="text-slate-400 text-sm">{m.lineId}</div>

                  {/* STATO: Uso il quadratino colorato come nel tuo esempio */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 border border-slate-500 ${styles.box}`} />
                      <span className="text-sm text-slate-200 font-semibold">{m.state}</span>
                    </div>
                    {/* Timestamp piccolo sotto */}
                    <span className="text-[10px] text-slate-500 mt-1">
                      {m.lastTs ? m.lastTs.split('T')[1]?.split('.')[0] : '--:--:--'}
                    </span>
                  </div>

                  <div className="text-slate-300 text-xs text-center">{m.order}</div>

                  {/* Messaggi di errore o stato */}
                  <div className="text-[11px]">
                    {m.lastUpdate.length > 0 ? (
                      m.lastUpdate.map((alarm: any, idx: number) => (
                        <div key={idx} className="text-red-400 font-bold">
                          ⚠ {String(alarm.message || 'ERRORE').toUpperCase()}
                        </div>
                      ))
                    ) : m.state === 'RUN' ? (
                      <span className="text-green-500 font-bold">OPERATIVO</span>
                    ) : (
                      <span className="text-slate-600 italic">-</span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
