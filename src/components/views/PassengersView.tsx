import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { MagnifyingGlass, Airplane, ForkKnife, Coffee, Star, Clock, CheckCircle, Prohibit, HourglassHigh, ChatCircleText, Thermometer, Television, Bed, HandHeart } from '@phosphor-icons/react'
import { toast } from 'sonner'
import PassengerAssistanceAI from '@/components/PassengerAssistanceAI'
import type { Passenger, PassengerRequest, RequestStatus } from '@/lib/types'

export default function PassengersView() {
  const [passengers, setPassengers] = useKV<Passenger[]>('passengers', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null)
  const [requests, setRequests] = useKV<PassengerRequest[]>('passenger-requests', [])

  const filteredPassengers = passengers?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.seatNumber.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'first':
        return 'bg-accent/20 text-accent border-accent/30'
      case 'business':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'premium':
        return 'bg-warning/10 text-warning border-warning/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'first':
      case 'business':
        return <Star className="w-3.5 h-3.5" weight="fill" />
      default:
        return null
    }
  }

  const handleQuickReply = async (passengerId: string, type: string, description: string) => {
    const newRequest: PassengerRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      passengerId,
      type: type as any,
      description,
      status: 'in-progress',
      timestamp: Date.now(),
      respondedBy: 'Crew Member',
      respondedAt: Date.now(),
      response: 'On my way'
    }

    setRequests((current) => [...(current || []), newRequest])
    
    toast.success(`Request acknowledged`, {
      description: `"${description}" - Response sent to passenger`
    })

    setTimeout(() => {
      setRequests((current) =>
        (current || []).map((req) =>
          req.id === newRequest.id
            ? { ...req, status: 'completed' as RequestStatus, completedAt: Date.now() }
            : req
        )
      )
      toast.success('Request completed', {
        description: `"${description}" has been fulfilled`
      })
    }, 5000)
  }

  const getPassengerRequests = (passengerId: string) => {
    return (requests || []).filter(req => req.passengerId === passengerId)
  }

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'beverage':
        return <Coffee className="w-4 h-4" weight="fill" />
      case 'meal':
        return <ForkKnife className="w-4 h-4" weight="fill" />
      case 'blanket':
        return <Bed className="w-4 h-4" weight="fill" />
      case 'temperature':
        return <Thermometer className="w-4 h-4" weight="fill" />
      case 'entertainment':
        return <Television className="w-4 h-4" weight="fill" />
      case 'assistance':
        return <HandHeart className="w-4 h-4" weight="fill" />
      default:
        return <ChatCircleText className="w-4 h-4" weight="fill" />
    }
  }

  const getRequestStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
            Completed
          </Badge>
        )
      case 'in-progress':
        return (
          <Badge className="bg-accent/10 text-accent border-accent/20">
            <HourglassHigh className="w-3 h-3 mr-1" weight="fill" />
            In Progress
          </Badge>
        )
      case 'declined':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <Prohibit className="w-3 h-3 mr-1" weight="fill" />
            Declined
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" weight="fill" />
            Pending
          </Badge>
        )
    }
  }

  const quickReplyOptions = [
    { type: 'beverage', label: 'Water', description: 'Glass of water', icon: Coffee },
    { type: 'beverage', label: 'Coffee', description: 'Cup of coffee', icon: Coffee },
    { type: 'beverage', label: 'Tea', description: 'Cup of tea', icon: Coffee },
    { type: 'meal', label: 'Snack', description: 'Light snack', icon: ForkKnife },
    { type: 'blanket', label: 'Blanket', description: 'Extra blanket', icon: Bed },
    { type: 'temperature', label: 'Too Cold', description: 'Passenger feels cold', icon: Thermometer },
    { type: 'entertainment', label: 'IFE Help', description: 'Entertainment system assistance', icon: Television },
    { type: 'assistance', label: 'Assistance', description: 'General assistance needed', icon: HandHeart },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Passengers</h2>
        <p className="text-sm text-muted-foreground">Passenger information and special services</p>
      </div>

      <PassengerAssistanceAI />

      <div className="relative">
        <MagnifyingGlass className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or seat number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPassengers.length > 0 ? (
          filteredPassengers.map((passenger) => (
            <Card 
              key={passenger.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-accent/50"
              onClick={() => setSelectedPassenger(passenger)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{passenger.name}</CardTitle>
                    <p className="text-sm font-mono font-medium text-muted-foreground mt-0.5">
                      Seat {passenger.seatNumber}
                    </p>
                  </div>
                  <Badge className={`${getTierColor(passenger.tier)} flex items-center gap-1 ml-2`}>
                    {getTierIcon(passenger.tier)}
                    <span className="capitalize">{passenger.tier}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {passenger.specialNeeds && passenger.specialNeeds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {passenger.specialNeeds.map((need, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {need}
                      </Badge>
                    ))}
                  </div>
                )}
                {passenger.connectingFlight && (
                  <div className="flex items-center gap-2 pt-2 text-xs border-t text-warning">
                    <Airplane className="w-4 h-4" weight="fill" />
                    <span>Tight connection • Gate {passenger.connectingFlight.gate}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <MagnifyingGlass className="w-12 h-12 mx-auto mb-3 text-muted-foreground" weight="light" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No passengers found' : 'No passenger data available'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedPassenger} onOpenChange={() => setSelectedPassenger(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedPassenger?.name}</span>
              <Badge className={getTierColor(selectedPassenger?.tier || 'economy')}>
                {getTierIcon(selectedPassenger?.tier || 'economy')}
                <span className="ml-1 capitalize">{selectedPassenger?.tier}</span>
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPassenger && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground">Seat Assignment</p>
                <p className="mt-1 text-2xl font-mono font-semibold">{selectedPassenger.seatNumber}</p>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Reply Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplyOptions.map((option, idx) => {
                    const IconComponent = option.icon
                    return (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto py-3 transition-all hover:bg-accent/10 hover:border-accent hover:scale-[1.02]"
                        onClick={() => handleQuickReply(selectedPassenger.id, option.type, option.description)}
                      >
                        <IconComponent className="w-4 h-4 mr-2" weight="fill" />
                        <div className="text-left">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {getPassengerRequests(selectedPassenger.id).length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recent Requests</p>
                  <div className="space-y-2">
                    {getPassengerRequests(selectedPassenger.id)
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .slice(0, 5)
                      .map((request) => (
                        <div key={request.id} className="p-3 border rounded-lg bg-card">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              {getRequestIcon(request.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{request.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(request.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {request.respondedBy && ` • Handled by ${request.respondedBy}`}
                                </p>
                              </div>
                            </div>
                            {getRequestStatusBadge(request.status)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <Separator />

              {selectedPassenger.specialNeeds && selectedPassenger.specialNeeds.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Special Requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPassenger.specialNeeds.map((need, idx) => (
                      <Badge key={idx} variant="outline">{need}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedPassenger.dietaryRequirements && selectedPassenger.dietaryRequirements.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Dietary Requirements</p>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <ForkKnife className="w-5 h-5 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {selectedPassenger.dietaryRequirements.map((req, idx) => (
                        <span key={idx} className="text-sm">{req}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedPassenger.preferences && (
                <div>
                  <p className="mb-2 text-sm font-medium">Preferences</p>
                  <div className="space-y-2">
                    {selectedPassenger.preferences.beverage && (
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Coffee className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">Prefers {selectedPassenger.preferences.beverage}</span>
                      </div>
                    )}
                    {selectedPassenger.preferences.meal && (
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <ForkKnife className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">Prefers {selectedPassenger.preferences.meal}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedPassenger.connectingFlight && (
                <div>
                  <p className="mb-2 text-sm font-medium">Connecting Flight</p>
                  <div className="p-4 border rounded-lg bg-warning/5 border-warning/20">
                    <div className="flex items-center gap-2 mb-3 text-warning">
                      <Clock className="w-5 h-5" weight="fill" />
                      <span className="font-medium">Tight Connection</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Flight:</span> {selectedPassenger.connectingFlight.flightNumber}</p>
                      <p><span className="font-medium">Destination:</span> {selectedPassenger.connectingFlight.departure}</p>
                      <p><span className="font-medium">Gate:</span> {selectedPassenger.connectingFlight.gate}</p>
                      <p><span className="font-medium">Boarding:</span> {selectedPassenger.connectingFlight.boardingTime}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
