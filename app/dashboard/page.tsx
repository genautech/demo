"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Users,
  ShoppingBag,
  Award,
  Trophy,
  Star,
  Zap,
  Crown,
  Target,
  Gift,
  ExternalLink,
  Store,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  getUserGamificationStats,
  getProductStats,
  getOrderStats,
  LEVEL_CONFIG,
  LEVEL_COLORS,
  ORDER_STATE_LABELS,
  SHIPMENT_STATE_LABELS,
} from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userStats, setUserStats] = useState<ReturnType<typeof getUserGamificationStats> | null>(null)
  const [productStats, setProductStats] = useState<ReturnType<typeof getProductStats> | null>(null)
  const [orderStats, setOrderStats] = useState<ReturnType<typeof getOrderStats> | null>(null)

  const loadData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setUserStats(getUserGamificationStats())
      setProductStats(getProductStats())
      setOrderStats(getOrderStats())
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    loadData()
  }, [])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "diamond":
        return <Crown className="h-4 w-4" />
      case "platinum":
        return <Trophy className="h-4 w-4" />
      case "gold":
        return <Star className="h-4 w-4" />
      case "silver":
        return <Award className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard - Cliente</h1>
            <p className="mt-2 text-muted-foreground">Visão geral do sistema Yoobe</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="default" className="gap-2">
              <a href="https://priostore.yooobe.live" target="_blank" rel="noopener noreferrer">
                <Store className="h-4 w-4" />
                Ver Loja
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button onClick={loadData} variant="outline" className="gap-2 bg-transparent">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/pedidos" className="group">
            <Card className="transition-all hover:shadow-md hover:border-primary/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-xl bg-blue-500/10 p-3 group-hover:bg-blue-500/20 transition-colors">
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold">Pedidos</p>
                  <p className="text-sm text-muted-foreground">Gerenciar pedidos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/usuarios" className="group">
            <Card className="transition-all hover:shadow-md hover:border-primary/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-xl bg-purple-500/10 p-3 group-hover:bg-purple-500/20 transition-colors">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="font-semibold">Usuários</p>
                  <p className="text-sm text-muted-foreground">Gestão de BRENTS</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/produtos-cadastrados" className="group">
            <Card className="transition-all hover:shadow-md hover:border-primary/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-xl bg-emerald-500/10 p-3 group-hover:bg-emerald-500/20 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold">Produtos</p>
                  <p className="text-sm text-muted-foreground">Catálogo de produtos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/documentacao" className="group">
            <Card className="transition-all hover:shadow-md hover:border-primary/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-xl bg-amber-500/10 p-3 group-hover:bg-amber-500/20 transition-colors">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold">Documentação</p>
                  <p className="text-sm text-muted-foreground">Guia de integração</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pedidos</CardTitle>
              <div className="rounded-lg bg-blue-500 p-2">
                <Package className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  orderStats?.total || 0
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{orderStats?.stateCounts?.complete || 0} completos</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Ativos</CardTitle>
              <div className="rounded-lg bg-purple-500 p-2">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  Object.values(userStats?.levelCounts || {}).reduce((a, b) => a + b, 0)
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {userStats?.totalBrents?.toLocaleString("pt-BR")} BRENTS total
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Produtos</CardTitle>
              <div className="rounded-lg bg-emerald-500 p-2">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  productStats?.totalProducts || 0
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{productStats?.totalSold || 0} vendidos</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
              <div className="rounded-lg bg-green-500 p-2">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  `${(orderStats?.totalRevenue || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRTS`
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Ticket médio: {(orderStats?.averageOrderValue || 0).toFixed(2)} BRTS
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gamification Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Levels Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Distribuição por Nível
              </CardTitle>
              <CardDescription>Gamificação dos usuários por tier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userStats &&
                Object.entries(userStats.levelCounts).map(([level, count]) => {
                  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]
                  const total = Object.values(userStats.levelCounts).reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? (count / total) * 100 : 0

                  return (
                    <div key={level} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getLevelIcon(level)}
                          <span className="font-medium capitalize">{config.label}</span>
                          <Badge variant="outline" className={LEVEL_COLORS[level as keyof typeof LEVEL_COLORS]}>
                            {config.multiplier}x BRENTS
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{count} usuários</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
            </CardContent>
          </Card>

          {/* Top Users Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Ranking BRENTS
              </CardTitle>
              <CardDescription>Top 5 usuários com mais BRENTS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats?.topUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full font-bold text-white",
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : index === 2
                              ? "bg-amber-600"
                              : "bg-gray-300",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={LEVEL_COLORS[user.level]}>
                          {LEVEL_CONFIG[user.level].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{user.totalPurchases} compras</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{user.brents.toLocaleString("pt-BR")}</p>
                      <p className="text-xs text-muted-foreground">BRENTS</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders and Products Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Order Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Status dos Pedidos
              </CardTitle>
              <CardDescription>Distribuição por estado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {orderStats &&
                  Object.entries(orderStats.stateCounts).map(([state, count]) => (
                    <div key={state} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm font-medium">
                        {ORDER_STATE_LABELS[state as keyof typeof ORDER_STATE_LABELS] || state}
                      </span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
              </div>

              {orderStats && Object.keys(orderStats.shipmentCounts).length > 0 && (
                <>
                  <div className="my-4 border-t" />
                  <p className="mb-3 text-sm font-medium text-muted-foreground">Status de Envio</p>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(orderStats.shipmentCounts).map(([state, count]) => (
                      <div key={state} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-sm font-medium">
                          {SHIPMENT_STATE_LABELS[state as keyof typeof SHIPMENT_STATE_LABELS] || state}
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Produtos Mais Vendidos
              </CardTitle>
              <CardDescription>Top 5 produtos por vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productStats?.topSelling.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{product.price.toFixed(2)} BRTS</span>
                        <span className="text-xs text-primary">{product.priceInBrents} BRENTS</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{product.totalSold}</p>
                      <p className="text-xs text-muted-foreground">vendidos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BRENTS Economy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Economia BRENTS
            </CardTitle>
            <CardDescription>Visão geral do programa de pontos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                <p className="text-sm font-medium text-muted-foreground">Total em Circulação</p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {userStats?.totalBrents?.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground">BRENTS</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Média por Usuário</p>
                <p className="mt-2 text-2xl font-bold">{userStats?.averageBrents?.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-muted-foreground">BRENTS</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">BRENTS Distribuídos</p>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  +{orderStats?.totalBrentsEarned?.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground">em cashback</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">BRENTS Utilizados</p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  -{orderStats?.totalBrentsSpent?.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground">em compras</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Pedidos Recentes
            </CardTitle>
            <CardDescription>Últimos pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : orderStats?.recentOrders && orderStats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {orderStats.recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {order.shipAddress?.firstname} {order.shipAddress?.lastname}
                        </p>
                        <p className="text-sm text-muted-foreground">Pedido #{order.number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          order.state === "complete"
                            ? "bg-green-100 text-green-800"
                            : order.state === "canceled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800",
                        )}
                      >
                        {ORDER_STATE_LABELS[order.state]}
                      </Badge>
                      <p className="mt-1 text-sm font-medium">{order.total.toFixed(2)} BRTS</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Nenhum pedido encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
