"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Coins } from "lucide-react"
import {
  Trophy,
  Award,
  Star,
  Crown,
  Target,
  Gift,
  Zap,
  TrendingUp,
  Users,
  ShoppingBag,
  CheckCircle2,
  Download,
} from "lucide-react"
import { LEVEL_CONFIG, LEVEL_COLORS } from "@/lib/storage"

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function SnapshotsPage() {
  const mockUser = {
    name: "Ana Oliveira",
    level: "platinum",
    brents: 15800,
    totalPurchases: 35,
    achievements: 7,
  }

  const topUsers = [
    { name: "Ana Oliveira", level: "platinum", brents: 15800, purchases: 35 },
    { name: "Maria Santos", level: "gold", brents: 8200, purchases: 18 },
    { name: "Lucas Mendes", level: "gold", brents: 6500, purchases: 15 },
    { name: "João Silva", level: "gold", brents: 4500, purchases: 12 },
    { name: "Fernanda Lima", level: "silver", brents: 3200, purchases: 8 },
  ]

  const achievements = [
    { icon: "🛒", name: "Primeira Compra", description: "Realizou a primeira compra na loja", unlocked: true },
    { icon: "⭐", name: "Cliente Fiel", description: "Realizou 10 compras", unlocked: true },
    { icon: "💰", name: "Grande Gastador", description: "Gastou mais de 500 BRTS", unlocked: true },
    { icon: "🏆", name: "Mestre dos BRENTS", description: "Acumulou 5000 BRENTS", unlocked: true },
    { icon: "📦", name: "Colecionador", description: "Comprou 5 produtos diferentes", unlocked: true },
    { icon: "🚀", name: "Pioneiro", description: "Um dos primeiros 100 usuários", unlocked: false },
    { icon: "👥", name: "Embaixador", description: "Indicou 3 amigos", unlocked: false },
  ]

  const levelProgress = [
    { level: "bronze", count: 1, percentage: 12.5 },
    { level: "silver", count: 3, percentage: 37.5 },
    { level: "gold", count: 3, percentage: 37.5 },
    { level: "platinum", count: 1, percentage: 12.5 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Snapshots de Gamificação</h1>
          <p className="text-muted-foreground text-lg">
            Capturas de funcionalidades para landing page - Plataforma Yoobe
          </p>
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="font-medium mb-2">📸 Como usar estas capturas:</p>
            <p>Cada snapshot abaixo representa uma funcionalidade visual da plataforma Yoobe.</p>
            <p>Use Cmd/Ctrl + Shift + S ou Print Screen para capturar diretamente destas telas.</p>
            <p className="mt-2 text-xs">Fonte: app/snapshots - Sistema de Gamificação Yoobe Corporate Store</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Instruções para Captura
          </Button>
        </div>

        {/* Snapshot 1: User Profile Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Perfil de Usuário Gamificado</CardTitle>
                <CardDescription>Visualização de nível, BRENTS e conquistas do usuário</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Feature: User Profile
                </Badge>
                <Badge>Snapshot 1</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-primary/20 bg-white dark:bg-slate-900 p-6">
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold text-white shadow-lg">
                  AO
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{mockUser.name}</h3>
                    <div className="mt-2 flex items-center gap-3">
                      <Badge className="gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Crown className="h-3 w-3" />
                        {LEVEL_CONFIG[mockUser.level].label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{mockUser.totalPurchases} compras</span>
                      <span className="text-sm text-muted-foreground">{mockUser.achievements} conquistas</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Gift className="h-4 w-4" />
                        <span className="text-sm font-medium">BRENTS</span>
                      </div>
                      <p className="mt-2 text-3xl font-bold">{mockUser.brents.toLocaleString("pt-BR")}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm font-medium">Compras</span>
                      </div>
                      <p className="mt-2 text-3xl font-bold">{mockUser.totalPurchases}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span className="text-sm font-medium">Conquistas</span>
                      </div>
                      <p className="mt-2 text-3xl font-bold">{mockUser.achievements}/12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Snapshot 2: Achievements Grid */}
        <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sistema de Conquistas</CardTitle>
                <CardDescription>Engajamento através de achievements desbloqueáveis e badges</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Feature: Achievements
                </Badge>
                <Badge>Snapshot 2</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-primary/20 bg-white dark:bg-slate-900 p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg border p-4 transition-all",
                      achievement.unlocked
                        ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900 opacity-60",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          {achievement.unlocked && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Snapshot 3: Leaderboard */}
        <Card className="overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ranking de Usuários</CardTitle>
                <CardDescription>Competição saudável com sistema de pontos e níveis</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Feature: Leaderboard
                </Badge>
                <Badge>Snapshot 3</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-primary/20 bg-white dark:bg-slate-900 p-6">
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg border bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full font-bold text-white text-lg shadow-lg",
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                          : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500"
                            : index === 2
                              ? "bg-gradient-to-br from-amber-600 to-amber-800"
                              : "bg-gradient-to-br from-slate-400 to-slate-600",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className={LEVEL_COLORS[user.level as keyof typeof LEVEL_COLORS]}>
                          {LEVEL_CONFIG[user.level].label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{user.purchases} compras</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{user.brents.toLocaleString("pt-BR")}</p>
                      <p className="text-xs text-muted-foreground">BRENTS</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Snapshot 4: Level Distribution */}
        <Card className="overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Distribuição por Níveis</CardTitle>
                <CardDescription>Sistema de progressão com multiplicadores de pontos e rewards</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Feature: Level System
                </Badge>
                <Badge>Snapshot 4</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-primary/20 bg-white dark:bg-slate-900 p-6">
              <div className="space-y-6">
                {levelProgress.map((item) => {
                  const config = LEVEL_CONFIG[item.level as keyof typeof LEVEL_CONFIG]
                  return (
                    <div key={item.level} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.level === "diamond" && <Crown className="h-5 w-5 text-cyan-500" />}
                          {item.level === "platinum" && <Trophy className="h-5 w-5 text-purple-500" />}
                          {item.level === "gold" && <Star className="h-5 w-5 text-yellow-500" />}
                          {item.level === "silver" && <Award className="h-5 w-5 text-gray-400" />}
                          {item.level === "bronze" && <Target className="h-5 w-5 text-amber-700" />}
                          <span className="font-semibold capitalize">{config.label}</span>
                          <Badge variant="outline" className={LEVEL_COLORS[item.level as keyof typeof LEVEL_COLORS]}>
                            {config.multiplier}x BRENTS
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{item.count}</span>
                          <span className="text-sm text-muted-foreground ml-1">usuários</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-3" />
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Snapshot 5: BRENTS Economy Stats */}
        <Card className="overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Economia BRENTS</CardTitle>
                <CardDescription>Visão geral do programa de pontos, cashback e engajamento</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Feature: Points Economy
                </Badge>
                <Badge>Snapshot 5</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-primary/20 bg-white dark:bg-slate-900 p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg bg-primary p-2">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Total em Circulação</span>
                  </div>
                  <p className="text-4xl font-bold text-primary">42,150</p>
                  <p className="text-xs text-muted-foreground mt-1">BRENTS</p>
                </div>

                <div className="rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Users className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Média por Usuário</span>
                  </div>
                  <p className="text-4xl font-bold">5,269</p>
                  <p className="text-xs text-muted-foreground mt-1">BRENTS</p>
                </div>

                <div className="rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg bg-green-100 dark:bg-green-900 p-2">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">BRENTS Distribuídos</span>
                  </div>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">+56,300</p>
                  <p className="text-xs text-muted-foreground mt-1">em cashback</p>
                </div>

                <div className="rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg bg-amber-100 dark:bg-amber-900 p-2">
                      <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">BRENTS Utilizados</span>
                  </div>
                  <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">-14,150</p>
                  <p className="text-xs text-muted-foreground mt-1">em compras</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Snapshot 6: Product Showcase with Rewards */}
        <Card className="overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Catálogo de Produtos com Recompensas</CardTitle>
                <CardDescription>Produtos elegíveis com preços em BRTS e BRENTS</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Feature: Product Catalog
                </Badge>
                <Badge>Snapshot 6</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-primary/20 bg-white dark:bg-slate-900 p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    name: "Smartphone Pro 5G",
                    price: "2.499,90",
                    brents: 25000,
                    img: "/smartphone-moderno-preto.jpg",
                    tag: "5G",
                  },
                  {
                    name: "Notebook Ultra 15",
                    price: "3.899,90",
                    brents: 39000,
                    img: "/notebook-profissional-prata.jpg",
                    tag: "Premium",
                  },
                  {
                    name: "Fone Bluetooth Premium",
                    price: "499,90",
                    brents: 5000,
                    img: "/fone-ouvido-bluetooth-preto.jpg",
                    tag: "Audio",
                  },
                  {
                    name: "Smartwatch Fitness",
                    price: "899,90",
                    brents: 9000,
                    img: "/smartwatch-esportivo-preto.jpg",
                    tag: "Fitness",
                  },
                ].map((product, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square relative bg-muted">
                      <img
                        src={product.img || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 left-2 bg-primary">{product.tag}</Badge>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
                      <div className="space-y-1">
                        <p className="text-lg font-bold">{product.price} BRTS</p>
                        <p className="text-sm text-amber-600 flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          {product.brents.toLocaleString()} BRENTS
                        </p>
                      </div>
                      <Button size="sm" className="w-full">
                        Resgatar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer with references */}
        <div className="text-center space-y-3 text-sm text-muted-foreground bg-muted/30 rounded-lg p-6">
          <p className="font-semibold text-foreground">Capturas de tela da plataforma Yoobe</p>
          <p>Sistema de Gamificação Corporativa - Gestão de Engajamento e Performance</p>
          <div className="pt-3 border-t border-border/50 space-y-1">
            <p className="text-xs">📁 Fonte dos dados: lib/storage.ts (MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS)</p>
            <p className="text-xs">🎨 Componentes visuais: app/snapshots/page.tsx</p>
            <p className="text-xs">🖼️ Imagens dos produtos: public/*.jpg (geradas via AI)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
