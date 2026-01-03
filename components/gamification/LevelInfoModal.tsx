"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Zap,
  TrendingUp,
  Gift,
  Star,
  Info,
  ChevronRight,
  Sparkles,
  Target,
  Award,
} from "lucide-react"
import {
  LEVEL_CONFIG,
  getCurrencyName,
  getCompanyLevelConfig,
  type UserLevel,
  type User,
  type GamificationSettings,
  type LevelCustomization,
  type LevelConfigWithCustomization,
} from "@/lib/storage"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface LevelInfoModalProps {
  user: User
  companyId: string
  gamificationSettings?: GamificationSettings
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const LEVEL_ORDER: UserLevel[] = ["bronze", "silver", "gold", "platinum", "diamond"]

const LEVEL_DESCRIPTIONS: Record<UserLevel, { title: string; description: string; benefits: string[] }> = {
  bronze: {
    title: "Bronze",
    description: "Início da sua jornada de reconhecimento. Continue participando para desbloquear novos benefícios!",
    benefits: [
      "Acesso à loja de recompensas",
      "Catálogo básico de produtos",
      "Participação em desafios mensais",
    ],
  },
  silver: {
    title: "Prata",
    description: "Você está evoluindo! Seu empenho está sendo reconhecido com benefícios exclusivos.",
    benefits: [
      "Multiplicador de pontos: 1.1x",
      "Catálogo expandido (+15% produtos)",
      "Suporte prioritário",
      "Programa de mentoria",
    ],
  },
  gold: {
    title: "Ouro",
    description: "Excelente performance! Você faz parte do grupo de alto desempenho da empresa.",
    benefits: [
      "Multiplicador de pontos: 1.25x",
      "Catálogo premium (+30% produtos)",
      "Experiências exclusivas",
      "Bônus trimestral elegível",
    ],
  },
  platinum: {
    title: "Platina",
    description: "Líder de destaque! Seu impacto vai além do individual - você inspira toda a equipe.",
    benefits: [
      "Multiplicador de pontos: 1.5x",
      "Acesso VIP ao catálogo",
      "Retiro anual de liderança",
      "Coaching executivo",
    ],
  },
  diamond: {
    title: "Diamante",
    description: "O ápice da excelência! Você é uma referência de sucesso e comprometimento.",
    benefits: [
      "Multiplicador de pontos: 2x",
      "Todos os produtos liberados",
      "Experiências Diamante exclusivas",
      "Design de programa de reconhecimento",
    ],
  },
}

function getNextLevel(currentLevel: UserLevel): UserLevel {
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel)
  return currentIndex < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currentIndex + 1] : "diamond"
}

function getLevelIcon(level: UserLevel, customizations?: Record<string, LevelCustomization>): string {
  if (customizations?.[level]?.customIcon) {
    return customizations[level].customIcon!
  }
  
  const defaultIcons: Record<UserLevel, string> = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    platinum: "💎",
    diamond: "👑",
  }
  return defaultIcons[level]
}

