import { useState } from 'react'
import { DifficultyBadge } from '@/components/common/Badges'
import type { Tutorial } from '@/types/domain'
import styles from './Tutorials.module.css'

export function Tutorials({ tutorials }: { tutorials: Tutorial[] }) {
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(tutorials.map(tutorial => tutorial.category))]
  const filtered = category === 'All'
    ? tutorials
    : tutorials.filter(tutorial => tutorial.category === category)

  return (
    <section className={styles.tutorials}>
      <div className={styles.filters}>
        {categories.map(option => (
          <button
            key={option}
            onClick={() => setCategory(option)}
            className={`${styles.filter} ${category === option ? styles.activeFilter : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map(tutorial => (
          <article key={tutorial.id} className={styles.card}>
            <div className={styles.media}>
              <img src={tutorial.thumbnail} alt={tutorial.title} className={styles.thumbnail} />
              <div className={styles.playOverlay}>
                <span className={styles.play}>▶</span>
              </div>
              <span className={styles.duration}>{tutorial.duration}</span>
            </div>
            <div className={styles.content}>
              <div className={styles.meta}>
                <DifficultyBadge difficulty={tutorial.difficulty} />
                <span className={styles.channel}>{tutorial.channel}</span>
              </div>
              <h2 className={styles.title}>{tutorial.title}</h2>
              <div className={styles.supplies}>
                <p className={styles.suppliesLabel}>You'll need</p>
                <div className={styles.supplyList}>
                  {tutorial.supplies.map(supply => (
                    <span key={supply} className={styles.supply}>{supply}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
