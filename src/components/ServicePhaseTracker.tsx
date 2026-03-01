import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  ForkKnife, 
  Coffee, 
  Clock, 
  CheckCircle,
  PlayCircle,
  PauseCircle,
  TrendUp
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ServicePhase {
  id: string
  name: string
  iconName: 'ForkKnife' | 'Coffee'
  status: 'pending' | 'in-progress' | 'completed'
  startTime?: number
  endTime?: number
  estimatedDuration: number
  zones: {
    [key: string]: 'pending' | 'in-progress' | 'completed'
  }
}

export default function ServicePhaseTracker() {
  const [servicePhases, setServicePhases] = useKV<ServicePhase[]>('service-phases', [
    {
      id: 'meal-service',
      name: 'Meal Service',
      iconName: 'ForkKnife',
      status: 'pending',
      estimatedDuration: 45,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'beverage-service',
      name: 'Beverage Service',
      iconName: 'Coffee',
      status: 'pending',
      estimatedDuration: 30,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    }
  ])

  const startPhase = (phaseId: string) => {
    setServicePhases(current => 
      (current || []).map(phase => 
        phase.id === phaseId 
          ? { ...phase, status: 'in-progress', startTime: Date.now() }
          : phase
      )
    )
    toast.success('Service phase started', {
      description: 'Tracking progress across all cabin zones'
    })
  }

  const completePhase = (phaseId: string) => {
    setServicePhases(current => 
      (current || []).map(phase => {
        if (phase.id === phaseId) {
          const duration = phase.startTime 
            ? Math.round((Date.now() - phase.startTime) / (1000 * 60))
            : 0
          
          return { 
            ...phase, 
            status: 'completed', 
            endTime: Date.now(),
            zones: Object.fromEntries(
              Object.keys(phase.zones).map(zone => [zone, 'completed'])
            )
          }
        }
        return phase
      })
    )
    toast.success('Service phase completed', {
      description: 'All zones have been served'
    })
  }

  const updateZoneStatus = (phaseId: string, zoneName: string, status: 'in-progress' | 'completed') => {
    setServicePhases(current => 
      (current || []).map(phase => 
        phase.id === phaseId 
          ? { 
              ...phase, 
              zones: { ...phase.zones, [zoneName]: status }
            }
          : phase
      )
    )
  }

  const getPhaseProgress = (phase: ServicePhase) => {
    const zonesList = Object.values(phase.zones)
    const completed = zonesList.filter(z => z === 'completed').length
    return (completed / zonesList.length) * 100
  }

  const getPhaseTime = (phase: ServicePhase) => {
    if (phase.status === 'completed' && phase.startTime && phase.endTime) {
      return Math.round((phase.endTime - phase.startTime) / (1000 * 60))
    }
    if (phase.status === 'in-progress' && phase.startTime) {
      return Math.round((Date.now() - phase.startTime) / (1000 * 60))
    }
    return 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20'
      case 'in-progress':
        return 'bg-accent/10 text-accent border-accent/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" weight="fill" />
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" weight="fill" />
      default:
        return <PauseCircle className="w-4 h-4" weight="fill" />
    }
  }

  const getPhaseIcon = (iconName: string) => {
    switch (iconName) {
      case 'ForkKnife':
        return ForkKnife
      case 'Coffee':
        return Coffee
      default:
        return ForkKnife
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendUp className="w-5 h-5 text-accent" weight="fill" />
          Service Progress
          <Badge variant="outline" className="ml-auto font-mono text-xs">
            Real-Time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {servicePhases && servicePhases.length > 0 ? (
          servicePhases.map(phase => {
            const Icon = getPhaseIcon(phase.iconName)
            const progress = getPhaseProgress(phase)
            const time = getPhaseTime(phase)
            const isOvertime = phase.status === 'in-progress' && time > phase.estimatedDuration

            return (
              <div 
                key={phase.id}
                className="flex flex-col gap-3 p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground" weight="fill" />
                    <div>
                      <div className="font-semibold text-sm">{phase.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getStatusColor(phase.status)} text-xs flex items-center gap-1`}>
                          {getStatusIcon(phase.status)}
                          <span className="capitalize">{phase.status.replace('-', ' ')}</span>
                        </Badge>
                        {phase.status === 'in-progress' && (
                          <span className={`text-xs font-mono ${isOvertime ? 'text-warning font-semibold' : 'text-muted-foreground'}`}>
                            {time}/{phase.estimatedDuration} min
                          </span>
                        )}
                        {phase.status === 'completed' && (
                          <span className="text-xs font-mono text-success">
                            ✓ {time} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {phase.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startPhase(phase.id)}
                    >
                      Start
                    </Button>
                  )}
                  {phase.status === 'in-progress' && (
                    <Button
                      size="sm"
                      onClick={() => completePhase(phase.id)}
                    >
                      Complete
                    </Button>
                  )}
                </div>

                {phase.status !== 'pending' && (
                  <>
                    <Progress value={progress} className="h-2" />
                    <div className="flex gap-2">
                      {Object.entries(phase.zones).map(([zoneName, zoneStatus]) => (
                        <button
                          key={zoneName}
                          onClick={() => {
                            if (phase.status === 'in-progress' && zoneStatus !== 'completed') {
                              updateZoneStatus(
                                phase.id,
                                zoneName,
                                zoneStatus === 'pending' ? 'in-progress' : 'completed'
                              )
                            }
                          }}
                          disabled={phase.status === 'completed' || zoneStatus === 'completed'}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                            zoneStatus === 'completed'
                              ? 'bg-success/10 text-success'
                              : zoneStatus === 'in-progress'
                              ? 'bg-accent/10 text-accent hover:bg-accent/20'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          } ${phase.status === 'completed' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {zoneName}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No active service phases
          </div>
        )}
      </CardContent>
    </Card>
  )
}
