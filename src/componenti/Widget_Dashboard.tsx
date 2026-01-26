import type { Line, Telemetry } from '../Types/Type'

type WidgetDashboardProps = {
  lines: Line[]
  telemetries: Telemetry[]
}

export function Widget_Dashboard({ lines, telemetries }: WidgetDashboardProps) {
  var n_macchinari = 0
  var listaconta = ['']
  for (const telemetry of telemetries) {
    if (!listaconta.includes(telemetry.machineId) && telemetry.reported.alarms.length != 0) {
      listaconta.push(telemetry.machineId)
    }
  }
  return (
    <div className="flex mt-100 ml-100">
      <div className=" border-amber-700 border-4 rounded-md w-50 h-50 text-center ">
        Linee: <br />
        <b>{lines.length}</b>
      </div>
      <div className="bg-blue-500 border rounded-md w-50 h-50 text-center ">
        Macchinari: <br />{' '}
        {lines.map((line, index) => (
          <b key={index}>{(n_macchinari += line.machines.length)}</b>
        ))}
      </div>
      <div className="bg-red-500 border rounded-md w-50 h-50 text-center ">
        Allarmi: <br /> <b>{listaconta.length}</b>
      </div>
    </div>
  )
}
