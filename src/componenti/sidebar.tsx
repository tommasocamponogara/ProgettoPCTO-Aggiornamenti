import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/prova_logo.svg'

export function Sidebar() {
  return (
    <div className="bg-blue-950 text-white h-screen w-64 fixed flex flex-col justify-between p-8 font-sans shadow-lg border-4 border-amber-700">
      <div className="mb-10 flex items-center">
        <img src={logo} alt="Logo App" className="w-10 h-10 mr-5" />
        {/*<span className="text-xl font-bold">Smart Factory</span> */}
      </div>

      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/linee"
              className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors"
            >
              Linee
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/macchinari"
              className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors"
            >
              Macchinari
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/allarmi"
              className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors"
            >
              Allarmi
            </Link>
          </li>
        </ul>
      </nav>

      <div className="text-sm text-gray-300">
        © 2026 - Smart Factory Demo
        <br />
        Tutti i diritti riservati
      </div>
    </div>
  )
}
