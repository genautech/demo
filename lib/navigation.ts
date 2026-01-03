import {
  LayoutDashboard,
  Package,
  Truck,
  Box,
  Users,
  ShoppingBag,
  Book,
  Store,
  Settings,
  Terminal,
  Wallet,
  ClipboardList,
  Zap,
  Building,
  Building2,
  Sliders,
  DollarSign,
  Trophy,
  Megaphone,
  FileText,
  User,
  MapPin,
  Palette,
  Heart,
  Tag,
  Coins,
  BarChart3,
  Gift,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Layers,
} from "lucide-react"
import { UserRole } from "./roles"

// Navigation Group Types
export type NavGroup = 
  | "principal"      // Dashboard, Profile
  | "operacao"       // Products, Orders, Stock, Shipping
  | "marketing"      // Landing Pages, Gifts, Appearance
  | "gamificacao"    // Gamification, Currency, Badges
  | "financeiro"     // Wallet, Budgets
  | "configuracao"   // Settings, Integrations
  | "administracao"  // Super Admin: Companies, Users, Catalog, Tags, Communication
  | "ferramentas"    // Super Admin: DevTools, Setup, Docs
  | "membro"         // Member specific

export interface NavItem {
  name: string
  href: string
  icon: any
  roles: UserRole[]
  group?: NavGroup
}

export interface NavGroupConfig {
  id: NavGroup
  label: string
  roles: UserRole[]
  order: number      // Explicit ordering for groups
}

// Group configuration with labels and ordering
// Order determines the display sequence in the sidebar
export const NAV_GROUPS: NavGroupConfig[] = [
  { id: "principal", label: "Principal", roles: ["superAdmin", "manager", "member"], order: 1 },
  { id: "operacao", label: "Operação", roles: ["manager"], order: 2 },
  { id: "marketing", label: "Marketing", roles: ["manager"], order: 3 },
  { id: "gamificacao", label: "Gamificação", roles: ["manager"], order: 4 },
  { id: "financeiro", label: "Financeiro", roles: ["manager"], order: 5 },
  { id: "configuracao", label: "Configuração", roles: ["manager"], order: 6 },
  { id: "administracao", label: "Administração", roles: ["superAdmin"], order: 2 },
  { id: "ferramentas", label: "Ferramentas", roles: ["superAdmin"], order: 3 },
  { id: "membro", label: "Minha Conta", roles: ["member"], order: 2 },
]

