"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamPerformanceDashboard } from "@/components/gamification/TeamPerformanceDashboard"
import {
  Trophy,
  Users,
  Award,
  Target,
  TrendingUp,
  Star,
  Medal,
  Crown,
  Sparkles,
  Zap,
  Gift,
  CheckCircle2,
  Clock,
  Flame,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import {
  getUsersByCompany,
  getUserGamificationStats,
  getCurrencyName,
  getCompanyAchievements,
  saveCompanyAchievement,
  deleteCompanyAchievement,
  LEVEL_CONFIG,
  type User,
  type UserLevel,
  type CompanyAchievement,
} from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Settings } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Team Achievement Definitions
const TEAM_ACHIEVEMENTS = [
  {
    id: "team_first_100",
    name: "Primeiros 100",
    description: "Time atingiu 100 compras coletivas",
    icon: "🎯",
    target: 100,
    type: "purchases",
  },
  {
    id: "team_all_levels",
    name: "Diversidade de Níveis",
    description: "Membros em todos os níveis de gamificação",
    icon: "🌈",
    target: 5,
    type: "levels",
  },
  {
    id: "team_high_engagement",
    name: "Alta Engajamento",
    description: "80% dos membros ativos no último mês",
    icon: "🔥",
    target: 80,
    type: "engagement",
  },
  {
    id: "team_points_milestone",
    name: "Marco de Pontos",
    description: "Time acumulou 50.000 pontos no total",
    icon: "💰",
    target: 50000,
    type: "points",
  },
  {
    id: "team_champions",
    name: "Time de Campeões",
    description: "5 membros atingiram nível Platina ou superior",
    icon: "🏆",
    target: 5,
    type: "platinum_members",
  },
  {
    id: "team_streak",
    name: "Sequência Perfeita",
    description: "Pelo menos uma compra por dia durante 30 dias",
    icon: "⚡",
    target: 30,
    type: "streak",
  },
]

interface LevelDistribution {
  level: UserLevel
  count: number
  percentage: number
}

interface TeamStats {
  totalMembers: number
  totalPurchases: number
  totalPointsEarned: number
  totalPointsSpent: number
  avgPerformance: number
  levelDistribution: LevelDistribution[]
  topPerformers: User[]
  recentAchievements: number
  monthlyGrowth: number
  activeMembers: number
}

const ACHIEVEMENT_CATEGORIES = [
  { value: "compras", label: "Compras" },
  { value: "pontos", label: "Pontos" },
  { value: "engajamento", label: "Engajamento" },
  { value: "social", label: "Social" },
  { value: "especial", label: "Especial" },
]

const DEFAULT_ICONS = ["🏆", "⭐", "🎯", "💰", "🔥", "⚡", "🎁", "👑", "💎", "🚀", "🌟", "🏅"]

