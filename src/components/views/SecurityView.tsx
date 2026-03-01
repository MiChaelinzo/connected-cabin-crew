import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { 
  Robot,
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
    if (!robots || ro
    containedThreats: 0,
          id: 'robo
    aiConfidence: 95,
          status: 'patrollin
    recommendations: []
  })
  const [isMonitoring, setIsMonitoring] = useState(true)

  useEffect(() => {
          name: 'Sentinel Beta',
      const initialRobots: SecurityRobot[] = [
         
          id: 'robot-sec-001',
          lastMaintenance: Date.n
          type: 'patrol',
        {
          battery: 87,
          location: 'First Class Cabin',
          capabilities: ['Threat Detection', 'Facial Recognition', 'Crowd Analysis'],
          lastMaintenance: Date.now() - 86400000 * 5,
          coordinates: { x: 10, y: 5, z: 1 }
          
        {
          id: 'robot-sec-002',
          name: 'Sentinel Beta',
          type: 'inspection',
          status: 'idle',
          location: 'M
          location: 'Business Class',
          capabilities: ['Inspection', 'Temperature Scanning', 'Biohazard Detection'],
          lastMaintenance: Date.now() - 86400000 * 3,
          coordinates: { x: 20, y: 12, z: 1 }
        },
    if (!
          id: 'robot-sec-003',
          name: 'Defender Gamma',
          type: 'patrol',
          status: 'charging',
          battery: 23,
          timestamp: Date.now() - 300
          currentTask: 'Charging',
          capabilities: ['Perimeter Security', 'Anomaly Detection'],
          lastMaintenance: Date.now() - 86400000 * 7,
        else overallLevel = 'low'

        c
          activeThreats: 0,
          falseAlarms: 0,
          lastUpdated: Dat
        }
        return {
          overallThreatLevel: over
          containedThreats: contained,
          lastUpdated: Date.now()
      })

  }, [i
  const handleUpdateEvent = (e
     

  }
  const handleUpdateRobot = (robotId: string, 
      (cu
      )
  }
  const handleDeployRobot = (
      (current || []).map(robot =>
          ? { ...robot, status: 'responding', location, currentTask: `Responding
      )
  }
  const availableRobots = r
  return (
      <div className="flex items-center jus
         
       
          variant={isMonitoring ? 'def
     
          {isMonitoring ? 'Monitoring Active' : 'Monitoring 

      <Tabs value={
          <TabsTrigger value=

          <TabsTrigger value="events" cl
            Events
          <TabsTrigger value="robots" c
            Robot F
        </TabsList>
        <TabsContent value="overview" className="mt-6">
            assessment={threatAssessment || {
              activeThreats: 0,
              falseAlar
           
       

          />

          <SecurityEventsList

            availableRobots={availableRobots
        </TabsContent>
        <TabsContent value="robots" className="mt-6">
            robots={robots || []}
            onDeployRobot={handleDeployRobot}

    </div>
}


















































































































