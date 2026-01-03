"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  DollarSign,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Minus,
  MessageSquare,
  Send,
  ArrowRight,
  Filter,
  RefreshCw,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { 
  getBudgetsByCompany, 
  getBudgetItemsByBudget, 
  getBudgetById,
  updateBudget, 
  updateBudgetItem,
  deleteBudgetItem,
  getCompanyById,
  getBaseProducts,
  getBudgetMessages,
  addBudgetMessage,
  markBudgetMessagesAsRead,
  getUnreadMessageCount,
  getCostCentersByCompany,
  seedCostCenters,
  updateCostCenter,
  getCompanyBuyersByCompany,
  createCompanyBuyer,
  updateCompanyBuyer,
  deleteCompanyBuyer,
  seedCompanyBuyers,
  getTransactionsByCostCenter,
  seedCostCenterTransactions,
  recordBudgetAllocation,
  approveValuesByGestor,
  type Budget,
  type BudgetItem,
  type BudgetStatus,
  type BudgetType,
  type BudgetMessage,
  type CostCenter,
  type CompanyBuyer,
  type CostCenterTransaction,
  getCurrencyName
} from "@/lib/storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Users,
  TrendingUp,
  Wallet,
  History,
  Building2,
  PieChart,
  UserPlus,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useDemoState } from "@/hooks/use-demo-state"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { cn } from "@/lib/utils"

const STATUS_COLORS: Record<BudgetStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  awaiting_approval: "bg-orange-100 text-orange-800",
  approved: "bg-green-100 text-green-800",
  awaiting_payment: "bg-amber-100 text-amber-800",
  payment_confirmed: "bg-teal-100 text-teal-800",
  in_production: "bg-indigo-100 text-indigo-800",
  in_stock: "bg-cyan-100 text-cyan-800",
  available: "bg-lime-100 text-lime-800",
  published: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
}

const STATUS_LABELS: Record<BudgetStatus, string> = {
  draft: "Rascunho",
  submitted: "Enviado",
  reviewed: "Em Revisão",
  awaiting_approval: "Aguardando Aprovação",
  approved: "Aprovado",
  awaiting_payment: "Aguardando Pagamento",
  payment_confirmed: "Pagamento Confirmado",
  in_production: "Em Produção",
  in_stock: "Em Estoque",
  available: "Disponível",
  published: "Publicado",
  rejected: "Rejeitado",
}

const STATUS_PIPELINE: BudgetStatus[] = [
  "draft", 
  "submitted", 
  "reviewed", 
  "awaiting_approval", 
  "approved", 
  "awaiting_payment", 
  "payment_confirmed", 
  "in_production", 
  "in_stock", 
  "available", 
  "published"
]

