"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  getUserById,
  LEVEL_CONFIG,
  getCurrencyName,
  getGamificationSettings,
  getCompanyLevelConfig,
  type User,
  type UserLevel,
  type GamificationSettings,
  type BadgeStyle,
  type LevelCustomization,
  type LevelConfigWithCustomization,
} from "@/lib/storage"
import { Trophy, Zap, TrendingUp, Briefcase, Users, Target, Award, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { LevelInfoModal } from "./LevelInfoModal"

interface UserStatsProps {
  userId?: string
  compact?: boolean
  showCorporate?: boolean
  forceStyle?: BadgeStyle
}

function getNextLevel(currentLevel: UserLevel): UserLevel {
  const levels: UserLevel[] = ["bronze", "silver", "gold", "platinum", "diamond"]
  const currentIndex = levels.indexOf(currentLevel)
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : "diamond"
}

function getLevelIcon(level: UserLevel, customizations?: Record<string, LevelCustomization>): string {
  if (customizations?.[level]?.customIcon) {
    return customizations[level].customIcon!
  }
  
  const defaultIcons: Record<UserLevel, string> = {
    bronze: "🏆",
    silver: "🥈",
    gold: "🥇",
    platinum: "💎",
    diamond: "👑",
  }
  return defaultIcons[level]
}

function getLevelLabel(level: UserLevel, customizations?: Record<string, LevelCustomization>): string {
  if (customizations?.[level]?.customLabel) {
    return customizations[level].customLabel!
  }
  return LEVEL_CONFIG[level].label
}

function getLevelColor(level: UserLevel, customizations?: Record<string, LevelCustomization>): string {
  if (customizations?.[level]?.customColor) {
    return customizations[level].customColor!
  }
  return LEVEL_CONFIG[level].color
}

// Variant-specific styles
const BADGE_VARIANTS: Record<BadgeStyle, {
  container: string
  iconContainer: string
  badge: string
  progressBar: string
}> = {
  default: {
    container: "bg-gradient-to-r from-card to-card/95 border-2 border-primary/20 shadow-lg hover:shadow-xl",
    iconContainer: "shadow-lg ring-2 ring-white/50",
    badge: "border-primary/30 bg-primary/10 text-primary",
    progressBar: "bg-gradient-to-r from-primary via-primary/90 to-primary/70",
  },
  minimal: {
    container: "bg-card/50 border border-border/50 shadow-sm hover:shadow-md",
    iconContainer: "shadow-sm",
    badge: "border-border/50 bg-muted/30 text-foreground",
    progressBar: "bg-primary/70",
  },
  glass: {
    container: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl",
    iconContainer: "shadow-lg ring-2 ring-white/30 backdrop-blur-sm",
    badge: "border-white/30 bg-white/20 text-foreground backdrop-blur-sm",
    progressBar: "bg-gradient-to-r from-white/50 to-white/30",
  },
  corporate: {
    container: "bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg",
    iconContainer: "shadow-md ring-2 ring-slate-300 dark:ring-slate-600",
    badge: "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200",
    progressBar: "bg-slate-600 dark:bg-slate-400",
  },
  fun: {
    container: "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 border-2 border-purple-400/40 shadow-xl hover:shadow-2xl",
    iconContainer: "shadow-xl ring-2 ring-white/50",
    badge: "border-pink-400/40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white",
    progressBar: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  },
}

export function UserStats({ userId, compact = false, showCorporate = false, forceStyle }: UserStatsProps) {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState(0)
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [gamificationSettings, setGamificationSettings] = useState<GamificationSettings | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { theme } = useTheme()
  const isFunMode = theme === "fun"
  const [teamMetrics, setTeamMetrics] = useState({
    teamSize: 0,
    teamPerformance: 0,
    mentorshipScore: 0,
    projectsLed: 0,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const authData = localStorage.getItem("yoobe_auth")
    if (!userId && authData) {
      try {
        const auth = JSON.parse(authData)
        userId = auth.userId
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch {
        // ignore
      }
    }

    if (!userId) return

    const currentUser = getUserById(userId)
    if (!currentUser) return
    if (currentUser) {
      setUser(currentUser)

      // Use company-specific level config if companyId is available
      const companyLevelConfig = companyId ? getCompanyLevelConfig(companyId) : null
      
      const currentLevel = currentUser.level
      const currentPoints = currentUser.totalPointsEarned
      const levelConfig = companyLevelConfig ? companyLevelConfig[currentLevel] : LEVEL_CONFIG[currentLevel]
      const nextLevel = getNextLevel(currentLevel)
      const nextLevelConfig = companyLevelConfig ? companyLevelConfig[nextLevel] : LEVEL_CONFIG[nextLevel]

      const currentMin = companyLevelConfig ? levelConfig.minPoints : (levelConfig as typeof LEVEL_CONFIG[UserLevel]).minPoints
      const nextMin = companyLevelConfig ? nextLevelConfig.minPoints : (nextLevelConfig as typeof LEVEL_CONFIG[UserLevel]).minPoints
      const range = nextMin - currentMin
      const progressValue = range > 0 ? ((currentPoints - currentMin) / range) * 100 : 100
      setProgress(Math.min(100, Math.max(0, progressValue)))
    }
  }, [userId, companyId])

  // Load gamification settings
  useEffect(() => {
    if (!companyId) return
    const settings = getGamificationSettings(companyId)
    setGamificationSettings(settings)
  }, [companyId])

  useEffect(() => {
    if (showCorporate && typeof window !== "undefined") {
      setTeamMetrics({
        teamSize: Math.floor(Math.random() * 10) + 5,
        teamPerformance: Math.floor(Math.random() * 40) + 60,
        mentorshipScore: user?.achievements.length ? user.achievements.length * 15 : 0,
        projectsLed: user?.role === "manager" ? Math.floor(Math.random() * 5) + 2 : 0,
      })
    }
  }, [user, showCorporate])

  // Check visibility settings
  if (!user) return null
  if (gamificationSettings && !gamificationSettings.enabled) return null
  if (gamificationSettings && !gamificationSettings.showBadgeForMembers && user.role === "member") return null

  // Use company-specific level config
  const companyLevelConfig = companyId ? getCompanyLevelConfig(companyId) : null
  const levelConfig = companyLevelConfig ? companyLevelConfig[user.level] : LEVEL_CONFIG[user.level]
  const nextLevel = getNextLevel(user.level)
  const nextLevelConfig = companyLevelConfig ? companyLevelConfig[nextLevel] : LEVEL_CONFIG[nextLevel]
  const nextMinPoints = companyLevelConfig ? nextLevelConfig.minPoints : (nextLevelConfig as typeof LEVEL_CONFIG[UserLevel]).minPoints
  const pointsToNext = nextMinPoints - user.totalPointsEarned

  // Determine which style to use
  const activeStyle: BadgeStyle = forceStyle || gamificationSettings?.badgeStyle || (isFunMode ? "fun" : "default")
  const styles = BADGE_VARIANTS[activeStyle]
  const levelCustomizations = gamificationSettings?.levelCustomizations
  const showProgressBar = gamificationSettings?.showProgressBar ?? true
  const showPointsBalance = gamificationSettings?.showPointsBalance ?? true

  const levelIcon = getLevelIcon(user.level, levelCustomizations)
  const levelLabel = getLevelLabel(user.level, levelCustomizations)
  const levelColor = getLevelColor(user.level, levelCustomizations)
  const isCustomIcon = levelCustomizations?.[user.level]?.customIcon?.startsWith("http")

  if (showCorporate && !compact) {
    return (
      <LevelInfoModal user={user} companyId={companyId} gamificationSettings={gamificationSettings || undefined} open={modalOpen} onOpenChange={setModalOpen}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setModalOpen(true)}
          className={cn(
            "space-y-4 p-5 rounded-xl transition-all cursor-pointer",
            styles.container,
            isFunMode && "border-primary/40 shadow-xl hover:shadow-2xl hover:border-primary/60"
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn("h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white", styles.iconContainer)}
              style={{ backgroundColor: levelColor }}
            >
              {isCustomIcon ? (
                <img src={levelIcon} alt={levelLabel} className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-xl">{levelIcon}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{levelLabel}</span>
                {showPointsBalance && (
                  <Badge variant="outline" className={cn("h-6 px-2.5 text-xs font-bold", styles.badge)}>
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    {(user.points ?? 0).toLocaleString()} {getCurrencyName(companyId, true)}
                  </Badge>
                )}
                <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </div>
              {showProgressBar && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-36 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn("h-full shadow-sm", styles.progressBar)}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {pointsToNext > 0 ? `${pointsToNext.toLocaleString()} para ${getLevelLabel(nextLevel, levelCustomizations)}` : "Nível máximo"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Time</p>
                <p className="text-sm font-bold text-foreground">{teamMetrics.teamSize} membros</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
            >
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Performance</p>
                <p className="text-sm font-bold text-foreground">{teamMetrics.teamPerformance}%</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
            >
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Mentoria</p>
                <p className="text-sm font-bold text-foreground">{teamMetrics.mentorshipScore} pts</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
            >
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Projetos</p>
                <p className="text-sm font-bold text-foreground">{teamMetrics.projectsLed} liderados</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </LevelInfoModal>
    )
  }

  if (compact) {
    const currencyName = getCurrencyName(companyId, true)
    const points = user.points ?? 0
    const pointsDisplay = points > 999 ? `${(points / 1000).toFixed(1)}k` : points.toLocaleString()

    return (
      <LevelInfoModal user={user} companyId={companyId} gamificationSettings={gamificationSettings || undefined} open={modalOpen} onOpenChange={setModalOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setModalOpen(true)}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer",
            styles.container
          )}
        >
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0",
              styles.iconContainer
            )}
            style={{ backgroundColor: levelColor }}
          >
            {isCustomIcon ? (
              <img src={levelIcon} alt={levelLabel} className="h-5 w-5 object-contain" />
            ) : (
              <span className="text-base">{levelIcon}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0 gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-foreground truncate">{levelLabel}</span>
              {showPointsBalance && (
                <Badge variant="outline" className={cn("h-5 px-2 text-[10px] font-bold flex-shrink-0", styles.badge)}>
                  <Zap className="h-3 w-3 mr-1" />
                  {pointsDisplay} {currencyName}
                </Badge>
              )}
            </div>
            {showProgressBar && (
              <div className="h-1.5 w-24 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn("h-full shadow-sm", styles.progressBar)}
                />
              </div>
            )}
          </div>
        </motion.div>
      </LevelInfoModal>
    )
  }

  return (
    <LevelInfoModal user={user} companyId={companyId} gamificationSettings={gamificationSettings || undefined} open={modalOpen} onOpenChange={setModalOpen}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        onClick={() => setModalOpen(true)}
        className={cn(
          "flex items-center gap-4 px-5 py-3 rounded-xl transition-all cursor-pointer",
          styles.container
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn("h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white", styles.iconContainer)}
            style={{ backgroundColor: levelColor }}
          >
            {isCustomIcon ? (
              <img src={levelIcon} alt={levelLabel} className="h-8 w-8 object-contain" />
            ) : (
              <span className="text-xl">{levelIcon}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{levelLabel}</span>
              {showPointsBalance && (
                <Badge variant="outline" className={cn("h-6 px-2.5 text-xs font-bold", styles.badge)}>
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  {(user.points ?? 0).toLocaleString()} {getCurrencyName(companyId, true)}
                </Badge>
              )}
              <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </div>
            {showProgressBar && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-36 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full shadow-sm", styles.progressBar)}
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {pointsToNext > 0 ? `${pointsToNext.toLocaleString()} para ${getLevelLabel(nextLevel, levelCustomizations)}` : "Nível máximo"}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </LevelInfoModal>
  )
}
