import { workoutDays as defaultWorkoutDays, WorkoutDay, exerciseDB, ExerciseInfo } from './data'

const ROUTINE_STORAGE_KEY = 'elite_custom_routine_v1'
const CUSTOM_EXERCISES_KEY = 'elite_custom_exercises_v1'

/**
 * Obtiene los días de entrenamiento personalizados desde localStorage.
 * Si no existen, retorna los días por defecto de lib/data.ts.
 */
export function getCustomWorkoutDays(): WorkoutDay[] {
  if (typeof window === 'undefined') {
    return defaultWorkoutDays
  }

  try {
    const saved = localStorage.getItem(ROUTINE_STORAGE_KEY)
    if (!saved) return defaultWorkoutDays
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch (err) {
    console.error('Error al cargar rutina personalizada de localStorage:', err)
  }

  return defaultWorkoutDays
}

/**
 * Guarda los días de entrenamiento personalizados en localStorage y dispara un evento para actualizar la UI.
 */
export function saveCustomWorkoutDays(days: WorkoutDay[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(days))
    window.dispatchEvent(new Event('custom-routine-updated'))
  } catch (err) {
    console.error('Error al guardar rutina personalizada en localStorage:', err)
  }
}

/**
 * Restablece la rutina a los valores predeterminados originales.
 */
export function resetCustomWorkoutDays(): WorkoutDay[] {
  if (typeof window === 'undefined') return defaultWorkoutDays
  try {
    localStorage.removeItem(ROUTINE_STORAGE_KEY)
    window.dispatchEvent(new Event('custom-routine-updated'))
  } catch (err) {
    console.error('Error al restablecer rutina:', err)
  }
  return defaultWorkoutDays
}

/**
 * Agrega un ejercicio a un día específico.
 */
export function addExerciseToDay(dayId: string, exerciseId: string, isAlternative: boolean = false) {
  const current = getCustomWorkoutDays()
  const updated = current.map(day => {
    if (day.id !== dayId) return day

    if (isAlternative) {
      const alts = day.alternatives || []
      if (!alts.includes(exerciseId)) {
        return { ...day, alternatives: [...alts, exerciseId] }
      }
    } else {
      if (!day.exercises.includes(exerciseId)) {
        return { ...day, exercises: [...day.exercises, exerciseId] }
      }
    }
    return day
  })

  saveCustomWorkoutDays(updated)
  return updated
}

/**
 * Quita un ejercicio de un día específico.
 */
export function removeExerciseFromDay(dayId: string, exerciseId: string, isAlternative: boolean = false) {
  const current = getCustomWorkoutDays()
  const updated = current.map(day => {
    if (day.id !== dayId) return day

    if (isAlternative) {
      return { ...day, alternatives: (day.alternatives || []).filter(id => id !== exerciseId) }
    } else {
      return { ...day, exercises: day.exercises.filter(id => id !== exerciseId) }
    }
  })

  saveCustomWorkoutDays(updated)
  return updated
}

/**
 * Reordena los ejercicios de un día.
 */
export function reorderExercisesInDay(dayId: string, newExercises: string[], isAlternative: boolean = false) {
  const current = getCustomWorkoutDays()
  const updated = current.map(day => {
    if (day.id !== dayId) return day
    if (isAlternative) {
      return { ...day, alternatives: newExercises }
    } else {
      return { ...day, exercises: newExercises }
    }
  })

  saveCustomWorkoutDays(updated)
  return updated
}

/**
 * Carga ejercicios personalizados definidos por el usuario.
 */
export function getCustomExercisesMap(): Record<string, ExerciseInfo> {
  if (typeof window === 'undefined') return {}
  try {
    const saved = localStorage.getItem(CUSTOM_EXERCISES_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (err) {
    console.error('Error al cargar ejercicios personalizados:', err)
  }
  return {}
}

/**
 * Guarda un ejercicio personalizado en localStorage.
 */
export function saveCustomExercise(id: string, info: ExerciseInfo) {
  if (typeof window === 'undefined') return
  try {
    const current = getCustomExercisesMap()
    current[id] = info
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(current))
    window.dispatchEvent(new Event('custom-exercises-updated'))
  } catch (err) {
    console.error('Error al guardar ejercicio personalizado:', err)
  }
}

/**
 * Retorna un mapa con todos los ejercicios: ejercicioDB base + personalizados.
 */
export function getAllExercisesMap(): Record<string, ExerciseInfo> {
  const custom = getCustomExercisesMap()
  return {
    ...exerciseDB,
    ...custom
  }
}