function BudgetsPageContent() {
  const { env } = useDemoState()
  const searchParams = useSearchParams()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [skuSearch, setSkuSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | "all">("all")
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [company, setCompany] = useState<any>(null)
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [activeTab, setActiveTab] = useState("details")
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedItems, setEditedItems] = useState<Map<string, { qty: number; unitPrice: number }>>(new Map())
  
  // Messages state
  const [messages, setMessages] = useState<BudgetMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map())
  
  // User info
  const [currentUserId, setCurrentUserId] = useState("")
  const [currentUserName, setCurrentUserName] = useState("")
  
  // Cost Centers (Budget Management Dashboard)
  const [costCenters, setCostCenters] = useState<CostCenter[]>([])
  const [viewMode, setViewMode] = useState<"budgets" | "dashboard" | "team">("budgets")
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null)
  const [showAllocateModal, setShowAllocateModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [allocateAmount, setAllocateAmount] = useState("")
  const [allocateDescription, setAllocateDescription] = useState("")
  
  // Team/Collaborators
  const [companyBuyers, setCompanyBuyers] = useState<CompanyBuyer[]>([])
  const [showBuyerModal, setShowBuyerModal] = useState(false)
  const [editingBuyer, setEditingBuyer] = useState<CompanyBuyer | null>(null)
  const [buyerFormData, setBuyerFormData] = useState({
    name: "",
    email: "",
    role: "buyer" as "buyer" | "approver" | "admin",
    spendLimit: "",
    costCenterIds: [] as string[],
    isActive: true,
  })
  
  // Transactions for history modal
  const [transactions, setTransactions] = useState<CostCenterTransaction[]>([])

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      const auth = JSON.parse(authData)
      if (auth.companyId) {
        setCompanyId(auth.companyId)
        const companyData = getCompanyById(auth.companyId)
        setCompany(companyData)
        loadBudgets(auth.companyId)
        
        // Load cost centers
        seedCostCenters(auth.companyId)
        const centers = getCostCentersByCompany(auth.companyId)
        setCostCenters(centers)
        
        // Load company buyers
        seedCompanyBuyers(auth.companyId)
        const buyers = getCompanyBuyersByCompany(auth.companyId)
        setCompanyBuyers(buyers)
        
        // Seed transactions for demo
        seedCostCenterTransactions(auth.companyId)
      }
      if (auth.userId) {
        setCurrentUserId(auth.userId)
        setCurrentUserName(auth.name || "Gestor")
      }
    }
  }, [])

  // Handle highlight query param
  useEffect(() => {
    const highlightId = searchParams.get("highlight")
    if (highlightId) {
      const authData = localStorage.getItem("yoobe_auth")
      if (authData) {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          loadBudgets(auth.companyId)
        }
      }
      
      setTimeout(() => {
        const allBudgets = company ? getBudgetsByCompany(company.id) : []
        const budget = allBudgets.find(b => b.id === highlightId)
        if (budget) {
          handleViewDetails(budget)
          window.history.replaceState({}, '', '/gestor/budgets')
        }
      }, 200)
    }
  }, [searchParams, company])

  const loadBudgets = (companyId: string) => {
    const allBudgets = getBudgetsByCompany(companyId)
    const sorted = allBudgets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setBudgets(sorted)
    
    // Load unread counts for all budgets
    const counts = new Map<string, number>()
    sorted.forEach(budget => {
      const count = getUnreadMessageCount(budget.id, "manager")
      if (count > 0) {
        counts.set(budget.id, count)
      }
    })
    setUnreadCounts(counts)
  }

  // Filter budgets by title, status, and SKU
  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || budget.status === statusFilter
    
    // SKU search - need to check budget items
    let matchesSku = true
    if (skuSearch.trim()) {
      const items = getBudgetItemsByBudget(budget.id)
      const baseProducts = getBaseProducts()
      matchesSku = items.some(item => {
        const product = baseProducts.find(p => p.id === item.baseProductId)
        return product?.sku?.toLowerCase().includes(skuSearch.toLowerCase())
      })
    }
    
    return matchesSearch && matchesStatus && matchesSku
  })

  const handleViewDetails = (budget: Budget) => {
    setSelectedBudget(budget)
    const items = getBudgetItemsByBudget(budget.id)
    setBudgetItems(items)
    setIsEditMode(false)
    setEditedItems(new Map())
    setActiveTab("details")
    
    // Load messages and mark as read
    const budgetMessages = getBudgetMessages(budget.id)
    setMessages(budgetMessages)
    markBudgetMessagesAsRead(budget.id, "manager")
    
    // Update unread counts
    const newCounts = new Map(unreadCounts)
    newCounts.delete(budget.id)
    setUnreadCounts(newCounts)
  }

  const handleEnterEditMode = () => {
    if (!selectedBudget) return
    if (selectedBudget.status !== "draft" && selectedBudget.status !== "submitted") {
      toast.error("Apenas orçamentos em rascunho ou enviados podem ser editados")
      return
    }
    
    // Initialize edited items with current values
    const initial = new Map<string, { qty: number; unitPrice: number }>()
    budgetItems.forEach(item => {
      initial.set(item.id, { qty: item.qty, unitPrice: item.unitPrice })
    })
    setEditedItems(initial)
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditedItems(new Map())
  }

  const handleUpdateItemQty = (itemId: string, delta: number) => {
    const current = editedItems.get(itemId)
    if (!current) return
    
    const newQty = Math.max(1, current.qty + delta)
    setEditedItems(new Map(editedItems).set(itemId, { ...current, qty: newQty }))
  }

  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    const current = editedItems.get(itemId)
    if (!current) return
    
    setEditedItems(new Map(editedItems).set(itemId, { ...current, unitPrice: newPrice }))
  }

  const handleRemoveItem = (itemId: string) => {
    if (!selectedBudget) return
    
    deleteBudgetItem(itemId)
    const items = getBudgetItemsByBudget(selectedBudget.id)
    setBudgetItems(items)
    
    const newEdited = new Map(editedItems)
    newEdited.delete(itemId)
    setEditedItems(newEdited)
    
    toast.success("Item removido do orçamento")
    loadBudgets(companyId)
  }

  const handleSaveChanges = () => {
    if (!selectedBudget) return
    
    // Update each item
    editedItems.forEach((values, itemId) => {
      updateBudgetItem(itemId, {
        qty: values.qty,
        unitPrice: values.unitPrice,
      })
    })
    
    // Reload items and exit edit mode
    const items = getBudgetItemsByBudget(selectedBudget.id)
    setBudgetItems(items)
    setIsEditMode(false)
    setEditedItems(new Map())
    
    // Refresh the selected budget
    const refreshed = getBudgetById(selectedBudget.id)
    if (refreshed) {
      setSelectedBudget(refreshed)
    }
    
    loadBudgets(companyId)
    toast.success("Alterações salvas com sucesso")
  }

  const handleWithdrawBudget = () => {
    if (!selectedBudget) return
    if (selectedBudget.status !== "submitted") {
      toast.error("Apenas orçamentos enviados podem ser retirados")
      return
    }
    
    updateBudget(selectedBudget.id, { status: "draft" })
    const refreshed = getBudgetById(selectedBudget.id)
    if (refreshed) {
      setSelectedBudget(refreshed)
    }
    loadBudgets(companyId)
    toast.success("Orçamento retirado e movido para rascunho")
  }

  // Submit draft budget for approval
  const handleSubmitBudget = () => {
    if (!selectedBudget) return
    if (selectedBudget.status !== "draft") {
      toast.error("Apenas orçamentos em rascunho podem ser enviados")
      return
    }
    
    // Check if there are items
    const items = getBudgetItemsByBudget(selectedBudget.id)
    if (items.length === 0) {
      toast.error("Adicione pelo menos um item ao orçamento antes de enviar")
      return
    }
    
    updateBudget(selectedBudget.id, { 
      status: "submitted",
      submittedAt: new Date().toISOString()
    })
    const refreshed = getBudgetById(selectedBudget.id)
    if (refreshed) {
      setSelectedBudget(refreshed)
    }
    loadBudgets(companyId)
    toast.success("Orçamento enviado para aprovação!")
  }

  const handleSendMessage = () => {
    if (!selectedBudget || !newMessage.trim()) return
    
    const message = addBudgetMessage(
      selectedBudget.id,
      currentUserId,
      currentUserName,
      "manager",
      newMessage.trim()
    )
    
    setMessages([...messages, message])
    setNewMessage("")
    toast.success("Mensagem enviada")
  }

  const handleApprove = (budgetId: string) => {
    const updated = updateBudget(budgetId, {
      status: "approved",
      approvedAt: new Date().toISOString(),
    })

    if (updated) {
      toast.success("O orçamento foi aprovado com sucesso.")
      if (company) {
        loadBudgets(company.id)
        if (selectedBudget?.id === budgetId) {
          const refreshed = getBudgetsByCompany(company.id).find(b => b.id === budgetId)
          if (refreshed) {
            setSelectedBudget(refreshed)
            setBudgetItems(getBudgetItemsByBudget(budgetId))
          }
        }
      }
    }
  }

  // Aprovar valores finais enviados pelo admin
  const handleApproveValues = (budgetId: string) => {
    const updated = approveValuesByGestor(budgetId, currentUserId, "Valores aprovados pelo gestor")

    if (updated) {
      toast.success("Valores aprovados! O orçamento seguirá para pagamento.")
      if (company) {
        loadBudgets(company.id)
        if (selectedBudget?.id === budgetId) {
          const refreshed = getBudgetsByCompany(company.id).find(b => b.id === budgetId)
          if (refreshed) {
            setSelectedBudget(refreshed)
            setBudgetItems(getBudgetItemsByBudget(budgetId))
          }
        }
      }
    } else {
      toast.error("Erro ao aprovar valores. Verifique o status do orçamento.")
    }
  }

  const handleReject = (budgetId: string) => {
    const updated = updateBudget(budgetId, {
      status: "rejected",
    })

    if (updated) {
      toast.success("O orçamento foi rejeitado.")
      if (company) {
        loadBudgets(company.id)
        if (selectedBudget?.id === budgetId) {
          const refreshed = getBudgetsByCompany(company.id).find(b => b.id === budgetId)
          if (refreshed) {
            setSelectedBudget(refreshed)
            setBudgetItems(getBudgetItemsByBudget(budgetId))
          }
        }
      }
    }
  }

  const handleRelease = (budgetId: string) => {
    const updated = updateBudget(budgetId, {
      status: "released",
      releasedAt: new Date().toISOString(),
    })

    if (updated) {
      toast.success("O orçamento foi liberado para replicação.")
      if (company) {
        loadBudgets(company.id)
        if (selectedBudget?.id === budgetId) {
          const refreshed = getBudgetsByCompany(company.id).find(b => b.id === budgetId)
          if (refreshed) {
            setSelectedBudget(refreshed)
            setBudgetItems(getBudgetItemsByBudget(budgetId))
          }
        }
      }
    }
  }

  const handleReplicate = async (budgetId: string) => {
    if (!company) {
      toast.error("Empresa não encontrada.")
      return
    }

    const budget = getBudgetById(budgetId)
    if (!budget || budget.status !== "released") {
      toast.error("Orçamento deve estar com status 'Liberado'")
      return
    }

    const authData = localStorage.getItem("yoobe_auth")
    const actorId = authData ? JSON.parse(authData).userId : "system"
    const budgetItemsList = getBudgetItemsByBudget(budgetId)

    try {
      const response = await fetch("/api/replication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budgetId,
          actorId,
          budgetData: budget,
          budgetItems: budgetItemsList,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Erro ao replicar" }))
        throw new Error(error.error || "Erro ao replicar")
      }

      const result = await response.json()
      toast.success(
        `${result.summary.created} produto(s) criado(s), ${result.summary.updated} atualizado(s).`,
        {
          action: {
            label: "Ver no Catálogo",
            onClick: () => window.location.href = "/gestor/catalog"
          }
        }
      )

      if (company) {
        loadBudgets(company.id)
        if (selectedBudget?.id === budgetId) {
          const refreshed = getBudgetsByCompany(company.id).find(b => b.id === budgetId)
          if (refreshed) {
            setSelectedBudget(refreshed)
            setBudgetItems(getBudgetItemsByBudget(budgetId))
          }
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao replicar produtos")
    }
  }

  const getStatusPipelineIndex = (status: BudgetStatus) => {
    if (status === "rejected") return -1
    return STATUS_PIPELINE.indexOf(status)
  }

  const calculateEditedTotals = () => {
    let totalCash = 0
    let totalPoints = 0
    
    budgetItems.forEach(item => {
      const edited = editedItems.get(item.id)
      const qty = edited?.qty || item.qty
      const unitPrice = edited?.unitPrice || item.unitPrice
      totalCash += qty * unitPrice
      totalPoints += qty * item.unitPoints
    })
    
    return { totalCash, totalPoints }
  }

  // Calculate totals for dashboard
  const totalAllocated = costCenters.reduce((sum, cc) => sum + cc.allocatedBudget, 0)
  const totalUsed = costCenters.reduce((sum, cc) => sum + cc.usedBudget, 0)
  const totalAvailable = costCenters.reduce((sum, cc) => sum + cc.availableBudget, 0)
  const totalPendingRequests = costCenters.reduce((sum, cc) => sum + cc.pendingRequests, 0)
  
  // Allocate budget handler
  const handleAllocateBudget = () => {
    if (!selectedCostCenter || !allocateAmount) return
    
    const amount = parseFloat(allocateAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Informe um valor válido")
      return
    }
    
    // Use the new function that also creates a transaction record
    const transaction = recordBudgetAllocation(
      selectedCostCenter.id,
      amount,
      allocateDescription || "Alocação de verba",
      currentUserId,
      currentUserName
    )
    
    if (transaction) {
      const centers = getCostCentersByCompany(companyId)
      setCostCenters(centers)
      setShowAllocateModal(false)
      setAllocateAmount("")
      setAllocateDescription("")
      toast.success(`R$ ${amount.toLocaleString('pt-BR')} alocados para ${selectedCostCenter.name}`)
    }
  }
  
  // Open history modal handler
  const handleOpenHistory = (cc: CostCenter) => {
    setSelectedCostCenter(cc)
    const ccTransactions = getTransactionsByCostCenter(cc.id)
    setTransactions(ccTransactions)
    setShowHistoryModal(true)
  }
  
  // Get pending budgets for a cost center
  const getPendingBudgetsForCostCenter = (costCenterId: string) => {
    return budgets.filter(b => 
      b.costCenterId === costCenterId && 
      (b.status === "submitted" || b.status === "reviewed")
    )
  }
  
  // Buyer management handlers
  const handleOpenBuyerModal = (buyer?: CompanyBuyer) => {
    if (buyer) {
      setEditingBuyer(buyer)
      setBuyerFormData({
        name: buyer.name || "",
        email: buyer.email || "",
        role: buyer.role || "buyer",
        spendLimit: (buyer.spendLimit ?? 0).toString(),
        costCenterIds: buyer.costCenterIds || [],
        isActive: buyer.isActive ?? true,
      })
    } else {
      setEditingBuyer(null)
      setBuyerFormData({
        name: "",
        email: "",
        role: "buyer",
        spendLimit: "",
        costCenterIds: [],
        isActive: true,
      })
    }
    setShowBuyerModal(true)
  }
  
  const handleEditBuyer = (buyer: CompanyBuyer) => {
    handleOpenBuyerModal(buyer)
  }
  
  const handleToggleBuyerActive = (buyer: CompanyBuyer) => {
    if (!buyer?.id) return
    const updated = updateCompanyBuyer(buyer.id, { isActive: !(buyer.isActive ?? true) })
    if (updated) {
      toast.success(buyer.isActive ? "Colaborador desativado" : "Colaborador ativado")
      const buyers = getCompanyBuyersByCompany(companyId)
      setCompanyBuyers(buyers)
    }
  }
  
  const handleDeleteBuyer = (buyer: CompanyBuyer) => {
    if (!buyer?.id) return
    if (!confirm(`Tem certeza que deseja excluir ${buyer.name || "este colaborador"}?`)) return
    
    const deleted = deleteCompanyBuyer(buyer.id)
    if (deleted) {
      toast.success("Colaborador excluído")
      const buyers = getCompanyBuyersByCompany(companyId)
      setCompanyBuyers(buyers)
    }
  }
  
  const handleSaveBuyer = () => {
    if (!buyerFormData.name || !buyerFormData.email) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const spendLimit = parseFloat(buyerFormData.spendLimit) || 0

    if (editingBuyer) {
      const updated = updateCompanyBuyer(editingBuyer.id, {
        name: buyerFormData.name,
        email: buyerFormData.email,
        role: buyerFormData.role,
        spendLimit,
        costCenterIds: buyerFormData.costCenterIds,
        isActive: buyerFormData.isActive,
      })
      
      if (updated) {
        toast.success("Colaborador atualizado com sucesso")
      }
    } else {
      createCompanyBuyer({
        companyId,
        userId: `user_${Date.now()}`,
        name: buyerFormData.name,
        email: buyerFormData.email,
        role: buyerFormData.role,
        spendLimit,
        costCenterIds: buyerFormData.costCenterIds,
        isActive: buyerFormData.isActive,
      })
      
      toast.success("Colaborador cadastrado com sucesso")
    }

    const buyers = getCompanyBuyersByCompany(companyId)
    setCompanyBuyers(buyers)
    setShowBuyerModal(false)
  }
  
  const toggleBuyerCostCenter = (costCenterId: string) => {
    setBuyerFormData(prev => ({
      ...prev,
      costCenterIds: prev.costCenterIds.includes(costCenterId)
        ? prev.costCenterIds.filter(id => id !== costCenterId)
        : [...prev.costCenterIds, costCenterId]
    }))
  }

  return (
    <>
      <PageContainer className="space-y-6">
        {/* Header with View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              {viewMode === "budgets" ? (
                <>
                  <FileText className="h-8 w-8 text-primary" />
                  Orçamentos
                </>
              ) : (
                <>
                  <Wallet className="h-8 w-8 text-primary" />
                  Gestão de Verbas
                </>
              )}
            </h1>
            <p className="text-muted-foreground mt-2">
              {viewMode === "budgets" 
                ? "Gerencie e acompanhe os orçamentos da empresa"
                : "Gerencie orçamentos, centros de custo e verbas da empresa"
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <Button 
                variant={viewMode === "dashboard" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("dashboard")}
                className="gap-2"
              >
                <PieChart className="h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                variant={viewMode === "team" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("team")}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Colaboradores
              </Button>
            </div>
            <Button variant="outline" onClick={() => {
              company && loadBudgets(company.id)
              const centers = getCostCentersByCompany(companyId)
              setCostCenters(centers)
              const buyers = getCompanyBuyersByCompany(companyId)
              setCompanyBuyers(buyers)
            }} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Dashboard View */}
        {viewMode === "dashboard" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">R$ {totalAllocated.toLocaleString('pt-BR')}</p>
                      <p className="text-sm text-muted-foreground">Total Alocado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">R$ {totalUsed.toLocaleString('pt-BR')}</p>
                      <p className="text-sm text-muted-foreground">Total Utilizado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">R$ {totalAvailable.toLocaleString('pt-BR')}</p>
                      <p className="text-sm text-muted-foreground">Disponível</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalPendingRequests}</p>
                      <p className="text-sm text-muted-foreground">Solicitações Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Centers Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  Centros de Custo
                </h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {costCenters.map((cc) => {
                  const usagePercent = cc.allocatedBudget > 0 
                    ? Math.round((cc.usedBudget / cc.allocatedBudget) * 100) 
                    : 0
                  
                  // Format number without decimal places
                  const formatBudget = (value: number) => {
                    return value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })
                  }
                  
                  return (
                    <Card key={cc.id} className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-3xl overflow-hidden">
                      <CardHeader className="pb-4 pt-6 px-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-green-100">
                              <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold">{cc.name}</CardTitle>
                              <CardDescription className="text-sm text-muted-foreground">
                                ID: {cc.code}
                              </CardDescription>
                            </div>
                          </div>
                          {cc.pendingRequests > 0 && (
                            <Badge className="bg-green-500 text-white rounded-full px-3 py-1 gap-1.5 text-sm font-medium">
                              <Clock className="h-4 w-4" />
                              {cc.pendingRequests} pendente{cc.pendingRequests > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6 px-6 pb-6">
                        {/* Budget Overview - Matching reference image layout */}
                        <div className="grid grid-cols-3 gap-4 text-center py-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Alocado</p>
                            <p className="text-base font-bold text-green-600">R$</p>
                            <p className="text-2xl font-black text-green-600">
                              {formatBudget(cc.allocatedBudget)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Utilizado</p>
                            <p className="text-base font-bold text-red-500">R$</p>
                            <p className="text-2xl font-black text-red-500">
                              {formatBudget(cc.usedBudget)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Disponível</p>
                            <p className="text-base font-bold text-green-600">R$</p>
                            <p className="text-2xl font-black text-green-600">
                              {formatBudget(cc.availableBudget)}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
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
                          <Progress value={usagePercent} className="h-2.5" />
                        </div>

                        {/* Actions - Pill buttons matching reference */}
                        <div className="flex gap-3 pt-2">
                          <Button 
                            variant="outline" 
                            size="lg"
                            className="flex-1 gap-2 rounded-full border-2 font-medium"
                            onClick={() => {
                              setSelectedCostCenter(cc)
                              setShowAllocateModal(true)
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            Alocar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="lg"
                            className="flex-1 gap-2 rounded-full border-2 font-medium"
                            onClick={() => handleOpenHistory(cc)}
                          >
                            <History className="h-4 w-4" />
                            Histórico
                          </Button>
                          {cc.pendingRequests > 0 && (
                            <Button 
                              size="lg"
                              className="flex-1 gap-2 rounded-full font-medium bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedCostCenter(cc)
                                setShowRequestsModal(true)
                              }}
                            >
                              Ver Solicitações
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Team/Collaborators View */}
        {viewMode === "team" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{companyBuyers.length}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{companyBuyers.filter(b => b.isActive).length}</p>
                      <p className="text-xs text-muted-foreground">Ativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{companyBuyers.filter(b => b.role === "approver").length}</p>
                      <p className="text-xs text-muted-foreground">Aprovadores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <ShieldAlert className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{companyBuyers.filter(b => b.role === "admin").length}</p>
                      <p className="text-xs text-muted-foreground">Admins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Colaboradores da Empresa
              </h2>
              <Button onClick={handleOpenBuyerModal} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Novo Colaborador
              </Button>
            </div>

            {/* Collaborators Grid */}
            {companyBuyers.length === 0 ? (
              <Card className="border-none shadow-sm">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground">Nenhum colaborador cadastrado</p>
                  <Button variant="outline" onClick={handleOpenBuyerModal} className="mt-4 gap-2">
                    <UserPlus className="h-4 w-4" />
                    Cadastrar Primeiro Colaborador
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {companyBuyers.map((buyer) => {
                  const buyerCostCenters = costCenters.filter(cc => buyer.costCenterIds.includes(cc.id))
                  const roleConfig = {
                    buyer: { label: "Comprador", color: "bg-blue-100 text-blue-700", icon: Users },
                    approver: { label: "Aprovador", color: "bg-purple-100 text-purple-700", icon: ShieldCheck },
                    admin: { label: "Administrador", color: "bg-amber-100 text-amber-700", icon: ShieldAlert },
                  }[buyer.role]
                  const RoleIcon = roleConfig.icon
                  
                  return (
                    <Card key={buyer.id} className={cn(
                      "border-none shadow-sm hover:shadow-md transition-shadow",
                      !buyer.isActive && "opacity-60"
                    )}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-xl", roleConfig.color.split(" ")[0])}>
                              <RoleIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{buyer.name}</CardTitle>
                              <CardDescription className="text-xs flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3" />
                                {buyer.email}
                              </CardDescription>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditBuyer(buyer)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleBuyerActive(buyer)}>
                                {buyer.isActive ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Ativar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteBuyer(buyer)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={roleConfig.color}>
                            {roleConfig.label}
                          </Badge>
                          <Badge variant={buyer.isActive ? "default" : "secondary"}>
                            {buyer.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Limite</p>
                            <p className="font-semibold text-primary">
                              R$ {buyer.spendLimit.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Gasto</p>
                            <p className="font-semibold">
                              R$ {buyer.totalSpent.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        {buyerCostCenters.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Centros de Custo</p>
                            <div className="flex flex-wrap gap-1">
                              {buyerCostCenters.slice(0, 3).map(cc => (
                                <Badge key={cc.id} variant="outline" className="text-[10px]">
                                  {cc.name}
                                </Badge>
                              ))}
                              {buyerCostCenters.length > 3 && (
                                <Badge variant="outline" className="text-[10px]">
                                  +{buyerCostCenters.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Budgets View */}
        {viewMode === "budgets" && (
          <>
            {/* Status Pipeline Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pipeline de Status</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {STATUS_PIPELINE.map((status, index) => {
                const count = budgets.filter(b => b.status === status).length
                return (
                  <div key={status} className="flex items-center">
                    <button
                      onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-center min-w-[100px]",
                        statusFilter === status 
                          ? "border-primary bg-primary/10" 
                          : "border-transparent hover:border-muted",
                        STATUS_COLORS[status]
                      )}
                    >
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs font-medium whitespace-nowrap">{STATUS_LABELS[status]}</p>
                    </button>
                    {index < STATUS_PIPELINE.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar orçamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative flex-1 min-w-[200px]">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por SKU..."
                  value={skuSearch}
                  onChange={(e) => setSkuSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BudgetStatus | "all")}
                className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Todos os status</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Budgets List */}
        {filteredBudgets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum orçamento encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredBudgets.map((budget) => {
              const unreadCount = unreadCounts.get(budget.id) || 0
              
              return (
                <Card key={budget.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{budget.title}</h3>
                          <Badge className={STATUS_COLORS[budget.status]}>
                            {STATUS_LABELS[budget.status]}
                          </Badge>
                          {budget.budgetType === "restock" && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Reposição
                            </Badge>
                          )}
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Total em R$</p>
                            <p className="font-semibold">R$ {budget.totalCash.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Total em {getCurrencyName(companyId, true).toUpperCase()}</p>
                            <p className="font-semibold">{budget.totalPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true).toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Criado em</p>
                            <p className="font-semibold">{format(new Date(budget.createdAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                          </div>
                          {budget.submittedAt && (
                            <div>
                              <p className="text-muted-foreground text-xs">Enviado em</p>
                              <p className="font-semibold">{format(new Date(budget.submittedAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(budget)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        {budget.status === "submitted" && (
                          <>
                            <Button variant="default" size="sm" onClick={() => handleApprove(budget.id)}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(budget.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                        {budget.status === "awaiting_approval" && (
                          <>
                            <Button variant="default" size="sm" onClick={() => handleApproveValues(budget.id)}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Aprovar Valores
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(budget.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                        {budget.status === "approved" && (
                          <Button variant="default" size="sm" onClick={() => handleRelease(budget.id)}>
                            <Package className="h-4 w-4 mr-2" />
                            Liberar
                          </Button>
                        )}
                        {budget.status === "released" && (
                          <Button variant="default" size="sm" onClick={() => handleReplicate(budget.id)}>
                            <Package className="h-4 w-4 mr-2" />
                            Replicar ao Estoque
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
          </>
        )}
      </PageContainer>

      {/* Allocate Budget Modal */}
      <ResponsiveModal
        open={showAllocateModal}
        onOpenChange={setShowAllocateModal}
        title={`Alocar Verba - ${selectedCostCenter?.name || ""}`}
        description="Adicione verba ao orçamento do centro de custo."
      >
        {selectedCostCenter && (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground uppercase font-bold">Saldo Atual</p>
              <p className="text-2xl font-black text-green-600">
                R$ {selectedCostCenter.availableBudget.toLocaleString("pt-BR")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor a Alocar (R$)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0,00"
                value={allocateAmount}
                onChange={(e) => setAllocateAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Ex: Alocação extra para campanha de fim de ano"
                value={allocateDescription}
                onChange={(e) => setAllocateDescription(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAllocateModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleAllocateBudget} disabled={!allocateAmount} className="flex-1">
                Alocar Verba
              </Button>
            </div>
          </div>
        )}
      </ResponsiveModal>

      {/* History Modal */}
      <ResponsiveModal
        open={showHistoryModal}
        onOpenChange={setShowHistoryModal}
        title={`Histórico - ${selectedCostCenter?.name || ""}`}
        description="Movimentações e transações do centro de custo."
        maxWidth="2xl"
      >
        {selectedCostCenter && (
          <div className="space-y-4 py-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold">Alocado</p>
                <p className="text-lg font-bold text-green-600">
                  R$ {selectedCostCenter.allocatedBudget.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold">Utilizado</p>
                <p className="text-lg font-bold text-red-500">
                  R$ {selectedCostCenter.usedBudget.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-bold">Disponível</p>
                <p className="text-lg font-bold text-green-600">
                  R$ {selectedCostCenter.availableBudget.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>

            {/* Transactions List */}
            <ScrollArea className="h-[400px]">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma transação encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-start gap-4 p-4 border rounded-xl hover:bg-muted/30">
                      <div className={cn(
                        "p-2 rounded-full",
                        tx.type === "allocation" && "bg-blue-100",
                        tx.type === "expense" && "bg-red-100",
                        tx.type === "refund" && "bg-green-100",
                        tx.type === "adjustment" && "bg-yellow-100"
                      )}>
                        {tx.type === "allocation" && <ArrowUpRight className="h-5 w-5 text-blue-600" />}
                        {tx.type === "expense" && <ArrowDownRight className="h-5 w-5 text-red-600" />}
                        {tx.type === "refund" && <RotateCcw className="h-5 w-5 text-green-600" />}
                        {tx.type === "adjustment" && <Edit className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm">{tx.description}</p>
                          <p className={cn(
                            "font-bold text-sm whitespace-nowrap",
                            tx.type === "allocation" && "text-blue-600",
                            tx.type === "expense" && "text-red-600",
                            tx.type === "refund" && "text-green-600"
                          )}>
                            {tx.type === "expense" ? "-" : "+"} R$ {tx.amount.toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {tx.userName && <span>{tx.userName}</span>}
                          <span>•</span>
                          <span>{format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                          {tx.budgetTitle && (
                            <>
                              <span>•</span>
                              <span className="truncate">{tx.budgetTitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            <div className="pt-4">
              <Button variant="outline" onClick={() => setShowHistoryModal(false)} className="w-full">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </ResponsiveModal>

      {/* Requests Modal */}
      <ResponsiveModal
        open={showRequestsModal}
        onOpenChange={setShowRequestsModal}
        title={`Solicitações Pendentes - ${selectedCostCenter?.name || ""}`}
        description="Orçamentos aguardando aprovação neste centro de custo."
        maxWidth="2xl"
      >
        {selectedCostCenter && (
          <div className="space-y-4 py-4">
            {/* Pending budgets list */}
            <ScrollArea className="h-[400px]">
              {(() => {
                const pendingBudgets = getPendingBudgetsForCostCenter(selectedCostCenter.id)
                
                if (pendingBudgets.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Nenhuma solicitação pendente</p>
                    </div>
                  )
                }
                
                return (
                  <div className="space-y-3">
                    {pendingBudgets.map((budget) => (
                      <div key={budget.id} className="p-4 border rounded-xl hover:bg-muted/30">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{budget.title}</h4>
                              <Badge className={STATUS_COLORS[budget.status]}>
                                {STATUS_LABELS[budget.status]}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              {budget.requestedByName && (
                                <span>Solicitado por: {budget.requestedByName}</span>
                              )}
                              <span>•</span>
                              <span>{format(new Date(budget.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              R$ {budget.totalCash.toLocaleString("pt-BR")}
                            </p>
                            {budget.totalCash > selectedCostCenter.availableBudget && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Excede saldo
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              setShowRequestsModal(false)
                              // Navigate to budget details
                              const budgetData = budgets.find(b => b.id === budget.id)
                              if (budgetData) {
                                setSelectedBudget(budgetData)
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </ScrollArea>
            
            <div className="pt-4">
              <Button variant="outline" onClick={() => setShowRequestsModal(false)} className="w-full">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </ResponsiveModal>

      {/* Buyer Modal */}
      <ResponsiveModal
        open={showBuyerModal}
        onOpenChange={setShowBuyerModal}
        title={editingBuyer ? "Editar Colaborador" : "Novo Colaborador"}
        description={editingBuyer ? "Atualize as informações do colaborador." : "Cadastre um novo colaborador autorizado."}
        maxWidth="xl"
      >
        <div className="space-y-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="buyerName">Nome *</Label>
              <Input
                id="buyerName"
                placeholder="Nome completo"
                value={buyerFormData.name}
                onChange={(e) => setBuyerFormData({ ...buyerFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerEmail">Email *</Label>
              <Input
                id="buyerEmail"
                type="email"
                placeholder="email@empresa.com"
                value={buyerFormData.email}
                onChange={(e) => setBuyerFormData({ ...buyerFormData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Papel</Label>
              <Select 
                value={buyerFormData.role} 
                onValueChange={(value) => setBuyerFormData({ ...buyerFormData, role: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Comprador
                    </div>
                  </SelectItem>
                  <SelectItem value="approver">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Aprovador
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      Administrador
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerLimit">Limite de Gastos (R$)</Label>
              <Input
                id="buyerLimit"
                type="number"
                placeholder="0,00"
                value={buyerFormData.spendLimit}
                onChange={(e) => setBuyerFormData({ ...buyerFormData, spendLimit: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Centros de Custo Permitidos</Label>
            <p className="text-xs text-muted-foreground">Selecione os centros de custo que este colaborador pode utilizar</p>
            <div className="grid gap-2 md:grid-cols-2 mt-2">
              {costCenters.map(cc => (
                <div
                  key={cc.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    buyerFormData.costCenterIds.includes(cc.id) 
                      ? "border-primary bg-primary/5" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => toggleBuyerCostCenter(cc.id)}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                    buyerFormData.costCenterIds.includes(cc.id) 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground"
                  )}>
                    {buyerFormData.costCenterIds.includes(cc.id) && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{cc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Saldo: R$ {cc.availableBudget.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="buyerActive">Colaborador Ativo</Label>
            <Switch
              id="buyerActive"
              checked={buyerFormData.isActive}
              onCheckedChange={(checked) => setBuyerFormData({ ...buyerFormData, isActive: checked })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowBuyerModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSaveBuyer} className="flex-1">
              {editingBuyer ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </div>
        </div>
      </ResponsiveModal>

      {/* Budget Details Modal */}
      <ResponsiveModal
        open={!!selectedBudget}
        onOpenChange={(open) => !open && setSelectedBudget(null)}
        title={
          selectedBudget ? (
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-primary" />
              <span>{selectedBudget.title}</span>
              <Badge className={cn("ml-auto", STATUS_COLORS[selectedBudget.status])}>
                {STATUS_LABELS[selectedBudget.status]}
              </Badge>
            </div>
          ) : undefined
        }
        description={selectedBudget ? "Detalhes do orçamento e itens selecionados." : undefined}
        maxWidth="3xl"
        footer={
          selectedBudget ? (
            <div className="space-y-3 w-full">
              {isEditMode ? (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full">
                  {(selectedBudget.status === "draft" || selectedBudget.status === "submitted") && (
                    <>
                      <Button variant="outline" onClick={handleEnterEditMode}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Orçamento
                      </Button>
                      {selectedBudget.status === "draft" && (
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmitBudget}>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar para Aprovação
                        </Button>
                      )}
                      {selectedBudget.status === "submitted" && (
                        <Button variant="outline" onClick={handleWithdrawBudget}>
                          Retirar Orçamento
                        </Button>
                      )}
                    </>
                  )}
                  {selectedBudget.status === "submitted" && (
                    <>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReject(selectedBudget.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(selectedBudget.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    </>
                  )}
                  {selectedBudget.status === "approved" && (
                    <Button className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white h-12" onClick={() => handleRelease(selectedBudget.id)}>
                      <Package className="h-4 w-4 mr-2" />
                      Liberar para Replicação
                    </Button>
                  )}
                  {selectedBudget.status === "released" && (
                    <Button className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white h-12" onClick={() => handleReplicate(selectedBudget.id)}>
                      <Package className="h-4 w-4 mr-2" />
                      Replicar ao Estoque
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : undefined
        }
      >
        {selectedBudget && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="details" className="gap-2">
                <FileText className="h-4 w-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="items" className="gap-2">
                <Package className="h-4 w-4" />
                Itens ({budgetItems.length})
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Mensagens
                {messages.filter(m => !m.isRead && m.senderRole === "superAdmin").length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                    {messages.filter(m => !m.isRead && m.senderRole === "superAdmin").length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total em Espécie</p>
                  <p className="text-xl font-black text-slate-900">
                    R$ {isEditMode ? calculateEditedTotals().totalCash.toFixed(2) : selectedBudget.totalCash.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
                  <p className="text-[10px] font-black uppercase text-primary tracking-wider">Total em {getCurrencyName(companyId, true).toUpperCase()}</p>
                  <p className="text-xl font-black text-primary">
                    {isEditMode 
                      ? calculateEditedTotals().totalPoints.toLocaleString("pt-BR") 
                      : selectedBudget.totalPoints.toLocaleString("pt-BR")
                    } {getCurrencyName(companyId, true).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Status Pipeline Visual */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-900">Status do Orçamento</h4>
                <div className="overflow-x-auto pb-2">
                  <div className="flex items-center gap-2 min-w-max">
                    {STATUS_PIPELINE.map((status, index) => {
                      const currentIndex = getStatusPipelineIndex(selectedBudget.status)
                      const isActive = index <= currentIndex
                      const isCurrent = status === selectedBudget.status
                      
                      return (
                        <div key={status} className="flex items-center">
                          <div className={cn(
                            "p-2 rounded-lg text-center text-xs font-semibold transition-all min-w-[80px]",
                            isActive ? STATUS_COLORS[status] : "bg-gray-100 text-gray-400",
                            isCurrent && "ring-2 ring-primary ring-offset-2"
                          )}>
                            {STATUS_LABELS[status]}
                          </div>
                          {index < STATUS_PIPELINE.length - 1 && (
                            <ArrowRight className={cn(
                              "h-4 w-4 mx-1 shrink-0",
                              isActive ? "text-primary" : "text-gray-300"
                            )} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Histórico do Orçamento
                </h4>
                <div className="space-y-3 p-4 border rounded-2xl bg-card">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Data de Criação</span>
                    <span className="font-bold">{format(new Date(selectedBudget.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                  </div>
                  {selectedBudget.submittedAt && (
                    <div className="flex items-center justify-between text-sm pt-3 border-t">
                      <span className="text-muted-foreground">Data de Envio</span>
                      <span className="font-bold">{format(new Date(selectedBudget.submittedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                    </div>
                  )}
                  {selectedBudget.approvedAt && (
                    <div className="flex items-center justify-between text-sm pt-3 border-t">
                      <span className="text-muted-foreground">Data de Aprovação</span>
                      <span className="font-bold">{format(new Date(selectedBudget.approvedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback from Super Admin */}
              {selectedBudget.meta?.changeRequestFeedback && (
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Alterações Solicitadas
                  </h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    {selectedBudget.meta.changeRequestFeedback as string}
                  </p>
                </div>
              )}

              {selectedBudget.meta?.rejectionReason && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Motivo da Rejeição
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    {selectedBudget.meta.rejectionReason as string}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-slate-400" />
                  Itens Selecionados ({budgetItems.length})
                </h4>
                {!isEditMode && (selectedBudget.status === "draft" || selectedBudget.status === "submitted") && (
                  <Button size="sm" variant="outline" onClick={handleEnterEditMode}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {budgetItems.map((item) => {
                  const baseProduct = getBaseProducts().find(bp => bp.id === item.baseProductId)
                  const edited = editedItems.get(item.id)
                  const displayQty = isEditMode && edited ? edited.qty : item.qty
                  const displayPrice = isEditMode && edited ? edited.unitPrice : item.unitPrice
                  const subtotal = displayQty * displayPrice
                  
                  return (
                    <div key={item.id} className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border bg-card transition-all group",
                      isEditMode && "border-primary/30"
                    )}>
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                        {baseProduct?.images?.[0] ? (
                          <img src={baseProduct.images[0]} alt={baseProduct.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">{baseProduct?.name || item.baseProductId}</p>
                        {baseProduct?.sku && (
                          <p className="text-xs text-muted-foreground">SKU: {baseProduct.sku}</p>
                        )}
                        {isEditMode ? (
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-6 w-6"
                                onClick={() => handleUpdateItemQty(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-semibold">{displayQty}</span>
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-6 w-6"
                                onClick={() => handleUpdateItemQty(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">×</span>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                              <Input
                                type="number"
                                step="0.01"
                                value={displayPrice}
                                onChange={(e) => handleUpdateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                                className="w-24 h-7 pl-7 text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.qty} un × R$ {item.unitPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-foreground">R$ {subtotal.toFixed(2)}</p>
                        <p className="text-[10px] font-bold text-primary">{item.unitPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true).toUpperCase()}/un</p>
                      </div>
                      {isEditMode && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <div className="h-[300px] overflow-y-auto space-y-3 p-4 border rounded-lg bg-muted/30">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma mensagem ainda</p>
                    <p className="text-xs">Envie uma mensagem para o comercial</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "p-3 rounded-lg max-w-[80%]",
                        msg.senderRole === "manager"
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
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Digite sua mensagem para o comercial..."
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
          </Tabs>
        )}
      </ResponsiveModal>
    </>
  )
}

export default function BudgetsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <BudgetsPageContent />
    </Suspense>
  )
}
