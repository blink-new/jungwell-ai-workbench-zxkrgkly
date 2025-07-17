import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OnboardingData, Task, TeamMember, HappinessPulse, User } from '../types'

interface AppState {
  // Auth
  user: User | null
  setUser: (user: User | null) => void
  
  // Onboarding
  onboardingData: OnboardingData
  setOnboardingData: (data: Partial<OnboardingData>) => void
  
  // Current view
  currentView: 'onboarding' | 'dashboard' | 'kanban' | 'standup' | 'analytics' | 'settings' | 'integrations' | 'voice'
  setCurrentView: (view: AppState['currentView']) => void
  
  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  moveTask: (id: string, newStatus: Task['status']) => void
  
  // Team
  teamMembers: TeamMember[]
  setTeamMembers: (members: TeamMember[]) => void
  
  // Happiness
  happinessPulse: HappinessPulse[]
  setHappinessPulse: (pulse: HappinessPulse[]) => void
  
  // UI State
  isStandupMode: boolean
  setStandupMode: (mode: boolean) => void
  showConfetti: boolean
  setShowConfetti: (show: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      
      // Onboarding
      onboardingData: {
        companyDescription: '',
        teamSize: '',
        teamRoles: [],
        quarterlyGoals: [],
        systems: [],
        docsLinks: [],
        painPoints: [],
        isComplete: false,
      },
      setOnboardingData: (data) => 
        set((state) => ({ 
          onboardingData: { ...state.onboardingData, ...data } 
        })),
      
      // Current view
      currentView: 'onboarding',
      setCurrentView: (view) => set({ currentView: view }),
      
      // Tasks
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      moveTask: (id, newStatus) => {
        const { updateTask, setShowConfetti } = get()
        updateTask(id, { status: newStatus, updatedAt: new Date().toISOString() })
        if (newStatus === 'done') {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 2000)
        }
      },
      
      // Team
      teamMembers: [],
      setTeamMembers: (members) => set({ teamMembers: members }),
      
      // Happiness
      happinessPulse: [],
      setHappinessPulse: (pulse) => set({ happinessPulse: pulse }),
      
      // UI State
      isStandupMode: false,
      setStandupMode: (mode) => set({ isStandupMode: mode }),
      showConfetti: false,
      setShowConfetti: (show) => set({ showConfetti: show }),
    }),
    {
      name: 'jungwell-app-storage',
      partialize: (state) => ({
        onboardingData: state.onboardingData,
        currentView: state.currentView,
        tasks: state.tasks,
        teamMembers: state.teamMembers,
        happinessPulse: state.happinessPulse,
      }),
    }
  )
)