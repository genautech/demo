"use client"

import { motion } from "framer-motion"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Award,
  Trophy,
  Star,
  Zap,
  Crown,
  ExternalLink,
  Store,
  Wallet,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  getUserById,
  getUserOrders,
  getUserGamificationStats,
  LEVEL_CONFIG,
  LEVEL_COLORS,
  ORDER_STATE_LABELS,
  ACHIEVEMENTS_CATALOG,
  getCurrencyName,
  type User,
  type Order,
} from "@/lib/storage"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function MemberDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [topUsers, setTopUsers] = useState<User[]>([])
  const [companyId, setCompanyId] = useState<string>("company_1")

  const loadData = () => {
    setIsLoading(true)
    const authData = localStorage.getItem("yoobe_auth")
    let userId: string | null = null
    let companyIdValue: string = "company_1"

    if (authData) {
      try {
        const auth = JSON.parse(authData)
        userId = auth.userId || null
        companyIdValue = auth.companyId || "company_1"
        setCompanyId(companyIdValue)
      } catch (e) {
        console.error("Error parsing auth data", e)
      }
    }

    if (!userId) {
      setIsLoading(false)
      return
    }

    const user = getUserById(userId)
    setCurrentUser(user)
    const orders = getUserOrders(userId)
    setMyOrders(orders)
    const gamificationStats = getUserGamificationStats()
    setTopUsers(gamificationStats.topUsers || [])

    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    // Inicializar companyId imediatamente
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch (e) {
        // Ignorar erro, usar padrão
      }
    }
    loadData()
  }, [])

  const nextLevel = currentUser?.level === 'diamond' ? null : 
    currentUser?.level === 'platinum' ? 'diamond' :
    currentUser?.level === 'gold' ? 'platinum' :
    currentUser?.level === 'silver' ? 'gold' : 'silver';

  const nextLevelConfig = nextLevel ? LEVEL_CONFIG[nextLevel as keyof typeof LEVEL_CONFIG] : null;
  const currentLevelConfig = currentUser?.level ? LEVEL_CONFIG[currentUser.level as keyof typeof LEVEL_CONFIG] : LEVEL_CONFIG.bronze;
  
  const progress = nextLevelConfig 
    ? ((currentUser?.points || 0) / nextLevelConfig.minPoints) * 100 
    : 100;

  return (
    <PageContainer className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {currentUser?.firstName || "Membro"}! 👋
          </h1>
          <p className="text-muted-foreground">Você tem novos brindes esperando por você na loja.</p>
        </div>

        {/* Engagement Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Points Card */}
          <Card className="md:col-span-2 border shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 opacity-5">
              <Wallet className="h-40 w-40 rotate-12 text-primary" />
            </div>
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Saldo Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-foreground">{(currentUser?.points || 0).toLocaleString("pt-BR")}</span>
                <span className="text-xl font-semibold text-muted-foreground">{getCurrencyName(companyId || "company_1", true).toUpperCase()}</span>
              </div>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Progresso para {nextLevelConfig?.label || "Nível Máximo"}</span>
                  <span className="font-semibold text-foreground">{(progress || 0).toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {nextLevelConfig 
                    ? `Faltam ${(nextLevelConfig.minPoints - (currentUser?.points || 0)).toLocaleString("pt-BR")} ${getCurrencyName(companyId || "company_1", true)} para o próximo nível!`
                    : "Você atingiu o nível máximo! Aproveite os benefícios."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4">
            <Button asChild className="h-full flex-col gap-3 py-8 group shadow-sm hover:shadow-md transition-shadow">
              <Link href="/loja">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">Ir para a Loja</p>
                  <p className="text-xs text-muted-foreground font-medium">RESGATAR BRINDES</p>
                </div>
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Suas Conquistas
                  </CardTitle>
                  <CardDescription>Badge de reconhecimento e gamificação</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {currentUser?.achievements?.map((ach: any, idx: number) => (
                    <motion.div
                      key={ach.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl border border-primary/20 hover:scale-110 transition-transform shadow-sm">
                        {ach.icon}
                      </div>
                      <span className="text-xs font-medium text-center uppercase leading-tight">{ach.name}</span>
                    </motion.div>
                  ))}
                  {(!currentUser?.achievements || currentUser.achievements.length < 4) && (
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-2xl border border-dashed border-border">
                        🔒
                      </div>
                      <span className="text-xs font-medium text-center uppercase text-muted-foreground">Bloqueado</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Últimos Resgates</CardTitle>
                  <CardDescription>Seus pedidos realizados recentemente</CardDescription>
                </div>
                <Button asChild variant="link" className="text-xs p-0 h-auto">
                  <Link href="/membro/pedidos">Ver todos</Link>
                </Button>
              </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[150px]">
                          {order.lineItems[0]?.name || "Brinde"}
                        </p>
                        <p className="text-xs text-muted-foreground">#{order.number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={order.state === 'complete' ? 'default' : 'secondary'} className="text-xs">
                        {ORDER_STATE_LABELS[order.state as keyof typeof ORDER_STATE_LABELS]?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
                {myOrders.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">Você ainda não realizou nenhum resgate.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Histórico de Atividades
              </CardTitle>
              <CardDescription>Evolução de {getCurrencyName(companyId || "company_1", true)} nos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { dia: "Seg", pontos: (currentUser?.points || 0) - 500 },
                  { dia: "Ter", pontos: (currentUser?.points || 0) - 400 },
                  { dia: "Qua", pontos: (currentUser?.points || 0) - 300 },
                  { dia: "Qui", pontos: (currentUser?.points || 0) - 200 },
                  { dia: "Sex", pontos: (currentUser?.points || 0) - 100 },
                  { dia: "Sáb", pontos: (currentUser?.points || 0) - 50 },
                  { dia: "Dom", pontos: currentUser?.points || 0 },
                ]}>
                  <defs>
                    <linearGradient id="colorPontos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="pontos" stroke="#10b981" fillOpacity={1} fill="url(#colorPontos)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    Ranking de {getCurrencyName(companyId || "company_1", true).toUpperCase()}
                  </CardTitle>
                  <CardDescription>Top 5 membros com mais {getCurrencyName(companyId || "company_1", true)}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topUsers.slice(0, 5).map((user, idx) => {
                  const levelConfig = LEVEL_CONFIG[user.level]
                  const isCurrentUser = user.id === currentUser?.id
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        isCurrentUser
                          ? "bg-primary/10 border-primary/30 shadow-sm"
                          : "border-border hover:border-primary/20 hover:bg-primary/5",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                          idx === 0 && "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white",
                          idx === 1 && "bg-gradient-to-br from-gray-300 to-gray-500 text-white",
                          idx === 2 && "bg-gradient-to-br from-amber-600 to-amber-800 text-white",
                          idx > 2 && "bg-primary/10 text-primary",
                        )}
                      >
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0">
                              Você
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5">
                            {levelConfig.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{user.totalPurchases} compras</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{user.points.toLocaleString("pt-BR")}</p>
                        <p className="text-xs text-muted-foreground">{getCurrencyName(companyId || "company_1", true)}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
  )
}
