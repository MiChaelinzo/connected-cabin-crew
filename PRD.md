# Planning Guide

A connected cabin crew operations platform that transforms manual, paper-based workflows into intelligent, data-driven processes, enabling crew to deliver superior safety oversight and passenger service through contextual awareness, automated reporting, and proactive cabin monitoring.

**Experience Qualities**:
1. **Empowering** - The platform reduces cognitive load and manual tasks, freeing crew to focus on high-value passenger interaction and safety oversight rather than administrative burden.
2. **Intuitive** - Critical information surfaces contextually at the moment of need, with offline-first reliability that crew can trust even during connectivity gaps.
3. **Comprehensive** - A unified view integrating passenger data, cabin status, inventory management, and operational insights eliminates information silos and enables proactive decision-making.

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This platform addresses multiple interconnected operational domains—passenger services, cabin monitoring, inventory management, incident reporting, and crew coordination—each requiring distinct data models, workflows, and integration points with broader airline systems.

## Essential Features

### Real-Time Cabin Status Dashboard
- **Functionality**: Displays live cabin environment status including seat occupancy, equipment health, environmental conditions, and active service phases
- **Purpose**: Provides crew with immediate situational awareness to identify issues proactively before they impact operations or passenger experience
- **Trigger**: Automatically loads on app launch; updates continuously via sensor data and crew inputs
- **Progression**: App launch → Dashboard displays cabin zones with color-coded status → Crew taps zone to drill into details → Views specific equipment/passenger alerts → Takes action or logs issue
- **Success criteria**: Crew can identify and respond to cabin issues 40% faster than manual observation methods; 90% of equipment faults detected before passenger reports

### Passenger Context & Services
- **Functionality**: Provides crew access to passenger profiles, preferences, special needs, connecting flight status, and purchase history
- **Purpose**: Enables personalized service delivery and proactive assistance for high-value passengers or those with tight connections
- **Trigger**: Crew scans boarding pass, searches by seat number, or receives automated alert for passenger requiring attention
- **Progression**: Crew searches passenger → Profile displays with preferences and alerts → Crew reviews special requests/dietary needs → Delivers personalized service → Logs service completion
- **Success criteria**: 70% increase in proactive passenger assistance; measurable improvement in passenger NPS scores; reduction in missed special service requests

### Smart Inventory Management
- **Functionality**: Tracks real-time inventory of meals, beverages, duty-free items, and service supplies with predictive consumption analytics; automatically monitors inventory levels and generates alerts when supplies run low; includes flight consumption simulator that realistically models inventory usage during different flight phases
- **Purpose**: Eliminates manual counting, prevents stockouts through proactive low-inventory alerts, optimizes loading for future flights, and maximizes ancillary revenue opportunities; simulation capabilities enable training and system testing
- **Trigger**: Auto-syncs at flight start; updates as items are consumed/sold; automatically generates alerts when inventory falls below configurable thresholds; crew can manually adjust quantities; optional simulator can be enabled to automatically consume inventory based on flight phase
- **Progression**: Crew views inventory dashboard → Enables optional consumption simulator with phase-based consumption patterns → System continuously monitors stock levels → Items consumed automatically every 15 seconds based on flight phase (boarding/climb/cruise/descent) and item category → Automatic alert generated when item crosses threshold (e.g., 15% remaining) → Alert displays in notification center with sound → Crew acknowledges alert → Adjusts service strategy → Sells/serves items → System auto-decrements → Critical alert generated if item fully depleted → Generates restocking report for ground crew
- **Success criteria**: 95% inventory accuracy without manual counting; 15% reduction in unused perishables; 10% increase in duty-free sales through targeted recommendations; 100% of low-stock situations detected before depletion; crew notified of inventory issues within 2 seconds of threshold breach; realistic consumption simulation accurately reflects real-world usage patterns across all flight phases

### Incident & Safety Reporting
- **Functionality**: Digital incident logging with photo capture, structured data fields, automatic timestamp/location tagging, and priority escalation
- **Purpose**: Replaces paper-based reporting, ensures consistent documentation, enables rapid response to safety issues, and creates analyzable safety data
- **Trigger**: Crew identifies safety concern, medical incident, disruptive passenger, or equipment malfunction
- **Progression**: Crew taps "Report Incident" → Selects incident type → Fills structured form with voice-to-text option → Attaches photos → Assigns severity → Submits → Auto-routes to flight deck/ground ops → Receives acknowledgment
- **Success criteria**: 60% reduction in incident report completion time; 100% digital submission within 5 minutes of incident; elimination of lost/incomplete paper reports

