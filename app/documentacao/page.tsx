"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { useState } from "react"

export default function DocumentacaoPage() {
  const [activeTab, setActiveTab] = useState("spree")

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentação</h1>
          <p className="mt-2 text-muted-foreground">Guia completo de integração e funcionalidades do sistema Yoobe</p>
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
            onClick={() => setActiveTab("estrutura")}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-purple-500/10 p-3">
                <Database className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold">Estrutura de Dados</p>
                <p className="text-sm text-muted-foreground">Models e Types</p>
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
                <p className="font-semibold">Endpoints</p>
                <p className="text-sm text-muted-foreground">API Routes</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => setActiveTab("configuracao")}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-amber-500/10 p-3">
                <Settings className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold">Configuração</p>
                <p className="text-sm text-muted-foreground">Setup inicial</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
            <TabsTrigger value="spree">Spree API</TabsTrigger>
            <TabsTrigger value="estrutura">Estrutura</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="configuracao">Config</TabsTrigger>
          </TabsList>

          {/* Tab: Spree Commerce Integration */}
          <TabsContent value="spree" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-500" />
                  Integração com Spree Commerce 5
                </CardTitle>
                <CardDescription>
                  O sistema foi projetado para integrar com a API do Spree Commerce 5, que já está conectado ao Tiny ERP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Visão Geral</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    O Spree Commerce é um framework e-commerce open-source que fornece APIs RESTful completas para
                    gerenciar produtos, pedidos, usuários e mais. Nossa integração utiliza estas APIs para sincronizar
                    dados.
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
                    A API do Spree utiliza tokens OAuth2 para autenticação. Configure as credenciais no arquivo de
                    ambiente:
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Data Structure */}
          <TabsContent value="estrutura" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  Estrutura de Dados
                </CardTitle>
                <CardDescription>Interfaces TypeScript baseadas nos modelos do Spree Commerce 5</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Product (Produto)
                  </h3>
                  <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
                    {`interface Product {
  id: string              // ID do Spree
  name: string            // Nome do produto
  description: string      // Descrição
  sku: string              // Código SKU
  price: number            // Preço em BRTS
  priceInBrents: number    // Preço em BRENTS
  images: string[]         // URLs das imagens
  stock: number            // Estoque disponível
  category: string         // Categoria/Taxon
  tags: string[]           // Tags para loja
  available: boolean       // Disponível para venda
  active: boolean          // Ativo no sistema
  totalSold: number        // Total vendido
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
  number: string          // Número do pedido
  state: OrderState       // Estado do pedido
  total: number           // Valor total
  userId: string          // ID do usuário
  email: string
  lineItems: LineItem[]   // Itens do pedido
  shipAddress: Address    // Endereço de entrega
  trackingNumber?: string // Código de rastreio
  paidWithBrents?: number // BRENTS utilizados
  brentsEarned?: number   // BRENTS ganhos (cashback)
  createdAt: string
  completedAt?: string
}`}
                  </pre>
                </div>

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
  address?: Address
  // Campos de Gamificação
  brents: number          // Saldo de BRENTS
  level: UserLevel        // Nível (bronze, silver, gold, platinum, diamond)
  totalPurchases: number  // Total de compras
  totalSpent: number      // Total gasto
  achievements: Achievement[]
  tags: string[]          // Tags de segmentação
  createdAt: string
  updatedAt: string
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Endpoints */}
          <TabsContent value="endpoints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-blue-500" />
                  Endpoints da API
                </CardTitle>
                <CardDescription>Rotas disponíveis no sistema para integração</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Pedidos (Orders)</h3>
                  <div className="space-y-2">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">GET</Badge>
                        <code className="text-sm">/api/orders</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Lista todos os pedidos com filtros opcionais</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">PATCH</Badge>
                        <code className="text-sm">/api/orders/:id</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Atualiza status de um pedido específico</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Produtos (Products)</h3>
                  <div className="space-y-2">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">GET</Badge>
                        <code className="text-sm">/api/products</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Lista produtos com estoque e preços</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">PATCH</Badge>
                        <code className="text-sm">/api/products/:id</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Atualiza dados de um produto</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Usuários (Users)</h3>
                  <div className="space-y-2">
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default">GET</Badge>
                        <code className="text-sm">/api/users</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Lista usuários com dados de gamificação</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">PATCH</Badge>
                        <code className="text-sm">/api/users/:id/brents</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Adiciona ou deduz BRENTS de um usuário</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Pedidos */}
          <TabsContent value="pedidos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Gestão de Pedidos
                </CardTitle>
                <CardDescription>Como os pedidos são gerenciados no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Estados de Pedido (Order States)</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <Badge className="mb-2">cart</Badge>
                      <p className="text-sm text-muted-foreground">Carrinho - pedido em criação</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <Badge className="mb-2">complete</Badge>
                      <p className="text-sm text-muted-foreground">Completo - pedido finalizado</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <Badge className="mb-2">payment</Badge>
                      <p className="text-sm text-muted-foreground">Pagamento - aguardando pagamento</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <Badge className="mb-2">canceled</Badge>
                      <p className="text-sm text-muted-foreground">Cancelado - pedido cancelado</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Estados de Envio (Shipment States)</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <Badge variant="outline" className="mb-2">
                        pending
                      </Badge>
                      <p className="text-sm text-muted-foreground">Pendente - aguardando processamento</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <Badge variant="outline" className="mb-2">
                        shipped
                      </Badge>
                      <p className="text-sm text-muted-foreground">Enviado - em transporte</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <Badge variant="outline" className="mb-2">
                        delivered
                      </Badge>
                      <p className="text-sm text-muted-foreground">Entregue - recebido pelo cliente</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Integração com Spree</h3>
                  <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
                    {`// Buscar pedidos do Spree
async function fetchOrders() {
  const response = await fetch(
    \`\${process.env.SPREE_API_URL}/orders\`,
    {
      headers: {
        'Authorization': \`Bearer \${process.env.SPREE_API_KEY}\`
      }
    }
  )
  const data = await response.json()
  
  // Transformar para formato interno
  return data.data.map(transformSpreeOrder)
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Produtos */}
          <TabsContent value="produtos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-emerald-500" />
                  Gestão de Produtos
                </CardTitle>
                <CardDescription>Sistema de produtos e estoque</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Estrutura de Produto</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Os produtos são sincronizados do Spree Commerce e incluem informações de estoque, preços e imagens.
                  </p>
                  <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Preço em BRTS</span>
                      <code className="text-sm">price: number</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Preço em BRENTS</span>
                      <code className="text-sm">priceInBrents: number</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Estoque disponível</span>
                      <code className="text-sm">stock: number</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tags de visualização</span>
                      <code className="text-sm">tags: string[]</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Sistema de Tags
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tags são usadas para categorizar e destacar produtos na loja. Exemplos: "destaque", "novo",
                    "promocao"
                  </p>
                  <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
                    {`// Adicionar tag a um produto
import { addTagToProduct } from '@/lib/storage'

addTagToProduct(productId, 'destaque')
addTagToProduct(productId, 'novo')`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Sincronização de Estoque</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    O estoque é atualizado automaticamente via webhook do Spree quando há mudanças.
                  </p>
                  <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
                    {`// app/api/webhooks/spree/route.ts
export async function POST(request: Request) {
  const payload = await request.json()
  
  if (payload.event === 'stock.updated') {
    await updateProductStock(
      payload.product_id,
      payload.new_stock
    )
  }
  
  return Response.json({ received: true })
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Usuários */}
          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Gestão de Usuários e BRENTS
                </CardTitle>
                <CardDescription>Sistema de gamificação e pontos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Sistema BRENTS
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    BRENTS é o sistema de pontos da plataforma. Usuários ganham BRENTS em compras e podem usá-los para
                    desconto.
                  </p>
                  <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                    <p className="text-sm">
                      <strong>Regra de cashback:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground ml-6 space-y-1">
                      <li>A cada 1 BRTS gasto = 10 BRENTS base</li>
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
                        <Badge>Bronze</Badge>
                        <span className="text-xs text-muted-foreground">0+ BRENTS ganhos</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Multiplicador: 1.0x</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>Silver</Badge>
                        <span className="text-xs text-muted-foreground">1.000+ BRENTS ganhos</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Multiplicador: 1.1x</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>Gold</Badge>
                        <span className="text-xs text-muted-foreground">5.000+ BRENTS ganhos</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Multiplicador: 1.25x</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>Platinum</Badge>
                        <span className="text-xs text-muted-foreground">15.000+ BRENTS ganhos</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Multiplicador: 1.5x</p>
                    </div>
                    <div className="rounded-lg border p-3 sm:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>Diamond</Badge>
                        <span className="text-xs text-muted-foreground">50.000+ BRENTS ganhos</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Multiplicador: 2.0x (dobro de BRENTS!)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Exemplo de Uso</h3>
                  <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-50 overflow-x-auto">
                    {`// Adicionar BRENTS a um usuário
import { addBrents } from '@/lib/storage'

addBrents(
  userId,
  1000, // quantidade
  'Bônus de boas-vindas',
  orderNumber // opcional
)

// Deduzir BRENTS
import { deductBrents } from '@/lib/storage'

const success = deductBrents(
  userId,
  500,
  'Desconto no pedido #YOO-0123',
  'YOO-0123'
)`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Conquistas (Achievements)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sistema de conquistas para engajamento dos usuários. Exemplos: "Primeira Compra", "Cliente Fiel",
                    "Grande Gastador".
                  </p>
                  <div className="rounded-lg border bg-primary/5 p-4">
                    <p className="text-sm">
                      <strong>💡 Dica:</strong> Configure conquistas customizadas em <code>lib/storage.ts</code> na
                      constante <code>ACHIEVEMENTS_CATALOG</code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Configuração */}
          <TabsContent value="configuracao" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-500" />
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

# Opcional: Configurações adicionais
NEXT_PUBLIC_STORE_URL=https://loja.exemplo.com
ADMIN_EMAIL=admin@exemplo.com`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Estrutura de Arquivos</h3>
                  <div className="rounded-lg border bg-muted/50 p-4 space-y-1 font-mono text-sm">
                    <div>📁 app/</div>
                    <div className="ml-4">📁 api/ - Rotas da API</div>
                    <div className="ml-8">📁 orders/ - Endpoints de pedidos</div>
                    <div className="ml-8">📁 products/ - Endpoints de produtos</div>
                    <div className="ml-8">📁 users/ - Endpoints de usuários</div>
                    <div className="ml-4">📁 dashboard/ - Dashboard principal</div>
                    <div className="ml-4">📁 pedidos/ - Gestão de pedidos</div>
                    <div className="ml-4">📁 usuarios/ - Gestão de usuários</div>
                    <div>📁 lib/</div>
                    <div className="ml-4">📄 spree-api.ts - Integração Spree</div>
                    <div className="ml-4">📄 storage.ts - Storage local (mock)</div>
                    <div>📁 components/</div>
                    <div className="ml-4">📁 ui/ - Componentes shadcn/ui</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Próximos Passos</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground ml-6 list-decimal">
                    <li>Configure as variáveis de ambiente no arquivo .env.local</li>
                    <li>
                      Teste a conexão com a API do Spree usando <code>lib/spree-api.ts</code>
                    </li>
                    <li>Implemente os métodos de fetch em cada endpoint (orders, products, users)</li>
                    <li>Configure webhooks do Spree para sincronização em tempo real</li>
                    <li>Remova o storage mock (lib/storage.ts) após integração completa</li>
                  </ol>
                </div>

                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Exemplo de Conversão: BRTS → BRENTS
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="rounded-lg bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Valor da Compra</p>
                      <p className="text-3xl font-bold text-primary">1 BRTS</p>
                    </div>
                    <div className="rounded-lg bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">BRENTS Ganhos (base)</p>
                      <p className="text-3xl font-bold text-green-600">10 BRENTS</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    * Multiplicado pelo nível do usuário (1.0x a 2.0x)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
