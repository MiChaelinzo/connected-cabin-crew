import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Eye, 
  Warning, 
  CheckCircle, 
  Robot, 
  ChartLine,
  Siren,
  Play,
  Pause
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import ThreatDashboard from '@/components/ThreatDashboard'
import SecurityEventsList from '@/components/SecurityEventsList'
import SecurityRobotMonitor from '@/components/SecurityRobotMonitor'
import type { ThreatAssessment, SecurityEvent, SecurityRobot, ThreatLevel } from '@/lib/types'

export default function SecurityView() {
  const [threatAssessment, setThreatAssessment] = useKV<ThreatAssessment>('threat-assessment', {
    overallThreatLevel: 'none',
    activeThreats: 0,
    containedThreats: 0,
    falseAlarms: 0,
    aiConfidence: 95,
    lastUpdated: Date.now(),
    recommendations: []
  })

  const [securityEvents, setSecurityEvents] = useKV<SecurityEvent[]>('security-events', [])
  const [robots, setRobots] = useKV<SecurityRobot[]>('security-robots', [])
  const [activeTab, setActiveTab] = useState('overview')
  const [isMonitoring, setIsMonitoring] = useState(true)

  useEffect(() => {
    if (!robots || robots.length === 0) {
      const initialRobots: SecurityRobot[] = [
        {
          id: 'robot-1',
          name: 'Guardian Alpha',
          type: 'security',
          status: 'patrolling',
          battery: 87,
          location: 'Economy Zone A',
          capabilities: ['Threat Detection', 'Facial Recognition', 'Weapon Scanning', 'Communication'],
          lastMaintenance: Date.now() - 86400000 * 3,
          coordinates: { x: 10, y: 5, z: 1 }
        },
        {
          id: 'robot-2',
          name: 'Guardian Beta',
          type: 'patrol',
          status: 'patrolling',
          battery: 92,
          location: 'Business Class',
          capabilities: ['Patrol', 'Surveillance', 'Communication'],
          lastMaintenance: Date.now() - 86400000 * 5,
          coordinates: { x: 15, y: 8, z: 2 }
        },
        {
          id: 'robot-3',
          name: 'Sentinel One',
          type: 'inspection',
          status: 'idle',
          battery: 65,
          location: 'Galley Station 3',
          capabilities: ['Inspection', 'Temperature Scanning', 'Air Quality Monitoring'],
          lastMaintenance: Date.now() - 86400000 * 1,
          coordinates: { x: 20, y: 12, z: 1 }
        }
      ]
      setRobots(initialRobots)
    }

    if (!securityEvents || securityEvents.length === 0) {
      const initialEvents: SecurityEvent[] = [
        {
          id: 'event-1',
          type: 'suspicious-behavior',
          threatLevel: 'low',
          title: 'Passenger Movement Pattern Detected',
          description: 'AI detected unusual movement pattern in Economy Zone B',
          location: 'Economy Zone B - Row 32',
          timestamp: Date.now() - 300000,
          detectedBy: 'ai',
          status: 'investigating',
          assignedRobots: ['robot-1']
        }
      ]
      setSecurityEvents(initialEvents)
    }
  }, [robots, securityEvents, setRobots, setSecurityEvents])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      setRobots(currentRobots => 
        (currentRobots || []).map(robot => ({
          ...robot,
          battery: Math.max(0, robot.battery - (robot.status === 'patrolling' || robot.status === 'investigating' ? 0.5 : 0.1)),
          coordinates: robot.status === 'patrolling' && robot.coordinates ? {
            x: robot.coordinates.x + (Math.random() - 0.5) * 2,
            y: robot.coordinates.y + (Math.random() - 0.5) * 2,
            z: robot.coordinates.z
          } : robot.coordinates
        }))
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [isMonitoring, setRobots])

  const deployRobot = (robotId: string, location: string) => {
    const robot = robots?.find(r => r.id === robotId)
    if (!robot) return

    setRobots(current => 
      (current || []).map(r =>
        r.id === robotId 
          ? { ...r, status: 'responding' as const, location }
          : r
      )
    )

    setTimeout(() => {
      setRobots(current => 
        (current || []).map(r => 
          r.id === robotId 
            ? { ...r, status: 'investigating' as const }
            : r
        )
      )
    }, 3000)
  }

  const getThreatColor = (level: ThreatLevel) => {
    switch (level) {
      case 'none': return 'text-success'
      case 'low': return 'text-muted-foreground'
      case 'medium': return 'text-warning'
      case 'high': return 'text-destructive'
      case 'critical': return 'text-critical'
    }
  }

  const getThreatBadgeVariant = (level: ThreatLevel) => {
    switch (level) {
      case 'none': return 'default'
      case 'low': return 'secondary'
      case 'medium': return 'outline'
      case 'high': return 'destructive'
      case 'critical': return 'destructive'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">Security & Threat Detection</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered security monitoring and autonomous robot fleet management
          </p>
        </div>

        <Button
          onClick={() => setIsMonitoring(!isMonitoring)}
          variant={isMonitoring ? 'default' : 'outline'}
          className="gap-2"
        >
          {isMonitoring ? <Pause className="w-4 h-4" weight="fill" /> : <Play className="w-4 h-4" weight="fill" />}
          {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Threat Level</span>
            <Eye className="w-5 h-5 text-primary" weight="fill" />
          </div>
          <div className={cn("text-3xl font-bold", getThreatColor(threatAssessment?.overallThreatLevel || 'none'))}>
            {(threatAssessment?.overallThreatLevel || 'none').toUpperCase()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            AI Confidence: {threatAssessment?.aiConfidence || 0}%
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/5 to-warning/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Active Threats</span>
            <Warning className="w-5 h-5 text-warning" weight="fill" />
          </div>
          <div className="text-3xl font-bold text-warning">
            {threatAssessment?.activeThreats || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Requires investigation</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success/5 to-success/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Contained</span>
            <CheckCircle className="w-5 h-5 text-success" weight="fill" />
          </div>
          <div className="text-3xl font-bold text-success">
            {threatAssessment?.containedThreats || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Successfully resolved</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-muted/30 to-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Robots Active</span>
            <Robot className="w-5 h-5 text-accent" weight="fill" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {robots?.filter(r => r.status === 'patrolling' || r.status === 'investigating' || r.status === 'responding').length || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Out of {robots?.length || 0} total</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <ChartLine className="w-4 h-4" weight="fill" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Siren className="w-4 h-4" weight="fill" />
            Security Events
          </TabsTrigger>
          <TabsTrigger value="robots" className="gap-2">
            <Robot className="w-4 h-4" weight="fill" />
            Robot Fleet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ThreatDashboard 
            assessment={threatAssessment!}
            events={securityEvents || []}
            robots={robots || []}
            onDeployRobot={deployRobot}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <SecurityEventsList 
            events={securityEvents || []}
            onUpdateEvent={(eventId, updates) => {
              setSecurityEvents(current =>
                (current || []).map(e => e.id === eventId ? { ...e, ...updates } : e)
              )
            }}
            onDeployRobot={deployRobot}
            availableRobots={robots?.filter(r => r.status === 'idle' || r.status === 'patrolling') || []}
          />
        </TabsContent>

        <TabsContent value="robots" className="mt-6">
          <SecurityRobotMonitor 
            robots={robots || []}
            onUpdateRobot={(robotId, updates) => {
              setRobots(current =>
                (current || []).map(r => r.id === robotId ? { ...r, ...updates } : r)
              )
            }}
            onDeployRobot={(robotId, location) => deployRobot(robotId, location)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
