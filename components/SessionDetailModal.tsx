'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit3, Trash2, Check, Loader2, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { exerciseDB } from '@/lib/data'
import { getAllExercisesMap } from '@/lib/routineStore'
import { updateSessionLogs, deleteSession } from '@/app/dashboard/actions'
import { ExercisePickerModal } from './ExercisePickerModal'

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
  userId: string | null
  onSessionUpdated?: () => void
}

export function SessionDetailModal({
  isOpen,
  onClose,
  sessionId,
  dayId,
  date,
  logs,
  userId,
  onSessionUpdated,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  
  // Editable state: { [exercise_id]: { set_number, weight, reps }[] }
  const [editData, setEditData] = useState<Record<string, { set_number: number; weight: string; reps: string }[]>>({})

  const allExercises = getAllExercisesMap()

  // Initialize editable state whenever logs change
  useEffect(() => {
    const grouped: Record<string, { set_number: number; weight: string; reps: string }[]> = {}
    logs.forEach(log => {
      if (!grouped[log.exercise_id]) grouped[log.exercise_id] = []
      grouped[log.exercise_id].push({
        set_number: log.set_number,
        weight: (log.weight ?? 0).toString(),
        reps: (log.reps ?? 0).toString(),
      })
    })
    setEditData(grouped)
    setIsEditing(false)
  }, [logs, isOpen])

  const dayNames: Record<string, string> = {
    d1: 'Lunes: Piernas / Glúteos',
    d2: 'Martes: Empuje (Pecho / Hombro / Tríceps)',
    d3: 'Miércoles: Piernas (Todo Máquina)',
    d4: 'Jueves: Tirón (Espalda / Bíceps)',
    d5: 'Viernes: Full Body',
  }

  const handleUpdateField = (exerciseId: string, setIdx: number, field: 'weight' | 'reps', value: string) => {
    setEditData(prev => {
      const exerciseSets = [...(prev[exerciseId] || [])]
      exerciseSets[setIdx] = { ...exerciseSets[setIdx], [field]: value }
      return { ...prev, [exerciseId]: exerciseSets }
    })
  }

  const handleAddSet = (exerciseId: string) => {
    setEditData(prev => {
      const current = prev[exerciseId] || []
      const nextSetNum = current.length + 1
      const lastSet = current[current.length - 1]
      return {
        ...prev,
        [exerciseId]: [
          ...current,
          {
            set_number: nextSetNum,
            weight: lastSet ? lastSet.weight : '',
            reps: lastSet ? lastSet.reps : '',
          },
        ],
      }
    })
  }

  const handleRemoveSet = (exerciseId: string, setIdx: number) => {
    setEditData(prev => {
      const filtered = (prev[exerciseId] || []).filter((_, i) => i !== setIdx)
      // Renumber
      const renumbered = filtered.map((s, i) => ({ ...s, set_number: i + 1 }))
      return { ...prev, [exerciseId]: renumbered }
    })
  }

  const handleAddExercise = (exerciseId: string) => {
    setEditData(prev => {
      if (prev[exerciseId]) return prev
      return {
        ...prev,
        [exerciseId]: [{ set_number: 1, weight: '', reps: '' }]
      }
    })
  }

  const handleRemoveExercise = (exerciseId: string) => {
    setEditData(prev => {
      const copy = { ...prev }
      delete copy[exerciseId]
      return copy
    })
  }

  const handleSave = async () => {
    if (!sessionId || !userId) return
    setSaving(true)

    // Flatten all sets into a clean array
    const updatedSets: { exerciseId: string; setNumber: number; weight: number; reps: number }[] = []
    Object.entries(editData).forEach(([exerciseId, sets]) => {
      sets.forEach(s => {
        const w = parseFloat(s.weight) || 0
        const r = parseInt(s.reps) || 0
        if (w > 0 || r > 0) {
          updatedSets.push({
            exerciseId,
            setNumber: s.set_number,
            weight: w,
            reps: r,
          })
        }
      })
    })

    const res = await updateSessionLogs(sessionId, userId, updatedSets)
    setSaving(false)

    if (res.success) {
      setIsEditing(false)
      if (onSessionUpdated) onSessionUpdated()
    } else {
      alert('Error al guardar: ' + res.error)
    }
  }

  const handleDeleteSession = async () => {
    if (!sessionId || !userId) return
    if (!window.confirm('¿Seguro que querés eliminar esta sesión de tu historial?')) return

    setDeleting(true)
    const res = await deleteSession(sessionId, userId)
    setDeleting(false)

    if (res.success) {
      onClose()
      if (onSessionUpdated) onSessionUpdated()
    } else {
      alert('Error al eliminar: ' + res.error)
    }
  }

  return (
    <>
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
              className="fixed bottom-0 left-0 w-full max-h-[88vh] bg-bg-elevated rounded-t-3xl z-[101] flex flex-col"
            >
              <div className="w-10 h-1.5 bg-[#3A3A3C] rounded-full mx-auto my-3 shrink-0" />

              {/* Header */}
              <div className="px-5 pb-4 border-b border-border-main flex justify-between items-center shrink-0">
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase">
                    {date ? format(new Date(date + 'T12:00:00'), "EEEE d 'de' MMMM, yyyy", { locale: es }) : ''}
                  </p>
                  <p className="text-lg font-extrabold text-text-main">
                    {dayId ? dayNames[dayId] ?? dayId : 'Sesión'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-bg-card hover:bg-bg-elevated border border-border-main text-accent px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                        title="Editar pesos y repeticiones"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={handleDeleteSession}
                        disabled={deleting}
                        className="bg-red/10 border border-red/20 text-red hover:bg-red/20 p-2 rounded-xl text-xs flex items-center justify-center transition-colors"
                        title="Eliminar sesión"
                      >
                        {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-text-muted text-xs font-bold px-2 py-1 hover:text-text-main"
                    >
                      Cancelar
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="bg-[#2C2C2E] text-text-muted hover:text-text-main w-8 h-8 rounded-full flex items-center justify-center ml-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-5 pb-[max(40px,env(safe-area-inset-bottom))] flex flex-col gap-4">
                {isEditing && (
                  <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 text-xs text-accent font-semibold flex items-center gap-2">
                    <span>✏️ Modo edición: Modificá kilos, sumá ejercicios de otros días y tocá "Guardar Cambios".</span>
                  </div>
                )}

                {Object.keys(editData).length === 0 ? (
                  <p className="text-text-muted text-sm text-center mt-8">No hay series registradas para esta sesión.</p>
                ) : (
                  Object.entries(editData).map(([exId, sets]) => {
                    const ex = allExercises[exId] || exerciseDB[exId]
                    return (
                      <div key={exId} className="bg-bg-card border border-border-main rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg shrink-0">
                              {ex?.icon ?? '💪'}
                            </span>
                            <div>
                              <p className="text-sm font-bold text-text-main">{ex?.title ?? exId}</p>
                              <p className="text-[10px] text-text-muted">{ex?.target ?? 'General'}</p>
                            </div>
                          </div>
                          {isEditing && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAddSet(exId)}
                                className="text-[11px] text-accent font-extrabold flex items-center gap-1 hover:underline"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Serie</span>
                              </button>
                              <button
                                onClick={() => handleRemoveExercise(exId)}
                                className="text-text-muted hover:text-red p-1 transition-colors"
                                title="Eliminar ejercicio de la sesión"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          {sets.map((s, idx) => {
                            if (isEditing) {
                              return (
                                <div key={idx} className="flex items-center gap-2 pt-2 border-t border-border-main/50">
                                  <span className="text-xs text-text-muted font-bold w-9">S.{s.set_number}</span>
                                  <div className="flex-1 flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      value={s.weight}
                                      placeholder="kg"
                                      onChange={e => handleUpdateField(exId, idx, 'weight', e.target.value)}
                                      className="w-full bg-bg-elevated border border-border-main text-text-main rounded-lg p-2 text-sm text-center font-semibold focus:outline-none focus:border-accent"
                                    />
                                    <span className="text-xs text-text-muted">kg</span>
                                  </div>
                                  <div className="flex-1 flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={s.reps}
                                      placeholder="reps"
                                      onChange={e => handleUpdateField(exId, idx, 'reps', e.target.value)}
                                      className="w-full bg-bg-elevated border border-border-main text-text-main rounded-lg p-2 text-sm text-center font-semibold focus:outline-none focus:border-accent"
                                    />
                                    <span className="text-xs text-text-muted">reps</span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveSet(exId, idx)}
                                    className="text-text-muted hover:text-red p-1"
                                    title="Quitar serie"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )
                            }

                            const wNum = parseFloat(s.weight) || 0
                            const rNum = parseInt(s.reps) || 0

                            return (
                              <div key={idx} className="flex items-center justify-between text-sm py-1 border-t border-border-main/40">
                                <span className="text-text-muted font-semibold w-12 text-xs">S. {s.set_number}</span>
                                <span className="text-text-main font-bold">{wNum > 0 ? `${wNum} kg` : '—'}</span>
                                <span className="text-text-muted text-xs">×</span>
                                <span className="text-text-main font-bold">{rNum > 0 ? `${rNum} reps` : '—'}</span>
                                <span className="text-accent text-xs font-bold">
                                  {wNum > 0 && rNum > 0 ? `${Math.round(wNum * rNum)} vol` : ''}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}

                {/* Botón para agregar ejercicio en modo edición */}
                {isEditing && (
                  <button
                    onClick={() => setPickerOpen(true)}
                    className="w-full bg-accent/10 border border-dashed border-accent/40 hover:bg-accent/20 text-accent rounded-xl p-3.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors my-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Agregar otro ejercicio a esta sesión</span>
                  </button>
                )}

                {/* Botón de Guardar en modo edición */}
                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-accent text-black font-extrabold p-4 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 mt-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Guardando en Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Guardar y Actualizar Rutina</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ExercisePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectExercise={handleAddExercise}
        excludedExerciseIds={Object.keys(editData)}
        title="Agregar Ejercicio a la Sesión"
        subtitle="Podés seleccionar ejercicios de cualquier día o grupo muscular"
      />
    </>
  )
}
