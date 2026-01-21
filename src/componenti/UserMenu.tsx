export function UserMenu() {
  return (
    <div className="absolute right-0 top-22 w-30 bg-slate-900 text-slate-200 border border-amber-700 shadow-lg rounded-md z-50">
      <ul className="flex flex-col">
        <li className="px-4 py-3 hover:bg-amber-700 hover:text-slate-900 cursor-pointer">
          Account
        </li>
        <li className="px-4 py-3 hover:bg-amber-700 hover:text-slate-900 cursor-pointer">
          Impostazioni
        </li>
        <li className="px-4 py-3 hover:bg-amber-700 hover:text-slate-900 cursor-pointer">
          Sicurezza
        </li>
      </ul>
    </div>
  )
}
