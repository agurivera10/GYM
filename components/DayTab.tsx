'use client'

import React from 'react'

interface DayTabProps {
  days: { id: string; label: string }[]
  activeDay: string
  todayDayId?: string
  onSelectDay: (id: string) => void
}

export function DayTab({ days, activeDay, todayDayId, onSelectDay }: DayTabProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {days.map(day => {
        const isToday = day.id === todayDayId
        const isActive = activeDay === day.id

        return (
          <button
            key={day.id}
            onClick={() => onSelectDay(day.id)}
            className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
              isActive
                ? 'bg-text-main text-bg-dark border-text-main shadow-sm'
                : 'bg-bg-elevated border-border-main text-text-muted hover:border-text-muted'
            }`}
          >
            <span>{day.label}</span>
            {isToday && (
              <span
                className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-black text-accent' : 'bg-accent/20 text-accent'
                }`}
              >
                Hoy
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
