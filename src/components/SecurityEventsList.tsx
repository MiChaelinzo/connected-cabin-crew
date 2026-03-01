import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Warning, 
  CheckCircle, 
  XCircle, 
  MapPin,
  Clock,
  Eye,
  Robot,
  User,
  Camera
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SecurityEvent, ThreatLevel, SecurityRobot } from '@/lib/types'

interface SecurityEventsListProps {
  events: SecurityEvent[]
  onUpdateEvent: (eventId: string, updates: Partial<SecurityEvent>) => void
  onDeployRobot: (robotId: string, location: string) => void
  availableRobots: SecurityRobot[]
}

export default function SecurityEventsList({ events, onUpdateEvent, onDeployRobot, availableRobots }: SecurityEventsListProps) {
  const getThreatColor = (level: ThreatLevel) => {
    switch (level) {
      case 'none': return 'bg-success/10 text-success border-success/20'
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-600/20'
      case 'medium': return 'bg-warning/10 text-warning border-warning/20'
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'critical': return 'bg-critical/10 text-critical border-critical/20'
    }
  }

  const getStatusColor = (status: SecurityEvent['status']) => {
    switch (status) {
      case 'active': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'investigating': return 'bg-warning/10 text-warning border-warning/20'
      case 'contained': return 'bg-blue-500/10 text-blue-600 border-blue-600/20'
      case 'resolved': return 'bg-success/10 text-success border-success/20'
      case 'false-alarm': return 'bg-muted text-muted-foreground'
    }
  }

  const getDetectionIcon = (detectedBy: SecurityEvent['detectedBy']) => {
    switch (detectedBy) {
      case 'ai': return <Eye className="w-4 h-4" weight="fill" />
      case 'crew': return <User className="w-4 h-4" weight="fill" />
      case 'sensor': return <Camera className="w-4 h-4" weight="fill" />
      case 'passenger': return <User className="w-4 h-4" weight="fill" />
    }
  }

  const handleInvestigate = (event: SecurityEvent) => {
    onUpdateEvent(event.id, { status: 'investigating' })
    toast.info(`Investigating: ${event.title}`)
  }

  const handleContain = (event: SecurityEvent) => {
    onUpdateEvent(event.id, { status: 'contained' })
    toast.success(`Threat contained: ${event.title}`)
  }

  const handleResolve = (event: SecurityEvent) => {
    onUpdateEvent(event.id, { 
      status: 'resolved',
      response: {
        actions: ['Investigated', 'Contained', 'Resolved'],
        respondedBy: ['Crew', 'Security Team'],
        resolvedAt: Date.now()
      }
    })
    toast.success(`Resolved: ${event.title}`)
  }

  const handleFalseAlarm = (event: SecurityEvent) => {
    onUpdateEvent(event.id, { status: 'false-alarm' })
    toast.info(`Marked as false alarm: ${event.title}`)
  }

  const handleDeployRobot = (event: SecurityEvent, robotId: string) => {
    onDeployRobot(robotId, event.location)
    onUpdateEvent(event.id, { 
      assignedRobots: [...(event.assignedRobots || []), robotId],
      status: 'investigating'
    })
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-3 pr-4">
        {events.length === 0 && (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" weight="fill" />
            <h3 className="font-semibold text-foreground mb-1">All Clear</h3>
            <p className="text-sm text-muted-foreground">No active security events</p>
          </Card>
        )}

        {events.map((event) => (
          <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn("text-xs font-semibold uppercase", getThreatColor(event.threatLevel))}>
                    {event.threatLevel} Risk
                  </Badge>
                  <Badge className={cn("text-xs", getStatusColor(event.status))}>
                    {event.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getDetectionIcon(event.detectedBy)}
                    <span className="capitalize">{event.detectedBy}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" weight="fill" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" weight="fill" />
                    <span>{formatTime(event.timestamp)}</span>
                  </div>
                </div>

                {event.assignedRobots && event.assignedRobots.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Robot className="w-4 h-4 text-accent" weight="fill" />
                    <span className="text-xs text-muted-foreground">
                      {event.assignedRobots.length} robot(s) deployed
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {event.status === 'active' && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleInvestigate(event)}
                  >
                    <Eye className="w-4 h-4 mr-1" weight="fill" />
                    Investigate
                  </Button>
                  {availableRobots.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeployRobot(event, availableRobots[0].id)}
                    >
                      <Robot className="w-4 h-4 mr-1" weight="fill" />
                      Deploy Robot
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFalseAlarm(event)}
                  >
                    <XCircle className="w-4 h-4 mr-1" weight="fill" />
                    False Alarm
                  </Button>
                </>
              )}

              {event.status === 'investigating' && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleContain(event)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" weight="fill" />
                    Contain
                  </Button>
                  {availableRobots.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeployRobot(event, availableRobots[0].id)}
                    >
                      <Robot className="w-4 h-4 mr-1" weight="fill" />
                      Deploy Robot
                    </Button>
                  )}
                </>
              )}

              {event.status === 'contained' && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleResolve(event)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" weight="fill" />
                  Resolve
                </Button>
              )}

              {(event.status === 'resolved' || event.status === 'false-alarm') && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" weight="fill" />
                  <span>
                    {event.status === 'resolved' ? 'Successfully resolved' : 'Marked as false alarm'}
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
