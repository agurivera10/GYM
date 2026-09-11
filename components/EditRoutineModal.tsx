'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Check, Dumbbell, Settings2 } from 'lucide-react'
import { WorkoutDay } from '@/lib/data'
import {
  getCustomWorkoutDays,
  saveCustomWorkoutDays,
  resetCustomWorkoutDays,
  getAllExercisesMap
} from '@/lib/routineStore'
import { ExercisePickerModal } from './ExercisePickerModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  onRoutineUpdated?: () => void
  initialDayId?: string
}

export function EditRoutineModal({
  isOpen,
  onClose,
  onRoutineUpdated,
  initialDayId = 'd1'
}: Props) {
  const [days, setDays] = useState<WorkoutDay[]>([])
  const [activeDayId, setActiveDayId] = useState<string>(initialDayId)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerTarget, setPickerTarget] = useState<'exercises' | 'alternatives'>('exercises')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Load custom days when opened
  useEffect(() => {
    if (isOpen) {
      setDays(getCustomWorkoutDays())
      if (initialDayId) {
        setActiveDayId(initialDayId)
      }
      setSavedSuccess(false)
    }
  }, [isOpen, initialDayId])

  const allExercises = getAllExercisesMap()
  const activeDay = days.find(d => d.id === activeDayId) || days[0]

  const handleMoveExercise = (index: number, direction: 'up' | 'down', isAlt: boolean = false) => {
    if (!activeDay) return
    const listKey = isAlt ? 'alternatives' : 'exercises'
    const list = [...(activeDay[listKey] || [])]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= list.length) return

    const temp = list[index]
    list[index] = list[targetIdx]
    list[targetIdx] = temp

    const updated = days.map(d => (d.id === activeDay.id ? { ...d, [listKey]: list } : d))
    setDays(updated)
  }

  const handleRemoveExercise = (exerciseId: string, isAlt: boolean = false) => {
    if (!activeDay) return
    const listKey = isAlt ? 'alternatives' : 'exercises'
    const list = (activeDay[listKey] || []).filter(id => id !== exerciseId)
    const updated = days.map(d => (d.id === activeDay.id ? { ...d, [listKey]: list } : d))
    setDays(updated)
  }

  const handleAddExercise = (exerciseId: string) => {
    if (!activeDay) return
    const listKey = pickerTarget === 'alternatives' ? 'alternatives' : 'exercises'
    const currentList = activeDay[listKey] || []
    if (currentList.includes(exerciseId)) return

    const updatedList = [...currentList, exerciseId]
    const updated = days.map(d => (d.id === activeDay.id ? { ...d, [listKey]: updatedList } : d))
    setDays(updated)
  }

  const handleSave = () => {
    saveCustomWorkoutDays(days)
    setSavedSuccess(true)
    if (onRoutineUpdated) onRoutineUpdated()
    setTimeout(() => {
      setSavedSuccess(false)
      onClose()
    }, 900)
  }

  const handleReset = () => {
    if (window.confirm('¿Seguro que querés volver a la rutina predeterminada original? Se desharán tus cambios.')) {
      const def = resetCustomWorkoutDays()
      setDays(def)
      if (onRoutineUpdated) onRoutineUpdated()
    }
  }

  const openPickerFor = (target: 'exercises' | 'alternatives') => {
    setPickerTarget(target)
    setPickerOpen(true)
  }

  if (!activeDay) return null

  const currentExcluded = [
    ...(activeDay.exercises || []),
    ...(activeDay.alternatives || [])
  ]

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
              className="fixed bottom-0 left-0 w-full max-h-[92vh] bg-bg-elevated rounded-t-3xl z-[101] flex flex-col shadow-2xl"
            >
              <div className="w-10 h-1.5 bg-[#3A3A3C] rounded-full mx-auto my-3 shrink-0" />

              {/* Header */}
              <div className="px-5 pb-3 border-b border-border-main flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-base font-extrabold text-text-main">Personalizar Rutinas</p>
                    <p className="text-xs text-text-muted">Agregá, quitá y reordená ejercicios por día</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="bg-[#2C2C2E] text-text-muted hover:text-text-main w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Days Selector Tabs */}
              <div className="flex gap-2 px-5 py-3 border-b border-border-main overflow-x-auto no-scrollbar shrink-0">
                {days.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDayId(d.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeDayId === d.id
                        ? 'bg-accent text-black shadow-md'
                        : 'bg-bg-card text-text-muted border border-border-main hover:text-text-main'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Content Body */}
              <div className="overflow-y-auto flex-1 p-5 pb-[max(32px,env(safe-area-inset-bottom))] flex flex-col gap-5">
                <div>
                  <h3 className="text-sm font-bold text-accent mb-1">{activeDay.title}</h3>
                  <p className="text-xs text-text-muted">
                    Los cambios que hagas aquí se aplicarán a tu rutina semanal.
                  </p>
                </div>

                {/* Main Exercises Section */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Ejercicios Principales ({activeDay.exercises.length})
                    </span>
                  </div>

                  {activeDay.exercises.map((exId, idx) => {
                    const ex = allExercises[exId] || {
                      icon: '💪',
                      title: exId,
                      target: 'General'
                    }

                    return (
                      <div
                        key={exId}
                        className="bg-bg-card border border-border-main rounded-2xl p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-text-muted w-5 text-center">
                            {idx + 1}.
                          </span>
                          <span className="text-lg bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg shrink-0">
                            {ex.icon}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-text-main">{ex.title}</p>
                            <p className="text-xs text-text-muted">{ex.target}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveExercise(idx, 'up')}
                            className="p-1.5 text-text-muted hover:text-text-main disabled:opacity-20 transition-colors"
                            title="Mover arriba"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === activeDay.exercises.length - 1}
                            onClick={() => handleMoveExercise(idx, 'down')}
                            className="p-1.5 text-text-muted hover:text-text-main disabled:opacity-20 transition-colors"
                            title="Mover abajo"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(exId)}
                            className="p-1.5 text-text-muted hover:text-red transition-colors ml-1"
                            title="Quitar ejercicio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => openPickerFor('exercises')}
                    className="w-full bg-accent/10 border border-dashed border-accent/40 hover:bg-accent/20 text-accent rounded-xl p-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Ejercicio a {activeDay.label.split(':')[0]}</span>
                  </button>
                </div>

                {/* Alternative Exercises Section */}
                <div className="flex flex-col gap-2.5 pt-3 border-t border-border-main/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Ejercicios Alternativos ({(activeDay.alternatives || []).length})
                    </span>
                  </div>

                  {(activeDay.alternatives || []).map((altId, idx) => {
                    const ex = allExercises[altId] || {
                      icon: '🔄',
                      title: altId,
                      target: 'General'
                    }

                    return (
                      <div
                        key={altId}
                        className="bg-bg-card/70 border border-border-main rounded-2xl p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-text-muted w-5 text-center">
                            A{idx + 1}
                          </span>
                          <span className="text-lg bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg shrink-0">
                            {ex.icon}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-text-main">{ex.title}</p>
                            <p className="text-xs text-text-muted">{ex.target}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveExercise(idx, 'up', true)}
                            className="p-1.5 text-text-muted hover:text-text-main disabled:opacity-20 transition-colors"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (activeDay.alternatives?.length || 0) - 1}
                            onClick={() => handleMoveExercise(idx, 'down', true)}
                            className="p-1.5 text-text-muted hover:text-text-main disabled:opacity-20 transition-colors"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(altId, true)}
                            className="p-1.5 text-text-muted hover:text-red transition-colors ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => openPickerFor('alternatives')}
                    className="w-full bg-bg-card border border-dashed border-border-main hover:border-accent/40 text-text-muted hover:text-accent rounded-xl p-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Ejercicio Alternativo</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t border-border-main mt-auto">
                  <button
                    onClick={handleSave}
                    className="w-full bg-accent text-black font-extrabold p-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99]"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>¡Rutina guardada con éxito!</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-text-muted hover:text-red flex items-center justify-center gap-1 py-2 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer a la rutina original</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ExercisePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectExercise={handleAddExercise}
        excludedExerciseIds={currentExcluded}
        title={pickerTarget === 'alternatives' ? 'Agregar Alternativo' : `Agregar a ${activeDay.label}`}
        subtitle="Elegí cualquier ejercicio para sumarlo a este día"
      />
    </>
  )
}
