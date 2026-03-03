import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { House, Users, Package, Warning, UsersFour, WifiHigh, WifiSlash, CloudArrowUp, ChartBar, ShieldCheck, SignOut } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import DashboardView from '@/components/views/DashboardView'
import PassengersView from '@/components/views/PassengersView'
import InventoryView from '@/components/views/InventoryView'
import ReportsView from '@/components/views/ReportsView'
import CrewView from '@/components/views/CrewView'
import AnalyticsView from '@/components/views/AnalyticsView'
import SecurityView from '@/components/views/SecurityView'
import AlertCenter from '@/components/AlertCenter'
import DynamicBackground from '@/components/DynamicBackground'
import AIChatbot from '@/components/AIChatbot'
import WelcomePage from '@/components/WelcomePage'
import LoginPage from '@/components/LoginPage'
import SignupPage from '@/components/SignupPage'
import OnboardingPage from '@/components/OnboardingPage'
import { useAlertMonitor } from '@/hooks/use-alert-monitor'
import { useAutomatedAlerts } from '@/hooks/use-automated-alerts'
import { useInventoryMonitor } from '@/hooks/use-inventory-monitor'
import { useConsumptionTracker } from '@/hooks/use-consumption-tracker'
import { useInitializeData } from '@/hooks/use-initialize-data'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import type { SyncStatus, FlightInfo } from '@/lib/types'

type AppScreen = 'welcome' | 'login' | 'signup' | 'onboarding' | 'app'

