"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Clock,
  XCircle,
  Settings,
  ListChecks,
  History,
  RefreshCw,
  Package,
  AlertTriangle,
} from "lucide-react"
import {
  getPendingApprovals,
  getApprovalStats,
  approveRequest,
  ensureApprovalDataSeeded,
  type ApprovalRequest,
  type ApprovalStats,
  type ApprovalPriority,
} from "@/lib/storage"
import { toast } from "sonner"
import Link from "next/link"

const PRIORITY_COLORS: Record<ApprovalPriority, string> = {
  alta: "bg-red-100 text-red-800 border-red-300",
  media: "bg-yellow-100 text-yellow-800 border-yellow-300",
  baixa: "bg-gray-100 text-gray-600 border-gray-300",
}

const PRIORITY_LABELS: Record<ApprovalPriority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
}

interface ApprovalWorkflowWidgetProps {
  companyId?: string
}

export function ApprovalWorkflowWidget({ companyId = "company_1" }: ApprovalWorkflowWidgetProps) {
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([])
  const [stats, setStats] = useState<ApprovalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(() => {
    setLoading(true)
    setError(null)
    try {
      // Garante que os dados de demo foram inicializados
      ensureApprovalDataSeeded()
      
      const pending = getPendingApprovals(companyId)
      const approvalStats = getApprovalStats(companyId)
      setPendingApprovals(pending.slice(0, 3)) // Mostrar apenas 3 no widget
      setStats(approvalStats)
    } catch (err) {
      console.error("[ApprovalWorkflowWidget] Error loading data:", err)
      setError("Erro ao carregar aprovações")
    } finally {
      setLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleReview = (id: string) => {
    // Navegar para a página de aprovações com o item selecionado
    window.location.href = `/gestor/aprovacoes?id=${id}`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 flex flex-col items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={loadData}>
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Workflow de Aprovações
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pedidos pendentes de aprovação manual
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna 1: Aprovações Pendentes */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Aprovações Pendentes
            </h4>
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                Nenhuma aprovação pendente
              </div>
            ) : (
              <div className="space-y-2">
                {pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                        <Package className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{approval.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {approval.requesterName} • {approval.referenceId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${PRIORITY_COLORS[approval.priority]} border text-xs px-2 py-0.5`}
                      >
                        {PRIORITY_LABELS[approval.priority]}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(approval.id)}
                      >
                        Revisar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coluna 2: Estatísticas de Aprovação */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Estatísticas de Aprovação
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                <span className="text-sm">Aprovados Hoje</span>
                <span className="text-lg font-bold text-green-600">
                  {stats?.approvedToday || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                <span className="text-sm">Pendentes</span>
                <span className="text-lg font-bold text-yellow-600">
                  {stats?.pending || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
                <span className="text-sm">Rejeitados Hoje</span>
                <span className="text-lg font-bold text-red-600">
                  {stats?.rejectedToday || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <span className="text-sm">Tempo Médio</span>
                <span className="text-lg font-bold text-blue-600">
                  {stats?.averageTimeHours || 0}h
                </span>
              </div>
            </div>
          </div>

          {/* Coluna 3: Ações Rápidas */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Ações Rápidas
            </h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-11"
                asChild
              >
                <Link href="/gestor/aprovacoes?action=approve-selected">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Aprovar Selecionados
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-11"
                asChild
              >
                <Link href="/gestor/aprovacoes">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                  Revisar Fila
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-11"
                asChild
              >
                <Link href="/gestor/aprovacoes?tab=historico">
                  <History className="h-4 w-4 text-purple-600" />
                  Ver Histórico
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-11 border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-600 dark:hover:bg-green-950/50"
                asChild
              >
                <Link href="/gestor/aprovacoes/regras">
                  <Settings className="h-4 w-4 text-green-600" />
                  Configurar Regras
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
