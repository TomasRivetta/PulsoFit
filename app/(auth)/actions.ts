'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionState } from '@/lib/types/actions'
import {
  validateLoginForm,
  validatePasswordResetForm,
  validatePasswordUpdateForm,
  validateSignupForm,
} from '@/lib/validation/auth'

export async function login(_prevState: ActionState | null, formData: FormData) {
  const validation = validateLoginForm(formData)
  if (!validation.data) {
    return validation.state
  }

  const { email, password } = validation.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(_prevState: ActionState | null, formData: FormData) {
  const validation = validateSignupForm(formData)
  if (!validation.data) {
    return validation.state
  }

  const { apellido, email, nombre, password } = validation.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: nombre,
        last_name: apellido,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Si email confirmation is off, this will log them in immediately, 
  // though typically it depends on Supabase settings. 
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error.message)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordReset(_prevState: ActionState | null, formData: FormData) {
  const validation = validatePasswordResetForm(formData)
  if (!validation.data) {
    return validation.state
  }

  const { email } = validation.data
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Se ha enviado un enlace de recuperación a tu email' }
}

export async function updatePassword(_prevState: ActionState | null, formData: FormData) {
  const validation = validatePasswordUpdateForm(formData)
  if (!validation.data) {
    return validation.state
  }

  const { password } = validation.data
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Tu contraseña ha sido actualizada correctamente' }
}
