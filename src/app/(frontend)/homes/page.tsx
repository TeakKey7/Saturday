import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HomeSelector } from '@/features/homes/HomeSelector'
import { appAuth } from '@/lib/app-auth'
import type { HomeSummary } from '@/types/domain'

export default async function HomesPage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/login')

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'homes',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'name',
    user,
  })

  const homes: HomeSummary[] = result.docs.map(home => ({
    address: home.address,
    id: home.id,
    members: home.members.map(member =>
      typeof member === 'object' ? member.name : user.name,
    ),
    name: home.name,
  }))

  // REMOVED: if (homes.length === 1) redirect(`/homes/${homes[0].id}`)
  // Now users with exactly 1 home can successfully reach the HomeSelector to create a 2nd home.

  return <HomeSelector homes={homes} userName={user.name} />
}