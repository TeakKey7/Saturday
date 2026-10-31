import navigationData from '@/data/static/navigation.json'
import type { Section } from '@/types/domain'
import styles from './Sidebar.module.css'

interface SidebarProps {
  activeSection: Section
  isOpen: boolean
  onSectionChange: (section: Section) => void
  onToggle: () => void
}

const navigation = navigationData as { id: Section; label: string; icon: string }[]

export function Sidebar({
  activeSection,
  isOpen,
  onSectionChange,
  onToggle,
}: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.brand}>
        <div className={styles.mark}>S</div>
        {isOpen && <span className={styles.brandName}>Saturday</span>}
      </div>

      <nav className={styles.navigation}>
        {navigation.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {isOpen && item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className={styles.collapse}
      >
        <span>{isOpen ? '←' : '→'}</span>
        {isOpen && <span>Collapse</span>}
      </button>
    </aside>
  )
}
