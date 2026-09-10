'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { exerciseDB } from '@/lib/data'

interface Log {
  exercise_id: string
  set_number: number
  weight: number | null
  reps: number | null
}

interface Props {
  isOpen: boolean
  onClose: () => void
  sessionId: string | null
  dayId: string | null
  date: string | null
  logs: Log[]
}

export function SessionDetailModal({ isOpen, onClose, dayId, date, logs }: Props) {
  // Group logs by exercise
  const grouped = logs.reduce((acc: Record<string, Log[]>, log) => {
    if (!acc[log.exercise_id]) acc[log.exercise_id] = []
    acc[log.exercise_id].push(log)
    return acc
  }, {})

  const dayNames: Record<string, string> = {
    d1: 'Torso Guiado',
    d2: 'Pierna Guiada',
    d3: 'Push (Empuje)',
    d4: 'Pull (Tracción)',
    d5: 'Core & Pierna',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full max-h-[85vh] bg-bg-elevated rounded-t-3xl z-[101] flex flex-col"
          >
            <div className="w-10 h-1.5 bg-[#3A3A3C] rounded-full mx-auto my-3 shrink-0" />

            <div className="px-5 pb-4 border-b border-border-main flex justify-between items-center shrink-0">
              <div>
                <p className="text-xs text-text-muted font-bold uppercase">
                  {date ? format(new Date(date + 'T12:00:00'), "EEEE d 'de' MMMM, yyyy", { locale: es }) : ''}
                </p>
                <p className="text-lg font-extrabold text-text-main">
                  {dayId ? dayNames[dayId] ?? dayId : ''}
                </p>
              </div>
              <button onClick={onClose} className="bg-[#2C2C2E] text-text-muted w-8 h-8 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 pb-[max(40px,env(safe-area-inset-bottom))] flex flex-col gap-4">
              {Object.keys(grouped).length === 0 ? (
                <p className="text-text-muted text-sm text-center mt-8">No hay series registradas para esta sesión.</p>
              ) : (
                Object.entries(grouped).map(([exId, sets]) => {
                  const ex = exerciseDB[exId]
                  return (
                    <div key={exId} className="bg-bg-card border border-border-main rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg shrink-0">
                          {ex?.icon ?? '💪'}
                        </span>
                        <p className="text-sm font-bold text-text-main">{ex?.title ?? exId}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {sets.map((s, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-text-muted font-semibold w-12">S. {s.set_number}</span>
                            <span className="text-text-main font-bold">{s.weight ?? '—'} kg</span>
                            <span className="text-text-muted">×</span>
                            <span className="text-text-main font-bold">{s.reps ?? '—'} reps</span>
                            <span className="text-accent text-xs font-bold">
                              {s.weight && s.reps ? `${Math.round(s.weight * s.reps)} vol` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
