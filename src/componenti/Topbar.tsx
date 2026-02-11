import { useLocation, Link } from 'react-router-dom'
import accountDefault from '../assets/default_account.png'
import { UserMenu } from './UserMenu'
import { useState } from 'react'
import { BiSolidBell, BiSolidBellRing } from 'react-icons/bi'
import { useCycleControl } from '../utils/useCycleControl'

// Crea la barra superiore in cui si vede il percorso in cui l'utente si trova, l'icona della campanella e l'icona dell'account

export function Topbar() {
  const [showMenu, setShowMenu] = useState(false)
  // Ottiene l'URL corrente per costruire la navigazione breadcrumb
  const location = useLocation()
  // Estrae il percorso attuale dall'URL
  const path = location.pathname

  // Scompone l'URL per creare la navigazione breadcrumb (rimuove le stringhe vuote tramite filter(Boolean))
  const topbarList = path.split('/').filter(Boolean)

  // Ottinee l'ultimo elemento dell'array che rappresenta la pagina attuale in cui si trova l'utente, e lo rimuove
  const lastElement = topbarList.pop()

  // Utilizza l'hook di controllo ciclico per gestire lo stato della campanella
  const { bellStatus } = useCycleControl()

  return (
    <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-24 bg-slate-900 text-slate-200 flex items-center justify-between px-6 border-b-4 border-amber-700 shadow-sm z-50 font-mono">
      <nav className="flex items-center space-x-1 overflow-x-auto">
        {/* Genera i link per i livelli superiori del percorso attuale */}
        {topbarList.map((element, index) => (
          <span key={index} className="flex items-center space-x-1">
            {/* Crea un lin kepr ogni elemento presente nell'array topBarList */}
            <Link
              to={'/' + topbarList.slice(0, index + 1).join('/')} // Crea il percorso del link degli elementi array (es. topBarList=[dashboardlinee]-> crea un link con percorso /dashboard/linee)
              className="text-lg hover:text-amber-400 transition-colors capitalize whitespace-nowrap"
            >
              {element}
            </Link>
            <span className="text-slate-500">/</span>
          </span>
        ))}
        {/* Mostra l'ultima parte del percorso in evidenza */}
        <span className="text-amber-400 text-2xl font-semibold capitalize whitespace-nowrap">
          {lastElement}
        </span>
      </nav>

      {/* Cambia icona della campana in base allo stato bellStatus */}
      <div className="text-2xl cursor-pointer hover:text-amber-400 transition-colors">
        {bellStatus ? <BiSolidBell /> : <BiSolidBellRing />}
      </div>

      <div className="relative ml-4">
        <img
          src={accountDefault}
          alt="Account"
          className="w-14 h-20 rounded-full cursor-pointer hover:border-2 hover:border-amber-700"
          onClick={() => setShowMenu(!showMenu)}
        />
        {showMenu && <UserMenu />}
      </div>
    </div>
  )
}
