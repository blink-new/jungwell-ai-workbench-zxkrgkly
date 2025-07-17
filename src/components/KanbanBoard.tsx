import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { 
  Plus, 
  MoreHorizontal, 
  User, 
  Calendar, 
  Paperclip,
  Sparkles,
  ArrowLeft,
  ThumbsUp,
  X
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Task } from '../types'
import { blink } from '../blink/client'

const COLUMNS = [
  { id: 'parking-lot', title: 'Parking Lot', color: 'bg-gray-500' },
  { id: 'to-do', title: 'To-Do', color: 'bg-blue-500' },
  { id: 'doing', title: 'Doing', color: 'bg-jungwell-orange' },
  { id: 'done', title: 'Done', color: 'bg-green-500' }
] as const

export const KanbanBoard: React.FC = () => {
  const { tasks, setTasks, addTask, updateTask, moveTask, setCurrentView, onboardingData } = useAppStore()
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)

  // Initialize with sample tasks if empty
  useEffect(() => {
    if (tasks.length === 0) {
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Review Q4 renewal pipeline',
          description: 'Analyze upcoming renewals and identify at-risk accounts',
          status: 'to-do',
          owner: 'Sarah Chen',
          dueDate: '2024-01-20',
          subtasks: ['Pull renewal data', 'Score account health', 'Create action plan'],
          files: [],
          aiRecommendations: ['Focus on accounts with declining usage', 'Schedule check-ins with key stakeholders'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Update customer health scores',
          description: 'Refresh health scoring model with latest data',
          status: 'doing',
          owner: 'Emma Thompson',
          dueDate: '2024-01-18',
          subtasks: ['Gather usage metrics', 'Update scoring algorithm'],
          files: [],
          aiRecommendations: ['Include support ticket volume in scoring'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Prepare onboarding materials',
          description: 'Create updated onboarding deck for new customers',
          status: 'done',
          owner: 'Mike Rodriguez',
          subtasks: ['Design slides', 'Record demo videos', 'Test with pilot customer'],
          files: [],
          aiRecommendations: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setTasks(sampleTasks)
    }
  }, [tasks.length, setTasks])

  const generateAISuggestions = async () => {
    setIsGeneratingSuggestions(true)
    try {
      const { text } = await blink.ai.generateText({
        prompt: `Based on this Customer Success team's context, suggest 3-5 new backlog items:
        
        Company: ${onboardingData.companyDescription}
        Goals: ${onboardingData.quarterlyGoals.join(', ')}
        Pain Points: ${onboardingData.painPoints.join(', ')}
        Current Tasks: ${tasks.map(t => t.title).join(', ')}
        
        Generate practical, actionable task suggestions that would help achieve their goals. Format as a simple list with just the task titles.`,
        maxTokens: 200
      })
      
      const suggestions = text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 5)
      
      setAiSuggestions(suggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault()
    if (draggedTask) {
      moveTask(draggedTask, newStatus)
      setDraggedTask(null)
    }
  }

  const handleAddTask = (title: string, status: Task['status'] = 'parking-lot') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: '',
      status,
      owner: 'Unassigned',
      subtasks: [],
      files: [],
      aiRecommendations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    addTask(newTask)
    setNewTaskTitle('')
  }

  const handleAddSuggestion = (suggestion: string) => {
    handleAddTask(suggestion, 'parking-lot')
    setAiSuggestions(prev => prev.filter(s => s !== suggestion))
  }

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <Card 
      className="mb-3 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setSelectedTask(task)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <TaskDetailDialog task={task} />
          </Dialog>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{task.owner}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {task.subtasks.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-muted-foreground">
              {task.subtasks.filter(Boolean).length} / {task.subtasks.length} subtasks
            </div>
            <div className="w-full bg-secondary rounded-full h-1 mt-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all" 
                style={{ 
                  width: `${(task.subtasks.filter(Boolean).length / task.subtasks.length) * 100}%` 
                }} 
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const TaskDetailDialog: React.FC<{ task: Task }> = ({ task }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{task.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea 
            value={task.description}
            onChange={(e) => updateTask(task.id, { description: e.target.value })}
            placeholder="Add a description..."
            className="mt-1"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Owner</label>
            <Input 
              value={task.owner}
              onChange={(e) => updateTask(task.id, { owner: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Input 
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Subtasks</label>
          <div className="space-y-2 mt-2">
            {task.subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input 
                  value={subtask}
                  onChange={(e) => {
                    const newSubtasks = [...task.subtasks]
                    newSubtasks[index] = e.target.value
                    updateTask(task.id, { subtasks: newSubtasks })
                  }}
                  placeholder="Subtask..."
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const newSubtasks = task.subtasks.filter((_, i) => i !== index)
                    updateTask(task.id, { subtasks: newSubtasks })
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateTask(task.id, { subtasks: [...task.subtasks, ''] })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subtask
            </Button>
          </div>
        </div>
        
        {task.aiRecommendations.length > 0 && (
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-jungwell-orange" />
              AI Recommendations
            </label>
            <div className="space-y-2 mt-2">
              {task.aiRecommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-jungwell-red/10 to-jungwell-orange/10 rounded-lg border border-jungwell-orange/20">
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentView('dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-poppins text-xl font-semibold">Kanban Board</h1>
                <p className="text-sm text-muted-foreground">Drag and drop to manage your backlog</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={generateAISuggestions}
                disabled={isGeneratingSuggestions}
                className="border-jungwell-orange/20 text-jungwell-orange hover:bg-jungwell-orange/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGeneratingSuggestions ? 'Generating...' : 'AI Suggestions'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-jungwell-red/5 to-jungwell-orange/5 border-jungwell-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-jungwell-orange" />
                Parking Lot Genius
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on your team's goals and current work, here are some suggested backlog items:
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <span className="flex-1 text-sm">{suggestion}</span>
                    <Button 
                      size="sm"
                      onClick={() => handleAddSuggestion(suggestion)}
                      className="ml-3 gradient-jungwell hover:opacity-90 transition-opacity"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h2 className="font-poppins font-semibold">{column.title}</h2>
                <Badge variant="secondary" className="ml-auto">
                  {tasks.filter(task => task.status === column.id).length}
                </Badge>
              </div>
              
              <div 
                className="flex-1 min-h-[500px] p-4 bg-secondary/20 rounded-lg border-2 border-dashed border-secondary transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id as Task['status'])}
              >
                {tasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                
                {/* Add Task Input */}
                {column.id === 'parking-lot' && (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      <Input
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newTaskTitle.trim()) {
                            handleAddTask(newTaskTitle)
                          }
                        }}
                      />
                      <Button 
                        onClick={() => newTaskTitle.trim() && handleAddTask(newTaskTitle)}
                        disabled={!newTaskTitle.trim()}
                        size="sm"
                        className="gradient-jungwell hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}