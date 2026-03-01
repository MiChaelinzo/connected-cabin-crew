import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { ShieldCheck, Robot, Warning } from '@phosphor-icons/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import ThreatDashboard from '@/components/ThreatDashboard'
import SecurityRobotMonitor from '@/components/SecurityRobotMonitor'
import SecurityEventsList from '@/components/SecurityEventsList'
import type { SecurityRobot, SecurityEvent, ThreatAssessment, ThreatLevel } from '@/lib/types'

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
          name: 'Sentinel Alpha',
          type: 'patrol',
          status: 'patrolling',
          battery: 87,
          location: 'First Class Cabin',
          currentTask: 'Perimeter Patrol',
          capabilities: ['Threat Detection', 'Facial Recognition', 'Crowd Analysis'],
          lastMaintenance: Date.now() - 86400000 * 5,
          coordinates: { x: 10, y: 5, z: 1 }
        },
        {
          id: 'robot-sec-002',
          name: 'Sentinel Beta',
          type: 'inspection',
          status: 'idle',
          battery: 92,
          location: 'Business Class',
          currentTask: 'Standby',
          capabilities: ['Inspection', 'Temperature Scanning', 'Biohazard Detection'],
          lastMaintenance: Date.now() - 86400000 * 3,
          coordinates: { x: 20, y: 12, z: 1 }
        },
        {
          id: 'robot-sec-003',
          name: 'Defender Gamma',
          type: 'patrol',
          status: 'charging',
          battery: 23,
          location: 'Galley Area',
          currentTask: 'Charging',
          capabilities: ['Perimeter Security', 'Anomaly Detection'],
          lastMaintenance: Date.now() - 86400000 * 7,
          coordinates: { x: 30, y: 8, z: 1 }
        }
      ]
      setRobots(initialRobots)
    }

    if (!securityEvents || securityEvents.length === 0) {
      const initialEvents: SecurityEvent[] = [
        {
          id: 'sec-event-001',
          type: 'alert',
          severity: 'low',
          title: 'Unattended Baggage',
          description: 'Bag detected in aisle without owner nearby',
          location: 'Row 23B',
          timestamp: Date.now() - 300000,
          status: 'investigating',
          assignedRobot: 'robot-sec-001'
        }
      ]
      setSecurityEvents(initialEvents)
    }
  }, [robots, securityEvents, setRobots, setSecurityEvents])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      setThreatAssessment((current) => {
        const defaultAssessment: ThreatAssessment = {
          overallThreatLevel: 'low',
          activeThreats: 0,
          containedThreats: 0,
          falseAlarms: 0,
          aiConfidence: 95,
          lastUpdated: Date.now(),
          recommendations: []
        }
        
        const currentAssessment = current || defaultAssessment
        const active = currentAssessment.activeThreats || 0
        const contained = currentAssessment.containedThreats || 0
        const falseAlarms = currentAssessment.falseAlarms || 0

        let overallLevel: ThreatLevel = 'low'
        if (active > 2) overallLevel = 'critical'
        else if (active > 0) overallLevel = 'medium'
        else overallLevel = 'low'

        return {
          overallThreatLevel: overallLevel,
          activeThreats: active,
          containedThreats: contained,
          falseAlarms: falseAlarms,
          aiConfidence: Math.min(95, 85 + Math.random() * 10),
          recommendations: active > 0 ? ['Maintain surveillance', 'Keep crew informed'] : [],
          lastUpdated: Date.now()
        }
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [isMonitoring, setThreatAssessment])

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
          />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <SecurityEventsList
            events={securityEvents || []}
            onUpdateEvent={handleUpdateEvent}
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
