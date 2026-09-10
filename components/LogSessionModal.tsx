'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CalendarDays, Check } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'
import { workoutDays, getExerciseDetails } from '@/lib/data'
import { logHistoricalSession, HistoricalSetInput } from '@/lib/historicalActions'

interface Props {
  isOpen: boolean
  onClose: () => void
  userId: string
  preselectedDate?: Date
}

export function LogSessionModal({ isOpen, onClose, userId, preselectedDate }: Props) {
  const [step, setStep] = useState<'date' | 'day' | 'sets'>('date')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(preselectedDate)
  const [selectedDayId, setSelectedDayId] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Sets data: { [exerciseId]: { [setNum]: { weight, reps } } }
  const [setsData, setSetsData] = useState<Record<string, Record<number, { weight: string; reps: string }>>>({})

  const selectedDay = workoutDays.find(d => d.id === selectedDayId)

  const handleClose = () => {
    setStep('date')
    setSelectedDate(undefined)
    setSelectedDayId('')
    setSetsData({})
    setSaved(false)
    onClose()
  }

  const handleSave = async () => {
    if (!selectedDate || !selectedDayId || !selectedDay) return
    setSaving(true)

    const sets: HistoricalSetInput[] = []
    for (const exId of selectedDay.exercises) {
      const exDetails = getExerciseDetails(exId)
      for (let s = 1; s <= exDetails.sets; s++) {
        sets.push({
          exerciseId: exId,
          setNumber: s,
          weight: setsData[exId]?.[s]?.weight ?? '',
          reps: setsData[exId]?.[s]?.reps ?? '',
        })
      }
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const result = await logHistoricalSession(userId, selectedDayId, dateStr, sets)

    setSaving(false)
    if (result.success) {
      setSaved(true)
      setTimeout(handleClose, 1500)
    }
  }

  const updateSet = (exId: string, setNum: number, field: 'weight' | 'reps', value: string) => {
    setSetsData(prev => ({
      ...prev,
      [exId]: {
        ...prev[exId],
        [setNum]: { ...prev[exId]?.[setNum], [field]: value }
      }
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full max-h-[92vh] bg-bg-elevated rounded-t-3xl z-[101] flex flex-col"
          >
            <div className="w-10 h-1.5 bg-[#3A3A3C] rounded-full mx-auto my-3 shrink-0" />

            {/* Header */}
            <div className="px-5 pb-4 border-b border-border-main flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-accent" />
                <p className="text-lg font-extrabold text-text-main">Registrar Sesión Pasada</p>
              </div>
              <button onClick={handleClose} className="bg-[#2C2C2E] text-text-muted w-8 h-8 rounded-full flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex gap-2 px-5 py-3 shrink-0">
              {['Fecha', 'Día', 'Series'].map((label, i) => {
                const stepMap = ['date', 'day', 'sets']
                const isActive = stepMap.indexOf(step) >= i
                return (
                  <div key={label} className="flex items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isActive ? 'bg-accent text-black' : 'bg-bg-card text-text-muted border border-border-main'}`}>
                      {i + 1}
                    </div>
                    <span className={`text-xs font-bold ${isActive ? 'text-text-main' : 'text-text-muted'}`}>{label}</span>
                    {i < 2 && <div className={`flex-1 h-px ${isActive ? 'bg-accent' : 'bg-border-main'}`} />}
                  </div>
                )
              })}
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 pb-[max(24px,env(safe-area-inset-bottom))]">
              {/* Step 1: Date */}
              {step === 'date' && (
                <div className="px-5 flex flex-col items-center">
                  <style>{`
                    .rdp { --rdp-accent-color: #32D74B; margin: 0; }
                    .rdp-day { color: #FFFFFF; font-size: 13px; font-weight: 600; border-radius: 50%; }
                    .rdp-day_button { width: 100%; height: 100%; background: transparent; border: none; cursor: pointer; color: inherit; border-radius: 50%; }
                    .rdp-outside { color: #48484A; }
                    .rdp-today { color: #32D74B !important; font-weight: 800; }
                    .rdp-caption_label { color: #fff; font-size: 15px; font-weight: 700; }
                    .rdp-nav_button { color: #8E8E93; }
                    .rdp-head_cell { color: #8E8E93; font-size: 11px; font-weight: 700; text-transform: uppercase; }
                    .rdp-selected .rdp-day_button { background: #32D74B; color: #000; font-weight: 800; }
                  `}</style>
                  <DayPicker
                    locale={es}
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ after: new Date() }}
                  />
                  <button
                    disabled={!selectedDate}
                    onClick={() => setStep('day')}
                    className="w-full bg-accent text-black font-bold p-4 rounded-xl mb-4 disabled:opacity-40"
                  >
                    {selectedDate ? `Continuar con ${format(selectedDate, "d 'de' MMMM", { locale: es })}` : 'Seleccioná una fecha'}
                  </button>
                </div>
              )}

              {/* Step 2: Select day type */}
              {step === 'day' && (
                <div className="px-5 py-4 flex flex-col gap-3">
                  <p className="text-sm text-text-muted mb-2">
                    ¿Qué rutina hiciste el <span className="text-text-main font-bold">{selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: es }) : ''}</span>?
                  </p>
                  {workoutDays.map(d => (
                    <button
                      key={d.id}
                      onClick={() => { setSelectedDayId(d.id); setStep('sets') }}
                      className="bg-bg-card border border-border-main rounded-xl p-4 text-left flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-text-main">{d.label}</p>
                        <p className="text-xs text-text-muted">{d.title}</p>
                      </div>
                      <div className="text-text-muted text-lg">→</div>
                    </button>
                  ))}
                  <button onClick={() => setStep('date')} className="text-sm text-text-muted text-center mt-2">← Cambiar fecha</button>
                </div>
              )}

              {/* Step 3: Enter sets */}
              {step === 'sets' && selectedDay && (
                <div className="px-5 py-4">
                  <p className="text-sm text-text-muted mb-4">
                    Ingresá los pesos y reps que hiciste. Podés dejar en blanco lo que no recuerdes.
                  </p>

                  {selectedDay.exercises.map(exId => {
                    const details = getExerciseDetails(exId)
                    return (
                      <div key={exId} className="bg-bg-card border border-border-main rounded-2xl p-4 mb-3">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg">{details.icon}</span>
                          <p className="text-sm font-bold text-text-main">{details.title}</p>
                        </div>
                        {Array.from({ length: details.sets }).map((_, i) => {
                          const setNum = i + 1
                          return (
                            <div key={setNum} className="flex items-center gap-2 py-2 border-t border-border-main">
                              <span className="text-xs text-text-muted font-bold w-8">S.{setNum}</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                placeholder="kg"
                                value={setsData[exId]?.[setNum]?.weight ?? ''}
                                onChange={e => updateSet(exId, setNum, 'weight', e.target.value)}
                                className="bg-bg-elevated border border-border-main text-text-main rounded-lg p-2 flex-1 text-base text-center focus:outline-none focus:border-accent placeholder:text-[#48484A] placeholder:text-sm"
                              />
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="reps"
                                value={setsData[exId]?.[setNum]?.reps ?? ''}
                                onChange={e => updateSet(exId, setNum, 'reps', e.target.value)}
                                className="bg-bg-elevated border border-border-main text-text-main rounded-lg p-2 flex-1 text-base text-center focus:outline-none focus:border-accent placeholder:text-[#48484A] placeholder:text-sm"
                              />
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}

                  <button onClick={() => setStep('day')} className="text-sm text-text-muted text-center w-full mb-3">← Cambiar día</button>

                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="w-full bg-accent text-black font-extrabold p-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saved
                      ? <><Check className="w-5 h-5" /> ¡Sesión guardada!</>
                      : saving
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
                      : 'Guardar Sesión'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
