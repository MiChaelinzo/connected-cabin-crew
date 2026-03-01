import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ForkKnife, 
  Coffee, 
  Clock, 
  CheckCircle,
  PlayCircle,
  PauseCircle,
  TrendUp,
  ShoppingCart,
  Newspaper,
  Broom,
  Bed,
  FirstAid,
  ShoppingBag,
  Tray,
  Plus,
  Pencil,
  Trash,
  Sparkle,
  AirplaneTilt,
  Headset,
  Gift,
  Books,
  MegaphoneSimple,
  Storefront
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

type IconName = 'ForkKnife' | 'Coffee' | 'ShoppingCart' | 'Newspaper' | 'Broom' | 'Bed' | 'FirstAid' | 'ShoppingBag' | 'Tray' | 'Sparkle' | 'AirplaneTilt' | 'Headset' | 'Gift' | 'Books' | 'MegaphoneSimple' | 'Storefront'

interface ServicePhase {
  id: string
  name: string
  iconName: IconName
  status: 'pending' | 'in-progress' | 'completed'
  startTime?: number
  endTime?: number
  estimatedDuration: number
  isCustom?: boolean
  zones: {
    [key: string]: 'pending' | 'in-progress' | 'completed'
  }
}

const iconOptions: { value: IconName; label: string; icon: typeof ForkKnife }[] = [
  { value: 'ForkKnife', label: 'Fork & Knife', icon: ForkKnife },
  { value: 'Coffee', label: 'Coffee', icon: Coffee },
  { value: 'Tray', label: 'Tray', icon: Tray },
  { value: 'ShoppingCart', label: 'Shopping Cart', icon: ShoppingCart },
  { value: 'ShoppingBag', label: 'Shopping Bag', icon: ShoppingBag },
  { value: 'Storefront', label: 'Storefront', icon: Storefront },
  { value: 'Gift', label: 'Gift', icon: Gift },
  { value: 'Newspaper', label: 'Newspaper', icon: Newspaper },
  { value: 'Books', label: 'Books', icon: Books },
  { value: 'Broom', label: 'Broom', icon: Broom },
  { value: 'Bed', label: 'Bed', icon: Bed },
  { value: 'FirstAid', label: 'First Aid', icon: FirstAid },
  { value: 'Sparkle', label: 'Sparkle', icon: Sparkle },
  { value: 'AirplaneTilt', label: 'Airplane', icon: AirplaneTilt },
  { value: 'Headset', label: 'Headset', icon: Headset },
  { value: 'MegaphoneSimple', label: 'Announcement', icon: MegaphoneSimple }
]

