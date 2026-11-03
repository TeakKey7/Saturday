'use client'

import { useActionState } from 'react'
import { createHomeAction, type CreateHomeState } from './actions'
import styles from './HomeSelector.module.css'

const initialState: CreateHomeState = {}

export function CreateHomeButton() {
  const [state, formAction, pending] = useActionState(createHomeAction, initialState)

  return (
    <form action={formAction}>
      <button className={styles.createHome} disabled={pending} type="submit">
        {pending ? 'Creating your home…' : 'Create my home'}
      </button>
      {state.message && <p className={styles.createError}>{state.message}</p>}
    </form>
  )
}
