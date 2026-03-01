import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badg
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
  Lightni
  Play,
  ArrowsC
  Cross
  Siren,
  Scan,
} from '@p
import { cn 
import Se
  Battery,
export 
  Pause,
    containedThrea
    aiConfi
    recommen

  const 
  VideoCamera,
  useEf
  Activity
          id: 'robot-1',
          type: 'security',
          battery: 87,
          capabilities: ['Threat Detection', 'Facial Recognition', 'Weapon Scanning', 'Communi
          coordinates: { x: 10, y: 5, z: 1 },
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
    if (robots.length === 0) {
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
          { type: 'su
          { type: 'unauthorized-d
        ] 
        c
        
          id: `event-${Date.no
          threatLevel: ev
          description: `AI-dete
          timestamp: D
          status: 'active'
        
        
          ...current!,
          overallThre
        }))
        to
        }
      
        (currentRobots || []).map(
          battery: Math.max(0
                  robot.b
                  robo
            x: robot.coordina
            z: robot.coordinates!.z
        }))
    }, 10000)
    return () => cle

    const

      (current || []).map(r =>
          ? { ...r, status
      )


      setRobots(current => 
          r.id === robotId 
            : r
      )
  }
  const g
      case 'none': retur
      case 'medium': return 'text-wa
      case 'critical': return 'tex
  }
  const getThreatBadge
      case 'none': return 'default'
      case 'medium': return 'outline'
      case 'critical': return 'destructive'
  }
  return (
      <di
       
          </div>
     
          </div>

          <Button
            onClick={() => se

            {isMonitoring ? 'Monitoring 
        </div>
      
        <Card className="p
            <span className=
          </div>
            {(threatAssessment?.overallThreatLevel || 'none').toUpperCase()}
          <p className="text-xs text-muted-foreground mt-1">
          </p>

        
            <Warning className="w-5 h-5 text-warning" weight="fill" />
          <div className="text-3xl font-bold text-warning">
        
        </Card>
        <Card className="p-4 bg-grad
            <span className
          </div>
          title: event.title,
          <p className="text-xs text-muted-foreground mt-1">Successfully resolved</p>

          <div className="flex i
          detectedBy: 'ai',
          <div className="
        }
        

        
        setThreatAssessment(current => ({
          </TabsTrigge
            <Siren className="w-4 h-4" weight="fill" />
          </TabsTrigger>
          lastUpdated: Date.now()
          <

          <ThreatDashboard 
            events={securityEvents || []}
          
      }
      
      setRobots(currentRobots => 
              setSecurityEvents(current =>
          ...robot,
            onDeployRobot={deployRobot}
          />

          <SecurityRobotMonitor 
            onUpdateRobot={(rob
                (current || []).map(r => r.id === robotI
            }}
            y: robot.coordinates!.y + (Math.random() - 0.5) * 2,
      </Tabs>
          } : robot.coordinates

      )







    if (!robot) return

    setRobots(current => 

        r.id === robotId 

          : r

    )



    setTimeout(() => {

        (current || []).map(r => 



        )





    switch (level) {





    }



    switch (level) {

      case 'low': return 'secondary'

      case 'high': return 'destructive'

    }























          </Button>





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
            {robots.filter(r => r.status === 'patrolling' || r.status === 'investigating' || r.status === 'responding').length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Out of {robots.length} total</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="w-4 h-4" weight="fill" />
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
            events={securityEvents}
            robots={robots}
            onDeployRobot={deployRobot}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <SecurityEventsList 
            events={securityEvents}
            onUpdateEvent={(eventId, updates) => {
              setSecurityEvents(current =>
                (current || []).map(e => e.id === eventId ? { ...e, ...updates } : e)
              )
            }}
            onDeployRobot={deployRobot}
            availableRobots={robots.filter(r => r.status === 'idle' || r.status === 'patrolling')}
          />
        </TabsContent>

        <TabsContent value="robots" className="mt-6">
          <SecurityRobotMonitor 
            robots={robots}
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
