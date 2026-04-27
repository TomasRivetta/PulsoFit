import type { Tables } from '@/lib/supabase/types'

export const SCHEDULED_DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'] as const
export const WEEKDAY_BY_DATE_INDEX = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'] as const

const LEGACY_DAY_MAP: Record<string, ScheduledDay> = {
  Mon: 'Lun',
  Tue: 'Mar',
  Wed: 'Mie',
  Thu: 'Jue',
  Fri: 'Vie',
  Sat: 'Sab',
  Sun: 'Dom',
  Lun: 'Lun',
  Mar: 'Mar',
  Mie: 'Mie',
  Jue: 'Jue',
  Vie: 'Vie',
  Sab: 'Sab',
  Dom: 'Dom',
}

export const ROUTINE_GOALS = [
  'Strength & Power',
  'Hypertrophy',
  'Endurance',
  'Recovery',
] as const

export const ROUTINE_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const

export type ScheduledDay = (typeof SCHEDULED_DAYS)[number]
export type RoutineGoal = (typeof ROUTINE_GOALS)[number]
export type RoutineDifficulty = (typeof ROUTINE_DIFFICULTIES)[number]
export type RoutineColorTheme = 'primary' | 'secondary'

export interface RoutineExercise {
  id: string
  name: string
  category: string
  sets: number
  reps: number
  load: number
  rest: number
  gifUrl?: string
  instructions?: string[]
  target?: string
}

export type RoutineRow = Tables<'routines'>
export type WorkoutSessionRow = Tables<'workout_sessions'>
export type UserStatsRow = Tables<'user_stats'>

export interface RoutineRecord extends Omit<RoutineRow, 'exercises' | 'scheduled_days' | 'color_theme'> {
  exercises: RoutineExercise[]
  scheduled_days: ScheduledDay[]
  color_theme: RoutineColorTheme | null
}

export const ROUTINE_THEME_CLASSNAMES: Record<
  RoutineColorTheme,
  {
    badge: string
    borderHover: string
    icon: string
    metric: string
    pill: string
    title: string
  }
> = {
  primary: {
    badge: 'bg-primary/10 text-primary',
    borderHover: 'hover:border-primary-dim/20',
    icon: 'bg-primary-container/20 text-primary',
    metric: 'text-primary',
    pill: 'text-primary bg-primary/10',
    title: 'text-primary',
  },
  secondary: {
    badge: 'bg-secondary/10 text-secondary',
    borderHover: 'hover:border-secondary/20',
    icon: 'bg-secondary/15 text-secondary',
    metric: 'text-secondary',
    pill: 'text-secondary bg-secondary/10',
    title: 'text-secondary',
  },
}

export function getRoutineTheme(theme: string | null | undefined) {
  if (theme === 'secondary') {
    return ROUTINE_THEME_CLASSNAMES.secondary
  }

  return ROUTINE_THEME_CLASSNAMES.primary
}

export function normalizeScheduledDay(day: string): ScheduledDay | null {
  return LEGACY_DAY_MAP[day] ?? null
}

export function normalizeScheduledDays(days: string[]): ScheduledDay[] {
  const normalized = days
    .map((day) => normalizeScheduledDay(day))
    .filter((day): day is ScheduledDay => day !== null)

  return Array.from(new Set(normalized))
}

export function coerceRoutineExercises(value: unknown): RoutineExercise[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const candidate = item as Record<string, unknown>
    const name = typeof candidate.name === 'string' ? candidate.name.trim() : ''

    if (!name) {
      return []
    }

    return [
      {
        id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : String(index + 1),
        name,
        category: typeof candidate.category === 'string' && candidate.category.trim() ? candidate.category : 'General',
        sets: normalizePositiveInteger(candidate.sets, 1),
        reps: normalizePositiveInteger(candidate.reps, 1),
        load: normalizeNonNegativeNumber(candidate.load),
        rest: normalizeNonNegativeNumber(candidate.rest),
        gifUrl: typeof candidate.gifUrl === 'string' && candidate.gifUrl.trim() ? candidate.gifUrl : undefined,
        instructions: Array.isArray(candidate.instructions)
          ? candidate.instructions.filter((instruction): instruction is string => typeof instruction === 'string' && instruction.trim().length > 0)
          : undefined,
        target: typeof candidate.target === 'string' && candidate.target.trim() ? candidate.target : undefined,
      },
    ]
  })
}

function normalizePositiveInteger(value: unknown, fallback: number) {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function normalizeNonNegativeNumber(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}
