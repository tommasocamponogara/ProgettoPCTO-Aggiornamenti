import { useLocation, Link } from 'react-router-dom'
import accountDefault from '../assets/default_account.png'
import { UserMenu } from './UserMenu'
import { useState } from 'react'

export function Topbar() {
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()
  const path = location.pathname
  const topbarList = path.split('/').filter(Boolean)
  const lastElement = topbarList.pop()

  return (
    <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-24 bg-slate-900 text-slate-200 flex items-center justify-between px-6 border-b-4 border-amber-700 shadow-sm z-50 font-mono">
      <nav className="flex items-center space-x-1 overflow-x-auto">
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

        <span className="text-amber-400 text-2xl font-semibold capitalize whitespace-nowrap hover:cursor-pointer">
          {lastElement}
        </span>
      </nav>

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
