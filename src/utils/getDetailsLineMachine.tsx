import type { Machine } from '../Types/Type'
import { getLastTelemetry } from './getLastTelemetry'

export function getDetailsLineMachine() {
  // Determina lo stato della linea basandosi sugli stati delle singole macchine
  const setLineStatus = (lineMachines: Machine[]) => {
    var lineStatus = 'positive'
    const statiLinea: string[] = []

    for (const machine of lineMachines) {
      const lastTelemetry = getLastTelemetry({ machine })
      if (lastTelemetry) {
        statiLinea.push(lastTelemetry.reported.state)
      } else {
        lineStatus = 'wait'
      }
    }

    // Definizione delle priorità degli stati
    const alarmStates = ['STOP', 'FAULT', 'OFFLINE']
    const waitState = ['IDLE']

    // Se anche una sola macchina è in allarme, l'intera linea è in 'alarm'
    if (statiLinea.some((state) => alarmStates.includes(state))) {
      lineStatus = 'alarm'
    } else if (statiLinea.some((state) => waitState.includes(state))) {
      lineStatus = 'wait'
    } else {
      lineStatus = 'positive'
    }
    return lineStatus
  }

  // Conta quante macchine nella linea hanno almeno un allarme attivo
  const numbersOfAlarms = (lineMachines: Machine[]) => {
    let lineNumberAlarms: number = 0
    for (const machine of lineMachines) {
      const lastTelemetry = getLastTelemetry({ machine })
      if (lastTelemetry) {
        if (lastTelemetry.reported.alarms.length !== 0) {
          lineNumberAlarms += 1
        }
      }
    }

    return lineNumberAlarms
  }

  return { setLineStatus, numbersOfAlarms }
}