export const ALL_NAVIGATION: NavItem[] = [
  // Principal - Dashboard e Perfil
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["superAdmin", "manager", "member"], group: "principal" },
  { name: "Minhas Demos", href: "/demos", icon: Layers, roles: ["superAdmin", "manager"], group: "principal" },
  { name: "Meu Perfil", href: "/gestor/perfil", icon: User, roles: ["manager"], group: "principal" },
  { name: "Meu Perfil", href: "/super-admin/perfil", icon: User, roles: ["superAdmin"], group: "principal" },
  
  // Operação - Produtos, Pedidos, Estoque, Envios, Aprovações, Orçamentos
  { name: "Catálogo", href: "/gestor/catalog", icon: ShoppingBag, roles: ["manager"], group: "operacao" },
  { name: "Meus Produtos", href: "/gestor/produtos-cadastrados", icon: Package, roles: ["manager"], group: "operacao" },
  { name: "Orçamentos", href: "/gestor/budgets", icon: DollarSign, roles: ["manager"], group: "operacao" },
  { name: "Pedidos", href: "/gestor/orders", icon: ClipboardList, roles: ["manager"], group: "operacao" },
  { name: "Aprovações", href: "/gestor/aprovacoes", icon: CheckCircle2, roles: ["manager"], group: "operacao" },
  { name: "Estoque", href: "/gestor/estoque", icon: Box, roles: ["manager"], group: "operacao" },
  { name: "Rastreamento", href: "/gestor/swag-track", icon: Truck, roles: ["manager"], group: "operacao" },
  { name: "Usuários", href: "/gestor/usuarios", icon: Users, roles: ["manager"], group: "operacao" },

  // Marketing - Landing Pages, Presentes, Aparência
  { name: "Enviar Presentes", href: "/gestor/send-gifts", icon: Gift, roles: ["manager"], group: "marketing" },
  { name: "Landing Pages", href: "/gestor/landing-pages", icon: FileText, roles: ["manager"], group: "marketing" },
  { name: "Aparência", href: "/gestor/appearance", icon: Palette, roles: ["manager"], group: "marketing" },

  // Gamificação - Moeda, Níveis, Dashboard, Conquistas
  { name: "Moeda & Badges", href: "/gestor/currency", icon: Coins, roles: ["manager"], group: "gamificacao" },
  { name: "Níveis", href: "/gestor/appearance#gamificacao", icon: TrendingUp, roles: ["manager"], group: "gamificacao" },
  { name: "Dashboard Moeda", href: "/gestor/currency-dashboard", icon: BarChart3, roles: ["manager"], group: "gamificacao" },
  { name: "Conquistas", href: "/gestor/achievements", icon: Trophy, roles: ["manager"], group: "gamificacao" },

  // Financeiro - Verbas
  { name: "Gestão de Verbas", href: "/gestor/wallet", icon: Wallet, roles: ["manager"], group: "financeiro" },

  // Configuração - Integrações, Configurações da Loja
  { name: "Configurações da Loja", href: "/gestor/store-settings", icon: Sliders, roles: ["manager"], group: "configuracao" },
  { name: "Integrações", href: "/gestor/integrations", icon: Settings, roles: ["manager"], group: "configuracao" },
  { name: "Configurações", href: "/gestor/settings", icon: Settings, roles: ["manager"], group: "configuracao" },

  // Super Admin - Administração (Empresas, Usuários, Catálogo, Fornecedores, Tags, Aprovações, Comunicação)
  { name: "Empresas", href: "/super-admin/companies", icon: Building, roles: ["superAdmin"], group: "administracao" },
  { name: "Usuários Globais", href: "/super-admin/users", icon: Users, roles: ["superAdmin"], group: "administracao" },
  { name: "Catálogo Base", href: "/super-admin/catalogo-base", icon: Package, roles: ["superAdmin"], group: "administracao" },
  { name: "Fornecedores", href: "/super-admin/fornecedores", icon: Building2, roles: ["superAdmin"], group: "administracao" },
  { name: "Tags Globais", href: "/super-admin/tags", icon: Tag, roles: ["superAdmin"], group: "administracao" },
  { name: "Aprovações", href: "/super-admin/aprovacoes", icon: CheckCircle2, roles: ["superAdmin"], group: "administracao" },
  { name: "Enviar Presentes", href: "/gestor/send-gifts", icon: Gift, roles: ["superAdmin"], group: "administracao" },
  { name: "Comunicados", href: "/super-admin/comunicacao", icon: Megaphone, roles: ["superAdmin"], group: "administracao" },
  { name: "Conductor", href: "/super-admin/conductor", icon: Terminal, roles: ["superAdmin"], group: "administracao" },
  { name: "Fun Mode", href: "/super-admin/fun-mode", icon: Sparkles, roles: ["superAdmin"], group: "administracao" },

  // Super Admin - Ferramentas (Dev, Setup, Docs)
  { name: "Admin Geral", href: "/super-admin", icon: Settings, roles: ["superAdmin"], group: "ferramentas" },
  { name: "Setup Inicial", href: "/gestor/setup", icon: Zap, roles: ["superAdmin"], group: "ferramentas" },
  { name: "DevTools", href: "/gestor/devtools", icon: Terminal, roles: ["superAdmin"], group: "ferramentas" },
  { name: "Mapa do Site", href: "/sitemap", icon: Book, roles: ["superAdmin"], group: "ferramentas" },
  { name: "Documentação", href: "/documentacao", icon: Book, roles: ["superAdmin", "manager"], group: "ferramentas" },

  // Member (Membro)
  { name: "Meu Perfil", href: "/membro/preferencias", icon: User, roles: ["member"], group: "membro" },
  { name: "Loja", href: "/loja", icon: Store, roles: ["member"], group: "membro" },
  { name: "Meus Pedidos", href: "/membro/pedidos", icon: Package, roles: ["member"], group: "membro" },
  { name: "Endereços", href: "/membro/enderecos", icon: MapPin, roles: ["member"], group: "membro" },
  { name: "Gamificação", href: "/membro/gamificacao", icon: Trophy, roles: ["member"], group: "membro" },
  { name: "Swag Track", href: "/membro/swag-track", icon: Truck, roles: ["member"], group: "membro" },
]

// Get flat navigation by role (backward compatible)
export function getNavigationByRole(role: UserRole): NavItem[] {
  return ALL_NAVIGATION.filter(item => item.roles.includes(role))
}

// Get grouped navigation by role
export interface GroupedNavigation {
  group: NavGroupConfig
  items: NavItem[]
}

export function getGroupedNavigationByRole(role: UserRole): GroupedNavigation[] {
  const roleItems = ALL_NAVIGATION.filter(item => item.roles.includes(role))
  const roleGroups = NAV_GROUPS.filter(group => group.roles.includes(role))
  
  return roleGroups
    .sort((a, b) => a.order - b.order) // Sort by explicit order
    .map(group => ({
      group,
      items: roleItems.filter(item => item.group === group.id)
    }))
    .filter(g => g.items.length > 0)
}
