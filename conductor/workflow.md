# Workflow Preferences

## Context-Driven Development
- **Source of Truth**: O Conductor deve sempre consultar o `product.md` antes de propor qualquer mudança na UI ou API.
- **Planning First**: Toda nova feature deve começar com `gemini conductor new track` para gerar um `plan.md`.

## Coding Standards
- **Clean Architecture**: Manter lógica de negócio separada da UI (preferencialmente no `lib/` ou hooks).
- **Type Safety**: Nenhum uso de `any` em novas implementações de tipos para pedidos ou inventário.
- **Idempotency**: Operações de API (especialmente `replication` e `orders`) devem ser seguras para repetição.

## UI/UX Rules
- **Consistency**: Usar exclusivamente componentes do `components/ui` (Shadcn/UI pattern).
- **Feedback**: Todas as ações de escrita devem prover feedback visual (Toast/Sonner).
- **Layout Standard**: **MANDATORY** - Todas as páginas devem usar o componente `PageContainer` como wrapper principal do conteúdo.
  - **NUNCA** usar `<AppShell>` dentro de páginas - o `AppShell` já é fornecido pelos layouts (`app/dashboard/layout.tsx`, `app/gestor/layout.tsx`, etc.).
  - **SEMPRE** importar e usar `PageContainer` de `@/components/page-container`.
  - Exemplo correto:
    ```tsx
    import { PageContainer } from "@/components/page-container"
    
    export default function MyPage() {
      return (
        <PageContainer className="space-y-6">
          {/* conteúdo da página */}
        </PageContainer>
      )
    }
    ```
  - O `PageContainer` garante alinhamento centralizado, padding responsivo e max-width consistente.
  - **Problema Comum**: Usar `AppShell` nas páginas causa menus duplicados e alinhamento incorreto.
- **Markdown Rendering**: **MANDATORY** - Sempre usar `react-markdown` para renderização de conteúdo markdown.
  - **NUNCA** usar `dangerouslySetInnerHTML` ou parsers manuais de markdown.
  - **SEMPRE** usar `react-markdown` com `remark-gfm` para suporte completo a GitHub Flavored Markdown.
  - **Syntax Highlighting**: Usar `react-syntax-highlighter` para blocos de código com temas adaptativos (dark/light).
  - **Copy Functionality**: Implementar botão de copiar em todos os blocos de código.
  - Exemplo correto:
    ```tsx
    import ReactMarkdown from "react-markdown"
    import remarkGfm from "remark-gfm"
    import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
    
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {markdownContent}
    </ReactMarkdown>
    ```

## Catalog System Rules

### Master Catalog (BaseProducts)
- **Always Seed**: Call `ensureBaseProductsSeeded()` before using `getBaseProducts()`
- **Recovery**: If catalog appears empty, seed function automatically recovers
- **Storage Key**: `yoobe_base_products_v3` in localStorage
- **Never Empty**: Catalog should never be empty - seed ensures initial products exist

### Company Catalog (CompanyProducts)
- **Use V3 Only**: Gestor catalog must use `CompanyProduct` (V3), never `Product` (V2)
- **Get by Company**: Always use `getCompanyProductsByCompany(companyId)` with companyId from `yoobe_auth`
- **Never Hardcode**: CompanyId must come from authentication, never hardcoded
- **Storage Key**: `yoobe_company_products_v3` in localStorage

### Budget Workflow
- **Status Flow**: `submitted → approved → released → replicated` (mandatory sequence)
- **Replication**: Always use `/api/replication` endpoint, never manual creation
- **Logs**: Replication must create logs via `createReplicationLog()` for audit trail
- **UI Feedback**: Show toast with "Ver no Catálogo" link after successful replication
- **Validation**: Always validate budget exists and status is "released" before replication
- **Error Handling**: Read response as text first, then try to parse JSON; provide fallback messages

### Product Details
- **Route Pattern**: `/gestor/catalog/[id]` for company product details
- **Editable Fields**: price, pointsCost, stockQuantity, isActive
- **Base Reference**: Always show related BaseProduct for context
- **Validation**: Ensure stockQuantity >= 0, prices >= 0

## Authentication Rules

### Demo Users
- **Never Use**: `spree_user_demo` - this user doesn't exist in storage
- **Use Seed Users**: Map roles to existing seeded users:
  - `superAdmin` → `spree_user_4` (Ana Oliveira)
  - `manager` → `spree_user_1` (João Silva)
  - `member` → `spree_user_3` (Pedro Costa)
- **Validation**: Always check if user exists; redirect to login if not found
- **No Fallbacks**: Remove all fallbacks to `spree_user_demo` in components

## Storefront Rules

### Product Display
- **V3 First**: Always try `CompanyProduct` (V3) first for IDs starting with `cp_`
- **V2 Fallback**: Fallback to `Product` (V2) for backward compatibility
- **Field Normalization**: Normalize fields for both types:
  - `pointsCost` (V3) or `priceInPoints` (V2)
  - `stockQuantity` (V3) or `stock` (V2)
  - `images` (V3) or `image` (V2)
  - `finalSku` (V3) or `sku` (V2)

