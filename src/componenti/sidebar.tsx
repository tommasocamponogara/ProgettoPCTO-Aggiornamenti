import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export function Sidebar() {
  return (
    <div className="bg-slate-900 text-slate-200 h-screen w-64 fixed flex flex-col justify-between px-6 py-6 font-sans border-r-4 border-amber-700 shadow-lg ">
      <div className="flex items-center mb-10 border-b-amber-700 border-b-2">
        <img src={logo} alt="Logo App" className="w-20 h-20 ml-15 mb-5" />
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 text-sm font-medium">
          <li>
            <Link
              to="/dashboard"
              className="block py-3 px-4 rounded-md hover:bg-amber-700 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/linee"
              className="block py-3 px-4 rounded-md hover:bg-amber-700 hover:text-white transition-colors"
            >
              Linee
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/macchinari"
              className="block py-3 px-4 rounded-md hover:bg-amber-700 hover:text-white transition-colors"
            >
              Macchinari
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/allarmi"
              className="block py-3 px-4 rounded-md hover:bg-amber-700 hover:text-slate-900 transition-colors"
            >
              Allarmi
            </Link>
          </li>
        </ul>
      </nav>

      <div className="text-xs text-slate-400 border-t border-slate-700 pt-4">
        © 2026 - Smart Factory Demo
        <br />
        Tutti i diritti riservati
      </div>
    </div>
  )
}
