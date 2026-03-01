import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldCheck } from '@phosphor-icons/react'
import SecurityRobotMonitor from '@/components/SecurityRobotMonitor'
import ThreatDashboard from '@/components/ThreatDashboard'
import SecurityEventsList from '@/components/SecurityEventsList'
import type { SecurityRobot, SecurityEvent, ThreatAssessment } from '@/lib/types'

export default function SecurityView() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMonitoring, setIsMonitoring] = useState(true)
  
  const [threatAssessment, setThreatAssessment] = useKV<ThreatAssessment>('threat-assessment', {
    overallThreatLevel: 'low',
    activeThreats: 0,
    containedThreats: 0,
    falseAlarms: 0,
    aiConfidence: 95,
    lastUpdated: Date.now(),
    recommendations: []
  })

  const [robots, setRobots] = useKV<SecurityRobot[]>('security-robots', [])
  const [securityEvents, setSecurityEvents] = useKV<SecurityEvent[]>('security-events', [])

  useEffect(() => {
    if (!robots || robots.length === 0) {
      const initialRobots: SecurityRobot[] = [
        {
          id: 'robot-1',
          name: 'Sentinel Alpha',
          type: 'patrol',
          status: 'patrolling',
          battery: 85,
          location: 'First Class',
          capabilities: ['Surveillance', 'Thermal Scanning', 'Audio Detection'],
          lastMaintenance: Date.now() - 86400000 * 3,
          coordinates: { x: 10, y: 5, z: 1 },
          assignedZone: 'Zone A'
        },
        {
          id: 'robot-2',
          name: 'Sentinel Beta',
          type: 'security',
          status: 'idle',
          battery: 92,
          location: 'Business Class',
          capabilities: ['Threat Assessment', 'Crowd Control', 'Emergency Response'],
          lastMaintenance: Date.now() - 86400000 * 5,
          coordinates: { x: 30, y: 15, z: 1 },
          assignedZone: 'Zone B'
        },
        {
          id: 'robot-3',
          name: 'Defender Gamma',
          type: 'inspection',
          status: 'charging',
          battery: 45,
          location: 'Galley Area',
          capabilities: ['Perimeter Scan', 'Object Recognition', 'Chemical Detection'],
          lastMaintenance: Date.now() - 86400000 * 2,
          coordinates: { x: 50, y: 25, z: 1 },
          assignedZone: 'Zone C'
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
          title: 'Unattended Baggage',
          description: 'Carry-on bag left unattended for 5+ minutes',
          location: 'Row 23B',
          timestamp: Date.now() - 600000,
          detectedBy: 'ai',
          status: 'investigating',
          assignedRobots: ['robot-1']
        }
      ]
      setSecurityEvents(initialEvents)
    }
  }, [robots, securityEvents, setRobots, setSecurityEvents])

  useEffect(() => {
    if (isMonitoring) {
      setThreatAssessment((current) => {
        const defaultAssessment: ThreatAssessment = {
          overallThreatLevel: 'low',
          activeThreats: 0,
          containedThreats: 0,
          falseAlarms: 0,
          aiConfidence: 95,
          recommendations: [],
          lastUpdated: Date.now()
        }
        
        const currentAssessment = current || defaultAssessment
        const events = securityEvents || []
        const active = events.filter(e => e.status === 'active' || e.status === 'investigating').length
        const contained = events.filter(e => e.status === 'contained').length
        const falseAlarms = events.filter(e => e.status === 'false-alarm').length

        let overallLevel: ThreatAssessment['overallThreatLevel'] = 'none'
        if (active > 2) overallLevel = 'high'
        else if (active > 0) overallLevel = 'low'

        return {
          ...currentAssessment,
          overallThreatLevel: overallLevel,
          activeThreats: active,
          containedThreats: contained,
          falseAlarms: falseAlarms,
          aiConfidence: Math.min(95, currentAssessment.aiConfidence + Math.random() * 2 - 1),
          lastUpdated: Date.now()
        }
      })
    }
  }, [isMonitoring, securityEvents, setThreatAssessment])

  const handleUpdateEvent = (eventId: string, updates: Partial<SecurityEvent>) => {
    setSecurityEvents((current) =>
      (current || []).map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    )
  }

  const handleUpdateRobot = (robotId: string, updates: Partial<SecurityRobot>) => {
    setRobots((current) =>
      (current || []).map(robot =>
        robot.id === robotId ? { ...robot, ...updates } : robot
      )
    )
  }

  const handleDeployRobot = (robotId: string, location: string) => {
    setRobots((current) =>
      (current || []).map(robot =>
        robot.id === robotId
          ? { ...robot, status: 'responding', location, currentTask: `Responding to ${location}` }
          : robot
      )
    )
  }

  const availableRobots = (robots || []).filter(r => r.status === 'idle' || r.status === 'patrolling')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Security Operations</h2>
          <p className="text-sm text-muted-foreground mt-1">AI-powered threat monitoring and autonomous security</p>
        </div>
        <Button
          variant={isMonitoring ? 'default' : 'outline'}
          onClick={() => setIsMonitoring(!isMonitoring)}
          className="gap-2"
        >
          <ShieldCheck className="w-4 h-4" weight="bold" />
          {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="robots">Robot Fleet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ThreatDashboard
            assessment={threatAssessment || {
              overallThreatLevel: 'low',
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
            onUpdateRobot={handleUpdateRobot}
            onDeployRobot={handleDeployRobot}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
