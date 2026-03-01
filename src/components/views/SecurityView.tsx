import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  ShieldCheck,
  Robot,
  Warning
} from '@phosphor-icons/react'
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
          name: 'Guardian Alpha',
          type: 'patrol',
          status: 'patrolling',
          battery: 87,
          location: 'First Class Cabin',
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
          name: 'Defender Gamma',
          type: 'patrol',
          status: 'charging',
          battery: 23,
          location: 'Economy Zone B',
          currentTask: 'Charging',
          capabilities: ['Perimeter Security', 'Anomaly Detection'],
          lastMaintenance: Date.now() - 86400000 * 7,
          coordinates: { x: 30, y: 20, z: 1 }
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
      setRobots((current) =>
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
        return {
          ...currentAssessment,
          overallThreatLevel: overallLevel,
          activeThreats: activeEvents.length,
          containedThreats: contained,
          falseAlarms: falseAlarms,
          lastUpdated: Date.now()
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isMonitoring, securityEvents, setRobots, setThreatAssessment])

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

  const availableRobots = robots?.filter(r => r.status === 'idle' || r.status === 'patrolling') || []

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Security Center</h2>
          <p className="text-muted-foreground mt-1">AI-powered threat monitoring and response</p>
        </div>
        <Button
          variant={isMonitoring ? 'default' : 'outline'}
          onClick={() => setIsMonitoring(!isMonitoring)}
        >
          <ShieldCheck className="w-4 h-4 mr-2" weight="fill" />
          {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" weight="fill" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Warning className="w-4 h-4" weight="fill" />
            Events
          </TabsTrigger>
          <TabsTrigger value="robots" className="flex items-center gap-2">
            <Robot className="w-4 h-4" weight="fill" />
            Robot Fleet
          </TabsTrigger>
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