export default function ServicePhaseTracker() {
  const [servicePhases, setServicePhases] = useKV<ServicePhase[]>('service-phases', [
    {
      id: 'pre-departure',
      name: 'Pre-Departure Check',
      iconName: 'Tray',
      status: 'pending',
      estimatedDuration: 15,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'welcome-service',
      name: 'Welcome Service',
      iconName: 'Coffee',
      status: 'pending',
      estimatedDuration: 20,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'meal-service',
      name: 'Main Meal Service',
      iconName: 'ForkKnife',
      status: 'pending',
      estimatedDuration: 45,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'beverage-service',
      name: 'Beverage Round',
      iconName: 'Coffee',
      status: 'pending',
      estimatedDuration: 25,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'duty-free-service',
      name: 'Duty-Free Sales',
      iconName: 'ShoppingCart',
      status: 'pending',
      estimatedDuration: 35,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'reading-materials',
      name: 'Reading Materials',
      iconName: 'Newspaper',
      status: 'pending',
      estimatedDuration: 15,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'cabin-rest',
      name: 'Cabin Rest Period',
      iconName: 'Bed',
      status: 'pending',
      estimatedDuration: 120,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'pre-landing-service',
      name: 'Pre-Landing Service',
      iconName: 'Coffee',
      status: 'pending',
      estimatedDuration: 20,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    },
    {
      id: 'cabin-cleanup',
      name: 'Cabin Preparation',
      iconName: 'Broom',
      status: 'pending',
      estimatedDuration: 30,
      zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
    }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPhase, setEditingPhase] = useState<ServicePhase | null>(null)
  const [phaseName, setPhaseName] = useState('')
  const [phaseDuration, setPhaseDuration] = useState('30')
  const [phaseIcon, setPhaseIcon] = useState<IconName>('Sparkle')

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

  const openAddDialog = () => {
    setEditingPhase(null)
    setPhaseName('')
    setPhaseDuration('30')
    setPhaseIcon('Sparkle')
    setIsDialogOpen(true)
  }

  const openEditDialog = (phase: ServicePhase) => {
    setEditingPhase(phase)
    setPhaseName(phase.name)
    setPhaseDuration(phase.estimatedDuration.toString())
    setPhaseIcon(phase.iconName)
    setIsDialogOpen(true)
  }

  const handleSavePhase = () => {
    if (!phaseName.trim()) {
      toast.error('Please enter a phase name')
      return
    }

    const duration = parseInt(phaseDuration)
    if (isNaN(duration) || duration <= 0) {
      toast.error('Please enter a valid duration')
      return
    }

    if (editingPhase) {
      setServicePhases(current =>
        (current || []).map(phase =>
          phase.id === editingPhase.id
            ? {
                ...phase,
                name: phaseName.trim(),
                estimatedDuration: duration,
                iconName: phaseIcon
              }
            : phase
        )
      )
      toast.success('Service phase updated')
    } else {
      const newPhase: ServicePhase = {
        id: `custom-${Date.now()}`,
        name: phaseName.trim(),
        iconName: phaseIcon,
        status: 'pending',
        estimatedDuration: duration,
        isCustom: true,
        zones: { 'Zone A': 'pending', 'Zone B': 'pending', 'Zone C': 'pending' }
      }
      
      setServicePhases(current => [...(current || []), newPhase])
      toast.success('Custom service phase added')
    }

    setIsDialogOpen(false)
  }

  const handleDeletePhase = (phaseId: string) => {
    setServicePhases(current =>
      (current || []).filter(phase => phase.id !== phaseId)
    )
    toast.success('Service phase deleted')
  }

  const getPhaseIcon = (iconName: string) => {
    switch (iconName) {
      case 'ForkKnife':
        return ForkKnife
      case 'Coffee':
        return Coffee
      case 'ShoppingCart':
        return ShoppingCart
      case 'Newspaper':
        return Newspaper
      case 'Broom':
        return Broom
      case 'Bed':
        return Bed
      case 'FirstAid':
        return FirstAid
      case 'ShoppingBag':
        return ShoppingBag
      case 'Tray':
        return Tray
      case 'Sparkle':
        return Sparkle
      case 'AirplaneTilt':
        return AirplaneTilt
      case 'Headset':
        return Headset
      case 'Gift':
        return Gift
      case 'Books':
        return Books
      case 'MegaphoneSimple':
        return MegaphoneSimple
      case 'Storefront':
        return Storefront
      default:
        return ForkKnife
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendUp className="w-5 h-5 text-accent" weight="fill" />
            Service Progress
            <Badge variant="outline" className="ml-2 font-mono text-xs">
              {servicePhases?.filter(p => p.status === 'completed').length || 0}/{servicePhases?.length || 0} Complete
            </Badge>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openAddDialog} className="gap-2">
                <Plus className="w-4 h-4" weight="bold" />
                Add Phase
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingPhase ? 'Edit Service Phase' : 'Create Custom Service Phase'}</DialogTitle>
                <DialogDescription>
                  {editingPhase ? 'Update the service phase details below.' : 'Add a new custom service phase with a name, icon, and estimated duration.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="phase-name">Phase Name</Label>
                  <Input
                    id="phase-name"
                    placeholder="e.g., Safety Demonstration"
                    value={phaseName}
                    onChange={(e) => setPhaseName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phase-duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="phase-duration"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={phaseDuration}
                    onChange={(e) => setPhaseDuration(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phase-icon">Icon</Label>
                  <Select value={phaseIcon} onValueChange={(value) => setPhaseIcon(value as IconName)}>
                    <SelectTrigger id="phase-icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(option => {
                        const IconComponent = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" weight="fill" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePhase}>
                  {editingPhase ? 'Save Changes' : 'Create Phase'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {servicePhases && servicePhases.length > 0 ? (
          servicePhases.map(phase => {
            const Icon = getPhaseIcon(phase.iconName)
            const progress = getPhaseProgress(phase)
            const time = getPhaseTime(phase)
            const isOvertime = phase.status === 'in-progress' && time > phase.estimatedDuration

            return (
              <div 
                key={phase.id}
                className="flex flex-col gap-3 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="w-5 h-5 text-muted-foreground" weight="fill" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm">{phase.name}</div>
                        {phase.isCustom && (
                          <Badge variant="outline" className="text-xs">Custom</Badge>
                        )}
                      </div>
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

                  <div className="flex items-center gap-2">
                    {phase.status === 'pending' && (
                      <>
                        {phase.isCustom && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(phase)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePhase(phase.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startPhase(phase.id)}
                        >
                          Start
                        </Button>
                      </>
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
