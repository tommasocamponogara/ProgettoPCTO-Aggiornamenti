import { useState } from 'react'

export function BellStatus() {
  // Stato booleano per gestire l'attivazione della campanella
  const [bellStatus, setBell] = useState<boolean>(false)

  // Funzione per attivare la campanella
  const setBellOn = () => {
    setBell(true)
  }

  // Funzione per disattivare la campanella
  const setBellOff = () => {
    setBell(false)
    // return bellStatus // Se vuoi restituire lo stato attuale dopo averlo modificato, ma attenzione che setState è asincrono
  }

  return { bellStatus, setBellOn, setBellOff }
}
