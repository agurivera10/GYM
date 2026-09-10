'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Props {
  data: { date: string; weight: number }[]
  exerciseName: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-elevated border border-border-main rounded-xl px-3 py-2">
        <p className="text-text-muted text-xs">{label}</p>
        <p className="text-accent font-extrabold text-base">{payload[0].value} kg</p>
      </div>
    )
  }
  return null
}

export function ProgressChart({ data, exerciseName }: Props) {
  const formatted = data.map(d => ({
    ...d,
    date: format(new Date(d.date), 'dd MMM', { locale: es }),
  }))

  if (data.length === 0) {
    return (
      <div className="bg-bg-card border border-border-main rounded-2xl p-6 mb-4 flex flex-col items-center justify-center min-h-[180px]">
        <p className="text-text-muted text-sm text-center">
          Aún no hay datos de progreso para<br />
          <span className="text-text-main font-bold">{exerciseName}</span>.
        </p>
        <p className="text-text-muted text-xs mt-2">Completá series para verlos aquí.</p>
      </div>
    )
  }

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-4 mb-4">
      <p className="text-xs text-text-muted uppercase font-bold mb-1">Progreso</p>
      <p className="text-base font-extrabold text-text-main mb-4">{exerciseName}</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#8E8E93', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8E8E93', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            unit="kg"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#32D74B"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#32D74B', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#32D74B' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
