export interface User {
  id: string
  email: string
  displayName?: string
}

export interface OnboardingData {
  companyDescription: string
  teamSize: string
  teamRoles: string[]
  quarterlyGoals: string[]
  systems: string[]
  docsLinks: string[]
  painPoints: string[]
  isComplete: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'parking-lot' | 'to-do' | 'doing' | 'done'
  owner: string
  dueDate?: string
  subtasks: string[]
  files: string[]
  aiRecommendations: string[]
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  status: 'online' | 'offline' | 'in-standup'
}

export interface HappinessPulse {
  userId: string
  score: number
  suggestion: string
  month: string
  year: number
}

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  type?: 'text' | 'suggestion' | 'system'
}