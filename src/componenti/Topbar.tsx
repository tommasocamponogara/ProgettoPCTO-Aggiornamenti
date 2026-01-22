import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import accountDefault from '../assets/default_account.png'
import { UserMenu } from './UserMenu'
import { useState } from 'react'

export function Topbar() {
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()
  const path = location.pathname
  const topbarList = path.split('/').filter(Boolean)

  return (
    <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-24 bg-slate-900 text-slate-200 flex items-center justify-between px-6 border-b-4 border-amber-700 shadow-sm z-50">
      <div className="flex items-center space-x-3 text-xl font-extralight overflow-x-auto">
        {topbarList.map((element, index) => (
          <b key={index}>
            <Link
              to={'/' + topbarList.slice(0, index + 1).join('/')}
              className="flex hover:text-amber-400 transition-colors capitalize whitespace-nowrap"
            >
              {'/' + element}
            </Link>
          </b>
        ))}
      </div>

      <div className="relative ml-4">
        <img
          src={accountDefault}
          alt="Account"
          className="w-14 h-20 rounded-full cursor-pointer hover:border-2 hover:border-amber-700 mr-8"
          onClick={() => setShowMenu(!showMenu)}
        />

        {showMenu && <UserMenu />}
      </div>
    </div>
  )
}
