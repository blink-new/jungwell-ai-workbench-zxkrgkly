import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { 
  Bot,
  BarChart3,
  FlaskConical,
  FileText,
  Sparkles,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Download
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { blink } from '../blink/client'

interface Agent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  capabilities: string[]
  status: 'idle' | 'working' | 'completed' | 'error'
  lastRun?: string
  progress?: number
}

interface AgentTask {
  id: string
  agentId: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: string
  createdAt: string
  completedAt?: string
}

export const AIAgents: React.FC = () => {
  const { tasks } = useAppStore()
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [taskDescription, setTaskDescription] = useState('')
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const agents: Agent[] = [
    {
      id: 'data-scout',
      name: 'Data Scout',
      description: 'Fetches and plots metrics from your connected systems',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      capabilities: [
        'Pull KPIs from Salesforce, HubSpot, and other systems',
        'Generate charts and visualizations',
        'Identify trends and anomalies',
        'Create automated reports'
      ],
      status: 'idle',
      lastRun: '2 hours ago'
    },
    {
      id: 'experiment-runner',
      name: 'Experiment Runner',
      description: 'Designs A/B tests, predicts lift, and returns execution plans',
      icon: <FlaskConical className="w-6 h-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      capabilities: [
        'Design A/B test frameworks',
        'Calculate statistical significance',
        'Predict expected lift and impact',
        'Generate implementation roadmaps'
      ],
      status: 'idle',
      lastRun: '1 day ago'
    },
    {
      id: 'retro-scribe',
      name: 'Retro Scribe',
      description: 'Summarizes sprint learnings and generates actionable insights',
      icon: <FileText className="w-6 h-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      capabilities: [
        'Analyze sprint performance',
        'Extract key learnings and blockers',
        'Generate retrospective summaries',
        'Suggest process improvements'
      ],
      status: 'completed',
      lastRun: '30 minutes ago',
      progress: 100
    }
  ]

  const handleAssignTask = async (agent: Agent) => {
    if (!taskDescription.trim()) return

    setIsRunning(true)
    
    const newTask: AgentTask = {
      id: Date.now().toString(),
      agentId: agent.id,
      title: taskDescription.slice(0, 50) + (taskDescription.length > 50 ? '...' : ''),
      description: taskDescription,
      status: 'running',
      createdAt: new Date().toISOString()
    }

    setAgentTasks(prev => [...prev, newTask])
    setTaskDescription('')

    try {
      // Simulate AI agent work based on agent type
      let prompt = ''
      switch (agent.id) {
        case 'data-scout':
          prompt = `As a Data Scout agent, analyze this request and provide insights: "${taskDescription}". Focus on data analysis, metrics, and actionable insights.`
          break
        case 'experiment-runner':
          prompt = `As an Experiment Runner agent, design an A/B test for: "${taskDescription}". Include hypothesis, test design, success metrics, and expected outcomes.`
          break
        case 'retro-scribe':
          prompt = `As a Retro Scribe agent, analyze and summarize: "${taskDescription}". Focus on learnings, patterns, and improvement recommendations.`
          break
      }

      const { text } = await blink.ai.generateText({
        prompt,
        maxTokens: 500
      })

      // Update task with result
      setAgentTasks(prev => 
        prev.map(task => 
          task.id === newTask.id 
            ? { 
                ...task, 
                status: 'completed', 
                result: text,
                completedAt: new Date().toISOString()
              }
            : task
        )
      )

    } catch (error) {
      console.error('Agent task failed:', error)
      setAgentTasks(prev => 
        prev.map(task => 
          task.id === newTask.id 
            ? { ...task, status: 'failed' }
            : task
        )
      )
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'working':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Bot className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: AgentTask['status']) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-yellow-100 text-yellow-700">Running</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const AgentDetailDialog: React.FC<{ agent: Agent }> = ({ agent }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className={`w-12 h-12 ${agent.bgColor} rounded-xl flex items-center justify-center`}>
            <div className={agent.color}>{agent.icon}</div>
          </div>
          <div>
            <h2 className="font-poppins text-xl">{agent.name}</h2>
            <p className="text-sm text-muted-foreground font-normal">{agent.description}</p>
          </div>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Capabilities</h3>
          <div className="space-y-2">
            {agent.capabilities.map((capability, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{capability}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Assign New Task</h3>
          <Textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder={`Describe what you'd like ${agent.name} to help with...`}
            className="min-h-[100px]"
          />
          <div className="flex gap-2 mt-3">
            <Button 
              onClick={() => handleAssignTask(agent)}
              disabled={!taskDescription.trim() || isRunning}
              className="gradient-jungwell hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4 mr-2" />
              {isRunning ? 'Assigning...' : 'Assign Task'}
            </Button>
            <Button variant="outline" onClick={() => setTaskDescription('')}>
              Clear
            </Button>
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <h3 className="font-medium mb-3">Recent Tasks</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {agentTasks
              .filter(task => task.agentId === agent.id)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {getStatusBadge(task.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                  {task.result && (
                    <div className="mt-2 p-2 bg-secondary/50 rounded text-xs">
                      <strong>Result:</strong> {task.result.slice(0, 200)}...
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{new Date(task.createdAt).toLocaleString()}</span>
                    {task.result && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            
            {agentTasks.filter(task => task.agentId === agent.id).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-poppins text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-jungwell-orange" />
          AI Agents
        </h2>
        <p className="text-muted-foreground">
          Delegate specialized tasks to AI agents that work alongside your team
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-jungwell-red/5 to-jungwell-orange/5 border-jungwell-orange/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 gradient-jungwell rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Quick Agent Assignment</h3>
              <p className="text-sm text-muted-foreground">
                Tag any task with "Send to Agent" to delegate it automatically
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <span className="text-sm flex-1">{task.title}</span>
                <Button size="sm" variant="outline" className="ml-2">
                  <Bot className="w-3 h-3 mr-1" />
                  Assign
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${agent.bgColor} rounded-xl flex items-center justify-center`}>
                    <div className={agent.color}>{agent.icon}</div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-normal">
                      {agent.description}
                    </p>
                  </div>
                </div>
                {getStatusIcon(agent.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last run:</span>
                  <span>{agent.lastRun}</span>
                </div>
                
                {agent.progress !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{agent.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-jungwell-red to-jungwell-orange h-2 rounded-full transition-all"
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1 gradient-jungwell hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Assign Task
                      </Button>
                    </DialogTrigger>
                    <AgentDetailDialog agent={agent} />
                  </Dialog>
                  
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Agent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentTasks
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((task) => {
                const agent = agents.find(a => a.id === task.agentId)
                return (
                  <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`w-10 h-10 ${agent?.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <div className={agent?.color}>{agent?.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        {getStatusBadge(task.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {agent?.name} • {new Date(task.createdAt).toLocaleString()}
                      </p>
                      {task.result && (
                        <div className="text-xs bg-secondary/50 p-2 rounded">
                          {task.result.slice(0, 150)}...
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            
            {agentTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No agent tasks yet. Assign your first task to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}