import { useState, useEffect } from 'react'
import type { Machine } from '../Types/Type'
import { getMachines } from '../utils/api'

export function useAllMachineNames() {
  const [, setMachines] = useState<Machine[]>([])
  const [namesList, setNamesList] = useState<string[]>([])

  useEffect(() => {
    // Recupera tutte le macchine e ne estrae solo i nomi per creare una lista stringhe
    getMachines().then((machines) => {
      setMachines(machines)
      setNamesList(machines.map((m) => m.name))
    })
  }, [])

  return namesList
}
