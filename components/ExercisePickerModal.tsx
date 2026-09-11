'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Plus, Check, Dumbbell, Sparkles } from 'lucide-react'
import { exerciseDB, ExerciseInfo } from '@/lib/data'
import { MUSCLE_GROUPS } from '@/lib/fitness'
import { getAllExercisesMap, saveCustomExercise } from '@/lib/routineStore'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectExercise: (exerciseId: string) => void
  excludedExerciseIds?: string[]
  title?: string
  subtitle?: string
}

export function ExercisePickerModal({
  isOpen,
  onClose,
  onSelectExercise,
  excludedExerciseIds = [],
  title = 'Elegir Ejercicio',
  subtitle = 'Seleccioná un ejercicio del catálogo o creá uno nuevo'
}: Props) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCreatingCustom, setIsCreatingCustom] = useState(false)

  // Custom exercise form state
  const [customTitle, setCustomTitle] = useState('')
  const [customTarget, setCustomTarget] = useState('Piernas y Glúteos')
  const [customReps, setCustomReps] = useState('10-12')
  const [customSets, setCustomSets] = useState(3)
  const [customIcon, setCustomIcon] = useState('💪')

  // Get all available exercises (base + custom)
  const allExercises = useMemo(() => {
    return getAllExercisesMap()
  }, [isOpen])

  // Filter exercises by search and muscle group
  const filteredExercises = useMemo(() => {
    return Object.entries(allExercises).filter(([id, ex]) => {
      // Search term
      const matchesSearch =
        ex.title.toLowerCase().includes(search.toLowerCase()) ||
        ex.target.toLowerCase().includes(search.toLowerCase()) ||
        id.toLowerCase().includes(search.toLowerCase())

      if (!matchesSearch) return false

      // Category filter
      if (selectedCategory === 'all') return true

      const group = MUSCLE_GROUPS.find(g => g.id === selectedCategory)
      if (!group) return true

      return group.exercises.includes(id) || ex.target.toLowerCase().includes(group.name.toLowerCase())
    })
  }, [allExercises, search, selectedCategory])

  const handleSelect = (id: string) => {
    onSelectExercise(id)
    onClose()
  }

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customTitle.trim()) return

    const generatedId = `custom-${customTitle.toLowerCase().trim().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`
    const newEx: ExerciseInfo = {
      icon: customIcon || '💪',
      title: customTitle.trim(),
      guideUrl: 'https://musclewiki.com',
      target: customTarget,
      reps: customReps || '10-12',
      ref: 'Ajustar según nivel',
      sets: customSets || 3,
      tech: ['Mantené buena postura y respiración controlada.'],
      error: 'Usar impulso excesivo.',
      focus: 'Contracción muscular constante.'
    }

    saveCustomExercise(generatedId, newEx)
    onSelectExercise(generatedId)
    setIsCreatingCustom(false)
    setCustomTitle('')
    onClose()
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 w-full max-h-[90vh] bg-bg-elevated rounded-t-3xl z-[111] flex flex-col shadow-2xl"
          >
            <div className="w-10 h-1.5 bg-[#3A3A3C] rounded-full mx-auto my-3 shrink-0" />

            {/* Header */}
            <div className="px-5 pb-3 border-b border-border-main flex justify-between items-center shrink-0">
              <div>
                <p className="text-base font-extrabold text-text-main flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-accent" />
                  {title}
                </p>
                <p className="text-xs text-text-muted">{subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="bg-[#2C2C2E] text-text-muted hover:text-text-main w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter bar */}
            {!isCreatingCustom && (
              <div className="px-5 pt-3 pb-2 border-b border-border-main flex flex-col gap-2.5 shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o músculo (ej: prensa, hombro...)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-bg-card border border-border-main text-text-main rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-text-muted/60 focus:outline-none focus:border-accent"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main text-xs bg-[#3A3A3C] rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Muscle Category Filter Chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-accent text-black'
                        : 'bg-bg-card text-text-muted border border-border-main'
                    }`}
                  >
                    Todos
                  </button>
                  {MUSCLE_GROUPS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedCategory(g.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold shrink-0 flex items-center gap-1 transition-colors ${
                        selectedCategory === g.id
                          ? 'bg-accent text-black'
                          : 'bg-bg-card text-text-muted border border-border-main'
                      }`}
                    >
                      <span>{g.icon}</span>
                      <span>{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Body */}
            <div className="overflow-y-auto flex-1 p-5 pb-[max(32px,env(safe-area-inset-bottom))] flex flex-col gap-2.5">
              {isCreatingCustom ? (
                /* Formulario para crear ejercicio personalizado */
                <form onSubmit={handleCreateCustom} className="flex flex-col gap-4 bg-bg-card p-4 rounded-2xl border border-border-main">
                  <div className="flex items-center justify-between border-b border-border-main pb-2">
                    <p className="text-sm font-bold text-text-main flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-accent" />
                      Nuevo Ejercicio Personalizado
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCreatingCustom(false)}
                      className="text-xs text-text-muted hover:text-text-main"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted font-bold block mb-1">Nombre del Ejercicio *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Sentadilla Búlgara con Mancuernas"
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-main text-text-main rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-muted font-bold block mb-1">Ícono</label>
                      <select
                        value={customIcon}
                        onChange={e => setCustomIcon(e.target.value)}
                        className="w-full bg-bg-elevated border border-border-main text-text-main rounded-xl p-2.5 text-sm focus:outline-none focus:border-accent"
                      >
                        <option value="💪">💪 Mancuerna</option>
                        <option value="🦵">🦵 Pierna</option>
                        <option value="🍑">🍑 Glúteo</option>
                        <option value="🔙">🔙 Espalda</option>
                        <option value="🧱">🧱 Pecho</option>
                        <option value="🦅">🦅 Hombro</option>
                        <option value="🦾">🦾 Brazo</option>
                        <option value="🏋️">🏋️ Barra</option>
                        <option value="🧗">🧗 Funcional</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-text-muted font-bold block mb-1">Músculo Objetivo</label>
                      <input
                        type="text"
                        value={customTarget}
                        onChange={e => setCustomTarget(e.target.value)}
                        placeholder="Ej: Cuádriceps y Glúteo"
                        className="w-full bg-bg-elevated border border-border-main text-text-main rounded-xl p-2.5 text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-muted font-bold block mb-1">Series recomendadas</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={customSets}
                        onChange={e => setCustomSets(parseInt(e.target.value) || 3)}
                        className="w-full bg-bg-elevated border border-border-main text-text-main rounded-xl p-2.5 text-sm text-center focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-text-muted font-bold block mb-1">Reps objetivo</label>
                      <input
                        type="text"
                        value={customReps}
                        onChange={e => setCustomReps(e.target.value)}
                        placeholder="Ej: 10-12"
                        className="w-full bg-bg-elevated border border-border-main text-text-main rounded-xl p-2.5 text-sm text-center focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Crear y Seleccionar
                  </button>
                </form>
              ) : (
                <>
                  {/* Botón para crear ejercicio personalizado */}
                  <button
                    onClick={() => setIsCreatingCustom(true)}
                    className="w-full bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent rounded-xl p-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors mb-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>¿No encontrás el ejercicio? Creá uno personalizado</span>
                  </button>

                  {/* Listado de ejercicios */}
                  {filteredExercises.length === 0 ? (
                    <div className="text-center py-8 text-text-muted">
                      <p className="text-sm">No encontramos ningún ejercicio con ese nombre.</p>
                      <button
                        onClick={() => setIsCreatingCustom(true)}
                        className="text-accent underline text-xs font-bold mt-2"
                      >
                        Crear ejercicio personalizado ahora
                      </button>
                    </div>
                  ) : (
                    filteredExercises.map(([id, ex]) => {
                      const isAlreadyPresent = excludedExerciseIds.includes(id)

                      return (
                        <div
                          key={id}
                          onClick={() => !isAlreadyPresent && handleSelect(id)}
                          className={`bg-bg-card border rounded-2xl p-3.5 flex items-center justify-between transition-all ${
                            isAlreadyPresent
                              ? 'opacity-40 border-border-main cursor-not-allowed'
                              : 'border-border-main hover:border-accent/60 hover:bg-bg-card/80 cursor-pointer active:scale-[0.99]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl bg-[#2C2C2E] w-9 h-9 flex items-center justify-center rounded-xl shrink-0">
                              {ex.icon}
                            </span>
                            <div>
                              <p className="text-sm font-bold text-text-main">{ex.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-text-muted">{ex.target}</span>
                                <span className="text-[10px] bg-bg-elevated px-1.5 py-0.5 rounded text-text-muted">
                                  {ex.sets} × {ex.reps}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            {isAlreadyPresent ? (
                              <span className="text-[10px] text-text-muted bg-[#2C2C2E] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Agregado
                              </span>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-accent/15 text-accent border border-accent/30 flex items-center justify-center font-bold text-sm">
                                <Plus className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