### Checkout
- **Stock Validation**: Validate stock before creating order (both V3 and V2)
- **Stock Deduction**: Deduct stock from `CompanyProduct` after successful checkout
- **SKU Resolution**: Use `getCompanyProductById()` for V3 products, not `getProducts()` V2
- **Mixed Cart**: Support V2 and V3 products in the same cart

### Image Handling
- **Fallback Required**: All product images must use `BrandedProductImage` component with automatic fallback
- **Fallback Path**: `/placeholder.jpg` (exists in `public/` directory)
- **Error Handling**: Component automatically replaces broken images via `onError` handler
- **Lazy Loading**: Images use `loading="lazy"` for better performance
- **State Management**: Component tracks image errors to prevent infinite loops
- **Applied To**: Product list (`/loja`), product details (`/loja/produto/[id]`), cart, checkout, order tracking

### Order Tracking
- **Product Images**: Try `CompanyProduct` first, then `Product` V2
- **Product Names**: Use fallback function to ensure name is always displayed
- **Access Control**: Members can only see their own orders

### Image Handling
- **Fallback Required**: All product images must use `BrandedProductImage` component with automatic fallback
- **Fallback Path**: `/placeholder.jpg` (exists in `public/` directory)
- **Error Handling**: Component automatically replaces broken images via `onError` handler
- **Lazy Loading**: Images use `loading="lazy"` for better performance
- **State Management**: Component tracks image errors to prevent infinite loops
- **Applied To**: Product list (`/loja`), product details (`/loja/produto/[id]`), cart, checkout, order tracking
- **Layout**: All store pages have responsive padding (`px-4 sm:px-6 lg:px-8 py-6`) for consistent spacing

## Currency System Rules

### Dynamic Currency
- **Storage**: Currency configuration stored in `StoreSettings.currency` with `name` (singular) and `plural` fields
- **Default Values**: "ponto" (singular) and "pontos" (plural)
- **Helper Function**: Always use `getCurrencyName(companyId, plural)` to get currency name dynamically
- **Never Hardcode**: Never use hardcoded "Pontos" or currency names in UI components
- **Configuration**: Gestores can rename currency in `/gestor/store-settings` under "Moeda" tab
- **Scope**: Currency name affects all UI components automatically (loja, checkout, dashboards, user management)
- **Implementation Pattern**:
  ```tsx
  import { getCurrencyName } from "@/lib/storage"
  
  // Get companyId from auth
  const currencyPlural = getCurrencyName(companyId, true)
  const currencySingular = getCurrencyName(companyId, false)
  
  // Use in UI
  <span>{user.points} {currencyPlural}</span>
  ```

## Export & Data Management Rules

### CSV Export
- **Locations**: Orders (`/gestor/orders`), Users (`/gestor/usuarios`), Inventory (`/gestor/estoque`)
- **Implementation**: Client-side CSV generation using Blob API
- **File Naming**: Format `[type]_YYYY-MM-DD.csv` (e.g., `pedidos_2025-12-30.csv`)
- **Data Filtering**: Export only filtered/visible data, not all data
- **Headers**: Include Portuguese headers for all CSV exports
- **Encoding**: UTF-8 with proper escaping for special characters

### User Management
- **Manual Addition**: Form with firstName, lastName, email, phone fields
- **Invitation**: Email-based invitation system (simulated in demo, API call in production)
- **Bulk Import**: CSV/XLSX upload with validation
  - Required fields: email, nome/firstname
  - Optional fields: sobrenome/lastname, telefone/phone
  - Validation: Email format, duplicate checking
  - Error handling: Skip invalid rows, report success count

## Dashboard Visualization Rules

### Charts Library
- **Library**: `recharts` (already installed)
- **Responsive**: Always wrap charts in `ResponsiveContainer` with defined height
- **Theme Colors**: Use theme-aware colors (primary color from design system)
- **Accessibility**: Include proper labels, tooltips, and legends

### Manager Dashboard Charts
- **Orders Over Time**: Line chart showing last 7 days of orders
- **Points Distribution**: Pie chart showing user distribution by level
- **Top Products**: Bar chart showing top 5 selling products
- **Data Sources**: Use `getOrderStats()`, `getUserGamificationStats()`, `getProductStats()`

### Member Dashboard Charts
- **Activity History**: Area chart showing points evolution over last 7 days
- **Data Source**: User's own transaction history and points balance

## Gamification Rules

### Gamification Hub
- **Route**: `/membro/gamificacao`
- **Navigation**: Available in member sidebar with Trophy icon
- **Design Modes**: Conditional rendering based on theme
  - **Standard (Light/Dark)**: Clean corporate layout
  - **Fun Mode**: Stitch-inspired dark mode with vibrant colors
