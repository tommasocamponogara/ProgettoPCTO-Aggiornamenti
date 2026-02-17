import { useNavigate } from 'react-router-dom'
import type { Machine } from '../Types/Type'
import { useState, useEffect } from 'react'

/**
 * Si definiscono le proprietà del componente e la forma che i dati
 * devono avere per essere visualizzati correttamente nella tabella.
 */
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

/**
 * Questo componente mostra l'elenco di tutte le macchine in una tabella.
 * Permette di cercare una macchina, vedere se è accesa o spenta e aggiungere nuovi elementi.
 */
export function Widget_Machines({ machines }: WidgetMachineProps) {
  // Si creano gli stati per gestire la ricerca e la categoria del filtro
  const [order, setOrder] = useState<'' | 'IdMachine' | 'IdLine'>('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  /**
   * Viene mostrato un messaggio nella console del browser ogni volta
   * che arrivano nuovi dati dal server, per verificare che tutto funzioni.
   */
  useEffect(() => {
    if (machines.length > 0) {
      console.log('Dati ricevuti:', machines)
    }
  }, [machines])

  /**
   * Si trasforma la lista delle macchine grezze in una lista "pulita".
   * Per ogni macchina si isola l'ultima telemetria ricevuta.
   */
  const printedMachines: PrintedMachine[] = (machines || []).map((machine) => {
    // Si recupera l'ID cercando tra i vari nomi possibili nel database
    const rawId = machine.id || (machine as any).id_machine || 'N/D'

    // Si controlla che l'elenco dei segnali sia un array valido
    const telemetries = Array.isArray(machine.telemetries) ? machine.telemetries : []

    // Si ordinano i segnali dal più recente al più vecchio e si prende il primo (posizione 0)
    const sortedTele = [...telemetries].sort((a, b) => {
      return new Date(b.ts || 0).getTime() - new Date(a.ts || 0).getTime()
    })

    const lastTelemetry = sortedTele[0]

    // Si trasforma il testo degli allarmi in una lista vera e propria
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

    // Viene restituito l'oggetto pronto per essere stampato a schermo
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

  /**
   * Viene applicato il filtro di ricerca.
   * La lista viene accorciata in base a quello che l'utente scrive nella casella di ricerca.
   */
  const filteredMachines = printedMachines.filter((m) => {
    if (order === 'IdMachine') return m.machinesId.toLowerCase().includes(search.toLowerCase())
    if (order === 'IdLine') return m.lineId.toLowerCase().includes(search.toLowerCase())
    return true
  })

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 bg-slate-800 font-mono">
      <div className="w-11/12 max-w-7xl mt-20">
        {/* Barra superiore con il menu a tendina, la ricerca e il tasto per aggiungere */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as typeof order)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2"
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
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-2 w-64"
            />
          </div>

          <button
            className="px-6 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg"
            onClick={() => navigate('/dashboard/machines/ManageMachines')}
          >
            + Aggiungi Macchinario
          </button>
        </div>

        {/* Intestazione della tabella con i titoli delle colonne */}
        <div className="grid grid-cols-[120px_1fr_120px_150px_180px_250px] gap-4 px-6 py-5 bg-amber-700 text-slate-900 text-sm font-bold text-center rounded-t-xl shadow-xl">
          <div>ID MACCHINA</div>
          <div>DESCRIZIONE</div>
          <div>LINEA</div>
          <div>STATO</div>
          <div>ORDINE</div>
          <div>DIAGNOSTICA / ALLARMI</div>
        </div>

        {/* Corpo della tabella dove vengono mostrate le singole macchine */}
        <div className="max-h-[600px] overflow-y-auto bg-slate-900/40 p-2 rounded-b-xl border border-slate-700">
          {filteredMachines.length === 0 ? (
            <div className="text-center text-slate-500 p-12">Nessun dato trovato.</div>
          ) : (
            filteredMachines.map((m, index) => (
              <div
                key={`${m.machinesId}-${index}`}
                className={`grid grid-cols-[120px_1fr_120px_150px_180px_250px] gap-4 items-center px-6 py-4 rounded-lg bg-slate-900/80 mb-2 border-l-4
                ${m.state === 'RUN' ? 'border-green-500' : m.state === 'FAULT' ? 'border-red-600' : 'border-slate-600'}`}
              >
                {/* ID Macchina: cliccando qui si viene portati alla pagina dei dettagli */}
                <div
                  onClick={() => navigate(`${m.machinesId}`)}
                  className="text-amber-500 font-bold cursor-pointer hover:underline"
                >
                  {m.machinesId}
                </div>

                <div className="text-slate-100">{m.name}</div>
                <div className="text-slate-400 text-sm">{m.lineId}</div>

                {/* Badge colorato che indica se la macchina è RUN, FAULT o OFFLINE */}
                <div className="flex flex-col items-center">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-black ${m.state === 'RUN' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                  >
                    {m.state}
                  </span>
                  <span className="text-[9px] text-slate-600">
                    {m.lastTs ? m.lastTs.split('T')[1]?.split('.')[0] : '--:--:--'}
                  </span>
                </div>

                <div className="text-slate-300 text-xs">{m.order}</div>

                {/* Sezione per i messaggi di errore o lo stato operativo */}
                <div className="text-[11px]">
                  {m.lastUpdate.length > 0 ? (
                    m.lastUpdate.map((alarm: any, idx: number) => (
                      <div key={idx} className="text-red-400 font-bold">
                        ⚠ {String(alarm.message || 'ERRORE').toUpperCase()}
                      </div>
                    ))
                  ) : m.state === 'RUN' ? (
                    <span className="text-green-800 font-bold">OPERATIVO</span>
                  ) : (
                    <span className="text-slate-700 italic">-</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
