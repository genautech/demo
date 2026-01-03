"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { CorporateAchievementExtended } from "@/lib/storage"
import { Sparkles, Crown, TrendingUp, Users, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface CorporateAchievementBadgeProps {
  achievement: CorporateAchievementExtended
  size?: "sm" | "md" | "lg" | "xl"
  showTooltip?: boolean
  showProgress?: boolean
  progress?: number
  className?: string
}

export function CorporateAchievementBadge({
  achievement,
  size = "md",
  showTooltip = true,
  showProgress = false,
  progress = 100,
  className,
}: CorporateAchievementBadgeProps) {
  const { theme } = useTheme()
  const isFunMode = theme === "fun"
  
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-20 w-20 text-xl",
  }

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      leadership: "from-purple-500 to-purple-700",
      innovation: "from-green-500 to-green-700",
      performance: "from-blue-500 to-blue-700",
      service: "from-red-500 to-red-700",
      teamwork: "from-cyan-500 to-cyan-700",
      sustainability: "from-emerald-500 to-emerald-700",
      development: "from-pink-500 to-pink-700"
    }
    return colors[category || "default"] || "from-gray-500 to-gray-700"
  }

  const getLevelIcon = (level?: string) => {
    switch (level) {
      case "diamond":
      case "platinum":
        return <Crown className="h-3 w-3 text-yellow-300" />
      case "gold":
        return <TrendingUp className="h-3 w-3 text-yellow-500" />
      case "silver":
        return <Target className="h-3 w-3 text-gray-400" />
      default:
        return <Users className="h-3 w-3 text-orange-400" />
    }
  }

  const content = (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        whileHover={isFunMode ? { 
          scale: 1.15, 
          rotate: 5,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        } : { 
          scale: 1.1,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
        }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative rounded-full bg-gradient-to-br border-2 backdrop-blur-sm shadow-lg",
          "flex items-center justify-center transition-all duration-300 hover:shadow-2xl",
          "border-white/20 shadow-black/10",
          isFunMode && "border-white/40 shadow-xl hover:shadow-3xl hover:border-white/60",
          getCategoryColor(achievement.category),
          sizeClasses[size],
          className,
        )}
        style={{
          background: `linear-gradient(135deg, ${getCategoryColor(achievement.category).replace('from-', '').replace(' to-', ', ')})`
        }}
      >
        <span className="text-2xl leading-none filter drop-shadow-md">{achievement.icon}</span>

        <motion.div
          className="absolute inset-0 rounded-full bg-white/20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {achievement.corporateLevel && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border-2 border-white shadow-lg flex items-center justify-center"
          >
            {getLevelIcon(achievement.corporateLevel)}
          </motion.div>
        )}
      </motion.div>


      {showProgress && progress < 100 && (
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.3) 0deg, rgba(255,255,255,0.3) ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}
    </div>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{achievement.icon}</span>
                <p className="font-semibold">{achievement.name}</p>
                {achievement.corporateLevel && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.corporateLevel}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
              
              {achievement.earnedAt && (
                <p className="text-[10px] text-muted-foreground/70">
                  Conquistado em {new Date(achievement.earnedAt).toLocaleDateString("pt-BR")}
                </p>
              )}

              {achievement.teamValue && (
                <div className="flex items-center gap-1 pt-1">
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium">Valor: {achievement.teamValue} pts</span>
                </div>
              )}

              {achievement.requirements && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-[10px] font-medium mb-1">Requisitos:</p>
                  <p className="text-[10px] text-muted-foreground">
                    {achievement.requirements.criteria}
                  </p>
                </div>
              )}

              {showProgress && progress < 100 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium">Progresso</span>
                    <span className="text-[10px] text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70"
                    />
                  </div>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

interface CorporateAchievementListProps {
  achievements: CorporateAchievementExtended[]
  maxVisible?: number
  size?: "sm" | "md" | "lg" | "xl"
  showProgress?: boolean
}

export function CorporateAchievementList({ 
  achievements, 
  maxVisible = 6, 
  size = "md",
  showProgress = false 
}: CorporateAchievementListProps) {
  const visible = achievements.slice(0, maxVisible)
  const remaining = achievements.length - maxVisible

  return (
    <div className="flex flex-wrap items-center gap-3">
      {visible.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CorporateAchievementBadge 
            achievement={achievement} 
            size={size} 
            showProgress={showProgress}
            progress={Math.floor(Math.random() * 100)} // Mock progress for demo
          />
        </motion.div>
      ))}
      {remaining > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center h-12 w-12 rounded-full bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground"
        >
          +{remaining}
        </motion.div>
      )}
    </div>
  )
}