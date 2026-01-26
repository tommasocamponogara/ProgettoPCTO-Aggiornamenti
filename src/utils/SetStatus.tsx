import { useState } from 'react'
import type { Machine, StatusProps } from '../Types/Type'

export function SetStatus({ telemetries, lines }: StatusProps) {
  const [machines, setMachines] = useState<Machine[]>([])
  for (const machine of machines) {
    if (machine.telemetries.length !== 0) {
      machine.status = 'alarm'
    } else {
      machine.status = 'positive'
    }
  }

  setMachines(machines)
  console.log(machines)

  return machines
}