function App() {
  const auth = useAuth()
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [syncStatus, setSyncStatus] = useKV<SyncStatus>('sync-status', {
    connectivity: 'online',
    lastSync: Date.now(),
    pendingChanges: 0
  })
  const [flightInfo] = useKV<FlightInfo>('flight-info', {
    flightNumber: 'AB1234',
    departure: 'SIN',
    arrival: 'LHR',
    departureTime: '14:30',
    arrivalTime: '20:45',
    currentPhase: 'cruise'
  })

  useInitializeData()
  useAlertMonitor()
  useAutomatedAlerts()
  useInventoryMonitor()
  useConsumptionTracker()

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (!auth.isOnboarded) {
        setCurrentScreen('onboarding')
      } else {
        setCurrentScreen('app')
      }
    } else {
      setCurrentScreen('welcome')
    }
  }, [auth.isAuthenticated, auth.isOnboarded])

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (!auth.isOnboarded) {
        setCurrentScreen('onboarding')
      } else {
        setCurrentScreen('app')
      }
    } else {
      setCurrentScreen('welcome')
    }
  }, [auth.isAuthenticated, auth.isOnboarded])

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(current => {
        const defaultStatus: SyncStatus = {
          connectivity: 'online',
          lastSync: Date.now(),
          pendingChanges: 0
        }
        const currentStatus = current || defaultStatus
        
        if (currentStatus.connectivity === 'syncing') {
          return currentStatus
        }
        
        if (currentStatus.connectivity === 'offline') {
          const offlineDuration = Date.now() - (currentStatus.lastSync || Date.now())
          if (offlineDuration > 10000 && Math.random() > 0.3) {
            return {
              ...currentStatus,
              connectivity: 'online',
              lastSync: Date.now(),
              pendingChanges: 0
            }
          }
          return currentStatus
        }
        
        return {
          ...currentStatus,
          connectivity: Math.random() > 0.98 ? 'offline' : 'online',
          lastSync: currentStatus.connectivity === 'online' ? Date.now() : currentStatus.lastSync
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [setSyncStatus])

  const handleLogin = async (email: string, password: string) => {
    const result = await auth.login(email, password)
    
    if (result.success) {
      toast.success('Welcome back!')
      return { success: true }
    }
    
    if (email === 'demo@cabin-ops.com' && password === 'demo123') {
      const demoUser = {
        id: 'demo-user-123',
        email: 'demo@cabin-ops.com',
        name: 'Demo Crew Member',
        role: 'crew' as const,
        employeeId: 'DEMO001',
        airline: 'Demo Airlines',
        certifications: ['Safety', 'Medical', 'Service'],
        preferences: {
          language: 'en',
          notifications: true
        }
      }
      
      auth.updateUser(demoUser)
      setCurrentScreen('onboarding')
      toast.success('Welcome to the demo!')
      return { success: true }
    }
    
    return result
  }

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    employeeId: string,
    airline: string
  ) => {
    const result = await auth.signup(name, email, password, employeeId, airline)
    
    if (result.success) {
      toast.success('Account created successfully!')
      return { success: true }
    }
    
    return result
  }

  const handleLogout = async () => {
    await auth.logout()
    setCurrentScreen('welcome')
    setActiveTab('dashboard')
    toast.success('Logged out successfully')
  }

  const handleManualSync = () => {
    setSyncStatus(current => {
      const defaultStatus: SyncStatus = {
        connectivity: 'online',
        lastSync: Date.now(),
        pendingChanges: 0
      }
      const currentStatus = current || defaultStatus
      return {
        ...currentStatus,
        connectivity: 'syncing'
      }
    })

    setTimeout(() => {
      setSyncStatus(current => {
        const defaultStatus: SyncStatus = {
          connectivity: 'online',
          lastSync: Date.now(),
          pendingChanges: 0
        }
        const currentStatus = current || defaultStatus
        return {
          ...currentStatus,
          connectivity: 'online',
          lastSync: Date.now(),
          pendingChanges: 0
        }
      })
    }, 2000)
  }

  const getConnectivityIcon = () => {
    if (!syncStatus) return null
    switch (syncStatus.connectivity) {
      case 'online':
        return <WifiHigh className="w-5 h-5 text-success" weight="fill" />
      case 'offline':
        return <WifiSlash className="w-5 h-5 text-critical" weight="fill" />
      case 'syncing':
        return <CloudArrowUp className="w-5 h-5 text-accent animate-pulse" weight="fill" />
    }
  }

  const getConnectivityText = () => {
    if (!syncStatus) return 'Loading...'
    switch (syncStatus.connectivity) {
      case 'online':
        return 'Connected'
      case 'offline':
        return 'Offline Mode'
      case 'syncing':
        return 'Syncing...'
    }
  }

  if (currentScreen === 'welcome') {
    return (
      <WelcomePage
        onGetStarted={() => setCurrentScreen('signup')}
        onLogin={() => setCurrentScreen('login')}
      />
    )
  }

  if (currentScreen === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setCurrentScreen('welcome')}
        onSignup={() => setCurrentScreen('signup')}
      />
    )
  }

  if (currentScreen === 'signup') {
    return (
      <SignupPage
        onSignup={handleSignup}
        onBack={() => setCurrentScreen('welcome')}
        onLogin={() => setCurrentScreen('login')}
      />
    )
  }

  if (currentScreen === 'onboarding' && auth.user) {
    return (
      <OnboardingPage
        user={auth.user}
        onComplete={() => {
          auth.completeOnboarding()
          setCurrentScreen('app')
          toast.success('Welcome to Cabin Operations!')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DynamicBackground />
      <div className="relative z-10">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Cabin Operations
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-sm font-medium text-muted-foreground">
                  {flightInfo?.flightNumber || 'Loading...'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {flightInfo?.departure || ''} → {flightInfo?.arrival || ''}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium uppercase bg-accent/10 text-accent rounded">
                  {flightInfo?.currentPhase || 'Loading...'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlertCenter />
            <button
              onClick={handleManualSync}
              disabled={syncStatus?.connectivity === 'syncing'}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getConnectivityIcon()}
              <span className="hidden sm:inline">{getConnectivityText()}</span>
            </button>
            
            {auth.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {auth.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="hidden md:inline">{auth.user.name.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{auth.user.name}</p>
                      <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <SignOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {syncStatus?.connectivity === 'offline' && (
        <div className="sticky top-[73px] z-40 bg-warning/10 border-b border-warning/20">
          <div className="flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium text-warning">
            <span>You are currently offline. Changes will sync automatically when connection is restored.</span>
            <button
              onClick={handleManualSync}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors rounded bg-warning/20 hover:bg-warning/30"
            >
              <CloudArrowUp className="w-4 h-4" weight="bold" />
              Retry
            </button>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-[calc(100vh-73px)]">
        <TabsList className="flex items-center justify-start w-full h-auto gap-1 p-2 border-b rounded-none bg-background border-border overflow-x-auto">
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
          >
            <House className="w-5 h-5" weight="fill" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>

          <TabsTrigger
            value="passengers"
            className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
          >
            <Users className="w-5 h-5" weight="fill" />
            <span className="hidden sm:inline">Passengers</span>
          </TabsTrigger>

          <TabsTrigger
            value="inventory"
            className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
          >
            <Package className="w-5 h-5" weight="fill" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>

          <TabsTrigger
            value="reports"
            className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
          >
            <Warning className="w-5 h-5" weight="fill" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>

          <TabsTrigger
            value="crew"
            className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
          >
            <UsersFour className="w-5 h-5" weight="fill" />
            <span className="hidden sm:inline">Crew</span>
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
          >
            <ShieldCheck className="w-5 h-5" weight="fill" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>

          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg whitespace-nowrap"
          >
            <ChartBar className="w-5 h-5" weight="fill" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="dashboard" className="m-0">
            <DashboardView />
          </TabsContent>

          <TabsContent value="passengers" className="m-0">
            <PassengersView />
          </TabsContent>

          <TabsContent value="inventory" className="m-0">
            <InventoryView />
          </TabsContent>

          <TabsContent value="reports" className="m-0">
            <ReportsView />
          </TabsContent>

          <TabsContent value="crew" className="m-0">
            <CrewView />
          </TabsContent>

          <TabsContent value="security" className="m-0">
            <SecurityView />
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            <AnalyticsView />
          </TabsContent>
        </div>
      </Tabs>
      </div>

      <AIChatbot />
      <Toaster />
    </div>
  )
}

export default App
