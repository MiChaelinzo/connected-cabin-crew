# Cabin Crew Operations Platform - Product Requirements Document

A comprehensive digital operations platform that transforms cabin crew workflows through intelligent automation, offline-first architecture, and real-time data integration.

**Experience Qualities**:
1. **Confidence** - Every interaction reinforces crew expertise with authoritative data presentation and reliable offline functionality that never loses information
2. **Clarity** - Information hierarchy prioritizes mission-critical alerts and status indicators, enabling instant comprehension even during high-pressure situations
3. **Control** - Crew maintain complete oversight of all cabin operations with granular task management, customizable alerts, and intuitive workflow orchestration

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)

This platform addresses multiple interconnected operational domains—passenger services, cabin monitoring, inventory management, incident reporting, crew coordination, and security monitoring—each requiring distinct data models, workflows, and integration points with broader airline systems. The offline-first architecture adds additional complexity through sync engines, conflict resolution, and state management across connectivity transitions.

## Essential Features

### Real-Time Cabin Status Dashboard
- **Functionality**: Displays live cabin environment status including seat occupancy, equipment health, environmental conditions, and active service phases with color-coded status indicators
- **Purpose**: Provides crew with immediate situational awareness to identify issues proactively before they impact operations or passenger experience
- **Trigger**: Automatically loads on app launch; updates continuously via sensor data and crew inputs
- **Progression**: App launch → Dashboard displays cabin zones with color-coded status → Crew taps zone to drill into details → Views specific equipment/passenger alerts → Takes action or logs issue → System updates status in real-time
- **Success criteria**: Crew can identify and respond to cabin issues 40% faster than manual observation methods; 90% of equipment faults detected before passenger reports; zero missed critical alerts

### Passenger Context & Services
- **Functionality**: Provides crew access to passenger profiles, preferences, special needs, connecting flight status, meal selections, and purchase history with AI-powered assistance recommendations
- **Purpose**: Enables personalized service delivery and proactive assistance for high-value passengers, those with special needs, or those with tight connections
- **Trigger**: Crew scans boarding pass, searches by seat number, or receives automated alert for passenger requiring attention
- **Progression**: Crew searches passenger → Profile displays with preferences and alerts → Crew reviews special requests/dietary needs → AI suggests personalized service options → Crew delivers service → Logs completion → System updates passenger history
- **Success criteria**: 70% increase in proactive passenger assistance; measurable improvement in passenger NPS scores; reduction in missed special service requests; 95% dietary requirement accuracy

### Smart Inventory Management
- **Functionality**: Tracks real-time inventory of meals, beverages, duty-free items, and service supplies with predictive consumption analytics and automated restocking alerts
- **Purpose**: Prevents stockouts during service, reduces waste of perishables, optimizes duty-free sales through targeted recommendations, and streamlines post-flight restocking
- **Trigger**: Auto-syncs at flight start; updates as items are consumed/sold; alerts crew on low stock based on consumption patterns
- **Progression**: Crew views inventory dashboard → Sees predictive alerts for high-demand items → Adjusts service strategy accordingly → Sells/serves items via quick-add interface → System auto-decrements quantities → Consumption trends update → Generates restocking report for ground crew
- **Success criteria**: 95% inventory accuracy without manual counting; 15% reduction in unused perishables; 10% increase in duty-free sales through targeted recommendations; zero mid-service stockouts

### Incident & Safety Reporting
- **Functionality**: Structured digital forms for reporting safety incidents, passenger issues, equipment malfunctions, and security concerns with photo/video attachment support and severity classification
- **Purpose**: Replaces paper-based reporting, ensures consistent documentation standards, enables rapid response to safety issues, creates analyzable safety data for trend identification
- **Trigger**: Crew witnesses incident or receives passenger report requiring documentation
- **Progression**: Crew taps "Report Incident" → Selects incident type from categorized list → Fills structured form with voice-to-text option → Attaches photos/videos → Assigns severity level → Reviews and submits → Auto-routes to flight deck/ground ops based on severity → Receives acknowledgment → Can track resolution status
- **Success criteria**: 60% reduction in incident report completion time; 100% digital submission within 5 minutes of incident; elimination of lost/incomplete paper reports; 40% improvement in actionable incident data quality

