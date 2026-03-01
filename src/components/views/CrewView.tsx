import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { UsersFour, Plus, CheckCircle, Clock, Circle } from '@phosphor-icons/react'
import type { CrewMember, CrewTask, TaskStatus } from '@/lib/types'

export default function CrewView() {
  const [crewMembers] = useKV<CrewMember[]>('crew-members', [])
  const [tasks, setTasks] = useKV<CrewTask[]>('crew-tasks', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20'
      case 'busy':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'break':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-critical/10 text-critical border-critical/20'
      case 'medium':
        return 'bg-accent/10 text-accent border-accent/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getTaskStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" weight="fill" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-accent" weight="fill" />
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.assignedTo) {
      toast.error('Please fill in all required fields')
      return
    }

    const newTask: CrewTask = {
      id: Date.now().toString(),
      ...formData,
      assignedBy: 'Current User',
      status: 'pending'
    }

    setTasks((current) => [...(current || []), newTask])
    toast.success('Task assigned successfully')
    setIsDialogOpen(false)
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium'
    })
  }

  const handleTaskStatusUpdate = (taskId: string, newStatus: TaskStatus) => {
    setTasks((current) =>
      (current || []).map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedTime: newStatus === 'completed' ? Date.now() : undefined
            }
          : task
      )
    )
    toast.success(`Task marked as ${newStatus}`)
  }

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || []
  const inProgressTasks = tasks?.filter(t => t.status === 'in-progress') || []
  const completedTasks = tasks?.filter(t => t.status === 'completed') || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Crew Coordination</h2>
          <p className="text-sm text-muted-foreground">Team status and task management</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-5 h-5" weight="bold" />
          Assign Task
        </Button>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Team Members</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {crewMembers && crewMembers.length > 0 ? (
            crewMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                        {member.role} • {member.zone}
                      </p>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <UsersFour className="w-12 h-12 mx-auto mb-3 text-muted-foreground" weight="light" />
                  <p className="text-sm text-muted-foreground">No crew data available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Task Overview</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{inProgressTasks.length}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{completedTasks.length}</div>
              <p className="text-xs text-muted-foreground">This flight</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Active Tasks</h3>
        <div className="space-y-3">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {getTaskStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>Assigned to: {task.assignedTo}</span>
                          <span>•</span>
                          <span>By: {task.assignedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      {task.status !== 'completed' && (
                        <div className="flex gap-1">
                          {task.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTaskStatusUpdate(task.id, 'in-progress')}
                            >
                              Start
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                          >
                            Complete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" weight="light" />
                  <p className="text-sm text-muted-foreground">No tasks assigned</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign New Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="Brief task description..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Detailed instructions..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-to">Assign To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                <SelectTrigger id="assign-to">
                  <SelectValue placeholder="Select crew member..." />
                </SelectTrigger>
                <SelectContent>
                  {crewMembers && crewMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value as 'low' | 'medium' | 'high'})}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Assign Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
