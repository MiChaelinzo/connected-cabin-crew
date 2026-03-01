import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Airplane, Clock, Warning, CheckCircle, UsersFour } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { Passenger, CabinAlert, FlightInfo } from '@/lib/types'

export default function ConnectionGuardian() {
  const [passengers] = useKV<Passenger[]>('passengers', [])
  const [alerts, setAlerts] = useKV<CabinAlert[]>('cabin-alerts', [])
  const [flightInfo] = useKV<FlightInfo | null>('flight-info', null)
  
  const tightConnections = passengers?.filter(p => {
    if (!p.connectingFlight) return false
    const boardingTime = new Date(`2024-01-01 ${p.connectingFlight.boardingTime}`).getTime()
    const arrivalTime = flightInfo ? new Date(`2024-01-01 ${flightInfo.arrivalTime}`).getTime() : 0
    const connectionWindow = (boardingTime - arrivalTime) / (1000 * 60)
    return connectionWindow < 60 && connectionWindow > 0
  }) || []

  useEffect(() => {
    if (tightConnections.length === 0) return

    tightConnections.forEach(passenger => {
      const existingAlert = alerts?.find(
        a => a.relatedData?.passengerId === passenger.id && a.category === 'service'
      )

      if (!existingAlert && passenger.connectingFlight) {
        const newAlert: CabinAlert = {
          id: `conn-${passenger.id}-${Date.now()}`,
          category: 'service',
          priority: 'high',
          title: 'Tight Connection Alert',
          message: `${passenger.name} (${passenger.seatNumber}) has < 60min connection to ${passenger.connectingFlight.flightNumber}`,
          location: passenger.seatNumber,
          timestamp: Date.now(),
          acknowledged: false,
          resolved: false,
          actionRequired: 'Consider priority deplaning assistance',
          relatedData: {
            passengerId: passenger.id,
            connectingFlight: passenger.connectingFlight
          }
        }

        setAlerts(current => [...(current || []), newAlert])
      }
    })
  }, [tightConnections.length])

  const handleAssist = (passenger: Passenger) => {
    toast.success('Priority assistance activated', {
      description: `${passenger.name} marked for fast-track deplaning`
    })

    const alert = alerts?.find(
      a => a.relatedData?.passengerId === passenger.id && a.category === 'service'
    )
    
    if (alert) {
      setAlerts(current => 
        (current || []).map(a => 
          a.id === alert.id 
            ? { ...a, acknowledged: true, acknowledgedBy: 'Crew', acknowledgedAt: Date.now() }
            : a
        )
      )
    }
  }

  const getConnectionStatus = (passenger: Passenger) => {
    if (!passenger.connectingFlight || !flightInfo) return { minutes: 0, status: 'unknown' }
    
    const boardingTime = new Date(`2024-01-01 ${passenger.connectingFlight.boardingTime}`).getTime()
    const arrivalTime = new Date(`2024-01-01 ${flightInfo.arrivalTime}`).getTime()
    const minutes = Math.floor((boardingTime - arrivalTime) / (1000 * 60))
    
    let status = 'comfortable'
    if (minutes < 30) status = 'critical'
    else if (minutes < 45) status = 'tight'
    else if (minutes < 60) status = 'moderate'
    
    return { minutes, status }
  }

  if (tightConnections.length === 0) return null

  return (
    <Card className="border-warning/30 bg-warning/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Airplane className="w-5 h-5 text-warning" weight="fill" />
          Connection Guardian
          <Badge variant="outline" className="ml-auto bg-warning/10 text-warning border-warning/30">
            {tightConnections.length} Alert{tightConnections.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tightConnections.slice(0, 3).map(passenger => {
          const { minutes, status } = getConnectionStatus(passenger)
          const isAcknowledged = alerts?.some(
            a => a.relatedData?.passengerId === passenger.id && a.acknowledged
          )

          return (
            <div 
              key={passenger.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                status === 'critical' ? 'bg-critical/5 border-critical/20' : 'bg-warning/5 border-warning/20'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{passenger.name}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {passenger.seatNumber}
                  </Badge>
                  {isAcknowledged && (
                    <CheckCircle className="w-4 h-4 text-success" weight="fill" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Airplane className="w-3.5 h-3.5" />
                    <span>Connect to {passenger.connectingFlight?.flightNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className={status === 'critical' ? 'text-critical font-medium' : 'text-warning font-medium'}>
                      {minutes}min connection window
                    </span>
                  </div>
                  <div className="text-xs mt-1">
                    Gate {passenger.connectingFlight?.gate} • Boards {passenger.connectingFlight?.boardingTime}
                  </div>
                </div>
              </div>
              {!isAcknowledged && (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => handleAssist(passenger)}
                >
                  Assist
                </Button>
              )}
            </div>
          )
        })}

        {tightConnections.length > 3 && (
          <div className="text-xs text-center text-muted-foreground pt-2 border-t">
            +{tightConnections.length - 3} more passengers with tight connections
          </div>
        )}
      </CardContent>
    </Card>
  )
}
