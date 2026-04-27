import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HistoryClient from './HistoryClient'
import type { WorkoutSessionWithRoutine } from '@/lib/domain/workout-sessions'

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch workout sessions joined with routines
  const { data: sessions, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      routines (
        title,
        goal,
        difficulty,
        exercises,
        tags,
        color_theme
      )
    `)
    .eq('user_id', user.id)
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching history:', error)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <HistoryClient initialSessions={(sessions || []) as WorkoutSessionWithRoutine[]} />
    </div>
  )
}
