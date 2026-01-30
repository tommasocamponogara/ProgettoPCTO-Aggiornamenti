import type { Machine, Telemetry } from '../Types/Type'

type getLastTelemetryProps = {
  machine: Machine
}

export function getLastTelemetry({ machine }: getLastTelemetryProps) {
  let lastTelemetry: Telemetry | null = machine.telemetries[0] || null
  if (lastTelemetry) {
    machine.telemetries.forEach((telemetry) => {
      if (new Date(lastTelemetry!.ts).getTime() < new Date(telemetry.ts).getTime()) {
        lastTelemetry = telemetry
      }
    })
    return lastTelemetry
  }
}
