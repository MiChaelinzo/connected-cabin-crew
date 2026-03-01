import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  ShieldCheck, 
  Robot, 
  Eye, 
  Warning,
  CheckCircle,
  XCircle,
  Lightning,
  MapPin,
  Play,
  Pause,
  ArrowsClockwise,
  FirstAid,
  Crosshair,
  Binoculars,
  Siren,
  VideoCamera,
  Scan,
  ChartLineUp
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SecurityEvent, SecurityRobot, ThreatAssessment, ThreatLevel } from '@/lib/types'
import SecurityRobotMonitor from '@/components/SecurityRobotMonitor'
import ThreatDashboard from '@/components/ThreatDashboard'
import SecurityEventsList from '@/components/SecurityEventsList'

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
          coordinates: { x: 10, y: 5, z: 1 },
          speed: 1.2,
          assignedZone: 'Economy'
        },
        {
          id: 'robot-2',
          name: 'Patrol Beta',
          type: 'patrol',
          status: 'patrolling',
          battery: 92,
          location: 'Business Zone',
          capabilities: ['Patrol', 'Surveillance', 'Alert Response', 'Navigation'],
          lastMaintenance: Date.now() - 86400000 * 5,
          coordinates: { x: 30, y: 8, z: 1 },
          speed: 1.5,
          assignedZone: 'Business'
        },
        {
          id: 'robot-3',
          name: 'Inspector Gamma',
          type: 'inspection',
          status: 'idle',
          battery: 65,
          location: 'Galley',
          capabilities: ['Item Scanning', 'Chemical Detection', 'X-Ray Analysis', 'Database Access'],
          lastMaintenance: Date.now() - 86400000 * 2,
          coordinates: { x: 20, y: 15, z: 1 },
          speed: 0.8
        },
        {
          id: 'robot-4',
          name: 'Medic Delta',
          type: 'medical',
          status: 'idle',
          battery: 78,
          location: 'Medical Bay',
          capabilities: ['Medical Scan', 'Vitals Monitoring', 'Emergency Response', 'First Aid'],
          lastMaintenance: Date.now() - 86400000,
          coordinates: { x: 15, y: 20, z: 1 },
          speed: 1.8
        },
        {
          id: 'robot-5',
          name: 'Sanitizer Epsilon',
          type: 'decontamination',
          status: 'charging',
          battery: 45,
          location: 'Charging Station',
          capabilities: ['UV Sterilization', 'Chemical Neutralization', 'Air Purification', 'Surface Cleaning'],
          lastMaintenance: Date.now() - 86400000 * 7,
          coordinates: { x: 5, y: 25, z: 1 },
          speed: 0.5
        }
      ]
      setRobots(initialRobots)
    }
  }, [robots, setRobots])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      const random = Math.random()
      
      if (random > 0.95) {
        const eventTypes = [
          { type: 'suspicious-behavior', level: 'medium', title: 'Unusual Passenger Behavior' },
          { type: 'unattended-item', level: 'high', title: 'Unattended Luggage Detected' },
          { type: 'unauthorized-device', level: 'low', title: 'Unauthorized Electronic Device' },
          { type: 'restricted-access', level: 'medium', title: 'Restricted Area Access Attempt' }
        ] as const
        
        const event = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        const zones = ['Economy Zone A', 'Economy Zone B', 'Business Zone', 'First Class', 'Galley', 'Lavatory 3']
        
        const newEvent: SecurityEvent = {
          id: `event-${Date.now()}`,
          type: event.type,
          threatLevel: event.level as ThreatLevel,
          title: event.title,
          description: `AI-detected potential security concern requiring investigation`,
          location: zones[Math.floor(Math.random() * zones.length)],
          timestamp: Date.now(),
          detectedBy: 'ai',
          status: 'active'
        }
        
        setSecurityEvents(current => [newEvent, ...(current || [])])
        
        setThreatAssessment(current => ({
          ...current!,
          activeThreats: (current?.activeThreats || 0) + 1,
          overallThreatLevel: event.level as ThreatLevel,
          lastUpdated: Date.now()
        }))
        
        toast.warning(event.title, {
          description: `Location: ${newEvent.location}`
        })
      }
      
      setRobots(currentRobots => 
        (currentRobots || []).map(robot => ({
          ...robot,
          battery: Math.max(0, robot.battery - (robot.status === 'patrolling' ? 0.1 : 0.05)),
          status: robot.battery < 20 ? 'charging' : 
                  robot.battery < 30 && robot.status === 'charging' ? 'charging' :
                  robot.status === 'charging' && robot.battery > 80 ? 'idle' :
                  robot.status,
          coordinates: robot.status === 'patrolling' ? {
            x: robot.coordinates!.x + (Math.random() - 0.5) * 2,
            y: robot.coordinates!.y + (Math.random() - 0.5) * 2,
            z: robot.coordinates!.z
          } : robot.coordinates
        }))
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [isMonitoring, setSecurityEvents, setThreatAssessment, setRobots])

  const deployRobot = async (robotId: string, location: string) => {
    const robot = (robots || []).find(r => r.id === robotId)
    if (!robot) return

    setRobots(current => 
      (current || []).map(r => 
        r.id === robotId 
          ? { ...r, status: 'responding', currentTask: `Responding to ${location}` }
          : r
      )
    )

    toast.success(`${robot.name} deployed to ${location}`)

    setTimeout(() => {
      setRobots(current => 
        (current || []).map(r => 
          r.id === robotId 
            ? { ...r, status: 'investigating', location }
            : r
        )
      )
    }, 3000)
  }

  const getThreatColor = (level: ThreatLevel) => {
    switch (level) {
      case 'none': return 'text-success'
      case 'low': return 'text-blue-500'
      case 'medium': return 'text-warning'
      case 'high': return 'text-destructive'
      case 'critical': return 'text-critical'
    }
  }

  const getThreatBadge = (level: ThreatLevel) => {
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
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <ShieldCheck className="w-7 h-7 text-primary" weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Security & Anti-Terrorism</h2>
            <p className="text-sm text-muted-foreground">AI-powered threat detection & robotic response systems</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isMonitoring ? "default" : "outline"}
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="gap-2"
          >
            {isMonitoring ? <Pause weight="fill" /> : <Play weight="fill" />}
            {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
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
            {(robots || []).filter(r => r.status === 'patrolling' || r.status === 'investigating' || r.status === 'responding').length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Out of {(robots || []).length} total</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <ChartLineUp className="w-4 h-4" weight="fill" />
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
            onUpdateEvent={(eventId: string, updates: Partial<SecurityEvent>) => {
              setSecurityEvents(current =>
                (current || []).map(e => e.id === eventId ? { ...e, ...updates } : e)
              )
            }}
            onDeployRobot={deployRobot}
            availableRobots={(robots || []).filter(r => r.status === 'idle' || r.status === 'patrolling')}
          />
        </TabsContent>

        <TabsContent value="robots" className="mt-6">
          <SecurityRobotMonitor 
            robots={robots || []}
            onUpdateRobot={(robotId: string, updates: Partial<SecurityRobot>) => {
              setRobots(current =>
                (current || []).map(r => r.id === robotId ? { ...r, ...updates} : r)
              )
            }}
            onDeployRobot={(robotId: string, location: string) => deployRobot(robotId, location)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
