import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { WarningCircle, CheckCircle, Seat, FirstAid, Clock } from '@phosphor-icons/react'
import AlertTestPanel from '@/components/AlertTestPanel'
import SensorMonitor from '@/components/SensorMonitor'
import QuickActions from '@/components/QuickActions'
import ConnectionGuardian from '@/components/ConnectionGuardian'
import ServicePhaseTracker from '@/components/ServicePhaseTracker'
import TurnaroundChecklist from '@/components/TurnaroundChecklist'
import type { CabinZone } from '@/lib/types'

export default function DashboardView() {
  const [cabinZones] = useKV<CabinZone[]>('cabin-zones', [])

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-success/10 text-success border-success/20'
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'critical':
        return 'bg-critical/10 text-critical border-critical/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getZoneStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-5 h-5" weight="fill" />
      case 'warning':
      case 'critical':
        return <WarningCircle className="w-5 h-5" weight="fill" />
      default:
        return null
    }
  }

  const totalOccupancy = cabinZones?.reduce((sum, zone) => sum + zone.occupancy, 0) || 0
  const totalCapacity = cabinZones?.reduce((sum, zone) => sum + zone.capacity, 0) || 0
  const occupancyRate = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0

  const criticalIssues = cabinZones?.filter(z => z.status === 'critical').length || 0
  const warningIssues = cabinZones?.filter(z => z.status === 'warning').length || 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Cabin Status</h2>
        <p className="text-sm text-muted-foreground">Real-time overview of cabin operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cabin Occupancy</CardTitle>
            <Seat className="w-5 h-5 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{Math.round(occupancyRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalOccupancy} of {totalCapacity} seats
            </p>
            <Progress value={occupancyRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <WarningCircle className="w-5 h-5 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{criticalIssues + warningIssues}</div>
            <div className="flex gap-3 mt-2">
              <span className="text-xs text-critical">{criticalIssues} critical</span>
              <span className="text-xs text-warning">{warningIssues} warnings</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Service Status</CardTitle>
            <Clock className="w-5 h-5 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">On Time</div>
            <p className="text-xs text-muted-foreground">
              All service phases nominal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <ConnectionGuardian />
      </div>

      <ServicePhaseTracker />

      <TurnaroundChecklist />

      <div>
        <h3 className="mb-4 text-lg font-semibold">Cabin Zones</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cabinZones && cabinZones.length > 0 ? (
            cabinZones.map((zone) => (
              <Card key={zone.id} className="relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${zone.status === 'critical' ? 'bg-critical' : zone.status === 'warning' ? 'bg-warning' : 'bg-success'}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{zone.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{zone.seatRange}</p>
                    </div>
                    <Badge className={`${getZoneStatusColor(zone.status)} flex items-center gap-1.5`}>
                      {getZoneStatusIcon(zone.status)}
                      <span className="capitalize">{zone.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-medium">
                      {zone.occupancy}/{zone.capacity}
                    </span>
                  </div>
                  <Progress 
                    value={(zone.occupancy / zone.capacity) * 100} 
                    className="h-1.5"
                  />
                  {zone.issues > 0 && (
                    <div className="flex items-center gap-2 pt-2 text-sm border-t">
                      <WarningCircle className="w-4 h-4 text-warning" weight="fill" />
                      <span className="text-muted-foreground">{zone.issues} issue{zone.issues > 1 ? 's' : ''} reported</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Seat className="w-12 h-12 mx-auto mb-3 text-muted-foreground" weight="light" />
                  <p className="text-sm text-muted-foreground">No cabin zones available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <SensorMonitor />

      <AlertTestPanel />
    </div>
  )
}
