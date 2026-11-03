'use client'

import { useState } from 'react'
import type { Asset } from '@/types/domain'
import { ReminderFormModal } from './ReminderFormModal'
import styles from './Reminders.module.css'

export function Reminders({ reminders = [], assets = [], homeId }: { reminders?: any[]; assets?: Asset[]; homeId: string }) {
  const [selected, setSelected] = useState<any | null>(null)
  const [formReminder, setFormReminder] = useState<any | null | undefined>(undefined)

  return (
    <section>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.summary}>{reminders.length} scheduled reminders</p>
        </div>
        <button className={styles.addButton} onClick={() => setFormReminder(null)}>
          <span aria-hidden="true">+</span>
          Add reminder
        </button>
      </div>

      <div className={styles.inventory}>
        <div className={styles.catalog}>
          <div className={styles.grid}>
            {reminders.map(reminder => {
              const assetTitle = typeof reminder.asset === 'object' ? reminder.asset?.name : 'Unknown Asset'
              return (
                <button
                  key={reminder.id}
                  onClick={() => setSelected(reminder === selected ? null : reminder)}
                  className={`${styles.asset} ${selected?.id === reminder.id ? styles.selected : ''}`}
                >
                  <div className={styles.assetHeader}>
                    <p className={styles.assetName}>{reminder.title}</p>
                  </div>
                  <p className={styles.meta}>Asset: {assetTitle}</p>
                  <p className={styles.service}>
                    Due: <strong>{new Date(reminder.dueDate).toLocaleDateString()}</strong> · {reminder.frequency}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {selected && (
          <aside className={styles.details}>
            <div className={styles.detailsHeader}>
              <h2 className={styles.detailsTitle}>Details</h2>
              <button
                aria-label="Close details"
                onClick={() => setSelected(null)}
                className={styles.close}
              >
                ×
              </button>
            </div>
            
            <h3 className={styles.selectedName}>{selected.title}</h3>
            <p className={styles.selectedModel}>Asset: {typeof selected.asset === 'object' ? selected.asset.name : 'Unknown'}</p>
            
            <button className={styles.editButton} onClick={() => setFormReminder(selected)}>
              Edit reminder
            </button>

            <dl className={styles.definitionList}>
              {[
                { label: 'Due Date', value: new Date(selected.dueDate).toLocaleDateString() },
                { label: 'Frequency', value: selected.frequency },
              ].map(row => (
                <div key={row.label} className={styles.definition}>
                  <dt>{row.label}</dt>
                  <dd className="capitalize">{row.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </div>

      {formReminder !== undefined && (
        <ReminderFormModal
          reminder={formReminder}
          homeId={homeId}
          assets={assets}
          onClose={() => setFormReminder(undefined)}
          onSaved={() => setSelected(null)}
        />
      )}
    </section>
  )
}