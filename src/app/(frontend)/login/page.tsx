import { redirect } from 'next/navigation'
import { AuthForm } from '@/features/auth/AuthForm'
import { appAuth } from '@/lib/app-auth'

export default async function LoginPage() {
  if (await appAuth.currentUser()) redirect('/homes')
  return <AuthForm mode="login" />
}
