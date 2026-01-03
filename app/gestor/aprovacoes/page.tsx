"use client"

import { useState, useEffect, useMemo } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Download,
  Settings,
  Package,
  DollarSign,
  Gift,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Building,
  AlertCircle,
  HelpCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  getApprovalRequests,
  getApprovalStats,
  approveRequest,
  rejectRequest,
  approveMultipleRequests,
  getUserById,
  type ApprovalRequest,
  type ApprovalStats,
  type ApprovalPriority,
  type ApprovalRequestType,
  type RejectionCategory,
} from "@/lib/storage"
import { toast } from "sonner"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const PRIORITY_COLORS: Record<ApprovalPriority, string> = {
  alta: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300",
  media: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300",
  baixa: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300",
}

const PRIORITY_LABELS: Record<ApprovalPriority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
}

const TYPE_ICONS: Record<ApprovalRequestType, typeof Package> = {
  order: Package,
  budget: DollarSign,
  gift: Gift,
  requisition: FileText,
}

const TYPE_LABELS: Record<ApprovalRequestType, string> = {
  order: "Pedido",
  budget: "Orçamento",
  gift: "Presente",
  requisition: "Requisição",
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300",
  info_requested: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  info_requested: "Info Solicitada",
}

const REJECTION_CATEGORIES: { value: RejectionCategory; label: string; description: string }[] = [
  { value: "missing_info", label: "Informações Faltando", description: "A solicitação não possui todas as informações necessárias" },
  { value: "budget_exceeded", label: "Orçamento Excedido", description: "O valor excede o limite aprovado" },
  { value: "unauthorized", label: "Não Autorizado", description: "Solicitante não tem autorização para este pedido" },
  { value: "policy_violation", label: "Violação de Política", description: "A solicitação viola políticas da empresa" },
  { value: "other", label: "Outro", description: "Outro motivo" },
]

