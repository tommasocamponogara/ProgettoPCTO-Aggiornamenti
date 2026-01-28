import { useState, useEffect } from 'react'
import type { Machine } from '../Types/Type'
import { getMachines } from '../utils/api'

export function useAllMachineNames() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [namesList, setNamesList] = useState<string[]>([])

  useEffect(() => {
    getMachines().then((machines) => {
      setMachines(machines)
      setNamesList(machines.map((m) => m.name))
    })
  }, [])

  return namesList
}
