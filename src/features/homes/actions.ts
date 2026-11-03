'use server'

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { appAuth } from '@/lib/app-auth'

export type CreateHomeState = {
  message?: string
}

export async function createHomeAction(
  _previous: CreateHomeState,
): Promise<CreateHomeState> {
  const user = await appAuth.currentUser()
  if (!user) redirect('/login')

  let homeId: string
  try {
    const payload = await getPayload({ config })
    const home = await payload.create({
      collection: 'homes',
      data: {
        name: 'Blank Home (Please Edit)',
        address: 'Address to be updated',
        members: [user.id],
      },
      overrideAccess: false,
      user,
    })
    homeId = home.id
  } catch {
    return { message: 'We could not create your home. Please try again.' }
  }

  redirect(`/homes/${homeId}`)
}
