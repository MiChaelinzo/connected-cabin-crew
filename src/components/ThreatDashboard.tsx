import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ShieldCheck, 
  Warning, 
  Robot, 
  CheckCircle,
  Eye,
  Lightbulb,
  MapPin
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { ThreatAssessment, SecurityEvent, SecurityRobot, ThreatLevel } from '@/lib/types'

interface ThreatDashboardProps {
  assessment: ThreatAssessment
  events: SecurityEvent[]
  robots: SecurityRobot[]
  onDeployRobot: (robotId: string, location: string) => void
}

export default function ThreatDashboard({ assessment, events, robots }: ThreatDashboardProps) {
  const getThreatColor = (level: ThreatLevel) => {
    switch (level) {
      case 'none': return 'text-success'
      case 'low': return 'text-blue-500'
      case 'medium': return 'text-warning'
      case 'high': return 'text-destructive'
      case 'critical': return 'text-critical'
    }
  }

  const getThreatGradient = (level: ThreatLevel) => {
    switch (level) {
      case 'none': return 'from-success/10 to-success/5'
      case 'low': return 'from-blue-500/10 to-blue-500/5'
      case 'medium': return 'from-warning/10 to-warning/5'
      case 'high': return 'from-destructive/10 to-destructive/5'
      case 'critical': return 'from-critical/10 to-critical/5'
    }
  }

  const activeEvents = events.filter(e => e.status === 'active')
  const recentEvents = events.slice(0, 5)
  const activeRobots = robots.filter(r => r.status !== 'idle' && r.status !== 'offline' && r.status !== 'charging')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className={cn("p-6 bg-gradient-to-br", getThreatGradient(assessment.overallThreatLevel))}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-background/50 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-primary" weight="fill" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Overall Threat Level</h3>
                <p className="text-sm text-muted-foreground">AI-powered assessment</p>
              </div>
            </div>
          </div>
          
          <div className={cn("text-5xl font-bold mb-2", getThreatColor(assessment.overallThreatLevel))}>
            {assessment.overallThreatLevel.toUpperCase()}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-background/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-primary" weight="fill" />
                <span className="text-xs text-muted-foreground">AI Confidence</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{assessment.aiConfidence}%</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Warning className="w-4 h-4 text-warning" weight="fill" />
                <span className="text-xs text-muted-foreground">Active Threats</span>
              </div>
              <p className="text-2xl font-bold text-warning">{assessment.activeThreats}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-accent" weight="fill" />
            <h3 className="font-semibold text-foreground">AI Recommendations</h3>
          </div>
          
          {assessment.recommendations.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
              <CheckCircle className="w-5 h-5 text-success" weight="fill" />
              <span>No immediate actions required. Continue monitoring.</span>
            </div>
          ) : (
            <ul className="space-y-2">
              {assessment.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Robot className="w-5 h-5 text-accent" weight="fill" />
            <h3 className="font-semibold text-foreground">Active Robot Deployments</h3>
          </div>
          
          {activeRobots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No robots currently deployed</p>
          ) : (
            <div className="space-y-2">
              {activeRobots.map(robot => (
                <div key={robot.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Robot className="w-4 h-4 text-primary" weight="fill" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{robot.name}</p>
                      <p className="text-xs text-muted-foreground">{robot.currentTask || robot.status}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {robot.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Warning className="w-5 h-5 text-warning" weight="fill" />
            <h3 className="font-semibold text-foreground">Active Security Events</h3>
          </div>
          
          <ScrollArea className="h-[500px] pr-4">
            {activeEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-12 h-12 text-success mb-3" weight="fill" />
                <h4 className="font-semibold text-foreground mb-1">All Clear</h4>
                <p className="text-sm text-muted-foreground">No active security threats detected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeEvents.map(event => (
                  <div key={event.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <Badge className={cn(
                        "text-xs",
                        event.threatLevel === 'critical' ? 'bg-critical/10 text-critical' :
                        event.threatLevel === 'high' ? 'bg-destructive/10 text-destructive' :
                        event.threatLevel === 'medium' ? 'bg-warning/10 text-warning' :
                        'bg-blue-500/10 text-blue-600'
                      )}>
                        {event.threatLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" weight="fill" />
                      <span>{event.location}</span>
                      <span className="ml-auto">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-gradient-to-br from-warning/5 to-warning/10">
            <div className="flex items-center gap-2 mb-1">
              <Warning className="w-4 h-4 text-warning" weight="fill" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold text-warning">{assessment.activeThreats}</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-success/5 to-success/10">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-success" weight="fill" />
              <span className="text-xs text-muted-foreground">Contained</span>
            </div>
            <p className="text-2xl font-bold text-success">{assessment.containedThreats}</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-muted/30 to-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-muted-foreground" weight="fill" />
              <span className="text-xs text-muted-foreground">False Alarms</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{assessment.falseAlarms}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
