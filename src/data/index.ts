import diagnosticsData from './static/diagnostics.json'
import tutorialsData from './static/tutorials.json'
import type { Article, Tutorial } from '@/types/domain'

export const diagnosticsArticles = diagnosticsData as Article[]
export const tutorials = tutorialsData as Tutorial[]
