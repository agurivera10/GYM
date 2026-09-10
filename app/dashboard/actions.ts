'use server'

import { createClient } from '@/lib/supabase/server'
import { workoutDays } from '@/lib/data'
import { MUSCLE_GROUPS } from '@/lib/fitness'

// Fetch stats: total sessions and total volume lifted
export async function fetchDashboardStats(userId: string) {
  const supabase = await createClient()

  const { data: sessions, error: sessionsError } = await supabase
    .from('workout_sessions')
    .select('id, day_id, started_at, completed_at')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('started_at', { ascending: false })

  if (sessionsError) return { sessions: [], totalVolume: 0, streak: 0, totalSessions: 0 }

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

// Estadísticas visuales divididas por grupo muscular
export interface MuscleGroupStat {
  id: string
  name: string
  icon: string
  color: string
  setsCount: number
  totalVolume: number
  percentage: number
}

export async function fetchMuscleGroupStats(userId: string): Promise<MuscleGroupStat[]> {
  const supabase = await createClient()
  const { data: logs, error } = await supabase
    .from('exercise_logs')
    .select('exercise_id, weight, reps')
    .eq('user_id', userId)

  if (error || !logs || logs.length === 0) {
    return MUSCLE_GROUPS.map(g => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      color: g.color,
      setsCount: 0,
      totalVolume: 0,
      percentage: 0
    }))
  }

  let grandTotalVolume = 0
  const mapStats: Record<string, { setsCount: number; volume: number }> = {}

  MUSCLE_GROUPS.forEach(g => {
    mapStats[g.id] = { setsCount: 0, volume: 0 }
  })

  logs.forEach(log => {
    const w = log.weight || 0
    const r = log.reps || 0
    const vol = w * r
    grandTotalVolume += vol

    const group = MUSCLE_GROUPS.find(g => g.exercises.includes(log.exercise_id))
    if (group) {
      mapStats[group.id].setsCount += 1
      mapStats[group.id].volume += vol
    }
  })

  return MUSCLE_GROUPS.map(g => {
    const stat = mapStats[g.id] || { setsCount: 0, volume: 0 }
    const percentage = grandTotalVolume > 0 ? Math.round((stat.volume / grandTotalVolume) * 100) : 0
    return {
      id: g.id,
      name: g.name,
      icon: g.icon,
      color: g.color,
      setsCount: stat.setsCount,
      totalVolume: Math.round(stat.volume),
      percentage
    }
  })
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

// Actualizar y reemplazar datos de una rutina previa en Supabase
export async function updateSessionLogs(
  sessionId: string,
  userId: string,
  updatedSets: { exerciseId: string; setNumber: number; weight: number; reps: number }[]
) {
  const supabase = await createClient()

  // 1. Borrar logs anteriores de esta sesión
  const { error: deleteError } = await supabase
    .from('exercise_logs')
    .delete()
    .eq('session_id', sessionId)
    .eq('user_id', userId)

  if (deleteError) {
    return { error: deleteError.message }
  }

  // 2. Insertar los nuevos registros actualizados
  const validSets = updatedSets.filter(s => s.weight > 0 || s.reps > 0)
  if (validSets.length > 0) {
    const logsToInsert = validSets.map(s => ({
      session_id: sessionId,
      user_id: userId,
      exercise_id: s.exerciseId,
      set_number: s.setNumber,
      weight: s.weight,
      reps: s.reps,
    }))

    const { error: insertError } = await supabase
      .from('exercise_logs')
      .insert(logsToInsert)

    if (insertError) {
      return { error: insertError.message }
    }
  }

  return { success: true }
}

// Eliminar una sesión por completo
export async function deleteSession(sessionId: string, userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('workout_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
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
