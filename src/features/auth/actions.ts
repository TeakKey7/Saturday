'use server'

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { appAuth } from '@/lib/app-auth'

export type AuthState = {
  message?: string
  fieldErrors?: {
    email?: string
    name?: string
    password?: string
    username?: string
  }
}

const usernamePattern = /^[a-zA-Z0-9._-]{3,40}$/

export async function loginAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const fieldErrors: AuthState['fieldErrors'] = {}

  if (!username) fieldErrors.username = 'Enter your username.'
  if (!password) fieldErrors.password = 'Enter your password.'
  if (Object.keys(fieldErrors).length) return { fieldErrors }

  try {
    await appAuth.login(username, password)
  } catch {
    return { message: 'That username or password is not correct.' }
  }

  redirect('/homes')
}

export async function signupAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get('name') ?? '').trim()
  const username = String(formData.get('username') ?? '').trim().toLowerCase()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const fieldErrors: AuthState['fieldErrors'] = {}

  if (!name) fieldErrors.name = 'Enter your name.'
  if (!usernamePattern.test(username)) {
    fieldErrors.username = 'Use 3–40 letters, numbers, dots, dashes, or underscores.'
  }
  if (!email || !email.includes('@')) fieldErrors.email = 'Enter a valid email address.'
  if (password.length < 8) fieldErrors.password = 'Use at least 8 characters.'
  if (Object.keys(fieldErrors).length) return { fieldErrors }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'users',
      data: { email, name, password, username },
      overrideAccess: false,
    })
    await appAuth.login(username, password)
  } catch {
    return { message: 'We could not create that account. Try another username or email.' }
  }

  redirect('/homes')
}

export async function logoutAction() {
  await appAuth.logout()
  redirect('/login')
}
