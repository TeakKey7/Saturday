import 'server-only'

import { cookies } from 'next/headers'
import { getPayload, JWTAuthentication } from 'payload'
import config from '@payload-config'
import type { User } from '@/payload-types'

const SESSION_COOKIE = 'app-session'
const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  partitioned: true,
  priority: 'high',
  maxAge: 8 * 60 * 60,
  path: '/',
} as const

export function createAppAuth() {
  return {
    async currentUser(): Promise<User | null> {
      const token = (await cookies()).get(SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayload({ config })
      const headers = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await JWTAuthentication({ headers, payload })
      if (!user || user.collection !== 'users') return null
      return user
    },

    async login(username: string, password: string): Promise<User> {
      const payload = await getPayload({ config })
      const result = await payload.login({
        collection: 'users',
        data: { username, password },
        overrideAccess: false,
      })
      if (!result.token || !result.user) throw new Error('Invalid credentials')

      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE, result.token, sessionCookieOptions)
      return result.user
    },

    async logout() {
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE, '', {
        ...sessionCookieOptions,
        expires: new Date(0),
        maxAge: 0,
      })
    },
  }
}

export const appAuth = createAppAuth()
