# Tech Stack

## Frameworks & Core
- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + `tailwindcss-animate`
- **UI Components**: Radix UI (base components), shadcn/ui (component library)
- **Icons**: Lucide React
- **Typography**: Inter font (via `next/font/google`)
- **Theme Management**: `next-themes` for tri-state theme switching (Light/Dark/Fun)
- **Sidebar**: `radix-ui/sidebar` (via shadcn/ui) for collapsible lateral navigation
- **Animations**: `framer-motion` for gamification components, theme-specific animations, and interactive UI elements
  - Used extensively in gamification hub for smooth transitions, hover effects, and particle animations
  - Conditional animations based on theme (enhanced in Fun Mode)
- **Markdown Rendering**: `react-markdown` + `remark-gfm` for professional markdown rendering
  - Used in Conductor Spec Viewer for documentation display
  - Supports GitHub Flavored Markdown (tables, checklists, autolinks)
  - Syntax highlighting with `react-syntax-highlighter` for code blocks
  - Copy-to-clipboard functionality for code snippets
- **Data Visualization**: `recharts` for interactive charts and graphs
  - Used in Manager and Member dashboards
  - Line charts for time-series data (orders over time)
  - Pie charts for distribution visualization (points by user level)
  - Bar charts for comparative data (top selling products)
  - Area charts for activity history
  - Fully responsive with theme-aware colors

## Design System
- **Design Reference**: [v0 Dashboard Page - Manager](https://v0.app/chat/dashboard-page-manager-uNsIAgvyYGb?b=v0-preview-b_5A0jGm6CEPG&f=1&path=%2Fdesign-system)
- **Color System**: OKLCH color space for perceptual uniformity and consistent color perception across themes
  - Light mode: High contrast with light backgrounds
  - Dark mode: Dark backgrounds with light text
  - Fun mode: Vibrant OKLCH colors (neon pinks, greens, purples) with higher chroma values
- **Shadows**: Multi-level shadow system (xs, sm, md, lg, xl) with dark mode support
- **Transitions**: Smooth cubic-bezier transitions (150ms) for interactive elements
- **Focus States**: Ring-based focus indicators (3px width)
- **Component Library**: shadcn/ui components with v0-inspired enhancements
- **Layout Components**: `PageContainer` for standardized page content wrapping with responsive padding and centering

## State & Data
- **Framework**: Next.js 16.0.10
- **Language**: TypeScript (Strict Mode)
- **Storage**: lib/storage.ts (305 functions)

## Business Logic Support
- **Inventory Control**: Lógica de reserva e baixa de estoque implementada no lado do servidor (API Routes).
- **Scheduling (Send Gifts)**: Lógica de agendamento e reserva de estoque para envios futuros totalmente implementada.
- **Replication**: Motor de sincronização idempotente entre Base Products e Company Products.
- **Gamification**: Sistema completo de níveis, conquistas e rankings (Sistema de Pontos Dinâmicos)
  - Level progression: Bronze → Silver → Gold → Platinum → Diamond
  - Achievement system: Calculated from order history and user behavior
  - Leaderboard: Top users ranked by points with visual podium in Fun Mode
  - User stats: Real-time progress tracking and gamification metrics
  - **Dynamic Currency System**: Customizable currency names (default: "ponto"/"pontos")
    - Gestores can rename currency in store settings
    - System-wide dynamic currency display via `getCurrencyName()` helper
    - All UI automatically updates when currency is renamed
- **Approval Workflow**: Sistema completo de workflow de aprovações
  - Approval rules with conditions (value, quantity, priority, category)
  - Auto-approval for rules that match conditions
  - Bulk actions for batch approvals/rejections
  - Full audit trail with approval history
  - Statistics and analytics for approval performance

## AI & Intelligence
- **Primary AI Provider**: Grok AI (xAI) via `lib/grok-api.ts`
  - Centralized client with rate limiting and error handling
  - Chat, text generation, and JSON extraction capabilities
  - Streaming support for real-time responses
- **Fallback AI Provider**: Gemini (Google)
  - Automatic fallback when Grok is unavailable
  - Seamless provider switching via `useGrok` parameter
- **AI Features**:
  - Profile generation with AI enhancement
  - Smart product recommendations
  - Dashboard insights and analytics
  - Real-time chat interface (`GrokChat` component)
  - Team performance analysis
- **AI Components**:
  - `GrokChat`: Interactive chat widget with provider toggle
  - `SmartRecommendations`: AI-powered product suggestions
  - `DashboardInsights`: Performance analytics with predictions
  - `AIRecommendationView`: Visual display of AI recommendations

## Development Tools
- **CLI**: Gemini CLI + Conductor Extension.
- **Environment**: Configuração local via `.gemini` para isolamento de contexto.

## Visual Patterns
- **Elevation**: Consistent shadow progression (shadow-sm → shadow-md)
- **Interactions**: Active states with scale-[0.98] for tactile feedback
- **Backdrop Effects**: Modern backdrop-blur for overlays and headers (glassmorphism)
- **Dark Mode**: Full OKLCH color system with proper contrast ratios
- **Gamification Visuals**: 
  - Stitch-inspired dark mode design for Fun Mode
  - Podium-style leaderboard with differentiated colors
  - Floating particle effects
  - Circular progress indicators with gradients
  - Glassmorphism cards with glow effects
