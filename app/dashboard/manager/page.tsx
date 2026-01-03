"use client"

import { motion } from "framer-motion"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  RefreshCw,
  Users,
  ShoppingBag,
  Book,
  Zap,
  ExternalLink,
  Box,
  Trophy,
  Crown,
  Award,
  TrendingUp,
  CheckCircle2,
  Settings,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  getUserGamificationStats,
  getProductStats,
  getOrderStats,
  getUsers,
  LEVEL_CONFIG,
  ORDER_STATE_LABELS,
  SHIPMENT_STATE_LABELS,
  getTransactions,
  getCurrencyName,
  type PointsTransaction
} from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { LandingDashboard } from "@/components/landing/landing-dashboard"
import { ApprovalWorkflowWidget } from "@/components/gestor/approval-workflow-widget"

export default function ManagerDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [userStats, setUserStats] = useState<ReturnType<typeof getUserGamificationStats> | null>(null)
  const [productStats, setProductStats] = useState<ReturnType<typeof getProductStats> | null>(null)
  const [orderStats, setOrderStats] = useState<ReturnType<typeof getOrderStats> | null>(null)
  const [transactions, setTransactions] = useState<PointsTransaction[]>([])
  const [companyId, setCompanyId] = useState<string>("company_1")

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch {}
    }
  }, [])

  const loadData = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      setUserStats(getUserGamificationStats())
      setProductStats(getProductStats())
      setOrderStats(getOrderStats())
      setTransactions(getTransactions())
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    loadData()
  }, [])

  const completeOrders = orderStats?.stateCounts?.complete || 0
  const totalOrders = orderStats?.total || 0
  const activeUsers = getUsers().length
  const totalPoints = userStats?.totalPoints || 0
  const totalProducts = productStats?.totalProducts || 0
  const totalSold = productStats?.totalSold || 0
  const totalRevenue = orderStats?.totalRevenue || 0
  const averageTicket = orderStats?.averageOrderValue || 0

  const pointsDistributed = transactions
    .filter(t => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0)
  const pointsUsed = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0)

  const levelDistribution = Object.entries(LEVEL_CONFIG).map(([level, config]) => ({
    level: level as keyof typeof LEVEL_CONFIG,
    label: config.label,
    multiplier: config.multiplier,
    count: userStats?.levelCounts[level as keyof typeof userStats.levelCounts] || 0,
    color: config.color,
  }))

  const topUsers = userStats?.topUsers || []
  const topProducts = productStats?.topSelling || []

  const orderStatusData = {
    estado: {
      completo: orderStats?.stateCounts?.complete || 0,
      cancelado: orderStats?.stateCounts?.canceled || 0,
      pendente: orderStats?.stateCounts?.pending || orderStats?.stateCounts?.cart || 0,
    },
    confirmacao: {
      confirmacao: orderStats?.stateCounts?.confirm || 0,
      pagamento: orderStats?.stateCounts?.payment || 0,
      pronto: orderStats?.shipmentCounts?.ready || 0,
    },
    envio: {
      entregue: orderStats?.shipmentCounts?.delivered || 0,
      enviado: orderStats?.shipmentCounts?.shipped || 0,
    },
  }

  const recentOrders = orderStats?.recentOrders.slice(0, 5) || []

  return (
    <PageContainer className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard - Cliente</h1>
            <p className="mt-1 text-muted-foreground">Visão geral do sistema Yoobe.</p>
          </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/loja" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Ver Loja
            </Link>
          </Button>
          <Button onClick={loadData} variant="outline" disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-tour="shortcuts">
        {[
          { href: "/gestor/orders", icon: Package, label: "Pedidos", desc: "Gerenciar pedidos", color: "blue" },
          { href: "/gestor/usuarios", icon: Users, label: "Usuários", desc: `Gestão de ${getCurrencyName(companyId, true)}`, color: "purple" },
          { href: "/gestor/produtos-cadastrados", icon: ShoppingBag, label: "Produtos", desc: "Catálogo de produtos", color: "green" },
          { href: "/documentacao", icon: Zap, label: "Documentação", desc: "Guia de integração", color: "yellow" },
        ].map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={item.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-border/50 hover:border-primary/20 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-3 rounded-lg transition-all group-hover:scale-110 bg-primary/10"
                      whileHover={{ rotate: 5 }}
                    >
                      <item.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <LandingDashboard companyId={companyId} />

      {/* Approval Workflow Widget */}
      <ApprovalWorkflowWidget companyId={companyId} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-tour="metrics">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">{completeOrders} completos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalSold} vendidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {getCurrencyName(companyId, true).toUpperCase()}</div>
            <p className="text-xs text-muted-foreground mt-1">Ticket médio: {averageTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {getCurrencyName(companyId, true).toUpperCase()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Pedidos ao Longo do Tempo
            </CardTitle>
            <CardDescription>Evolução de pedidos nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { name: "Seg", pedidos: 12 },
                { name: "Ter", pedidos: 19 },
                { name: "Qua", pedidos: 15 },
                { name: "Qui", pedidos: 22 },
                { name: "Sex", pedidos: 18 },
                { name: "Sáb", pedidos: 25 },
                { name: "Dom", pedidos: totalOrders },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pedidos" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Distribuição de {getCurrencyName(companyId, true)} por Nível
            </CardTitle>
            <CardDescription>Distribuição de usuários por tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={levelDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ label, count }) => `${label}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {levelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Produtos Mais Vendidos
          </CardTitle>
          <CardDescription>Top 5 produtos por volume de vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts.slice(0, 5).map(p => ({ name: p.name.substring(0, 20), vendas: p.totalSold || 0 }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="hover:shadow-md transition-shadow border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Distribuição por Nível
              </CardTitle>
              <CardDescription>Gamificação dos usuários por tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {levelDistribution.map((level, index) => (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{level.label}</span>
                        <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5">
                          {level.multiplier}x {getCurrencyName(companyId, true)}
                        </Badge>
                      </div>
                      <span className="font-bold">{level.count} usuários</span>
                    </div>
                    <Progress 
                      value={activeUsers > 0 ? (level.count / activeUsers) * 100 : 0} 
                      className="h-2"
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="hover:shadow-md transition-shadow border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Ranking {getCurrencyName(companyId, true).toUpperCase()}
              </CardTitle>
              <CardDescription>Top 5 usuários com mais {getCurrencyName(companyId, true)}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topUsers.map((user, idx) => {
                  const levelConfig = LEVEL_CONFIG[user.level]
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-bold">
                        #{idx + 1}
                      </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {levelConfig.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {user.totalPurchases || 0} compras
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{(user.points || 0).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}</p>
                    </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status dos Pedidos</CardTitle>
            <CardDescription>Distribuição por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Estado:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Completo ({orderStatusData.estado.completo})</Badge>
                  <Badge variant="outline">Cancelado ({orderStatusData.estado.cancelado})</Badge>
                  <Badge variant="outline">Pendente ({orderStatusData.estado.pendente})</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Confirmação:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Confirmação ({orderStatusData.confirmacao.confirmacao})</Badge>
                  <Badge variant="outline">Pagamento ({orderStatusData.confirmacao.pagamento})</Badge>
                  <Badge variant="outline">Pronto ({orderStatusData.confirmacao.pronto})</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Status de Envio:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Entregue ({orderStatusData.envio.entregue})</Badge>
                  <Badge variant="outline">Enviado ({orderStatusData.envio.enviado})</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top 5 produtos por vendas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-primary">
                        {product.priceInPoints?.toLocaleString("pt-BR")} {getCurrencyName(companyId, true).toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({product.priceInPoints ? (product.priceInPoints * 10).toLocaleString("pt-BR") : 0} {getCurrencyName(companyId, true)})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{product.totalSold || 0} vendidos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Economia {getCurrencyName(companyId, true).toUpperCase()}</CardTitle>
          <CardDescription>Visão geral do programa de pontos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg border">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total em Circulação</p>
              <p className="text-2xl font-bold text-primary">{totalPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm font-medium text-muted-foreground mb-1">Média por Usuário</p>
              <p className="text-2xl font-bold">
                {activeUsers > 0 ? Math.round(totalPoints / activeUsers).toLocaleString("pt-BR") : 0} {getCurrencyName(companyId, true)}
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm font-medium text-muted-foreground mb-1">{getCurrencyName(companyId, true).toUpperCase()} Distribuídos</p>
              <p className="text-2xl font-bold text-primary">
                +{pointsDistributed.toLocaleString("pt-BR")} <span className="text-sm">em cashback</span>
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm font-medium text-muted-foreground mb-1">{getCurrencyName(companyId, true).toUpperCase()} Utilizados</p>
              <p className="text-2xl font-bold text-red-600">
                -{pointsUsed.toLocaleString("pt-BR")} <span className="text-sm">em compras</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Últimos pedidos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const statusLabel = ORDER_STATE_LABELS[order.state as keyof typeof ORDER_STATE_LABELS] || order.state
              return (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Box className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {order.shipAddress?.firstname} {order.shipAddress?.lastname} Pedido #{order.number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{statusLabel}</Badge>
                    <p className="text-sm font-bold">{(order.total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {getCurrencyName(companyId, true).toUpperCase()}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Análise de Equipe
            </CardTitle>
            <CardDescription>Métricas de produtividade e engajamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Taxa de Ativação</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">94.2%</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">+3.1% vs mês anterior</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Pontos Médios</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">2,847</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Por usuário ativo</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nível de Engajamento</span>
                  <span className="text-sm font-bold text-primary">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-semibold mb-3">Top Performers - Equipe</h4>
                <div className="space-y-2">
                  {topUsers.slice(0, 3).map((user, idx) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.totalPurchases || 0} resgates • {user.points || 0} pontos
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {LEVEL_CONFIG[user.level].label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Projeções de Crescimento
            </CardTitle>
            <CardDescription>Análise preditiva para próximos 90 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[
                { periodo: "Hoje", usuarios: activeUsers, pedidos: totalOrders, receita: totalRevenue },
                { periodo: "+30d", usuarios: Math.round(activeUsers * 1.08), pedidos: Math.round(totalOrders * 1.12), receita: Math.round(totalRevenue * 1.15) },
                { periodo: "+60d", usuarios: Math.round(activeUsers * 1.18), pedidos: Math.round(totalOrders * 1.25), receita: Math.round(totalRevenue * 1.32) },
                { periodo: "+90d", usuarios: Math.round(activeUsers * 1.25), pedidos: Math.round(totalOrders * 1.38), receita: Math.round(totalRevenue * 1.48) },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} name="Usuários" />
                <Line type="monotone" dataKey="pedidos" stroke="#10b981" strokeWidth={2} name="Pedidos" />
                <Line type="monotone" dataKey="receita" stroke="#f59e0b" strokeWidth={2} name="Receita (R$)" />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Crescimento Usuários</p>
                <p className="text-sm font-bold text-blue-600">+25%</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Crescimento Pedidos</p>
                <p className="text-sm font-bold text-green-600">+38%</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Crescimento Receita</p>
                <p className="text-sm font-bold text-orange-600">+48%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Workflow de Aprovações
          </CardTitle>
          <CardDescription>Pedidos pendentes de aprovação manual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Aprovações Pendentes</h4>
              {[
                { id: "REQ001", user: "João Silva", item: "Notebook Profissional", value: 2500, urgency: "high" },
                { id: "REQ002", user: "Maria Santos", item: "Mouse Gamer RGB", value: 180, urgency: "medium" },
                { id: "REQ003", user: "Pedro Costa", item: "Power Bank", value: 120, urgency: "low" },
              ].map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{req.item}</p>
                      <p className="text-xs text-muted-foreground">{req.user} • {req.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={req.urgency === "high" ? "destructive" : req.urgency === "medium" ? "default" : "secondary"}>
                      {req.urgency === "high" ? "Alta" : req.urgency === "medium" ? "Média" : "Baixa"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Estatísticas de Aprovação</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-lg bg-green-50 dark:bg-green-950">
                  <span className="text-sm">Aprovados Hoje</span>
                  <span className="text-sm font-bold text-green-600">12</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                  <span className="text-sm">Pendentes</span>
                  <span className="text-sm font-bold text-yellow-600">8</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-red-50 dark:bg-red-950">
                  <span className="text-sm">Rejeitados Hoje</span>
                  <span className="text-sm font-bold text-red-600">2</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <span className="text-sm">Tempo Médio</span>
                  <span className="text-sm font-bold text-blue-600">2.4h</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Ações Rápidas</h4>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aprovar Selecionados
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Revisar Fila
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Ver Histórico
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Regras
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </PageContainer>
  )
}