'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DayTab } from '@/components/DayTab'
import { ExerciseCard, ExerciseHistoryData } from '@/components/ExerciseCard'
import { BottomSheet } from '@/components/BottomSheet'
import { StickyTimer } from '@/components/StickyTimer'
import { FitnessGlossaryModal } from '@/components/FitnessGlossaryModal'
import { workoutDays, getExerciseDetails } from '@/lib/data'
import { Check, BarChart2, LogIn, HelpCircle } from 'lucide-react'
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
  const [activeDay, setActiveDay] = useState(workoutDays[0].id)
  const [infoExercise, setInfoExercise] = useState<any | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [historyData, setHistoryData] = useState<Record<string, ExerciseHistoryData>>({})
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [showAlternatives, setShowAlternatives] = useState(false)

  const currentDayData = workoutDays.find(d => d.id === activeDay)!

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

  // Cargar historial previo y récords (PR) de los ejercicios y alternativos del día activo
  useEffect(() => {
    if (!userId || !currentDayData) return

    const allExercisesToFetch = [
      ...currentDayData.exercises,
      ...(currentDayData.alternatives || [])
    ]

    fetchExerciseHistory(userId, allExercisesToFetch)
      .then(res => {
        setHistoryData(res)
      })
      .catch(err => {
        console.error('Error al cargar historial:', err)
      })
  }, [userId, activeDay])

  const handleFinish = async () => {
    if (window.confirm('¿Querés marcar esta sesión como completada?')) {
      if (userId) {
        await finishWorkoutSession(userId, activeDay)
        // Refrescar historial
        const res = await fetchExerciseHistory(userId, currentDayData.exercises)
        setHistoryData(res)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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
            {/* Botón de Guía para Principiantes */}
            <button
              onClick={() => setGlossaryOpen(true)}
              className="bg-bg-elevated p-2.5 rounded-full text-text-muted border border-border-main hover:text-accent"
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
          days={workoutDays.map(d => ({ id: d.id, label: d.label }))}
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
            {userId && (
              <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/30 px-2 py-1 rounded-full shrink-0">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[10px] text-accent font-bold uppercase">Conectado</span>
              </div>
            )}
          </div>
          
          {!userId && (
            <div className="bg-blue/10 border border-blue/30 rounded-xl p-3 mb-4 flex items-center gap-3">
              <LogIn className="w-5 h-5 text-blue shrink-0" />
              <p className="text-sm text-blue">
                <Link href="/login" className="font-bold underline">Iniciá sesión</Link> para guardar tu progreso automáticamente.
              </p>
            </div>
          )}

          {currentDayData.exercises.map((exId, index) => {
            const details = getExerciseDetails(exId)
            const displayDetails = { ...details, title: `${index + 1}. ${details.title}` }
            
            return (
              <ExerciseCard
                key={`${activeDay}-${exId}`}
                exerciseId={exId}
                details={displayDetails}
                onOpenInfo={(id) => setInfoExercise(getExerciseDetails(id))}
                userId={userId ?? undefined}
                dayId={activeDay}
                history={historyData[exId]}
                onOpenGlossary={() => setGlossaryOpen(true)}
              />
            )
          })}
          {/* Sección de Ejercicios Alternativos */}
          {currentDayData.alternatives && currentDayData.alternatives.length > 0 && (
            <div className="mt-6 mb-4">
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
                    const details = getExerciseDetails(altId)
                    const displayDetails = { ...details, title: `Alt ${altIdx + 1}. ${details.title}` }

                    return (
                      <ExerciseCard
                        key={`${activeDay}-alt-${altId}`}
                        exerciseId={altId}
                        details={displayDetails}
                        onOpenInfo={(id) => setInfoExercise(getExerciseDetails(id))}
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
            className="block w-full bg-text-main text-bg-dark border-none p-4 rounded-xl text-base font-bold mt-8 mb-5 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
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

      <StickyTimer />
    </div>
  )
}
