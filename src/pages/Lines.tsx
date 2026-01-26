import { useState, useEffect } from 'react'
import { Sidebar } from '../componenti/Sidebar'
import { TableLines } from '../componenti/TableLines'
import { Topbar } from '../componenti/Topbar'
import type { Line } from '../Types/Type'
import { getLines } from '../utils/api'

export default function Lines() {
  const [lines, setLines] = useState<Line[]>([])

  useEffect(() => {
    getLines().then((lines) => setLines(lines))
  }, [])

  return (
    <>
      <Sidebar />
      <Topbar />
      <TableLines lines={lines} />
    </>
  )
}
