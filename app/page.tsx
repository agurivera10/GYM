'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DayTab } from '@/components/DayTab'
import { ExerciseCard, ExerciseHistoryData } from '@/components/ExerciseCard'
import { BottomSheet } from '@/components/BottomSheet'
import { StickyTimer } from '@/components/StickyTimer'
import { FitnessGlossaryModal } from '@/components/FitnessGlossaryModal'
import { EditRoutineModal } from '@/components/EditRoutineModal'
import { ExercisePickerModal } from '@/components/ExercisePickerModal'
import { WorkoutDay, getExerciseDetails } from '@/lib/data'
import { getCustomWorkoutDays, getAllExercisesMap } from '@/lib/routineStore'
import { Check, BarChart2, LogIn, HelpCircle, Settings2, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { finishWorkoutSession, fetchExerciseHistory } from '@/lib/actions'

function getTodayInfo() {
  const day = new Date().getDay() // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const names = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const map: Record<number, string> = {
    1: 'd1', // Lunes -> Pierna/Glúteo
    2: 'd2', // Martes -> Empuje
    3: 'd3', // Miércoles -> Piernas Máquina
    4: 'd4', // Jueves -> Tirón
    5: 'd5', // Viernes -> Full Body
  }
  return {
    dayId: map[day] || 'd1',
    isWeekend: day === 0 || day === 6,
    dayName: names[day]
  }
}

