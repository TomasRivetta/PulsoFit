import { coerceRoutineExercises, type RoutineRecord } from '@/lib/domain/routines'
import type { Tables } from '@/lib/supabase/types'

export interface SessionSetRecord {
  load: string
  reps: string
  completed: boolean
}

export type WorkoutSessionData = Record<string, SessionSetRecord[]>

export type WorkoutSessionRecord = Omit<Tables<'workout_sessions'>, 'session_data'> & {
  session_data: WorkoutSessionData
}

export interface WorkoutSessionWithRoutine extends WorkoutSessionRecord {
  routines: Pick<RoutineRecord, 'title' | 'goal' | 'difficulty' | 'exercises' | 'color_theme' | 'tags'> | null
}

export function createInitialSessionData(
  exercises: Array<{
    id: string
    load: number
    reps: number
    sets: number
  }>
): WorkoutSessionData {
  return exercises.reduce<WorkoutSessionData>((accumulator, exercise) => {
    accumulator[exercise.id] = Array.from({ length: exercise.sets }, () => ({
      load: exercise.load > 0 ? exercise.load.toString() : '',
      reps: exercise.reps > 0 ? exercise.reps.toString() : '',
      completed: false,
    }))

    return accumulator
  }, {})
}

export function getExerciseSessionSets(sessionData: WorkoutSessionData, exerciseId: string) {
  return sessionData[exerciseId] ?? []
}

export function getCompletedSessionSets(sessionData: WorkoutSessionData) {
  return Object.values(sessionData).flatMap((sets) => sets.filter((set) => set.completed))
}

export function calculateSessionVolume(sessionData: WorkoutSessionData) {
  return getCompletedSessionSets(sessionData).reduce((total, set) => {
    return total + (Number.parseFloat(set.load) || 0) * (Number.parseInt(set.reps, 10) || 0)
  }, 0)
}

export function getRoutineExercisesForSession(session: Pick<WorkoutSessionWithRoutine, 'routines'>) {
  return coerceRoutineExercises(session.routines?.exercises ?? [])
}
