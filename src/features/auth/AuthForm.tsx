'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction, signupAction, type AuthState } from './actions'
import styles from './AuthForm.module.css'

const initialState: AuthState = {}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const action = mode === 'login' ? loginAction : signupAction
  const [state, formAction, pending] = useActionState(action, initialState)
  const isLogin = mode === 'login'

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark}>S</span>
          <span>Saturday</span>
        </div>
        <p className={styles.eyebrow}>{isLogin ? 'Welcome home' : 'Create your account'}</p>
        <h1 className={styles.title}>
          {isLogin ? 'Sign in to manage your homes' : 'Start caring for your home'}
        </h1>
        <p className={styles.description}>
          {isLogin
            ? 'Your maintenance plans, inventory, and reminders are waiting.'
            : 'Create one account, then keep every home organized separately.'}
        </p>

        <form action={formAction} className={styles.form}>
          {!isLogin && (
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input autoComplete="name" id="name" name="name" placeholder="Jamie Morgan" />
              {state.fieldErrors?.name && <span>{state.fieldErrors.name}</span>}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input
              autoCapitalize="none"
              autoComplete="username"
              autoFocus={isLogin}
              id="username"
              name="username"
              placeholder="jamie"
            />
            {state.fieldErrors?.username && <span>{state.fieldErrors.username}</span>}
          </div>

          {!isLogin && (
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input autoComplete="email" id="email" name="email" placeholder="jamie@example.com" type="email" />
              {state.fieldErrors?.email && <span>{state.fieldErrors.email}</span>}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              type="password"
            />
            {state.fieldErrors?.password && <span>{state.fieldErrors.password}</span>}
          </div>

          {state.message && <p className={styles.error}>{state.message}</p>}

          <button className={styles.submit} disabled={pending} type="submit">
            {pending ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className={styles.switch}>
          {isLogin ? 'New to Saturday?' : 'Already have an account?'}{' '}
          <Link href={isLogin ? '/signup' : '/login'}>
            {isLogin ? 'Create an account' : 'Sign in'}
          </Link>
        </p>
      </section>
      <aside className={styles.preview}>
        <span className={styles.previewLabel}>One account, every home</span>
        <h2>Choose a home before you make a change.</h2>
        <p>Each home keeps its own duties, maintenance progress, and inventory completely separate.</p>
        <div className={styles.homeCards}>
          <div><strong>Maple House</strong><span>Primary residence</span></div>
          <div><strong>Lakeview Cottage</strong><span>Weekend home</span></div>
        </div>
      </aside>
    </main>
  )
}
