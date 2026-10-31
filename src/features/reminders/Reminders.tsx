import { useState } from 'react'
import { Avatar } from '@/components/common/Avatar'
import { PriorityDot } from '@/components/common/Badges'
import frequencies from '@/data/static/reminder-frequencies.json'
import type { Task } from '@/types/domain'
import styles from './Reminders.module.css'

export function Reminders({
  tasks,
  onToggleTask,
}: {
  tasks: Task[]
  onToggleTask: (id: string) => void
}) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'done'>('all')
  const filtered = tasks.filter(task => {
    if (filter === 'upcoming') return !task.done
    if (filter === 'done') return task.done
    return true
  })

  return (
    <section className={styles.reminders}>
      <div className={styles.filters}>
        {(['all', 'upcoming', 'done'] as const).map(option => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`${styles.filter} ${filter === option ? styles.activeFilter : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className={styles.board}>
        {frequencies.map(frequency => {
          const columnTasks = filtered.filter(task => task.frequency === frequency)
          if (columnTasks.length === 0) return null

          return (
            <section key={frequency}>
              <h2 className={styles.frequency}>{frequency}</h2>
              <div className={styles.taskList}>
                {columnTasks.map(task => (
                  <article className={`${styles.task} ${task.done ? styles.done : ''}`} key={task.id}>
                    <div className={styles.taskHeader}>
                      <button
                        aria-label={`${task.done ? 'Reopen' : 'Complete'} ${task.title}`}
                        onClick={() => onToggleTask(task.id)}
                        className={`${styles.checkbox} ${task.done ? styles.checked : ''}`}
                      >
                        {task.done && <span>✓</span>}
                      </button>
                      <p className={styles.taskTitle}>{task.title}</p>
                    </div>
                    <div className={styles.taskMeta}>
                      <div className={styles.category}>
                        <PriorityDot priority={task.priority} />
                        <span>{task.category}</span>
                      </div>
                      <div className={styles.assignee}>
                        <Avatar name={task.assignee} size={20} />
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                    <p className={styles.dueDate}>Due {task.dueDate}</p>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
