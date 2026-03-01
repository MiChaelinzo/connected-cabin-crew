import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/but
import { Button } from '@/components/ui/button'
  Robot,
} from '@
import ThreatD
import Sec

  const [a
  const [securityEvents, setSe
    overallThreatLevel: 'low',
    containedThreats: 0,
    aiConfidence: 95,
    recommendations: []
  const [isMonitoring, setIsMonitoring] = useState(true)

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
          capabilities: ['Insp
          name: 'Guardian Alpha',
        },
          status: 'patrolling',
          name: 'Watch
          location: 'First Class Cabin',
          battery: 23,
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
          threatLevel: 'low',
          type: 'patrol',
          status: 'charging',
          battery: 23,
          location: 'Economy Zone B',
          currentTask: 'Charging',
          capabilities: ['Perimeter Security', 'Anomaly Detection'],
          lastMaintenance: Date.now() - 86400000 * 7,
  }, [robots, securityEvents, setRobots, setS
        },
    if (!
          id: 'robot-sec-004',
      setRobots(current =>
          type: 'medical',
          coordinates: ro
          battery: 92,
          location: 'Medical Bay',
          capabilities: ['Medical Triage', 'Vital Monitoring', 'Emergency Response'],
          lastMaintenance: Date.now() - 86400000 * 2,
          coordinates: { x: 15, y: 8, z: 1 }
      con
      ]
      let overallLevel: Threat
    }

    if (!securityEvents || securityEvents.length === 0) {
        if (hasCritical) overallLevel = 'criti
        {
        else overallLevel 
          type: 'suspicious-behavior',
      setThreatAssessment({
          title: 'Passenger Loitering Detected',
          description: 'AI detected unusual movement patterns in lavatory area',
          location: 'Economy Zone C - Row 45',
          timestamp: Date.now() - 300000,
          detectedBy: 'ai',
          status: 'investigating',
          assignedRobots: ['robot-sec-001']

      ]
      setSecurityEvents(initialEvents)
    }
  }, [robots, securityEvents, setRobots, setSecurityEvents])


    if (!isMonitoring) return

    const interval = setInterval(() => {
      (current || []).map(
        (current || []).map(robot => ({
          : r
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
          threatAssessment?.overa
      }

      setThreatAssessment({
            Robot Fleet
        </TabsList>
        <TabsContent value="overview
            assessment={threatAss
              activeThreats: 0,
              falseAlarms: 0,
              lastUpdated: Date.now(),
            }}
            ro
        


            onUpdateEvent={handleUpdateE
            availableRobots={availableRobots}

        <TabsContent value="robots" className="mt-6">
            robots={robots || []
              setRobots(current =>
     
   

    </div>
}






























































































































