export default function AprovacoesPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "pendentes"
  
  const [activeTab, setActiveTab] = useState(initialTab)
  const [requests, setRequests] = useState<ApprovalRequest[]>([])
  const [stats, setStats] = useState<ApprovalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)
  const [companyId, setCompanyId] = useState("company_1")
  const [currentUserId, setCurrentUserId] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 10

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showInfoRequestModal, setShowInfoRequestModal] = useState(false)
  
  // Form states
  const [approvalNotes, setApprovalNotes] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [rejectionCategory, setRejectionCategory] = useState<RejectionCategory | "">("")
  const [infoRequestMessage, setInfoRequestMessage] = useState("")
  const [showItemsExpanded, setShowItemsExpanded] = useState(false)

  // Sync activeTab with URL parameters
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam)
      setPage(1) // Reset pagination when changing tabs
    }
  }, [searchParams, activeTab])

  // Handle id parameter to open specific request detail
  useEffect(() => {
    const idParam = searchParams.get("id")
    if (idParam && requests.length > 0) {
      const request = requests.find(r => r.id === idParam)
      if (request) {
        setSelectedRequest(request)
        setShowDetailModal(true)
      }
    }
  }, [searchParams.get("id"), requests])

  // Handle action parameter for bulk actions - moved after handleApproveSelected definition

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) setCompanyId(auth.companyId)
        if (auth.userId) setCurrentUserId(auth.userId)
      } catch {}
    }
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    const allRequests = getApprovalRequests(companyId)
    const approvalStats = getApprovalStats(companyId)
    setRequests(allRequests)
    setStats(approvalStats)
    setLoading(false)
  }

  // Filtered requests based on tab and filters
  const filteredRequests = useMemo(() => {
    let filtered = requests

    // Filter by tab
    if (activeTab === "pendentes") {
      filtered = filtered.filter(r => r.status === "pending" || r.status === "info_requested")
    } else if (activeTab === "historico") {
      filtered = filtered.filter(r => r.status === "approved" || r.status === "rejected")
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchLower) ||
        r.requesterName.toLowerCase().includes(searchLower) ||
        r.referenceId.toLowerCase().includes(searchLower)
      )
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(r => r.priority === priorityFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(r => r.type === typeFilter)
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [requests, activeTab, search, priorityFilter, typeFilter])

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / perPage)
  const paginatedRequests = filteredRequests.slice((page - 1) * perPage, page * perPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedRequests.map(r => r.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) {
      newSet.add(id)
    } else {
      newSet.delete(id)
    }
    setSelectedIds(newSet)
  }

  const openDetailModal = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
    setShowItemsExpanded(false)
  }

  const openApproveModal = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setApprovalNotes("")
    setShowApproveModal(true)
  }

  const openRejectModal = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setRejectReason("")
    setRejectionCategory("")
    setShowRejectModal(true)
  }

  const openInfoRequestModal = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setInfoRequestMessage("")
    setShowInfoRequestModal(true)
  }

  const handleApprove = () => {
    if (!selectedRequest) return
    
    const result = approveRequest(selectedRequest.id, currentUserId, approvalNotes)
    if (result) {
      toast.success(`Solicitação "${selectedRequest.title}" aprovada com sucesso`)
      loadData()
      setShowApproveModal(false)
      setShowDetailModal(false)
      setSelectedRequest(null)
    } else {
      toast.error("Erro ao aprovar solicitação")
    }
  }

  const handleReject = () => {
    if (!selectedRequest) return
    if (!rejectionCategory) {
      toast.error("Selecione uma categoria de rejeição")
      return
    }
    if (!rejectReason.trim()) {
      toast.error("Informe o motivo da rejeição")
      return
    }
    
    const result = rejectRequest(selectedRequest.id, currentUserId, rejectReason, rejectionCategory as RejectionCategory)
    if (result) {
      toast.success(`Solicitação "${selectedRequest.title}" rejeitada`)
      loadData()
      setShowRejectModal(false)
      setShowDetailModal(false)
      setSelectedRequest(null)
    } else {
      toast.error("Erro ao rejeitar solicitação")
    }
  }

  const handleRequestInfo = () => {
    if (!selectedRequest) return
    if (!infoRequestMessage.trim()) {
      toast.error("Informe quais informações adicionais são necessárias")
      return
    }
    
    // Update status to info_requested
    const updated = {
      ...selectedRequest,
      status: "info_requested" as const,
      infoRequestMessage,
      updatedAt: new Date().toISOString(),
    }
    
    // In a real implementation, this would update the storage
    toast.success(`Solicitação de informações enviada para "${selectedRequest.requesterName}"`)
    loadData()
    setShowInfoRequestModal(false)
    setShowDetailModal(false)
    setSelectedRequest(null)
  }

  const handleApproveSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecione pelo menos uma solicitação")
      return
    }
    
    const count = approveMultipleRequests(Array.from(selectedIds), currentUserId)
    toast.success(`${count} solicitação(ões) aprovada(s)`)
    setSelectedIds(new Set())
    loadData()
  }

  // Handle action parameter for bulk actions
  useEffect(() => {
    const actionParam = searchParams.get("action")
    if (actionParam === "approve-selected" && selectedIds.size > 0) {
      handleApproveSelected()
    }
  }, [searchParams.get("action"), selectedIds])

  const handleExportCSV = () => {
    const headers = ["ID", "Título", "Tipo", "Solicitante", "Prioridade", "Valor", "Status", "Data"]
    const rows = filteredRequests.map(r => [
      r.referenceId,
      r.title,
      TYPE_LABELS[r.type],
      r.requesterName,
      PRIORITY_LABELS[r.priority],
      r.value.toFixed(2),
      STATUS_LABELS[r.status] || r.status,
      new Date(r.createdAt).toLocaleDateString("pt-BR"),
    ])
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `aprovacoes_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV exportado com sucesso")
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const getTimeSinceCreated = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diffMs = now.getTime() - created.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays} dia(s)`
    if (diffHours > 0) return `${diffHours} hora(s)`
    return "Agora"
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            Workflow de Aprovações
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie solicitações pendentes de aprovação
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/gestor/aprovacoes/regras">
              <Settings className="h-4 w-4" />
              Regras
            </Link>
          </Button>
          <Button onClick={loadData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprovados Hoje</p>
                <p className="text-3xl font-bold text-green-600">{stats?.approvedToday || 0}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejeitados Hoje</p>
                <p className="text-3xl font-bold text-red-600">{stats?.rejectedToday || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.averageTimeHours || 0}h</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Content */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <TabsList>
                <TabsTrigger value="pendentes" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Pendentes
                  {stats?.pending ? (
                    <Badge variant="secondary" className="ml-1">{stats.pending}</Badge>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="historico" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="order">Pedido</SelectItem>
                    <SelectItem value="budget">Orçamento</SelectItem>
                    <SelectItem value="gift">Presente</SelectItem>
                    <SelectItem value="requisition">Requisição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Bulk Actions */}
            {activeTab === "pendentes" && selectedIds.size > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-muted flex items-center justify-between">
                <span className="text-sm">
                  {selectedIds.size} item(ns) selecionado(s)
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleApproveSelected} className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Aprovar Selecionados
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())}>
                    Limpar
                  </Button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {activeTab === "pendentes" && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={paginatedRequests.length > 0 && selectedIds.size === paginatedRequests.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                    )}
                    <TableHead>Solicitação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    {activeTab === "historico" && <TableHead>Status</TableHead>}
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={activeTab === "pendentes" ? 8 : 8} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : paginatedRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={activeTab === "pendentes" ? 8 : 8} className="text-center py-8 text-muted-foreground">
                        Nenhuma solicitação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRequests.map((request) => {
                      const TypeIcon = TYPE_ICONS[request.type]
                      return (
                        <TableRow 
                          key={request.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openDetailModal(request)}
                        >
                          {activeTab === "pendentes" && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedIds.has(request.id)}
                                onCheckedChange={(checked) => handleSelectOne(request.id, checked as boolean)}
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <div>
                              <p className="font-medium">{request.title}</p>
                              <p className="text-xs text-muted-foreground">{request.referenceId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              {TYPE_LABELS[request.type]}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {request.requesterName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${PRIORITY_COLORS[request.priority]} border`}>
                              {PRIORITY_LABELS[request.priority]}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(request.value)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(request.createdAt)}
                          </TableCell>
                          {activeTab === "historico" && (
                            <TableCell>
                              <Badge className={`${STATUS_COLORS[request.status]} border`}>
                                {STATUS_LABELS[request.status] || request.status}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            {request.status === "pending" ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openDetailModal(request)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => openApproveModal(request)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => openRejectModal(request)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : request.status === "info_requested" ? (
                              <Badge variant="outline" className="gap-1">
                                <HelpCircle className="h-3 w-3" />
                                Aguardando Info
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openDetailModal(request)}
                              >
                                Detalhes
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {((page - 1) * perPage) + 1} a {Math.min(page * perPage, filteredRequests.length)} de {filteredRequests.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Tabs>
      </Card>

      {/* Detail Modal - Enhanced */}
      <ResponsiveModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        title={selectedRequest?.title}
        description={`Detalhes da solicitação ${selectedRequest?.referenceId}`}
        maxWidth="2xl"
        footer={
          selectedRequest?.status === "pending" ? (
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => {
                  setShowDetailModal(false)
                  openInfoRequestModal(selectedRequest)
                }}
              >
                <HelpCircle className="h-4 w-4" />
                Solicitar Mais Info
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  setShowDetailModal(false)
                  openRejectModal(selectedRequest)
                }}
              >
                <XCircle className="h-4 w-4" />
                Rejeitar
              </Button>
              <Button 
                className="flex-1 gap-2"
                onClick={() => {
                  setShowDetailModal(false)
                  openApproveModal(selectedRequest)
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                Aprovar
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Fechar
            </Button>
          )
        }
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Status and Priority Banner */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Badge className={`${STATUS_COLORS[selectedRequest.status]} border`}>
                {STATUS_LABELS[selectedRequest.status] || selectedRequest.status}
              </Badge>
              <Badge className={`${PRIORITY_COLORS[selectedRequest.priority]} border`}>
                Prioridade {PRIORITY_LABELS[selectedRequest.priority]}
              </Badge>
              <span className="text-sm text-muted-foreground ml-auto">
                Criado há {getTimeSinceCreated(selectedRequest.createdAt)}
              </span>
            </div>

            {/* Requester Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações do Solicitante
              </h4>
              <div className="grid gap-3 sm:grid-cols-2 p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Nome</p>
                    <p className="font-medium">{selectedRequest.requesterName}</p>
                  </div>
                </div>
                {selectedRequest.requesterEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedRequest.requesterEmail}</p>
                    </div>
                  </div>
                )}
                {selectedRequest.requesterPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="font-medium">{selectedRequest.requesterPhone}</p>
                    </div>
                  </div>
                )}
                {selectedRequest.requesterDepartment && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Departamento</p>
                      <p className="font-medium">{selectedRequest.requesterDepartment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Request Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Detalhes da Solicitação
              </h4>
              <div className="grid gap-4 sm:grid-cols-3 p-4 rounded-lg border bg-card">
                <div>
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const TypeIcon = TYPE_ICONS[selectedRequest.type]
                      return <TypeIcon className="h-4 w-4 text-muted-foreground" />
                    })()}
                    <span className="font-medium">{TYPE_LABELS[selectedRequest.type]}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold text-primary mt-1">
                    {formatCurrency(selectedRequest.value)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data da Solicitação</p>
                  <p className="font-medium mt-1">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Descrição</h4>
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-sm whitespace-pre-wrap">
                  {selectedRequest.detailedDescription || selectedRequest.description || "Sem descrição detalhada."}
                </p>
              </div>
            </div>

            {/* Attached Items */}
            {selectedRequest.attachedItems && selectedRequest.attachedItems.length > 0 && (
              <div className="space-y-3">
                <button
                  className="text-sm font-semibold flex items-center gap-2 w-full text-left"
                  onClick={() => setShowItemsExpanded(!showItemsExpanded)}
                >
                  <Package className="h-4 w-4" />
                  Itens Anexados ({selectedRequest.attachedItems.length})
                  {showItemsExpanded ? (
                    <ChevronUp className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  )}
                </button>
                {showItemsExpanded && (
                  <div className="space-y-2">
                    {selectedRequest.attachedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-12 w-12 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          {item.sku && (
                            <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                          )}
                        </div>
                        {item.quantity && (
                          <div className="text-right">
                            <p className="text-sm">{item.quantity}x</p>
                            {item.unitPrice && (
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(item.unitPrice)}
                              </p>
                            )}
                          </div>
                        )}
                        {item.totalPrice && (
                          <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Linha do Tempo
              </h4>
              <div className="space-y-2 p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm">Criado</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {formatDate(selectedRequest.createdAt)}
                  </span>
                </div>
                {selectedRequest.updatedAt !== selectedRequest.createdAt && (
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-sm">Atualizado</span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {formatDate(selectedRequest.updatedAt)}
                    </span>
                  </div>
                )}
                {selectedRequest.reviewedAt && (
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      selectedRequest.status === "approved" ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-sm">
                      {selectedRequest.status === "approved" ? "Aprovado" : "Rejeitado"}
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {formatDate(selectedRequest.reviewedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Approval/Rejection Info */}
            {selectedRequest.approvalNotes && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                  Notas de Aprovação
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {selectedRequest.approvalNotes}
                </p>
              </div>
            )}

            {selectedRequest.rejectionReason && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                  Motivo da Rejeição
                  {selectedRequest.rejectionCategory && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {REJECTION_CATEGORIES.find(c => c.value === selectedRequest.rejectionCategory)?.label}
                    </Badge>
                  )}
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {selectedRequest.rejectionReason}
                </p>
              </div>
            )}

            {selectedRequest.infoRequestMessage && (
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  Informações Solicitadas
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  {selectedRequest.infoRequestMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </ResponsiveModal>

      {/* Approve Modal with Notes */}
      <ResponsiveModal
        open={showApproveModal}
        onOpenChange={setShowApproveModal}
        title="Aprovar Solicitação"
        description={`Confirmar aprovação de "${selectedRequest?.title}"`}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setShowApproveModal(false)}>
              Cancelar
            </Button>
            <Button className="flex-1 gap-2" onClick={handleApprove}>
              <CheckCircle2 className="h-4 w-4" />
              Confirmar Aprovação
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold">{selectedRequest?.title}</p>
                <p className="text-sm text-muted-foreground">
                  Valor: {selectedRequest && formatCurrency(selectedRequest.value)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approvalNotes">Notas de Aprovação (opcional)</Label>
            <Textarea
              id="approvalNotes"
              placeholder="Adicione notas ou justificativa para esta aprovação..."
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Estas notas serão registradas junto à aprovação e visíveis ao solicitante.
            </p>
          </div>
        </div>
      </ResponsiveModal>

      {/* Reject Modal with Categories */}
      <ResponsiveModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        title="Rejeitar Solicitação"
        description={`Informe o motivo da rejeição de "${selectedRequest?.title}"`}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setShowRejectModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1 gap-2" 
              onClick={handleReject}
              disabled={!rejectionCategory || !rejectReason.trim()}
            >
              <XCircle className="h-4 w-4" />
              Confirmar Rejeição
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="font-semibold">{selectedRequest?.title}</p>
                <p className="text-sm text-muted-foreground">
                  Valor: {selectedRequest && formatCurrency(selectedRequest.value)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejectionCategory">Categoria da Rejeição *</Label>
            <Select value={rejectionCategory} onValueChange={(v) => setRejectionCategory(v as RejectionCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {REJECTION_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex flex-col">
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rejectionCategory && (
              <p className="text-xs text-muted-foreground">
                {REJECTION_CATEGORIES.find(c => c.value === rejectionCategory)?.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejectReason">Motivo Detalhado *</Label>
            <Textarea
              id="rejectReason"
              placeholder="Descreva o motivo da rejeição em detalhes..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              O solicitante receberá esta justificativa.
            </p>
          </div>
        </div>
      </ResponsiveModal>

      {/* Request Info Modal */}
      <ResponsiveModal
        open={showInfoRequestModal}
        onOpenChange={setShowInfoRequestModal}
        title="Solicitar Mais Informações"
        description={`Solicitar informações adicionais sobre "${selectedRequest?.title}"`}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setShowInfoRequestModal(false)}>
              Cancelar
            </Button>
            <Button 
              className="flex-1 gap-2" 
              onClick={handleRequestInfo}
              disabled={!infoRequestMessage.trim()}
            >
              <MessageSquare className="h-4 w-4" />
              Enviar Solicitação
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold">{selectedRequest?.title}</p>
                <p className="text-sm text-muted-foreground">
                  Solicitante: {selectedRequest?.requesterName}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="infoRequest">Quais informações são necessárias? *</Label>
            <Textarea
              id="infoRequest"
              placeholder="Descreva quais informações adicionais você precisa para tomar uma decisão..."
              value={infoRequestMessage}
              onChange={(e) => setInfoRequestMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              A solicitação ficará em espera até que o solicitante forneça as informações.
            </p>
          </div>
        </div>
      </ResponsiveModal>
    </PageContainer>
  )
}
