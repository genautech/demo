"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Achievement } from "@/lib/storage"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface AchievementBadgeProps {
  achievement: Achievement
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
  className?: string
}

export function AchievementBadge({
  achievement,
  size = "md",
  showTooltip = true,
  className,
}: AchievementBadgeProps) {
  const { theme } = useTheme()
  const isFunMode = theme === "fun"
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-base",
    lg: "h-14 w-14 text-xl",
  }

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isFunMode ? { scale: 1.15, rotate: 5 } : { scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-sm",
        "flex items-center justify-center shadow-lg shadow-primary/10",
        "transition-all duration-300 hover:shadow-xl hover:shadow-primary/20",
        isFunMode && "border-primary/50 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30",
        sizeClasses[size],
        className,
      )}
    >
      <span className="text-2xl leading-none">{achievement.icon}</span>
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{achievement.icon}</span>
                <p className="font-semibold">{achievement.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
              <p className="text-[10px] text-muted-foreground/70">
                Conquistado em {new Date(achievement.earnedAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

interface AchievementListProps {
  achievements: Achievement[]
  maxVisible?: number
  size?: "sm" | "md" | "lg"
}

export function AchievementList({ achievements, maxVisible = 5, size = "md" }: AchievementListProps) {
  const visible = achievements.slice(0, maxVisible)
  const remaining = achievements.length - maxVisible

  return (
    <div className="flex items-center gap-2">
      {visible.map((achievement) => (
        <AchievementBadge key={achievement.id} achievement={achievement} size={size} />
      ))}
      {remaining > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground"
        >
          +{remaining}
        </motion.div>
      )}
    </div>
  )
}
