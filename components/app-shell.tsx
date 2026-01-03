"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Truck,
  Box,
  Menu,
  X,
  Users,
  ShoppingBag,
  Book,
  LogOut,
  Store,
  Camera,
  Settings,
  Terminal,
  Wallet,
  ClipboardList,
  Zap,
  Building,
  Trophy,
  Medal,
  Award,
  Star,
} from "lucide-react"
import type { NavItem, GroupedNavigation } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge as UiBadge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { DemoBadge, EnvSwitcher, FunModeToggle, QuickBrandSeeder } from "./gestor/demo-controls"
import { DemoCustomizer } from "./gestor/demo-customizer"
import { fulfillmentSimulator } from "@/lib/fulfillment-simulator"
import { UserStats } from "./gamification/UserStats"
import { ThemeSwitcher } from "./theme-switcher"
import { AppearanceApplier } from "./appearance-applier"
import { StoreBreadcrumbs } from "./loja/Breadcrumbs"
import { GlobalCart } from "./loja/GlobalCart"
import { TourGuide, TourHelpButton } from "./demo/tour-guide"
import { PerspectiveSwitcher } from "./demo/perspective-switcher"

import { UserRole, ROLE_PERMISSIONS } from "@/lib/roles"
import { getNavigationByRole, getGroupedNavigationByRole } from "@/lib/navigation"
import { AchievementList } from "./gamification/AchievementBadge"
import { getUserById, getCompanyById } from "@/lib/storage"
import { TopBanner } from "./top-banner"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Componente de ícones de gamificação
function GamificationIcons({ compact = false }: { compact?: boolean }) {
  const [achievements, setAchievements] = useState<any[]>([])
  
  useEffect(() => {
    if (typeof window === "undefined") return
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        const userId = auth.userId
        if (userId) {
          const user = getUserById(userId)
          if (user?.achievements) {
            setAchievements(user.achievements.slice(0, 3))
          }
        }
      } catch {}
    }
  }, [])

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border border-primary/30 shadow-sm group-data-[collapsible=icon]:justify-center">
        <Trophy className="h-3.5 w-3.5 text-primary" />
        <Medal className="h-3.5 w-3.5 text-primary/90" />
        <Award className="h-3.5 w-3.5 text-primary/70" />
        {achievements.length > 0 && (
          <div className="ml-1 flex items-center gap-0.5 border-l border-primary/20 pl-1.5 group-data-[collapsible=icon]:hidden">
            {achievements.map((ach) => (
              <span key={ach.id} className="text-sm leading-none" title={ach.name}>
                {ach.icon}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/30 shadow-sm hover:shadow-md transition-all">
      <Trophy className="h-4 w-4 text-primary" />
      <Medal className="h-4 w-4 text-primary/90" />
      <Award className="h-4 w-4 text-primary/70" />
      {achievements.length > 0 && (
        <div className="ml-1 flex items-center gap-1 border-l border-primary/20 pl-2">
          {achievements.map((ach) => (
            <span key={ach.id} className="text-base leading-none" title={ach.name}>
              {ach.icon}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("member")
  const [companyId, setCompanyId] = useState<string | undefined>(undefined)
  const [demoFeaturesEnabled, setDemoFeaturesEnabled] = useState(false)

  useEffect(() => {
    // Initialize fulfillment simulator once
    fulfillmentSimulator.init()
  }, [])

  const isSpecialPath = pathname.startsWith("/gestor") || 
                        pathname.startsWith("/membro") || 
                        pathname.startsWith("/super-admin") ||
                        pathname.startsWith("/sandbox")

  useEffect(() => {
    // Verificar autenticação e onboarding
    if (typeof window === "undefined") return
    
    const authData = localStorage.getItem("yoobe_auth")

    if (!authData) {
      if (pathname !== "/login" && !pathname.startsWith("/sandbox") && !pathname.startsWith("/onboarding") && !pathname.startsWith("/demo-guide") && !pathname.startsWith("/solucoes")) {
        router.push("/login")
      } else {
        setIsAuthenticated(true)
      }
      return
    }

    try {
      const auth = JSON.parse(authData)
      const role = (auth.role as UserRole) || "member"
      
      // Garantir que o role seja válido
      if (!["superAdmin", "manager", "member"].includes(role)) {
        console.warn("[AppShell] Role inválido:", role, "usando 'member' como fallback")
        setUserRole("member")
      } else {
        setUserRole(role)
      }
      setCompanyId(auth.companyId)

      // Check if demo features are enabled for the company
      if (auth.companyId) {
        const company = getCompanyById(auth.companyId)
        setDemoFeaturesEnabled(company?.demoFeaturesEnabled ?? false)
      }

      // Calcular navegação localmente para evitar problemas de concorrência com o estado userRole
      const currentNav = getNavigationByRole(role)
      const isNavPath = currentNav.some(item => pathname === item.href || pathname.startsWith(item.href + "/"))
      
      // Permitir acesso a sub-páginas dentro de áreas permitidas (ex: /gestor/seguranca é sub-página de /gestor/perfil)
      const isAllowedAreaPath = (role === "manager" || role === "superAdmin") && pathname.startsWith("/gestor/")

      // Se estiver no onboarding e já completou, vai pro dashboard
      if (auth.onboardingComplete && pathname === "/onboarding") {
        router.push("/dashboard")
        return
      }

      // Se não completou onboarding e não está na página, vai pra lá (exceto se for superAdmin ou sandbox)
      if (!auth.onboardingComplete && pathname !== "/onboarding" && role !== "superAdmin" && !pathname.startsWith("/sandbox") && !pathname.startsWith("/demo-guide")) {
        // Permitir acesso a rotas de navegação ou áreas permitidas mesmo sem onboarding (fins de demo)
        if (isNavPath || isAllowedAreaPath) {
          setIsAuthenticated(true)
          return
        }
        router.push("/onboarding")
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Erro ao processar autenticação:", error)
      localStorage.removeItem("yoobe_auth")
      router.push("/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("yoobe_auth")
    router.push("/login")
  }

  // Calcular navigation com o role atual para renderização
  // Usar navegação agrupada para melhor organização
  const groupedNavigation = getGroupedNavigationByRole(userRole)
  
  // Fallback: se navigation estiver vazio, adicionar Dashboard
  const safeGroupedNavigation: GroupedNavigation[] = groupedNavigation.length > 0 
    ? groupedNavigation 
    : [{ 
        group: { id: "principal", label: "Principal", roles: ["member"] }, 
        items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["member"], group: "principal" }] 
      }]

  // Debug: Log navigation and role (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const totalItems = safeGroupedNavigation.reduce((acc, g) => acc + g.items.length, 0)
    console.log('[AppShell] Role:', userRole, 'Groups:', safeGroupedNavigation.length, 'Total items:', totalItems)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppearanceApplier />
      <div className="min-h-screen bg-background flex w-full overflow-x-hidden">
        {/* Sidebar Lateral */}
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="relative flex-shrink-0">
                <Image 
                  src="/logo-4yoonik.jpg" 
                  alt="Yoobe" 
                  width={40} 
                  height={40} 
                  className="h-10 w-10 object-contain rounded-xl shadow-lg ring-2 ring-primary/30"
                  priority
                />
                <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-md" />
              </div>
              <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Yoobe
                </h1>
                <p className="text-[10px] text-muted-foreground">Corporate Store</p>
              </div>
            </div>
            <div className="px-2 pb-2 space-y-2">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                {demoFeaturesEnabled && <DemoBadge />}
                {isSpecialPath && <EnvSwitcher />}
              </div>
              {/* Demo Controls Row - Only show if enabled in settings */}
              {isSpecialPath && demoFeaturesEnabled && (
                <>
                  <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                    <FunModeToggle />
                    <QuickBrandSeeder />
                  </div>
                  {/* Demo Customizer - Most Important for Sales */}
                  <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <DemoCustomizer />
                  </div>
                </>
              )}
              {/* Sandbox Highlight */}
              {pathname.startsWith("/sandbox") && (
                <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 group-data-[collapsible=icon]:hidden">
                  <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider text-center">
                    🎮 Sandbox Mode
                  </p>
                  <p className="text-[9px] text-orange-600 text-center mt-0.5">
                    Ambiente de testes seguro
                  </p>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-[var(--md-sys-color-surface-container-lowest)]">
            {/* Grouped Navigation with M3 styling */}
            {safeGroupedNavigation.map((groupData, groupIndex) => (
              <SidebarGroup key={groupData.group.id}>
                {groupIndex > 0 && <SidebarSeparator className="bg-[var(--md-sys-color-outline-variant)]/30" />}
                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider px-3 py-2">
                  {groupData.group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="px-2 space-y-0.5">
                    {groupData.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                      return (
                        <SidebarMenuItem key={`${groupData.group.id}-${item.name}`}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive} 
                            tooltip={item.name}
                            className={cn(
                              "rounded-full transition-all duration-200",
                              "hover:bg-[var(--md-sys-color-surface-container-high)]",
                              isActive && "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] font-medium shadow-sm"
                            )}
                          >
                            <Link href={item.href} className="flex items-center gap-3 px-3 py-2">
                              <item.icon className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-[var(--md-sys-color-primary)]" : "text-[var(--md-sys-color-on-surface-variant)]"
                              )} />
                              <span className={cn(
                                "group-data-[collapsible=icon]:hidden m3-label-large",
                                isActive ? "text-[var(--md-sys-color-on-primary-container)]" : "text-[var(--md-sys-color-on-surface)]"
                              )}>
                                {item.name}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            {/* Gamification Section */}
            <SidebarSeparator className="bg-[var(--md-sys-color-outline-variant)]/30" />
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider px-3 py-2">
                Gamificação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2">
                  <GamificationIcons compact />
                </div>
                <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
                  <UserStats compact />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-[var(--md-sys-color-outline-variant)]/30 bg-[var(--md-sys-color-surface-container-low)]">
            <SidebarMenu className="px-2 space-y-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Ver Loja"
                  className="rounded-full hover:bg-[var(--md-sys-color-surface-container-high)] transition-all duration-200"
                >
                  <Link href="/loja" className="flex items-center gap-3 px-3 py-2">
                    <Store className="h-5 w-5 text-[var(--md-sys-color-on-surface-variant)]" />
                    <span className="m3-label-large text-[var(--md-sys-color-on-surface)]">Ver Loja</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Sandbox Link for Demo */}
              {userRole === "manager" || userRole === "superAdmin" ? (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Sandbox - Ambiente de Testes"
                    className="rounded-full hover:bg-[var(--md-sys-color-surface-container-high)] transition-all duration-200"
                  >
                    <Link href="/sandbox/store" className="flex items-center gap-3 px-3 py-2">
                      <Terminal className="h-5 w-5 text-[var(--md-sys-color-on-surface-variant)]" />
                      <span className="m3-label-large text-[var(--md-sys-color-on-surface)]">Sandbox</span>
                      <UiBadge className="ml-auto h-5 px-2 text-[10px] bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] border-none rounded-full">
                        DEMO
                      </UiBadge>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout} 
                  tooltip="Sair"
                  className="rounded-full hover:bg-[var(--md-sys-color-error-container)] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 px-3 py-2">
                    <LogOut className="h-5 w-5 text-[var(--md-sys-color-on-surface-variant)] group-hover:text-[var(--md-sys-color-error)]" />
                    <span className="m3-label-large text-[var(--md-sys-color-on-surface)] group-hover:text-[var(--md-sys-color-error)]">Sair</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex flex-col h-screen">
          {/* Top Header - Material Design 3 styling */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--md-sys-color-outline-variant)]/30 bg-[var(--md-sys-color-surface-container-lowest)] backdrop-blur-sm px-4 sticky top-0 z-30">
            <SidebarTrigger className="-ml-1 h-8 w-8 rounded-full hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors" />
            <div className="h-4 w-px bg-[var(--md-sys-color-outline-variant)]/50 mx-2" />
            
            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                {/* Breadcrumbs for store pages */}
                <StoreBreadcrumbs />
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Perspective Switcher - Discrete for Demo */}
                <PerspectiveSwitcher />

                {/* Tour Help Button */}
                <TourHelpButton role={userRole} companyId={companyId} enabled={true} />
                
                {/* Theme Switcher */}
                <ThemeSwitcher />
                
                {/* Global Cart - Conditional visibility based on role */}
                <GlobalCart userRole={userRole} />
                
                {/* User Stats - Gamification - Oculto em telas pequenas */}
                <div className="hidden md:block">
                  <UserStats compact />
                </div>
              </div>
            </div>
          </header>

          {/* Top Banner - Communication Area */}
          <TopBanner />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-background/50 relative">
            <div className="w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
      
      {/* Tour Guide - Global */}
      <TourGuide role={userRole} companyId={companyId} enabled={true} />
    </SidebarProvider>
  )
}
