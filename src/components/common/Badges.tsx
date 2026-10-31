import type { Asset, Task, Tutorial } from '@/types/domain'
import styles from './Badges.module.css'

export function PriorityDot({ priority }: { priority: Task['priority'] }) {
  return <span className={`${styles.dot} ${styles[`priority${priority[0].toUpperCase()}${priority.slice(1)}`]}`} />
}

export function StatusBadge({ status }: { status: Asset['status'] }) {
  const labels = { good: 'Good', attention: 'Attention', overdue: 'Overdue' }

  return (
    <span className={`${styles.badge} ${styles[status]}`}>{labels[status]}</span>
  )
}

export function DifficultyBadge({ difficulty }: { difficulty: Tutorial['difficulty'] }) {
  return (
    <span className={`${styles.badge} ${styles[difficulty.toLowerCase()]}`}>
      {difficulty}
    </span>
  )
}
