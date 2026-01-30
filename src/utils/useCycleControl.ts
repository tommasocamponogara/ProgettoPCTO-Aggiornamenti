import { useEffect, useState } from 'react'
import type { Telemetry } from '../Types/Type'
import { getTelemetries } from './api'
import { BellStatus } from './BellFunctions'

export function useCycleControl() {
  //const { setBellOn, setBellOff } = BellStatus()
  const [bellStatus, setBellStatus] = useState(false)
  const [minutes, setMinutes] = useState(() => Number(localStorage.getItem('minutes')) || 0)
  useEffect(() => {
    localStorage.setItem('minutes', minutes.toString())
  }, [minutes])

  const setBellOn = () => setBellStatus(true)
  const setBellOff = () => setBellStatus(false)

  const [telemetriesBefore, setTelemetriesBefore] = useState<Telemetry[]>([])
  //const [telemetriesAfter, setTelemetriesAfter] = useState<Telemetry[]>([])
  useEffect(() => {
    if (localStorage.getItem('telemetriesBeforeLength')) return

    getTelemetries().then((telemetries) => {
      setTelemetriesBefore(telemetries)
      localStorage.setItem('telemetriesBeforeLength', telemetries.length.toString())
    })
  }, [])

  useEffect(() => {
    // Set up the interval for 1 minute (60,000 ms)
    const intervalId = setInterval(() => {
      setMinutes((prev) => prev + 1)
    }, 60000)
    return () => clearInterval(intervalId)
  }, [])
  useEffect(() => {
    if (minutes !== 5) return
    if (!localStorage.getItem('telemetriesBeforeLength')) return
    console.log(minutes)

    getTelemetries().then((telemetries) => {
      const beforeLength = Number(localStorage.getItem('telemetriesBeforeLength')) || 0

      if (beforeLength !== telemetries.length) {
        setBellOn()
      } else {
        setBellOff()
      }

      setMinutes(0)
      localStorage.setItem('minutes', '0')
    })
  }, [minutes])
  return { bellStatus, setBellOn, setBellOff }
}
