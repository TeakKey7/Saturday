import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import App from '@/App'
import { appAuth } from '@/lib/app-auth'
import type { Asset, HomeSummary, Task } from '@/types/domain'

export default async function HomeDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await appAuth.currentUser()
  if (!user) redirect('/login')
  const { id } = await params
  const payload = await getPayload({ config })

  let home
  try {
    home = await payload.findByID({
      collection: 'homes',
      depth: 1,
      id,
      overrideAccess: false,
      user,
    })
  } catch {
    notFound()
  }

  const [assetResult, dutyResult] = await Promise.all([
    payload.find({
      collection: 'assets',
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'category',
      user,
      where: { home: { equals: id } },
    }),
    payload.find({
      collection: 'duties',
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: 'dueDate',
      user,
      where: { home: { equals: id } },
    }),
  ])

  const assets: Asset[] = assetResult.docs.map(asset => ({
    id: asset.id,
    name: asset.name,
    category: asset.category,
    brand: asset.brand ?? '',
    model: asset.model ?? '',
    installed: asset.installed ?? '',
    lastService: asset.lastService ?? '',
    nextService: asset.nextService ?? '',
    status: asset.status,
    notes: asset.notes ?? '',
  }))
  const tasks: Task[] = dutyResult.docs.map(duty => ({
    id: duty.id,
    title: duty.title,
    category: duty.category,
    dueDate: duty.dueDate,
    frequency: duty.frequency,
    assignee: duty.assignee,
    done: duty.done ?? false,
    priority: duty.priority,
  }))
  const homeSummary: HomeSummary = {
    address: home.address,
    id: home.id,
    members: home.members.map(member =>
      typeof member === 'object' ? member.name : user.name,
    ),
    name: home.name,
  }

  return <App assets={assets} home={homeSummary} initialTasks={tasks} />
}
