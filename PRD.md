# PocketHost - Visual No-Code Web Project Platform

A visual, no-code platform for creating, managing, and hosting personal web projects with an embedded local server, mobile access point publishing capabilities and project import/export capabilities.

**Experience Qualities**:
1. **Empowering** - Non-technical users feel capable of creating and managing professional web projects without coding knowledge
2. **Intuitive** - Visual interfaces and drag-and-drop interactions make complex operations feel simple and discoverable
3. **Reliable** - Projects persist locally, work offline, and provide confidence through clear feedback and safe operations

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This application requires sophisticated state management across multiple projects, a visual builder interface, import/export functionality, mobile access point server management, and comprehensive CRUD operations across different data models.

## Essential Features

### Project Management Dashboard
- **Functionality**: Central hub displaying all user projects with metadata, online/offline status indicators, published URLs, bulk operations toolbar, and quick actions with multi-select checkboxes
- **Purpose**: Provides comprehensive overview with powerful filtering and bulk management capabilities
- **Trigger**: App launch or "Home" navigation
- **Progression**: View project grid → Filter by status (All/Online/Offline/Archived) → Select multiple projects with checkboxes → Apply bulk operations (Enable/Disable Server, Publish/Unpublish) → Or access individual quick menu (Edit/Duplicate/Export/Archive/Delete) → View published URLs directly on cards → Copy URLs to clipboard → Confirm actions → Update view
- **Success criteria**: Users can view, filter, bulk manage, and perform actions on 10+ projects within seconds; online projects show published URLs with copy functionality; offline/online status clearly visible with color-coded badges

### Visual Project Builder
- **Functionality**: No-code interface for building web pages using pre-built components with drag-and-drop reordering, rich text editing, full customization, scrollable canvas, and HTML import
- **Purpose**: Enables creation without technical knowledge
- **Trigger**: "New Project" or "Edit Project" button
- **Progression**: Open builder → Select template/blank canvas → Add components from sidebar or import HTML → Configure properties with rich textarea editors → Reorder with arrows → Preview inline or open in new tab → Download HTML → Toggle server → Save
- **Success criteria**: Complete functional page created in under 5 minutes without code, with ability to reorder, fully customize with multi-line text areas, import external HTML, preview in browser, download as standalone HTML, and view scrollable content

### Component Library & Templates
- **Functionality**: Pre-built UI components (headers, text blocks, images, videos, buttons, cards, tables with CSV import/export and inline editing, forms, galleries, custom HTML, footers) and complete page templates with full editing capabilities, multi-line text support, undo/redo functionality, and copy/paste with keyboard shortcuts
- **Purpose**: Accelerate project creation and ensure quality designs with professional table editing capabilities
- **Trigger**: Access from builder sidebar or template gallery
- **Progression**: Browse components → Select → Auto-add to canvas → Configure with large textarea/input editors or table editor → Customize alignment, styles, content with proper scrolling → Reorder position → Copy/paste components → Undo/redo changes → Preview
- **Success criteria**: 11+ fully editable components available with rich configuration options including resizable text areas for long content, style selectors, URL inputs, proper vertical scrolling in edit mode, table component with CSV import/export and inline cell editing, full undo/redo history (Ctrl+Z/Ctrl+Y), and component copy/paste (Ctrl+C/Ctrl+V) with keyboard shortcuts including Delete key

### Table Editor Component
- **Functionality**: Interactive table component with inline cell editing, CSV import from file or paste, CSV export, row/column management (add, delete, reorder), keyboard navigation (Tab, Enter, Escape), and visual editing interface
- **Purpose**: Enable users to create and manage structured data tables without code
- **Trigger**: Add "Table" component from sidebar
- **Progression**: Add table → Click cells to edit inline → Use Tab/Enter to navigate → Import CSV data via upload or paste → Add/remove rows and columns → Reorder with arrow buttons → Export to CSV → Preview formatted table
- **Success criteria**: Users can create tables, edit cells inline with keyboard navigation, import CSV files (drag-drop or paste), export to CSV, add/remove/reorder rows and columns, and see properly formatted tables in preview mode

