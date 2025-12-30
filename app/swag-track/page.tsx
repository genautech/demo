"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Copy,
  Truck,
  Package,
  RefreshCw,
  FileDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  Hash,
  ShoppingBag,
  X,
  Filter,
  Calendar,
  CalendarCheck,
  Info,
} from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-"

  if (dateStr.includes("/")) {
    return dateStr
  }

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleDateString("pt-BR")
  } catch {
    return "-"
  }
}

function getUserAvatar(userId: string, name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}-${encodeURIComponent(name)}`
}

export default function SwagTrackPage() {
  const [searchEmail, setSearchEmail] = useState("")
  const [searchOrder, setSearchOrder] = useState("")
  const [searchProduct, setSearchProduct] = useState("")
  const [status, setStatus] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    ...(searchEmail && { email: searchEmail }),
    ...(searchOrder && { orderNumber: searchOrder }),
    ...(searchProduct && { product: searchProduct }),
    ...(status && { status }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  })

  const { data, isLoading, mutate } = useSWR(`/api/orders?${queryParams}`, fetcher, {
    refreshInterval: 60000,
  })

  const orders = data?.orders || []
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 }
  const meta = data?.meta || {}

  const statusStats = {
    total: orders.length,
    pendente: orders.filter((o: any) => o.status === "pending" || o.status === "pendente").length,
    processando: orders.filter((o: any) => o.status === "processing" || o.status === "processando").length,
    enviado: orders.filter((o: any) => o.status === "shipped" || o.status === "enviado").length,
    emTransito: orders.filter((o: any) => o.status === "in_transit" || o.status === "em_transito").length,
    entregue: orders.filter((o: any) => o.status === "delivered" || o.status === "entregue").length,
    cancelado: orders.filter((o: any) => o.status === "cancelled" || o.status === "cancelado").length,
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearFilters = () => {
    setSearchEmail("")
    setSearchOrder("")
    setSearchProduct("")
    setStatus("")
    setDateFrom("")
    setDateTo("")
    setPage(1)
  }

  const hasActiveFilters = searchEmail || searchOrder || searchProduct || status || dateFrom || dateTo

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("entreg") || s === "delivered") {
      return <Badge className="bg-green-600 hover:bg-green-700">Entregue</Badge>
    }
    if (s.includes("enviad") || s.includes("trânsito") || s === "shipped" || s === "in_transit") {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Em trânsito</Badge>
    }
    if (s.includes("cancel") || s === "cancelled") {
      return <Badge variant="destructive">Cancelado</Badge>
    }
    return <Badge variant="secondary">{status || "Pendente"}</Badge>
  }

  const exportToCSV = () => {
    if (!orders.length) return

    const headers = ["Pedido", "Cliente", "Email", "Rastreio", "Status", "Data Pedido", "Data Envio"]
    const rows = orders.map((o: any) => [
      o.numero,
      o.cliente,
      o.email,
      o.codigoRastreio || "",
      o.status || "Pendente",
      formatDate(o.dataPedido),
      formatDate(o.dataEnvio),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "swag-track.csv"
    a.click()
  }

  const trackingStats = [
    {
      label: "Total",
      value: pagination.total || 0,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Entregues",
      value: statusStats.entregue || 0,
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      label: "Em Trânsito",
      value: (statusStats.emTransito || 0) + (statusStats.enviado || 0),
      icon: Truck,
      color: "bg-amber-500",
    },
    {
      label: "Pendentes",
      value: (statusStats.pendente || 0) + (statusStats.processando || 0),
      icon: Clock,
      color: "bg-gray-500",
    },
  ]

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Swag Track</h1>
            <p className="mt-1 text-muted-foreground">Rastreamento de envios e pedidos</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" className="gap-2 bg-transparent">
              <FileDown className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Button onClick={() => mutate()} variant="outline" className="gap-2">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trackingStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.color)}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{isLoading ? "-" : stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Aguardando integração:</strong> Configure a API do Spree Commerce para carregar os dados de
            rastreamento. Pedidos exibidos: {pagination.total || 0} {meta.fromCache && "(cache)"}
          </AlertDescription>
        </Alert>

        {meta.errors && meta.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {meta.errors.map((err: string, i: number) => (
                <p key={i} className="text-sm">
                  {err}
                </p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Filter inputs */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar por email..."
                    value={searchEmail}
                    onChange={(e) => {
                      setSearchEmail(e.target.value)
                      setPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar por nº pedido..."
                    value={searchOrder}
                    onChange={(e) => {
                      setSearchOrder(e.target.value)
                      setPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <ShoppingBag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar por produto..."
                    value={searchProduct}
                    onChange={(e) => {
                      setSearchProduct(e.target.value)
                      setPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="Data inicial..."
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value)
                      setPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <CalendarCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="Data final..."
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value)
                      setPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value === "all" ? "" : value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="in_transit">Em trânsito</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active filters and clear button */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                  {searchEmail && (
                    <Badge variant="secondary" className="gap-1">
                      Email: {searchEmail}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchEmail("")} />
                    </Badge>
                  )}
                  {searchOrder && (
                    <Badge variant="secondary" className="gap-1">
                      Pedido: {searchOrder}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchOrder("")} />
                    </Badge>
                  )}
                  {searchProduct && (
                    <Badge variant="secondary" className="gap-1">
                      Produto: {searchProduct}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchProduct("")} />
                    </Badge>
                  )}
                  {status && (
                    <Badge variant="secondary" className="gap-1">
                      Status: {status}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setStatus("")} />
                    </Badge>
                  )}
                  {dateFrom && (
                    <Badge variant="secondary" className="gap-1">
                      De: {dateFrom}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFrom("")} />
                    </Badge>
                  )}
                  {dateTo && (
                    <Badge variant="secondary" className="gap-1">
                      Até: {dateTo}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setDateTo("")} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
                    Limpar todos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Truck className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium">Nenhum pedido encontrado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Configure a integração com Spree Commerce para carregar os pedidos
                </p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Limpar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden lg:table-cell">Email</TableHead>
                      <TableHead>Rastreio</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Data Pedido</TableHead>
                      <TableHead className="hidden md:table-cell">Data Envio</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id} className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        <TableCell>
                          <span className="font-medium">{order.numero}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={getUserAvatar(order.userId || order.id, order.cliente || "Usuario")}
                              alt={order.cliente}
                              className="h-8 w-8 rounded-full border-2 border-border"
                            />
                            <span className="font-medium">{order.cliente || "Cliente"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-muted-foreground">{order.email || "email@empresa.com.br"}</span>
                        </TableCell>
                        <TableCell>
                          {order.codigoRastreio || order.trackingNumber ? (
                            <div className="flex items-center gap-2">
                              <code className="rounded bg-muted px-2 py-1 text-xs">
                                {(order.codigoRastreio || order.trackingNumber || "").length > 15
                                  ? `${(order.codigoRastreio || order.trackingNumber || "").slice(0, 15)}...`
                                  : order.codigoRastreio || order.trackingNumber}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(order.codigoRastreio || order.trackingNumber, order.id)
                                }}
                              >
                                {copiedId === order.id ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Aguardando envio</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status || order.state)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(order.dataPedido || order.createdAt)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(order.dataEnvio || order.shippedAt)}
                        </TableCell>
                        <TableCell>
                          {(order.urlRastreio || order.trackingUrl) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(order.urlRastreio || order.trackingUrl, "_blank")
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          {pagination.totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {orders.length} de {pagination.total || 0} pedidos
                </p>
                <Select
                  value={perPage.toString()}
                  onValueChange={(v) => {
                    setPerPage(Number(v))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Página {page} de {pagination.totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= (pagination.totalPages || 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(pagination.totalPages || 1)}
                  disabled={page >= (pagination.totalPages || 1)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido #{selectedOrder?.numero}</DialogTitle>
              <DialogDescription>Informações completas do pedido e rastreamento</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-medium">Cliente</h4>
                    <div className="flex items-center gap-3">
                      <img
                        src={getUserAvatar(
                          selectedOrder.userId || selectedOrder.id,
                          selectedOrder.cliente || "Usuario",
                        )}
                        alt={selectedOrder.cliente}
                        className="h-12 w-12 rounded-full border-2 border-border"
                      />
                      <div>
                        <p className="font-medium">{selectedOrder.cliente || "Cliente"}</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.email || "email@empresa.com.br"}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Status</h4>
                    {getStatusBadge(selectedOrder.status || selectedOrder.state)}
                    {selectedOrder.carrier && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <Truck className="mr-1 inline h-4 w-4" />
                        Transportadora: {selectedOrder.carrier}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-medium">Data do Pedido</h4>
                    <p>{formatDate(selectedOrder.dataPedido || selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-medium">Data de Envio</h4>
                    <p>{formatDate(selectedOrder.dataEnvio || selectedOrder.shippedAt)}</p>
                  </div>
                </div>

                {selectedOrder.deliveredAt && (
                  <div>
                    <h4 className="mb-2 font-medium">Data de Entrega</h4>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="font-medium">{formatDate(selectedOrder.deliveredAt)}</p>
                    </div>
                  </div>
                )}

                {selectedOrder.shipAddress && (
                  <div>
                    <h4 className="mb-2 font-medium">Endereço de Entrega</h4>
                    <div className="rounded-lg border p-4">
                      <p className="font-medium">
                        {selectedOrder.shipAddress.firstname} {selectedOrder.shipAddress.lastname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.shipAddress.address1}
                        {selectedOrder.shipAddress.address2 && `, ${selectedOrder.shipAddress.address2}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.shipAddress.city} - {selectedOrder.shipAddress.stateCode}
                      </p>
                      <p className="text-sm text-muted-foreground">CEP: {selectedOrder.shipAddress.zipcode}</p>
                      {selectedOrder.shipAddress.phone && (
                        <p className="text-sm text-muted-foreground">Tel: {selectedOrder.shipAddress.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {(selectedOrder.codigoRastreio || selectedOrder.trackingNumber) && (
                  <div>
                    <h4 className="mb-2 font-medium">Código de Rastreio</h4>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-3 py-2">
                        {selectedOrder.codigoRastreio || selectedOrder.trackingNumber}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(selectedOrder.codigoRastreio || selectedOrder.trackingNumber, "modal")
                        }
                      >
                        {copiedId === "modal" ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar
                          </>
                        )}
                      </Button>
                      {(selectedOrder.urlRastreio || selectedOrder.trackingUrl) && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={selectedOrder.urlRastreio || selectedOrder.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Rastrear
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {((selectedOrder.itens && selectedOrder.itens.length > 0) ||
                  (selectedOrder.lineItems && selectedOrder.lineItems.length > 0)) && (
                  <div>
                    <h4 className="mb-2 font-medium">Itens do Pedido</h4>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-right">Qtd</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(selectedOrder.itens || selectedOrder.lineItems || []).map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{item.descricao || item.nome || item.name || "Produto"}</TableCell>
                              <TableCell className="text-right">{item.quantidade || item.quantity || 1}</TableCell>
                              <TableCell className="text-right">
                                {(item.valor || item.price || 0).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}{" "}
                                BRTS
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {(selectedOrder.valorTotal || selectedOrder.total) && (
                  <div className="flex justify-end border-t pt-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">
                        {(selectedOrder.valorTotal || selectedOrder.total || 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        BRTS
                      </p>
                      {selectedOrder.brentsEarned && (
                        <p className="mt-1 text-sm text-green-600">+{selectedOrder.brentsEarned} BRENTS ganhos</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
