export type Section =
  | 'dashboard'
  | 'inventory'
  | 'reminders'
  | 'diagnostics'
  | 'tutorials'

export interface Task {
  id: string
  title: string
  category: string
  dueDate: string
  frequency: string
  assignee: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface Asset {
  id: string | number
  name: string
  category: string
  brand: string
  model: string
  installed: string
  lastService: string
  nextService: string
  status: 'good' | 'attention' | 'overdue'
  notes: string
}

export type AssetInput = Omit<Asset, 'id'>

export interface Article {
  id: string
  title: string
  category: string
  tags: string[]
  description: string
  readTime: string
  icon: string
}

export interface Tutorial {
  id: string
  title: string
  channel: string
  duration: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  thumbnail: string
  supplies: string[]
}

export interface Household {
  displayName: string
  address: string
  members: string[]
}

export interface HomeSummary {
  id: string
  name: string
  address: string
  members: string[]
}
