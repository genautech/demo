"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  Zap, 
  TrendingUp, 
  Gift, 
  Star,
  Award,
  Target,
  Sparkles,
  Crown,
  Medal,
  Flame,
  CheckCircle2,
  Users,
  ArrowUp,
} from "lucide-react"
import { getUserById, getUserOrders, getUserGamificationStats, LEVEL_CONFIG, getCurrencyName, type User, type Order, type Env, type UserLevel } from "@/lib/storage"
import { eventBus } from "@/lib/eventBus"
import { UserStats } from "@/components/gamification/UserStats"
import { AchievementBadge, AchievementList } from "@/components/gamification/AchievementBadge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { PageContainer } from "@/components/page-container"

const LEVEL_CONFIG_LOCAL = {
  bronze: { label: "Bronze", color: "#CD7F32", minPoints: 0, icon: Medal },
  silver: { label: "Prata", color: "#C0C0C0", minPoints: 1000, icon: Star },
  gold: { label: "Ouro", color: "#FFD700", minPoints: 5000, icon: Trophy },
  platinum: { label: "Platina", color: "#E5E4E2", minPoints: 15000, icon: Crown },
  diamond: { label: "Diamante", color: "#B9F2FF", minPoints: 50000, icon: Sparkles },
}

const ACHIEVEMENTS = [
  {
    id: "first_purchase",
    name: "Primeira Compra",
    description: "Realize sua primeira compra na loja",
    icon: "🎁",
    condition: (orders: Order[]) => orders.length >= 1,
  },
  {
    id: "bronze_collector",
    name: "Colecionador Bronze",
    description: "Realize 5 compras",
    icon: "🥉",
    condition: (orders: Order[]) => orders.length >= 5,
  },
  {
    id: "silver_collector",
    name: "Colecionador Prata",
    description: "Realize 10 compras",
    icon: "🥈",
    condition: (orders: Order[]) => orders.length >= 10,
  },
  {
    id: "gold_collector",
    name: "Colecionador Ouro",
    description: "Realize 25 compras",
    icon: "🥇",
    condition: (orders: Order[]) => orders.length >= 25,
  },
  {
    id: "big_spender",
    name: "Grande Comprador",
    description: "Gaste mais de 10.000 pontos",
    icon: "💰",
    condition: (orders: Order[]) => orders.reduce((sum, o) => sum + (o.paidWithPoints || 0), 0) >= 10000,
  },
  {
    id: "early_bird",
    name: "Madrugador",
    description: "Faça uma compra antes das 8h",
    icon: "🌅",
    condition: (orders: Order[]) => {
      const now = new Date()
      return now.getHours() < 8 && orders.length > 0
    },
  },
  {
    id: "loyal_customer",
    name: "Cliente Fiel",
    description: "Compre pelo menos uma vez por mês por 3 meses",
    icon: "💎",
    condition: (orders: Order[]) => {
      if (orders.length < 3) return false
      const sorted = orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      const first = new Date(sorted[0].createdAt)
      const last = new Date(sorted[sorted.length - 1].createdAt)
      const months = (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24 * 30)
      return months >= 3
    },
  },
]

