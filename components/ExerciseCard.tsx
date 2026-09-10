'use client'

import React, { useState, useEffect } from 'react'
import { Info, Check, Loader2, Trophy, HelpCircle, Sparkles } from 'lucide-react'
import { logSetComplete } from '@/lib/actions'
import { calculate1RM } from '@/lib/fitness'
import confetti from 'canvas-confetti'

export interface ExerciseHistoryData {
  lastSessionSets: { setNumber: number; weight: number; reps: number }[]
  personalRecord: { maxWeight: number; reps: number } | null
}

interface ExerciseCardProps {
  exerciseId: string
  details: any
  onOpenInfo: (id: string) => void
  userId?: string
  dayId?: string
  history?: ExerciseHistoryData
  onOpenGlossary?: () => void
}

export function ExerciseCard({
  exerciseId,
  details,
  onOpenInfo,
  userId,
  dayId,
  history,
  onOpenGlossary,
}: ExerciseCardProps) {
  const [completedSets, setCompletedSets] = useState<Record<number, boolean>>({})
  const [savingSet, setSavingSet] = useState<Record<number, boolean>>({})
  const [weights, setWeights] = useState<Record<number, string>>({})
  const [reps, setReps] = useState<Record<number, string>>({})
  const [newPRs, setNewPRs] = useState<Record<number, boolean>>({})

  // Pre-cargar pesos y reps de la última sesión realizada
  useEffect(() => {
    if (history?.lastSessionSets && history.lastSessionSets.length > 0) {
      const initialWeights: Record<number, string> = {}
      const initialReps: Record<number, string> = {}

      history.lastSessionSets.forEach(set => {
        if (set.weight > 0) initialWeights[set.setNumber] = set.weight.toString()
        if (set.reps > 0) initialReps[set.setNumber] = set.reps.toString()
      })

      // Solo si los inputs están vacíos
      setWeights(prev => ({ ...initialWeights, ...prev }))
      setReps(prev => ({ ...initialReps, ...prev }))
    }
  }, [history])

  const triggerPRCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#32D74B', '#FFD700', '#0A84FF', '#FFFFFF']
      })
    } catch {
      // Ignorar si canvas no está disponible
    }
  }

  const toggleSet = async (setNum: number) => {
    const isCompleted = !completedSets[setNum]
    setCompletedSets(prev => ({ ...prev, [setNum]: isCompleted }))

    if (isCompleted) {
      // Temporizador de descanso
      window.dispatchEvent(new CustomEvent('start-rest-timer'))

      const currentWeight = parseFloat(weights[setNum] || '0')
      const currentReps = parseInt(reps[setNum] || '0')
      const previousPRWeight = history?.personalRecord?.maxWeight || 0

      // Detección de Récord Personal (PR)
      if (currentWeight > 0 && currentWeight > previousPRWeight) {
        setNewPRs(prev => ({ ...prev, [setNum]: true }))
        triggerPRCelebration()
      }

      // Guardar en Supabase
      if (userId && dayId) {
        setSavingSet(prev => ({ ...prev, [setNum]: true }))
        try {
          await logSetComplete(
            userId,
            dayId,
            exerciseId,
            setNum,
            weights[setNum] || '0',
            reps[setNum] || '0'
          )
        } catch (e) {
          console.error('Error saving set:', e)
        } finally {
          setSavingSet(prev => ({ ...prev, [setNum]: false }))
        }
      }
    }
  }

  const pr = history?.personalRecord

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-4 mb-4">
      {/* Encabezado del ejercicio */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="text-base font-bold flex items-center gap-2">
              <span className="text-xl bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg">
                {details.icon}
              </span>
              <span className="truncate">{details.title}</span>
            </div>
            <button
              onClick={() => onOpenInfo(exerciseId)}
              className="bg-transparent border border-blue text-blue rounded-full w-7 h-7 flex items-center justify-center shrink-0"
              title="Ver video y técnica"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] bg-blue/15 text-blue px-2 py-1 rounded-md font-bold uppercase self-start ml-10">
            {details.target}
          </div>
        </div>
      </div>

      {/* Barra de récord histórico y referencias con explicación clara */}
      <div className="flex flex-col gap-2 mb-3">
        {pr && pr.maxWeight > 0 ? (
          <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#FFD700] font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Tu récord: {pr.maxWeight} kg ({pr.reps} reps)</span>
            </div>
            {onOpenGlossary && (
              <button
                onClick={onOpenGlossary}
                className="text-text-muted hover:text-text-main flex items-center gap-1 text-[11px] underline"
              >
                ¿Qué es PR?
              </button>
            )}
          </div>
        ) : (
          onOpenGlossary && (
            <div className="flex justify-end">
              <button
                onClick={onOpenGlossary}
                className="text-[11px] text-text-muted hover:text-accent flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Glosario para principiantes</span>
              </button>
            </div>
          )
        )}
      </div>

      {/* Objetivo de Reps y Referencia del ejercicio */}
      <div className="flex gap-3 bg-bg-elevated p-2.5 rounded-xl mb-4 text-xs">
        <div className="flex-1 text-center">
          <span className="block text-text-muted text-[10px] uppercase font-semibold">Meta de Reps</span>
          <strong className="text-text-main text-[13px]">{details.reps}</strong>
        </div>
        <div className="flex-1 text-center">
          <span className="block text-text-muted text-[10px] uppercase font-semibold">Referencia</span>
          <strong className="text-text-main text-[13px]">{details.ref}</strong>
        </div>
      </div>

      {/* Listado de series */}
      <div className="flex flex-col">
        {Array.from({ length: details.sets }).map((_, i) => {
          const setNum = i + 1
          const isDone = completedSets[setNum]
          const isSaving = savingSet[setNum]
          const isPR = newPRs[setNum]

          const wVal = parseFloat(weights[setNum] || '0')
          const rVal = parseInt(reps[setNum] || '0')
          const est1RM = calculate1RM(wVal, rVal)

          // Valor de la sesión anterior para este set (si existe)
          const prevSet = history?.lastSessionSets?.find(s => s.setNumber === setNum)

          return (
            <div
              key={setNum}
              className={`flex flex-col py-2.5 border-t border-border-main transition-opacity ${
                isDone ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className={`text-[13px] font-semibold w-11 ${isDone ? 'text-accent' : 'text-text-muted'}`}>
                  S. {setNum}
                </div>

                <div className="flex gap-2 flex-1">
                  <div className="flex-1 flex flex-col">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={prevSet && prevSet.weight > 0 ? `${prevSet.weight} kg` : 'kg'}
                      value={weights[setNum] || ''}
                      onChange={e => setWeights(prev => ({ ...prev, [setNum]: e.target.value }))}
                      className="bg-bg-elevated border border-border-main text-text-main rounded-lg p-2 w-full text-base text-center font-semibold focus:outline-none focus:border-accent placeholder:text-[#636366] placeholder:font-normal placeholder:text-sm"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={prevSet && prevSet.reps > 0 ? `${prevSet.reps} reps` : 'reps'}
                      value={reps[setNum] || ''}
                      onChange={e => setReps(prev => ({ ...prev, [setNum]: e.target.value }))}
                      className="bg-bg-elevated border border-border-main text-text-main rounded-lg p-2 w-full text-base text-center font-semibold focus:outline-none focus:border-accent placeholder:text-[#636366] placeholder:font-normal placeholder:text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={() => toggleSet(setNum)}
                  disabled={isSaving}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                    isDone
                      ? 'bg-accent border-accent text-bg-dark'
                      : 'bg-transparent border-border-main hover:border-accent'
                  }`}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  ) : (
                    <Check
                      className={`w-5 h-5 ${isDone ? 'stroke-bg-dark' : 'stroke-transparent'}`}
                      strokeWidth={3}
                    />
                  )}
                </button>
              </div>

              {/* Información y cálculo de 1RM con explicación */}
              <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-text-muted">
                {prevSet && prevSet.weight > 0 ? (
                  <span>Última vez: <strong className="text-text-main">{prevSet.weight}kg × {prevSet.reps}</strong></span>
                ) : (
                  <span>Primer registro</span>
                )}

                {est1RM > 0 && (
                  <span className="flex items-center gap-1 text-[10px] bg-bg-elevated px-2 py-0.5 rounded-md border border-border-main/40">
                    Fuerza máx. est. (1RM): <strong className="text-accent">{est1RM} kg</strong>
                  </span>
                )}
              </div>

              {/* Notificación de nuevo Récord Personal */}
              {isPR && (
                <div className="mt-1.5 bg-[#FFD700]/15 border border-[#FFD700] text-[#FFD700] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>¡Nuevo Récord Personal! Levantaste más peso que antes 🏆</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
