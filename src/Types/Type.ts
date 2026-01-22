export type Machine = {
  id: String
  lineId: String
  name: String
  type: String
  plc: {
    vendor: String
    model: String
  }
  order: Number
}

export type MachineWithTelemetries = Machine & {
  telemetries: Telemetry[]
}

export type Line = {
  id: String
  name: String
  description: String
  order: Number
  machines: Machine[]
}

export type Telemetry = {
  machineId: String
  type: String
  ts: String
  reported: {
    state: String
    orderCode: String
    temperature: Number
    pressure: Number
    alarms:
      | [
          {
            code: String
            message: String
            locking: Boolean
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
