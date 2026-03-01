import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  FirstAid, 
  Warning, 
  Megaphone, 
  Package, 
  Users, 
  Bell,
  CheckCircle,
  ClipboardText,
  Lightning
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { Incident } from '@/lib/types'

export default function QuickActions() {
  const [showMedicalDialog, setShowMedicalDialog] = useState(false)
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [incidents, setIncidents] = useKV<Incident[]>('incidents', [])

  const handleQuickMedical = () => {
    setShowMedicalDialog(true)
  }

  const logMedicalIncident = (type: string) => {
    const newIncident: Incident = {
      id: Date.now().toString(),
      type: 'medical',
      severity: 'high',
      title: `Medical: ${type}`,
      description: `Quick-logged ${type} incident`,
      location: 'Cabin',
      reportedBy: 'Crew',
      timestamp: Date.now(),
      status: 'open'
    }
    
    setIncidents((current) => [...(current || []), newIncident])
    setShowMedicalDialog(false)
    toast.success('Medical incident logged', {
      description: 'Emergency response team notified'
    })
  }

  const handleQuickAnnouncement = (type: string) => {
    toast.success('Announcement sent', {
      description: `${type} announcement broadcast to cabin`
    })
    setShowAnnouncementDialog(false)
  }

  const quickActions = [
    {
      icon: FirstAid,
      label: 'Medical Alert',
      color: 'text-critical',
      bgColor: 'bg-critical/10 hover:bg-critical/20',
      onClick: handleQuickMedical
    },
    {
      icon: Warning,
      label: 'Safety Issue',
      color: 'text-warning',
      bgColor: 'bg-warning/10 hover:bg-warning/20',
      onClick: () => {
        toast.info('Safety reporting opened', {
          description: 'Navigate to Reports tab to file incident'
        })
      }
    },
    {
      icon: Megaphone,
      label: 'PA System',
      color: 'text-accent',
      bgColor: 'bg-accent/10 hover:bg-accent/20',
      onClick: () => setShowAnnouncementDialog(true)
    },
    {
      icon: Package,
      label: 'Request Supplies',
      color: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20',
      onClick: () => {
        toast.success('Supply request sent', {
          description: 'Galley team will respond shortly'
        })
      }
    }
  ]

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lightning className="w-5 h-5 text-accent" weight="fill" />
            Quick Actions
          </CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            One-Tap
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className={`h-auto flex flex-col items-center gap-2 py-4 ${action.bgColor} border-0 transition-all`}
                onClick={action.onClick}
              >
                <action.icon className={`w-6 h-6 ${action.color}`} weight="fill" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showMedicalDialog} onOpenChange={setShowMedicalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FirstAid className="w-5 h-5 text-critical" weight="fill" />
              Medical Emergency
            </DialogTitle>
            <DialogDescription>
              Select the type of medical assistance required
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Button
              variant="outline"
              className="h-auto flex items-start gap-3 p-4 text-left"
              onClick={() => logMedicalIncident('First Aid Required')}
            >
              <div className="flex-1">
                <div className="font-semibold">First Aid</div>
                <div className="text-xs text-muted-foreground">Minor injury or discomfort</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex items-start gap-3 p-4 text-left"
              onClick={() => logMedicalIncident('Medical Professional Needed')}
            >
              <div className="flex-1">
                <div className="font-semibold">Medical Professional</div>
                <div className="text-xs text-muted-foreground">Request doctor on board</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex items-start gap-3 p-4 text-left border-critical/30 bg-critical/5"
              onClick={() => logMedicalIncident('Critical Emergency')}
            >
              <div className="flex-1">
                <div className="font-semibold text-critical">Critical Emergency</div>
                <div className="text-xs text-muted-foreground">Life-threatening situation</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-accent" weight="fill" />
              PA Announcement
            </DialogTitle>
            <DialogDescription>
              Select pre-recorded announcement to broadcast
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-start h-auto p-3"
              onClick={() => handleQuickAnnouncement('Seatbelt')}
            >
              <span className="text-sm">Fasten Seatbelts</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3"
              onClick={() => handleQuickAnnouncement('Landing Preparation')}
            >
              <span className="text-sm">Prepare for Landing</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3"
              onClick={() => handleQuickAnnouncement('Service Beginning')}
            >
              <span className="text-sm">Service Beginning</span>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-3"
              onClick={() => handleQuickAnnouncement('Turbulence')}
            >
              <span className="text-sm">Turbulence Warning</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
