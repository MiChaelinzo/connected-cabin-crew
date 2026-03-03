# ✈️ Cabin Crew Operations Platform

A comprehensive, offline-first web application designed for airline cabin crew to manage in-flight operations, passenger services, inventory tracking, incident reporting, crew coordination, and security monitoring.

## 🎯 Overview

The Cabin Crew Operations Platform is an intelligent, real-time operational tool that empowers cabin crew with situational awareness and streamlined workflows during flights. Built with offline-first architecture, the platform ensures uninterrupted functionality even during satellite connectivity blackspots, with automatic synchronization when connection is restored.

## ✨ Key Features

### 🔐 **Authentication & Onboarding**
- Secure login and signup with email/password
- Comprehensive onboarding wizard for new crew members
- Demo mode for testing and exploration
- Session management with automatic token refresh
- Profile management with airline and role information

### 🌐 **API Integration**
- RESTful API client with type-safe requests
- Automatic authentication header injection
- Request queueing for offline scenarios
- Configurable endpoints for all platform features
- Comprehensive error handling and retry logic
- See [API Integration Guide](./API_INTEGRATION.md) for details

### 📊 **Real-Time Dashboard**
- Live cabin status monitoring with visual indicators
- Flight phase tracking (boarding, taxi, takeoff, cruise, landing, turnaround)
- Service phase monitoring with automated alerts
- Quick actions for common crew tasks
- Dynamic background reflecting current flight phase

### 👥 **Passenger Management**
- Comprehensive passenger profiles with preferences and special needs
- AI-powered passenger assistance chatbot
- Meal and dietary requirement tracking
- Seat assignment and cabin zone visualization
- Real-time passenger service logging

### 📦 **Smart Inventory Tracking**
- Real-time inventory levels for meals, beverages, and duty-free items
- Automated low-stock alerts with configurable thresholds
- Consumption analytics and trending
- Predictive restocking recommendations
- Duty-free sales tracking with revenue insights

### 📋 **Incident & Safety Reporting**
- Structured incident report forms with severity classification
- Photo attachment support for documentation
- Auto-routing to flight deck and ground operations
- Historical incident log with search and filter
- Real-time status tracking and acknowledgment

### 👨‍✈️ **Crew Coordination**
- Crew roster and role management
- Task assignment and tracking
- Shift handover documentation
- Real-time crew status and availability
- Performance metrics and workload distribution

### 🔒 **Security Monitoring**
- Security robot patrol monitoring with live status
- Security event logging and threat assessment
- Visual security dashboard with cabin zones
- Automated security alerts and escalation
- Incident correlation and pattern detection

### 📈 **Advanced Analytics**
- Service efficiency metrics and trends
- Passenger satisfaction insights
- Inventory consumption patterns
- Crew performance analytics
- Operational efficiency scoring

### 🤖 **AI-Powered Features**
- Intelligent passenger assistance chatbot
- Automated alert generation based on sensor data
- Predictive inventory management
- Smart recommendations for service optimization
- Natural language incident reporting

### 🌐 **Offline-First Architecture**
- Full functionality during connectivity loss
- Automatic background synchronization
- Visual connectivity status indicators
- Manual sync trigger for immediate updates
- Zero data loss with conflict resolution

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript for type-safe component development
- **Tailwind CSS v4** for modern utility-first styling
- **shadcn/ui v4** component library with 40+ pre-built components
- **Framer Motion** for smooth animations and transitions
- **Phosphor Icons** for comprehensive iconography

### State & Data Management
- **useKV Hook** for persistent, offline-first data storage
- **React Hooks** for local component state
- **Optimistic UI updates** for responsive interactions
- **Automatic sync engine** with queue management

### Visualization & Charts
- **Recharts** for data visualization and analytics
- **Custom SVG** for cabin maps and zone visualization
- **D3.js** for advanced data transformations

### AI & LLM Integration
- **Spark LLM API** for AI-powered features
- **GPT-4o** for intelligent chatbot responses
- **JSON mode** for structured data generation

### Development Tools
- **Vite** for fast development and optimized builds
- **TypeScript** for type safety and developer experience
- **ESLint** for code quality
- **React Error Boundary** for graceful error handling

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components (40+ components)
│   ├── views/                 # Main view components for each tab
│   │   ├── DashboardView.tsx
│   │   ├── PassengersView.tsx
│   │   ├── InventoryView.tsx
│   │   ├── ReportsView.tsx
│   │   ├── CrewView.tsx
│   │   ├── SecurityView.tsx
│   │   └── AnalyticsView.tsx
│   ├── WelcomePage.tsx         # Landing/welcome screen
│   ├── LoginPage.tsx           # Authentication login
│   ├── SignupPage.tsx          # User registration
│   ├── OnboardingPage.tsx      # New user onboarding wizard
│   ├── AIChatbot.tsx           # AI-powered assistant
│   ├── AlertCenter.tsx         # Centralized alert management
│   ├── DynamicBackground.tsx   # Phase-aware background
│   └── [feature components]    # Specialized feature components
├── hooks/
│   ├── use-auth.ts             # Authentication state management
│   ├── use-alert-monitor.ts    # Real-time alert monitoring
│   ├── use-consumption-tracker.ts
│   ├── use-inventory-monitor.ts
│   └── use-initialize-data.ts  # Seed data initialization
├── lib/
│   ├── api.ts                  # API client with offline support
│   ├── types.ts                # TypeScript type definitions
│   ├── alert-generator.ts      # Automated alert logic
│   ├── consumption-analytics.ts
│   ├── sensor-data.ts          # Sensor simulation
│   └── utils.ts                # Utility functions
├── App.tsx                     # Main application component
├── index.css                   # Global styles and theme
└── main.tsx                    # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep blue (`oklch(0.35 0.15 250)`) - Professional, trustworthy
- **Accent**: Vibrant green (`oklch(0.75 0.20 145)`) - Success, active status
- **Warning**: Warm amber for alerts and caution states
- **Critical**: Red for emergency and high-priority incidents
- **Background**: Soft blue-tinted light (`oklch(0.96 0.01 250)`)