### Undo/Redo System
- **Functionality**: Full history tracking of all component changes with unlimited undo/redo operations; keyboard shortcuts (Ctrl+Z for undo, Ctrl+Y/Ctrl+Shift+Z for redo); visual indicators showing undo/redo availability
- **Purpose**: Allow safe experimentation without fear of losing work; enable quick recovery from mistakes
- **Trigger**: Make any change to components, use keyboard shortcuts, or click undo/redo toolbar buttons
- **Progression**: Make changes → Press Ctrl+Z to undo → Press Ctrl+Y to redo → See visual feedback in toolbar → History persists during editing session
- **Success criteria**: All component operations (add, delete, edit, move, reorder) can be undone and redone; keyboard shortcuts work reliably; undo/redo buttons show enabled/disabled state; changes tracked accurately without performance degradation

### Component Copy/Paste & Keyboard Shortcuts
- **Functionality**: Copy components with Ctrl+C, paste with Ctrl+V, delete with Delete key; duplicate components with button; visual selection indicator showing selected component; keyboard shortcuts panel in sidebar showing all available shortcuts
- **Purpose**: Speed up workflow with familiar keyboard patterns; enable quick component duplication
- **Trigger**: Select component by clicking, use keyboard shortcuts
- **Progression**: Click component to select → Press Ctrl+C to copy → Press Ctrl+V to paste duplicate → Press Delete to remove → Use duplicate button for quick copy → View keyboard shortcuts reference in sidebar
- **Success criteria**: Keyboard shortcuts work reliably (Ctrl+C/V/Z/Y, Delete); selected component highlighted with ring border; pasted components get unique IDs; shortcuts panel visible in sidebar; copy/duplicate buttons available in component toolbar

### Project Import/Export System
- **Functionality**: Import projects from URLs, HTML files, JSON files, or direct HTML paste; export projects as JSON or standalone HTML files; clone external websites from URLs; comprehensive import dialog with multiple methods
- **Purpose**: Project portability, backup, sharing, external content import, and standalone deployment
- **Trigger**: "Import" button on dashboard, "Import HTML" in builder, or "Export" in project menu
- **Progression**: Import: Click Import → Choose method (URL/File Upload/HTML Paste/JSON Paste) → Enter URL or upload file or paste content → Parse content → Convert to components → Confirm → Add to projects | Export: Select project → Choose format (JSON/HTML) → Download package
- **Success criteria**: Successfully import from URLs (JSON/HTML), file uploads (.json/.html), pasted HTML/JSON; export projects as JSON or standalone HTML; parse HTML into editable components; download fully functional standalone websites

### Server & Access Point Management
- **Functionality**: Configure and manage local development server; create mobile access point with custom name and password; toggle server on/off; publish/unpublish projects to network; real-time server status checking; generate and copy published URLs; view connection instructions; bulk operations for multiple projects simultaneously; SSL/HTTPS configuration with auto-generated certificates or custom paths; usage metrics tracking (requests, bandwidth, activity logs); dark mode theme toggle
- **Purpose**: Enable local development server hosting, mobile device access via network, secure connections via SSL, performance monitoring, and efficient management of multiple project servers with theme customization
- **Trigger**: "Server" button in project builder toolbar, Dashboard bulk actions, or theme toggle button
- **Progression**: Individual: Open server settings → Enable server toggle → Configure access point name → Set port number → Enter password → Enable SSL/HTTPS (optional) → Choose auto-generate or provide cert/key paths → Toggle publish → View published URL (http/https based on SSL) → View usage metrics (requests, bandwidth, last accessed) → Check recent activity logs → Copy URL to clipboard → Check server status → Save settings | Bulk: Select multiple projects on Dashboard → Click "Bulk Actions" → Choose operation (Enable/Disable Server, Publish/Unpublish) → Confirm → All selected projects updated simultaneously | Theme: Click sun/moon icon to toggle between light and dark mode
- **Success criteria**: Server can be enabled/disabled; access point configurable with name, port, password; SSL can be enabled with auto-generated self-signed certificates or custom certificate paths; published URLs use correct protocol (http/https); publish toggle makes project accessible; status indicator shows online/offline/checking states; published URL displayed on project cards and copyable; usage metrics display total requests, bandwidth used, last accessed time; recent activity log shows last 5 requests with method, path, and bytes transferred; settings persist with project; visual indicators show server and publish status in project builder header and dashboard cards; bulk operations can manage 5+ projects simultaneously with single action; theme preference persists across sessions and applies globally

