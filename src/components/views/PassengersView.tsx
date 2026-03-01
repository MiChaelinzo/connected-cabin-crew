import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MagnifyingGlass, Airplane, ForkKnife, Coffee, Star, Clock } from '@phosphor-icons/react'
import PassengerAssistanceAI from '@/components/PassengerAssistanceAI'
import type { Passenger } from '@/lib/types'

export default function PassengersView() {
  const [passengers] = useKV<Passenger[]>('passengers', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null)

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
        <DialogContent className="max-w-lg">
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
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground">Seat Assignment</p>
                <p className="mt-1 text-2xl font-mono font-semibold">{selectedPassenger.seatNumber}</p>
              </div>

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
