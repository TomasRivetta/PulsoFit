import type { ActionState } from '@/lib/types/actions'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

export interface LoginInput {
  email: string
  password: string
}

export interface SignupInput extends LoginInput {
  nombre: string
  apellido: string
}

export interface PasswordResetInput {
  email: string
}

export interface PasswordUpdateInput {
  password: string
}

export function validateLoginForm(formData: FormData): { data?: LoginInput; state?: ActionState } {
  const email = readEmail(formData, 'email')
  const password = readString(formData, 'password')

  if (!email || !password) {
    return { state: { error: 'Email y contraseña son requeridos' } }
  }

  return { data: { email, password } }
}

export function validateSignupForm(formData: FormData): { data?: SignupInput; state?: ActionState } {
  const email = readEmail(formData, 'email')
  const password = readString(formData, 'password')
  const confirmPassword = readString(formData, 'confirm-password')
  const nombre = readString(formData, 'nombre')
  const apellido = readString(formData, 'apellido')

  if (!email || !password || !confirmPassword || !nombre || !apellido) {
    return { state: { error: 'Todos los campos son requeridos' } }
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { state: { error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` } }
  }

  if (password !== confirmPassword) {
    return { state: { error: 'Las contraseñas no coinciden' } }
  }

  return {
    data: {
      apellido,
      email,
      nombre,
      password,
    },
  }
}

export function validatePasswordResetForm(formData: FormData): { data?: PasswordResetInput; state?: ActionState } {
  const email = readEmail(formData, 'email')

  if (!email) {
    return { state: { error: 'El email es requerido' } }
  }

  return { data: { email } }
}

export function validatePasswordUpdateForm(formData: FormData): { data?: PasswordUpdateInput; state?: ActionState } {
  const password = readString(formData, 'password')
  const confirmPassword = readString(formData, 'confirm-password')

  if (!password || !confirmPassword) {
    return { state: { error: 'Todos los campos son requeridos' } }
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { state: { error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` } }
  }

  if (password !== confirmPassword) {
    return { state: { error: 'Las contraseñas no coinciden' } }
  }

  return { data: { password } }
}

function readEmail(formData: FormData, field: string) {
  const value = readString(formData, field).toLowerCase()
  return EMAIL_REGEX.test(value) ? value : ''
}

function readString(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}
