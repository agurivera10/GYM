'use client'

import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import 'react-day-picker/style.css'

interface TrainedDay {
  date: string
  dayId: string
  sessionId: string
}

interface Props {
  trainedDays: TrainedDay[]
  onSelectDay: (sessionId: string, dayId: string, date: string) => void
  onSelectEmptyDay?: (date: Date) => void
}

export function HistoryCalendar({ trainedDays, onSelectDay, onSelectEmptyDay }: Props) {
  const trainedDates = trainedDays.map(d => new Date(d.date + 'T12:00:00'))

  const dayIdColors: Record<string, string> = {
    d1: '#32D74B',
    d2: '#0A84FF',
    d3: '#FF9F0A',
    d4: '#BF5AF2',
    d5: '#FF453A',
  }

  const handleDayClick = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0]
    const match = trainedDays.find(d => d.date === dateStr)
    if (match) {
      onSelectDay(match.sessionId, match.dayId, match.date)
    } else if (day <= new Date() && onSelectEmptyDay) {
      onSelectEmptyDay(day)
    }
  }

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-4 mb-4">
      <p className="text-xs text-text-muted uppercase font-bold mb-1">Historial</p>
      <p className="text-base font-extrabold text-text-main mb-4">Calendario de Sesiones</p>

      <div className="flex gap-3 flex-wrap mb-4">
        {Object.entries(dayIdColors).map(([id, color]) => (
          <div key={id} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-text-muted uppercase font-bold">{id}</span>
          </div>
        ))}
      </div>

      <style>{`
        .rdp {
          --rdp-accent-color: #32D74B;
          --rdp-accent-background-color: rgba(50,215,75,0.15);
          --rdp-day-width: 38px;
          --rdp-day-height: 38px;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .rdp-day {
          border-radius: 50%;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
        }
        .rdp-day_button {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
          font-size: inherit;
          font-weight: inherit;
          border-radius: 50%;
        }
        .rdp-outside { color: #48484A; }
        .rdp-today { color: #32D74B !important; font-weight: 800; }
        .rdp-caption_label { color: #fff; font-size: 15px; font-weight: 700; }
        .rdp-nav_button { color: #8E8E93; }
        .rdp-head_cell { color: #8E8E93; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .rdp-selected .rdp-day_button { background: rgba(50,215,75,0.2); color: #32D74B; }
      `}</style>

      <DayPicker
        locale={es}
        modifiers={{
          trained: trainedDates,
        }}
        modifiersStyles={{
          trained: {
            fontWeight: 800,
            border: '2px solid #32D74B',
            borderRadius: '50%',
          },
        }}
        onDayClick={handleDayClick}
      />

      <p className="text-xs text-text-muted text-center mt-2">
        Tocá un día marcado para ver el detalle de la sesión.
      </p>
    </div>
  )
}
