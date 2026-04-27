'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionState } from '@/lib/types/actions'
import { validateRoutineForm } from '@/lib/validation/routines'

export async function createRoutineAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const validation = validateRoutineForm(formData)
  if (!validation.data) {
    return { error: validation.error ?? 'Payload inválido' } satisfies ActionState
  }

  const { error } = await supabase.from('routines').insert({
    user_id: user.id,
    ...validation.data,
    color_theme: 'primary',
  })

  if (error) {
    console.error('Insert routine error: ', error)
    return { error: 'No se pudo crear la rutina' } satisfies ActionState
  }

  revalidatePath('/dashboard/routines')
  redirect('/dashboard/routines')
}

export async function updateRoutineAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const validation = validateRoutineForm(formData)
  if (!validation.data) {
    return { error: validation.error ?? 'Payload inválido' } satisfies ActionState
  }

  const { error } = await supabase.from('routines').update({
    ...validation.data,
  }).eq('id', id).eq('user_id', user.id)

  if (error) {
    console.error('Update routine error: ', error)
    return { error: 'No se pudo actualizar la rutina' } satisfies ActionState
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
