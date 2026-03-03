import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Airplane, 
  CheckCircle, 
  User, 
  BookOpen, 
  ClipboardText, 
  Presentation,
  ArrowRight,
  ArrowLeft
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AuthUser } from '@/lib/types'

interface OnboardingPageProps {
  user: AuthUser
  onComplete: () => void
}

export default function OnboardingPage({ user, onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 'welcome',
      icon: Airplane,
      title: 'Welcome to Cabin Operations',
      description: 'Let\'s get you set up to transform your cabin crew experience',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Airplane className="w-16 h-16 text-white" weight="fill" />
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              Welcome aboard, {user.name.split(' ')[0]}!
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You're joining a revolutionary platform designed to streamline cabin operations, 
              enhance safety, and improve passenger experience through intelligent automation and real-time insights.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <h4 className="font-medium text-foreground">Offline-First Architecture</h4>
                <p className="text-sm text-muted-foreground">Work seamlessly even without connectivity</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <h4 className="font-medium text-foreground">AI-Powered Assistance</h4>
                <p className="text-sm text-muted-foreground">Intelligent support for complex tasks</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <h4 className="font-medium text-foreground">Real-Time Coordination</h4>
                <p className="text-sm text-muted-foreground">Stay connected with your entire crew</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      icon: User,
      title: 'Your Profile',
      description: 'Review your crew information and preferences',
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-2">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Crew
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="text-sm text-muted-foreground mb-1">Employee ID</div>
              <div className="font-mono font-medium">{user.employeeId}</div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="text-sm text-muted-foreground mb-1">Airline</div>
              <div className="font-medium">{user.airline}</div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="text-sm text-muted-foreground mb-1">Role</div>
              <div className="font-medium capitalize">{user.role} Crew Member</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm text-muted-foreground">
              Your profile information is securely stored and can be updated at any time from the settings menu.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'training',
      icon: BookOpen,
      title: 'Quick Training Overview',
      description: 'Essential features you\'ll use every flight',
      content: (
        <div className="space-y-4">
          <div className="p-5 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
              Dashboard Overview
            </h4>
            <p className="text-sm text-muted-foreground">
              Monitor cabin status, occupancy, and active alerts at a glance. Color-coded indicators help you prioritize actions.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
              Passenger Management
            </h4>
            <p className="text-sm text-muted-foreground">
              Access passenger details, special needs, dietary requirements, and connection info. Respond to requests in real-time.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
              Inventory Tracking
            </h4>
            <p className="text-sm text-muted-foreground">
              Monitor meals, beverages, and supplies in real-time. Automated alerts notify you before items run low.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
              AI Assistant
            </h4>
            <p className="text-sm text-muted-foreground">
              Use the chatbot for document analysis, procedure lookups, and quick answers to operational questions.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'procedures',
      icon: ClipboardText,
      title: 'Safety & Procedures',
      description: 'Critical information for safe operations',
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-destructive/5 border-2 border-destructive/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0">
                <ClipboardText className="w-6 h-6" weight="fill" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Emergency Protocols</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  All emergency procedures are accessible offline. Critical alerts override all other notifications.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                    <span>Medical emergencies: Use quick actions in AI assistant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                    <span>Security threats: Automated robot deployment available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                    <span>Equipment failures: Report immediately via incident system</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Reporting Requirements</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="font-medium text-sm mb-1">Safety Incidents</div>
                <div className="text-xs text-muted-foreground">Report within 15 minutes with photo evidence</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="font-medium text-sm mb-1">Medical Events</div>
                <div className="text-xs text-muted-foreground">Document immediately, follow-up within 1 hour</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="font-medium text-sm mb-1">Equipment Issues</div>
                <div className="text-xs text-muted-foreground">Report before departure or immediately if in-flight</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tour',
      icon: Presentation,
      title: 'You\'re All Set!',
      description: 'Start using the platform',
      content: (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
              <CheckCircle className="w-20 h-20 text-white" weight="fill" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              You're Ready to Fly!
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You've completed the onboarding process. You can now access all features of the Cabin Operations Platform.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-accent/5 border border-accent/20 text-left">
            <h4 className="font-semibold text-foreground mb-3">Quick Tips:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <span>Explore each tab to familiarize yourself with available features</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <span>Use the AI assistant (bottom-right) for instant help</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <span>Check alerts regularly via the bell icon in the header</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" weight="fill" />
                <span>Platform works offline - changes sync automatically</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100
  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.75_0.20_145/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.35_0.15_250/0.08),transparent_40%)]" />

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <StepIcon className="w-6 h-6" weight="fill" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {currentStepData.title}
                </div>
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-border/50">
              <CardHeader>
                <CardDescription className="text-base">
                  {currentStepData.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStepData.content}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary w-8'
                    : index < currentStep
                    ? 'bg-accent'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="gap-2"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
