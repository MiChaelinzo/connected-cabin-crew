import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import SecurityRobotMonitor from '@/components/SecurityRobotMonitor'
import { Button } from '@/components/ui/button'
import ThreatDashboard from '@/components/ThreatDashboard'
import SecurityRobotMonitor from '@/components/SecurityRobotMonitor'
import SecurityEventsList from '@/components/SecurityEventsList'
    activeThreats: 0,

    lastUpdated: Date.now(),
  })

    if (!robots || robots.length === 0) {
        {
          name: 'Sentinel Alph
          status: 'pa
          location: 'Fir
          capabilit
          coordinates
        {
          name: 'Sentin
    
          location: 'Business Class',

          coordinat
        {
          name: 'Defender Gamma',
         
          location: 'Galley Ar
          capabilities: ['Perimet
          coordinates: { 
      ]
    }
    if (!securityEvents || securityEvent
        {
          type: 'alert',
          title: 'Unattended Baggage',
          location: 'Row 23B',
          
        }
      setSecurityEvents(initia
  }, [robots, securityEvents, se
  useEffect(() => {

      setThreatAssessm
          overallThreatLevel: 'low',
          containedThreats: 0,
          aiConfidence: 95,
          recommendations: []
        
        co
        c
        let overallLevel: Thre
        else if (active > 0) over

          overallThreatLevel:
          containedThr
          aiConfidence: Math.min(9
          lastUpdated: Date.now()
      })

  }, [isMonitoring, setThreatAssessment])
  const h
      (
      )
  }

      (current || []).map(robot =>
      )
  }
  const handleDeployRobot = (r
      (current || []).ma
          ? { ...robot, st
      )
  }
  const availableRobots = (rob
  return (
      <div className="flex items-c
          <h2 className="text-2xl font-s
        <
       
          className="gap-2"
     
        </Button>

        <TabsList>
          <TabsTrigger value=

        <TabsContent value="overview" cl
            assessment={threatAssessment
              activeThreats: 0,
              falseAlarms: 0,
              lastUpdated: 
            }}
        </TabsContent>
        <TabsContent value=
            events={securityEvents
            availableRobots={
        <
        
            robots={robots || []}
            onDeployRobot={handleDeployRobot}
        </TabsContent>
    </div>























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
