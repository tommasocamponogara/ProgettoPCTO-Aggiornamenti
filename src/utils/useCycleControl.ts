import { useEffect, useState } from 'react'
import type { Telemetry } from '../Types/Type'
import { getTelemetries } from './api'
import { BellStatus } from './BellFunctions'

//Controlla ogni 5 minuti se sono arrivati nuovi dati dalle macchine; se non ne sono arrivati, fammi suonare un allarme (la campanella).

export function useCycleControl() {
  //const { setBellOn, setBellOff } = BellStatus()
  const [bellStatus, setBellStatus] = useState(false)
  // Gestione dei minuti con persistenza nel localStorage del browser
  const [minutes, setMinutes] = useState(() => Number(localStorage.getItem('minutes')) || 0)

  // Il controllo delle telemetrie avviene basandosi sul valore di minutes, salvarlo garantisce che quel "ciclo di 5 minuti" sia persistente
  useEffect(() => {
    localStorage.setItem('minutes', minutes.toString())
  }, [minutes])

  const setBellOn = () => setBellStatus(true)
  const setBellOff = () => setBellStatus(false)

  const [telemetriesBefore, setTelemetriesBefore] = useState<Telemetry[]>([])
  //const [telemetriesAfter, setTelemetriesAfter] = useState<Telemetry[]>([])

  // Al primo avvio, salva il numero attuale di telemetrie se non presente
  useEffect(() => {
    if (localStorage.getItem('telemetriesBeforeLength')) return

    getTelemetries().then((telemetries) => {
      setTelemetriesBefore(telemetries)
      localStorage.setItem('telemetriesBeforeLength', telemetries.length.toString())
    })
  }, [])

  // Timer che incrementa il contatore dei minuti ogni 60 secondi, 60*000 ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMinutes((prev) => prev + 1)
    }, 60000)
    return () => clearInterval(intervalId) // Pulisce il timer quando il componente smette di esistere
  }, [])

  // Ogni 5 minuti controlla se il numero totale di telemetrie è cambiato
  useEffect(() => {
    if (minutes !== 5) return
    if (!localStorage.getItem('telemetriesBeforeLength')) return
    console.log(minutes)

    getTelemetries().then((telemetries) => {
      const beforeLength = Number(localStorage.getItem('telemetriesBeforeLength')) || 0

      // Se il numero di telemetrie è diverso, attiva la campanella
      if (beforeLength !== telemetries.length) {
        setBellOn()
      } else {
        setBellOff()
      }

      // Reset del timer dopo il controllo
      setMinutes(0)
      localStorage.setItem('minutes', '0')
    })
  }, [minutes])

  return { bellStatus, setBellOn, setBellOff }
}
