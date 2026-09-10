'use client'

import React from 'react'

interface DayTabProps {
  days: { id: string; label: string }[]
  activeDay: string
  onSelectDay: (id: string) => void
}

export function DayTab({ days, activeDay, onSelectDay }: DayTabProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {days.map(day => (
        <button
          key={day.id}
          onClick={() => onSelectDay(day.id)}
          className={`px-4 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors border ${
            activeDay === day.id
              ? 'bg-text-main text-bg-dark border-text-main'
              : 'bg-bg-elevated border-border-main text-text-muted'
          }`}
        >
          {day.label}
        </button>
      ))}
    </div>
  )
}
