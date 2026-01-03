"use client"

import { PageContainer } from "@/components/page-container"
import { AuthGate } from "@/components/auth-gate"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ALL_NAVIGATION, NavItem } from "@/lib/navigation"
import { UserRole } from "@/lib/roles"
import Link from "next/link"
import { 
  Building, 
  Users, 
  Settings, 
  LayoutDashboard, 
  Package, 
  Box, 
  Truck, 
  Store, 
  Book, 
  Terminal, 
  Zap, 
  ShoppingBag, 
  Wallet, 
  ClipboardList,
  DollarSign,
  Download,
  UserPlus,
  Mail,
  Upload,
  Sliders,
  Trophy,
  BarChart3,
  PieChart,
  TrendingUp,
  User,
  Palette,
  Shield,
  MapPin,
  Eye
} from "lucide-react"

export default function SitemapPage() {
  const roles: { id: UserRole; label: string; color: string }[] = [
    { id: "superAdmin", label: "Super Admin", color: "bg-purple-100 text-purple-800 border-purple-200" },
    { id: "manager", label: "Gestor", color: "bg-green-100 text-green-800 border-green-200" },
    { id: "member", label: "Membro", color: "bg-slate-100 text-slate-800 border-slate-200" },
  ]

  const getItemsByRole = (roleId: UserRole) => {
    const navItems = ALL_NAVIGATION.filter(item => item.roles.includes(roleId))
    const extraItems = EXTRA_ROUTES.filter(item => item.roles.includes(roleId))
    return [...navItems, ...extraItems]
  }

  // Agrupar rotas por categoria para melhor organização
  const categorizeRoute = (href: string, name: string) => {
    if (href.includes("/gestor/usuarios")) return { category: "Gestão de Usuários", icon: UserPlus }
    if (href.includes("/gestor/orders") || href.includes("/membro/pedidos") || href.includes("/pedido/")) return { category: "Pedidos", icon: Package }
    if (href.includes("/gestor/catalog") || href.includes("/gestor/produtos") || href.includes("/loja/produto/")) return { category: "Catálogo & Vitrine", icon: ShoppingBag }
    if (href.includes("/gestor/estoque")) return { category: "Estoque", icon: Box }
    if (href.includes("/gestor/appearance") || href.includes("/gestor/landing-pages") || href.includes("/landing/")) return { category: "Customização & Branding", icon: Palette }
    if (href.includes("/gestor/swag-track") || href.includes("/membro/swag-track")) return { category: "Rastreamento (Swag Track)", icon: Truck }
    if (href.includes("/gestor/send-gifts") || href.includes("/loja/send-gifts")) return { category: "Ações de Engajamento", icon: Package }
    if (href.includes("/gestor/store-settings") || href.includes("/gestor/settings")) return { category: "Configurações da Loja", icon: Sliders }
    if (href.includes("/gestor/wallet") || href.includes("/gestor/budgets") || href.includes("/checkout")) return { category: "Gestão Financeira & Checkout", icon: Wallet }
    if (href.includes("/gestor/integrations")) return { category: "Conexões & APIs", icon: Zap }
    if (href.includes("/gestor/setup") || href.includes("/gestor/devtools")) return { category: "Ferramentas de Onboarding", icon: Terminal }
    if (href.includes("/membro/gamificacao") || href.includes("/dashboard") || href.includes("/currency")) return { category: "Experiência & Gamificação", icon: Trophy }
    if (href.includes("/membro/documentacao")) return { category: "Suporte & Ajuda", icon: Book }
    if (href.includes("/loja") || href.includes("/campanha")) return { category: "Loja Virtual & Campanhas", icon: Store }
    if (href.includes("/super-admin")) return { category: "Administração Master", icon: Shield }
    if (href.includes("/perfil") || href.includes("/preferencias") || href.includes("/enderecos")) return { category: "Meu Perfil", icon: User }
    if (href.includes("/sitemap")) return { category: "Utilidades", icon: MapPin }
    return { category: "Outros", icon: Settings }
  }

  const EXTRA_ROUTES: NavItem[] = [
    // Super Admin
    { name: "Conductor Specs", href: "/super-admin/conductor", icon: Terminal, roles: ["superAdmin"] },
    
    // Gestor
    { name: "Importar Catálogo", href: "/gestor/catalog/import", icon: Download, roles: ["manager"] },
    { name: "Logs de Replicação", href: "/gestor/catalog/replication-logs", icon: ClipboardList, roles: ["manager"] },
    { name: "Setup Wizard", href: "/gestor/setup", icon: Zap, roles: ["manager"] },
    
    // Member
    { name: "Checkout de Pontos", href: "/loja/checkout", icon: ShoppingBag, roles: ["member"] },
    { name: "Detalhes do Produto", href: "/loja/produto/demo-id", icon: Eye, roles: ["member"] },
    
    // Campanha (Public/Member)
    { name: "Loja de Campanha", href: "/campanha/loja", icon: Store, roles: ["member", "manager"] },
    { name: "Checkout Campanha", href: "/campanha/checkout", icon: ShoppingBag, roles: ["member"] },
  ]

  return (
    <AuthGate requiredRole="superAdmin">
      <PageContainer className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sitemap do Sistema</h1>
          <p className="text-muted-foreground mt-2">Visão geral de todas as rotas divididas por permissões de acesso e funcionalidades.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => {
            const items = getItemsByRole(role.id)
            const groupedItems = items.reduce((acc, item) => {
              const { category } = categorizeRoute(item.href, item.name)
              if (!acc[category]) acc[category] = []
              acc[category].push(item)
              return acc
            }, {} as Record<string, typeof items>)

            return (
              <Card key={role.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{role.label}</CardTitle>
                    <Badge className={role.color}>{role.id}</Badge>
                  </div>
                  <CardDescription>
                    {items.length} rotas disponíveis para {role.label.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(groupedItems).map(([category, categoryItems]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {category}
                        </div>
                        <div className="grid gap-2 pl-2">
                          {categoryItems.map((item, idx) => (
                            <Link 
                              key={`${role.id}-${item.href}-${idx}`}
                              href={item.href}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group border border-transparent hover:border-border"
                            >
                              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <item.icon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground font-mono truncate">{item.href}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Notas de Desenvolvimento</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>• As rotas de <strong>Dashboard</strong> são compartilhadas entre múltiplos perfis.</p>
              <p>• Rotas iniciadas com <code className="bg-muted px-1 rounded">/gestor</code> são exclusivas para administração e gestão de empresas.</p>
              <p>• Rotas iniciadas com <code className="bg-muted px-1 rounded">/membro</code> são exclusivas para membros da empresa.</p>
              <p>• O acesso é controlado dinamicamente pelo componente <code className="bg-muted px-1 rounded">AppShell</code> baseado no token de sessão.</p>
              <p>• Todas as rotas estão em <strong>Português (PT-BR)</strong> conforme padrão do sistema.</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-600" />
                Atualizações da Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-start gap-2">
                <Sliders className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100">Seletor de Perfil Integrado</p>
                  <p className="text-muted-foreground text-xs">Alternador de perspectiva agora disponível no header para navegação fluida entre Admin, Gestor e Membro.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Palette className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100">Branding & Landing Pages</p>
                  <p className="text-muted-foreground text-xs">Novas ferramentas para customização visual e criação de páginas de campanha.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100">Dashboards em Tempo Real</p>
                  <p className="text-muted-foreground text-xs">Visualizações analíticas avançadas em todos os níveis de acesso.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </AuthGate>
  )
}
