"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

import { PageContainer } from "@/components/page-container"

// MUI Components
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Pagination from '@mui/material/Pagination'

import {
  Package,
  MapPin,
  Truck,
  RefreshCw,
  Search,
  Clock,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Gift,
  X,
  ShoppingBag,
  Sparkles,
  Trophy,
  Coins,
  ChevronRight,
  Calendar,
  BoxIcon,
  Filter,
} from "lucide-react"
import { 
  getOrders, 
  getUserOrders,
  type OrderStatus, 
  getProducts, 
  getCompanyProductById,
  getUserById,
  getCurrencyName,
  type Order,
  type User,
  type Product,
  type CompanyProduct,
  type LineItem
} from "@/lib/storage"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "processing", label: "Processando" },
  { value: "shipped", label: "Enviado" },
  { value: "in_transit", label: "Em Trânsito" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
  { value: "returned", label: "Devolvido" },
  { value: "scheduled", label: "Agendado" },
]

const STATUS_CONFIG: Record<OrderStatus, { 
  icon: React.ReactNode
  label: string
  color: string
  bgColor: string
  step: number
}> = {
  pending: { 
    icon: <Clock className="h-4 w-4" />, 
    label: "Pendente",
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    step: 1
  },
  processing: { 
    icon: <RefreshCw className="h-4 w-4" />, 
    label: "Processando",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    step: 1
  },
  shipped: { 
    icon: <Package className="h-4 w-4" />, 
    label: "Enviado",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    step: 2
  },
  in_transit: { 
    icon: <Truck className="h-4 w-4" />, 
    label: "Em Trânsito",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    step: 2
  },
  delivered: { 
    icon: <CheckCircle className="h-4 w-4" />, 
    label: "Entregue",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    step: 3
  },
  cancelled: { 
    icon: <XCircle className="h-4 w-4" />, 
    label: "Cancelado",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    step: 0
  },
  returned: { 
    icon: <AlertCircle className="h-4 w-4" />, 
    label: "Devolvido",
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
    step: 0
  },
  scheduled: { 
    icon: <Gift className="h-4 w-4" />, 
    label: "Agendado",
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    step: 0
  },
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

// Order Progress Component
function OrderProgress({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const currentStep = config?.step ?? 1
  
  const steps = [
    { label: "Pedido", icon: ShoppingBag },
    { label: "Envio", icon: Package },
    { label: "Entrega", icon: CheckCircle2 },
  ]

  if (currentStep === 0) {
    // Cancelled/Returned/Scheduled - show special state
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        config.bgColor
      )}>
        <span className={config.color}>{config.icon}</span>
        <span className={cn("m3-label-medium font-medium", config.color)}>{config.label}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => {
        const isCompleted = idx + 1 <= currentStep
        const isCurrent = idx + 1 === currentStep
        const StepIcon = step.icon

        return (
          <div key={step.label} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full transition-all",
              isCompleted 
                ? "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]" 
                : "bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)]",
              isCurrent && "ring-2 ring-[var(--md-sys-color-primary)]/30 ring-offset-2"
            )}>
              <StepIcon className="h-4 w-4" />
            </div>
            {idx < steps.length - 1 && (
              <div className={cn(
                "w-6 h-0.5 mx-0.5",
                isCompleted 
                  ? "bg-[var(--md-sys-color-primary)]" 
                  : "bg-[var(--md-sys-color-outline-variant)]"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function MeusPedidosPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<(Product | CompanyProduct)[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [searchOrder, setSearchOrder] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [perPage] = useState(6)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const loadData = () => {
      const authData = localStorage.getItem("yoobe_auth")
      if (authData) {
        try {
          const auth = JSON.parse(authData)
          const user = getUserById(auth.userId)
          setCurrentUser(user)
          if (auth.companyId) {
            setCompanyId(auth.companyId)
          }
          
          // Debug logs
          if (process.env.NODE_ENV === 'development') {
            console.log("[Pedidos] User loaded:", user?.id, user?.role, user?.email)
          }
          
          if (user?.role === "member" && user?.id) {
            // For members, get only their orders
            const allOrders = getOrders()
            let userOrders = getUserOrders(user.id)
            
            // If no orders found by userId, try to find by email as fallback
            if (userOrders.length === 0 && user.email) {
              userOrders = allOrders.filter(o => {
                // Match by email if userId is missing or empty
                return (!o.userId || o.userId === "") && o.email === user.email
              })
              
              // If we found orders by email, update them with the userId
              if (userOrders.length > 0 && process.env.NODE_ENV === 'development') {
                console.log("[Pedidos] Found", userOrders.length, "orders by email, updating with userId")
                // Update orders with userId for future reference
                const updatedOrders = allOrders.map(o => {
                  if ((!o.userId || o.userId === "") && o.email === user.email) {
                    return { ...o, userId: user.id }
                  }
                  return o
                })
                // Note: We're not saving here to avoid side effects, but the orders will be updated in memory
                // The actual save should happen when orders are modified through normal flow
              }
            }
            
            // Debug logs
            if (process.env.NODE_ENV === 'development') {
              console.log("[Pedidos] Total orders in storage:", allOrders.length)
              console.log("[Pedidos] Orders for user", user.id, ":", userOrders.length)
              console.log("[Pedidos] User email:", user.email)
              console.log("[Pedidos] Sample order userIds:", allOrders.slice(0, 5).map(o => ({ 
                id: o.id, 
                userId: o.userId || "(empty)", 
                email: o.email || "(empty)",
                number: o.number 
              })))
            }
            
            // Set orders and page in a single batch to avoid intermediate empty state
            setOrders(userOrders)
            setPage(1)
          } else {
            // For admins/managers, get all orders
            const allOrders = getOrders()
            if (process.env.NODE_ENV === 'development') {
              console.log("[Pedidos] Loading all orders for admin/manager:", allOrders.length)
            }
            setOrders(allOrders)
            setPage(1)
          }
        } catch (error) {
          console.error("Error loading user data:", error)
          const allOrders = getOrders()
          setOrders(allOrders)
          setPage(1)
        }
      } else {
        const allOrders = getOrders()
        if (process.env.NODE_ENV === 'development') {
          console.log("[Pedidos] No auth data, loading all orders:", allOrders.length)
        }
        setOrders(allOrders)
        setPage(1)
      }
      loadProducts()
    }
    
    loadData()
  }, [])

  const loadProducts = () => {
    const data = getProducts()
    setProducts(data)
  }

  const refresh = () => {
    if (currentUser?.role === "member" && currentUser?.id) {
      const allOrders = getOrders()
      let userOrders = getUserOrders(currentUser.id)
      
      // Fallback: find by email if no orders found by userId
      if (userOrders.length === 0 && currentUser.email) {
        userOrders = allOrders.filter(o => {
          return (!o.userId || o.userId === "") && o.email === currentUser.email
        })
      }
      
      setOrders(userOrders)
    } else {
      setOrders(getOrders())
    }
    setProducts(getProducts())
    setPage(1) // Reset to first page on refresh
  }

  // Map order states to status filter values
  const mapOrderStateToStatus = (state: string | undefined): OrderStatus => {
    if (!state) return "pending"
    // Map common state values to status values
    const stateMap: Record<string, OrderStatus> = {
      "complete": "delivered",
      "canceled": "cancelled",
      "payment": "pending",
      "confirm": "processing",
      "delivery": "processing",
      "address": "pending",
    }
    return (stateMap[state] || state) as OrderStatus
  }

  const filteredOrders = useMemo(() => {
    // Don't log "No orders to filter" on initial render - it's expected
    if (!orders || orders.length === 0) {
      return []
    }
    
    const filtered = orders.filter((order) => {
      // For members, getUserOrders already filters by userId, but double-check for safety
      // However, since getUserOrders now handles the filtering, we can be more lenient here
      if (currentUser?.role === "member" && currentUser?.id) {
        // If order has userId, it must match
        if (order.userId && order.userId !== currentUser.id) {
          return false
        }
        // If userId is empty/missing, check email as fallback
        if (!order.userId || order.userId === "") {
          // If email doesn't match either, exclude
          if (order.email && currentUser.email && order.email !== currentUser.email) {
            return false
          }
          // If both userId and email are missing, exclude (safety measure)
          if (!order.email) {
            return false
          }
        }
      }

      // Search filter
      const matchesOrder = !searchOrder || (order.number || "").toLowerCase().includes(searchOrder.toLowerCase())
      
      // Status filter - map state to status for filtering
      const orderState = order.state || order.status || "pending"
      const mappedStatus = mapOrderStateToStatus(orderState)
      const matchesStatus = statusFilter === "all" || mappedStatus === statusFilter || orderState === statusFilter
      
      return matchesOrder && matchesStatus
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log("[Pedidos] Filtered orders:", filtered.length, "from", orders.length, "total")
      if (filtered.length === 0 && orders.length > 0) {
        console.log("[Pedidos] Filter debug:", {
          searchOrder,
          statusFilter,
          currentUser: currentUser?.id,
          sampleOrder: orders[0] ? {
            userId: orders[0].userId,
            state: orders[0].state,
            status: orders[0].status,
            number: orders[0].number
          } : null
        })
      }
    }
    
    return filtered
  }, [orders, currentUser, searchOrder, statusFilter])

  const total = filteredOrders.length
  const totalPages = Math.ceil(total / perPage)
  // Ensure page is valid - if page is beyond totalPages, reset to 1
  const validPage = totalPages > 0 && page > totalPages ? 1 : page
  const startIndex = (validPage - 1) * perPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + perPage)
  
  // Auto-correct page if it's invalid
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(1)
    }
  }, [page, totalPages])

  const clearFilters = () => {
    setSearchOrder("")
    setStatusFilter("all")
    setPage(1)
  }

  const hasActiveFilters = searchOrder || statusFilter !== "all"

  // Stats - use filteredOrders for consistency, but show all orders in stats
  const statsOrders = orders // Use all orders for stats, not filtered
  const deliveredCount = statsOrders.filter(o => {
    const state = o.state || o.status || "pending"
    return state === "delivered" || state === "complete"
  }).length
  const totalPoints = statsOrders.reduce((acc, o) => acc + (o.paidWithPoints || 0), 0)
  const pendingCount = statsOrders.filter(o => {
    const state = o.state || o.status || "pending"
    const mapped = mapOrderStateToStatus(state)
    return mapped === "pending" || mapped === "processing" || state === "payment" || state === "confirm"
  }).length
  const inTransitCount = statsOrders.filter(o => {
    const state = o.state || o.status || "pending"
    const mapped = mapOrderStateToStatus(state)
    return mapped === "shipped" || mapped === "in_transit"
  }).length

  const getProductImage = (productId: string) => {
    if (productId.startsWith("cp_")) {
      const companyProduct = getCompanyProductById(productId)
      if (companyProduct?.images?.[0]) {
        return companyProduct.images[0]
      }
    }
    const product = products.find((p) => p.id === productId)
    return product?.image || product?.images?.[0] || "/placeholder.svg"
  }
  
  const getProductName = (productId: string, fallbackName: string) => {
    if (productId.startsWith("cp_")) {
      const companyProduct = getCompanyProductById(productId)
      if (companyProduct?.name) {
        return companyProduct.name
      }
    }
    const product = products.find((p) => p.id === productId)
    return product?.name || fallbackName
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "-"
      return date.toLocaleDateString("pt-BR")
    } catch {
      return "-"
    }
  }

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "-"
      return date.toLocaleString("pt-BR")
    } catch {
      return "-"
    }
  }

  const currencyName = getCurrencyName(companyId, true)

  return (
    <PageContainer className="space-y-6">
      {/* Page Header with M3 styling */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div data-tour="orders" className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--md-sys-color-primary-container)] shadow-md">
            <ShoppingBag className="h-7 w-7 text-[var(--md-sys-color-on-primary-container)]" />
          </div>
          <div>
            <h1 className="m3-headline-medium font-bold text-[var(--md-sys-color-on-surface)]">
              {currentUser?.role === "member" ? "Meus Pedidos" : "Pedidos dos Membros"}
            </h1>
            <p className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)] mt-1">
              {currentUser?.role === "member" ? "Acompanhe seus resgates e conquistas" : "Gerenciar pedidos da conta"}
            </p>
          </div>
        </div>
        <Button 
          variant="outline"
          onClick={refresh}
          className="rounded-full px-5 border-[var(--md-sys-color-outline)] hover:bg-[var(--md-sys-color-surface-container-high)]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </motion.div>

      {/* Gamification Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Orders */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 p-4 flex items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--md-sys-color-secondary-container)]">
            <BoxIcon className="h-6 w-6 text-[var(--md-sys-color-on-secondary-container)]" />
          </div>
          <div className="flex-1">
            <p className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)]">Total de Pedidos</p>
            <p className="m3-headline-small font-bold text-[var(--md-sys-color-on-surface)]">{statsOrders.length}</p>
          </div>
        </motion.div>

        {/* Delivered */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 p-4 flex items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
            <Trophy className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)]">Prêmios Recebidos</p>
            <p className="m3-headline-small font-bold text-green-600">{deliveredCount}</p>
          </div>
        </motion.div>

        {/* Points Used */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="m3-shape-large bg-gradient-to-br from-[var(--md-sys-color-tertiary-container)] to-[var(--md-sys-color-tertiary-container)]/50 border border-[var(--md-sys-color-tertiary)]/20 p-4 flex items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--md-sys-color-tertiary)]/20">
            <Coins className="h-6 w-6 text-[var(--md-sys-color-on-tertiary-container)]" />
          </div>
          <div className="flex-1">
            <p className="m3-label-medium text-[var(--md-sys-color-on-tertiary-container)]">{currencyName} Utilizados</p>
            <p className="m3-headline-small font-bold text-[var(--md-sys-color-on-tertiary-container)]">
              {totalPoints.toLocaleString("pt-BR")}
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-[var(--md-sys-color-tertiary)] animate-pulse" />
        </motion.div>

        {/* Pending/In Transit */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 p-4 flex items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)]">Em Andamento</p>
            <p className="m3-headline-small font-bold text-blue-600">{pendingCount + inTransitCount}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" />
            <Input
              placeholder="Buscar por nº do pedido..."
              value={searchOrder}
              onChange={(e) => {
                setSearchOrder(e.target.value)
                setPage(1)
              }}
              className="pl-10 rounded-xl border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]">
              <Filter className="h-4 w-4 mr-2 text-[var(--md-sys-color-on-surface-variant)]" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    {STATUS_CONFIG[opt.value].icon}
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-[var(--md-sys-color-error)] hover:bg-[var(--md-sys-color-error-container)]/50"
            >
              Limpar
            </Button>
          )}
        </div>
        {/* Results summary */}
        {filteredOrders.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/30">
            <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
              Mostrando {paginatedOrders.length} de {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''}
              {hasActiveFilters && ` (${statsOrders.length} total)`}
            </p>
          </div>
        )}
      </motion.div>

      {/* Debug Info - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="m3-shape-large bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-xs"
        >
          <p className="font-bold mb-2">🐛 Debug Info:</p>
          <ul className="space-y-1 text-[var(--md-sys-color-on-surface-variant)]">
            <li>Current User ID: {currentUser?.id || "N/A"}</li>
            <li>Current User Role: {currentUser?.role || "N/A"}</li>
            <li>Current User Email: {currentUser?.email || "N/A"}</li>
            <li>Total Orders Loaded: {orders.length}</li>
            <li>Filtered Orders: {filteredOrders.length}</li>
            <li>Paginated Orders: {paginatedOrders.length}</li>
            <li>Search Filter: {searchOrder || "none"}</li>
            <li>Status Filter: {statusFilter}</li>
            {orders.length > 0 && (
              <li className="mt-2">
                Sample Order: {orders[0]?.number} (userId: {orders[0]?.userId || "empty"}, state: {orders[0]?.state || orders[0]?.status || "none"})
              </li>
            )}
          </ul>
        </motion.div>
      )}

      {/* Orders List */}
      {paginatedOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="m3-shape-extra-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 p-12 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--md-sys-color-surface-container-high)] mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-[var(--md-sys-color-on-surface-variant)]" />
          </div>
          <h3 className="m3-title-large text-[var(--md-sys-color-on-surface)] mb-2">
            {hasActiveFilters ? "Nenhum pedido encontrado" : orders.length === 0 ? "Nenhum pedido ainda" : "Nenhum pedido corresponde aos filtros"}
          </h3>
          <p className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)] mb-4">
            {hasActiveFilters 
              ? "Tente ajustar os filtros de busca para ver mais resultados" 
              : orders.length === 0
              ? "Seus pedidos aparecerão aqui após o primeiro resgate na loja"
              : `Você tem ${orders.length} pedido${orders.length > 1 ? 's' : ''}, mas nenhum corresponde aos filtros aplicados`}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4 rounded-full"
            >
              Limpar Filtros
            </Button>
          )}
          {orders.length > 0 && !hasActiveFilters && (
            <div className="mt-4 p-4 bg-[var(--md-sys-color-surface-container)] rounded-xl">
              <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] mb-2">
                Há {orders.length} pedido(s) carregado(s), mas não estão sendo exibidos.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log("=== DEBUG PEDIDOS ===")
                    console.log("Current user:", currentUser)
                    console.log("All orders loaded:", orders)
                    console.log("Filtered orders:", filteredOrders)
                    console.log("Orders details:", orders.map(o => ({
                      id: o.id,
                      number: o.number,
                      userId: o.userId || "(empty)",
                      email: o.email || "(empty)",
                      state: o.state || o.status || "(none)",
                      matchesUser: o.userId === currentUser?.id || o.email === currentUser?.email
                    })))
                    const allOrdersInStorage = getOrders()
                    console.log("Total orders in storage:", allOrdersInStorage.length)
                    console.log("Storage orders sample:", allOrdersInStorage.slice(0, 3).map(o => ({
                      id: o.id,
                      number: o.number,
                      userId: o.userId || "(empty)",
                      email: o.email || "(empty)"
                    })))
                  }}
                  className="rounded-full"
                >
                  Ver Logs no Console
                </Button>
                {currentUser?.role === "member" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Try to show all orders as fallback
                      const allOrders = getOrders()
                      setOrders(allOrders)
                      toast({
                        title: "Mostrando todos os pedidos",
                        description: "Exibindo todos os pedidos do sistema para debug",
                      })
                    }}
                    className="rounded-full"
                  >
                    Mostrar Todos os Pedidos (Debug)
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
          data-testid="orders-list-container"
        >
          <AnimatePresence mode="popLayout">
            {paginatedOrders.map((order) => {
              const orderState = order.state || order.status || "pending"
              const status = mapOrderStateToStatus(orderState) as OrderStatus
              const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending

              return (
                <motion.div
                  key={order.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "m3-shape-large overflow-hidden cursor-pointer transition-all duration-300",
                    "bg-[var(--md-sys-color-surface-container-low)]",
                    "border border-[var(--md-sys-color-outline-variant)]/30",
                    "hover:border-[var(--md-sys-color-primary)]/30 hover:shadow-lg"
                  )}
                >
                  <div className="p-5">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--md-sys-color-primary-container)]">
                          <Package className="h-5 w-5 text-[var(--md-sys-color-on-primary-container)]" />
                        </div>
                        <div>
                          <h3 className="m3-title-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                            Pedido {order.number}
                          </h3>
                          <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <OrderProgress status={status} />
                    </div>

                    {/* Products Preview */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex -space-x-2 shrink-0">
                          {order.lineItems?.slice(0, 4).map((item: LineItem, idx: number) => (
                            <div
                              key={idx}
                              className="h-10 w-10 rounded-lg border-2 border-[var(--md-sys-color-surface)] overflow-hidden bg-[var(--md-sys-color-surface-container-high)]"
                            >
                              <img
                                src={getProductImage(item.productId) || "/placeholder.svg"}
                                alt={getProductName(item.productId, item.name)}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                          {(order.lineItems?.length || 0) > 4 && (
                            <div className="h-10 w-10 rounded-lg border-2 border-[var(--md-sys-color-surface)] bg-[var(--md-sys-color-surface-container-highest)] flex items-center justify-center">
                              <span className="m3-label-small text-[var(--md-sys-color-on-surface-variant)]">
                                +{(order.lineItems?.length || 0) - 4}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] truncate">
                            {order.lineItems?.length || 0} {(order.lineItems?.length || 0) === 1 ? "item" : "itens"}
                            {order.lineItems && order.lineItems.length > 0 && (
                              <span className="text-[var(--md-sys-color-on-surface-variant)]/70">
                                {" • "}
                                {order.lineItems[0].name}
                                {order.lineItems.length > 1 && ` +${order.lineItems.length - 1} mais`}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/30">
                      <div className="flex items-center gap-3">
                        {/* Points Badge */}
                        {order.paidWithPoints ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--md-sys-color-tertiary-container)]">
                            <Coins className="h-4 w-4 text-[var(--md-sys-color-on-tertiary-container)]" />
                            <span className="m3-label-large font-semibold text-[var(--md-sys-color-on-tertiary-container)]">
                              {(order.paidWithPoints || 0).toLocaleString("pt-BR")} {currencyName}
                            </span>
                          </div>
                        ) : (
                          <span className="m3-title-medium font-bold text-[var(--md-sys-color-on-surface)]">
                            R$ {(order.total || 0).toFixed(2).replace(".", ",")}
                          </span>
                        )}
                        {/* Cashback indicator */}
                        {order.pointsEarned && order.pointsEarned > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                            <Sparkles className="h-3 w-3 text-green-600" />
                            <span className="m3-label-small text-green-600 font-medium">
                              +{order.pointsEarned.toLocaleString("pt-BR")} {currencyName}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)]/50"
                      >
                        Ver Detalhes
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center py-4"
        >
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '12px',
              }
            }}
          />
        </motion.div>
      )}

      {/* Order Details Modal */}
      <Dialog 
        open={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '28px',
            bgcolor: 'var(--md-sys-color-surface-container-high)',
          }
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--md-sys-color-primary-container)]">
                    <Package className="h-6 w-6 text-[var(--md-sys-color-on-primary-container)]" />
                  </div>
                  <div>
                    <span className="m3-title-large font-semibold text-[var(--md-sys-color-on-surface)]">
                      Pedido {selectedOrder.number}
                    </span>
                    <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                      Realizado em {formatDateTime(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(null)}
                  className="h-10 w-10 rounded-full hover:bg-[var(--md-sys-color-surface-container-highest)]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogTitle>
            <DialogContent dividers sx={{ 
              borderColor: 'var(--md-sys-color-outline-variant)',
              bgcolor: 'var(--md-sys-color-surface-container-low)',
              p: 3,
            }}>
              {/* Progress Journey */}
              <div className="mb-6 p-4 rounded-2xl bg-[var(--md-sys-color-surface-container)]">
                <p className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] mb-3">Jornada do Pedido</p>
                <div className="flex justify-center">
                  <OrderProgress status={mapOrderStateToStatus(selectedOrder.state || selectedOrder.status) as OrderStatus} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Payment Info */}
                <div className="m3-shape-large bg-[var(--md-sys-color-surface-container)] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--md-sys-color-primary-container)]">
                      <Coins className="h-4 w-4 text-[var(--md-sys-color-on-primary-container)]" />
                    </div>
                    <span className="m3-title-small font-semibold text-[var(--md-sys-color-on-surface)]">
                      Pagamento
                    </span>
                  </div>
                  <div className="pl-10 space-y-2">
                    {selectedOrder.paidWithPoints ? (
                      <div>
                        <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] mb-1">Método</p>
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-[var(--md-sys-color-tertiary)]" />
                          <p className="m3-body-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                            Pago com {currencyName}
                          </p>
                        </div>
                        <p className="m3-body-large font-bold text-[var(--md-sys-color-tertiary)] mt-1">
                          {(selectedOrder.paidWithPoints || 0).toLocaleString("pt-BR")} {currencyName}
                        </p>
                      </div>
                    ) : selectedOrder.paidWithMoney ? (
                      <div>
                        <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] mb-1">Método</p>
                        <p className="m3-body-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                          {selectedOrder.paymentMethod === "pix" ? "PIX" : selectedOrder.paymentMethod === "card" ? "Cartão" : "Dinheiro"}
                        </p>
                        <p className="m3-body-large font-bold text-[var(--md-sys-color-primary)] mt-1">
                          R$ {(selectedOrder.paidWithMoney || 0).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    ) : (
                      <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                        Informação de pagamento não disponível
                      </p>
                    )}
                    {selectedOrder.pointsEarned && selectedOrder.pointsEarned > 0 && (
                      <div className="mt-3 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/30">
                        <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] mb-1">Cashback</p>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-green-600" />
                          <p className="m3-body-medium font-semibold text-green-600">
                            +{selectedOrder.pointsEarned.toLocaleString("pt-BR")} {currencyName} ganhos
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)]">Status do Pagamento</p>
                      <p className={cn(
                        "m3-body-small font-medium mt-1",
                        selectedOrder.paymentState === "paid" ? "text-green-600" : "text-amber-600"
                      )}>
                        {selectedOrder.paymentState === "paid" ? "✓ Pago" : selectedOrder.paymentState === "balance_due" ? "⏳ Pendente" : selectedOrder.paymentState || "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="m3-shape-large bg-[var(--md-sys-color-surface-container)] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--md-sys-color-secondary-container)]">
                      <MapPin className="h-4 w-4 text-[var(--md-sys-color-on-secondary-container)]" />
                    </div>
                    <span className="m3-title-small font-semibold text-[var(--md-sys-color-on-surface)]">
                      Endereço de Entrega
                    </span>
                  </div>
                  {selectedOrder.shipAddress ? (
                    <div className="space-y-1 pl-10">
                      <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">
                        {selectedOrder.shipAddress.firstname} {selectedOrder.shipAddress.lastname}
                      </p>
                      <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                        {selectedOrder.shipAddress.address1}
                      </p>
                      {selectedOrder.shipAddress.address2 && (
                        <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                          {selectedOrder.shipAddress.address2}
                        </p>
                      )}
                      <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                        {selectedOrder.shipAddress.city} - {selectedOrder.shipAddress.stateCode}
                      </p>
                      <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] font-mono">
                        CEP: {selectedOrder.shipAddress.zipcode}
                      </p>
                      {selectedOrder.shipAddress.phone && (
                        <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] mt-2">
                          📞 {selectedOrder.shipAddress.phone}
                        </p>
                      )}
                    </div>
                  ) : selectedOrder.isDigitalOnly ? (
                    <div className="pl-10">
                      <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                        Produto digital - entrega por email
                      </p>
                      {selectedOrder.digitalDeliveryEmail && (
                        <p className="m3-body-small text-[var(--md-sys-color-primary)] mt-2 font-medium">
                          📧 {selectedOrder.digitalDeliveryEmail}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] pl-10">
                      Endereço não informado
                    </p>
                  )}
                </div>
              </div>

              {/* Tracking */}
              <div className="m3-shape-large bg-[var(--md-sys-color-surface-container)] p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--md-sys-color-tertiary-container)]">
                    <Truck className="h-4 w-4 text-[var(--md-sys-color-on-tertiary-container)]" />
                  </div>
                  <span className="m3-title-small font-semibold text-[var(--md-sys-color-on-surface)]">
                    Rastreamento
                  </span>
                </div>
                  <div className="pl-10">
                    {(() => {
                      const orderState = selectedOrder.state || selectedOrder.status || "pending"
                      const status = mapOrderStateToStatus(orderState) as OrderStatus
                      const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
                      return (
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3",
                          config.bgColor
                        )}>
                          {config.icon}
                          <span className={cn(
                            "m3-label-medium font-medium",
                            config.color
                          )}>
                            {config.label}
                          </span>
                        </div>
                      )
                    })()}
                  {selectedOrder.trackingNumber && (
                    <div className="mt-2">
                      <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] mb-1">Código de rastreio:</p>
                      <p className="m3-body-medium font-mono text-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)]/30 px-3 py-2 rounded-lg">
                        {selectedOrder.trackingNumber}
                      </p>
                    </div>
                  )}
                  {selectedOrder.completedAt && (
                    <div className="mt-3 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/30">
                      <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)]">Concluído em</p>
                      <p className="m3-body-small text-[var(--md-sys-color-on-surface)] mt-1">
                        {formatDateTime(selectedOrder.completedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="m3-shape-large bg-[var(--md-sys-color-surface-container)] overflow-hidden">
                <div className="p-4 border-b border-[var(--md-sys-color-outline-variant)]/30">
                  <span className="m3-title-small font-semibold text-[var(--md-sys-color-on-surface)]">
                    Itens do Pedido
                  </span>
                </div>
                <div className="divide-y divide-[var(--md-sys-color-outline-variant)]/30">
                  {selectedOrder.lineItems?.map((item: LineItem, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4">
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-[var(--md-sys-color-surface-container-high)] shrink-0">
                        <img
                          src={getProductImage(item.productId) || "/placeholder.svg"}
                          alt={getProductName(item.productId, item.name)}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)] truncate">
                          {getProductName(item.productId, item.name)}
                        </p>
                        <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className="m3-body-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                        {selectedOrder.paidWithPoints 
                          ? `${((item.total || 0) / (selectedOrder.total || 1) * (selectedOrder.paidWithPoints || 0)).toFixed(0)} ${currencyName}`
                          : `R$ ${(item.total || 0).toFixed(2)}`}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-[var(--md-sys-color-primary-container)]/30">
                  <span className="m3-title-medium font-bold text-[var(--md-sys-color-on-surface)]">Total</span>
                  {selectedOrder.paidWithPoints ? (
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-[var(--md-sys-color-primary)]" />
                      <span className="m3-headline-small font-bold text-[var(--md-sys-color-primary)]">
                        {(selectedOrder.paidWithPoints || 0).toLocaleString("pt-BR")} {currencyName}
                      </span>
                    </div>
                  ) : (
                    <span className="m3-headline-small font-bold text-[var(--md-sys-color-primary)]">
                      R$ {(selectedOrder.total || 0).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </DialogContent>
            <DialogActions sx={{ 
              p: 3, 
              bgcolor: 'var(--md-sys-color-surface-container-high)',
            }}>
              <Button 
                variant="outline"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full px-6 border-[var(--md-sys-color-outline)]"
              >
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </PageContainer>
  )
}
