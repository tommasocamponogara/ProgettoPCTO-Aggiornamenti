import type { Line, Telemetry } from '../Types/Type'

type WidgetDashboardProps = {
  lines: Line[]
  telemetries: Telemetry[]
}

export function Widget_Dashboard({ lines, telemetries }: WidgetDashboardProps) {
  const n_macchinari = lines.reduce((acc, line) => acc + line.machines.length, 0)
  var listaconta: string[] = []
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
        Macchinari: <br />
        {n_macchinari}
      </div>
      <div className="bg-red-500 border rounded-md w-50 h-50 text-center ">
        Allarmi: <br /> <b>{listaconta.length}</b>
      </div>
    </div>
  )
}
