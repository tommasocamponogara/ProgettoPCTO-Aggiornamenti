import { useState } from 'react'

export function BellStatus() {
  //let bellStatus: boolean = false
  const [bellStatus, setBell] = useState<boolean>(false)
  const setBellOn = () => {
    setBell(true)
    //return bellStatus
  }

  const setBellOff = () => {
    setBell(false)
    //return bellStatus
  }

  return { bellStatus, setBellOn, setBellOff }
}
