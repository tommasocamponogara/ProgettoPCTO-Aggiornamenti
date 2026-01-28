import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { HiBell, HiCollection } from 'react-icons/hi'

import { MdHome } from 'react-icons/md'
import { IoIosBuild } from 'react-icons/io'

export function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col justify-between px-6 py-6 font-sans border-r-4 border-amber-700 shadow-lg">
      <div className="flex items-center justify-center mb-10 border-b-2 border-amber-700 pb-4">
        <img src={logo} alt="Logo App" className="w-20 h-20 object-contain" />
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 text-2xs font-medium">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 py-3 px-4 rounded-md hover:bg-amber-700 hover:text-slate-900 transition-colors"
            >
              {' '}
              <MdHome />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/linee"
              className="flex items-center gap-2 py-3 px-4 rounded-md hover:bg-amber-700 hover:text-slate-900 transition-colors"
            >
              <HiCollection />
              Linee
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/macchinari"
              className="flex items-center gap-2 py-3 px-4 rounded-md hover:bg-amber-700 hover:text-slate-900 transition-colors"
            >
              <IoIosBuild />
              Macchinari
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/allarmi"
              className="flex items-center gap-2 py-3 px-4 rounded-md hover:bg-amber-700 hover:text-slate-900 transition-colors"
            >
              <HiBell />
              Allarmi
            </Link>
          </li>
        </ul>
      </nav>

      <div className="text-xs text-slate-400 border-t border-slate-700 pt-4 text-center">
        © 2026 - Smart Factory Demo
        <br />
        Tutti i diritti riservati
      </div>
    </div>
  )
}
