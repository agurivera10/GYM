'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DayTab } from '@/components/DayTab'
import { ExerciseCard } from '@/components/ExerciseCard'
import { BottomSheet } from '@/components/BottomSheet'
import { StickyTimer } from '@/components/StickyTimer'
import { workoutDays, getExerciseDetails } from '@/lib/data'
import { Check, BarChart2, LogIn } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { finishWorkoutSession } from '@/lib/actions'

export default function Home() {
  const [activeDay, setActiveDay] = useState(workoutDays[0].id)
  const [infoExercise, setInfoExercise] = useState<any | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  const currentDayData = workoutDays.find(d => d.id === activeDay)!

  const handleFinish = async () => {
    if (window.confirm('¿Querés marcar esta sesión como completada?')) {
      if (userId) {
        await finishWorkoutSession(userId, activeDay)
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
            {!userId && (
              <Link href="/login" className="bg-bg-elevated p-2.5 rounded-full text-text-muted border border-border-main">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
            <Link href="/dashboard" className="bg-bg-elevated p-2.5 rounded-full text-accent border border-border-main">
              <BarChart2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <DayTab 
          days={workoutDays.map(d => ({ id: d.id, label: d.label }))}
          activeDay={activeDay}
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
            <h2 className="text-xl font-bold text-accent">{currentDayData.title}</h2>
            {userId && (
              <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/30 px-2 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[10px] text-accent font-bold uppercase">Guardando</span>
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
              />
            )
          })}

          <button 
            className="block w-full bg-text-main text-bg-dark border-none p-4 rounded-xl text-base font-bold mt-8 mb-5 cursor-pointer flex items-center justify-center gap-2"
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

      <StickyTimer />
    </div>
  )
}
