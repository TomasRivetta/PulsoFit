'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createRoutineAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const title = formData.get('title') as string
  const goal = formData.get('goal') as string
  const description = formData.get('description') as string
  const exercisesRaw = formData.get('exercises') as string
  const frequencyRaw = formData.get('frequency') as string
  const scheduledDaysRaw = formData.get('scheduled_days') as string
  
  if (!title) {
    throw new Error('Title is required')
  }

  const exercises = exercisesRaw ? JSON.parse(exercisesRaw) : []
  const frequency_days = frequencyRaw ? parseInt(frequencyRaw, 10) : 3
  const scheduled_days = scheduledDaysRaw ? JSON.parse(scheduledDaysRaw) : []

  const { error } = await supabase.from('routines').insert({
    user_id: user.id,
    title,
    goal,
    description,
    exercises,
    color_theme: 'primary',
    frequency_days,
    scheduled_days,
    difficulty: 'Intermediate', // Can be wired up later
    duration_mins: 60, // Can be wired up later
  })

  if (error) {
    console.error('Insert routine error: ', error)
    throw new Error('Database Error: Failed to create routine')
  }

  revalidatePath('/dashboard/routines')
  redirect('/dashboard/routines')
}

export async function updateRoutineAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const goal = formData.get('goal') as string
  const description = formData.get('description') as string
  const exercisesRaw = formData.get('exercises') as string
  const frequencyRaw = formData.get('frequency') as string
  const scheduledDaysRaw = formData.get('scheduled_days') as string
  
  const exercises = exercisesRaw ? JSON.parse(exercisesRaw) : []
  const frequency_days = frequencyRaw ? parseInt(frequencyRaw, 10) : 3
  const scheduled_days = scheduledDaysRaw ? JSON.parse(scheduledDaysRaw) : []

  const { error } = await supabase.from('routines').update({
    title,
    goal,
    description,
    exercises,
    frequency_days,
    scheduled_days
  }).eq('id', id).eq('user_id', user.id)

  if (error) {
    console.error('Update routine error: ', error)
    throw new Error('Database Error: Failed to update routine')
  }

  revalidatePath('/dashboard/routines')
  revalidatePath(`/dashboard/routines/${id}`)
  redirect(`/dashboard/routines/${id}`)
}

export async function deleteRoutineAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('routines').delete().eq('id', id).eq('user_id', user.id)

  if (error) throw new Error('Failed to delete routine')

  revalidatePath('/dashboard/routines')
  redirect('/dashboard/routines')
}