export default function Home() {
  const [todayInfo, setTodayInfo] = useState({ dayId: 'd1', isWeekend: false, dayName: 'Lunes' })
  const [routineDays, setRoutineDays] = useState<WorkoutDay[]>([])
  const [activeDay, setActiveDay] = useState('d1')
  const [infoExercise, setInfoExercise] = useState<any | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [historyData, setHistoryData] = useState<Record<string, ExerciseHistoryData>>({})
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [editRoutineOpen, setEditRoutineOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)

  // Extra exercises added on-the-fly to the current workout session
  const [extraExercisesByDay, setExtraExercisesByDay] = useState<Record<string, string[]>>({})

  // Cargar días de rutina personalizados
  useEffect(() => {
    const loadDays = () => {
      const days = getCustomWorkoutDays()
      setRoutineDays(days)
    }
    loadDays()

    window.addEventListener('custom-routine-updated', loadDays)
    return () => window.removeEventListener('custom-routine-updated', loadDays)
  }, [])

  // Detección automática del día actual al cargar
  useEffect(() => {
    const info = getTodayInfo()
    setTodayInfo(info)
    setActiveDay(info.dayId)
  }, [])

  // Obtener usuario autenticado
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  const currentDayData = routineDays.find(d => d.id === activeDay) || routineDays[0]
  const allExercises = getAllExercisesMap()
  const todayExtras = extraExercisesByDay[activeDay] || []

  // Cargar historial previo y récords (PR) de los ejercicios, alternativos y extras del día activo
  useEffect(() => {
    if (!userId || !currentDayData) return

    const allExercisesToFetch = [
      ...currentDayData.exercises,
      ...(currentDayData.alternatives || []),
      ...todayExtras
    ]

    fetchExerciseHistory(userId, allExercisesToFetch)
      .then(res => {
        setHistoryData(res)
      })
      .catch(err => {
        console.error('Error al cargar historial:', err)
      })
  }, [userId, activeDay, currentDayData, todayExtras])

  const handleFinish = async () => {
    if (window.confirm('¿Querés marcar esta sesión como completada?')) {
      if (userId && currentDayData) {
        await finishWorkoutSession(userId, activeDay)
        // Refrescar historial
        const res = await fetchExerciseHistory(userId, [
          ...currentDayData.exercises,
          ...todayExtras
        ])
        setHistoryData(res)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleAddExtraExerciseToday = (exerciseId: string) => {
    setExtraExercisesByDay(prev => {
      const current = prev[activeDay] || []
      if (current.includes(exerciseId)) return prev
      return { ...prev, [activeDay]: [...current, exerciseId] }
    })
  }

  const handleRemoveExtraExerciseToday = (exerciseId: string) => {
    setExtraExercisesByDay(prev => ({
      ...prev,
      [activeDay]: (prev[activeDay] || []).filter(id => id !== exerciseId)
    }))
  }

  if (!currentDayData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-muted">
        Cargando rutina...
      </div>
    )
  }

  const allActiveIds = [
    ...currentDayData.exercises,
    ...(currentDayData.alternatives || []),
    ...todayExtras
  ]

  return (
    <div className="min-h-screen">
      <header className="bg-[#141415]/85 backdrop-blur-md pt-6 pb-4 px-5 border-b border-border-main sticky top-0 z-40">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="bg-gradient-to-br from-accent to-[#28A745] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase inline-block mb-2">
              Pro Tracking V7
            </div>
            <h1 className="text-2xl font-extrabold">Recomposición Guiada</h1>
          </div>
          <div className="flex gap-2 mt-1">
            {/* Botón Personalizar Rutina */}
            <button
              onClick={() => setEditRoutineOpen(true)}
              className="bg-bg-elevated p-2.5 rounded-full text-text-muted border border-border-main hover:text-accent transition-colors"
              title="Personalizar rutina (agregar/quitar ejercicios)"
            >
              <Settings2 className="w-5 h-5" />
            </button>

            {/* Botón de Guía para Principiantes */}
            <button
              onClick={() => setGlossaryOpen(true)}
              className="bg-bg-elevated p-2.5 rounded-full text-text-muted border border-border-main hover:text-accent transition-colors"
              title="Glosario y Guía para principiantes"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {!userId && (
              <Link
                href="/login"
                className="bg-bg-elevated p-2.5 rounded-full text-text-muted border border-border-main"
                title="Iniciar sesión"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
            <Link
              href="/dashboard"
              className="bg-bg-elevated p-2.5 rounded-full text-accent border border-border-main"
              title="Ver estadísticas y calendario"
            >
              <BarChart2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <DayTab 
          days={routineDays.map(d => ({ id: d.id, label: d.label }))}
          activeDay={activeDay}
          todayDayId={todayInfo.dayId}
          onSelectDay={setActiveDay}
        />
      </header>

      <AnimatePresence mode="wait">
        <motion.main 
          key={activeDay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-accent">{currentDayData.title}</h2>
                {activeDay === todayInfo.dayId && !todayInfo.isWeekend && (
                  <span className="bg-accent/15 text-accent text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-accent/30">
                    📅 Rutina de Hoy ({todayInfo.dayName})
                  </span>
                )}
              </div>
              {todayInfo.isWeekend && activeDay === 'd1' && (
                <p className="text-[11px] text-text-muted mt-1">
                  🏖️ Fin de semana (descanso). Te dejamos preparado el Lunes.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditRoutineOpen(true)}
                className="bg-bg-card hover:bg-bg-elevated border border-border-main text-text-muted hover:text-accent px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-colors"
                title="Editar los ejercicios de este día"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editar Rutina</span>
              </button>

              {userId && (
                <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/30 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-[10px] text-accent font-bold uppercase">Conectado</span>
                </div>
              )}
            </div>
          </div>
          
          {!userId && (
            <div className="bg-blue/10 border border-blue/30 rounded-xl p-3 mb-4 flex items-center gap-3">
              <LogIn className="w-5 h-5 text-blue shrink-0" />
              <p className="text-sm text-blue">
                <Link href="/login" className="font-bold underline">Iniciá sesión</Link> para guardar tu progreso automáticamente.
              </p>
            </div>
          )}

          {/* Lista de Ejercicios Principales */}
          {currentDayData.exercises.map((exId, index) => {
            const details = allExercises[exId] || getExerciseDetails(exId)
            const displayDetails = { ...details, title: `${index + 1}. ${details.title}` }
            
            return (
              <ExerciseCard
                key={`${activeDay}-${exId}`}
                exerciseId={exId}
                details={displayDetails}
                onOpenInfo={(id) => setInfoExercise(allExercises[id] || getExerciseDetails(id))}
                userId={userId ?? undefined}
                dayId={activeDay}
                history={historyData[exId]}
                onOpenGlossary={() => setGlossaryOpen(true)}
              />
            )
          })}

          {/* Ejercicios Extras sumados en el día */}
          {todayExtras.length > 0 && (
            <div className="mt-5 mb-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⭐</span>
                  <p className="text-xs font-extrabold text-accent uppercase tracking-wider">
                    Ejercicios Extras Agregados Hoy ({todayExtras.length})
                  </p>
                </div>
                <span className="text-[10px] text-text-muted">Combinados en esta sesión</span>
              </div>

              {todayExtras.map((extraId, idx) => {
                const details = allExercises[extraId] || getExerciseDetails(extraId)
                const displayDetails = { ...details, title: `Extra: ${details.title}` }

                return (
                  <div key={`extra-${extraId}`} className="relative group">
                    <ExerciseCard
                      exerciseId={extraId}
                      details={displayDetails}
                      onOpenInfo={(id) => setInfoExercise(allExercises[id] || getExerciseDetails(id))}
                      userId={userId ?? undefined}
                      dayId={activeDay}
                      history={historyData[extraId]}
                      onOpenGlossary={() => setGlossaryOpen(true)}
                    />
                    <button
                      onClick={() => handleRemoveExtraExerciseToday(extraId)}
                      className="text-xs text-text-muted hover:text-red px-3 py-1 -mt-2 mb-3 inline-block transition-colors"
                    >
                      × Quitar este ejercicio extra de hoy
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Botón para agregar ejercicio extra a la sesión de hoy */}
          <div className="mt-3 mb-4">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full bg-accent/10 border border-dashed border-accent/40 hover:bg-accent/20 text-accent rounded-2xl p-4 flex items-center justify-center gap-2 text-xs font-extrabold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Agregar ejercicio extra a la sesión de hoy</span>
            </button>
          </div>

          {/* Sección de Ejercicios Alternativos */}
          {currentDayData.alternatives && currentDayData.alternatives.length > 0 && (
            <div className="mt-4 mb-4">
              <button
                type="button"
                onClick={() => setShowAlternatives(prev => !prev)}
                className="w-full bg-bg-card border border-border-main hover:border-accent/50 rounded-2xl p-4 flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg">🔄</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-text-main">
                      Ejercicios Alternativos ({currentDayData.alternatives.length})
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Por si alguna máquina está ocupada en el gimnasio
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                  {showAlternatives ? 'Ocultar ▲' : 'Ver opciones ▼'}
                </span>
              </button>

              {showAlternatives && (
                <div className="mt-4 flex flex-col gap-1">
                  <div className="bg-bg-elevated/60 border border-border-main/50 rounded-xl p-3 mb-3 text-xs text-text-muted">
                    💡 <strong className="text-text-main">Consejo:</strong> Podés hacer cualquiera de estos si la máquina principal está en uso. ¡Tus series y récords también se guardarán automáticamente!
                  </div>
                  {currentDayData.alternatives.map((altId, altIdx) => {
                    const details = allExercises[altId] || getExerciseDetails(altId)
                    const displayDetails = { ...details, title: `Alt ${altIdx + 1}. ${details.title}` }

                    return (
                      <ExerciseCard
                        key={`${activeDay}-alt-${altId}`}
                        exerciseId={altId}
                        details={displayDetails}
                        onOpenInfo={(id) => setInfoExercise(allExercises[id] || getExerciseDetails(id))}
                        userId={userId ?? undefined}
                        dayId={activeDay}
                        history={historyData[altId]}
                        onOpenGlossary={() => setGlossaryOpen(true)}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <button 
            className="block w-full bg-text-main text-bg-dark border-none p-4 rounded-xl text-base font-bold mt-8 mb-5 cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-transform"
            onClick={handleFinish}
          >
            <Check className="w-5 h-5" />
            Completar Sesión
          </button>
        </motion.main>
      </AnimatePresence>

      <BottomSheet
        isOpen={!!infoExercise}
        onClose={() => setInfoExercise(null)}
        exercise={infoExercise}
      />

      <FitnessGlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
      />

      <EditRoutineModal
        isOpen={editRoutineOpen}
        onClose={() => setEditRoutineOpen(false)}
        initialDayId={activeDay}
      />

      <ExercisePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectExercise={handleAddExtraExerciseToday}
        excludedExerciseIds={allActiveIds}
        title="Sumar Ejercicio a la Sesión de Hoy"
        subtitle="Elegí cualquier ejercicio del catálogo para entrenar hoy"
      />

      <StickyTimer />
    </div>
  )
}
