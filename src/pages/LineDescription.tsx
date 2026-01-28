import { useLocation } from 'react-router-dom'
import { Sidebar } from '../componenti/Sidebar'
import { Topbar } from '../componenti/Topbar'
import { LineSynoptic } from './LineSynoptic'
import { LegendSinoptic } from '../componenti/LegendSinoptic'
import { getLine } from '../utils/api'
import { useEffect, useState } from 'react'
import type { Line } from '../Types/Type'

export function LineDescription() {
  const location = useLocation()
  const lineId = location.pathname.split('/').pop()

  const [line, setLine] = useState<Line>()

  useEffect(() => {
    if (lineId) {
      getLine(lineId).then((l) => setLine(l))
    }
  }, [lineId])

  return (
    <>
      <Sidebar />
      <Topbar />
      {line && <LineSynoptic lineName={line.name} machines={line.machines} line={line} />}
      <LegendSinoptic />
    </>
  )
}
