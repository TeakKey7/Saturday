import Link from 'next/link'
import { Avatar } from '@/components/common/Avatar'
import type { Household, Section } from '@/types/domain'
import styles from './AppHeader.module.css'

const titles: Record<Section, string> = {
  dashboard: 'Good morning ☀️',
  inventory: 'Home Inventory',
  reminders: 'Maintenance Reminders',
  diagnostics: 'Diagnostics Library',
  tutorials: 'Tutorials',
}

export function AppHeader({
  household,
  section,
}: {
  household: Household
  section: Section
}) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{titles[section]}</h1>
        <p className={styles.date}>
          {section === 'dashboard' ? 'Thursday, September 17, 2026' : ''}
        </p>
      </div>
      <div className={styles.household}>
        <div className={styles.avatars}>
          {household.members.map(name => <Avatar key={name} name={name} size={32} />)}
        </div>
        <div className={styles.householdDetails}>
          <p className={styles.householdName}>{household.displayName}</p>
          <p className={styles.address}>{household.address}</p>
          <Link className={styles.switchHome} href="/homes">Switch home</Link>
        </div>
      </div>
    </header>
  )
}
