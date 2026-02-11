import type { Machine, Telemetry } from '../Types/Type'

type getLastTelemetryProps = {
  machine: Machine
}

export function getLastTelemetry({ machine }: getLastTelemetryProps) {
  // Inizializza con la prima telemetria se presente, altrimenti mette null la variabile che sara`
  // Uguale a null successivamente. E' importante impostare anche la variabile null per l'if che segue
  let lastTelemetry: Telemetry | null = machine.telemetries[0] || null

  if (lastTelemetry) {
    // Cicla tutte le telemetrie per trovare quella con la data (ts) più recente
    machine.telemetries.forEach((telemetry) => {
      if (new Date(lastTelemetry!.ts).getTime() < new Date(telemetry.ts).getTime()) {
        lastTelemetry = telemetry
      }
    })
    return lastTelemetry
  }
}
