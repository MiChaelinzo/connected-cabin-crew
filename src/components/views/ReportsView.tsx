import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Warning, FirstAid, User, Wrench, Plus, CheckCircle, Clock } from '@phosphor-icons/react'
import type { Incident, IncidentType, IncidentSeverity } from '@/lib/types'

export default function ReportsView() {
  const [incidents, setIncidents] = useKV<Incident[]>('incidents', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [formData, setFormData] = useState({
    type: 'safety' as IncidentType,
    severity: 'medium' as IncidentSeverity,
    title: '',
    description: '',
    location: ''
  })

  const getIncidentIcon = (type: IncidentType) => {
    switch (type) {
      case 'safety':
        return <Warning className="w-5 h-5" weight="fill" />
      case 'medical':
        return <FirstAid className="w-5 h-5" weight="fill" />
      case 'passenger':
        return <User className="w-5 h-5" weight="fill" />
      case 'equipment':
        return <Wrench className="w-5 h-5" weight="fill" />
      default:
        return <Warning className="w-5 h-5" weight="fill" />
    }
  }

  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-critical/10 text-critical border-critical/20'
      case 'high':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'medium':
        return 'bg-accent/10 text-accent border-accent/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-success/10 text-success border-success/20'
      case 'acknowledged':
        return 'bg-accent/10 text-accent border-accent/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    const newIncident: Incident = {
      id: Date.now().toString(),
      ...formData,
      reportedBy: 'Current User',
      timestamp: Date.now(),
      status: 'open'
    }

    setIncidents((current) => [newIncident, ...(current || [])])
    toast.success('Incident reported successfully')
    setIsDialogOpen(false)
    setFormData({
      type: 'safety',
      severity: 'medium',
      title: '',
      description: '',
      location: ''
    })
  }

  const handleStatusUpdate = (incident: Incident, newStatus: 'acknowledged' | 'resolved') => {
    setIncidents((current) =>
      (current || []).map((inc) =>
        inc.id === incident.id ? { ...inc, status: newStatus } : inc
      )
    )
    toast.success(`Incident marked as ${newStatus}`)
    setSelectedIncident(null)
  }

  const openIncidents = incidents?.filter(i => i.status === 'open') || []
  const acknowledgedIncidents = incidents?.filter(i => i.status === 'acknowledged') || []
  const resolvedIncidents = incidents?.filter(i => i.status === 'resolved') || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Incident Reports</h2>
          <p className="text-sm text-muted-foreground">Safety and operational incident tracking</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-5 h-5" weight="bold" />
          Report Incident
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{openIncidents.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{acknowledgedIncidents.length}</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{resolvedIncidents.length}</div>
            <p className="text-xs text-muted-foreground">This flight</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {incidents && incidents.length > 0 ? (
          incidents.map((incident) => (
            <Card 
              key={incident.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-accent/50"
              onClick={() => setSelectedIncident(incident)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-muted">
                      {getIncidentIcon(incident.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{incident.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{incident.location}</span>
                        <span>•</span>
                        <span>{incident.reportedBy}</span>
                        <span>•</span>
                        <span>{new Date(incident.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" weight="light" />
                <p className="text-sm text-muted-foreground">No incidents reported</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report New Incident</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Incident Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as IncidentType})}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="passenger">Passenger Issue</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value as IncidentSeverity})}>
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Zone A, Seat 12B..."
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed incident description..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                {selectedIncident && getIncidentIcon(selectedIncident.type)}
              </div>
              {selectedIncident?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedIncident && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getSeverityColor(selectedIncident.severity)}>
                  {selectedIncident.severity}
                </Badge>
                <Badge className={getStatusColor(selectedIncident.status)}>
                  {selectedIncident.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {selectedIncident.type}
                </Badge>
              </div>

              <div className="p-4 space-y-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="mt-1">{selectedIncident.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reported By</p>
                  <p className="mt-1">{selectedIncident.reportedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="mt-1">{new Date(selectedIncident.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{selectedIncident.description}</p>
              </div>

              {selectedIncident.status === 'open' && (
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedIncident, 'acknowledged')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Acknowledge
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedIncident, 'resolved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve
                  </Button>
                </div>
              )}

              {selectedIncident.status === 'acknowledged' && (
                <Button 
                  className="w-full"
                  onClick={() => handleStatusUpdate(selectedIncident, 'resolved')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
