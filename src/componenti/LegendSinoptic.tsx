export function LegendSinoptic() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 bg-slate-900 text-slate-200 border border-slate-600 shadow-xl rounded-sm z-30 px-4 py-3 text-sm font-sans">
      <h2 className="text-sm font-semibold tracking-widest text-slate-300 mb-3">LEGENDA STATI</h2>

      {/* Intestazione della tabella legenda */}
      <div className="grid grid-cols-2 text-xs font-semibold text-slate-400 border-b border-slate-700 pb-1 mb-2">
        <span>INDICATORE</span>
        <span>STATO MACCHINA</span>
      </div>

      {/* Mappatura visiva colori/stati */}
      <div className="grid grid-cols-2 gap-y-2 text-sm items-center">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-green-600 border border-slate-500" />
        </div>
        <span className="tracking-wide">RUN</span>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-orange-500 border border-slate-500" />
        </div>
        <span className="tracking-wide">IDLE</span>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-red-600 border border-slate-500" />
        </div>
        <span className="tracking-wide">STOP</span>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-pink-600 border border-slate-500" />
        </div>
        <span className="tracking-wide">FAULT</span>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gray-500 border border-slate-500" />
        </div>
        <span className="tracking-wide">OFFLINE</span>
      </div>
    </div>
  )
}
