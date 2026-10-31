import { redirect } from 'next/navigation'
import { appAuth } from '@/lib/app-auth'

export default async function HomePage() {
  const user = await appAuth.currentUser()
  redirect(user ? '/homes' : '/login')
}
