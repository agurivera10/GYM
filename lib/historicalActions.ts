'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface HistoricalSetInput {
  exerciseId: string
  setNumber: number
  weight: string
  reps: string
}

export async function logHistoricalSession(
  userId: string,
  dayId: string,
  date: string,        // 'YYYY-MM-DD'
  sets: HistoricalSetInput[]
) {
  const supabase = await createClient()

  // Create the session with the historical date
  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: userId,
      day_id: dayId,
      started_at: `${date}T10:00:00Z`,
      completed_at: `${date}T11:00:00Z`,
    })
    .select()
    .single()

  if (sessionError || !session) {
    return { error: sessionError?.message ?? 'Error al crear sesión' }
  }

  // Insert all logs
  const logsToInsert = sets
    .filter(s => s.weight || s.reps)
    .map(s => ({
      session_id: session.id,
      user_id: userId,
      exercise_id: s.exerciseId,
      set_number: s.setNumber,
      weight: parseFloat(s.weight) || 0,
      reps: parseInt(s.reps) || 0,
    }))

  if (logsToInsert.length > 0) {
    const { error: logsError } = await supabase
      .from('exercise_logs')
      .insert(logsToInsert)

    if (logsError) {
      return { error: logsError.message }
    }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
