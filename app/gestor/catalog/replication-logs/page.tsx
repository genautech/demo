"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Package,
  Calendar,
  User,
  FileText,
} from "lucide-react"
import { useDemoState } from "@/hooks/use-demo-state"
import { getReplicationLogsByCompany, getCompanyById, type ReplicationLog } from "@/lib/storage"

export default function ReplicationLogsPage() {
  const { env } = useDemoState()
  const [logs, setLogs] = useState<ReplicationLog[]>([])
  const [selectedLog, setSelectedLog] = useState<ReplicationLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
          loadLogs(auth.companyId)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error parsing auth:", error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [env])

  const loadLogs = (companyId: string) => {
    setLoading(true)
    const companyLogs = getReplicationLogsByCompany(companyId)
    setLogs(companyLogs)
    setLoading(false)
  }

  const getStatusBadge = (status: ReplicationLog["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500 text-white border-none"><CheckCircle2 className="h-3 w-3 mr-1" /> Sucesso</Badge>
      case "partial":
        return <Badge className="bg-yellow-500 text-white border-none"><AlertTriangle className="h-3 w-3 mr-1" /> Parcial</Badge>
      case "failed":
        return <Badge className="bg-red-500 text-white border-none"><XCircle className="h-3 w-3 mr-1" /> Falhou</Badge>
    }
  }

  const getActionLabel = (action: ReplicationLog["action"]) => {
    switch (action) {
      case "replicate_single":
        return "Replicação Individual"
      case "replicate_budget":
        return "Replicação de Budget"
      case "update":
        return "Atualização"
      case "cancel":
        return "Cancelamento"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  const company = companyId ? getCompanyById(companyId) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Histórico de Replicação</h1>
          <p className="text-muted-foreground text-sm">
            Logs de sincronização do catálogo base para {company?.name || companyId || "a empresa"}
          </p>
        </div>
        <Button 
          onClick={() => companyId && loadLogs(companyId)} 
          variant="outline" 
          className="gap-2"
          disabled={!companyId}
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Nenhum log de replicação encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resumo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(log.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{getActionLabel(log.action)}</span>
                      </div>
                      {log.budgetId && (
                        <span className="text-xs text-muted-foreground">Budget: {log.budgetId}</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-medium">✓ {log.summary.created} criados</span>
                          <span className="text-blue-600 font-medium">↻ {log.summary.updated} atualizados</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">⊘ {log.summary.skipped} ignorados</span>
                          {log.summary.failed > 0 && (
                            <span className="text-red-600 font-medium">✗ {log.summary.failed} falhas</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{log.actorId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Log Details Dialog */}
      {selectedLog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Detalhes do Log de Replicação
            </CardTitle>
            <CardDescription>
              {formatDate(selectedLog.createdAt)} • {getActionLabel(selectedLog.action)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                <p className="mt-1 text-sm">{selectedLog.actorId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                <p className="mt-1 text-sm">{company?.name || selectedLog.companyId}</p>
              </div>
              {selectedLog.budgetId && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget</p>
                  <p className="mt-1 text-sm font-mono">{selectedLog.budgetId}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Resumo</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold">{selectedLog.summary.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedLog.summary.created}</p>
                  <p className="text-xs text-muted-foreground">Criados</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedLog.summary.updated}</p>
                  <p className="text-xs text-muted-foreground">Atualizados</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-600">{selectedLog.summary.skipped}</p>
                  <p className="text-xs text-muted-foreground">Ignorados</p>
                </div>
              </div>
            </div>

            {selectedLog.errors && selectedLog.errors.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2 text-destructive">Erros</p>
                <div className="space-y-1">
                  {selectedLog.errors.map((error, idx) => (
                    <div key={idx} className="text-sm text-destructive bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedLog.results && selectedLog.results.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Resultados Individuais</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedLog.results.map((result, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                      <div>
                        <span className="font-medium">{result.product?.name || result.product?.id || "Produto"}</span>
                        {result.error && (
                          <span className="text-red-600 ml-2">• {result.error}</span>
                        )}
                      </div>
                      <Badge variant="outline" className={
                        result.status === "created" ? "bg-green-50 text-green-700" :
                        result.status === "updated" ? "bg-blue-50 text-blue-700" :
                        "bg-gray-50 text-gray-700"
                      }>
                        {result.status === "created" ? "Criado" :
                         result.status === "updated" ? "Atualizado" : "Ignorado"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
