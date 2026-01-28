import React from 'react'
import type { Line, Machine, Telemetry } from '../Types/Type'
import { Navigate, useNavigate } from 'react-router-dom'

type SynopticProps = {
  lineName: string
  machines: Machine[]
  line: Line
}

export function LineSynoptic({ lineName, machines, line }: SynopticProps) {
  const navigate = useNavigate()
  const machineWidth = 160
  const machineHeight = 90
  const spacing = 60
  const startX = 80
  const startY = 110

  const totalWidth = Math.max(
    600,
    machines.length * (machineWidth + spacing) - spacing + startX * 2,
  )
  const conveyorHeight = 14
  const arrowWidth = 20
  const arrowHeight = 14

  const getMachineClass = (machine: Machine) => {
    const lastTelemetry = machine.telemetries?.[machine.telemetries.length - 1]
    if (!lastTelemetry) return 'syn-idle'

    switch (lastTelemetry.reported.state) {
      case 'RUN':
        return 'syn-run'
      case 'IDLE':
        return 'syn-idle'
      case 'STOP':
        return 'syn-stop'
      case 'FAULT':
        return 'syn-fault'
      case 'OFFLINE':
        return 'syn-offline'
      default:
        return 'syn-idle'
    }
  }

  const getTooltipText = (machine: Machine) => {
    const lastTelemetry = machine.telemetries?.[machine.telemetries.length - 1]
    if (!lastTelemetry) return `Stato: N/D`

    const alarmsText =
      lastTelemetry.reported.alarms.length > 0
        ? lastTelemetry.reported.alarms.map((a) => `${a.code}: ${a.message}`).join('\n')
        : 'Nessun allarme'

    return `Stato: ${lastTelemetry.reported.state}\nOrdine: ${lastTelemetry.reported.orderCode}\n${alarmsText}`
  }

  return (
    <div className="min-h-screen w-full bg-slate-800 flex items-center justify-center p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={totalWidth}
        height={320}
        viewBox={`0 0 ${totalWidth} 320`}
      >
        <style>
          {`
            .title { font-family: monospace; font-size: 18px; fill: #f5f5f5; text-anchor: middle; }
            .asset-label { font-family: monospace; font-size: 12px; fill: #f5f5f5; pointer-events: none; text-anchor: middle; }
            .asset-small { font-family: monospace; font-size: 10px; fill: #ddd; pointer-events: none; text-anchor: middle; }
            .conveyor { fill: #555; stroke: #888; stroke-width: 2; rx: 7; ry: 7; }
            .arrow { fill: #aaa; }
            @keyframes blink-stop {
              0%   { stroke: #e7000b; }
              50%  { stroke: #7a0005; }
              100% { stroke: #e7000b; }
            }

            .syn-stop {
              animation: blink-stop 0.6s steps(1) infinite;
            }

          `}
        </style>

        {/* Titolo */}
        <text className="title" x={totalWidth / 2} y={32}>
          {lineName}
        </text>

        {/* Conveyor */}
        <rect
          className="conveyor"
          x={startX}
          y={startY + machineHeight / 2 - conveyorHeight / 2}
          width={machines.length * (machineWidth + spacing) - spacing}
          height={conveyorHeight}
        />

        {/* Frecce */}
        {machines.slice(1).map((_, idx) => {
          const x = startX + idx * (machineWidth + spacing) + machineWidth / 2
          const y = startY + machineHeight / 2
          return (
            <polygon
              key={idx}
              className="arrow"
              points={`${x},${y - arrowHeight / 2} ${x + arrowWidth},${y} ${x},${y + arrowHeight / 2}`}
            />
          )
        })}

        {/* Macchine */}
        {machines.map((machine, idx) => {
          const x = startX + idx * (machineWidth + spacing)
          const y = startY
          const cls = getMachineClass(machine)
          const tooltip = getTooltipText(machine)

          const fillColor =
            cls === 'syn-run'
              ? '#4caf50'
              : cls === 'syn-idle'
                ? '#ff6900'
                : cls === 'syn-stop'
                  ? '#e7000b'
                  : cls === 'syn-fault'
                    ? '#e91e63'
                    : '#9e9e9e'

          return (
            <g key={machine.id} id={`machine-${machine.id}`}>
              <rect
                className={cls}
                x={x}
                y={y}
                width={machineWidth}
                height={machineHeight}
                rx={12}
                ry={12}
                style={{
                  fill: fillColor,
                  stroke: '#222',
                  strokeWidth: 3,
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`${machine.id}`, { state: { machine } })}
              />
              <text className="asset-label" x={x + machineWidth / 2} y={y + machineHeight + 16}>
                {machine.id.toUpperCase()}
              </text>
              <text className="asset-small" x={x + machineWidth / 2} y={y + machineHeight + 32}>
                {machine.name}
              </text>
              <title>{tooltip}</title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
