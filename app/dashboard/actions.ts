'use server'

import { createClient } from '@/lib/supabase/server'
import { workoutDays } from '@/lib/data'

// Fetch stats: total sessions and total volume lifted
export async function fetchDashboardStats(userId: string) {
  const supabase = await createClient()

  const { data: sessions, error: sessionsError } = await supabase
    .from('workout_sessions')
    .select('id, day_id, started_at, completed_at')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('started_at', { ascending: false })

  if (sessionsError) return { sessions: [], totalVolume: 0, streak: 0 }

  const { data: logs } = await supabase
    .from('exercise_logs')
    .select('weight, reps')
    .eq('user_id', userId)

  const totalVolume = logs?.reduce((acc, log) => acc + ((log.weight || 0) * (log.reps || 0)), 0) ?? 0

  return {
    sessions: sessions ?? [],
    totalSessions: sessions?.length ?? 0,
    totalVolume: Math.round(totalVolume),
  }
}

// Fetch all dates where user trained (for calendar dots)
export async function fetchTrainedDates(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('workout_sessions')
    .select('started_at, day_id, id, completed_at')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('started_at', { ascending: false })

  if (error) return []

  return (data ?? []).map(s => ({
    date: s.started_at.split('T')[0],
    dayId: s.day_id,
    sessionId: s.id,
    completedAt: s.completed_at,
  }))
}

// Fetch detail for a specific session (exercises, sets, weights, reps)
export async function fetchSessionDetail(sessionId: string, userId: string) {
  const supabase = await createClient()

  const { data: session } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  const { data: logs } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .order('exercise_id', { ascending: true })
    .order('set_number', { ascending: true })

  return { session, logs: logs ?? [] }
}

// Fetch progress data for a specific exercise (weight over time)
export async function fetchExerciseProgress(userId: string, exerciseId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('exercise_logs')
    .select('weight, reps, created_at, set_number')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .order('created_at', { ascending: true })

  if (error) return []

  // Group by date and get max weight per session
  const grouped: Record<string, number> = {}
  for (const log of data ?? []) {
    const date = log.created_at.split('T')[0]
    if (!grouped[date] || (log.weight ?? 0) > grouped[date]) {
      grouped[date] = log.weight ?? 0
    }
  }

  return Object.entries(grouped).map(([date, weight]) => ({ date, weight }))
}