### Dashboard Filtering & Bulk Operations
- **Functionality**: Filter projects by status (All/Online/Offline/Archived); multi-select projects with checkboxes; bulk server operations menu; "Select all" toggle; visual selection count; published URL display on project cards with copy button; usage metrics preview (requests and bandwidth) on published project cards; theme toggle for light/dark mode
- **Purpose**: Provide quick visibility of project statuses, performance metrics, and enable efficient bulk management of server settings across multiple projects with customizable theme
- **Trigger**: Click filter tabs on Dashboard, select project checkboxes, use "Select all" toggle, or click theme toggle button
- **Progression**: View Dashboard → Toggle theme (sun/moon icon) → Click filter tab (All/Online/Offline/Archived) → View filtered projects → Check checkboxes to select multiple → View selection count → Click "Bulk Actions" dropdown → Choose operation (Enable Server/Disable Server/Publish/Unpublish) → Projects updated with single action → View published URLs on online project cards → View usage metrics (requests/bandwidth) → Click copy icon to copy URL
- **Success criteria**: Filter tabs show accurate project counts; Online tab shows only projects with enabled servers and published status; Offline tab shows projects without servers or unpublished; checkboxes select/deselect projects; bulk actions execute on all selected projects; published URLs visible on project cards with working copy functionality; usage metrics (requests count, bandwidth in KB) displayed on published project cards; selection cleared after bulk operation; visual feedback (toasts) confirm actions; theme toggle switches between light and dark mode with persistent preference

### Real-Time Collaborative Editing
- **Functionality**: Multiple users can view who else is editing a project in real-time; presence indicators show active users with avatars; automatic session management with user activity tracking; version tracking for synchronization
- **Purpose**: Enable team collaboration, provide awareness of concurrent editing, prevent conflicts
- **Trigger**: Open project in builder, view "Collab" tab in sidebar
- **Progression**: Open project → Join collaborative session → See list of active users with avatars → View user presence indicators → Real-time updates of who's viewing → Leave session when done
- **Success criteria**: Users can see who else is viewing the same project; presence updates every 5 seconds; inactive users removed after 30 seconds; session persists across page refreshes; clear visual indicators of collaboration state

### Client-Side Preview System
- **Functionality**: Client-side preview system that opens projects in new browser tabs using generated HTML; visual status indicators showing preview is active; one-click preview opening; HTML download for external hosting
- **Purpose**: Provide immediate visual feedback of projects, enable testing and sharing, export deployable files
- **Trigger**: "Activate Preview" in project card menu, Server tab in project builder, "Open Preview" button, or "Download HTML" button
- **Progression**: Select project → Activate preview → Visual indicator shows active state → Click "Open Preview" → Browser opens new tab with rendered HTML from blob URL → Download HTML for external deployment → Deactivate preview
- **Success criteria**: Projects can be previewed in-browser with proper styling and scrolling; clear visual feedback with pulsing indicator; one-click opening in new tabs; downloaded HTML files work as standalone websites that can be hosted anywhere

### Project Duplication & Versioning
- **Functionality**: Clone existing projects, create restore points
- **Purpose**: Safe experimentation and project templates
- **Trigger**: "Duplicate" action on project card
- **Progression**: Select project → Click duplicate → Auto-create copy with timestamp → Open in builder
- **Success criteria**: Duplicated project appears immediately with all content preserved

### Media & Asset Management
- **Functionality**: Upload and organize images, videos, documents within projects
- **Purpose**: Centralized asset storage and reuse
- **Trigger**: Media panel in builder or asset library
- **Progression**: Open asset manager → Upload files or drag-and-drop → Auto-organize → Reference in components
- **Success criteria**: Support images, video, common formats; visual thumbnail grid

### HTML Page Import & Parsing
- **Functionality**: Import raw HTML from files or clipboard and automatically parse into editable PocketHost components; convert external page structure into native builder elements
- **Purpose**: Quickly import existing content, learn from other websites, migrate legacy pages
- **Trigger**: "Import HTML" button in project builder sidebar
- **Progression**: Click Import HTML → Upload .html file or paste code → AI/parser analyzes structure → Converts headers, text, images, videos, buttons, custom HTML into native components → Components added to project → Edit freely
- **Success criteria**: Successfully parse HTML files and convert common elements (h1/header → header component, p/section → text component, img → image component, video/iframe → video component, buttons → button component, footer → footer component); unknown HTML preserved as custom HTML component; all imported components fully editable

