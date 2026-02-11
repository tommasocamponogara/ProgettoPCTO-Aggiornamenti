import { useLocation } from 'react-router-dom'
import { MachineImg } from '../componenti/MachineImg'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Machine } from '../Types/Type'
import { MachineDescTable } from '../componenti/MachineDescTable'
import { MachineTelemetries } from '../componenti/MachineTelemetries'

export function MachineDescription() {
  // Recupera i dati della macchina passati tramite lo stato della navigazione
  const location = useLocation()
  const machine: Machine = location.state?.machine

  return (
    <div className="min-h-screen flex bg-slate-800 text-slate-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        {/* Layout a tre colonne: Immagine, Tabella Dati, Lista Telemetrie */}
        <div className="flex justify-center items-center gap-3 p-6 mt-28 h-[calc(100vh-6rem)]">
          <div className="flex flex-col justify-center items-center w-1/4">
            <MachineImg machine={machine} />
          </div>

          <div className="flex flex-col justify-center items-center w-1/4">
            <MachineDescTable machine={machine} />
          </div>

          <div className="flex flex-col justify-center items-center max-h-[36rem] overflow-auto">
            <MachineTelemetries machine={machine} />
          </div>
        </div>
      </div>
    </div>
  )
}