export default function AchievementsPage() {
  const [companyId, setCompanyId] = useState("company_1")
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  
  // Achievement management state
  const [achievements, setAchievements] = useState<CompanyAchievement[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<CompanyAchievement | null>(null)
  const [achievementForm, setAchievementForm] = useState({
    name: "",
    description: "",
    icon: "🏆",
    category: "compras",
    criteriaType: "automatic" as "automatic" | "manual",
    criteriaCondition: "",
    criteriaTarget: 0,
    points: 100,
    isActive: true,
  })

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
          loadTeamStats(auth.companyId)
          loadAchievements(auth.companyId)
        }
      } catch {
        loadTeamStats(companyId)
        loadAchievements(companyId)
      }
    } else {
      loadTeamStats(companyId)
      loadAchievements(companyId)
    }
  }, [])
  
  const loadAchievements = (cId: string) => {
    const companyAchievements = getCompanyAchievements(cId)
    setAchievements(companyAchievements)
  }
  
  const handleOpenDialog = (achievement?: CompanyAchievement) => {
    if (achievement) {
      setEditingAchievement(achievement)
      setAchievementForm({
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        criteriaType: achievement.criteria.type,
        criteriaCondition: achievement.criteria.condition,
        criteriaTarget: achievement.criteria.target || 0,
        points: achievement.points,
        isActive: achievement.isActive,
      })
    } else {
      setEditingAchievement(null)
      setAchievementForm({
        name: "",
        description: "",
        icon: "🏆",
        category: "compras",
        criteriaType: "automatic",
        criteriaCondition: "",
        criteriaTarget: 0,
        points: 100,
        isActive: true,
      })
    }
    setIsDialogOpen(true)
  }
  
  const handleSaveAchievement = () => {
    if (!achievementForm.name || !achievementForm.description) {
      toast.error("Nome e descrição são obrigatórios")
      return
    }
    
    const achievement: CompanyAchievement = {
      id: editingAchievement?.id || `achievement_${Date.now()}`,
      companyId,
      name: achievementForm.name,
      description: achievementForm.description,
      icon: achievementForm.icon,
      category: achievementForm.category,
      criteria: {
        type: achievementForm.criteriaType,
        condition: achievementForm.criteriaCondition,
        target: achievementForm.criteriaTarget || undefined,
      },
      points: achievementForm.points,
      isActive: achievementForm.isActive,
      createdAt: editingAchievement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    saveCompanyAchievement(achievement)
    loadAchievements(companyId)
    setIsDialogOpen(false)
    toast.success(editingAchievement ? "Conquista atualizada!" : "Conquista criada!")
  }
  
  const handleDeleteAchievement = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta conquista?")) {
      deleteCompanyAchievement(id, companyId)
      loadAchievements(companyId)
      toast.success("Conquista excluída!")
    }
  }

  const loadTeamStats = (cId: string) => {
    setLoading(true)
    
    const users = getUsersByCompany(cId)
    const gamificationStats = getUserGamificationStats()
    
    // Calculate level distribution
    const levelCounts: Record<UserLevel, number> = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      diamond: 0,
    }
    
    let totalPurchases = 0
    let totalPointsEarned = 0
    let totalPointsSpent = 0
    
    users.forEach(user => {
      levelCounts[user.level]++
      totalPurchases += user.totalPurchases || 0
      totalPointsEarned += user.totalPointsEarned || 0
      totalPointsSpent += user.totalPointsSpent || 0
    })
    
    const levelDistribution: LevelDistribution[] = (Object.entries(levelCounts) as [UserLevel, number][])
      .map(([level, count]) => ({
        level,
        count,
        percentage: users.length > 0 ? (count / users.length) * 100 : 0,
      }))
    
    // Sort users by performance (points earned)
    const topPerformers = [...users]
      .sort((a, b) => (b.totalPointsEarned || 0) - (a.totalPointsEarned || 0))
      .slice(0, 5)
    
    // Calculate active members (have made purchases)
    const activeMembers = users.filter(u => (u.totalPurchases || 0) > 0).length
    
    setTeamStats({
      totalMembers: users.length,
      totalPurchases,
      totalPointsEarned,
      totalPointsSpent,
      avgPerformance: users.length > 0 
        ? Math.round(users.reduce((sum, u) => sum + ((u.totalPurchases || 0) > 0 ? 1 : 0), 0) / users.length * 100)
        : 0,
      levelDistribution,
      topPerformers,
      recentAchievements: gamificationStats.topUsers.reduce((sum, u) => sum + (u.achievements?.length || 0), 0),
      monthlyGrowth: Math.floor(Math.random() * 20) - 5, // Mock for demo
      activeMembers,
    })
    
    setLoading(false)
  }

  const calculateTeamAchievementProgress = (achievement: typeof TEAM_ACHIEVEMENTS[0]) => {
    if (!teamStats) return { current: 0, target: achievement.target, percentage: 0, unlocked: false }
    
    let current = 0
    switch (achievement.type) {
      case "purchases":
        current = teamStats.totalPurchases
        break
      case "levels":
        current = teamStats.levelDistribution.filter(l => l.count > 0).length
        break
      case "engagement":
        current = teamStats.totalMembers > 0 
          ? Math.round((teamStats.activeMembers / teamStats.totalMembers) * 100)
          : 0
        break
      case "points":
        current = teamStats.totalPointsEarned
        break
      case "platinum_members":
        current = teamStats.levelDistribution
          .filter(l => l.level === "platinum" || l.level === "diamond")
          .reduce((sum, l) => sum + l.count, 0)
        break
      case "streak":
        current = Math.floor(Math.random() * 30) // Mock for demo
        break
    }
    
    const percentage = Math.min((current / achievement.target) * 100, 100)
    return { current, target: achievement.target, percentage, unlocked: current >= achievement.target }
  }

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Conquistas do Time
          </h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe o desempenho e conquistas da sua equipe
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2 self-start">
          <Users className="h-4 w-4 mr-2" />
          {teamStats?.totalMembers || 0} membros
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total de Compras</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {teamStats?.totalPurchases.toLocaleString("pt-BR") || 0}
                  </p>
                </div>
                <Gift className="h-10 w-10 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Pontos Acumulados</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {teamStats?.totalPointsEarned.toLocaleString("pt-BR") || 0}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {getCurrencyName(companyId, true)}
                  </p>
                </div>
                <Zap className="h-10 w-10 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Conquistas Desbloqueadas</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {TEAM_ACHIEVEMENTS.filter(a => calculateTeamAchievementProgress(a).unlocked).length}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    de {TEAM_ACHIEVEMENTS.length} disponíveis
                  </p>
                </div>
                <Award className="h-10 w-10 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">Crescimento Mensal</p>
                  <p className="text-3xl font-bold flex items-center gap-1 text-orange-900 dark:text-orange-100">
                    {(teamStats?.monthlyGrowth || 0) > 0 ? (
                      <ChevronUp className="h-6 w-6 text-green-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-red-500" />
                    )}
                    {Math.abs(teamStats?.monthlyGrowth || 0)}%
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-500/50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <Target className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Trophy className="h-4 w-4" />
            Conquistas
          </TabsTrigger>
          <TabsTrigger value="manage" className="gap-2">
            <Settings className="h-4 w-4" />
            Gerenciar
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Crown className="h-4 w-4" />
            Ranking
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Distribuição por Nível
              </CardTitle>
              <CardDescription>
                Como os membros do time estão distribuídos entre os níveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamStats?.levelDistribution.map((level, index) => {
                  const config = LEVEL_CONFIG[level.level]
                  const Icon = level.level === "diamond" ? Sparkles : 
                               level.level === "platinum" ? Crown :
                               level.level === "gold" ? Trophy :
                               level.level === "silver" ? Star : Medal
                  
                  return (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: config.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{config.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {level.count} ({Math.round(level.percentage)}%)
                          </span>
                        </div>
                        <Progress 
                          value={level.percentage} 
                          className="h-2"
                          style={{ 
                            // @ts-ignore
                            "--progress-background": config.color 
                          }}
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance Dashboard */}
          <TeamPerformanceDashboard />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6 mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_ACHIEVEMENTS.map((achievement, index) => {
              const progress = calculateTeamAchievementProgress(achievement)
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "h-full transition-all hover:shadow-lg",
                    progress.unlocked 
                      ? "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20" 
                      : "opacity-80"
                  )}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "text-4xl",
                          !progress.unlocked && "grayscale opacity-50"
                        )}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            {progress.unlocked && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>{progress.current.toLocaleString("pt-BR")}</span>
                              <span>{progress.target.toLocaleString("pt-BR")}</span>
                            </div>
                            <Progress 
                              value={progress.percentage} 
                              className={cn(
                                "h-2",
                                progress.unlocked && "bg-green-100 dark:bg-green-900/30"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Locked achievements info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Continue progredindo!</h3>
                  <p className="text-sm text-muted-foreground">
                    {TEAM_ACHIEVEMENTS.filter(a => !calculateTeamAchievementProgress(a).unlocked).length} conquistas 
                    ainda disponíveis para desbloquear. Incentive seu time a continuar participando!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Top Performers do Time
              </CardTitle>
              <CardDescription>
                Membros com melhor desempenho em {getCurrencyName(companyId, true)} acumulados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamStats?.topPerformers.map((user, index) => {
                  const levelConfig = LEVEL_CONFIG[user.level]
                  const isTop3 = index < 3
                  
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border transition-all",
                        isTop3 
                          ? "bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-200 dark:border-yellow-800/30"
                          : "bg-muted/30 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg",
                        index === 0 && "bg-yellow-500 text-white",
                        index === 1 && "bg-gray-400 text-white",
                        index === 2 && "bg-orange-600 text-white",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: levelConfig.color, color: levelConfig.color }}
                          >
                            {levelConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.totalPurchases || 0} compras
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {(user.totalPointsEarned || 0).toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getCurrencyName(companyId, true)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
                
                {(!teamStats?.topPerformers || teamStats.topPerformers.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum membro com atividade ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membros Ativos</p>
                    <p className="text-2xl font-bold">
                      {teamStats?.activeMembers || 0}
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        de {teamStats?.totalMembers || 0}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Engajamento</p>
                    <p className="text-2xl font-bold">
                      {teamStats?.totalMembers ? 
                        Math.round((teamStats.activeMembers / teamStats.totalMembers) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Manage Achievements Tab */}
        <TabsContent value="manage" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Gerenciar Conquistas
                  </CardTitle>
                  <CardDescription>
                    Crie, edite e personalize as conquistas da sua empresa
                  </CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Conquista
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Nenhuma conquista personalizada</p>
                    <p className="text-sm">Clique em "Nova Conquista" para criar a primeira</p>
                  </div>
                ) : (
                  achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md",
                        achievement.isActive 
                          ? "border-border bg-card" 
                          : "border-dashed border-muted opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                          {achievement.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <Badge variant={achievement.isActive ? "default" : "secondary"}>
                              {achievement.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                            <Badge variant="outline">
                              {ACHIEVEMENT_CATEGORIES.find(c => c.value === achievement.category)?.label || achievement.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {achievement.points} pontos
                            </span>
                            <span>
                              {achievement.criteria.type === "automatic" ? "Automática" : "Manual"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(achievement)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAchievement(achievement.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Achievement Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAchievement ? "Editar Conquista" : "Nova Conquista"}
            </DialogTitle>
            <DialogDescription>
              {editingAchievement 
                ? "Atualize as informações da conquista" 
                : "Crie uma nova conquista personalizada para sua empresa"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-4 grid-cols-[auto_1fr]">
              <div className="space-y-2">
                <Label>Ícone</Label>
                <div className="flex flex-wrap gap-1 max-w-[120px]">
                  {DEFAULT_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setAchievementForm({ ...achievementForm, icon })}
                      className={cn(
                        "h-8 w-8 rounded-lg text-lg hover:bg-muted transition-colors",
                        achievementForm.icon === icon && "bg-primary/20 ring-2 ring-primary"
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Conquista *</Label>
                  <Input
                    id="name"
                    value={achievementForm.name}
                    onChange={(e) => setAchievementForm({ ...achievementForm, name: e.target.value })}
                    placeholder="Ex: Primeira Compra"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    placeholder="Ex: Realizou sua primeira compra na loja"
                    rows={2}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={achievementForm.category}
                  onValueChange={(value) => setAchievementForm({ ...achievementForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Pontos</Label>
                <Input
                  id="points"
                  type="number"
                  value={achievementForm.points}
                  onChange={(e) => setAchievementForm({ ...achievementForm, points: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Critério</Label>
              <Select
                value={achievementForm.criteriaType}
                onValueChange={(value: "automatic" | "manual") => setAchievementForm({ ...achievementForm, criteriaType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automático (sistema verifica)</SelectItem>
                  <SelectItem value="manual">Manual (gestor concede)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {achievementForm.criteriaType === "automatic" && (
              <div className="grid gap-4 grid-cols-[1fr_auto]">
                <div className="space-y-2">
                  <Label htmlFor="condition">Condição</Label>
                  <Input
                    id="condition"
                    value={achievementForm.criteriaCondition}
                    onChange={(e) => setAchievementForm({ ...achievementForm, criteriaCondition: e.target.value })}
                    placeholder="Ex: total_purchases >= 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Meta</Label>
                  <Input
                    id="target"
                    type="number"
                    value={achievementForm.criteriaTarget}
                    onChange={(e) => setAchievementForm({ ...achievementForm, criteriaTarget: parseInt(e.target.value) || 0 })}
                    min={0}
                    className="w-24"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-sm">Conquista Ativa</p>
                <p className="text-xs text-muted-foreground">Membros podem desbloquear esta conquista</p>
              </div>
              <Switch
                checked={achievementForm.isActive}
                onCheckedChange={(checked) => setAchievementForm({ ...achievementForm, isActive: checked })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAchievement}>
              {editingAchievement ? "Salvar Alterações" : "Criar Conquista"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
