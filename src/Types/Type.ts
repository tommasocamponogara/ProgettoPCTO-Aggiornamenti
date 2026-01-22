export type Machine = {
  id: string
  lineId: string
  name: string
  type: string
  plc: {
    vendor: string
    model: string
  }
  order: number
}

export type MachineWithTelemetries = Machine & {
  telemetries: Telemetry[]
}

export type Line = {
  id: string
  name: string
  description: string
  order: number
  machines: Machine[]
}

export type Telemetry = {
  machineId: string
  type: string
  ts: string
  reported: {
    state: string
    orderCode: string
    temperature: number
    pressure: number
    alarms:
      | [
          {
            code: string
            message: string
            locking: boolean
          },
        ]
      | []
  }
}

export type ReadFileProps = {
  setMachines: (machines: Machine[]) => void
  setLines: (lines: Line[]) => void
  setTelemetries: (telemetries: Telemetry[]) => void
}
