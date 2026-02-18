import { useNavigate } from 'react-router-dom'
import type { Machine } from '../Types/Type'
import { useState } from 'react'
import { deleteMachine } from '../pages/ManageMachines'
import { sendCommand } from '../utils/api' // Assicurati che esista in api.ts

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

  // --- LOGICA DI TRASFORMAZIONE DATI ---
  const printedMachines: PrintedMachine[] = (machines || []).map((machine) => {
    const rawId = machine.id || (machine as any).id_machine || 'N/D'
    const telemetries = Array.isArray(machine.telemetries) ? machine.telemetries : []
    const sortedTele = [...telemetries].sort(
      (a, b) => new Date(b.ts || 0).getTime() - new Date(a.ts || 0).getTime(),
    )
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
      order: String(machine.order),
      lastUpdate: Array.isArray(parsedAlarms) ? parsedAlarms : [],
      lastTs: lastTelemetry?.ts || '',
    }
  })

  const filteredMachines = printedMachines.filter((m) => {
    if (order === 'IdMachine') return m.machinesId.toLowerCase().includes(search.toLowerCase())
    if (order === 'IdLine') return m.lineId.toLowerCase().includes(search.toLowerCase())
    return true
  })

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'RUN':
        return 'bg-green-500'
      case 'IDLE':
        return 'bg-amber-500'
      case 'STOP':
        return 'bg-red-500'
      case 'FAULT':
        return 'bg-pink-600'
      default:
        return 'bg-slate-500'
    }
  }

  // --- LOGICA COMANDI ---
  const handleMachineCommand = async (id: string, cmd: 'START' | 'STOP' | 'RESET') => {
    const success = await sendCommand(id, cmd)
    if (!success) {
      console.error("Errore nell'invio del comando")
    }
    // Nota: il cambio di stato visivo avverrà al prossimo ciclo di polling della Dashboard
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-800 w-full font-mono p-10">
      <div className="w-full max-w-7xl mt-20">
        {/* TOOLBAR */}
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="flex gap-4">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as typeof order)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
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
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            onClick={() => navigate('/dashboard/machines/ManageMachines')}
            className="px-6 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-colors shadow-lg"
          >
            + Aggiungi Macchinario
          </button>
        </div>

        {/* TABELLA */}
        <div className="max-h-[70vh] overflow-y-auto rounded-xl shadow-2xl border border-slate-700">
          <table className="w-full border-collapse">
            <thead className="bg-amber-700 text-slate-900 sticky top-0 z-10">
              <tr className="text-sm uppercase tracking-wider">
                <th className="px-6 py-4 text-left">ID Macchina</th>
                <th className="px-6 py-4 text-left">Descrizione</th>
                <th className="px-6 py-4 text-center">Linea</th>
                <th className="px-6 py-4 text-center">Stato</th>
                <th className="px-6 py-4 text-center">Ordine</th>
                <th className="px-6 py-4 text-left">Diagnostica</th>
                <th className="px-6 py-4 text-center">Azioni</th>
              </tr>
            </thead>

            <tbody className="bg-slate-900 text-slate-200 divide-y divide-slate-800">
              {filteredMachines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    Nessun macchinario trovato.
                  </td>
                </tr>
              ) : (
                filteredMachines.map((m, index) => (
                  <tr
                    key={`${m.machinesId}-${index}`}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* ID */}
                    <td
                      className="px-6 py-4 font-bold text-amber-500 cursor-pointer hover:underline"
                      onClick={() => navigate(`${m.machinesId}`)}
                    >
                      {m.machinesId}
                    </td>

                    {/* NOME */}
                    <td className="px-6 py-4 text-slate-100">{m.name}</td>

                    {/* LINEA */}
                    <td className="px-6 py-4 text-center text-slate-400 text-sm">{m.lineId}</td>

                    {/* STATO */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor(m.state)}`}
                          />
                          <span className="text-xs font-bold uppercase">{m.state}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 lowercase">
                          {m.lastTs ? m.lastTs.split('T')[1]?.split('.')[0] : '--:--:--'}
                        </span>
                      </div>
                    </td>

                    {/* ORDINE */}
                    <td className="px-6 py-4 text-center text-slate-300 font-mono text-xs">
                      {m.order}
                    </td>

                    {/* DIAGNOSTICA */}
                    <td className="px-6 py-4 text-[11px] max-w-[200px]">
                      {m.lastUpdate.length > 0 ? (
                        m.lastUpdate.map((alarm, idx) => (
                          <div key={idx} className="text-red-400 font-bold leading-tight">
                            ⚠ {String(alarm.message || 'ERRORE').toUpperCase()}
                          </div>
                        ))
                      ) : m.state === 'RUN' ? (
                        <span className="text-green-500 font-bold opacity-80 uppercase">
                          Operativo
                        </span>
                      ) : (
                        <span className="text-slate-600 italic">Nessun dato</span>
                      )}
                    </td>

                    {/* AZIONI (COMANDI + GESTIONE) */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-3">
                        {/* BOTTONI DI COMANDO DINAMICI */}
                        <div className="flex justify-center gap-1">
                          {m.state === 'STOP' && (
                            <button
                              onClick={() => handleMachineCommand(m.machinesId, 'START')}
                              className="w-full bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold py-1 px-2 rounded transition-colors"
                            >
                              START
                            </button>
                          )}
                          {m.state === 'RUN' && (
                            <button
                              onClick={() => handleMachineCommand(m.machinesId, 'STOP')}
                              className="w-full bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold py-1 px-2 rounded transition-colors"
                            >
                              STOP
                            </button>
                          )}
                          {m.state === 'FAULT' && (
                            <button
                              onClick={() => handleMachineCommand(m.machinesId, 'RESET')}
                              className="w-full bg-orange-500 hover:bg-orange-400 text-slate-900 text-[10px] font-bold py-1 px-2 rounded transition-colors"
                            >
                              RESET
                            </button>
                          )}
                        </div>

                        {/* BOTTONI MODIFICA/ELIMINA */}
                        <div className="flex justify-center gap-2 border-t border-slate-700 pt-2">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/machines/ManageMachines/${m.machinesId}`)
                            }
                            className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => deleteMachine(m.machinesId)}
                            className="text-red-500 hover:text-red-400 text-xs transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
