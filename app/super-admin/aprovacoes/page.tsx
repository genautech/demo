"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Building,
  DollarSign,
  RefreshCw,
  Eye,
  Check,
  X,
  Edit,
  Trash2,
  Send,
  FileText,
  Mail,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ArrowUpDown,
  Percent,
  Copy,
  Sparkles,
  Factory,
  Warehouse,
  Truck,
  Store,
  CreditCard,
  Calendar,
} from "lucide-react"
import {
  getAllBudgetsWithDetails,
  getBudgetWithDetails,
  getBudgetStats,
  markBudgetAsReviewed,
  approveBudget,
  rejectBudget,
  requestBudgetChanges,
  releaseBudget,
  updateBudgetItem,
  deleteBudgetItem,
  getBaseProductById,
  getBaseProducts,
  getBudgetMessages,
  addBudgetMessage,
  markBudgetMessagesAsRead,
  getUnreadMessageCount,
  getCompanies,
  getCostCenters,
  sendFinalValuesToGestor,
  confirmBudgetPayment,
  releaseToProduction,
  replicateToStock,
  markAsAvailable,
  publishToStore,
  updateBudget,
  type BudgetWithDetails,
  type BudgetItem,
  type BudgetStatus,
  type BudgetType,
  type BudgetMessage,
  type Company,
  type CostCenter,
} from "@/lib/storage"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Response templates
const RESPONSE_TEMPLATES = [
  {
    id: "price_adjustment",
    label: "Ajuste de Preços",
    message: "Prezado gestor, após análise do orçamento, identificamos que alguns itens necessitam de ajuste de preço. Por favor, revise os valores e reenvie o orçamento.",
  },
  {
    id: "missing_info",
    label: "Informações Faltando",
    message: "Precisamos de informações adicionais para processar este orçamento. Por favor, especifique: [detalhe o que está faltando]",
  },
  {
    id: "quantity_confirmation",
    label: "Confirmar Quantidades",
    message: "Gostaríamos de confirmar as quantidades solicitadas antes de prosseguir. Você confirma os valores listados?",
  },
  {
    id: "delivery_question",
    label: "Prazo de Entrega",
    message: "Qual o prazo desejado para entrega destes itens? Dependendo do volume, podemos precisar de [X] dias úteis.",
  },
  {
    id: "budget_approved",
    label: "Orçamento Aprovado",
    message: "Seu orçamento foi aprovado! Os produtos serão adicionados ao catálogo da empresa em breve.",
  },
]

