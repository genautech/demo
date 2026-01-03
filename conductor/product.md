# Product Context

## Overview
Yoobe Corporate Store is a management system for corporate stores, integrated with a mock storage layer (simulating Spree Commerce) for employee engagement, swag distribution, and inventory management. The system is fully localized in Portuguese (PT-BR) with dynamic currency naming capabilities.

## Goals
- Provide a centralized dashboard for corporate store management.
- Manage products, orders, budgets, companies, and stores in a multi-tenant environment.
- Facilitate product replication between base catalogs and company-specific stores.
- Support user onboarding, authentication, and gamification (Sistema de Pontos Dinâmicos).
- Enable gestores to customize currency names for their stores.
- Provide comprehensive user management with bulk import capabilities.
- Deliver visual dashboards with interactive charts for better engagement.

## Core Features
- **Dashboard**: Real-time overview of store performance and gamification.
- **Inventory & Swag Track**: Managed stock with replication logic.
- **Send Gifts**: Scheduled shipment system for team members.
- **Auditing**: Comprehensive Replication Logs.
- **Gamification**: Multi-level loyalty system (Sistema de Pontos).

## Navigation & Layout
- **Sidebar Navigation**: Unified lateral sidebar menu across all roles (Super Admin, Manager, Member).
  - Collapsible sidebar with icon-only mode for space efficiency.
  - Role-based navigation items filtered by user permissions.
  - Gamification section integrated into sidebar with user stats and achievements.
  - **Menu Consolidation**: Duplicate menu items removed, all items in Portuguese (PT-BR).
  - **Translation**: All navigation items translated to Portuguese (e.g., "Sitemap" → "Mapa do Site").
- **Layout Standard**: All pages must use `PageContainer` component for consistent centering and responsive padding.
  - Default max-width: `7xl` (1280px).
  - Responsive padding: `px-4 sm:px-6 lg:px-8 py-4 sm:py-6`.
  - Content automatically centered with `mx-auto`.
  - **IMPORTANT**: Never use `AppShell` directly in pages - it's already provided by layouts. Using it causes duplicate menus.
  - **Verification**: All 52 pages have been audited (2025-12-30) - no duplicate menus found.
  - **Exception**: Pages in `/loja/*` route use `AppShell` directly because `app/loja/layout.tsx` does not provide it.
- **Send Gifts Access**: Available only for Manager and Super Admin roles (not for Members).
  - Route: `/gestor/send-gifts`
  - Includes WOW experience with full tracking timeline and dispatch information.
  - Integrated with Swag Track for visual identification of gift shipments.

## Catalog System Architecture

### Master Catalog (BaseProducts)
- **Purpose**: Global product catalog - single source of truth for all products
- **Storage**: `yoobe_base_products_v3` in localStorage
- **Auto-Seeding**: `ensureBaseProductsSeeded()` automatically recovers from empty/corrupted state
- **Access**: Available for import in `/gestor/catalog/import`
- **Key Functions**:
  - `getBaseProducts()`: Returns all base products
  - `getBaseProductById(id)`: Get specific base product
  - `ensureBaseProductsSeeded()`: Ensures catalog is never empty

### Company Catalog (CompanyProducts)
- **Purpose**: Company-specific products replicated from master catalog
- **Storage**: `yoobe_company_products_v3` in localStorage
- **Replication**: Products are cloned from BaseProducts with company-specific pricing and stock
- **Access**: Company catalog visible in `/gestor/catalog`
- **Key Functions**:
  - `getCompanyProductsByCompany(companyId)`: Get all products for a company
  - `getCompanyProductById(id)`: Get specific company product
  - `replicateProduct(baseProductId, companyId, overrides)`: Clone base product to company

### Budget & Replication Flow
1. **Import**: Select products from master catalog (`/gestor/catalog/import`)
2. **Budget Creation**: Create budget with selected products → status `submitted`
3. **Approval**: Approve budget → status `approved`
4. **Release**: Release budget for replication → status `released`
5. **Replication**: Call `/api/replication` with `budgetId` → creates CompanyProducts + logs → status `replicated`
6. **Catalog**: Products appear in `/gestor/catalog` for company

### Product Details
- **Route**: `/gestor/catalog/[id]`
- **Features**:
  - View complete product information
  - Edit: price (R$), points cost, stock quantity, active status
  - View base product reference
  - Image gallery
  - Product metadata (SKU, category, dates)

### Replication Logs
- **Route**: `/gestor/catalog/replication-logs`
- **Features**:
  - Complete audit trail of replication operations
  - Shows: created, updated, skipped, failed counts
  - Links to budgets and base products
  - Company-specific filtering (from `yoobe_auth`)

## Authentication & Demo Users
- **Demo Mode**: Uses seeded users from `lib/storage.ts` for demonstration
- **User Mapping**:
  - `superAdmin` → `spree_user_4` (Ana Oliveira)
  - `manager` → `spree_user_1` (João Silva)
  - `member` → `spree_user_3` (Pedro Costa)
