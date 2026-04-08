import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StatsClient from './StatsClient'

export default async function StatsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  // Fetch workout sessions from the last 90 days for trends
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      routines (
        title,
        goal,
        difficulty,
        exercises
      )
    `)
    .eq('user_id', user.id)
    .gte('start_time', ninetyDaysAgo.toISOString())
    .order('start_time', { ascending: true })

  return (
    <div className="max-w-[1600px] mx-auto">
      <StatsClient 
        userStats={stats || {}} 
        sessions={sessions || []} 
      />
    </div>
  )
}
