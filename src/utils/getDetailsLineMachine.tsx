import type { Machine, Telemetry } from '../Types/Type'
import { getLastTelemetry } from './getLastTelemetry'

export function getDetailsLineMachine(lineMachines: Machine[]) {
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
    //console.log(statiLinea)
    const alarmStates = ['STOP', 'FAULT', 'OFFLINE']
    const waitState = ['IDLE']
    if (statiLinea.some((state) => alarmStates.includes(state))) {
      lineStatus = 'alarm'
    } else if (statiLinea.some((state) => waitState.includes(state))) {
      lineStatus = 'wait'
    } else {
      lineStatus = 'positive'
    }
    return lineStatus
  }

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
    //console.log(lineNumberAlarms)
    return lineNumberAlarms
  }
  /*
  const getLastTelemetry = (machine: Machine) => {
    let lastTelemetry: Telemetry | null = machine.telemetries[0] || null
    if (lastTelemetry) {
      machine.telemetries.forEach((telemetry) => {
        if (new Date(lastTelemetry!.ts).getTime() < new Date(telemetry.ts).getTime()) {
          lastTelemetry = telemetry
        }
      })
      //console.log(lastTelemetry)
      return lastTelemetry
    }
  }
    */

  return { setLineStatus, numbersOfAlarms }
}
