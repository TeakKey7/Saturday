'use client'

import { useEffect, useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import assetCategories from '@/data/static/asset-categories.json'
import type { Asset, AssetInput } from '@/types/domain'
import { saveAssetAction, type AssetActionResult } from './actions'
import styles from './AssetFormModal.module.css'

const emptyAsset: AssetInput = {
  name: '',
  category: 'HVAC',
  brand: '',
  model: '',
  installed: '',
  lastService: '',
  nextService: '',
  status: 'good',
  notes: '',
}

export function AssetFormModal({
  asset,
  homeId,
  onClose,
  onSaved,
}: {
  asset: Asset | null
  homeId: string
  onClose: () => void
  onSaved: () => void
}) {
  const router = useRouter()
  const [values, setValues] = useState<AssetInput>(asset ?? emptyAsset)
  const [result, setResult] = useState<AssetActionResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const isEditing = asset !== null

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

  const update = <Key extends keyof AssetInput>(key: Key, value: AssetInput[Key]) => {
    setValues(current => ({ ...current, [key]: value }))
    setResult(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startTransition(async () => {
      const nextResult = await saveAssetAction(values, homeId, asset?.id)
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
        aria-labelledby="asset-form-title"
        aria-modal="true"
        className={styles.modal}
        role="dialog"
      >
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{isEditing ? 'Inventory details' : 'New inventory item'}</p>
            <h2 className={styles.title} id="asset-form-title">
              {isEditing ? 'Edit asset' : 'Add an asset'}
            </h2>
          </div>
          <button aria-label="Close asset form" className={styles.close} onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="asset-name">Asset name</label>
            <input
              autoFocus
              id="asset-name"
              maxLength={120}
              onChange={event => update('name', event.target.value)}
              placeholder="e.g. Kitchen refrigerator"
              value={values.name}
            />
            {!result?.success && result?.fieldErrors?.name && (
              <span className={styles.fieldError}>{result.fieldErrors.name}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="asset-category">Category</label>
              <select
                id="asset-category"
                onChange={event => update('category', event.target.value)}
                value={values.category}
              >
                {assetCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {!result?.success && result?.fieldErrors?.category && (
                <span className={styles.fieldError}>{result.fieldErrors.category}</span>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="asset-status">Condition</label>
              <select
                id="asset-status"
                onChange={event => update('status', event.target.value as AssetInput['status'])}
                value={values.status}
              >
                <option value="good">Good</option>
                <option value="attention">Needs attention</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="asset-brand">Brand</label>
              <input id="asset-brand" maxLength={120} onChange={event => update('brand', event.target.value)} value={values.brand} />
            </div>
            <div className={styles.field}>
              <label htmlFor="asset-model">Model</label>
              <input id="asset-model" maxLength={120} onChange={event => update('model', event.target.value)} value={values.model} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="asset-installed">Installed</label>
              <input id="asset-installed" maxLength={80} onChange={event => update('installed', event.target.value)} placeholder="e.g. Apr 2024" value={values.installed} />
            </div>
            <div className={styles.field}>
              <label htmlFor="asset-last-service">Last serviced</label>
              <input id="asset-last-service" maxLength={80} onChange={event => update('lastService', event.target.value)} placeholder="e.g. Mar 2026" value={values.lastService} />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="asset-next-service">Next service</label>
            <input id="asset-next-service" maxLength={80} onChange={event => update('nextService', event.target.value)} placeholder="e.g. Mar 2027" value={values.nextService} />
          </div>

          <div className={styles.field}>
            <label htmlFor="asset-notes">Notes</label>
            <textarea
              id="asset-notes"
              maxLength={2000}
              onChange={event => update('notes', event.target.value)}
              placeholder="Add warranty details, filter sizes, serial numbers, or care instructions."
              rows={4}
              value={values.notes}
            />
          </div>

          {result && !result.success && <p className={styles.formError}>{result.message}</p>}

          <div className={styles.actions}>
            <button className={styles.cancel} disabled={isPending} onClick={onClose} type="button">
              Cancel
            </button>
            <button className={styles.submit} disabled={isPending} type="submit">
              {isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Add asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
