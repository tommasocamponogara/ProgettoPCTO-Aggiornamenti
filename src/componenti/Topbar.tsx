import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import accountDefault from '../assets/default_account.png'

export function Topbar() {
  var location = useLocation()
  var path = location.pathname
  var topbarList = path.split('/')
  topbarList.shift()
  return (
    <div className="flex bg-slate-900 text-slate-200 top-0 w-full h-25 items-center ml-64 px-6 border-b-4 border-amber-700 shadow-sm">
      <div className="flex items-center space-x-3 text-sm font-medium">
        {topbarList.map((element, index) => (
          <b key={index}>
            <Link
              to={'/' + topbarList.slice(0, index + 1).join('/')}
              className="hover:text-amber-400 transition-colors capitalize"
            >
              {'/' + element}
            </Link>
          </b>
        ))}
      </div>
      <div className="flex items-center mb-10 fixed ml-250">
        <img
          src={accountDefault}
          alt="Logo App"
          className="w-15 h-22 ml-230 mt-10 hover:cursor-pointer hover:mask-linear-from-white"
        />
      </div>
    </div>
  )
}
