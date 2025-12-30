"use client"

import { useState, useEffect, useMemo } from "react"
import type React from "react"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Mail,
  Truck,
  RefreshCw,
  Hash,
  ShoppingBag,
  X,
  Phone,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
} from "lucide-react"
import { getOrders, type OrderStatus, updateOrderState, getUsers, getProducts } from "@/lib/storage"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "processing", label: "Processando" },
  { value: "shipped", label: "Enviado" },
  { value: "in_transit", label: "Em Trânsito" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
  { value: "returned", label: "Devolvido" },
]

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  in_transit: "bg-amber-100 text-amber-800 border-amber-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  returned: "bg-gray-100 text-gray-800 border-gray-300",
}

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  processing: <RefreshCw className="h-4 w-4" />,
  shipped: <Package className="h-4 w-4" />,
  in_transit: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  returned: <AlertCircle className="h-4 w-4" />,
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  in_transit: "Em Trânsito",
  delivered: "Entregue",
  cancelled: "Cancelado",
  returned: "Devolvido",
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [searchEmail, setSearchEmail] = useState("")
  const [searchOrder, setSearchOrder] = useState("")
  const [searchProduct, setSearchProduct] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending")

  useEffect(() => {
    loadOrders()
    loadUsers()
    loadProducts()
  }, [])

  const loadOrders = () => {
    const data = getOrders()
    setOrders(data)
  }

  const loadUsers = () => {
    const data = getUsers()
    setUsers(data)
  }

  const loadProducts = () => {
    const data = getProducts()
    setProducts(data)
  }

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesEmail = !searchEmail || (order.email || "").toLowerCase().includes(searchEmail.toLowerCase())
      const matchesOrder = !searchOrder || (order.number || "").toLowerCase().includes(searchOrder.toLowerCase())
      const matchesProduct =
        !searchProduct ||
        (order.lineItems || []).some(
          (i: any) =>
            (i.name || "").toLowerCase().includes(searchProduct.toLowerCase()) ||
            (i.sku && i.sku.toLowerCase().includes(searchProduct.toLowerCase())),
        )
      const matchesStatus = !statusFilter || order.status === statusFilter
      return matchesEmail && matchesOrder && matchesProduct && matchesStatus
    })
  }, [orders, searchEmail, searchOrder, searchProduct, statusFilter])

  // Pagination
  const total = filteredOrders.length
  const totalPages = Math.ceil(total / perPage)
  const startIndex = (page - 1) * perPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + perPage)

  // Stats
  const statusStats = useMemo(() => {
    const stats = {
      total: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      in_transit: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    }
    orders.forEach((o) => {
      if (o.status && stats[o.status] !== undefined) {
        stats[o.status]++
      }
    })
    return stats
  }, [orders])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearFilters = () => {
    setSearchEmail("")
    setSearchOrder("")
    setSearchProduct("")
    setStatusFilter("")
    setPage(1)
  }

  const hasActiveFilters = searchEmail || searchOrder || searchProduct || statusFilter

  const handleEditStatus = (order: any) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsEditStatusOpen(true)
  }

  const handleSaveStatus = () => {
    if (!selectedOrder) return
    updateOrderState(selectedOrder.id, newStatus) // Changed from updateOrderStatus to updateOrderState
    setOrders(getOrders()) // Reload orders after update
    setIsEditStatusOpen(false)
    // Update selectedOrder state to reflect the change immediately
    setSelectedOrder((prevOrder) => (prevOrder ? { ...prevOrder, status: newStatus } : null))
  }

  const refresh = () => {
    setOrders(getOrders())
    setUsers(getUsers())
    setProducts(getProducts())
  }

  const getUserAvatar = (email: string) => {
    const user = users.find((u) => u.email === email)
    return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
  }

  const getProductImage = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.image || "/placeholder.svg"
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

  return (
    <AppShell>
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
            <p className="mt-1 text-muted-foreground">Gerenciar pedidos da loja</p>
          </div>
          <Button onClick={refresh} variant="outline" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards - Improved */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</p>
                  <p className="text-2xl font-bold mt-1">{statusStats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Package className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Pendentes</p>
                  <p className="text-2xl font-bold mt-1 text-yellow-700">{statusStats.pending}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Processando</p>
                  <p className="text-2xl font-bold mt-1 text-blue-700">{statusStats.processing}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Enviados</p>
                  <p className="text-2xl font-bold mt-1 text-purple-700">{statusStats.shipped}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Em Trânsito</p>
                  <p className="text-2xl font-bold mt-1 text-amber-700">{statusStats.in_transit}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Entregues</p>
                  <p className="text-2xl font-bold mt-1 text-green-700">{statusStats.delivered}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Cancelados</p>
                  <p className="text-2xl font-bold mt-1 text-red-700">{statusStats.cancelled}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-200 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Improved */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email do Cliente</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por email..."
                      value={searchEmail}
                      onChange={(e) => {
                        setSearchEmail(e.target.value)
                        setPage(1)
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Número do Pedido</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nº pedido..."
                      value={searchOrder}
                      onChange={(e) => {
                        setSearchOrder(e.target.value)
                        setPage(1)
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Produto</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por produto..."
                      value={searchProduct}
                      onChange={(e) => {
                        setSearchProduct(e.target.value)
                        setPage(1)
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value === "all" ? "" : value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            {STATUS_ICONS[opt.value]}
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <span className="text-sm font-medium">Filtros ativos:</span>
                  {searchEmail && (
                    <Badge variant="secondary" className="gap-1 pl-2">
                      <Mail className="h-3 w-3" />
                      {searchEmail}
                      <button className="ml-1 hover:bg-muted rounded p-0.5" onClick={() => setSearchEmail("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {searchOrder && (
                    <Badge variant="secondary" className="gap-1 pl-2">
                      <Hash className="h-3 w-3" />
                      {searchOrder}
                      <button className="ml-1 hover:bg-muted rounded p-0.5" onClick={() => setSearchOrder("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {searchProduct && (
                    <Badge variant="secondary" className="gap-1 pl-2">
                      <ShoppingBag className="h-3 w-3" />
                      {searchProduct}
                      <button className="ml-1 hover:bg-muted rounded p-0.5" onClick={() => setSearchProduct("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {statusFilter && (
                    <Badge variant="secondary" className="gap-1 pl-2">
                      {STATUS_ICONS[statusFilter as OrderStatus]}
                      {STATUS_LABELS[statusFilter as OrderStatus]}
                      <button className="ml-1 hover:bg-muted rounded p-0.5" onClick={() => setStatusFilter("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-destructive hover:text-destructive"
                  >
                    Limpar todos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={getUserAvatar(order.email) || "/placeholder.svg"}
                          alt={order.shipAddress?.firstname || "Cliente"}
                          className="h-10 w-10 rounded-full border-2 border-primary/10"
                        />
                        <div>
                          <p className="font-medium">
                            {order.shipAddress?.firstname} {order.shipAddress?.lastname}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.number}</p>
                        <p className="text-xs text-muted-foreground">{order.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {order.lineItems?.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden">
                              <img
                                src={getProductImage(item.productId) || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="text-sm">
                          {order.lineItems?.length || 0} {order.lineItems?.length === 1 ? "item" : "itens"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${STATUS_COLORS[order.status]} border px-3 py-1`}>
                        <span className="flex items-center gap-2">
                          {STATUS_ICONS[order.status]}
                          {STATUS_LABELS[order.status]}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{order.total.toFixed(2)} BRTS</p>
                      {order.brentsEarned > 0 && <p className="text-xs text-green-600">+{order.brentsEarned} BRENTS</p>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>

          {/* Pagination - Improved */}
          {totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                  <span className="font-medium">{Math.min(startIndex + perPage, total)}</span> de{" "}
                  <span className="font-medium">{total}</span> pedidos
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Por página:</span>
                  <Select
                    value={perPage.toString()}
                    onValueChange={(value) => {
                      setPerPage(Number(value))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="h-8 px-2"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center px-3 text-sm font-medium">
                  {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="h-8 px-2"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder && !isEditStatusOpen} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">Detalhes do Pedido {selectedOrder.number}</DialogTitle>
                  <DialogDescription>{selectedOrder.email}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6">
                  {/* Customer info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Dados do Cliente
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getUserAvatar(selectedOrder.email) || "/placeholder.svg"}
                            alt={selectedOrder.shipAddress?.firstname || "Cliente"}
                            className="h-12 w-12 rounded-full border-2 border-primary/10"
                          />
                          <div>
                            <p className="font-medium">
                              {selectedOrder.shipAddress?.firstname} {selectedOrder.shipAddress?.lastname}
                            </p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                          </div>
                        </div>
                        {selectedOrder.shipAddress?.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">{selectedOrder.shipAddress.phone}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Endereço de Entrega
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedOrder.shipAddress ? (
                          <div className="text-sm space-y-1">
                            <p>{selectedOrder.shipAddress.address1}</p>
                            {selectedOrder.shipAddress.address2 && <p>{selectedOrder.shipAddress.address2}</p>}
                            <p>
                              {selectedOrder.shipAddress.city} - {selectedOrder.shipAddress.stateCode}
                            </p>
                            <p>CEP: {selectedOrder.shipAddress.zipcode}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Endereço não disponível</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Products */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Itens do Pedido ({selectedOrder.lineItems?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedOrder.lineItems?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
                            <div className="h-16 w-16 rounded-md border overflow-hidden flex-shrink-0">
                              <img
                                src={getProductImage(item.productId) || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                              <p className="text-sm">
                                {item.quantity}x {item.price.toFixed(2)} BRTS
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{item.total.toFixed(2)} BRTS</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/5 p-4 border border-primary/20">
                        <span className="font-semibold flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Total do Pedido
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {(selectedOrder.total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRTS
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping info */}
                  {selectedOrder.trackingNumber && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Informações de Envio
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Transportadora:</span>
                          <span className="font-medium">{selectedOrder.carrier || "Não informada"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Código de rastreio:</span>
                          <span className="font-mono text-sm">{selectedOrder.trackingNumber}</span>
                        </div>
                        {selectedOrder.trackingUrl && (
                          <Button variant="outline" className="w-full bg-transparent" asChild>
                            <a href={selectedOrder.trackingUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Rastrear Pedido
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Dates */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Data do Pedido</p>
                        <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
                      </div>
                    </div>
                    {selectedOrder.shippedAt && (
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Data de Envio</p>
                          <p className="font-medium">{formatDateTime(selectedOrder.shippedAt)}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.deliveredAt && (
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Data de Entrega</p>
                          <p className="font-medium">{formatDateTime(selectedOrder.deliveredAt)}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.canceledAt && (
                      <div className="flex items-center gap-3 rounded-lg border p-4 border-destructive/50">
                        <X className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="text-xs text-muted-foreground">Data de Cancelamento</p>
                          <p className="font-medium">{formatDateTime(selectedOrder.canceledAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={isEditStatusOpen} onOpenChange={setIsEditStatusOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Status do Pedido</DialogTitle>
              <DialogDescription>
                Pedido #{selectedOrder?.number} - {selectedOrder?.shipAddress?.firstname}{" "}
                {selectedOrder?.shipAddress?.lastname}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status Atual</label>
                <Badge className={`${STATUS_COLORS[selectedOrder?.status || "pending"]} border`}>
                  {STATUS_LABELS[selectedOrder?.status || "pending"]}
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Novo Status</label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          {STATUS_ICONS[opt.value]}
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditStatusOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveStatus}>Salvar Alteração</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
