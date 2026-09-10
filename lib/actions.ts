'use server'

import { createClient } from './supabase/server'
import { revalidatePath } from 'next/cache'

export async function logSetComplete(
  userId: string,
  dayId: string,
  exerciseId: string,
  setNumber: number,
  weight: string,
  reps: string
) {
  const supabase = await createClient()

  let { data: session } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('day_id', dayId)
    .is('completed_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .single()

  if (!session) {
    const { data: newSession, error: createError } = await supabase
      .from('workout_sessions')
      .insert({ user_id: userId, day_id: dayId })
      .select()
      .single()

    if (createError) {
      console.error(createError)
      return { error: createError.message }
    }
    session = newSession
  }

  const { error: logError } = await supabase
    .from('exercise_logs')
    .insert({
      session_id: session.id,
      user_id: userId,
      exercise_id: exerciseId,
      set_number: setNumber,
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps) || 0,
    })

  if (logError) {
    console.error(logError)
    return { error: logError.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function finishWorkoutSession(userId: string, dayId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('workout_sessions')
    .update({ completed_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('day_id', dayId)
    .is('completed_at', null)

  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/')
  return { success: true }
}

export interface ExerciseHistoryData {
  lastSessionSets: { setNumber: number; weight: number; reps: number }[]
  personalRecord: { maxWeight: number; reps: number } | null
}

export async function fetchExerciseHistory(userId: string, exerciseIds: string[]): Promise<Record<string, ExerciseHistoryData>> {
  const supabase = await createClient()

  const { data: logs, error } = await supabase
    .from('exercise_logs')
    .select('exercise_id, set_number, weight, reps, created_at, session_id')
    .eq('user_id', userId)
    .in('exercise_id', exerciseIds)
    .order('created_at', { ascending: false })

  if (error || !logs) {
    return {}
  }

  const result: Record<string, ExerciseHistoryData> = {}

  for (const exId of exerciseIds) {
    const exLogs = logs.filter(l => l.exercise_id === exId)
    if (exLogs.length === 0) {
      result[exId] = { lastSessionSets: [], personalRecord: null }
      continue
    }

    // 1. Personal Record (mayor peso levantado)
    let prWeight = 0
    let prReps = 0
    for (const log of exLogs) {
      const w = log.weight || 0
      const r = log.reps || 0
      if (w > prWeight || (w === prWeight && r > prReps)) {
        prWeight = w
        prReps = r
      }
    }

    // 2. Última sesión registrada (el session_id más reciente)
    const latestSessionId = exLogs[0].session_id
    const latestSessionLogs = exLogs
      .filter(l => l.session_id === latestSessionId)
      .sort((a, b) => a.set_number - b.set_number)
      .map(l => ({
        setNumber: l.set_number,
        weight: l.weight || 0,
        reps: l.reps || 0
      }))

    result[exId] = {
      lastSessionSets: latestSessionLogs,
      personalRecord: prWeight > 0 ? { maxWeight: prWeight, reps: prReps } : null
    }
  }

  return result
}

