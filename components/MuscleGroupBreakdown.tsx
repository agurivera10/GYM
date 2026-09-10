'use client'

import React from 'react'
import { MuscleGroupStat } from '@/app/dashboard/actions'
import { Dumbbell, Activity, Flame } from 'lucide-react'

interface Props {
  stats: MuscleGroupStat[]
}

export function MuscleGroupBreakdown({ stats }: Props) {
  const totalVolumeAll = stats.reduce((acc, s) => acc + s.totalVolume, 0)
  const totalSetsAll = stats.reduce((acc, s) => acc + s.setsCount, 0)

  // Encontrar el grupo más trabajado
  const topGroup = stats.reduce((max, s) => (s.totalVolume > max.totalVolume ? s : max), stats[0])

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-4 mb-6 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-text-muted uppercase font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span>Balance Muscular</span>
          </p>
          <h3 className="text-base font-extrabold text-text-main mt-0.5">Volumen por Grupo Muscular</h3>
        </div>
        {topGroup && topGroup.totalVolume > 0 && (
          <div className="bg-bg-elevated px-2.5 py-1 rounded-xl border border-border-main text-[11px] text-text-muted flex items-center gap-1">
            <span>Más entrenado:</span>
            <strong className="text-accent">{topGroup.name}</strong>
          </div>
        )}
      </div>

      {totalSetsAll === 0 ? (
        <div className="bg-bg-elevated/50 rounded-xl p-5 text-center text-xs text-text-muted">
          Aún no hay registros de series guardadas. Cuando completes tus entrenamientos, vas a ver acá el porcentaje de trabajo de cada músculo.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 mt-2">
          {stats.map(group => {
            const hasData = group.setsCount > 0

            return (
              <div key={group.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{group.icon}</span>
                    <span className="font-bold text-text-main">{group.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-text-muted font-semibold">{group.setsCount} series</span>
                    <span className="text-text-main font-bold">
                      {group.totalVolume >= 1000
                        ? `${(group.totalVolume / 1000).toFixed(1)}t`
                        : `${group.totalVolume} kg`}
                    </span>
                    <span
                      className="font-extrabold px-1.5 py-0.5 rounded-md text-[10px]"
                      style={{ backgroundColor: `${group.color}20`, color: group.color }}
                    >
                      {group.percentage}%
                    </span>
                  </div>
                </div>

                {/* Barra de progreso visual */}
                <div className="w-full h-2.5 bg-bg-elevated rounded-full overflow-hidden border border-border-main/50">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(group.percentage, hasData ? 3 : 0)}%`,
                      backgroundColor: group.color
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