export function LevelInfoModal({
  user,
  companyId,
  gamificationSettings,
  children,
  open,
  onOpenChange,
}: LevelInfoModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { theme } = useTheme()
  const isFunMode = theme === "fun"

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

  const currentLevel = user.level
  const nextLevel = getNextLevel(currentLevel)
  
  // Use company-specific level config
  const companyLevelConfig = getCompanyLevelConfig(companyId)
  const levelConfig = companyLevelConfig[currentLevel]
  const nextLevelConfig = companyLevelConfig[nextLevel]
  const baseLevelConfig = LEVEL_CONFIG[currentLevel] // For fallback color
  
  const currencyName = getCurrencyName(companyId, true)
  const currencySingular = getCurrencyName(companyId, false)

  const currentPoints = user.totalPointsEarned
  const currentMin = levelConfig.minPoints
  const nextMin = nextLevelConfig.minPoints
  const range = nextMin - currentMin
  const progress = range > 0 ? ((currentPoints - currentMin) / range) * 100 : 100
  const pointsToNext = Math.max(0, nextMin - currentPoints)

  const levelCustomizations = gamificationSettings?.levelCustomizations

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              style={{ backgroundColor: levelConfig.color }}
            >
              {getLevelIcon(currentLevel, levelCustomizations)}
            </motion.div>
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {levelCustomizations?.[currentLevel]?.customLabel || levelConfig.label}
                <Badge
                  variant="outline"
                  className="ml-2 px-3 py-1 text-sm font-bold"
                  style={{ borderColor: levelConfig.color, color: levelConfig.color }}
                >
                  Nível Atual
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">
                {LEVEL_DESCRIPTIONS[currentLevel].description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="progress" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Progresso
            </TabsTrigger>
            <TabsTrigger value="levels" className="gap-2">
              <Trophy className="h-4 w-4" />
              Níveis
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Info className="h-4 w-4" />
              Como Funciona
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-6 space-y-6">
            {/* Current Balance */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn(
                "p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20",
                isFunMode && "border-primary/40"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Seu Saldo</p>
                  <p className="text-4xl font-bold text-primary">
                    {user.points.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground">{currencyName}</p>
                </div>
                <motion.div
                  animate={isFunMode ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="h-12 w-12 text-primary" />
                </motion.div>
              </div>
            </motion.div>

            {/* Progress to Next Level */}
            {currentLevel !== "diamond" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl border-2 bg-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: nextLevelConfig.color }}
                    >
                      {getLevelIcon(nextLevel, levelCustomizations)}
                    </div>
                    <div>
                      <p className="font-semibold">Próximo: {levelCustomizations?.[nextLevel]?.customLabel || nextLevelConfig.label}</p>
                      <p className="text-sm text-muted-foreground">
                        Faltam {pointsToNext.toLocaleString("pt-BR")} {currencyName}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{currentMin.toLocaleString("pt-BR")} {currencyName}</span>
                  <span>{nextMin.toLocaleString("pt-BR")} {currencyName}</span>
                </div>
              </motion.div>
            )}

            {/* Current Benefits */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border-2 bg-card"
            >
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-primary" />
                Seus Benefícios Atuais
              </h3>
              <ul className="space-y-2">
                {LEVEL_DESCRIPTIONS[currentLevel].benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Star className="h-4 w-4 text-primary flex-shrink-0" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </TabsContent>

          <TabsContent value="levels" className="mt-6 space-y-4">
            {LEVEL_ORDER.map((level, index) => {
              const config = companyLevelConfig[level]
              const isCurrentLevel = level === currentLevel
              const isUnlocked = LEVEL_ORDER.indexOf(level) <= LEVEL_ORDER.indexOf(currentLevel)
              const customLabel = levelCustomizations?.[level]?.customLabel

              return (
                <motion.div
                  key={level}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    isCurrentLevel
                      ? "border-primary bg-primary/5 shadow-lg"
                      : isUnlocked
                      ? "border-border/50 bg-card"
                      : "border-dashed border-muted opacity-60"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center text-2xl transition-all",
                        !isUnlocked && "grayscale"
                      )}
                      style={{ backgroundColor: isUnlocked ? config.color : "#e5e7eb" }}
                    >
                      {getLevelIcon(level, levelCustomizations)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{customLabel || config.label}</h4>
                        {isCurrentLevel && (
                          <Badge variant="default" className="text-xs">
                            Você está aqui
                          </Badge>
                        )}
                        {isUnlocked && !isCurrentLevel && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            Desbloqueado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        A partir de {config.minPoints.toLocaleString("pt-BR")} {currencyName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Multiplicador</p>
                      <p className="text-xl font-bold text-primary">{config.multiplier}x</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </TabsContent>

          <TabsContent value="about" className="mt-6 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-6 rounded-2xl border-2 bg-card"
            >
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                O que são {currencyName}?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currencyName.charAt(0).toUpperCase() + currencyName.slice(1)} são a moeda de reconhecimento da sua empresa. 
                Você acumula {currencyName} através de conquistas, metas atingidas, 
                e participação em programas de incentivo. Use seus {currencyName} para 
                resgatar produtos exclusivos na loja de recompensas!
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border-2 bg-card"
            >
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-primary" />
                Sistema de Níveis
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Conforme você acumula {currencyName}, seu nível aumenta automaticamente. 
                Cada nível desbloqueia novos benefícios, multiplicadores de pontos maiores, 
                e acesso a produtos exclusivos do catálogo.
              </p>
              <div className="grid grid-cols-5 gap-2">
                {LEVEL_ORDER.map((level) => (
                  <div key={level} className="text-center">
                    <div
                      className="h-8 w-8 mx-auto rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: companyLevelConfig[level].color }}
                    >
                      {getLevelIcon(level, levelCustomizations)}
                    </div>
                    <p className="text-[10px] mt-1 font-medium">{companyLevelConfig[level].label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border-2 bg-card"
            >
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                Como Ganhar Mais {currencyName}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Conquistas</p>
                    <p className="text-muted-foreground">Complete conquistas e ganhe bônus especiais</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Metas</p>
                    <p className="text-muted-foreground">Atinja suas metas mensais e trimestrais</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Campanhas Especiais</p>
                    <p className="text-muted-foreground">Participe de campanhas e eventos da empresa</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default LevelInfoModal
