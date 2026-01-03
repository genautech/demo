"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  ChevronRight,
  BookOpen,
  AlertCircle,
  ShoppingBag,
  Wallet,
  Trophy,
  Settings,
  Link as LinkIcon,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

const DEMO_SECTIONS = [
  { id: "overview", title: "Visão Geral", icon: BookOpen },
  { id: "checklist", title: "Checklist Pré-Demo", icon: CheckCircle2 },
  { id: "timeline", title: "Timeline (30min)", icon: Clock },
  { id: "setup", title: "Setup & Onboarding", icon: Settings },
  { id: "catalog", title: "Catálogo", icon: ShoppingBag },
  { id: "orders", title: "Pedidos & Checkout", icon: ShoppingBag },
  { id: "wallet", title: "Wallet & Orçamentos", icon: Wallet },
  { id: "gamification", title: "Gamificação", icon: Trophy },
  { id: "integrations", title: "Integrações", icon: Settings },
  { id: "data-management", title: "Preparação de Dados", icon: Settings },
  { id: "troubleshooting", title: "Troubleshooting", icon: AlertCircle },
  { id: "faq", title: "FAQs", icon: BookOpen },
]

const TIMELINE_STEPS = [
  { time: "0:00", duration: "2min", title: "Abertura e Contexto", section: "overview" },
  { time: "2:00", duration: "4min", title: "Setup e Onboarding", section: "setup" },
  { time: "6:00", duration: "5min", title: "Gestão de Catálogo", section: "catalog" },
  { time: "11:00", duration: "6min", title: "Fluxo de Pedido e Checkout", section: "orders" },
  { time: "17:00", duration: "4min", title: "Wallet e Orçamentos", section: "wallet" },
  { time: "21:00", duration: "3min", title: "Gamificação", section: "gamification" },
  { time: "24:00", duration: "4min", title: "Integrações e APIs", section: "integrations" },
  { time: "28:00", duration: "2min", title: "Encerramento e Próximos Passos", section: "overview" },
]

const CHECKLIST_ITEMS = [
  { id: "server", label: "Verificar se servidor está rodando", category: "Técnico" },
  { id: "data", label: "Verificar se há dados seedados", category: "Técnico" },
  { id: "login", label: "Testar login e navegação básica", category: "Técnico" },
  { id: "routes", label: "Verificar se todas as rotas estão funcionando", category: "Técnico" },
  { id: "screen", label: "Preparar ambiente de apresentação (tela compartilhada, áudio)", category: "Apresentação" },
  { id: "links", label: "Ter links prontos para acesso rápido", category: "Apresentação" },
  { id: "examples", label: "Preparar exemplos de casos de uso relevantes", category: "Conteúdo" },
]

const QUICK_LINKS = {
  setup: [
    { label: "Wizard de Setup", href: "/gestor/setup", description: "Wizard principal de configuração" },
    { label: "Configurar API", href: "/gestor/setup/1-connect", description: "Configuração de chaves de API" },
    { label: "Importar Catálogo", href: "/gestor/setup/2-catalog", description: "Importação de produtos" },
    { label: "Configurar Wallet", href: "/gestor/setup/3-wallet", description: "Configuração de carteira" },
  ],
  management: [
    { label: "Catálogo", href: "/gestor/catalog", description: "Gestão de produtos" },
    { label: "Pedidos", href: "/gestor/orders", description: "Lista de pedidos" },
    { label: "Orçamentos", href: "/gestor/budgets", description: "Gestão de orçamentos" },
    { label: "Wallet", href: "/gestor/wallet", description: "Wallet e ledger" },
    { label: "Usuários", href: "/gestor/usuarios", description: "Gestão de usuários" },
  ],
  customer: [
    { label: "Loja", href: "/loja", description: "Loja do cliente" },
    { label: "Checkout", href: "/loja/checkout", description: "Finalizar compra" },
    { label: "Meus Pedidos", href: "/membro/pedidos", description: "Pedidos do colaborador" },
    { label: "Gamificação", href: "/membro/gamificacao", description: "Dashboard de gamificação" },
  ],
}

