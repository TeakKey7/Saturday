import type { CSSProperties } from 'react'
import styles from './Avatar.module.css'

export function Avatar({ name, size = 28 }: { name?: string | null; size?: number }) {
  const colors = ['#8B7FC7', '#7E9478', '#C4BFEA', '#B5C9B1']
  
  // Provide a fallback string if name is missing or undefined
  const safeName = name || '?' 
  
  // Safely calculate the color based on the fallback
  const color = colors[safeName.charCodeAt(0) % colors.length]

  return (
    <span
      className={styles.avatar}
      style={{
        '--avatar-color': color,
        backgroundColor: 'var(--avatar-color)',
        width: size,
        height: size,
        fontSize: size * 0.4,
      } as CSSProperties}
    >
      {/* Safely grab the first character */}
      {safeName.slice(0, 1).toUpperCase()}
    </span>
  )
}