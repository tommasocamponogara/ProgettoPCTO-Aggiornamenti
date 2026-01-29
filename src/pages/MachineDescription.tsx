import { useLocation } from 'react-router-dom'
import { MachineImg } from '../componenti/MachineImg'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import type { Machine } from '../Types/Type'
import { MachineDescTable } from '../componenti/MachineDescTable'

export function MachineDescription() {
  const location = useLocation()
  console.log(location)
  const machine: Machine = location.state?.machine
  return (
    <div className="min-h-screen bg-slate-800 w-full pt-16 px-4 flex flex-col items-center">
      <Sidebar />
      <Topbar />
      <div className="w-full flex justify-center mb-8">
        <MachineImg machine={machine} />
      </div>
      <div className="w-full max-w-4xl">
        <MachineDescTable machine={machine} />
      </div>
    </div>
  )
}
