import { useState } from 'react'
import type { Line, Machine, StatusProps } from '../Types/Type'

export function SetStatus(lineMachines: Machine[]) {
  var lineStatus = 'positive'
  for (const machine of lineMachines) {
    machine.telemetries.forEach((telemetry) => {
      if (
        telemetry.reported.state === 'STOP' ||
        telemetry.reported.state === 'FAULT' ||
        telemetry.reported.state === 'OFFLINE'
      ) {
        lineStatus = 'alarm'
      } else if (telemetry.reported.state === 'IDLE' && lineStatus != 'alarm') {
        lineStatus = 'wait'
      }
    })
  }
  return lineStatus
}
