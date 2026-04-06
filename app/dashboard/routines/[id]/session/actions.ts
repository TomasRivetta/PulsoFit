'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveWorkoutSessionAction(routineId: string, sessionData: any, startTime: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase.from('workout_sessions').insert({
    user_id: user.id,
    routine_id: routineId,
    start_time: startTime,
    end_time: new Date().toISOString(),
    session_data: sessionData
  })

  if (error) {
    console.error('Insert workout session error: ', error)
    throw new Error('Database Error: Failed to save workout session')
  }

  revalidatePath('/dashboard')
  return { success: true }
}