### Crew Coordination Hub
- **Functionality**: Real-time crew-to-crew messaging, task assignment with priority levels, service phase coordination, shift handover documentation, and workload distribution visualization
- **Purpose**: Reduces miscommunication, distributes workload efficiently across cabin zones, ensures seamless coordination during shift changes, and maintains service quality consistency
- **Trigger**: Crew needs to communicate with colleagues, delegate task, coordinate service timing, or document handover
- **Progression**: Crew opens coordination panel → Views team status, locations, and current workload → Sends task assignment or message with priority → Recipient receives notification with context → Completes task → Confirms completion → System logs activity and updates workload metrics
- **Success criteria**: 50% reduction in missed task handoffs; improved Crew Effort Score through better workload distribution; 30% faster turnaround through coordinated cabin prep; measurable reduction in service timing conflicts

### Offline-First Sync Engine
- **Functionality**: Complete app functionality maintained during connectivity loss with visual offline indicators, local data queueing, automatic background sync when connection restores, and conflict resolution
- **Purpose**: Ensures operational continuity during satellite black spots, maintaining crew trust in the platform regardless of network status
- **Trigger**: Continuous background monitoring; activates offline mode on connectivity loss; begins sync on reconnection
- **Progression**: Connectivity lost → Visual indicator shows offline mode → Crew continues using all features normally → Data queues locally with timestamps → Connection restores → Auto-sync begins with progress indicator → Conflicts auto-resolved → Confirmation shown
- **Success criteria**: Zero loss of functionality during offline periods; 100% data integrity after sync; sync completion within 30 seconds of reconnection; crew unaware of technical complexities

### Automated Alert Generation
- **Functionality**: Intelligent monitoring system that analyzes sensor data, passenger requests, inventory levels, and flight phase to generate prioritized alerts with actionable recommendations
- **Purpose**: Enables proactive issue resolution by surfacing problems before they escalate; reduces cognitive load by filtering noise and highlighting truly important events
- **Trigger**: Continuous background monitoring checks sensor readings every 10 seconds; passenger events trigger immediate evaluation; inventory thresholds checked on every transaction
- **Progression**: System detects anomaly → Evaluates severity and context → Generates alert with priority level → Routes to appropriate crew member(s) → Displays in Alert Center with suggested actions → Crew acknowledges and acts → System tracks resolution time → Learns from crew response patterns
- **Success criteria**: 80% of critical issues caught proactively before passenger reports; 25% reduction in alert fatigue through intelligent prioritization; 90% crew satisfaction with alert relevance

### Security Monitoring & Robot Integration
- **Functionality**: Real-time tracking of autonomous security robots with patrol status, zone coverage visualization, security event logging, and threat assessment workflows
- **Purpose**: Enhances cabin security through continuous monitoring, provides rapid response to suspicious activities, maintains comprehensive security audit trail
- **Trigger**: Security robot check-ins every 30 seconds; crew manual event logging; automated anomaly detection
- **Progression**: Robot patrols cabin zones → Reports status and detections → System visualizes coverage on cabin map → Detects potential threat → Generates alert → Crew reviews event details → Assesses threat level → Takes appropriate action → Logs resolution
- **Success criteria**: 100% cabin zone coverage tracking; sub-60-second alert delivery for high-priority security events; comprehensive security audit trail; crew confidence in security monitoring

## Edge Case Handling

- **Emergency Situations** - Critical safety alerts override all other notifications with distinct visual/audio signals; emergency protocols accessible within two taps; automatic escalation to flight deck
- **Multi-Crew Conflicts** - Optimistic locking with last-write-wins for most fields; conflict resolution UI for critical data like incident reports; automatic merge for non-conflicting changes
- **Connectivity Degradation** - Automatic quality-of-service adjustment; reduces data sync frequency and image resolution to maintain core functionality; clear visual indicators of reduced functionality
- **Passenger Privacy** - Sensitive passenger data encrypted at rest; access logs maintained for audit; automatic session timeout after 3 minutes of inactivity; role-based visibility controls
- **Language Support** - Interface supports multiple crew languages with instant switching; critical alerts shown in crew's preferred language; fallback to English for untranslated content
- **Battery Conservation** - Reduced animation and background sync frequency when device battery below 20%; manual override for critical operations
- **Large Passenger Manifests** - Virtualized lists for 500+ passengers; indexed search with autocomplete; pagination for history views
- **Inventory Reconciliation** - End-of-flight reconciliation workflow to resolve counting discrepancies; variance reporting with photo documentation support