### Crew Coordination Hub
- **Functionality**: Real-time crew-to-crew messaging, task assignment, service phase coordination, and shift handover documentation
- **Purpose**: Reduces miscommunication, distributes workload efficiently, and ensures seamless coordination across cabin zones and crew shifts
- **Trigger**: Crew needs to communicate with colleagues, delegate task, or coordinate service timing
- **Progression**: Crew opens coordination panel → Views team status and locations → Sends task assignment or message → Recipient receives notification → Completes task → Confirms completion → System logs activity
- **Success criteria**: 50% reduction in missed task handoffs; improved Crew Effort Score through better workload distribution; faster turnaround through coordinated cabin prep

### Offline-First Sync Engine
- **Functionality**: All core features function without connectivity; data queues locally and syncs automatically when connection restored
- **Purpose**: Ensures operational continuity during satellite black spots, maintaining crew trust in the platform regardless of network status
- **Trigger**: Connection drops during flight; crew continues normal operations; connection restores
- **Progression**: Connectivity lost → Visual indicator shows offline mode → Crew continues using all features → Data queues locally → Connection restores → Auto-sync begins → Confirmation shown
- **Success criteria**: Zero loss of functionality during offline periods; 100% data integrity after sync; sync completion within 30 seconds of reconnection

### Real-Time Alert System
- **Functionality**: Priority-based notification system for critical cabin events with customizable sound alerts and visual indicators; integrated with automated alert generation from cabin sensor data and passenger events
- **Purpose**: Ensures immediate crew awareness of safety issues, medical emergencies, equipment failures, and passenger needs requiring urgent attention through proactive monitoring and automated detection
- **Trigger**: Critical event occurs in cabin (smoke detected via sensors, medical emergency via passenger call, equipment malfunction via system diagnostics, cabin environment anomalies, passenger compliance issues)
- **Progression**: Sensor detects anomaly OR Passenger event triggers → Alert automatically generated with appropriate priority → Alert rules engine evaluates severity → Sound notification plays → Visual badge appears on bell icon → Toast notification displays → Crew opens alert center → Reviews details and action requirements → Acknowledges alert → Takes appropriate action → Resolution logged
- **Success criteria**: 100% alert delivery within 2 seconds of event; distinct sound patterns for different priority levels; zero missed critical alerts; automated generation from sensor data with <1% false positive rate; crew can acknowledge/dismiss alerts; historical alert log maintained; sensor-to-alert latency under 3 seconds

### Automated Alert Generation
- **Functionality**: Intelligent alert system that continuously monitors cabin sensor data (temperature, smoke, pressure, oxygen, galley equipment, IFE systems, doors), passenger events (call buttons, medical alerts, seatbelt violations), and inventory levels to automatically generate contextual alerts
- **Purpose**: Reduces crew cognitive load by eliminating manual observation requirements; enables proactive issue detection before problems escalate; ensures consistent monitoring across all cabin systems and supply levels
- **Trigger**: Continuous background monitoring checks sensor readings every 10 seconds; passenger event handlers fire on button press/system event; inventory monitor evaluates stock levels on every quantity change
- **Progression**: Sensor reading exceeds threshold OR Passenger event occurs OR Inventory crosses threshold → Alert generation engine evaluates conditions → Alert created with category (safety/medical/equipment/passenger/service), priority (critical/high/medium/low), location, and recommended actions → Alert dispatched to notification system → Crew receives alert via sound + visual + toast → Crew responds
- **Success criteria**: All sensor anomalies generate alerts within 3 seconds; passenger events trigger alerts within 1 second; inventory alerts trigger immediately upon threshold breach; alert messages include specific location and actionable guidance; 95%+ crew satisfaction with alert relevance and timing; measurable reduction in incident discovery time

