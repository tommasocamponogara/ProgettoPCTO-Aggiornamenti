import type { Line, Machine, Telemetry } from '../Types/Type'

export async function getTelemetries(): Promise<Telemetry[]> {
  const telemetries: Telemetry[] = await (await fetch('http://localhost:3000/telemetries')).json()
  return telemetries
}

export async function getMachines(): Promise<Machine[]> {
  const machines = await (await fetch('http://localhost:3000/machines')).json()
  const telemetries: Telemetry[] = await (await fetch('http://localhost:3000/telemetries')).json()
  for (const machine of machines) {
    const lineTelemetries = telemetries.filter((t) => t.machineId === machine.id)
    machine['telemetries'] = lineTelemetries
    console.log(machines)
  }
  return machines
}

export async function getMachine(id: string): Promise<Machine | undefined> {
  try {
    const response = await fetch(`http://localhost:3000/machines/${id}`)
    return response.json()
  } catch (error) {
    return undefined
  }
}

export async function getLines(): Promise<Line[]> {
  const machines: Machine[] = await (await fetch('http://localhost:3000/machines')).json()
  const lines = await (await fetch('http://localhost:3000/lines')).json()

  for (const line of lines) {
    const lineMachines = machines.filter((m) => m.lineId === line.id)
    line['machines'] = lineMachines
    //console.log(lines)
  }

  return lines
}