### Usage Metrics & Bandwidth Monitoring
- **Functionality**: Track and display real-time usage statistics for published projects including total requests, bandwidth consumed, last accessed timestamp, and detailed activity logs with request method, path, and bytes transferred for each request
- **Purpose**: Monitor project performance, understand traffic patterns, manage bandwidth consumption, and provide insights into project usage
- **Trigger**: Publish a project to network, view server settings, or check dashboard cards for published projects
- **Progression**: Publish project → Server tracks metrics automatically → View in server settings (detailed charts and logs) → View summary on dashboard card (requests and bandwidth) → Monitor bandwidth usage with progress bar → Review recent activity log (last 5 requests) → Export metrics for analysis
- **Success criteria**: Accurate tracking of all requests with byte counts; bandwidth usage displayed in human-readable format (B/KB/MB/GB); last accessed timestamp updates on each request; activity log shows method (GET/POST/etc.), path, and bytes transferred; metrics persist with project; bandwidth usage shows percentage and progress bar; metrics visible on dashboard cards for quick overview; detailed view available in server settings

### Dark Mode & Theme System
- **Functionality**: Global theme toggle between light and dark modes with persistent preference; optimized color palettes for both themes; theme toggle available in dashboard header and project builder toolbar; smooth transitions between themes
- **Purpose**: Reduce eye strain in low-light conditions, provide user preference options, improve accessibility, and create a modern, polished interface
- **Trigger**: Click sun/moon icon button in dashboard header or project builder toolbar
- **Progression**: Click theme toggle → Theme switches instantly → Preference saved to local storage → All UI elements adapt colors → Theme persists across page refreshes and sessions → Works in both dashboard and project builder views
- **Success criteria**: Theme toggle button visible and accessible in both main views; instant theme switching without page reload; all components properly styled for both light and dark modes; theme preference persists across sessions; dark mode uses appropriate contrast ratios for readability; smooth color transitions; visual feedback showing current theme (sun icon for light mode, moon for dark mode)