### Typography
- **Primary Font**: Inter - Clean, professional sans-serif
- **Monospace**: JetBrains Mono - For flight numbers and technical data
- **Hierarchy**: Clear size relationships (2.5rem → 1.25rem → 1rem → 0.875rem)

### Component Design
- Glassmorphism effects with backdrop blur for overlays
- Rounded corners (0.5rem radius) for modern, approachable feel
- Subtle shadows and elevation for depth
- Color-coded status indicators throughout
- Responsive layouts with mobile-first approach

## 🚀 Getting Started

This is a Spark application that runs in a pre-configured development environment. No installation steps required!

### First Time Setup

1. **Launch the Application**: The welcome page will greet you with an overview of features
2. **Create Account**: Click "Get Started" to create your crew account
   - Enter your name, email, employee ID, and airline
   - Create a secure password (minimum 8 characters)
3. **Complete Onboarding**: Follow the 5-step onboarding wizard:
   - Welcome & feature overview
   - Profile verification
   - Quick training on essential features
   - Safety procedures and reporting requirements
   - Platform tour and quick tips
4. **Start Using the Platform**: Access all features from the main dashboard

### Demo Mode

For quick testing without creating an account:
- Click "Login" on the welcome page
- Click "Try Demo Account"
- Or use credentials:
  - Email: `demo@cabin-ops.com`
  - Password: `demo123`

### Development
The application auto-reloads on file changes. View your app in the integrated preview panel.

### Key Components

**Tabs Navigation**: Seven main sections accessible via tabs:
- Dashboard (Home)
- Passengers
- Inventory
- Reports
- Crew
- Security
- Analytics

**Connectivity Status**: Top-right header shows real-time sync status with manual sync option.

**Alert Center**: Badge-based notification system in the header for critical alerts.

**AI Chatbot**: Floating assistant accessible from any view for quick help.

## 💾 Data Persistence

All application data is stored using the **useKV hook** for offline-first persistence:

- **Authentication & Sessions**: User profiles, tokens, and session state
- **Onboarding Progress**: Tracking completion status for new users
- Flight information and current phase
- Passenger profiles and preferences
- Inventory levels and consumption history
- Incident reports and logs
- Crew roster and assignments
- Security events and robot status
- Alert history and acknowledgments

Data automatically syncs when connectivity is restored, with conflict resolution for concurrent edits.

## 🔐 Security Features

- **JWT-based Authentication**: Secure token-based auth with automatic refresh
- **Session Management**: Automatic timeout and secure token storage
- **Role-Based Access**: Different permissions for lead, senior, and crew members
- Passenger data privacy with secure storage
- Automated security robot monitoring
- Real-time threat detection and alerts
- Comprehensive audit logging

## 🔌 API Integration

The platform includes a comprehensive API client for backend integration:

- **Type-Safe Requests**: Full TypeScript support for all endpoints
- **Offline Queue**: Automatic request queuing when connection is lost
- **Auto-Retry Logic**: Configurable retry attempts for failed requests
- **Authentication**: Automatic token injection for all authenticated requests
- **Endpoints**: Complete coverage for all platform features

See the [API Integration Guide](./API_INTEGRATION.md) for detailed documentation on:
- Endpoint specifications
- Request/response formats
- Authentication flow
- Error handling
- Usage examples

## 📱 Mobile Responsive

Fully optimized for tablet use in-flight:
- Responsive tab navigation with icon-only mobile view
- Touch-friendly interface elements (44px minimum)
- Adaptive layouts for portrait/landscape orientation
- Simplified data density on smaller screens
- Sticky headers and action buttons for easy access

## 🎯 Use Cases

1. **Pre-Flight Preparation**: Review passenger manifest, check inventory levels, verify crew assignments
2. **In-Flight Service**: Track service phases, manage passenger requests, monitor inventory consumption
3. **Incident Management**: Document and report safety issues in real-time with photos
4. **Crew Coordination**: Assign tasks, communicate updates, track workload distribution
5. **Post-Flight Analytics**: Review service metrics, identify improvement opportunities, generate reports
6. **Security Operations**: Monitor security robots, log suspicious activities, coordinate responses

## 🤝 Contributing

This is a demonstration application showcasing offline-first architecture and comprehensive operational management for aviation environments.

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Phosphor Icons](https://phosphoricons.com/) - Iconography
- [Recharts](https://recharts.org/) - Data visualization
- [Spark Runtime](https://github.com/github/spark) - Offline-first infrastructure
