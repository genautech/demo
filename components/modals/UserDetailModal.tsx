"use client"

import { motion } from "framer-motion"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Trophy,
  ShoppingBag,
  Coins,
  Calendar,
  Tag,
  TrendingUp,
  History,
  Edit,
  Star,
} from "lucide-react"
import { 
  type User as UserType, 
  getCurrencyName, 
  LEVEL_CONFIG,
  getUserOrders,
  getUserTransactions,
  type UserLevel,
} from "@/lib/storage"
import { cn } from "@/lib/utils"
import { AchievementBadge } from "@/components/gamification/AchievementBadge"

interface UserDetailModalProps {
  user: UserType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId?: string
  onEdit?: (user: UserType) => void
  onAddPoints?: (user: UserType) => void
  onViewHistory?: (user: UserType) => void
}

const LEVEL_COLORS: Record<UserLevel, string> = {
  bronze: "bg-amber-700 text-white dark:bg-amber-600",
  silver: "bg-gray-500 text-white dark:bg-gray-400",
  gold: "bg-yellow-500 text-white dark:bg-yellow-400 dark:text-yellow-950",
  platinum: "bg-slate-400 text-slate-900 dark:bg-slate-300",
  diamond: "bg-cyan-500 text-white dark:bg-cyan-400 dark:text-cyan-950",
}

export function UserDetailModal({
  user,
  open,
  onOpenChange,
  companyId = "company_1",
  onEdit,
  onAddPoints,
  onViewHistory,
}: UserDetailModalProps) {
  if (!user) return null

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Sem nome"
  const initials = ((user.firstName?.charAt(0) || "") + (user.lastName?.charAt(0) || "")).toUpperCase() || "?"
  const levelConfig = LEVEL_CONFIG[user.level]
  const orders = getUserOrders(user.id)
  const transactions = getUserTransactions(user.id).slice(0, 5)

  // Calcular progresso para próximo nível
  const levels: UserLevel[] = ["bronze", "silver", "gold", "platinum", "diamond"]
  const currentLevelIndex = levels.indexOf(user.level)
  const nextLevel = currentLevelIndex < levels.length - 1 ? levels[currentLevelIndex + 1] : user.level
  const nextLevelConfig = LEVEL_CONFIG[nextLevel]
  
  const currentMin = levelConfig.minPoints
  const nextMin = nextLevelConfig.minPoints
  const range = nextMin - currentMin
  const progress = range > 0 ? ((user.totalPointsEarned - currentMin) / range) * 100 : 100
  const pointsToNext = nextMin - user.totalPointsEarned

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch {
      return "-"
    }
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={fullName}
      description={user.email}
      maxWidth="2xl"
      footer={
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          )}
          {onAddPoints && (
            <Button onClick={() => onAddPoints(user)}>
              <Coins className="h-4 w-4 mr-2" /> Adicionar {getCurrencyName(companyId, true)}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header com Avatar e Nível */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Avatar className="h-20 w-20 ring-4 ring-offset-2 ring-offset-background" style={{ ringColor: levelConfig.color }}>
            <AvatarImage src={user.avatar} alt={fullName} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("px-3 py-1", LEVEL_COLORS[user.level])}>
                <Trophy className="h-3.5 w-3.5 mr-1" />
                {levelConfig.label}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {levelConfig.multiplier}x Multiplicador
              </Badge>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progresso para {nextLevel !== user.level ? LEVEL_CONFIG[nextLevel].label : "Nível máximo"}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={Math.min(100, Math.max(0, progress))} className="h-2" />
              {pointsToNext > 0 && (
                <p className="text-xs text-muted-foreground">
                  Faltam {pointsToNext.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)} para o próximo nível
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <Coins className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold text-primary">{user.points.toLocaleString("pt-BR")}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-medium">{getCurrencyName(companyId, true)} Atuais</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <p className="text-xl font-bold text-green-600">{user.totalPointsEarned.toLocaleString("pt-BR")}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-medium">Total Ganho</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <ShoppingBag className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <p className="text-xl font-bold text-blue-600">{user.totalPurchases}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-medium">Compras</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-xl font-bold text-yellow-500">{user.achievements?.length || 0}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-medium">Conquistas</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Informações de Contato */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <User className="h-4 w-4" /> Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">Membro desde {formatDate(user.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Endereço Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.address?.address1 ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{user.address.address1}</p>
                    {user.address.address2 && (
                      <p className="text-muted-foreground">{user.address.address2}</p>
                    )}
                    <p className="text-muted-foreground">
                      {user.address.city} - {user.address.stateCode}
                    </p>
                    <p className="text-muted-foreground">CEP: {user.address.zipcode}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhum endereço cadastrado</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tags */}
        {user.tags && user.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags ({user.tags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Conquistas */}
        {user.achievements && user.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Trophy className="h-4 w-4" /> Conquistas ({user.achievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {user.achievements.slice(0, 8).map((achievement) => (
                    <AchievementBadge 
                      key={achievement.id} 
                      achievement={achievement} 
                      size="sm"
                    />
                  ))}
                  {user.achievements.length > 8 && (
                    <div className="flex items-center justify-center h-8 px-3 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      +{user.achievements.length - 8} mais
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Últimas Transações */}
        {transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card>
              <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <History className="h-4 w-4" /> Últimas Transações
                </CardTitle>
                {onViewHistory && (
                  <Button variant="ghost" size="sm" onClick={() => onViewHistory(user)}>
                    Ver Todas
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {transactions.map((tx, idx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          tx.type === "credit" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                        )}>
                          {tx.type === "credit" ? (
                            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <ShoppingBag className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{tx.description}</p>
                          <p className="text-[10px] text-muted-foreground">{formatDate(tx.createdAt)}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "font-bold text-sm",
                        tx.type === "credit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </ResponsiveModal>
  )
}
