import { useLocation } from 'react-router-dom'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { LineSynopticWithTooltip } from './Line'

export function LineDescription() {
  const location = useLocation()
  const line = location.state?.line
  if (!line) return <div>No linea sleezionata</div>
  return (
    <>
      <Sidebar />
      <Topbar />
      <LineSynopticWithTooltip lineName={line.name} machines={line.machines} />
    </>
  )
}