const SCRIPTS = {
  opening: `Boa tarde! Obrigado por reservar este tempo. Hoje vou apresentar a Yoobe, uma plataforma completa para gestão de loja corporativa que automatiza processos, aumenta engajamento e reduz custos operacionais.

Vamos usar dados de demonstração de uma empresa fictícia, mas tudo que você verá é 100% funcional e pode ser implementado na sua empresa.

A apresentação dura cerca de 30 minutos, e ao final teremos tempo para perguntas. Vamos começar?`,
  
  setup: `Vamos começar pelo processo de setup. A Yoobe foi projetada para ser configurada rapidamente. Veja como é simples conectar sua empresa e começar a usar.

O processo de setup é guiado e leva menos de 30 minutos. Cada etapa tem validação automática e feedback em tempo real. Vamos ver como funciona a importação de catálogo...`,
  
  catalog: `Agora vamos ver como gerenciar o catálogo de produtos. A Yoobe permite importar produtos de um catálogo base, personalizar preços e estoque por empresa, e controlar visibilidade por tags.

Veja como é fácil encontrar produtos. Você pode filtrar por categoria, buscar por nome ou SKU, e ver o estoque em tempo real. Cada produto pode ter tags que controlam quem pode vê-lo na loja.

Aqui está a loja do ponto de vista do colaborador. Veja como os produtos aparecem com a marca da empresa. O sistema de tags garante que cada pessoa veja apenas os produtos relevantes para ela.`,
  
  orders: `Agora vamos simular um pedido completo. O colaborador escolhe produtos, adiciona ao carrinho e finaliza a compra usando pontos - a moeda virtual de gamificação.

O checkout é simples e intuitivo. O sistema valida automaticamente o saldo de pontos, verifica estoque e processa o pedido. Veja como é rápido!

Do lado do gestor, você tem visibilidade completa de todos os pedidos. Pode ver status, rastrear entregas e gerenciar o ciclo completo.`,
  
  wallet: `A Yoobe tem um sistema completo de gestão financeira. Vamos ver como funciona o wallet e o processo de orçamentos.

O wallet centraliza todas as transações. Você pode ver exatamente quanto cada colaborador tem em pontos, quando ganhou e como gastou.

O processo de orçamento é totalmente automatizado. Você cria um orçamento, adiciona produtos, envia para aprovação. Uma vez aprovado e liberado, pode replicar todos os produtos para o estoque com um clique.`,
  
  gamification: `A gamificação é um diferencial da Yoobe. Colaboradores ganham pontos por ações, desbloqueiam conquistas e competem em rankings.

Veja como a gamificação engaja os colaboradores. Eles ganham pontos por compras, desbloqueiam conquistas e podem ver seu progresso em tempo real. Isso aumenta significativamente o engajamento com a loja.`,
  
  integrations: `A Yoobe foi construída pensando em integração. Você pode conectar com seus sistemas existentes via APIs e webhooks.

A plataforma oferece APIs RESTful completas para integração. Você pode sincronizar produtos, criar pedidos, consultar saldos - tudo via API. Além disso, webhooks notificam seu sistema sobre eventos importantes como novos pedidos ou mudanças de status.`,
  
  closing: `Vimos hoje como a Yoobe transforma a gestão de loja corporativa. A plataforma automatiza processos, aumenta engajamento através de gamificação e oferece integrações flexíveis.

Gostaria de agendar uma conversa para entender melhor as necessidades da sua empresa? Podemos fazer uma prova de conceito personalizada ou responder qualquer dúvida técnica.`,
}

const TROUBLESHOOTING = [
  {
    problem: "Dados não aparecem",
    solutions: [
      "Verificar se está logado corretamente",
      "Verificar se há dados seedados (usar /api/replication se necessário)",
      "Limpar cache do navegador",
      "Recarregar página",
    ],
  },
  {
    problem: "Página não carrega",
    solutions: [
      "Verificar conexão com internet",
      "Verificar se o servidor está rodando",
      "Verificar console do navegador para erros",
      "Tentar em modo anônimo",
    ],
  },
  {
    problem: "Pedido não é criado",
    solutions: [
      "Verificar saldo de pontos do usuário",
      "Verificar estoque do produto",
      "Verificar se endereço está completo",
      "Verificar logs no console",
    ],
  },
  {
    problem: "Produtos não aparecem na loja",
    solutions: [
      "Verificar se produtos foram replicados",
      "Verificar tags do usuário vs tags do produto",
      "Verificar se produtos estão ativos",
      "Verificar estoque disponível",
    ],
  },
]