## Design Direction

The design should evoke **confidence, clarity, and control** in a high-pressure professional environment. Crew must feel that this is a reliable, authoritative tool that enhances their expertise rather than adds complexity. The interface should communicate **precision engineering** while remaining approachable—reflecting aerospace heritage with a modern, human-centered softness. Visual elements should suggest **connectivity and systems thinking**, reinforcing that the cabin is now an intelligent, networked environment. Above all, the design must project **calm under pressure**, with clear information hierarchy and status indicators that allow instant comprehension even during turbulent or emergency situations.

## Color Selection

The color scheme draws inspiration from aviation cockpit design—professional blues contrasted with clear status indicators and emergency alerts.

- **Primary Color**: Deep Blue (`oklch(0.35 0.15 250)`) - Communicates professionalism, trust, and technical precision; evokes clear skies and aviation heritage
- **Secondary Colors**: 
  - Light Blue Muted (`oklch(0.88 0.05 250)`) - Subtle backgrounds for secondary elements without visual weight
  - Soft Blue Background (`oklch(0.96 0.01 250)`) - Near-white with subtle blue tint for main application surface
- **Accent Color**: Vibrant Green (`oklch(0.75 0.20 145)`) - Success states, active status, online connectivity; provides energetic contrast to blues
- **Status Colors**:
  - Success: Green (`oklch(0.70 0.18 145)`) - Completed tasks, normal operations
  - Warning: Amber (`oklch(0.80 0.18 65)`) - Caution states, inventory alerts
  - Critical: Red (`oklch(0.65 0.24 25)`) - Emergency alerts, safety incidents, offline status

**Foreground/Background Pairings**:
- Primary (Deep Blue `oklch(0.35 0.15 250)`): White text (`oklch(0.98 0 0)`) - Ratio 9.2:1 ✓
- Accent (Vibrant Green `oklch(0.75 0.20 145)`): Dark text (`oklch(0.20 0.02 250)`) - Ratio 6.8:1 ✓
- Background (Soft Blue `oklch(0.96 0.01 250)`): Dark text (`oklch(0.20 0.02 250)`) - Ratio 12.1:1 ✓
- Warning (Amber `oklch(0.80 0.18 65)`): Dark text (`oklch(0.20 0.02 250)`) - Ratio 7.4:1 ✓
- Critical (Red `oklch(0.65 0.24 25)`): White text (`oklch(0.98 0 0)`) - Ratio 4.9:1 ✓

## Font Selection

Typography should convey technical precision balanced with human approachability, reflecting both the engineering rigor and the passenger-service warmth required of cabin crew operations.

- **Primary Font**: Inter - Modern geometric sans-serif with excellent legibility at all sizes; professional without being cold; extensive weight range for hierarchy
- **Monospace Font**: JetBrains Mono - Clean, highly readable monospace for flight numbers, seat codes, timestamps, and technical data; distinct glyphs reduce misreading

**Typographic Hierarchy**:
- H1 (App Title): Inter Semibold / 24px / tight letter spacing (-0.02em) / 1.2 line height
- H2 (Section Headers): Inter Semibold / 20px / normal spacing / 1.3 line height
- H3 (Card Titles): Inter Medium / 16px / normal spacing / 1.4 line height
- Body (Primary Content): Inter Regular / 14px / normal spacing / 1.5 line height
- Small (Secondary Info): Inter Regular / 12px / normal spacing / 1.4 line height
- Monospace (Codes/Data): JetBrains Mono Medium / 14px / normal spacing / 1.5 line height

## Animations

Animations should reinforce system responsiveness and state changes without adding perceived latency or drawing attention away from critical information.

- **Micro-interactions**: Button presses and toggle states use 100-150ms spring physics for tactile feedback
- **State Transitions**: Alert acknowledgments, status changes, and data updates animate over 200-300ms with easing for smooth perception
- **Navigation**: Tab switching uses 200ms cross-fade to maintain spatial context without jarring cuts
- **Data Loading**: Skeleton screens with subtle shimmer effect (2s loop) indicate loading states without blocking interaction
- **Alerts**: New alerts slide in from top-right over 300ms with subtle bounce; critical alerts include subtle pulsing glow
- **Offline Indicator**: Connectivity status changes cross-fade over 400ms; offline banner slides down from header over 300ms
- **Moments of Delight**: Successful task completion shows brief checkmark animation (500ms) with subtle confetti for major milestones

