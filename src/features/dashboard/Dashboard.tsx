import { Avatar } from '@/components/common/Avatar'
import { PriorityDot } from '@/components/common/Badges'
import quickResources from '@/data/static/quick-resources.json'
import type { Task } from '@/types/domain'
import styles from './Dashboard.module.css'

interface DashboardProps {
  assetCount: number
  householdMembers: string[]
  tasks: Task[]
  onViewInventory: () => void
  onToggleTask: (id: string) => void
}

export function Dashboard({
  assetCount,
  householdMembers,
  tasks,
  onViewInventory,
  onToggleTask,
}: DashboardProps) {
  const upcoming = tasks.filter(task => !task.done).slice(0, 4)
  const overdue = tasks.filter(task => !task.done && task.priority === 'high')
  const completed = tasks.filter(task => task.done).length
  const total = tasks.length
  const completion = total ? Math.round((completed / total) * 100) : 0
  const stats = [
    { label: 'Tasks Due Soon', value: upcoming.length, tone: styles.lavender },
    { label: 'Needs Attention', value: overdue.length, tone: styles.red },
    { label: 'Completed', value: completed, tone: styles.sage },
    {
      label: 'Total Assets',
      value: assetCount,
      tone: styles.amber,
      onClick: onViewInventory,
    },
  ]

  return (
    <section className={styles.dashboard}>
      <div className={styles.stats}>
        {stats.map(stat => {
          const content = (
            <>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statValue}>{stat.value}</p>
            </>
          )

          return stat.onClick ? (
            <button
              aria-label="View all inventory assets"
              className={`${styles.stat} ${styles.statButton} ${stat.tone}`}
              key={stat.label}
              onClick={stat.onClick}
              type="button"
            >
              {content}
            </button>
          ) : (
            <article key={stat.label} className={`${styles.stat} ${stat.tone}`}>
              {content}
            </article>
          )
        })}
      </div>

      <div className={styles.columns}>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Coming Up</h2>
          <div className={styles.taskList}>
            {upcoming.map(task => (
              <div key={task.id} className={styles.task}>
                <button
                  aria-label={`Complete ${task.title}`}
                  onClick={() => onToggleTask(task.id)}
                  className={styles.checkbox}
                />
                <div className={styles.taskContent}>
                  <p className={styles.taskTitle}>{task.title}</p>
                  <p className={styles.meta}>{task.dueDate} · {task.category}</p>
                </div>
                <div className={styles.taskPeople}>
                  <PriorityDot priority={task.priority} />
                  <Avatar name={task.assignee} size={22} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Quick Resources</h2>
          <div className={styles.resourceList}>
            {quickResources.map(resource => (
              <div key={resource.label} className={styles.resource}>
                <span className={styles.resourceIcon}>{resource.icon}</span>
                <div>
                  <p className={styles.resourceTitle}>{resource.label}</p>
                  <p className={styles.meta}>{resource.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>This Month's Progress</h2>
          <p className={styles.month}>September 2026</p>
          <div className={styles.progressTrack}>
            <div className={styles.progress} style={{ width: `${completion}%` }} />
          </div>
          <p className={styles.progressLabel}>{completed} of {total} tasks complete</p>

          <div className={styles.memberList}>
            {householdMembers.map(name => {
              const memberTasks = tasks.filter(task => task.assignee === name)
              const memberCompleted = memberTasks.filter(task => task.done).length
              const memberProgress = memberTasks.length
                ? Math.round((memberCompleted / memberTasks.length) * 100)
                : 0

              return (
                <div key={name} className={styles.member}>
                  <Avatar name={name} size={26} />
                  <div className={styles.memberProgress}>
                    <div className={styles.memberLabel}>
                      <span>{name}</span>
                      <span>{memberCompleted}/{memberTasks.length}</span>
                    </div>
                    <div className={styles.memberTrack}>
                      <div className={styles.memberBar} style={{ width: `${memberProgress}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}
