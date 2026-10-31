import { useState } from 'react'
import type { Article } from '@/types/domain'
import styles from './Diagnostics.module.css'

export function Diagnostics({ articles }: { articles: Article[] }) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const allTags = [...new Set(articles.flatMap(article => article.tags))]
  const filtered = articles.filter(article => {
    const normalizedSearch = search.toLowerCase()
    const matchesSearch =
      !search ||
      article.title.toLowerCase().includes(normalizedSearch) ||
      article.description.toLowerCase().includes(normalizedSearch)
    return matchesSearch && (!activeTag || article.tags.includes(activeTag))
  })

  return (
    <section className={styles.diagnostics}>
      <div className={styles.controls}>
        <input
          type="search"
          aria-label="Search diagnostic articles"
          placeholder="Search issues…"
          value={search}
          onChange={event => setSearch(event.target.value)}
          className={styles.search}
        />
        <div className={styles.filters}>
          {allTags.slice(0, 6).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`${styles.filter} ${activeTag === tag ? styles.activeFilter : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map(article => (
          <article key={article.id} className={styles.article}>
            <div className={styles.articleHeader}>
              <span className={styles.icon}>{article.icon}</span>
              <span className={styles.category}>{article.category}</span>
            </div>
            <h2 className={styles.title}>{article.title}</h2>
            <p className={styles.description}>{article.description}</p>
            <div className={styles.footer}>
              <div className={styles.tags}>
                {article.tags.slice(0, 2).map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <span className={styles.readTime}>{article.readTime} read →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
