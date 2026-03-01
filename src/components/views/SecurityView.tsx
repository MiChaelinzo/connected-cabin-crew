import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  ShieldCheck,
  Warning,
  Robot,
  Pulse
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import ThreatDashboard from '@/components/ThreatDashboard'
import SecurityEventsList from '@/components/SecurityEventsList'
import SecurityRobotMonitor from '@/components/SecurityRobotMonitor'
import type { SecurityEvent, SecurityRobot, ThreatAssessment, ThreatLevel } from '@/lib/types'

export default function SecurityView() {
  const [activeTab, setActiveTab] = useState('overview')
  const [robots, setRobots] = useKV<SecurityRobot[]>('security-robots', [])
  const [securityEvents, setSecurityEvents] = useKV<SecurityEvent[]>('security-events', [])
  const [threatAssessment, setThreatAssessment] = useKV<ThreatAssessment>('threat-assessment', {
    overallThreatLevel: 'low',
    activeThreats: 0,
    containedThreats: 0,
    falseAlarms: 0,
    aiConfidence: 95,
    lastUpdated: Date.now(),
    recommendations: []
  })
  const [isMonitoring, setIsMonitoring] = useState(true)

  useEffect(() => {
    if (!robots || robots.length === 0) {
      const initialRobots: SecurityRobot[] = [
        {
          id: 'robot-sec-001',
          name: 'Guardian Alpha',
          type: 'security',
          status: 'patrolling',
          battery: 87,
          location: 'First Class Cabin',
          currentTask: 'Routine patrol - Zone A1',
          capabilities: ['Threat Detection', 'Facial Recognition', 'Crowd Analysis'],
          lastMaintenance: Date.now() - 86400000 * 5,
          coordinates: { x: 10, y: 5, z: 1 }
        },
        {
          id: 'robot-sec-002',
          name: 'Sentinel Beta',
          type: 'inspection',
          status: 'idle',
          battery: 65,
          location: 'Business Class',
          capabilities: ['Inspection', 'Temperature Scanning', 'Biohazard Detection'],
          lastMaintenance: Date.now() - 86400000 * 3,
          coordinates: { x: 20, y: 12, z: 1 }
        },
        {
          id: 'robot-sec-003',
          name: 'Watcher Gamma',
          type: 'patrol',
          status: 'charging',
          battery: 23,
          location: 'Economy Zone B',
          currentTask: 'Charging',
          capabilities: ['Perimeter Security', 'Anomaly Detection'],
          lastMaintenance: Date.now() - 86400000 * 7,
          coordinates: { x: 35, y: 18, z: 1 }
        },
        {
          id: 'robot-sec-004',
          name: 'Medic Delta',
          type: 'medical',
          status: 'idle',
          battery: 92,
          location: 'Medical Bay',
          capabilities: ['Medical Triage', 'Vital Monitoring', 'Emergency Response'],
          lastMaintenance: Date.now() - 86400000 * 2,
          coordinates: { x: 15, y: 8, z: 1 }
        }
      ]
      setRobots(initialRobots)
    }

    if (!securityEvents || securityEvents.length === 0) {
      const initialEvents: SecurityEvent[] = [
        {
          id: 'event-001',
          type: 'suspicious-behavior',
          threatLevel: 'low',
          title: 'Passenger Loitering Detected',
          description: 'AI detected unusual movement patterns in lavatory area',
          location: 'Economy Zone C - Row 45',
          timestamp: Date.now() - 300000,
          detectedBy: 'ai',
          status: 'investigating',
          assignedRobots: ['robot-sec-001']
        }
      ]
      setSecurityEvents(initialEvents)
    }
  }, [robots, securityEvents, setRobots, setSecurityEvents])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      setRobots(current =>
        (current || []).map(robot => ({
          ...robot,
          coordinates: robot.coordinates ? {
            x: robot.coordinates.x + (Math.random() - 0.5) * 2,
            y: robot.coordinates.y + (Math.random() - 0.5) * 2,
            z: robot.coordinates.z
          } : undefined
        }))
      )

      const activeEvents = securityEvents?.filter(e => e.status === 'active' || e.status === 'investigating') || []
      const contained = securityEvents?.filter(e => e.status === 'contained').length || 0
      const falseAlarms = securityEvents?.filter(e => e.status === 'false-alarm').length || 0

      let overallLevel: ThreatLevel = 'none'
      if (activeEvents.length > 0) {
        const hasCritical = activeEvents.some(e => e.threatLevel === 'critical')
        const hasHigh = activeEvents.some(e => e.threatLevel === 'high')
        const hasMedium = activeEvents.some(e => e.threatLevel === 'medium')

        if (hasCritical) overallLevel = 'critical'
        else if (hasHigh) overallLevel = 'high'
        else if (hasMedium) overallLevel = 'medium'
        else overallLevel = 'low'
      }

      setThreatAssessment({
        overallThreatLevel: overallLevel,
        activeThreats: activeEvents.length,
        containedThreats: contained,
        falseAlarms: falseAlarms,
        aiConfidence: 85 + Math.floor(Math.random() * 15),
        lastUpdated: Date.now(),
        recommendations: activeEvents.length > 0 
          ? ['Deploy additional security robots to affected zones', 'Monitor passenger behavior patterns', 'Alert crew members in vicinity']
          : []
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [isMonitoring, securityEvents, setRobots, setThreatAssessment])

  const handleUpdateEvent = (eventId: string, updates: Partial<SecurityEvent>) => {
    setSecurityEvents(current =>
      (current || []).map(e => e.id === eventId ? { ...e, ...updates } : e)
    )
  }

  const handleDeployRobot = (robotId: string, location: string) => {
    const robot = robots?.find(r => r.id === robotId)
    if (!robot) return

    setRobots(current =>
      (current || []).map(r =>
        r.id === robotId
          ? { ...r, status: 'responding', location, currentTask: `Responding to incident at ${location}` }
          : r
      )
    )
  }

  const availableRobots = robots?.filter(r => r.status === 'idle' || r.status === 'patrolling') || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" weight="fill" />
            Security Operations
          </h2>
          <p className="text-muted-foreground mt-1">
            AI-powered security monitoring and threat assessment
          </p>
        </div>
        <Button
          variant={isMonitoring ? 'default' : 'outline'}
          onClick={() => setIsMonitoring(!isMonitoring)}
          className="gap-2"
        >
          <Pulse className="w-4 h-4" weight="fill" />
          {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={cn(
          "p-4 bg-gradient-to-br transition-all",
          threatAssessment?.overallThreatLevel === 'critical' ? 'from-critical/20 to-critical/5' :
          threatAssessment?.overallThreatLevel === 'high' ? 'from-destructive/20 to-destructive/5' :
          threatAssessment?.overallThreatLevel === 'medium' ? 'from-warning/20 to-warning/5' :
          'from-success/20 to-success/5'
        )}>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-primary" weight="fill" />
            <span className="text-xs text-muted-foreground">Threat Level</span>
          </div>
          <div className={cn(
            "text-3xl font-bold uppercase",
            threatAssessment?.overallThreatLevel === 'critical' ? 'text-critical' :
            threatAssessment?.overallThreatLevel === 'high' ? 'text-destructive' :
            threatAssessment?.overallThreatLevel === 'medium' ? 'text-warning' :
            'text-success'
          )}>
            {threatAssessment?.overallThreatLevel || 'None'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            AI Confidence: {threatAssessment?.aiConfidence || 0}%
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5">
          <div className="flex items-center gap-2 mb-1">
            <Warning className="w-5 h-5 text-warning" weight="fill" />
            <span className="text-xs text-muted-foreground">Active Threats</span>
          </div>
          <div className="text-3xl font-bold text-warning">
            {threatAssessment?.activeThreats || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Requires immediate attention
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-success" weight="fill" />
            <span className="text-xs text-muted-foreground">Contained</span>
          </div>
          <div className="text-3xl font-bold text-success">
            {threatAssessment?.containedThreats || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Successfully managed
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="flex items-center gap-2 mb-1">
            <Robot className="w-5 h-5 text-accent" weight="fill" />
            <span className="text-xs text-muted-foreground">Active Robots</span>
          </div>
          <div className="text-3xl font-bold text-accent">
            {robots?.filter(r => r.status !== 'offline' && r.status !== 'idle').length || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Currently deployed
          </p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <ShieldCheck className="w-4 h-4" weight="fill" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Warning className="w-4 h-4" weight="fill" />
            Security Events
          </TabsTrigger>
          <TabsTrigger value="robots" className="gap-2">
            <Robot className="w-4 h-4" weight="fill" />
            Robot Fleet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ThreatDashboard
            assessment={threatAssessment || {
              overallThreatLevel: 'none',
              activeThreats: 0,
              containedThreats: 0,
              falseAlarms: 0,
              aiConfidence: 95,
              lastUpdated: Date.now(),
              recommendations: []
            }}
            events={securityEvents || []}
            robots={robots || []}
            onDeployRobot={handleDeployRobot}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <SecurityEventsList
            events={securityEvents || []}
            onUpdateEvent={handleUpdateEvent}
            onDeployRobot={handleDeployRobot}
            availableRobots={availableRobots}
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
            onDeployRobot={handleDeployRobot}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
