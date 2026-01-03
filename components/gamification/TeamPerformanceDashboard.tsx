"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  TrendingUp, 
  Award, 
  Target, 
  Briefcase, 
  Star,
  Activity,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface TeamMember {
  id: string
  name: string
  avatar: string
  level: string
  performance: number
  achievements: number
  contribution: number
}

interface TeamMetrics {
  totalMembers: number
  avgPerformance: number
  totalAchievements: number
  monthlyGrowth: number
  topPerformers: TeamMember[]
  challengesCompleted: number
}

interface TeamPerformanceDashboardProps {
  teamId?: string
  compact?: boolean
}

export function TeamPerformanceDashboard({ teamId, compact = false }: TeamPerformanceDashboardProps) {
  const { theme } = useTheme()
  const isFunMode = theme === "fun"
  const [metrics, setMetrics] = useState<TeamMetrics>({
    totalMembers: 0,
    avgPerformance: 0,
    totalAchievements: 0,
    monthlyGrowth: 0,
    topPerformers: [],
    challengesCompleted: 0
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mockData: TeamMetrics = {
        totalMembers: Math.floor(Math.random() * 20) + 10,
        avgPerformance: Math.floor(Math.random() * 30) + 70,
        totalAchievements: Math.floor(Math.random() * 50) + 20,
        monthlyGrowth: Math.floor(Math.random() * 20) - 5,
        topPerformers: [
          {
            id: "1",
            name: "Ana Silva",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
            level: "Platina",
            performance: 95,
            achievements: 12,
            contribution: 85
          },
          {
            id: "2", 
            name: "Carlos Santos",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
            level: "Ouro",
            performance: 88,
            achievements: 8,
            contribution: 72
          },
          {
            id: "3",
            name: "Maria Oliveira",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
            level: "Ouro",
            performance: 82,
            achievements: 6,
            contribution: 68
          }
        ],
        challengesCompleted: Math.floor(Math.random() * 15) + 5
      }
      setMetrics(mockData)
    }
  }, [teamId])

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={isFunMode ? { scale: 1.02 } : { scale: 1.01 }}
        className={cn(
          "p-4 rounded-lg bg-gradient-to-br from-card to-card/80 border border-border/50 shadow-md hover:shadow-lg transition-all",
          isFunMode && "border-primary/30 shadow-lg hover:shadow-xl"
        )}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Membros</p>
              <p className="text-sm font-bold">{metrics.totalMembers}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Performance</p>
              <p className="text-sm font-bold">{metrics.avgPerformance}%</p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "space-y-6",
        isFunMode && "space-y-8"
      )}
    >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={isFunMode ? { scale: 1.05, y: -5 } : { scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Membros</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{metrics.totalMembers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={isFunMode ? { scale: 1.05, y: -5 } : { scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800/30 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Performance Média</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">{metrics.avgPerformance}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={isFunMode ? { scale: 1.05, y: -5 } : { scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800/30 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Conquistas</p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{metrics.totalAchievements}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={isFunMode ? { scale: 1.05, y: -5 } : { scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800/30 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Crescimento</p>
              <p className="text-xl font-bold flex items-center gap-1 text-orange-900 dark:text-orange-100">
                {metrics.monthlyGrowth > 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {Math.abs(metrics.monthlyGrowth)}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>


      <Card className={cn(
        "border-2 shadow-lg",
        isFunMode && "border-primary/30 shadow-xl"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.topPerformers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={isFunMode ? { scale: 1.02, x: 5 } : { scale: 1.01 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all"
              >
                <div className="relative">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="h-10 w-10 rounded-full border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{member.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{member.level}</Badge>
                    <span className="text-xs text-muted-foreground">{member.performance}% performance</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Conquistas</p>
                  <p className="text-sm font-bold">{member.achievements}</p>
                </div>

                <div className="w-16">
                  <Progress value={member.contribution} className="h-2" />
                  <p className="text-[10px] text-muted-foreground mt-1">{member.contribution}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>


      <Card className={cn(
        "border-2 shadow-lg",
        isFunMode && "border-primary/30 shadow-xl"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Desafios de Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={isFunMode ? { scale: 1.02 } : {}}
              className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Desafios Concluídos</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{metrics.challengesCompleted}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500/30" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={isFunMode ? { scale: 1.02 } : {}}
              className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Taxa de Sucesso</p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100">87%</p>
                </div>
                <Target className="h-8 w-8 text-green-500/30" />
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}