## Component Selection

- **Components**: 
  - Navigation: Tabs (Radix) for main sections with fill icons from Phosphor
  - Alerts: Badge with notification count; Popover for alert list; Alert component for inline warnings
  - Passenger Search: Command component for quick passenger lookup; Dialog for detailed passenger profiles
  - Forms: Form components with react-hook-form; Input, Textarea, Select with clear validation states
  - Lists: Table component for data-dense views (inventory, passengers); Card grids for dashboard; ScrollArea for long lists
  - Status Indicators: Badge for phase/status chips; Progress for consumption metrics; custom SVG for connectivity icons
  - Actions: Button (primary, secondary, ghost variants); DropdownMenu for multi-action buttons
  - Feedback: Sonner toasts for confirmations; AlertDialog for destructive actions; Skeleton for loading states
  - Data Viz: Recharts for analytics graphs; custom SVG for cabin map; colored bars for inventory levels
  - Media: Avatar for crew and passenger profiles; inline image upload for incident photos
  - AI Chatbot: Custom floating button with Dialog; Textarea with auto-resize for chat input
  - Custom cabin seat map visualization using SVG with interactive zones and color-coded status
  - Priority-coded incident cards with severity badges and expandable details
  - Offline mode banner with persistent visibility and manual sync trigger

- **Customizations**:
  - Custom turnaround checklist component with progress tracking and phase-based task unlocking
  - Security robot status cards with live position tracking and patrol pattern visualization
  - Dynamic background component with animated gradients that shift based on flight phase
  - Consumption simulator controls for testing inventory depletion scenarios

- **States**:
  - Buttons: Default with subtle shadow; hover with background lightening; active with scale down (0.98); disabled with 50% opacity
  - Form Inputs: Clear focus rings (accent color); validation states inline with colored icons; error messages below field in red
  - Lists/Tables: Hover rows with background color shift; selected rows with accent left border; expandable rows with smooth height transition
  - Alerts: Unread with accent color accent; acknowledged with muted appearance; critical with pulsing border
  - Connectivity: Online (green icon, normal opacity); Offline (red icon, warning banner); Syncing (animated upload icon, progress indicator)

- **Icon Selection**: 
  - Navigation: House (Dashboard), Users (Passengers), Package (Inventory), Warning (Reports), UsersFour (Crew), ShieldCheck (Security), ChartBar (Analytics)
  - Status: WifiHigh/WifiSlash (Connectivity), CloudArrowUp (Syncing), WarningCircle (Alert), CheckCircle (Success), XCircle (Error)
  - Actions: Plus (Add), MagnifyingGlass (Search), Funnel (Filter), Export (Download), Bell (Notifications), Robot (Security)
  - Passenger: AirplaneTilt (Flight), ForkKnife (Meals), Wheelchair (Accessibility), Star (Premium), Clock (Connections)
  - Inventory: Wine (Beverages), ShoppingCart (Duty Free), ChartLineUp (Trends), TrendDown (Low Stock)
  - Reports: Camera (Photo), Microphone (Voice), PaperPlane (Submit), ListChecks (Review)
  - Analytics: TrendUp (Trends), Lightbulb (Insights), Clock (Phases), ChartBarHorizontal (Metrics)

- **Spacing**:
  - Component gaps: gap-6 (1.5rem) between major sections; gap-4 (1rem) between related cards; gap-2 (0.5rem) within cards
  - Padding: p-6 for main content containers; p-4 for cards; p-3 for compact list items; p-2 for button interiors
  - Margins: mb-6 between major sections; mb-4 between subsections; mb-2 for label-to-input spacing

- **Mobile**: 
  - Navigation collapses to icon-only tabs with labels hidden below 640px breakpoint
  - Header flight info stacks vertically on mobile; sync button shows icon only
  - Dashboard switches from 3-column to single-column grid on mobile
  - Tables switch to stacked card layout with key information prioritized
  - Simplified cabin map with collapsible zones for mobile view
  - Reduced data density in lists (show fewer columns, expand on tap for details)
  - AI chatbot minimizes to smaller floating button on mobile
  - Single-column layouts with full-width cards below 768px
  - Alert center shows abbreviated count; full list in sheet drawer instead of popover
  - Sticky action buttons at bottom of screen for critical mobile actions