### Visual Consumption Analytics
- **Functionality**: Comprehensive analytics dashboard with real-time tracking of inventory consumption patterns, trend visualization, category breakdowns, flight phase analysis, and AI-powered predictive insights; automatically tracks all inventory changes and builds historical consumption data for analysis
- **Purpose**: Enables data-driven inventory optimization, identifies consumption patterns across flight phases, predicts stock depletion, surfaces surplus inventory, and provides actionable recommendations for future flight planning; helps optimize aircraft loading and reduce waste
- **Trigger**: Automatically runs in background tracking all inventory changes; crew accesses analytics dashboard via dedicated tab; consumption data persists between sessions
- **Progression**: Crew opens Analytics tab → Views summary statistics (total consumed, active categories, items tracked, current phase) → Explores trend charts showing cumulative consumption over time → Reviews category distribution via pie charts and top consumed items → Analyzes consumption patterns by flight phase with bar charts and breakdowns → Reviews AI-generated predictive insights (depletion warnings, surplus alerts, optimization suggestions) with severity indicators → Crew uses insights to adjust service strategy or plan future flights
- **Success criteria**: 100% of inventory changes tracked automatically; consumption data visualized within 1 second of tab access; trend analysis available for all consumed items; predictive insights accuracy >85%; crew can identify consumption patterns and optimize loading decisions; measurable reduction in inventory waste and stockouts on future flights

## Edge Case Handling

- **Emergency Situations** - Critical safety alerts override all other notifications with distinct visual/audio signals; emergency protocols accessible within two taps
- **Multi-Crew Conflicts** - Optimistic locking with last-write-wins for most fields; conflict resolution UI for critical data like incident reports
- **Device Failure** - Data persists locally; seamless handoff to backup device using crew credentials; no work lost
- **Passenger Privacy** - Sensitive passenger data encrypted; access logs maintained; automatic session timeout after 3 minutes of inactivity
- **Language Support** - Interface supports multiple crew languages with instant switching; critical alerts shown in crew's preferred language
- **Connectivity Degradation** - Automatic quality-of-service adjustment; reduces data sync frequency and image resolution to maintain core functionality
- **Regulatory Compliance** - All features designed to meet aviation safety regulations; audit trails for all safety-critical actions

## Design Direction

The design should evoke **confidence, clarity, and control** in a high-pressure professional environment. Crew must feel that this is a reliable, authoritative tool that enhances their expertise rather than adds complexity. The interface should communicate **precision engineering** while remaining approachable—reflecting Airbus's aerospace heritage with a modern, human-centered softness. Visual elements should suggest **connectivity and systems thinking**, reinforcing that the cabin is now an intelligent, networked environment. Above all, the design must project **calm under pressure**, with clear information hierarchy and status indicators that allow instant comprehension even during turbulent or emergency situations.

## Color Selection

The color scheme draws inspiration from aerospace instrumentation—trustworthy, high-contrast, and optimized for quick recognition under varying lighting conditions (bright cabin vs. dimmed service periods).

- **Primary Color**: `oklch(0.35 0.15 250)` - Deep aerospace blue that conveys authority, trust, and technical precision; represents Airbus brand heritage and aviation professionalism
- **Secondary Colors**: 
  - `oklch(0.88 0.05 250)` - Soft sky blue for secondary actions and non-critical information areas
  - `oklch(0.25 0.02 250)` - Deep charcoal for cards and elevated surfaces, providing subtle depth
- **Accent Color**: `oklch(0.75 0.20 145)` - Vibrant teal/cyan for interactive elements, CTAs, and active states; suggests connectivity and digital systems
- **Status Colors**:
  - Success: `oklch(0.70 0.18 145)` - Affirming green for completed tasks and normal operations
  - Warning: `oklch(0.80 0.18 65)` - Amber for attention-required states and low-priority alerts
  - Critical: `oklch(0.65 0.24 25)` - Aviation red for urgent issues and safety alerts
- **Foreground/Background Pairings**:
  - Primary Blue (oklch(0.35 0.15 250)): White text (oklch(0.98 0 0)) - Ratio 9.2:1 ✓
  - Accent Teal (oklch(0.75 0.20 145)): Deep charcoal text (oklch(0.20 0.02 250)) - Ratio 8.5:1 ✓
  - Background (oklch(0.96 0.01 250)): Foreground text (oklch(0.20 0.02 250)) - Ratio 12.8:1 ✓
  - Card surface (oklch(1 0 0)): Muted text (oklch(0.50 0.02 250)) - Ratio 6.1:1 ✓

## Font Selection

Typography must balance technical precision with human approachability, maintaining excellent legibility under cabin lighting conditions while projecting professional authority.

- **Primary Typeface**: **Inter** - A highly legible, modern sans-serif optimized for screens with excellent hinting at small sizes; conveys clarity and technical precision without feeling cold
- **Accent Typeface**: **JetBrains Mono** - Used sparingly for system codes, reference numbers, and technical identifiers to distinguish system data from content

