import centro_lavoro_cnc_img from '../assets/centro_lavoro-cnc.png'
import imballatrice_automatica_img from '../assets/imballatrice_automatica.png'
import pressa_idraulica_img from '../assets/pressa_idraulica.png'
import robot_manipolatore_img from '../assets/robot_manipolatore.png'
import stazione_controllo_qualita_img from '../assets/stazione_controllo_qualita.png'
import type { Machine } from '../Types/Type'

type MachineImgProps = {
  machine: Machine
}

const nameImg = {
  PRESS: pressa_idraulica_img,
  ROBOT: robot_manipolatore_img,
  CNC: centro_lavoro_cnc_img,
  QC: stazione_controllo_qualita_img,
  PACKER: imballatrice_automatica_img,
}

export function MachineImg({ machine }: MachineImgProps) {
  let immagine: string | undefined = undefined
  Object.entries(nameImg).map(([type, corrispondingImg]) => {
    if (machine.type === type) {
      immagine = corrispondingImg
    }
  })

  const imgClasses =
    machine.type === 'CNC'
      ? 'max-w-md max-h-128 object-contain drop-shadow-lg'
      : 'max-w-sm max-h-100 object-contain drop-shadow-lg'

  return (
    <div className="flex justify-center items-center h-full">
      {immagine && <img src={immagine} alt={machine.name} className={imgClasses} />}
    </div>
  )
}
