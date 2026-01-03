"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Package,
  Zap,
  User,
} from "lucide-react"
import { 
  getSupplierSyncLogs, 
  getSuppliers,
  type SupplierSyncLog,
  type Supplier,
} from "@/lib/storage"
import Link from "next/link"

const SYNC_TYPE_LABELS: Record<SupplierSyncLog["syncType"], string> = {
  prices: "Preços",
  stock: "Estoque",
  products: "Produtos",
  full: "Completa",
}

const STATUS_CONFIG: Record<SupplierSyncLog["status"], { label: string; color: string; icon: React.ReactNode }> = {
  success: { label: "Sucesso", color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3 w-3" /> },
  partial: { label: "Parcial", color: "bg-yellow-100 text-yellow-800", icon: <AlertTriangle className="h-3 w-3" /> },
  failed: { label: "Falha", color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> },
}

export default function SyncLogsPage() {
  const searchParams = useSearchParams()
  const supplierIdParam = searchParams.get("supplierId")
  
  const [logs, setLogs] = useState<SupplierSyncLog[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSupplier, setSelectedSupplier] = useState<string>(supplierIdParam || "all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<SupplierSyncLog | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    try {
      setSuppliers(getSuppliers())
      setLogs(getSupplierSyncLogs())
    } catch (error) {
      console.error("Erro ao carregar logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSupplier = selectedSupplier === "all" || log.supplierId === selectedSupplier
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus
    const matchesType = selectedType === "all" || log.syncType === selectedType
    return matchesSupplier && matchesStatus && matchesType
  })

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId)
    return supplier?.name || supplierId
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}min`
  }

  const successCount = logs.filter(l => l.status === "success").length
  const failedCount = logs.filter(l => l.status === "failed").length
  const totalUpdated = logs.reduce((acc, l) => acc + l.productsUpdated, 0)

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/super-admin/fornecedores">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Logs de Sincronização</h1>
          <p className="text-muted-foreground text-sm">
            Histórico de sincronizações com fornecedores
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logs.length}</p>
                <p className="text-sm text-muted-foreground">Total de Sinc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{successCount}</p>
                <p className="text-sm text-muted-foreground">Sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{failedCount}</p>
                <p className="text-sm text-muted-foreground">Falhas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUpdated}</p>
                <p className="text-sm text-muted-foreground">Produtos Atualizados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os fornecedores</SelectItem>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="partial">Parcial</SelectItem>
                <SelectItem value="failed">Falha</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="prices">Preços</SelectItem>
                <SelectItem value="stock">Estoque</SelectItem>
                <SelectItem value="products">Produtos</SelectItem>
                <SelectItem value="full">Completa</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={loadData}>
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Disparado Por</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Nenhum log de sincronização encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(log.startedAt).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.startedAt).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{getSupplierName(log.supplierId)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {SYNC_TYPE_LABELS[log.syncType]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`gap-1 ${STATUS_CONFIG[log.status].color}`}>
                        {STATUS_CONFIG[log.status].icon}
                        {STATUS_CONFIG[log.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-green-600">{log.productsUpdated} atualiz.</span>
                        {log.productsCreated > 0 && (
                          <span className="text-blue-600 ml-2">{log.productsCreated} novos</span>
                        )}
                        {log.productsFailed > 0 && (
                          <span className="text-red-600 ml-2">{log.productsFailed} falhas</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDuration(log.duration)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {log.triggeredBy === "auto" ? (
                          <Badge variant="secondary" className="gap-1">
                            <Zap className="h-3 w-3" />
                            Auto
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <User className="h-3 w-3" />
                            Manual
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Sincronização</DialogTitle>
            <DialogDescription>
              Log ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fornecedor</p>
                  <p className="font-medium">{getSupplierName(selectedLog.supplierId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge variant="outline">{SYNC_TYPE_LABELS[selectedLog.syncType]}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`gap-1 ${STATUS_CONFIG[selectedLog.status].color}`}>
                    {STATUS_CONFIG[selectedLog.status].icon}
                    {STATUS_CONFIG[selectedLog.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duração</p>
                  <p className="font-medium">{formatDuration(selectedLog.duration)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Período</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Início</p>
                    <p className="text-sm">{new Date(selectedLog.startedAt).toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fim</p>
                    <p className="text-sm">{new Date(selectedLog.completedAt).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Resultados</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedLog.productsUpdated}</p>
                    <p className="text-xs text-green-700">Atualizados</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedLog.productsCreated}</p>
                    <p className="text-xs text-blue-700">Criados</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{selectedLog.productsFailed}</p>
                    <p className="text-xs text-red-700">Falhas</p>
                  </div>
                </div>
              </div>

              {selectedLog.errors && selectedLog.errors.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Erros ({selectedLog.errors.length})</p>
                  <div className="bg-red-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <ul className="space-y-1">
                      {selectedLog.errors.map((error, idx) => (
                        <li key={idx} className="text-sm text-red-700">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Disparado Por</p>
                <div className="flex items-center gap-2">
                  {selectedLog.triggeredBy === "auto" ? (
                    <>
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="h-3 w-3" />
                        Automático
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        (sincronização agendada)
                      </span>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline" className="gap-1">
                        <User className="h-3 w-3" />
                        Manual
                      </Badge>
                      {selectedLog.triggeredByUser && (
                        <span className="text-sm text-muted-foreground">
                          por {selectedLog.triggeredByUser}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
