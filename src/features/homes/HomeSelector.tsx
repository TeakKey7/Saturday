import Link from 'next/link'
import { logoutAction } from '@/features/auth/actions'
import type { HomeSummary } from '@/types/domain'
import styles from './HomeSelector.module.css'

export function HomeSelector({
  homes,
  userName,
}: {
  homes: HomeSummary[]
  userName: string
}) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.mark}>S</span>
          <span>Saturday</span>
        </div>
        <form action={logoutAction}>
          <button className={styles.signOut} type="submit">Sign out</button>
        </form>
      </header>

      <section className={styles.content}>
        <p className={styles.eyebrow}>Welcome, {userName}</p>
        <h1>Which home are you caring for?</h1>
        <p className={styles.intro}>
          Choose a home to see only its maintenance duties, progress, and inventory.
        </p>

        {homes.length ? (
          <div className={styles.grid}>
            {homes.map((home, index) => (
              <Link className={styles.home} href={`/homes/${home.id}`} key={home.id}>
                <span className={index % 2 ? styles.sageIcon : styles.lavenderIcon}>
                  {index % 2 ? '⌂' : '⌂'}
                </span>
                <div>
                  <h2>{home.name}</h2>
                  <p>{home.address}</p>
                  <span className={styles.open}>Open dashboard →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h2>No homes yet</h2>
            <p>Ask your household administrator to add you to a home.</p>
          </div>
        )}
      </section>
    </main>
  )
}
