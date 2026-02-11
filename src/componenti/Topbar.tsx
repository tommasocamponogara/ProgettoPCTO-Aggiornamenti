import { useLocation, Link } from 'react-router-dom'
import accountDefault from '../assets/default_account.png'
import { UserMenu } from './UserMenu'
import { useState } from 'react'
import { BiSolidBell, BiSolidBellRing } from 'react-icons/bi'
import { useCycleControl } from '../utils/useCycleControl'

export function Topbar() {
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()
  const path = location.pathname

  // Scompone l'URL per creare la navigazione breadcrumb
  const topbarList = path.split('/').filter(Boolean)
  const lastElement = topbarList.pop()

  // Utilizza l'hook di controllo ciclico per gestire lo stato della campanella
  const { bellStatus } = useCycleControl()

  return (
    <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-24 bg-slate-900 text-slate-200 flex items-center justify-between px-6 border-b-4 border-amber-700 shadow-sm z-50 font-mono">
      <nav className="flex items-center space-x-1 overflow-x-auto">
        {/* Genera i link per i livelli superiori del percorso attuale */}
        {topbarList.map((element, index) => (
          <span key={index} className="flex items-center space-x-1">
            <Link
              to={'/' + topbarList.slice(0, index + 1).join('/')}
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
      {bellStatus ? <BiSolidBell /> : <BiSolidBellRing />}

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
