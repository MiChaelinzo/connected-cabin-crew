import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Robot, 
  BatteryHigh,
  BatteryMedium,
  BatteryLow,
  BatteryCharging,
  MapPin,
  Play,
  Pause,
  ArrowsClockwise,
  Wrench,
  Eye,
  FirstAid,
  Shield,
  Crosshair,
  Drop
} from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SecurityRobot, RobotStatus } from '@/lib/types'

interface SecurityRobotMonitorProps {
  robots: SecurityRobot[]
  onUpdateRobot: (robotId: string, updates: Partial<SecurityRobot>) => void
  onDeployRobot: (robotId: string, location: string) => void
}

export default function SecurityRobotMonitor({ robots, onUpdateRobot, onDeployRobot }: SecurityRobotMonitorProps) {
  const [selectedRobot, setSelectedRobot] = useState<SecurityRobot | null>(null)
  const [deployLocation, setDeployLocation] = useState('')

  const getRobotIcon = (type: SecurityRobot['type']) => {
    switch (type) {
      case 'security': return <Shield className="w-5 h-5" weight="fill" />
      case 'patrol': return <Eye className="w-5 h-5" weight="fill" />
      case 'inspection': return <Crosshair className="w-5 h-5" weight="fill" />
      case 'medical': return <FirstAid className="w-5 h-5" weight="fill" />
      case 'decontamination': return <Drop className="w-5 h-5" weight="fill" />
    }
  }

  const getBatteryIcon = (battery: number, status: RobotStatus) => {
    if (status === 'charging') return <BatteryCharging className="w-5 h-5 text-accent animate-pulse" weight="fill" />
    if (battery > 60) return <BatteryHigh className="w-5 h-5 text-success" weight="fill" />
    if (battery > 30) return <BatteryMedium className="w-5 h-5 text-warning" weight="fill" />
    return <BatteryLow className="w-5 h-5 text-critical" weight="fill" />
  }

  const getStatusColor = (status: RobotStatus) => {
    switch (status) {
      case 'idle': return 'bg-muted text-muted-foreground'
      case 'patrolling': return 'bg-blue-500/10 text-blue-600 border-blue-600/20'
      case 'investigating': return 'bg-warning/10 text-warning border-warning/20'
      case 'responding': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'charging': return 'bg-accent/10 text-accent border-accent/20'
      case 'offline': return 'bg-muted text-muted-foreground'
    }
  }

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'bg-success'
    if (battery > 30) return 'bg-warning'
    return 'bg-critical'
  }

  const handleDeploy = (robot: SecurityRobot) => {
    if (!deployLocation.trim()) {
      toast.error('Please enter a deployment location')
      return
    }
    onDeployRobot(robot.id, deployLocation)
    setDeployLocation('')
  }

  const handleStatusChange = (robot: SecurityRobot, newStatus: RobotStatus) => {
    onUpdateRobot(robot.id, { status: newStatus })
    toast.success(`${robot.name} status changed to ${newStatus}`)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {robots.map((robot) => (
          <Card key={robot.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  robot.status === 'offline' ? 'bg-muted' : 'bg-primary/10'
                )}>
                  <Robot className={cn(
                    "w-6 h-6",
                    robot.status === 'offline' ? 'text-muted-foreground' : 'text-primary'
                  )} weight="fill" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{robot.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{robot.type} Unit</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedRobot(robot)}
                    className="h-8 px-2"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {getRobotIcon(robot.type)}
                      {robot.name}
                    </DialogTitle>
                    <DialogDescription>
                      {robot.type.charAt(0).toUpperCase() + robot.type.slice(1)} Robot - Unit ID: {robot.id}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Status</Label>
                        <Badge className={cn("mt-1", getStatusColor(robot.status))}>
                          {robot.status}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Battery</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {getBatteryIcon(robot.battery, robot.status)}
                          <span className="text-sm font-semibold">{robot.battery}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Location</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-primary" weight="fill" />
                        <span className="text-sm">{robot.location}</span>
                      </div>
                    </div>

                    {robot.currentTask && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Current Task</Label>
                        <p className="text-sm mt-1">{robot.currentTask}</p>
                      </div>
                    )}

                    <div>
                      <Label className="text-xs text-muted-foreground">Capabilities</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {robot.capabilities.map((cap) => (
                          <Badge key={cap} variant="outline" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Last Maintenance</Label>
                      <p className="text-sm mt-1">
                        {Math.floor((Date.now() - robot.lastMaintenance) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </div>

                    {robot.coordinates && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Coordinates</Label>
                        <p className="text-sm font-mono mt-1">
                          X: {robot.coordinates.x.toFixed(1)}, Y: {robot.coordinates.y.toFixed(1)}, Z: {robot.coordinates.z.toFixed(1)}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t">
                      <Label>Deploy to Location</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter location..."
                          value={deployLocation}
                          onChange={(e) => setDeployLocation(e.target.value)}
                        />
                        <Button onClick={() => handleDeploy(robot)} disabled={robot.status === 'offline'}>
                          Deploy
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {robot.status === 'idle' && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleStatusChange(robot, 'patrolling')}
                        >
                          <Play className="w-4 h-4 mr-2" weight="fill" />
                          Start Patrol
                        </Button>
                      )}
                      {robot.status === 'patrolling' && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleStatusChange(robot, 'idle')}
                        >
                          <Pause className="w-4 h-4 mr-2" weight="fill" />
                          Return to Base
                        </Button>
                      )}
                      {robot.battery < 30 && robot.status !== 'charging' && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleStatusChange(robot, 'charging')}
                        >
                          <BatteryCharging className="w-4 h-4 mr-2" weight="fill" />
                          Charge Now
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className={cn("text-xs", getStatusColor(robot.status))}>
                  {robot.status}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Battery</span>
                  <div className="flex items-center gap-1">
                    {getBatteryIcon(robot.battery, robot.status)}
                    <span className="text-xs font-semibold">{robot.battery}%</span>
                  </div>
                </div>
                <Progress value={robot.battery} className={cn("h-2", getBatteryColor(robot.battery))} />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" weight="fill" />
                <span className="text-muted-foreground truncate">{robot.location}</span>
              </div>

              {robot.currentTask && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  {robot.currentTask}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={robot.status === 'offline'}
                  onClick={() => {
                    if (robot.status === 'idle') {
                      handleStatusChange(robot, 'patrolling')
                    } else {
                      handleStatusChange(robot, 'idle')
                    }
                  }}
                >
                  {robot.status === 'idle' ? (
                    <><Play className="w-3 h-3 mr-1" weight="fill" /> Patrol</>
                  ) : (
                    <><Pause className="w-3 h-3 mr-1" weight="fill" /> Stop</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={robot.status === 'offline'}
                >
                  <Wrench className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