const FAQS = [
  {
    question: "Quanto tempo leva para implementar?",
    answer: "O setup básico leva menos de 30 minutos. A integração completa depende da complexidade dos sistemas existentes, mas geralmente leva de 1 a 4 semanas.",
  },
  {
    question: "Preciso de conhecimento técnico?",
    answer: "Não. A interface é intuitiva e o processo de setup é guiado. Para integrações avançadas, nossa equipe pode ajudar.",
  },
  {
    question: "Como funciona a integração com nosso ERP?",
    answer: "A Yoobe oferece APIs RESTful completas. Você pode sincronizar produtos, criar pedidos e consultar dados. Também oferecemos webhooks para notificações em tempo real.",
  },
  {
    question: "E se precisarmos de customizações?",
    answer: "A plataforma é flexível e permite customizações. Podemos discutir suas necessidades específicas e avaliar a melhor abordagem.",
  },
]

export default function DemoGuidePage() {
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado para a área de transferência!`)
  }

  const toggleChecklistItem = (id: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedItems(newChecked)
  }

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageContainer className="py-8">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block sticky top-8 h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navegação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {DEMO_SECTIONS.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-left">{section.title}</span>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Guia de Demo - Yoobe Corporate Store
              </h1>
              <p className="text-muted-foreground text-lg">
                Roteiro completo para apresentações comerciais de 30 minutos
              </p>
            </div>

            {/* Overview Section */}
            <section id="overview" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Visão Geral
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Público-alvo</p>
                      <p className="font-semibold">Decisores de negócio</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Duração</p>
                      <p className="font-semibold">30 minutos</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Objetivo</p>
                      <p className="font-semibold">Demonstrar valor da plataforma</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                    <p className="font-semibold mb-2">Storyline Principal</p>
                    <p className="text-sm text-muted-foreground">
                      Você é um gestor de RH que precisa reduzir custos operacionais, aumentar engajamento 
                      e automatizar processos de reconhecimento. A Yoobe resolve todos esses problemas com 
                      uma plataforma completa e automatizada.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Checklist Section */}
            <section id="checklist" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Checklist Pré-Demo
                  </CardTitle>
                  <CardDescription>
                    Verifique todos os itens antes de iniciar a apresentação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {CHECKLIST_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => toggleChecklistItem(item.id)}
                      >
                        <div
                          className={cn(
                            "h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
                            checkedItems.has(item.id)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground"
                          )}
                        >
                          {checkedItems.has(item.id) && (
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Timeline Section */}
            <section id="timeline" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timeline da Demo (30 minutos)
                  </CardTitle>
                  <CardDescription>
                    Sequência cronológica de todas as etapas da apresentação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {TIMELINE_STEPS.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col items-center gap-2 min-w-[80px]">
                          <Badge variant="outline" className="font-mono">
                            {step.time}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {step.duration}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{step.title}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => scrollToSection(step.section)}
                          >
                            Ver detalhes <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Setup Section */}
            <section id="setup" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Setup e Onboarding (4 minutos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                    <p className="font-semibold mb-2">Script de Apresentação</p>
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                      {SCRIPTS.setup}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(SCRIPTS.setup, "Script de Setup")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Script
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Links Rápidos</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {QUICK_LINKS.setup.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{link.label}</p>
                            <p className="text-xs text-muted-foreground">{link.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Catalog Section */}
            <section id="catalog" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Gestão de Catálogo (5 minutos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                    <p className="font-semibold mb-2">Script de Apresentação</p>
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                      {SCRIPTS.catalog}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(SCRIPTS.catalog, "Script de Catálogo")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Script
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Links Rápidos</p>
                    <div className="grid gap-2">
                      <Link
                        href="/gestor/catalog"
                        target="_blank"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Catálogo (Gestor)</p>
                          <p className="text-xs text-muted-foreground">Gestão de produtos</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <Link
                        href="/loja"
                        target="_blank"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Loja (Cliente)</p>
                          <p className="text-xs text-muted-foreground">Vitrine de produtos</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Orders Section */}
            <section id="orders" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Pedidos e Checkout (6 minutos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                    <p className="font-semibold mb-2">Script de Apresentação</p>
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                      {SCRIPTS.orders}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(SCRIPTS.orders, "Script de Pedidos")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Script
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Links Rápidos</p>
                    <div className="grid gap-2">
                      {QUICK_LINKS.customer.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{link.label}</p>
                            <p className="text-xs text-muted-foreground">{link.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                      <Link
                        href="/gestor/orders"
                        target="_blank"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Pedidos (Gestor)</p>
                          <p className="text-xs text-muted-foreground">Lista de pedidos</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Wallet Section */}
            <section id="wallet" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet e Orçamentos (4 minutos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                    <p className="font-semibold mb-2">Script de Apresentação</p>
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                      {SCRIPTS.wallet}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(SCRIPTS.wallet, "Script de Wallet")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Script
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Links Rápidos</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Link
                        href="/gestor/wallet"
                        target="_blank"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Wallet</p>
                          <p className="text-xs text-muted-foreground">Wallet e ledger</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <Link
                        href="/gestor/budgets"
                        target="_blank"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Orçamentos</p>
                          <p className="text-xs text-muted-foreground">Gestão de orçamentos</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Gamification Section */}
            <section id="gamification" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Gamificação (3 minutos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                    <p className="font-semibold mb-2">Script de Apresentação</p>
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                      {SCRIPTS.gamification}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(SCRIPTS.gamification, "Script de Gamificação")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Script
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Links Rápidos</p>
                    <Link
                      href="/membro/gamificacao"
                      target="_blank"
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Dashboard de Gamificação</p>
                        <p className="text-xs text-muted-foreground">Níveis, conquistas e rankings</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Integrations Section */}
            <section id="integrations" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Integrações e APIs (4 minutos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                    <p className="font-semibold mb-2">Script de Apresentação</p>
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                      {SCRIPTS.integrations}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(SCRIPTS.integrations, "Script de Integrações")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Script
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Links Rápidos</p>
                    <div className="grid gap-2">
                      <Link
                        href="/gestor/integrations"
                        target="_blank"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Página de Integrações</p>
                          <p className="text-xs text-muted-foreground">APIs, webhooks e logs</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Troubleshooting Section */}
            <section id="troubleshooting" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Troubleshooting
                  </CardTitle>
                  <CardDescription>
                    Soluções para problemas comuns durante a demo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {TROUBLESHOOTING.map((item, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <p className="font-semibold mb-2 text-destructive">{item.problem}</p>
                        <ul className="space-y-1">
                          {item.solutions.map((solution, solIndex) => (
                            <li key={solIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    FAQs
                  </CardTitle>
                  <CardDescription>
                    Perguntas frequentes e respostas preparadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <p className="font-semibold mb-2">{faq.question}</p>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Data Management Section */}
            <section id="data-management" className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preparação de Dados de Demo
                  </CardTitle>
                  <CardDescription>
                    Como resetar e preparar dados para a apresentação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                    <p className="font-semibold mb-2">Devtools</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use a página de Devtools para resetar dados e aplicar cenários de demonstração.
                      Isso é útil antes de cada apresentação para garantir que os dados estejam consistentes.
                    </p>
                    <Link href="/gestor/devtools" target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Devtools
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Cenários Disponíveis:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• PRIO Onboarding - Kit de boas-vindas</li>
                      <li>• Hapvida Incentivos - Vouchers e wearables</li>
                      <li>• Yampi Cultura - Livros e eventos</li>
                      <li>• Boticário Seasonal - Kits sazonais</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      <strong>Nota:</strong> O reset apaga todos os dados de demo salvos localmente. 
                      Certifique-se de que não há dados importantes antes de resetar.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Quick Links Summary */}
            <section className="scroll-mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Links Rápidos - Resumo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <p className="font-semibold mb-3">Setup</p>
                      <div className="space-y-2">
                        {QUICK_LINKS.setup.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-3">Gestão</p>
                      <div className="space-y-2">
                        {QUICK_LINKS.management.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-3">Cliente</p>
                      <div className="space-y-2">
                        {QUICK_LINKS.customer.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
