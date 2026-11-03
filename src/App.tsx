'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Sidebar } from '@/components/layout/Sidebar'
import { diagnosticsArticles, tutorials } from '@/data'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { Diagnostics } from '@/features/diagnostics/Diagnostics'
import { Inventory } from '@/features/inventory/Inventory'
import { Reminders } from '@/features/reminders/Reminders'
import { Tutorials } from '@/features/tutorials/Tutorials'
import type { Asset, HomeSummary, Section, Task } from '@/types/domain'
import styles from './App.module.css'

export default function App({
  assets,
  home,
  initialTasks,
}: {
  assets: Asset[]
  home: HomeSummary
  initialTasks: Task[]
}) {
  const [section, setSection] = useState<Section>('dashboard')
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const members = home.members

  const toggleTask = (id: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task => task.id === id ? { ...task, done: !task.done } : task),
    )
  }

  return (
    <div className={styles.shell}>
      <Sidebar
        activeSection={section}
        isOpen={sidebarOpen}
        onSectionChange={setSection}
        onToggle={() => setSidebarOpen(isOpen => !isOpen)}
      />

      <main className={styles.main}>
        <AppHeader
          household={{
            address: home.address,
            displayName: home.name,
            members,
          }}
          section={section}
        />

        <div className={styles.content}>
          {section === 'dashboard' && (
            <Dashboard
              assetCount={assets.length}
              householdMembers={members}
              tasks={tasks}
              onViewInventory={() => setSection('inventory')}
              onToggleTask={toggleTask}
            />
          )}
          {section === 'inventory' && <Inventory assets={assets} homeId={home.id} />}
          {section === 'reminders' && (
            <Reminders 
              homeId={home.id} 
              assets={assets} /* <-- Added assets prop here */
              reminders={tasks}
            />
          )}
          {section === 'diagnostics' && (
            <Diagnostics articles={diagnosticsArticles} />
          )}
          {section === 'tutorials' && <Tutorials tutorials={tutorials} />}
        </div>
      </main>
    </div>
  )
}