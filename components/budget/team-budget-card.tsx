"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  History,
  AlertCircle,
} from "lucide-react"
import { type TeamBudget } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TeamBudgetCardProps {
  budget: TeamBudget
  onAllocate?: (teamId: string) => void
  onViewHistory?: (teamId: string) => void
  onViewRequests?: (teamId: string) => void
}

export function TeamBudgetCard({ 
  budget, 
  onAllocate, 
  onViewHistory,
  onViewRequests,
}: TeamBudgetCardProps) {
  const usagePercent = budget.allocatedAmount > 0 
    ? Math.round((budget.usedAmount / budget.allocatedAmount) * 100) 
    : 0
  
  const pendingRequests = budget.requests.filter(r => r.status === "pending").length
  
  const getUsageColor = () => {
    if (usagePercent >= 90) return "bg-red-500"
    if (usagePercent >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{budget.teamName}</CardTitle>
                <CardDescription className="text-xs">
                  ID: {budget.teamId}
                </CardDescription>
              </div>
            </div>
            {pendingRequests > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 gap-1">
                <AlertCircle className="h-3 w-3" />
                {pendingRequests} pendente{pendingRequests > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Budget Overview */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Alocado</p>
              <p className="text-lg font-black text-primary">
                R$ {budget.allocatedAmount.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Utilizado</p>
              <p className="text-lg font-black text-red-600">
                R$ {budget.usedAmount.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Disponível</p>
              <p className="text-lg font-black text-green-600">
                R$ {budget.availableAmount.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Utilização</span>
              <span className={cn(
                "font-bold",
                usagePercent >= 90 && "text-red-600",
                usagePercent >= 70 && usagePercent < 90 && "text-yellow-600",
                usagePercent < 70 && "text-green-600"
              )}>
                {usagePercent}%
              </span>
            </div>
            <Progress 
              value={usagePercent} 
              className="h-2"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-1 text-xs"
              onClick={() => onAllocate?.(budget.teamId)}
            >
              <Plus className="h-3 w-3" />
              Alocar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-1 text-xs"
              onClick={() => onViewHistory?.(budget.teamId)}
            >
              <History className="h-3 w-3" />
              Histórico
            </Button>
            {pendingRequests > 0 && (
              <Button 
                size="sm" 
                className="flex-1 gap-1 text-xs"
                onClick={() => onViewRequests?.(budget.teamId)}
              >
                Ver Solicitações
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
