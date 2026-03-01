import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkle, 
  User, 
  Clock, 
  TrendUp,
  CheckCircle
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import type { Passenger } from '@/lib/types'

interface Recommendation {
  id: string
  passengerId: string
  passengerName: string
  seatNumber: string
  type: 'proactive' | 'recovery' | 'upsell' | 'special'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  suggestedAction: string
  acknowledged: boolean
}

export default function PassengerAssistanceAI() {
  const [passengers] = useKV<Passenger[]>('passengers', [])
  const [recommendations, setRecommendations] = useKV<Recommendation[]>('ai-recommendations', [])
  const [loading, setLoading] = useState(false)

  const generateRecommendations = async () => {
    setLoading(true)
    
    try {
      const highPriorityPassengers = passengers?.filter(
        p => p.tier === 'first' || p.tier === 'business' || p.connectingFlight || p.specialNeeds
      ) || []

      if (highPriorityPassengers.length === 0) {
        toast.info('No high-priority passengers detected', {
          description: 'AI recommendations work best with passenger data'
        })
        setLoading(false)
        return
      }

      const passengersData = highPriorityPassengers.slice(0, 3).map(p => ({
        name: p.name,
        seat: p.seatNumber,
        tier: p.tier,
        specialNeeds: p.specialNeeds || [],
        dietary: p.dietaryRequirements || [],
        connecting: p.connectingFlight ? `${p.connectingFlight.flightNumber} at ${p.connectingFlight.boardingTime}` : null,
        preferences: p.preferences
      }))

      const promptText = `You are an AI assistant for cabin crew. Analyze these passengers and generate 3 proactive service recommendations. 
      
Passengers: ${JSON.stringify(passengersData)}

For each passenger, suggest ONE specific, actionable service opportunity. Consider:
- Their cabin tier and preferences
- Special needs or dietary requirements  
- Connection times
- Potential upsell opportunities
- Service recovery opportunities

Return valid JSON with this exact structure:
{
  "recommendations": [
    {
      "passengerName": "string",
      "seat": "string",
      "type": "proactive|recovery|upsell|special",
      "priority": "high|medium|low",
      "title": "Brief title (max 8 words)",
      "description": "One sentence description of the opportunity",
      "action": "Specific action crew should take (max 12 words)"
    }
  ]
}`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)

      const newRecommendations: Recommendation[] = data.recommendations.map((rec: any, idx: number) => ({
        id: `rec-${Date.now()}-${idx}`,
        passengerId: highPriorityPassengers.find(p => p.name === rec.passengerName)?.id || '',
        passengerName: rec.passengerName,
        seatNumber: rec.seat,
        type: rec.type,
        priority: rec.priority,
        title: rec.title,
        description: rec.description,
        suggestedAction: rec.action,
        acknowledged: false
      }))

      setRecommendations(newRecommendations)
      
      toast.success('AI recommendations generated', {
        description: `${newRecommendations.length} personalized service opportunities identified`
      })
    } catch (error) {
      console.error('Error generating recommendations:', error)
      toast.error('Failed to generate recommendations', {
        description: 'Please try again'
      })
    }
    
    setLoading(false)
  }

  const acknowledgeRecommendation = (recId: string) => {
    setRecommendations(current =>
      (current || []).map(rec =>
        rec.id === recId ? { ...rec, acknowledged: true } : rec
      )
    )
    toast.success('Action noted', {
      description: 'Recommendation marked as acknowledged'
    })
  }

  const clearRecommendations = () => {
    setRecommendations([])
    toast.info('Recommendations cleared')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'proactive':
        return 'bg-accent/10 text-accent border-accent/20'
      case 'recovery':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'upsell':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'special':
        return 'bg-success/10 text-success border-success/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <TrendUp className="w-4 h-4 text-warning" weight="fill" />
      case 'medium':
        return <Clock className="w-4 h-4 text-accent" weight="fill" />
      default:
        return null
    }
  }

  const activeRecommendations = recommendations?.filter(r => !r.acknowledged) || []

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-accent" weight="fill" />
            AI Service Assistant
          </CardTitle>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
            Smart
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkle className="w-12 h-12 mx-auto mb-3 text-accent/50" weight="light" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate AI-powered service recommendations based on passenger data
            </p>
            <Button
              onClick={generateRecommendations}
              disabled={loading || !passengers || passengers.length === 0}
              className="bg-accent hover:bg-accent/90"
            >
              {loading ? 'Analyzing...' : 'Generate Recommendations'}
            </Button>
          </div>
        ) : (
          <>
            {activeRecommendations.map(rec => (
              <div
                key={rec.id}
                className="flex flex-col gap-3 p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" weight="fill" />
                      <span className="font-semibold text-sm">{rec.passengerName}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {rec.seatNumber}
                      </Badge>
                      {getPriorityIcon(rec.priority)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getTypeColor(rec.type)} text-xs capitalize`}>
                          {rec.type}
                        </Badge>
                        <span className="font-medium text-sm">{rec.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rec.description}
                      </p>
                      <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                        <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" weight="bold" />
                        <span className="text-xs font-medium text-foreground">
                          {rec.suggestedAction}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => acknowledgeRecommendation(rec.id)}
                >
                  Mark as Completed
                </Button>
              </div>
            ))}

            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={generateRecommendations}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearRecommendations}
              >
                Clear All
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
