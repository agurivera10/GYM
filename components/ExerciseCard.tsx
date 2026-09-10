'use client'

import React, { useState } from 'react'
import { Info, Check, Loader2 } from 'lucide-react'
import { logSetComplete } from '@/lib/actions'

interface ExerciseCardProps {
  exerciseId: string
  details: any
  onOpenInfo: (id: string) => void
  userId?: string
  dayId?: string
}

export function ExerciseCard({ exerciseId, details, onOpenInfo, userId, dayId }: ExerciseCardProps) {
  const [completedSets, setCompletedSets] = useState<Record<number, boolean>>({})
  const [savingSet, setSavingSet] = useState<Record<number, boolean>>({})
  const [weights, setWeights] = useState<Record<number, string>>({})
  const [reps, setReps] = useState<Record<number, string>>({})

  const toggleSet = async (setNum: number) => {
    const isCompleted = !completedSets[setNum]
    setCompletedSets(prev => ({ ...prev, [setNum]: isCompleted }))

    if (isCompleted) {
      // Fire the rest timer immediately (optimistic)
      window.dispatchEvent(new CustomEvent('start-rest-timer'))

      // Save to Supabase if user is authenticated
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

  return (
    <div className="bg-bg-card border border-border-main rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="text-base font-bold flex items-center gap-2">
              <span className="text-xl bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg">{details.icon}</span>
              <span className="truncate">{details.title}</span>
            </div>
            <button 
              onClick={() => onOpenInfo(exerciseId)}
              className="bg-transparent border border-blue text-blue rounded-full w-7 h-7 flex items-center justify-center shrink-0"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] bg-blue/15 text-blue px-2 py-1 rounded-md font-bold uppercase self-start ml-10">
            {details.target}
          </div>
        </div>
      </div>

      <div className="flex gap-3 bg-bg-elevated p-2.5 rounded-xl mb-4 text-xs">
        <div className="flex-1 text-center">
          <span className="block text-text-muted text-[10px] uppercase">Reps</span>
          <strong className="text-text-main text-[13px]">{details.reps}</strong>
        </div>
        <div className="flex-1 text-center">
          <span className="block text-text-muted text-[10px] uppercase">Ref.</span>
          <strong className="text-text-main text-[13px]">{details.ref}</strong>
        </div>
      </div>

      <div className="flex flex-col">
        {Array.from({ length: details.sets }).map((_, i) => {
          const setNum = i + 1
          const isDone = completedSets[setNum]
          const isSaving = savingSet[setNum]
          return (
            <div key={setNum} className={`flex items-center justify-between gap-3 py-2.5 border-t border-border-main transition-opacity ${isDone ? 'opacity-60' : ''}`}>
              <div className={`text-[13px] font-semibold w-11 ${isDone ? 'text-accent' : 'text-text-muted'}`}>
                S. {setNum}
              </div>
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="kg"
                  value={weights[setNum] || ''}
                  onChange={e => setWeights(prev => ({ ...prev, [setNum]: e.target.value }))}
                  className="bg-bg-elevated border border-border-main text-text-main rounded-lg p-2 w-full text-base text-center font-semibold focus:outline-none focus:border-accent placeholder:text-[#48484A] placeholder:font-normal placeholder:text-sm"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="reps"
                  value={reps[setNum] || ''}
                  onChange={e => setReps(prev => ({ ...prev, [setNum]: e.target.value }))}
                  className="bg-bg-elevated border border-border-main text-text-main rounded-lg p-2 w-full text-base text-center font-semibold focus:outline-none focus:border-accent placeholder:text-[#48484A] placeholder:font-normal placeholder:text-sm"
                />
              </div>
              <button
                onClick={() => toggleSet(setNum)}
                disabled={isSaving}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                  isDone 
                    ? 'bg-accent border-accent text-bg-dark' 
                    : 'bg-transparent border-border-main'
                }`}
              >
                {isSaving
                  ? <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  : <Check className={`w-5 h-5 ${isDone ? 'stroke-bg-dark' : 'stroke-transparent'}`} strokeWidth={3} />
                }
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