### SSL/HTTPS Configuration
- **Functionality**: Enable secure HTTPS connections for published projects; auto-generate self-signed certificates for development; support custom certificate and private key paths for production; protocol indicator in published URLs (http:// or https://); SSL status displayed in server settings
- **Purpose**: Secure network communications, enable HTTPS-required features (service workers, modern APIs), support production deployments with proper certificates
- **Trigger**: Enable SSL toggle in server settings dialog
- **Progression**: Open server settings → Enable server → Toggle SSL/HTTPS switch → Choose auto-generate self-signed cert OR provide custom cert/key paths → Save settings → Published URL shows https:// protocol → Projects accessible via HTTPS
- **Success criteria**: SSL can be enabled/disabled independently; auto-generated certificates work for local development; custom certificate paths accepted and validated; published URLs correctly show http:// or https:// based on SSL setting; SSL status clearly indicated in UI; certificates persist with project settings; bulk operations respect SSL settings when publishing

## Edge Case Handling

- **Empty State** - Show welcoming onboarding with "Create First Project" CTA and template suggestions
- **Import Failures** - Validate file format before import, show specific error messages, suggest corrections
- **Storage Limits** - Monitor KV storage size, warn at 80%, provide export/archive options before limit
- **Duplicate Names** - Auto-append timestamps or numbers to prevent naming conflicts
- **Incomplete Projects** - Save drafts automatically, show last-edited timestamp, allow safe deletion
- **Lost Work Prevention** - Auto-save every 30 seconds, confirmation dialogs on destructive actions
- **Mobile Responsiveness** - Simplified builder interface on mobile, focus on project management over editing

## Design Direction

PocketHost should feel like a **premium developer tool meets creative studio** - professional yet approachable, powerful yet elegant. The design should inspire confidence through precision while remaining inviting to non-technical users. Think of a sophisticated control center with warm, human touches.

## Color Selection

A tech-forward palette with deep purples and vibrant accents, conveying both technical capability and creative energy.

- **Primary Color**: Deep Electric Purple `oklch(0.45 0.25 285)` - Represents innovation and technical sophistication, used for primary actions and brand elements
- **Secondary Colors**: 
  - Charcoal `oklch(0.25 0.01 270)` - Technical foundation, used for text and structure
  - Soft Slate `oklch(0.92 0.01 270)` - Subtle backgrounds and containers
- **Accent Color**: Vibrant Cyan `oklch(0.70 0.18 195)` - Attention-grabbing highlight for CTAs, success states, and active elements
- **Foreground/Background Pairings**:
  - Primary Purple `oklch(0.45 0.25 285)`: White text `oklch(0.98 0 0)` - Ratio 7.2:1 ✓
  - Accent Cyan `oklch(0.70 0.18 195)`: Charcoal text `oklch(0.25 0.01 270)` - Ratio 8.5:1 ✓
  - Background `oklch(0.98 0.01 270)`: Charcoal text `oklch(0.25 0.01 270)` - Ratio 14.1:1 ✓
  - Card `oklch(1 0 0)`: Foreground `oklch(0.25 0.01 270)` - Ratio 15.2:1 ✓

## Font Selection

Typography should balance technical precision with creative accessibility - clear and modern with distinctive character.

- **Primary Font**: **Space Grotesk** - Geometric sans with technical aesthetic, perfect for UI labels and headings
- **Secondary Font**: **JetBrains Mono** - For code snippets, URLs, and technical data display

**Typographic Hierarchy**:
- H1 (Page Titles): Space Grotesk Bold / 32px / -0.02em letter spacing / 1.2 line height
- H2 (Section Headers): Space Grotesk SemiBold / 24px / -0.01em / 1.3
- H3 (Card Titles): Space Grotesk Medium / 18px / normal / 1.4
- Body (UI Text): Space Grotesk Regular / 15px / normal / 1.5
- Small (Metadata): Space Grotesk Regular / 13px / normal / 1.4
- Code (URLs, Technical): JetBrains Mono Regular / 14px / normal / 1.5

## Animations

Animations should feel **snappy and purposeful** - quick transitions that guide attention without delay. Use motion to reinforce hierarchy and spatial relationships, with smooth physics-based easing. Key moments: card hover lifts (scale 1.02, 200ms), page transitions (slide 300ms), server status pulse (subtle glow), drag-and-drop feedback (ghost + snap), success confirmations (subtle bounce 250ms).

## Component Selection

- **Components**:
  - **Card**: Primary container for project cards with hover states, used extensively with custom gradient borders
  - **Button**: All CTAs and actions, with variant="default" for primary, variant="outline" for secondary
  - **Dialog**: Project creation, import wizards, confirmation modals
  - **Input** + **Label**: Form fields in wizards and configuration panels
  - **Tabs**: Switch between different views (All Projects / Templates / Archived)
  - **DropdownMenu**: Quick actions menu on project cards
  - **Badge**: Project status indicators (Live, Draft, Archived)
  - **Progress**: Import/export operations, server startup, access point configuration
  - **Separator**: Visual section breaks in sidebars and forms
  - **ScrollArea**: Template galleries and component libraries
  - **Switch**: Toggle settings (server on/off, auto-save)
  - **Tooltip**: Contextual help on icon buttons
  - **Sonner (Toast)**: Operation feedback (saved, exported, errors)

- **Customizations**:
  - Custom project card with gradient border on hover (purple to cyan)
  - Empty state illustrations using SVG patterns
  - Server status indicator with animated pulse using CSS keyframes
  - Custom drag-and-drop zones with dashed borders and hover effects
  - Template preview cards with frosted glass overlay on hover

- **States**:
  - Buttons: Subtle scale on hover (1.02), active press (0.98), disabled with 40% opacity
  - Cards: Lift shadow on hover, border glow on selection, subtle scale
  - Inputs: Focus ring with accent color, error state with destructive color
  - Server toggle: Animated background color transition, icon rotation

- **Icon Selection**:
  - **Plus** - Create new project
  - **FolderOpen** - Project management
  - **Download** - Import/Export
  - **Play** - Start server / Preview
  - **Copy** - Duplicate project
  - **Trash** - Delete
  - **Gear** - Settings
  - **Eye** - Preview
  - **Package** - Templates
  - **Upload** - File uploads
  - All from @phosphor-icons/react with consistent weight

- **Spacing**:
  - Container padding: p-6 (24px)
  - Card gaps: gap-6 for grid layouts
  - Form field spacing: space-y-4 (16px)
  - Section margins: mb-8 (32px)
  - Button padding: px-6 py-3
  - Tight groups: gap-2 (8px)

- **Mobile**:
  - Grid: 1 column on mobile, 2 on tablet (md:), 3 on desktop (lg:)
  - Hide builder on mobile, show "Edit on desktop" message
  - Simplified project cards with vertical layout
  - Bottom navigation bar for primary actions
  - Drawer instead of sidebar for mobile menus
  - Touch-friendly hit targets (min 44px)
