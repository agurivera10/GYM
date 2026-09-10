'use client'

import { Dumbbell, Flame, BarChart2 } from 'lucide-react'

interface Props {
  totalSessions: number
  totalVolume: number
}

export function DashboardStats({ totalSessions, totalVolume }: Props) {
  const stats = [
    {
      icon: <Dumbbell className="w-5 h-5 text-accent" />,
      label: 'Sesiones',
      value: totalSessions.toString(),
      sub: 'completadas',
    },
    {
      icon: <Flame className="w-5 h-5 text-red" />,
      label: 'Volumen Total',
      value: totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}t` : `${totalVolume}kg`,
      sub: 'levantados',
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-blue" />,
      label: 'Progreso',
      value: totalSessions > 0 ? '↑' : '-',
      sub: 'constante',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-bg-card border border-border-main rounded-2xl p-4 flex flex-col gap-2">
          {s.icon}
          <div>
            <p className="text-xl font-extrabold text-text-main">{s.value}</p>
            <p className="text-[10px] text-text-muted uppercase font-bold">{s.label}</p>
            <p className="text-[10px] text-text-muted">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
