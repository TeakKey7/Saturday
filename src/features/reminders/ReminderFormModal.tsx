'use client'

import { useEffect, useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Asset } from '@/types/domain'
import { saveReminderAction, type ReminderInput, type ReminderActionResult } from './actions'
import styles from './Reminders.module.css' // Reusing your modal CSS structure

const emptyReminder: ReminderInput = {
  title: '',
  asset: '',
  dueDate: '',
  frequency: 'monthly',
}

export function ReminderFormModal({
  reminder,
  homeId,
  assets,
  onClose,
  onSaved,
}: {
  reminder: (ReminderInput & { id?: string }) | null
  homeId: string
  assets: Asset[]
  onClose: () => void
  onSaved: () => void
}) {
  const router = useRouter()
  const [values, setValues] = useState<ReminderInput>(
    reminder ? {
      title: reminder.title,
      asset: typeof reminder.asset === 'object' ? reminder.asset.id : reminder.asset,
      dueDate: reminder.dueDate ? new Date(reminder.dueDate).toISOString().split('T')[0] : '',
      frequency: reminder.frequency,
    } : emptyReminder
  )
  const [result, setResult] = useState<ReminderActionResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const isEditing = reminder !== null

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const update = <Key extends keyof ReminderInput>(key: Key, value: ReminderInput[Key]) => {
    setValues(current => ({ ...current, [key]: value }))
    setResult(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startTransition(async () => {
      const nextResult = await saveReminderAction(values, homeId, reminder?.id)
      setResult(nextResult)
      if (nextResult.success) {
        onSaved()
        onClose()
        router.refresh()
      }
    })
  }

  return (
    <div className={styles.backdrop} onMouseDown={event => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div
        aria-labelledby="reminder-form-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{isEditing ? 'Reminder details' : 'New reminder'}</p>
            <h2 className={styles.title} id="reminder-form-title">
              {isEditing ? 'Edit reminder' : 'Add a reminder'}
            </h2>
          </div>
          <button aria-label="Close form" className={styles.close} onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="reminder-title">Task</label>
            <input
              autoFocus
              id="reminder-title"
              maxLength={120}
              onChange={event => update('title', event.target.value)}
              placeholder="e.g. Change water filter"
              value={values.title}
            />
            {!result?.success && result?.fieldErrors?.title && (
              <span className={styles.fieldError}>{result.fieldErrors.title}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="reminder-asset">Related Asset</label>
            <select
              id="reminder-asset"
              onChange={event => update('asset', event.target.value)}
              value={values.asset}
            >
              <option value="" disabled>Select an asset...</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.name}</option>
              ))}
            </select>
            {!result?.success && result?.fieldErrors?.asset && (
              <span className={styles.fieldError}>{result.fieldErrors.asset}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="reminder-due-date">First Due Date</label>
              <input 
                type="date"
                id="reminder-due-date" 
                onChange={event => update('dueDate', event.target.value)} 
                value={values.dueDate} 
              />
              {!result?.success && result?.fieldErrors?.dueDate && (
                <span className={styles.fieldError}>{result.fieldErrors.dueDate}</span>
              )}
            </div>
            
            <div className={styles.field}>
              <label htmlFor="reminder-frequency">Frequency</label>
              <select
                id="reminder-frequency"
                onChange={event => update('frequency', event.target.value as ReminderInput['frequency'])}
                value={values.frequency}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {result && !result.success && <p className={styles.formError}>{result.message}</p>}

          <div className={styles.actions}>
            <button className={styles.cancel} disabled={isPending} onClick={onClose} type="button">
              Cancel
            </button>
            <button className={styles.submit} disabled={isPending} type="submit">
              {isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Add reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}