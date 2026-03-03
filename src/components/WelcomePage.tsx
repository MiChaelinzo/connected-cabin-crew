import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Airplane, ShieldCheck, ChartBar, Users, CloudArrowUp, BellRinging, Robot } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface WelcomePageProps {
  onGetStarted: () => void
  onLogin: () => void
}

export default function WelcomePage({ onGetStarted, onLogin }: WelcomePageProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const features = [
    {
      id: 'operations',
      icon: Airplane,
      title: 'Streamlined Operations',
      description: 'Manage cabin operations, inventory, and passenger services from a unified platform designed for efficiency.'
    },
    {
      id: 'security',
      icon: ShieldCheck,
      title: 'Advanced Security',
      description: 'AI-powered threat detection with integrated robot monitoring and real-time security event management.'
    },
    {
      id: 'analytics',
      icon: ChartBar,
      title: 'Smart Analytics',
      description: 'Data-driven insights for consumption tracking, performance metrics, and operational optimization.'
    },
    {
      id: 'collaboration',
      icon: Users,
      title: 'Crew Coordination',
      description: 'Seamless communication and task management across your entire cabin crew team.'
    },
    {
      id: 'offline',
      icon: CloudArrowUp,
      title: 'Offline-First Design',
      description: 'Full functionality during connectivity blackspots with automatic sync when connection restored.'
    },
    {
      id: 'alerts',
      icon: BellRinging,
      title: 'Intelligent Alerts',
      description: 'Proactive notifications for critical events, low inventory, and passenger assistance requests.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.75_0.20_145/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.35_0.15_250/0.08),transparent_40%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground mb-6 shadow-lg shadow-primary/20"
          >
            <Airplane className="w-10 h-10" weight="fill" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl font-bold text-foreground mb-4 tracking-tight"
          >
            Cabin Operations Platform
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Transform cabin crew operations with intelligent tools, real-time insights, and seamless coordination. 
            Built for the connected aircraft.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onLogin}
              className="px-8 py-6 text-lg font-semibold"
            >
              Login
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                onHoverStart={() => setHoveredCard(feature.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card
                  className={`h-full transition-all duration-300 ${
                    hoveredCard === feature.id
                      ? 'shadow-lg shadow-accent/10 border-accent/30 translate-y-[-4px]'
                      : 'shadow-sm'
                  }`}
                >
                  <CardHeader>
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-colors ${
                        hoveredCard === feature.id
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Icon className="w-6 h-6" weight="fill" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10">
            <CardContent className="py-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Robot className="w-8 h-8 text-accent" weight="fill" />
                <h3 className="text-2xl font-semibold text-foreground">Powered by AI & Automation</h3>
              </div>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Our platform leverages advanced AI for document analysis, predictive alerts, and intelligent assistance. 
                Integrated security robots provide 24/7 monitoring and rapid response capabilities.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p>Designed for Airbus Connected Aircraft • Enterprise-Grade Security • Offline-First Architecture</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
