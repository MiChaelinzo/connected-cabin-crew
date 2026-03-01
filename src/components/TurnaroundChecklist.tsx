import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Clipboard, 
  CheckCircle, 
  Clock, 
  Timer,
  Rocket
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ChecklistItem {
  id: string
  label: string
  category: 'safety' | 'service' | 'cabin' | 'inventory'
  completed: boolean
  completedAt?: number
  assignedZone?: string
}

export default function TurnaroundChecklist() {
  const [startTime, setStartTime] = useKV<number | null>('turnaround-start', null)
  const [items, setItems] = useKV<ChecklistItem[]>('turnaround-checklist', [
    { id: 'safety-check', label: 'Safety equipment check', category: 'safety', completed: false },
    { id: 'seats-upright', label: 'All seats upright & tables stowed', category: 'cabin', completed: false },
    { id: 'seatbelts', label: 'Seatbelts inspected', category: 'safety', completed: false },
    { id: 'overhead-bins', label: 'Overhead bins secured', category: 'cabin', completed: false },
    { id: 'galley-stocked', label: 'Galley fully stocked', category: 'inventory', completed: false },
    { id: 'waste-removed', label: 'Waste removed & restocked', category: 'service', completed: false },
    { id: 'lavatories', label: 'Lavatories serviced', category: 'service', completed: false },
    { id: 'reading-lights', label: 'Reading lights functional', category: 'cabin', completed: false },
    { id: 'ife-systems', label: 'IFE systems reset', category: 'cabin', completed: false },
    { id: 'emergency-exits', label: 'Emergency exits clear', category: 'safety', completed: false }
  ])

  const toggleItem = (itemId: string) => {
    if (!startTime) {
      setStartTime(Date.now())
    }

    setItems(current =>
      (current || []).map(item =>
        item.id === itemId
          ? { ...item, completed: !item.completed, completedAt: !item.completed ? Date.now() : undefined }
          : item
      )
    )
  }

  const resetChecklist = () => {
    setItems(current =>
      (current || []).map(item => ({ ...item, completed: false, completedAt: undefined }))
    )
    setStartTime(null)
    toast.success('Checklist reset', {
      description: 'Ready for next turnaround'
    })
  }

  const completeAll = () => {
    if (!startTime) {
      setStartTime(Date.now())
    }

    setItems(current =>
      (current || []).map(item => ({ ...item, completed: true, completedAt: Date.now() }))
    )
    
    const duration = startTime ? Math.round((Date.now() - startTime) / (1000 * 60)) : 0
    toast.success('Turnaround complete!', {
      description: `All checks completed in ${duration} minutes`
    })
  }

  const completedCount = items?.filter(i => i.completed).length || 0
  const totalCount = items?.length || 0
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const elapsedTime = startTime ? Math.round((Date.now() - startTime) / (1000 * 60)) : 0

  const categories = {
    safety: { label: 'Safety', color: 'text-critical' },
    service: { label: 'Service', color: 'text-accent' },
    cabin: { label: 'Cabin', color: 'text-primary' },
    inventory: { label: 'Inventory', color: 'text-warning' }
  }

  const getCategoryItems = (category: string) =>
    items?.filter(i => i.category === category) || []

  const getCategoryProgress = (category: string) => {
    const categoryItems = getCategoryItems(category)
    const completed = categoryItems.filter(i => i.completed).length
    return categoryItems.length > 0 ? (completed / categoryItems.length) * 100 : 0
  }

  return (
    <Card className={progress === 100 ? 'border-success/30 bg-success/5' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-primary" weight="fill" />
            Turnaround Checklist
            {progress === 100 && (
              <CheckCircle className="w-5 h-5 text-success" weight="fill" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {startTime && (
              <Badge variant="outline" className="font-mono text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {elapsedTime} min
              </Badge>
            )}
            <Badge variant="outline" className="font-mono text-xs">
              {completedCount}/{totalCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {Object.entries(categories).map(([key, { label, color }]) => {
          const categoryItems = getCategoryItems(key)
          const categoryProgress = getCategoryProgress(key)

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${color}`}>{label}</span>
                <span className="text-xs text-muted-foreground">{Math.round(categoryProgress)}%</span>
              </div>
              <div className="space-y-1.5">
                {categoryItems.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      item.completed
                        ? 'bg-success/5 hover:bg-success/10'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="shrink-0"
                    />
                    <span className={`text-sm flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.label}
                    </span>
                    {item.completed && (
                      <CheckCircle className="w-4 h-4 text-success shrink-0" weight="fill" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )
        })}

        <div className="flex gap-2 pt-2 border-t">
          {progress < 100 && (
            <Button
              size="sm"
              className="flex-1"
              onClick={completeAll}
            >
              <Rocket className="w-4 h-4 mr-1.5" weight="fill" />
              Complete All
            </Button>
          )}
          {progress > 0 && (
            <Button
              size="sm"
              variant="outline"
              className={progress === 100 ? 'flex-1' : ''}
              onClick={resetChecklist}
            >
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
