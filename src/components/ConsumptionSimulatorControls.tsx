import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Pause, ArrowClockwise } from '@phosphor-icons/react'
import type { FlightInfo } from '@/lib/types'

interface ConsumptionSimulatorControlsProps {
  simulationEnabled: boolean
  onToggleSimulation: (enabled: boolean) => void
}

export default function ConsumptionSimulatorControls({
  simulationEnabled,
  onToggleSimulation
}: ConsumptionSimulatorControlsProps) {
  const [flightInfo, setFlightInfo] = useKV<FlightInfo>('flight-info', {
    flightNumber: 'AB1234',
    departure: 'SIN',
    arrival: 'LHR',
    departureTime: '14:30',
    arrivalTime: '20:45',
    currentPhase: 'cruise'
  })

  const handlePhaseChange = (phase: string) => {
    setFlightInfo((current) => {
      const info = current || {
        flightNumber: 'AB1234',
        departure: 'SIN',
        arrival: 'LHR',
        departureTime: '14:30',
        arrivalTime: '20:45',
        currentPhase: 'cruise'
      }
      return {
        ...info,
        currentPhase: phase as FlightInfo['currentPhase']
      }
    })
  }

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {simulationEnabled ? (
            <Play className="w-5 h-5 text-accent" weight="fill" />
          ) : (
            <Pause className="w-5 h-5 text-muted-foreground" weight="fill" />
          )}
          Flight Consumption Simulator
        </CardTitle>
        <CardDescription>
          Automatically simulate inventory consumption during flight phases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="simulation-toggle" className="text-sm font-medium">
              Enable Simulation
            </Label>
            <p className="text-xs text-muted-foreground">
              Items will be consumed every 15 seconds based on flight phase
            </p>
          </div>
          <Switch
            id="simulation-toggle"
            checked={simulationEnabled}
            onCheckedChange={onToggleSimulation}
          />
        </div>

        {simulationEnabled && (
          <>
            <div className="pt-2 space-y-2 border-t border-border">
              <Label htmlFor="flight-phase" className="text-sm font-medium">
                Current Flight Phase
              </Label>
              <Select
                value={flightInfo?.currentPhase || 'cruise'}
                onValueChange={handlePhaseChange}
              >
                <SelectTrigger id="flight-phase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boarding">Boarding</SelectItem>
                  <SelectItem value="taxi">Taxi</SelectItem>
                  <SelectItem value="climb">Climb</SelectItem>
                  <SelectItem value="cruise">Cruise</SelectItem>
                  <SelectItem value="descent">Descent</SelectItem>
                  <SelectItem value="landing">Landing</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Different phases have different consumption patterns
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Consumption Rates</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Boarding:</span>
                  <span className="ml-1 font-medium">Low</span>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Climb:</span>
                  <span className="ml-1 font-medium">High</span>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Cruise:</span>
                  <span className="ml-1 font-medium">Normal</span>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Descent:</span>
                  <span className="ml-1 font-medium">Medium</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-muted-foreground border-t border-border">
              <ArrowClockwise className="inline w-3 h-3 mr-1" />
              Low-stock alerts will trigger automatically when thresholds are reached
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
