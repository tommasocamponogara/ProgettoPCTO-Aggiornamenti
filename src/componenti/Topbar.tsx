import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

export function Topbar() {
  var location = useLocation()
  var path = location.pathname
  var topbarList = path.split('/')
  return (
    <div className="bg-blue-950 text-white sticky w-full h-25 flex items-center ml-64 border-t-4 border-r-4 border-b-4 border-amber-700">
      {topbarList.map((element, index) => (
        <b key={index}>
          <Link to={'/' + element}>{element}</Link>
        </b>
      ))}
    </div>
  )
}
