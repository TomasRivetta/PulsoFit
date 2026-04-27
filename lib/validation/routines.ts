import {
  coerceRoutineExercises,
  normalizeScheduledDays,
  ROUTINE_GOALS,
  type RoutineDifficulty,
  type RoutineExercise,
  type RoutineGoal,
  type ScheduledDay,
} from '@/lib/domain/routines'

export interface RoutineMutationInput {
  title: string
  goal: RoutineGoal
  description: string
  exercises: RoutineExercise[]
  frequency_days: number
  scheduled_days: ScheduledDay[]
  difficulty: RoutineDifficulty
  duration_mins: number
}

export function validateRoutineForm(formData: FormData): { data?: RoutineMutationInput; error?: string } {
  const title = readString(formData, 'title')
  const description = readString(formData, 'description')
  const goal = normalizeGoal(readString(formData, 'goal'))
  const scheduledDaysRaw = parseJsonArray(formData.get('scheduled_days'))
  const exercisesRaw = parseJsonUnknown(formData.get('exercises'))

  if (!title) {
    return { error: 'El nombre de la rutina es requerido' }
  }

  if (!description) {
    return { error: 'La descripción es requerida' }
  }

  if (!goal) {
    return { error: 'El objetivo principal es inválido' }
  }

  const scheduled_days = normalizeScheduledDays(scheduledDaysRaw)
  if (scheduled_days.length === 0) {
    return { error: 'Seleccioná al menos un día de entrenamiento' }
  }

  const exercises = coerceRoutineExercises(exercisesRaw)
  if (exercises.length === 0) {
    return { error: 'Agregá al menos un ejercicio válido' }
  }

  const duration_mins = exercises.reduce((total, exercise) => {
    const exerciseMinutes = exercise.sets * Math.max(exercise.rest, 30) / 60
    return total + exerciseMinutes
  }, 0)

  return {
    data: {
      description,
      difficulty: 'Intermediate',
      duration_mins: Math.max(30, Math.round(duration_mins)),
      exercises,
      frequency_days: scheduled_days.length,
      goal,
      scheduled_days,
      title,
    },
  }
}

function normalizeGoal(value: string): RoutineGoal | null {
  return ROUTINE_GOALS.find((goal) => goal === value) ?? null
}

function parseJsonArray(value: FormDataEntryValue | null) {
  const parsed = parseJsonUnknown(value)
  return Array.isArray(parsed) ? parsed.map(String) : []
}

function parseJsonUnknown(value: FormDataEntryValue | null): unknown {
  if (typeof value !== 'string' || !value.trim()) {
    return []
  }

  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

function readString(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}