- **Validation**: Pages redirect to login if user is not found
- **Storage**: User data stored in `yoobe_auth` localStorage key
- **Never Use**: `spree_user_demo` - this user doesn't exist in storage

## Storefront & Member Experience
- **Product Listing**: `/loja` shows eligible products using `getEligibleProducts(user, companyId)`
  - Dynamic currency display using `getCurrencyName(companyId, true)`
  - All prices and balances shown with configured currency name
  - **Demo Products**: 8 demo products are automatically included when no eligible products exist
    - Stored in `lib/demo-products.ts` for centralized access
    - Includes: Mochila Executiva, Garrafa Térmica, Kit Papelaria, Camiseta, Jaqueta, Mousepad, Caneca, Boné
- **Product Details**: `/loja/produto/[id]` supports CompanyProducts (V3), Products (V2), and DemoProducts
  - **Search Flow**: CompanyProduct (IDs starting with `cp_`) → Product V2 → DemoProduct
  - Falls back to demo products when company/base products not found
  - Normalizes fields for consistent display across all product types
  - Currency name displayed dynamically
  - Tags are only queried for company/base products (demo products have no tags)
  - Full cart integration works for all product types
- **Checkout**: `/loja/checkout` works with both V3 and V2 products
  - Validates stock before creating order
  - Deducts stock from CompanyProduct after successful checkout
  - Resolves SKU from appropriate product type
  - All currency references use dynamic currency name
- **Order Tracking**: `/loja/pedido/[id]` and `/membro/pedidos` display products correctly
  - Fetches product images/names from CompanyProducts (V3) or Products (V2)
  - Members can only view their own orders
  - Currency displayed dynamically throughout
- **Image Fallback System**: All product images use `BrandedProductImage` component
  - Automatic fallback to `/placeholder.jpg` when images fail to load
  - Lazy loading enabled for better performance
  - Error state management prevents infinite loops
  - Applied consistently across: product list, details, cart, checkout, and order tracking
  - Layout improvements: responsive padding, better spacing, hover effects, flex-based card structure

## Gamification System
- **Gamification Hub**: Central page for members to track progress, achievements, and rankings.
  - **Route**: `/membro/gamificacao`
  - **Navigation**: Available in member sidebar menu with Trophy icon
  - **Dual Design Modes**:
    - **Standard Mode (Light/Dark)**: Clean corporate layout with professional styling
    - **Fun Mode**: Stitch-inspired dark mode design with vibrant colors and engaging animations
  - **Features**:
    - **Level Progress**: Visual progress indicator with circular progress and level badges
    - **Stats Grid**: 4 key metrics (Total Purchases, Total Spent, Average Order, Global Rank)
    - **Leaderboard**: Podium-style visualization for top 3 users with differentiated colors
      - 1st place: Gold (yellow gradient with glow)
      - 2nd place: Silver (gray gradient)
      - 3rd place: Bronze (orange/amber gradient)
    - **Achievements**: Grid of earned and locked achievements with animations
    - **Recent Activity**: Timeline of recent orders and redemptions
  - **Visual Elements (Fun Mode)**:
    - Dark background (`slate-950/900`) with floating colored particles
    - Glassmorphism cards with backdrop blur
    - Vibrant gradients (yellow → orange → pink) on key elements
    - Smooth animations using `framer-motion`
    - Glow effects on interactive elements
  - **Data Sources**:
    - User level and points from `getUserById()`
    - Orders from `getUserOrders()`
    - Leaderboard from `getUserGamificationStats()`
    - Achievements calculated from order history
    - Currency name from `getCurrencyName(companyId, true)`

## Theme System
- **Tri-State Themes**: Light, Dark, and Fun modes.
  - **Light Mode**: Default professional theme with high contrast.
  - **Dark Mode**: Dark background with light text for reduced eye strain.
  - **Fun Mode**: Sophisticated modern theme with elegant color palette (Deep Cobalt Blue, Aqua Green, Soft Coral Orange), glassmorphism effects, and refined animations.
    - **Color Palette**: 
      - Primary: Deep Cobalt Blue (oklch 0.55 0.18 250)
      - Secondary: Aqua/Mint Green (oklch 0.75 0.15 180)
      - Accent: Soft Coral Orange (oklch 0.7 0.2 45)
    - **Visual Style**: Glassmorphism with backdrop-blur, subtle geometric patterns, elegant gradients
    - **Animations**: Smooth fade-in/slide-up, subtle hover effects (scale 1.02x), professional transitions
    - **Typography**: Gradient text on headings, refined text shadows, optimal letter spacing
    - **Gamification Hub**: Special Stitch-inspired dark mode design with vibrant colors (yellow, orange, pink gradients) and engaging animations when Fun mode is active
  - Theme switcher available in the header for all authenticated users.
  - Fun mode maintains professionalism while being visually engaging and modern.