**Typographic Hierarchy**:
- H1 (Screen Titles): Inter Semibold / 32px / -0.02em letter-spacing / line-height 1.2
- H2 (Section Headers): Inter Semibold / 24px / -0.01em letter-spacing / line-height 1.3
- H3 (Card Titles): Inter Medium / 18px / 0em letter-spacing / line-height 1.4
- Body (Primary Content): Inter Regular / 16px / 0em letter-spacing / line-height 1.6
- Body Small (Supporting Text): Inter Regular / 14px / 0em letter-spacing / line-height 1.5
- Caption (Metadata): Inter Medium / 12px / 0.01em letter-spacing / line-height 1.4 / uppercase
- Technical (Codes/IDs): JetBrains Mono Medium / 14px / 0em letter-spacing

## Animations

Animations should reinforce system responsiveness and state changes without delaying crew actions—every transition must feel instantaneous and purposeful, like precision instrumentation. Use animations to communicate status changes (data syncing, alerts arriving, tasks completing) and to guide attention during critical moments. Transitions between views should use smooth, physics-based motion that suggests the connected nature of the system—information flowing between cabin zones and data layers. Loading states should use subtle, professional skeleton screens and progress indicators rather than playful spinners. Alert animations must escalate appropriately: gentle pulses for information, moderate motion for warnings, and insistent but not jarring animation for critical safety alerts.

## Component Selection

- **Components**: 
  - Navigation: Tabs component for main feature areas (Dashboard, Passengers, Inventory, Reports, Crew, Analytics)
  - Status Display: Card components with Badge overlays for cabin zone status; Alert components for notifications
  - Data Entry: Form components with Input, Select, Textarea, and Checkbox for incident reporting and logging
  - Passenger Search: Command component for quick passenger lookup; Dialog for detailed passenger profiles
  - Actions: Button components with clear hierarchy (primary for safety-critical, secondary for routine actions, ghost for tertiary)
  - Lists: Table component for inventory; custom Card-based lists for passengers and incidents
  - Feedback: Toast notifications (via Sonner) for confirmations; Progress bars for sync status
  - Media: Avatar for crew and passenger profiles; inline image upload for incident photos
  - Charts: Recharts library for consumption analytics (LineChart for trends, BarChart for phase analysis, PieChart for category distribution)

- **Customizations**: 
  - Custom cabin seat map visualization using SVG and interactive zones
  - Real-time sync status indicator in navigation header with animated sync icon
  - Priority-coded incident cards with left border accent matching severity
  - Inventory level visualizations with Progress components and color thresholds
  - Offline mode banner with persistent visibility and manual sync trigger

- **States**:
  - Buttons: Distinct disabled state with reduced opacity; loading states show inline spinner; destructive actions use red primary for confirmation
  - Form Inputs: Clear focus rings; validation states inline with colored icons; error messages appear immediately below fields
  - Cards: Hover states with subtle elevation increase; active/selected states with accent border; disabled cards have reduced opacity and pointer-events-none
  - Lists/Tables: Hover rows with background color shift; selected rows with accent background; empty states with helpful guidance

- **Icon Selection**: 
  - Phosphor icons throughout for consistency
  - Navigation: House (Dashboard), Users (Passengers), Package (Inventory), Warning (Reports), UsersFour (Crew), ChartBar (Analytics)
  - Actions: Plus (Add), MagnifyingGlass (Search), PaperPlaneRight (Send), CheckCircle (Complete), X (Close/Cancel)
  - Status: WifiHigh/WifiSlash (Connectivity), CloudArrowUp (Syncing), WarningCircle (Alert), CheckCircle (Success)
  - Cabin: Seat, FirstAid, ForkKnife, ShoppingCart, Bell
  - Analytics: TrendUp (Trends), Lightbulb (Insights), Clock (Phases), ChartBarHorizontal (Charts)

- **Spacing**: 
  - Container padding: px-6 py-4 for main content areas; px-4 py-3 for cards
  - Component gaps: gap-6 for major sections; gap-4 for related groups; gap-2 for tight associations
  - Margins: mb-6 between major sections; mb-4 between subsections; mb-2 for label-to-input
  - Grid layouts: grid with gap-4 for card grids; gap-3 for dense lists

- **Mobile**: 
  - Single-column layouts with full-width cards
  - Bottom sheet navigation replacing side tabs
  - Larger touch targets (min 44px) for all interactive elements
  - Simplified cabin map with collapsible zones
  - Sticky action buttons at bottom of screen for critical actions
  - Reduced data density in tables (show fewer columns, expand on tap for details)