// Status configuration
const STATUS_CONFIG: Record<BudgetStatus, { label: string; color: string; icon: any }> = {
  draft: { label: "Rascunho", color: "bg-gray-100 text-gray-700", icon: FileText },
  submitted: { label: "Aguardando", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  reviewed: { label: "Em Análise", color: "bg-blue-100 text-blue-700", icon: Eye },
  awaiting_approval: { label: "Aguard. Aprovação", color: "bg-orange-100 text-orange-700", icon: Clock },
  approved: { label: "Aprovado", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  awaiting_payment: { label: "Aguard. Pagamento", color: "bg-amber-100 text-amber-700", icon: CreditCard },
  payment_confirmed: { label: "Pago", color: "bg-teal-100 text-teal-700", icon: CheckCircle2 },
  released: { label: "Liberado", color: "bg-purple-100 text-purple-700", icon: Send },
  in_production: { label: "Em Produção", color: "bg-indigo-100 text-indigo-700", icon: Factory },
  in_stock: { label: "Em Estoque", color: "bg-cyan-100 text-cyan-700", icon: Warehouse },
  available: { label: "Disponível", color: "bg-lime-100 text-lime-700", icon: Truck },
  published: { label: "Publicado", color: "bg-emerald-100 text-emerald-700", icon: Store },
  rejected: { label: "Rejeitado", color: "bg-red-100 text-red-700", icon: XCircle },
}

export default function SuperAdminApprovalsPage() {
  const [budgets, setBudgets] = useState<BudgetWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [costCenterFilter, setCostCenterFilter] = useState<string>("all")
  const [companies, setCompanies] = useState<Company[]>([])
  const [costCenters, setCostCenters] = useState<CostCenter[]>([])
  const [stats, setStats] = useState({ pending: 0, approvedToday: 0, rejectedToday: 0, totalPendingValue: 0 })
  
  // Detail sheet state
  const [selectedBudget, setSelectedBudget] = useState<BudgetWithDetails | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailTab, setDetailTab] = useState("items")
  
  // Edit item dialog
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
  const [editPrice, setEditPrice] = useState("")
  const [editQty, setEditQty] = useState("")
  
  // Reject dialog
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  
  // Request changes dialog
  const [isChangesDialogOpen, setIsChangesDialogOpen] = useState(false)
  const [changesFeedback, setChangesFeedback] = useState("")
  
  // Messages state
  const [messages, setMessages] = useState<BudgetMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map())
  
  // Price comparison
  const [showPriceComparison, setShowPriceComparison] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    try {
      const allBudgets = getAllBudgetsWithDetails()
      setBudgets(allBudgets)
      setStats(getBudgetStats())
      
      // Load companies and cost centers
      const allCompanies = getCompanies()
      setCompanies(allCompanies)
      
      const allCostCenters = getCostCenters()
      setCostCenters(allCostCenters)
      
      // Load unread counts
      const counts = new Map<string, number>()
      allBudgets.forEach(budget => {
        const count = getUnreadMessageCount(budget.id, "superAdmin")
        if (count > 0) {
          counts.set(budget.id, count)
        }
      })
      setUnreadCounts(counts)
    } catch (error) {
      console.error("Error loading budgets:", error)
      toast.error("Erro ao carregar orçamentos")
    } finally {
      setLoading(false)
    }
  }

  // Filter budgets
  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = 
      budget.id.toLowerCase().includes(search.toLowerCase()) ||
      budget.title.toLowerCase().includes(search.toLowerCase()) ||
      budget.company?.name.toLowerCase().includes(search.toLowerCase()) ||
      (budget.costCenterName?.toLowerCase().includes(search.toLowerCase()))
    
    let matchesStatus = true
    if (statusFilter === "pending") {
      matchesStatus = budget.status === "draft" || budget.status === "submitted" || budget.status === "reviewed" || budget.status === "awaiting_approval"
    } else if (statusFilter === "restock") {
      matchesStatus = budget.budgetType === "restock"
    } else if (statusFilter !== "all") {
      matchesStatus = budget.status === statusFilter
    }
    
    const matchesCompany = companyFilter === "all" || budget.companyId === companyFilter
    const matchesCostCenter = costCenterFilter === "all" || budget.costCenterId === costCenterFilter
    
    return matchesSearch && matchesStatus && matchesCompany && matchesCostCenter
  })
  
  // Get unique cost centers from filtered budgets for secondary filter
  const availableCostCenters = costCenters.filter(cc => 
    companyFilter === "all" || cc.companyId === companyFilter
  )

  // Open budget detail
  const handleOpenDetail = (budget: BudgetWithDetails) => {
    // Mark as reviewed if it's submitted
    if (budget.status === "submitted") {
      markBudgetAsReviewed(budget.id)
    }
    
    // Reload with fresh data
    const freshBudget = getBudgetWithDetails(budget.id)
    if (freshBudget) {
      setSelectedBudget(freshBudget)
      setIsDetailOpen(true)
      setDetailTab("items")
      
      // Load messages
      const budgetMessages = getBudgetMessages(budget.id)
      setMessages(budgetMessages)
      markBudgetMessagesAsRead(budget.id, "superAdmin")
      
      // Update unread counts
      const newCounts = new Map(unreadCounts)
      newCounts.delete(budget.id)
      setUnreadCounts(newCounts)
    }
  }

  // Handle approve
  const handleApprove = (budgetId: string) => {
    try {
      approveBudget(budgetId, "super_admin")
      toast.success("Orçamento aprovado com sucesso!")
      loadData()
      setIsDetailOpen(false)
    } catch (error) {
      toast.error("Erro ao aprovar orçamento")
    }
  }

  // Handle reject
  const handleReject = () => {
    if (!selectedBudget || !rejectReason.trim()) {
      toast.error("Por favor, informe o motivo da rejeição")
      return
    }
    
    try {
      rejectBudget(selectedBudget.id, "super_admin", rejectReason)
      toast.success("Orçamento rejeitado")
      setIsRejectDialogOpen(false)
      setRejectReason("")
      loadData()
      setIsDetailOpen(false)
    } catch (error) {
      toast.error("Erro ao rejeitar orçamento")
    }
  }

  // Handle request changes
  const handleRequestChanges = () => {
    if (!selectedBudget || !changesFeedback.trim()) {
      toast.error("Por favor, informe as alterações necessárias")
      return
    }
    
    try {
      requestBudgetChanges(selectedBudget.id, "super_admin", changesFeedback)
      toast.success("Solicitação de alterações enviada")
      setIsChangesDialogOpen(false)
      setChangesFeedback("")
      loadData()
      setIsDetailOpen(false)
    } catch (error) {
      toast.error("Erro ao solicitar alterações")
    }
  }

  // Handle release (legacy - now using new flow)
  const handleRelease = (budgetId: string) => {
    try {
      const { budget, replicationResult } = releaseBudget(budgetId, "super_admin")
      
      if (!budget) {
        toast.error("Erro ao liberar orçamento")
        return
      }
      
      if (replicationResult.success) {
        toast.success(`Orçamento liberado! ${replicationResult.replicatedCount} produto(s) replicado(s) para a loja.`)
      } else if (replicationResult.replicatedCount > 0) {
        toast.warning(`Replicação parcial: ${replicationResult.replicatedCount} produtos. Erros: ${replicationResult.errors.join(", ")}`)
      } else {
        toast.error(`Falha na replicação: ${replicationResult.errors.join(", ")}`)
      }
      
      loadData()
      setIsDetailOpen(false)
    } catch (error) {
      toast.error("Erro ao liberar orçamento")
    }
  }

  // Handle submit draft budget (move from draft to submitted)
  const handleSubmitDraft = (budgetId: string) => {
    try {
      const result = updateBudget(budgetId, { 
        status: "submitted",
        submittedAt: new Date().toISOString()
      })
      if (result) {
        toast.success("Orçamento enviado para análise")
        loadData()
        setIsDetailOpen(false)
      } else {
        toast.error("Erro ao enviar orçamento")
      }
    } catch (error) {
      toast.error("Erro ao enviar orçamento")
    }
  }

  // Handle send final values to gestor
  const handleSendFinalValues = (budgetId: string) => {
    try {
      const result = sendFinalValuesToGestor(budgetId, "super_admin", "Valores finais definidos")
      if (result) {
        toast.success("Valores finais enviados para aprovação do gestor")
        loadData()
        setIsDetailOpen(false)
      } else {
        toast.error("Erro ao enviar valores")
      }
    } catch (error) {
      toast.error("Erro ao enviar valores finais")
    }
  }

  // Handle confirm payment
  const handleConfirmPayment = (budgetId: string) => {
    try {
      const result = confirmBudgetPayment(budgetId, "super_admin")
      if (result) {
        toast.success("Pagamento confirmado!")
        loadData()
        setIsDetailOpen(false)
      } else {
        toast.error("Erro ao confirmar pagamento")
      }
    } catch (error) {
      toast.error("Erro ao confirmar pagamento")
    }
  }

  // Handle release to production
  const handleReleaseToProduction = (budgetId: string) => {
    try {
      const result = releaseToProduction(budgetId, "super_admin")
      if (result) {
        toast.success("Orçamento liberado para produção!")
        loadData()
        setIsDetailOpen(false)
      } else {
        toast.error("Erro ao liberar para produção")
      }
    } catch (error) {
      toast.error("Erro ao liberar para produção")
    }
  }

  // Handle replicate to stock
  const handleReplicateToStock = (budgetId: string) => {
    try {
      const result = replicateToStock(budgetId, "super_admin")
      if (result) {
        toast.success("Produtos replicados no estoque!")
        loadData()
        setIsDetailOpen(false)
      } else {
        toast.error("Erro ao replicar no estoque")
      }
    } catch (error) {
      toast.error("Erro ao replicar no estoque")
    }
  }

  // Handle mark as available
  const handleMarkAvailable = (budgetId: string) => {
    try {
      const result = markAsAvailable(budgetId, "super_admin")
      if (result) {
        toast.success("Produtos marcados como disponíveis!")
        loadData()
        setIsDetailOpen(false)
      } else {
        toast.error("Erro ao marcar como disponível")
      }
    } catch (error) {
      toast.error("Erro ao marcar como disponível")
    }
  }

  // Handle publish to store
  const handlePublishToStore = (budgetId: string, scheduledDate?: string) => {
    try {
      const result = publishToStore(budgetId, "super_admin", scheduledDate)
      if (result) {
        toast.success("Produtos publicados na loja!")
        loadData()
        setIsDetailOpen(false)
      } else {
        toast.error("Erro ao publicar na loja")
      }
    } catch (error) {
      toast.error("Erro ao publicar na loja")
    }
  }

  // Handle delete budget
  const handleDeleteBudget = (budgetId: string) => {
    try {
      updateBudget(budgetId, { status: "rejected" }, true)
      toast.success("Orçamento removido")
      loadData()
      setIsDetailOpen(false)
    } catch (error) {
      toast.error("Erro ao remover orçamento")
    }
  }

  // Handle edit item
  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item)
    setEditPrice(item.unitPrice.toString())
    setEditQty(item.qty.toString())
  }

  const handleSaveItem = () => {
    if (!editingItem) return
    
    try {
      updateBudgetItem(editingItem.id, {
        unitPrice: parseFloat(editPrice) || 0,
        qty: parseInt(editQty) || 1,
      })
      toast.success("Item atualizado")
      setEditingItem(null)
      
      // Refresh selected budget
      if (selectedBudget) {
        const fresh = getBudgetWithDetails(selectedBudget.id)
        if (fresh) setSelectedBudget(fresh)
      }
      loadData()
    } catch (error) {
      toast.error("Erro ao atualizar item")
    }
  }

  // Handle delete item
  const handleDeleteItem = (itemId: string) => {
    if (!confirm("Tem certeza que deseja remover este item?")) return
    
    try {
      deleteBudgetItem(itemId)
      toast.success("Item removido")
      
      // Refresh selected budget
      if (selectedBudget) {
        const fresh = getBudgetWithDetails(selectedBudget.id)
        if (fresh) setSelectedBudget(fresh)
      }
      loadData()
    } catch (error) {
      toast.error("Erro ao remover item")
    }
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!selectedBudget || !newMessage.trim()) return
    
    const message = addBudgetMessage(
      selectedBudget.id,
      "super_admin",
      "Comercial",
      "superAdmin",
      newMessage.trim()
    )
    
    setMessages([...messages, message])
    setNewMessage("")
    toast.success("Mensagem enviada")
  }

  // Use template
  const useTemplate = (template: typeof RESPONSE_TEMPLATES[0]) => {
    setNewMessage(template.message)
  }

  // Calculate price margin
  const calculateMargin = (item: BudgetItem) => {
    const baseProduct = getBaseProductById(item.baseProductId)
    if (!baseProduct) return null
    
    const basePrice = baseProduct.price || 0
    const budgetPrice = item.unitPrice
    const margin = basePrice > 0 ? ((budgetPrice - basePrice) / basePrice) * 100 : 0
    
    return {
      basePrice,
      budgetPrice,
      margin,
      isHigher: budgetPrice > basePrice,
    }
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aprovações de Orçamentos</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie orçamentos de catálogo enviados pelos gestores
          </p>
        </div>
        <Button variant="outline" onClick={loadData} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  R$ {stats.totalPendingValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Valor Pendente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approvedToday}</p>
                <p className="text-sm text-muted-foreground">Aprovados Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejectedToday}</p>
                <p className="text-sm text-muted-foreground">Rejeitados Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, título, empresa ou centro de custo..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={companyFilter} onValueChange={(value) => {
              setCompanyFilter(value)
              setCostCenterFilter("all") // Reset cost center when company changes
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Todas as Empresas
                  </div>
                </SelectItem>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={costCenterFilter} onValueChange={setCostCenterFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Centro de Custo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Centros</SelectItem>
                {availableCostCenters.map(cc => (
                  <SelectItem key={cc.id} value={cc.id}>
                    {cc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
                <SelectItem value="submitted">Aguardando</SelectItem>
                <SelectItem value="reviewed">Em Análise</SelectItem>
                <SelectItem value="awaiting_approval">Aguard. Aprovação</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="awaiting_payment">Aguard. Pagamento</SelectItem>
                <SelectItem value="payment_confirmed">Pagos</SelectItem>
                <SelectItem value="in_production">Em Produção</SelectItem>
                <SelectItem value="in_stock">Em Estoque</SelectItem>
                <SelectItem value="available">Disponíveis</SelectItem>
                <SelectItem value="released">Liberados</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
                <SelectItem value="restock">Reposições</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Budgets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orçamento</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Centro de Custo</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mensagens</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredBudgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                    Nenhum orçamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredBudgets.map((budget) => {
                  const statusConfig = STATUS_CONFIG[budget.status]
                  const StatusIcon = statusConfig.icon
                  const unreadCount = unreadCounts.get(budget.id) || 0
                  const costCenter = costCenters.find(cc => cc.id === budget.costCenterId)
                  
                  return (
                    <TableRow key={budget.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleOpenDetail(budget)}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{budget.title || `Orçamento #${budget.id.slice(-8)}`}</p>
                          <code className="text-xs text-muted-foreground">{budget.id.slice(-12)}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{budget.company?.name || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {budget.costCenterName ? (
                          <Badge variant="outline" className="text-xs">
                            {budget.costCenterName}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {budget.requestedByName ? (
                          <span className="text-sm">{budget.requestedByName}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {budget.itemCount} {budget.itemCount === 1 ? "item" : "itens"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">
                            R$ {budget.totalCash.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                          {costCenter && (
                            <p className={cn(
                              "text-[10px]",
                              budget.totalCash <= costCenter.availableBudget ? "text-green-600" : "text-red-600"
                            )}>
                              Saldo: R$ {costCenter.availableBudget.toLocaleString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={cn("text-xs gap-1", statusConfig.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                          {budget.budgetType === "restock" && (
                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 gap-1">
                              <RefreshCw className="h-2.5 w-2.5" />
                              Reposição
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {unreadCount}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(budget.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDetail(budget)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(budget.status === "submitted" || budget.status === "reviewed") && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Enviar Valores Finais"
                              onClick={() => handleSendFinalValues(budget.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {budget.status === "awaiting_payment" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Confirmar Pagamento"
                              onClick={() => handleConfirmPayment(budget.id)}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                          {budget.status === "payment_confirmed" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                              title="Liberar para Produção"
                              onClick={() => handleReleaseToProduction(budget.id)}
                            >
                              <Factory className="h-4 w-4" />
                            </Button>
                          )}
                          {budget.status === "in_production" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                              title="Replicar no Estoque"
                              onClick={() => handleReplicateToStock(budget.id)}
                            >
                              <Warehouse className="h-4 w-4" />
                            </Button>
                          )}
                          {budget.status === "in_stock" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-lime-600 hover:text-lime-700 hover:bg-lime-50"
                              title="Marcar como Disponível"
                              onClick={() => handleMarkAvailable(budget.id)}
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                          {budget.status === "available" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Publicar na Loja"
                              onClick={() => handlePublishToStore(budget.id)}
                            >
                              <Store className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Budget Detail Modal */}
      <ResponsiveModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        title={selectedBudget ? (
          <div className="flex items-center gap-2">
            Orçamento #{selectedBudget.id.slice(-8)}
            <Badge className={cn("text-xs", STATUS_CONFIG[selectedBudget.status].color)}>
              {STATUS_CONFIG[selectedBudget.status].label}
            </Badge>
          </div>
        ) : undefined}
        description={selectedBudget ? `${selectedBudget.company?.name} - ${format(new Date(selectedBudget.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}` : undefined}
        maxWidth="3xl"
      >
        {selectedBudget && (
          <>
              <Tabs value={detailTab} onValueChange={setDetailTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="items" className="gap-2">
                    <Package className="h-4 w-4" />
                    Itens
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                    {messages.filter(m => !m.isRead && m.senderRole === "manager").length > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                        {messages.filter(m => !m.isRead && m.senderRole === "manager").length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Análise
                  </TabsTrigger>
                </TabsList>

                {/* Items Tab */}
                <TabsContent value="items" className="space-y-6 mt-4">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Total em R$</p>
                        <p className="text-2xl font-bold">
                          R$ {selectedBudget.totalCash.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Total em Pontos</p>
                        <p className="text-2xl font-bold">
                          {selectedBudget.totalPoints.toLocaleString("pt-BR")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Itens do Orçamento ({selectedBudget.items.length})</h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {selectedBudget.items.map((item) => {
                        const baseProduct = getBaseProductById(item.baseProductId)
                        const margin = calculateMargin(item)
                        
                        return (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                            {baseProduct?.images?.[0] && (
                              <img 
                                src={baseProduct.images[0]} 
                                alt={baseProduct.name} 
                                className="h-12 w-12 rounded object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{baseProduct?.name || item.baseProductId}</p>
                                {baseProduct?.sku && (
                                  <code className="text-xs text-muted-foreground">SKU: {baseProduct.sku}</code>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {item.qty}x R$ {item.unitPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} = 
                                <span className="font-medium"> R$ {item.subtotalCash.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                              </p>
                              {margin && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">Base: R$ {margin.basePrice.toFixed(2)}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-xs",
                                      margin.isHigher ? "text-green-600 border-green-300" : "text-red-600 border-red-300"
                                    )}
                                  >
                                    <Percent className="h-3 w-3 mr-1" />
                                    {margin.margin > 0 ? "+" : ""}{margin.margin.toFixed(1)}%
                                  </Badge>
                                </div>
                              )}
                            </div>
                            {(selectedBudget.status === "submitted" || selectedBudget.status === "reviewed") && (
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditItem(item)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-red-500 hover:text-red-600"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Meta info */}
                  {selectedBudget.meta && (
                    <div className="space-y-2">
                      {selectedBudget.meta.rejectionReason && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                          <p className="text-sm font-medium text-red-700">Motivo da Rejeição:</p>
                          <p className="text-sm text-red-600">{selectedBudget.meta.rejectionReason as string}</p>
                        </div>
                      )}
                      {selectedBudget.meta.changeRequestFeedback && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                          <p className="text-sm font-medium text-yellow-700">Alterações Solicitadas:</p>
                          <p className="text-sm text-yellow-600">{selectedBudget.meta.changeRequestFeedback as string}</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages" className="space-y-4 mt-4">
                  {/* Response Templates */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Respostas Rápidas
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {RESPONSE_TEMPLATES.map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => useTemplate(template)}
                        >
                          <Copy className="h-3 w-3" />
                          {template.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Message Thread */}
                  <ScrollArea className="h-[250px] rounded-lg border p-4 bg-muted/30">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma mensagem ainda</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "p-3 rounded-lg max-w-[85%]",
                              msg.senderRole === "superAdmin"
                                ? "bg-primary text-primary-foreground ml-auto"
                                : "bg-card border"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold">{msg.senderName}</span>
                              <span className="text-xs opacity-70">
                                {format(new Date(msg.createdAt), "dd/MM HH:mm")}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Pricing Analysis Tab */}
                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        Comparação com Catálogo Base
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-right">Preço Base</TableHead>
                            <TableHead className="text-right">Preço Orçamento</TableHead>
                            <TableHead className="text-right">Margem</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedBudget.items.map((item) => {
                            const baseProduct = getBaseProductById(item.baseProductId)
                            const margin = calculateMargin(item)
                            
                            return (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {baseProduct?.images?.[0] && (
                                      <img 
                                        src={baseProduct.images[0]} 
                                        alt={baseProduct?.name} 
                                        className="h-8 w-8 rounded object-cover"
                                      />
                                    )}
                                    <span className="text-sm truncate max-w-[150px]">
                                      {baseProduct?.name || item.baseProductId}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {margin ? `R$ ${margin.basePrice.toFixed(2)}` : "-"}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  R$ {item.unitPrice.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {margin ? (
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "text-xs",
                                        margin.isHigher ? "text-green-600 border-green-300" : "text-red-600 border-red-300"
                                      )}
                                    >
                                      {margin.margin > 0 ? "+" : ""}{margin.margin.toFixed(1)}%
                                    </Badge>
                                  ) : "-"}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Margem Média</p>
                        <p className="text-xl font-bold text-green-600">
                          {(() => {
                            const margins = selectedBudget.items
                              .map(item => calculateMargin(item))
                              .filter(m => m !== null)
                            const avgMargin = margins.length > 0 
                              ? margins.reduce((sum, m) => sum + (m?.margin || 0), 0) / margins.length
                              : 0
                            return `${avgMargin > 0 ? "+" : ""}${avgMargin.toFixed(1)}%`
                          })()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground">Itens com Margem Positiva</p>
                        <p className="text-xl font-bold">
                          {selectedBudget.items.filter(item => {
                            const m = calculateMargin(item)
                            return m && m.isHigher
                          }).length} / {selectedBudget.items.length}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-6 mt-6 border-t">
                {/* Badge de tipo de orçamento */}
                {selectedBudget.budgetType === "restock" && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <RefreshCw className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Reposição de Estoque</span>
                  </div>
                )}

                {/* Draft - Enviar para análise */}
                {selectedBudget.status === "draft" && (
                  <>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 mb-2">
                      <FileText className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                      <p className="font-medium text-gray-700">Orçamento em Rascunho</p>
                      <p className="text-sm text-gray-600">Este orçamento ainda não foi enviado para análise</p>
                    </div>
                    <Button className="w-full gap-2" onClick={() => handleSubmitDraft(selectedBudget.id)}>
                      <Send className="h-4 w-4" />
                      Enviar para Análise
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteBudget(selectedBudget.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir Rascunho
                    </Button>
                  </>
                )}

                {/* Submitted/Reviewed - Enviar valores finais */}
                {(selectedBudget.status === "submitted" || selectedBudget.status === "reviewed") && (
                  <>
                    <Button className="w-full gap-2" onClick={() => handleSendFinalValues(selectedBudget.id)}>
                      <Send className="h-4 w-4" />
                      Enviar Valores Finais
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setIsChangesDialogOpen(true)}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Solicitar Alterações
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2 text-red-600 hover:text-red-700"
                        onClick={() => setIsRejectDialogOpen(true)}
                      >
                        <X className="h-4 w-4" />
                        Rejeitar
                      </Button>
                    </div>
                  </>
                )}

                {/* Awaiting Approval - Aguardando aprovação do gestor */}
                {selectedBudget.status === "awaiting_approval" && (
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Clock className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                    <p className="font-medium text-orange-700">Aguardando aprovação do gestor</p>
                    <p className="text-sm text-orange-600">O gestor precisa aprovar os valores finais</p>
                  </div>
                )}
                
                {/* Approved - Marcar como aguardando pagamento */}
                {selectedBudget.status === "approved" && (
                  <Button className="w-full gap-2" onClick={() => {
                    updateBudget(selectedBudget.id, { status: "awaiting_payment" })
                    toast.success("Orçamento marcado como aguardando pagamento")
                    loadData()
                    setIsDetailOpen(false)
                  }}>
                    <CreditCard className="h-4 w-4" />
                    Aguardar Pagamento
                  </Button>
                )}

                {/* Awaiting Payment - Confirmar pagamento */}
                {selectedBudget.status === "awaiting_payment" && (
                  <Button className="w-full gap-2" onClick={() => handleConfirmPayment(selectedBudget.id)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmar Pagamento
                  </Button>
                )}

                {/* Payment Confirmed - Liberar para produção */}
                {selectedBudget.status === "payment_confirmed" && (
                  <Button className="w-full gap-2" onClick={() => handleReleaseToProduction(selectedBudget.id)}>
                    <Factory className="h-4 w-4" />
                    Liberar para Produção
                  </Button>
                )}

                {/* In Production - Replicar no estoque */}
                {selectedBudget.status === "in_production" && (
                  <Button className="w-full gap-2" onClick={() => handleReplicateToStock(selectedBudget.id)}>
                    <Warehouse className="h-4 w-4" />
                    Replicar no Estoque
                  </Button>
                )}

                {/* In Stock - Marcar como disponível */}
                {selectedBudget.status === "in_stock" && (
                  <Button className="w-full gap-2" onClick={() => handleMarkAvailable(selectedBudget.id)}>
                    <Truck className="h-4 w-4" />
                    Marcar como Disponível
                  </Button>
                )}

                {/* Available - Publicar na loja */}
                {selectedBudget.status === "available" && (
                  <Button className="w-full gap-2" onClick={() => handlePublishToStore(selectedBudget.id)}>
                    <Store className="h-4 w-4" />
                    Publicar na Loja
                  </Button>
                )}

                {/* Published - Já publicado */}
                {selectedBudget.status === "published" && (
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <Store className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                    <p className="font-medium text-emerald-700">Publicado na Loja</p>
                    <p className="text-sm text-emerald-600">Os produtos estão disponíveis na loja corporativa</p>
                  </div>
                )}

                {/* Delete button for all statuses */}
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-red-600 hover:text-red-700 mt-2"
                  onClick={() => handleDeleteBudget(selectedBudget.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Orçamento
                </Button>
              </div>
          </>
        )}
      </ResponsiveModal>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>
              Ajuste o preço e quantidade do item
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editPrice" className="text-right">Preço (R$)</Label>
              <Input
                id="editPrice"
                type="number"
                step="0.01"
                className="col-span-3"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editQty" className="text-right">Quantidade</Label>
              <Input
                id="editQty"
                type="number"
                min="1"
                className="col-span-3"
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancelar</Button>
            <Button onClick={handleSaveItem}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Orçamento</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição. O gestor receberá esta informação.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Usar Template</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectReason("Orçamento excede o limite aprovado para o período.")}
                >
                  Limite Excedido
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectReason("Produtos não estão disponíveis no momento.")}
                >
                  Indisponível
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectReason("Preços precisam de renegociação.")}
                >
                  Preços
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Motivo da rejeição..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReject}>Rejeitar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={isChangesDialogOpen} onOpenChange={setIsChangesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Alterações</DialogTitle>
            <DialogDescription>
              Descreva as alterações necessárias para aprovação
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Usar Template</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChangesFeedback("Por favor, revise os preços unitários dos itens marcados.")}
                >
                  Revisar Preços
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChangesFeedback("Quantidade solicitada excede o disponível. Por favor, ajuste.")}
                >
                  Ajustar Quantidade
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChangesFeedback("Necessário adicionar justificativa para esta compra.")}
                >
                  Justificativa
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Descreva as alterações necessárias..."
              value={changesFeedback}
              onChange={(e) => setChangesFeedback(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangesDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleRequestChanges}>Enviar Solicitação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