## Store Settings & Configuration
- **Route**: `/gestor/store-settings`
- **Tabs**:
  - **Funcionalidades**: Toggle features (Swag Track, Send Gifts, Cashback, Achievements)
  - **Resgate**: Configure redemption types (Points, PIX, Free)
  - **Moeda**: Configure currency names (singular and plural)
    - Default: "ponto" (singular) / "pontos" (plural)
    - Preview shows how currency will appear in UI
    - Changes apply system-wide automatically
  - **Gamificação**: Product-specific gamification settings
  - **Aparência**: Link to full appearance editor
- **Storage**: Settings stored per company in `yoobe_store_settings_{companyId}`

## User Management
- **Route**: `/gestor/usuarios`
- **Features**:
  - **User List**: Table with search, filters (tags, level), and sorting
  - **User Actions**: Add points, deduct points, view history, manage tags, edit user
  - **Add User**: Manual form for creating new members
  - **Invite User**: Email invitation system (simulated in demo)
  - **Bulk Import**: CSV/XLSX upload for importing multiple users
  - **Export CSV**: Export user data with all filters applied
- **CSV Import Format**: email, nome/firstname, sobrenome/lastname, telefone/phone (optional)

## Data Export & Reporting
- **CSV Export Available In**:
  - **Orders** (`/gestor/orders`): Export filtered orders with all details
  - **Users** (`/gestor/usuarios`): Export user list with points, level, purchases
  - **Inventory** (`/gestor/estoque`): Export product inventory with stock levels
- **Export Features**:
  - Exports only visible/filtered data
  - Portuguese headers
  - UTF-8 encoding
  - Date-stamped filenames

## Dashboard Visualizations
- **Manager Dashboard** (`/dashboard/manager`):
  - **Line Chart**: Orders over time (last 7 days)
  - **Pie Chart**: Points distribution by user level
  - **Bar Chart**: Top 5 selling products
  - All charts use `recharts` library with theme-aware colors
- **Member Dashboard** (`/dashboard/member`):
  - **Area Chart**: Activity history and points evolution (last 7 days)
  - Progress indicators for level advancement
  - Leaderboard visualization

## Conductor System
- **Purpose**: Automated documentation and specification management system
- **Spec Viewer**: Professional markdown viewer at `/super-admin/conductor` (Super Admin only)
  - **Features**:
    - Professional markdown rendering with `react-markdown` and `remark-gfm`
    - Syntax highlighting for code blocks with `react-syntax-highlighter`
    - Copy-to-clipboard functionality for code snippets
    - Support for tables, checklists, and GitHub Flavored Markdown
    - Smooth animations with `framer-motion`
    - Full Fun Mode support with vibrant colors
  - **API**: `/api/conductor` for secure document access
  - **Automation**: Git hook integration for automatic documentation updates
  - **Gemini Integration**: AI-powered changelog summaries

## Grok AI Integration
- **Purpose**: Advanced AI capabilities for recommendations, insights, and chat
- **Primary Provider**: Grok AI (xAI)
- **Fallback Provider**: Gemini (Google)
- **Core Client**: `lib/grok-api.ts`
  - Centralized client with rate limiting
  - Automatic fallback mechanism
  - Streaming support for real-time responses
- **API Routes**:
  - `/api/demo/ai-enhanced`: Enhanced AI generation with Grok/Gemini toggle
  - `/api/demo/grok-chat`: Real-time chat interface
  - `/api/demo/grok-insights`: Team insights generation
  - `/api/demo/grok-dashboard-insights`: Dashboard analytics
  - `/api/gifts/recommend-enhanced`: Smart product recommendations
- **UI Components**:
  - `GrokChat`: Interactive chat interface with provider toggle
  - `SmartRecommendations`: AI-powered product suggestions
  - `DashboardInsights`: Performance analytics and predictions
  - `AIRecommendationView`: Visual display of AI recommendations
- **Configuration**: Requires `GROK_API_KEY` environment variable

## Approval Workflow System
- **Purpose**: Complete workflow management for orders, budgets, gifts, and requisitions
- **Routes**:
  - `/gestor/aprovacoes`: Main approval management page
  - `/gestor/aprovacoes/regras`: Approval rules configuration
  - `/super-admin/aprovacoes`: Global approval management
- **Features**:
  - Approval rules with conditions (value, quantity, priority, category)
  - Auto-approval for rules that match conditions
  - Bulk actions for batch approvals/rejections
  - Full audit trail with approval history
  - Statistics and analytics for approval performance
- **Request Types**: Order, Budget, Gift, Requisition
- **Priority Levels**: Alta (High), Média (Medium), Baixa (Low)
- **Storage Keys**:
  - `yoobe_approval_requests`: Approval requests
  - `yoobe_approval_rules`: Approval rules configuration
- **Integration**: Dashboard widget for quick approval access