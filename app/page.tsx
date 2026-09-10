'use client'

import React, { useState } from 'react'
import { DayTab } from '@/components/DayTab'
import { ExerciseCard } from '@/components/ExerciseCard'
import { BottomSheet } from '@/components/BottomSheet'
import { StickyTimer } from '@/components/StickyTimer'
import { workoutDays, getExerciseDetails } from '@/lib/data'
import { Check } from 'lucide-react'

import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [activeDay, setActiveDay] = useState(workoutDays[0].id)
  const [infoExercise, setInfoExercise] = useState<any | null>(null)

  const currentDayData = workoutDays.find(d => d.id === activeDay)!

  return (
    <div className="min-h-screen">
      <header className="bg-[#141415]/85 backdrop-blur-md pt-6 pb-4 px-5 border-b border-border-main sticky top-0 z-40">
        <div className="bg-gradient-to-br from-accent to-[#28A745] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase inline-block mb-2">
          Pro Tracking V7
        </div>
        <h1 className="text-2xl font-extrabold mb-3">Recomposición Guiada</h1>
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
          <h2 className="text-xl font-bold text-accent mb-5">{currentDayData.title}</h2>
        
        {currentDayData.exercises.map((exId, index) => {
          const details = getExerciseDetails(exId)
          const displayDetails = { ...details, title: `${index + 1}. ${details.title}` }
          
          return (
            <ExerciseCard
              key={exId}
              exerciseId={exId}
              details={displayDetails}
              onOpenInfo={(id) => setInfoExercise(getExerciseDetails(id))}
            />
          )
        })}

        <button 
          className="block w-full bg-text-main text-bg-dark border-none p-4 rounded-xl text-base font-bold mt-8 mb-5 cursor-pointer flex items-center justify-center gap-2"
          onClick={() => {
            if(window.confirm("¿Querés despintar los tildes de hoy? (Tus kilos no se borran).")) {
              window.location.reload()
            }
          }}
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
