'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveWorkoutSessionAction(routineId: string, sessionData: any, startTime: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get previous session to calculate streak
  const { data: previousSession } = await supabase
    .from('workout_sessions')
    .select('end_time')
    .eq('user_id', user.id)
    .order('end_time', { ascending: false })
    .limit(1)
    .maybeSingle()

  const now = new Date()

  const { error } = await supabase.from('workout_sessions').insert({
    user_id: user.id,
    routine_id: routineId,
    start_time: startTime,
    end_time: now.toISOString(),
    session_data: sessionData
  })

  if (error) {
    console.error('Insert workout session error: ', error)
    throw new Error('Database Error: Failed to save workout session')
  }

  // Calculate and update Streak
  const { data: stats } = await supabase
    .from('user_stats')
    .select('daily_streak')
    .eq('user_id', user.id)
    .maybeSingle()

  let currentStreak = stats?.daily_streak || 0
  let newStreak = currentStreak

  if (previousSession && previousSession.end_time) {
    const lastDate = new Date(previousSession.end_time)
    const lastDateFloor = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
    const todayFloor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const diffTime = todayFloor.getTime() - lastDateFloor.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Already worked out today
      newStreak = currentStreak === 0 ? 1 : currentStreak
    } else if (diffDays === 1) {
      // Worked out yesterday
      newStreak = currentStreak + 1
    } else {
      // Missed a day or more
      newStreak = 1
    }
  } else {
    // First session ever
    newStreak = 1
  }

  if (stats) {
    await supabase.from('user_stats').update({ daily_streak: newStreak }).eq('user_id', user.id)
  } else {
    await supabase.from('user_stats').insert({ user_id: user.id, daily_streak: newStreak })
  }

  revalidatePath('/dashboard')
  return { success: true }
}
