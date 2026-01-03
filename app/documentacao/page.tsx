"use client"

import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Database,
  FileCode,
  Settings,
  Server,
  ShoppingBag,
  Users,
  Package,
  Coins,
  Tag,
  TrendingUp,
  ExternalLink,
  Terminal,
  Building,
  DollarSign,
  Gift,
  Heart,
  Truck,
  ClipboardList,
  Zap,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getCurrencyName } from "@/lib/storage"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function DocumentacaoPage() {
  const [activeTab, setActiveTab] = useState("visao-geral")
  const [companyId, setCompanyId] = useState<string>("company_1")
  const { theme } = useTheme()
  const isFunMode = theme === "fun"

  useEffect(() => {
    const authData = typeof window !== 'undefined' ? localStorage.getItem("yoobe_auth") : null
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Failed to parse auth data:", error)
        }
      }
    }
  }, [])

  const currencyPlural = getCurrencyName(companyId, true).toUpperCase()
  const currencySingular = getCurrencyName(companyId, false).toUpperCase()

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isFunMode 
                ? "bg-linear-to-br from-purple-500 to-pink-500" 
                : "bg-primary/10"
            )}>
              <BookOpen className={cn(
                "h-6 w-6",
                isFunMode ? "text-white" : "text-primary"
              )} />
            </div>
            Documentação
          </h1>
          <p className="mt-2 text-muted-foreground">
            Guia completo de integração, APIs e funcionalidades do sistema Yoobe
          </p>
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/super-admin/conductor">
            <Terminal className="h-4 w-4" />
            Conductor Specs
          </Link>
        </Button>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
          onClick={() => setActiveTab("spree")}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-green-500/10 p-3">
              <Server className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="font-semibold">Spree Commerce</p>
              <p className="text-sm text-muted-foreground">Integração API</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
          onClick={() => setActiveTab("endpoints")}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <FileCode className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold">API Endpoints</p>
              <p className="text-sm text-muted-foreground">Referência completa</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
          onClick={() => setActiveTab("modelos")}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <Database className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="font-semibold">Modelos de Dados</p>
              <p className="text-sm text-muted-foreground">Types e Interfaces</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
          onClick={() => setActiveTab("gamificacao")}
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Coins className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold">Gamificação</p>
              <p className="text-sm text-muted-foreground">{currencyPlural} e Níveis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="spree">Spree API</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="modelos">Modelos</TabsTrigger>
          <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
          <TabsTrigger value="gamificacao">{currencyPlural}</TabsTrigger>
          <TabsTrigger value="configuracao">Config</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="visao-geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Visão Geral do Sistema
              </CardTitle>
              <CardDescription>
                Arquitetura e principais funcionalidades da plataforma Yoobe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Multi-Tenant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Suporte a múltiplas empresas (tenants) com configurações independentes de moeda, catálogo e usuários.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    E-commerce
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Loja integrada com sistema de pontos, catálogo de produtos e checkout completo.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Orçamentos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema de workflow para orçamentos: draft → submitted → reviewed → approved → released → replicated.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Envio de Presentes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Agendamento de envio de presentes para colaboradores com mensagens personalizadas.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="font-semibold mb-3">Stack Tecnológico</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>Next.js 14</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Tailwind CSS</Badge>
                  <Badge>shadcn/ui</Badge>
                  <Badge>Framer Motion</Badge>
                  <Badge>Spree Commerce 5</Badge>
                </div>
              </div>

              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Conductor - Documentação Automática</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  O sistema Conductor mantém a documentação sincronizada automaticamente com o código.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/super-admin/conductor" className="gap-2">
                    Ver Specs e Tracks
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Spree Commerce Integration */}
        <TabsContent value="spree" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-500" />
                Integração com Spree Commerce 5
              </CardTitle>
              <CardDescription>
                Sistema projetado para integrar com a API do Spree Commerce 5, conectado ao Tiny ERP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Visão Geral</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  O Spree Commerce é um framework e-commerce open-source que fornece APIs RESTful completas para
                  gerenciar produtos, pedidos, usuários e mais. Nossa integração utiliza estas APIs para sincronizar dados.
                </p>
                <Button variant="outline" className="gap-2 bg-transparent" asChild>
                  <a href="https://guides.spreecommerce.org/api/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Documentação Oficial Spree
                  </a>
                </Button>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="font-semibold mb-2">URL Base da API</h4>
                <code className="text-sm">https://sua-loja.com/api/v2/storefront</code>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Autenticação</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  A API do Spree utiliza tokens OAuth2 para autenticação. Configure as credenciais no arquivo de ambiente:
                </p>
                <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`# .env.local
SPREE_API_URL=https://sua-loja.com/api/v2/storefront
SPREE_API_KEY=seu_token_oauth2_aqui
SPREE_STORE_ID=1`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Exemplo de Requisição</h3>
                <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`// lib/spree-api.ts
async function getProducts() {
  const response = await fetch(
    \`\${process.env.SPREE_API_URL}/products\`,
    {
      headers: {
        'Authorization': \`Bearer \${process.env.SPREE_API_KEY}\`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response.json()
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Endpoints do Spree</h3>
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <code className="text-sm">GET /api/v2/storefront/products</code>
                    <p className="text-sm text-muted-foreground mt-1">Lista produtos da storefront</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code className="text-sm">GET /api/v2/platform/orders</code>
                    <p className="text-sm text-muted-foreground mt-1">Lista pedidos (admin)</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code className="text-sm">PATCH /api/v2/platform/products/:id</code>
                    <p className="text-sm text-muted-foreground mt-1">Atualiza produto (admin)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: API Endpoints */}
        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-blue-500" />
                API Endpoints
              </CardTitle>
              <CardDescription>Referência completa de todas as rotas da API</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {/* Products */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Produtos
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/products</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Lista produtos com filtros e paginação</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Query params:</strong> page, perPage, search, category, tag
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/products/[id]</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Detalhes de um produto específico</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">PATCH</Badge>
                          <code className="text-sm">/api/products/[id]</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Atualiza dados de um produto</p>
                      </div>
                    </div>
                  </div>

                  {/* Orders */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Pedidos
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/orders</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Lista pedidos com filtros e estatísticas</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Query params:</strong> page, perPage, email, orderNumber, product, status, dateFrom, dateTo
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">PATCH</Badge>
                          <code className="text-sm">/api/orders</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Atualiza status de um pedido</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Body:</strong> {`{ id, status }`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budgets */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Orçamentos
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/budgets</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Lista orçamentos com filtros</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Query params:</strong> id, companyId, status
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">POST</Badge>
                          <code className="text-sm">/api/budgets</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Cria novo orçamento com itens</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Body:</strong> {`{ budget: { companyId, title, createdBy }, items: [...] }`}
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">PATCH</Badge>
                          <code className="text-sm">/api/budgets</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Atualiza orçamento (transições de status)</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-amber-600">PUT</Badge>
                          <code className="text-sm">/api/budgets</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Gerencia itens do orçamento</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Actions:</strong> add_item, update_item, delete_item
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gifts */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Presentes
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">POST</Badge>
                          <code className="text-sm">/api/gifts</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Agenda envio de presentes</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Body:</strong> {`{ senderEmail, recipients, items, scheduledDate, message }`}
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">POST</Badge>
                          <code className="text-sm">/api/gifts/recommend</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Recomendações de presentes por IA</p>
                      </div>
                    </div>
                  </div>

                  {/* Companies */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Empresas
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/companies</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Lista ou busca empresas</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <strong>Query params:</strong> id
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">POST</Badge>
                          <code className="text-sm">/api/companies</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Cria nova empresa</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">PATCH</Badge>
                          <code className="text-sm">/api/companies</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Atualiza dados da empresa</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/tags</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Lista tags globais</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">POST</Badge>
                          <code className="text-sm">/api/tags</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Cria nova tag</p>
                      </div>
                    </div>
                  </div>

                  {/* Base Products */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Catálogo Base
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/base-products</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Lista produtos do catálogo base</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">POST</Badge>
                          <code className="text-sm">/api/base-products</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Cria produto no catálogo base</p>
                      </div>
                    </div>
                  </div>

                  {/* Replication */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Replicação
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">POST</Badge>
                          <code className="text-sm">/api/replication</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Replica produtos para empresa</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/replication</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Lista logs de replicação</p>
                      </div>
                    </div>
                  </div>

                  {/* Health */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Saúde
                    </h3>
                    <div className="space-y-2">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">GET</Badge>
                          <code className="text-sm">/api/health</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Health check da aplicação</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Data Models */}
        <TabsContent value="modelos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                Modelos de Dados
              </CardTitle>
              <CardDescription>Interfaces TypeScript baseadas nos modelos do Spree Commerce 5</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      User (Usuário)
                    </h3>
                    <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  address?: Address
  // Gamificação
  points: number
  level: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  totalPurchases: number
  totalSpent: number
  totalPointsEarned: number
  totalPointsSpent: number
  role: "superAdmin" | "manager" | "member"
  achievements: Achievement[]
  tags: string[]
  companyId?: string
  createdAt: string
  updatedAt: string
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Product (Produto)
                    </h3>
                    <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`interface Product {
  id: string
  name: string
  description: string
  slug?: string
  sku?: string
  price: number
  compareAtPrice?: number
  priceInPoints: number
  image?: string
  images?: string[]
  stock: number
  category: string
  taxonIds?: string[]
  tags?: string[]
  variants?: ProductVariant[]
  available?: boolean
  active: boolean
  totalSold?: number
  rarity?: "comum" | "incomum" | "raro" | "épico" | "lendário"
  minLevel?: UserLevel
  ncm?: string  // NCM fiscal
  createdAt: string
  updatedAt: string
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order (Pedido)
                    </h3>
                    <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`interface Order {
  id: string
  numero: string
  status: OrderStatus
  email: string
  dataPedido: string
  itens: LineItem[]
  valorTotal: number
  pontosUtilizados?: number
  pontosGanhos?: number
  enderecoEntrega?: Address
  trackingNumber?: string
  trackingUrl?: string
  carrier?: string
  // Send Gifts
  scheduledAt?: string
  isGift?: boolean
  giftMessage?: string
}

type OrderStatus = 
  | "pending"
  | "processing"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "returned"`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Budget (Orçamento)
                    </h3>
                    <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`interface Budget {
  id: string
  companyId: string
  title: string
  description?: string
  status: BudgetStatus
  totalPrice: number
  totalPoints: number
  totalItems: number
  createdBy: string
  updatedBy: string
  reviewedBy?: string
  approvedBy?: string
  rejectedBy?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

type BudgetStatus = 
  | "draft"       // Rascunho
  | "submitted"   // Submetido para revisão
  | "reviewed"    // Revisado
  | "approved"    // Aprovado
  | "rejected"    // Rejeitado
  | "released"    // Liberado
  | "replicated"  // Replicado para loja`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Company (Empresa)
                    </h3>
                    <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`interface Company {
  id: string
  name: string
  slug: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  plan: "free" | "basic" | "pro" | "enterprise"
  active: boolean
  settings?: {
    currency?: {
      singular: string
      plural: string
      symbol: string
    }
    allowUserRegistration?: boolean
    requireApproval?: boolean
  }
  createdAt: string
  updatedAt: string
}`}
                    </pre>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Orçamentos */}
        <TabsContent value="orcamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Sistema de Orçamentos
              </CardTitle>
              <CardDescription>Workflow completo de aprovação de orçamentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Fluxo de Status</h3>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge>draft</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge>submitted</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge>reviewed</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge className="bg-green-600">approved</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge>released</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge className="bg-blue-600">replicated</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Ou: reviewed → <Badge variant="destructive" className="text-xs">rejected</Badge> → draft (recomeça)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Transições Válidas</h3>
                <div className="space-y-2 text-sm">
                  <div className="rounded-lg border p-3">
                    <code>draft → submitted, draft</code>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code>submitted → reviewed, submitted</code>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code>reviewed → approved, rejected, reviewed</code>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code>approved → released, approved</code>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code>rejected → draft, rejected</code>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code>released → replicated, released</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Exemplo de Criação</h3>
                <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`// POST /api/budgets
const response = await fetch('/api/budgets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    budget: {
      companyId: 'company_1',
      title: 'Orçamento Q1 2024',
      createdBy: 'user_admin'
    },
    items: [
      {
        baseProductId: 'bp_001',
        qty: 100,
        unitPrice: 25.00,
        unitPoints: 250
      }
    ]
  })
})`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Gamificação */}
        <TabsContent value="gamificacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-500" />
                Sistema de {currencyPlural}
              </CardTitle>
              <CardDescription>Pontos e níveis de gamificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Visão Geral</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {currencyPlural} é o sistema de pontos da plataforma. Usuários ganham {currencyPlural} em compras
                  e podem usá-los para descontos.
                </p>
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <p className="text-sm">
                    <strong>Regra de cashback:</strong>
                  </p>
                  <ul className="text-sm text-muted-foreground ml-6 space-y-1 list-disc">
                    <li>A cada 1 em valor gasto = 10 {currencyPlural} base</li>
                    <li>Multiplicador baseado no nível do usuário</li>
                    <li>Bronze: 1.0x | Silver: 1.1x | Gold: 1.25x</li>
                    <li>Platinum: 1.5x | Diamond: 2.0x</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Níveis de Usuário</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-amber-700">Bronze</Badge>
                      <span className="text-xs text-muted-foreground">0+ {currencyPlural}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Multiplicador: 1.0x</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-slate-400">Silver</Badge>
                      <span className="text-xs text-muted-foreground">1.000+ {currencyPlural}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Multiplicador: 1.1x</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-yellow-500">Gold</Badge>
                      <span className="text-xs text-muted-foreground">5.000+ {currencyPlural}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Multiplicador: 1.25x</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-purple-500">Platinum</Badge>
                      <span className="text-xs text-muted-foreground">15.000+ {currencyPlural}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Multiplicador: 1.5x</p>
                  </div>
                  <div className="rounded-lg border p-3 sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-cyan-400 text-black">Diamond</Badge>
                      <span className="text-xs text-muted-foreground">50.000+ {currencyPlural}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Multiplicador: 2.0x (dobro de {currencyPlural}!)</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Exemplo de Uso</h3>
                <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`// Adicionar pontos a um usuário
import { addPoints } from '@/lib/storage'

addPoints(
  userId,
  1000, // quantidade
  'Bônus de boas-vindas',
  orderNumber // opcional
)

// Deduzir pontos
import { deductPoints } from '@/lib/storage'

const success = deductPoints(
  userId,
  500,
  'Desconto no pedido #YOO-0123',
  'YOO-0123'
)`}
                </pre>
              </div>

              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Exemplo de Conversão: Valor → {currencyPlural}
                </h4>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="rounded-lg bg-background p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Valor da Compra</p>
                    <p className="text-3xl font-bold text-primary">R$ 100</p>
                  </div>
                  <div className="rounded-lg bg-background p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{currencyPlural} Ganhos (base)</p>
                    <p className="text-3xl font-bold text-green-600">1.000 {currencyPlural}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * Multiplicado pelo nível do usuário (1.0x a 2.0x)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configuração */}
        <TabsContent value="configuracao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-500" />
                Configuração e Setup
              </CardTitle>
              <CardDescription>Como configurar o sistema para produção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Variáveis de Ambiente</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Configure estas variáveis no arquivo <code>.env.local</code>:
                </p>
                <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
{`# Spree Commerce API
SPREE_API_URL=https://sua-loja.com/api/v2/storefront
SPREE_API_KEY=seu_token_oauth2_aqui
SPREE_STORE_ID=1

# Gemini API (para IA)
GEMINI_API_KEY=sua_chave_gemini

# Grok API (alternativo)
GROK_API_KEY=sua_chave_grok

# Configurações públicas
NEXT_PUBLIC_STORE_URL=https://loja.exemplo.com
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Estrutura de Diretórios</h3>
                <div className="rounded-lg border bg-muted/50 p-4 space-y-1 font-mono text-sm">
                  <div>📁 app/</div>
                  <div className="ml-4">📁 api/ - Rotas da API</div>
                  <div className="ml-8">📁 orders/, products/, budgets/, gifts/, companies/</div>
                  <div className="ml-4">📁 dashboard/ - Dashboard principal</div>
                  <div className="ml-4">📁 gestor/ - Páginas do gestor</div>
                  <div className="ml-4">📁 membro/ - Páginas do membro</div>
                  <div className="ml-4">📁 super-admin/ - Super administração</div>
                  <div className="ml-4">📁 loja/ - E-commerce</div>
                  <div>📁 lib/</div>
                  <div className="ml-4">📄 storage.ts - Storage local e tipos</div>
                  <div className="ml-4">📄 navigation.ts - Navegação por role</div>
                  <div className="ml-4">📄 spree-api.ts - Integração Spree</div>
                  <div>📁 components/</div>
                  <div className="ml-4">📁 ui/ - Componentes shadcn/ui</div>
                  <div>📁 conductor/</div>
                  <div className="ml-4">📄 product.md, tech-stack.md, CHANGELOG.md</div>
                  <div className="ml-4">📁 tracks/ - Features documentadas</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Comandos Úteis</h3>
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <code className="text-sm">./conductor.sh sync</code>
                    <p className="text-sm text-muted-foreground mt-1">Sincroniza documentação automaticamente</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code className="text-sm">./claude.sh sync</code>
                    <p className="text-sm text-muted-foreground mt-1">Sincroniza Auto Claude com Conductor</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code className="text-sm">npm run dev</code>
                    <p className="text-sm text-muted-foreground mt-1">Inicia servidor de desenvolvimento</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <code className="text-sm">npm run build</code>
                    <p className="text-sm text-muted-foreground mt-1">Build para produção</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Próximos Passos</h3>
                <ol className="space-y-2 text-sm text-muted-foreground ml-6 list-decimal">
                  <li>Configure as variáveis de ambiente no arquivo .env.local</li>
                  <li>Teste a conexão com a API do Spree usando <code>lib/spree-api.ts</code></li>
                  <li>Implemente os métodos de fetch em cada endpoint</li>
                  <li>Configure webhooks do Spree para sincronização em tempo real</li>
                  <li>Substitua o storage mock (<code>lib/storage.ts</code>) após integração completa</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
