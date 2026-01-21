import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

export function Topbar() {
  var location = useLocation()
  var path = location.pathname
  var topbarList = path.split('/')
  var useless = topbarList.shift()

  return (
    <div className="bg-slate-900 text-slate-200 sticky top-0 w-full h-16 flex items-center ml-64 px-6 border-b-4 border-amber-700 shadow-sm">
      <div className="flex items-center space-x-3 text-sm font-medium">
        {topbarList.map((element, index) => (
          <b key={index}>
            <Link to={'/' + element} className="hover:text-amber-400 transition-colors capitalize">
              {element} {index !== topbarList.length - 1 && '/'}
            </Link>
          </b>
        ))}
      </div>
    </div>
  )
}
