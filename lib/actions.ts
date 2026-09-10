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