// Podium Component for Leaderboard - Theme Aware
function PodiumLeaderboard({ topUsers, currentUserId, companyId }: { topUsers: any[]; currentUserId: string; companyId: string }) {
  const top3 = topUsers.slice(0, 3)
  const others = topUsers.slice(3)

  return (
    <div className="space-y-6">
      {/* Top 3 Podium - Theme Aware */}
      <div className="flex items-end justify-center gap-4 sm:gap-6 pb-8">
        {top3.map((user, idx) => {
          const isCurrentUser = user.id === currentUserId
          const heights = [80, 120, 100] // 2nd, 1st, 3rd place heights
          const order = idx === 0 ? 1 : idx === 1 ? 0 : 2
          const height = heights[order]
          const levelConfig = LEVEL_CONFIG[user.level as UserLevel]
          
          // Differentiated colors for each position using theme colors
          const podiumStyles = {
            0: { emoji: "🥇", bgClass: "bg-yellow-500", borderClass: "border-yellow-400", textClass: "text-yellow-600" },
            1: { emoji: "🥈", bgClass: "bg-gray-400", borderClass: "border-gray-300", textClass: "text-gray-500" },
            2: { emoji: "🥉", bgClass: "bg-orange-500", borderClass: "border-orange-400", textClass: "text-orange-600" },
          }
          const styles = podiumStyles[order as keyof typeof podiumStyles]
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.15, type: "spring", stiffness: 150 }}
              className={cn(
                "flex flex-col items-center gap-2 relative",
                order === 0 && "order-2 z-10", // 1st place in center
                order === 1 && "order-1", // 2nd place on left
                order === 2 && "order-3", // 3rd place on right
              )}
            >
              <div className="flex flex-col items-center gap-2 mb-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4",
                    styles.borderClass,
                    isCurrentUser && "ring-4 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  style={{ backgroundColor: levelConfig.color }}
                >
                  <span className="text-2xl font-bold">
                    {styles.emoji}
                  </span>
                </motion.div>
                <div className="text-center">
                  <p className="font-bold text-sm text-foreground">{user.firstName}</p>
                  <p className="text-xs text-muted-foreground">{levelConfig.label}</p>
                </div>
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ delay: idx * 0.15 + 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
                className={cn(
                  "w-20 rounded-t-xl flex items-end justify-center p-2 shadow-lg border-2",
                  styles.bgClass,
                  styles.borderClass
                )}
                style={{ minHeight: height }}
              >
                <span className="text-white font-bold text-lg drop-shadow">{user.points.toLocaleString("pt-BR")}</span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Other Rankings */}
      {others.length > 0 && (
        <div className="space-y-2">
          {others.map((user, idx) => {
            const isCurrentUser = user.id === currentUserId
            const levelConfig = LEVEL_CONFIG[user.level as UserLevel]
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  isCurrentUser
                    ? "bg-primary/10 border-primary/30 shadow-md"
                    : "bg-card border-border hover:bg-muted/50"
                )}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-sm font-bold text-muted-foreground">
                  #{idx + 4}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs">Você</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs" style={{ borderColor: levelConfig.color, color: levelConfig.color }}>
                      {levelConfig.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{user.totalPurchases} compras</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{user.points.toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-muted-foreground">{getCurrencyName(companyId, true)}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function GamificacaoPage() {
  const { theme } = useTheme()
  const isFunMode = theme === "fun"
  const [user, setUser] = useState<User | null>(null)
  
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/ee00b1e8-6ae6-4400-b41b-dcd87ce152a0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gamificacao/page.tsx:GamificacaoPage',message:'Theme detection',data:{theme,isFunMode,documentClass:typeof document!=='undefined'?document.documentElement.className:'SSR'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,D'})}).catch(()=>{});
  }, [theme, isFunMode])
  // #endregion
  const [orders, setOrders] = useState<Order[]>([])
  const [earnedAchievements, setEarnedAchievements] = useState<any[]>([])
  const [topUsers, setTopUsers] = useState<any[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [companyId, setCompanyId] = useState<string>("company_1")

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      const auth = JSON.parse(authData)
      if (auth.companyId) {
        setCompanyId(auth.companyId)
      }
      const currentUser = getUserById(auth.userId)
      if (currentUser) {
        setUser(currentUser)
        const userOrders = getUserOrders(currentUser.id)
        setOrders(userOrders)
        checkAchievements(currentUser, userOrders)
        
        // Get leaderboard data
        const stats = getUserGamificationStats()
        setTopUsers(stats.topUsers)
        
        // Calculate user rank
        const sortedUsers = [...stats.topUsers].sort((a, b) => b.points - a.points)
        const rank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1
        setUserRank(rank > 0 ? rank : null)
      }
    }
  }, [])

  const checkAchievements = (currentUser: User, userOrders: Order[]) => {
    const earned: any[] = []
    
    ACHIEVEMENTS.forEach((achievement) => {
      if (achievement.condition(userOrders)) {
        // Check if already earned
        const alreadyEarned = currentUser.achievements?.find(a => a.id === achievement.id)
        if (!alreadyEarned) {
          earned.push({
            ...achievement,
            earnedAt: new Date().toISOString(),
          })
          // Trigger celebration for new achievement
          eventBus.emit("sandbox" as Env, "achievement.unlocked" as any, achievement)
        } else {
          earned.push(alreadyEarned)
        }
      }
    })

    setEarnedAchievements(earned)
  }

  if (!user) return null

  const levelConfig = LEVEL_CONFIG_LOCAL[user.level as keyof typeof LEVEL_CONFIG_LOCAL]
  const nextLevel = getNextLevel(user.level as keyof typeof LEVEL_CONFIG_LOCAL)
  const nextLevelConfig = LEVEL_CONFIG_LOCAL[nextLevel]
  const currentMin = levelConfig.minPoints
  const nextMin = nextLevelConfig.minPoints
  const range = nextMin - currentMin
  const progress = range > 0 ? ((user.totalPointsEarned - currentMin) / range) * 100 : 100
  const pointsToNext = nextMin - user.totalPointsEarned

  const stats = {
    totalPurchases: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + (o.paidWithPoints || 0), 0),
    averageOrder: orders.length > 0 
      ? orders.reduce((sum, o) => sum + (o.paidWithPoints || 0), 0) / orders.length 
      : 0,
    favoriteCategory: getFavoriteCategory(orders),
  }

  // Standard Mode View (Corporate)
  if (!isFunMode) {
    return (
      <PageContainer className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" data-tour="gamification">
            <Trophy className="h-8 w-8 text-primary" />
            Minha Jornada
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe seu progresso e conquistas na loja
          </p>
        </div>

        {/* Level Card */}
        <Card className="bg-linear-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: levelConfig.color }}
                >
                  <levelConfig.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{levelConfig.label}</div>
                  <CardDescription>Nível Atual</CardDescription>
                </div>
              </CardTitle>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                {user.points.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progresso para {nextLevelConfig.label}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {pointsToNext > 0 
                  ? `${pointsToNext.toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)} para o próximo nível`
                  : "Você alcançou o nível máximo! 🎉"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Compras</p>
                  <p className="text-2xl font-bold">{stats.totalPurchases}</p>
                </div>
                <Gift className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                  <p className="text-2xl font-bold">{stats.totalSpent.toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-muted-foreground">{getCurrencyName(companyId, true)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                  <p className="text-2xl font-bold">{Math.round(stats.averageOrder).toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-muted-foreground">{getCurrencyName(companyId, true)}</p>
                </div>
                <Target className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conquistas</p>
                  <p className="text-2xl font-bold">{earnedAchievements.length}</p>
                  <p className="text-xs text-muted-foreground">de {ACHIEVEMENTS.length}</p>
                </div>
                <Award className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Conquistas
            </CardTitle>
            <CardDescription>
              Complete desafios e desbloqueie conquistas exclusivas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {earnedAchievements.length === 0 ? (
              <div className="py-8 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma conquista desbloqueada ainda</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Continue comprando para desbloquear suas primeiras conquistas!
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {earnedAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.earnedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Conquistado em {new Date(achievement.earnedAt).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Conquistado
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Locked Achievements Preview */}
            {earnedAchievements.length < ACHIEVEMENTS.length && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4 text-muted-foreground">Conquistas Disponíveis</h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {ACHIEVEMENTS.filter(a => !earnedAchievements.find(ea => ea.id === a.id)).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-3 rounded-lg border bg-muted/30 opacity-60"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
              <CardDescription>Suas últimas compras e resgates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Gift className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Pedido #{order.number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {order.paidWithPoints?.toLocaleString("pt-BR") || 0} {getCurrencyName(companyId, true)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </PageContainer>
    )
  }

  // Fun Mode View - Uses theme CSS variables with enhanced animations
  // #region agent log
  if (typeof window !== 'undefined') {
    const rootStyles = getComputedStyle(document.documentElement);
    fetch('http://127.0.0.1:7244/ingest/ee00b1e8-6ae6-4400-b41b-dcd87ce152a0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'gamificacao/page.tsx:FunModeRender',message:'Fun Mode CSS Variables',data:{funPrimary:rootStyles.getPropertyValue('--fun-primary'),funSecondary:rootStyles.getPropertyValue('--fun-secondary'),funAccent:rootStyles.getPropertyValue('--fun-accent'),background:rootStyles.getPropertyValue('--background'),primary:rootStyles.getPropertyValue('--primary'),documentClass:document.documentElement.className},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A,E'})}).catch(()=>{});
  }
  // #endregion
  return (
    <PageContainer className="space-y-8">
      {/* Hero Section - Fun Mode with Theme Colors */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center space-y-6"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-block"
        >
          <div className="relative">
            <Trophy className="h-16 w-16 text-primary mx-auto drop-shadow-[0_0_20px_var(--fun-primary)]" />
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary" data-tour="gamification">
            Olá, {user.firstName}! 🎉
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Sua jornada de conquistas está apenas começando! 🚀
          </p>
        </div>
      </motion.div>

      {/* Progress Hub - Fun Mode Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-primary/30 shadow-xl overflow-hidden bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 pointer-events-none" />
          <CardHeader className="relative border-b border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-primary/30"
                    style={{ backgroundColor: levelConfig.color }}
                  >
                    <levelConfig.icon className="h-8 w-8" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/50"
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <CardTitle className="text-2xl font-extrabold text-foreground">{levelConfig.label}</CardTitle>
                  <CardDescription className="text-muted-foreground">Nível Atual</CardDescription>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
              >
                <Badge className="text-lg px-5 py-2 bg-primary text-primary-foreground border-0 shadow-lg">
                  <Zap className="h-5 w-5 mr-2" />
                  {user.points.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                </Badge>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="relative pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-semibold">Progresso para {nextLevelConfig.label}</span>
                    <span className="font-bold text-primary text-lg">{Math.round(progress)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-3" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {pointsToNext > 0 
                      ? `${pointsToNext.toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)} para o próximo nível! 🚀`
                      : "Você alcançou o nível máximo! 🎉🎉🎉"}
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative shrink-0"
              >
                <div className="h-28 w-28 rounded-full border-4 border-primary/30 flex items-center justify-center bg-card shadow-xl">
                  <span className="text-3xl font-extrabold text-primary">
                    {Math.round(progress)}%
                  </span>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid - Fun Mode with Theme Colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Total de Compras", value: stats.totalPurchases, icon: Gift, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
          { label: "Total Gasto", value: `${stats.totalSpent.toLocaleString("pt-BR")} pontos`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
          { label: "Ticket Médio", value: `${Math.round(stats.averageOrder).toLocaleString("pt-BR")} pontos`, icon: Target, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
          { label: "Ranking Global", value: userRank ? `#${userRank}` : "N/A", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            <Card className={cn("border-2 shadow-lg transition-all", stat.border, stat.bg)}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">{stat.label}</p>
                    <p className={cn("text-2xl font-extrabold mt-1", stat.color)}>
                      {stat.value}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: idx * 0.4 }}
                    className={cn("p-3 rounded-xl", stat.bg)}
                  >
                    <stat.icon className={cn("h-7 w-7", stat.color)} />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Leaderboard - Fun Mode */}
      {topUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl font-extrabold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <Crown className="h-5 w-5 text-primary-foreground" />
                </div>
                Ranking de {getCurrencyName(companyId, true).toUpperCase()}
              </CardTitle>
              <CardDescription className="mt-1">
                Os maiores acumuladores de {getCurrencyName(companyId, true)} da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <PodiumLeaderboard topUsers={topUsers} currentUserId={user.id} companyId={companyId} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Achievements - Fun Mode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-2xl font-extrabold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Sparkles className="h-5 w-5 text-secondary-foreground" />
              </div>
              Conquistas
            </CardTitle>
            <CardDescription className="mt-1">
              Complete desafios e desbloqueie conquistas exclusivas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {earnedAchievements.length === 0 ? (
              <div className="py-12 text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block"
                >
                  <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                </motion.div>
                <p className="text-foreground font-bold text-lg">Nenhuma conquista desbloqueada ainda</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Continue comprando para desbloquear suas primeiras conquistas! 🎯
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-4">
                {earnedAchievements.map((achievement, idx) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className="p-4 rounded-xl border-2 border-primary/20 bg-card hover:border-primary/40 transition-all shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
                        className="text-4xl"
                      >
                        {achievement.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        {achievement.earnedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Conquistado em {new Date(achievement.earnedAt).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        ✓
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Locked Achievements Preview */}
            {earnedAchievements.length < ACHIEVEMENTS.length && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-bold mb-4 text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Conquistas Disponíveis
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {ACHIEVEMENTS.filter(a => !earnedAchievements.find(ea => ea.id === a.id)).map((achievement, idx) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 0.8 + idx * 0.05 }}
                      whileHover={{ opacity: 1, scale: 1.02 }}
                      className="p-3 rounded-lg border-2 border-dashed border-muted bg-muted/30 hover:border-muted-foreground/50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-2xl opacity-60">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground/70">{achievement.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity - Fun Mode */}
      {orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
              <CardDescription>Suas últimas compras e resgates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    whileHover={{ x: 5, scale: 1.01 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-all bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Gift className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Pedido #{order.number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                      {order.paidWithPoints?.toLocaleString("pt-BR") || 0} {getCurrencyName(companyId, true)}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </PageContainer>
  )
}

function getNextLevel(currentLevel: keyof typeof LEVEL_CONFIG_LOCAL): keyof typeof LEVEL_CONFIG_LOCAL {
  const levels: (keyof typeof LEVEL_CONFIG_LOCAL)[] = ["bronze", "silver", "gold", "platinum", "diamond"]
  const currentIndex = levels.indexOf(currentLevel)
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : "diamond"
}

function getFavoriteCategory(orders: Order[]): string {
  if (orders.length === 0) return "N/A"
  // This would require product data, simplified for now
  return "Swag"
}