- **Data Sources**:
  - User data: `getUserById()`
  - Orders: `getUserOrders()`
  - Leaderboard: `getUserGamificationStats()`
  - Levels: `LEVEL_CONFIG` from `lib/storage.ts`
  - Achievements: Calculated from order history

### Fun Mode Gamification Design
- **Background**: Dark gradient (`slate-950/900`) with floating particles
- **Colors**: Vibrant gradients (yellow → orange → pink) for key elements
- **Glassmorphism**: Cards with `slate-800/90` + `backdrop-blur-sm`
- **Leaderboard Podium**:
  - Top 3 with visual podium (heights: 90px, 140px, 110px)
  - Differentiated colors: Gold (1st), Silver (2nd), Bronze (3rd)
  - Glow effects on top positions
- **Animations**: Smooth `framer-motion` transitions (spring, ease-out)
- **Particles**: 30 floating colored particles (yellow, orange, pink, purple, blue)

## Fun Mode Design Rules

### Color Palette
- **Primary**: Deep Cobalt Blue (oklch 0.55 0.18 250) - elegant and trustworthy
- **Secondary**: Aqua/Mint Green (oklch 0.75 0.15 180) - fresh and modern
- **Accent**: Soft Coral Orange (oklch 0.7 0.2 45) - energetic but not aggressive
- **Gamification (Fun Mode)**: Vibrant gradients (yellow → orange → pink) for engagement
- **Never Use**: Neon pink, bright yellow, or overly saturated colors (except in gamification Fun Mode)
- **Harmony**: All colors should work together cohesively

### Visual Style
- **Glassmorphism**: Use backdrop-blur (12-16px) with semi-transparent backgrounds (0.7-0.8 opacity)
- **Borders**: Subtle (1-1.5px) with low opacity (0.3-0.4)
- **Shadows**: Multi-layered, soft, with low opacity (0.1-0.15)
- **Border Radius**: Moderate (1rem), not exaggerated
- **Gamification Cards**: Enhanced glassmorphism with glow effects in Fun Mode

### Animations
- **Entrance**: Fade-in + slide-up (no bounce)
- **Hover Scale**: Maximum 1.02x (never 1.1x or more) - except gamification cards (1.05-1.08x in Fun Mode)
- **Transitions**: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- **Gradient Animation**: Slow (4-6s) for elegance
- **Gamification**: More pronounced animations in Fun Mode (rotations, glows, particle effects)

### Typography
- **Headings**: Subtle gradients (blue → green), not neon
- **Gamification Headings (Fun Mode)**: Vibrant gradients (yellow → orange → pink)
- **Text Shadow**: Minimal (0 1px 3px with low opacity)
- **Letter Spacing**: Slight increase (+0.01em)
- **Font Weight**: 600 for headings (not 700)

### Background Patterns
- **Geometric**: Hexagonal grid or subtle diagonal lines
- **Opacity**: Very low (0.02-0.03)
- **Colors**: Harmonious with palette (blue-green tones)
- **Purpose**: Add texture without distraction
- **Gamification Particles**: Colored floating particles in Fun Mode (opacity 0.3-0.6)

## Navigation & Menu Rules

### Menu Consolidation
- **Single Source**: All navigation items defined in `lib/navigation.ts`
- **No Duplicates**: Each menu item should appear only once per role
- **Portuguese (PT-BR)**: All menu labels must be in Portuguese
- **Role-Based**: Navigation filtered by user role (manager, member, superAdmin)
- **Consolidation**: Similar items (e.g., "Catálogo" and "Produtos") should be merged into one
- **Audit Status**: Complete audit performed on 2025-12-30 - all 52 pages verified, no duplicate menus found
- **Layout Compliance**: All pages follow correct pattern:
  - Pages with layouts providing `AppShell` → use `PageContainer`
  - Pages without layouts providing `AppShell` → use `AppShell` directly (e.g., `/loja/*`)

## Documentação Automática
- **Conductor Sync**: Execute `./conductor.sh sync` ou `node conductor-sync.js` após mudanças significativas.
- **Changelog**: O `conductor/CHANGELOG.md` é atualizado automaticamente com mudanças detectadas.
- **Tracks**: Cada nova feature deve ter um track em `conductor/tracks/[feature-name]/plan.md`.
- **Auto-documentação**: O `conductor-sync.js` detecta:
  - Funções e interfaces em `lib/storage.ts`
  - Itens de navegação por role
  - Problemas de layout (uso incorreto de AppShell)
  - Mudanças em arquivos `.tsx`, `.ts`, `.md`
  - Sistema de moeda dinâmica e configurações de loja

## Git & Commits
- **Pattern**: Conventional Commits (feat, fix, refactor, chore).
- **Context**: Mencionar o ID do track do Conductor no corpo do commit, se aplicável.


---
*Atualizado em 03/01/2026, 02:24:34 via Conductor Real-time Tracking*