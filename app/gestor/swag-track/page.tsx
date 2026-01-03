"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { M3Card, M3CardContent, M3CardHeader, M3CardTitle } from "@/components/ui/m3-card"
import { Input } from "@/components/ui/input"
import { M3Button } from "@/components/ui/m3-button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Label } from "@/components/ui/label"
import {
  ExternalLink,
  Copy,
  Truck,
  Package,
  RefreshCw,
  FileDown,
  CheckCircle2,
  Clock,
  Hash,
  ShoppingBag,
  Info,
  MapPin,
  Gift,
} from "lucide-react"
import Image from "next/image"
import { getCompanyProductById, getProductById, type LineItem } from "@/lib/storage"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getOrders, type Order } from "@/lib/storage"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-"
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleDateString("pt-BR")
  } catch {
    return "-"
  }
}

export default function SwagTrackPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { data, isLoading, mutate } = useSWR(`/api/orders`, fetcher)

  const orders = data?.orders || []
  
  // Get gift orders for tagging
  const giftOrders = typeof window !== "undefined" ? getOrders().filter(o => o.isGift) : []
  const giftOrderNumbers = new Set(giftOrders.map(o => o.number))
  
  const filteredOrders = orders.filter((o: Order) => {
    const matchesSearch = !searchTerm || o.number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("entreg") || s === "delivered" || s === "complete") {
      return <Badge className="bg-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/90 text-[var(--md-sys-color-on-primary)] shadow-sm">ENTREGUE</Badge>
    }
    if (s.includes("enviad") || s.includes("trânsito") || s === "shipped") {
      return <Badge className="bg-[var(--md-sys-color-secondary-container)] hover:bg-[var(--md-sys-color-secondary-container)]/90 text-[var(--md-sys-color-on-secondary-container)] shadow-sm">EM TRÂNSITO</Badge>
    }
    return <Badge className="bg-[var(--md-sys-color-tertiary-container)] hover:bg-[var(--md-sys-color-tertiary-container)]/90 text-[var(--md-sys-color-on-tertiary-container)] shadow-sm">PENDENTE</Badge>
  }

  // Stats
  const totalOrders = orders.length
  const deliveredCount = orders.filter((o: Order) => o.status === 'complete' || o.state === 'complete').length
  const shippedCount = orders.filter((o: Order) => o.status === 'shipped').length
  const pendingCount = orders.filter((o: Order) => o.status === 'pending').length

  return (
    <>
      <PageContainer className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="m3-headline-medium text-[var(--md-sys-color-on-surface)] flex items-center gap-3">
              <Truck className="h-8 w-8 text-[var(--md-sys-color-primary)]" />
              Swag Track
            </h1>
            <p className="mt-1 m3-body-medium text-[var(--md-sys-color-on-surface-variant)]">Acompanhe todos os envios e a logística de última milha.</p>
          </div>
          <M3Button onClick={() => mutate()} variant="outlined" size="md" icon={<RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />}>
            Sincronizar cubbo
          </M3Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <M3Card variant="elevated" className="overflow-hidden">
            <M3CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <M3CardTitle className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">Total</M3CardTitle>
              <div className="p-2 bg-[var(--md-sys-color-surface-container-high)] rounded-lg"><Package className="h-4 w-4 text-[var(--md-sys-color-primary)]" /></div>
            </M3CardHeader>
            <M3CardContent>
              <div className="m3-headline-small text-[var(--md-sys-color-on-surface)] font-medium">{totalOrders}</div>
            </M3CardContent>
          </M3Card>
          <M3Card variant="elevated" className="overflow-hidden">
            <M3CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <M3CardTitle className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">Entregues</M3CardTitle>
              <div className="p-2 bg-[var(--md-sys-color-primary-container)] rounded-lg"><CheckCircle2 className="h-4 w-4 text-[var(--md-sys-color-primary)]" /></div>
            </M3CardHeader>
            <M3CardContent>
              <div className="m3-headline-small text-[var(--md-sys-color-primary)] font-medium">{deliveredCount}</div>
            </M3CardContent>
          </M3Card>
          <M3Card variant="elevated" className="overflow-hidden">
            <M3CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <M3CardTitle className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">Em Trânsito</M3CardTitle>
              <div className="p-2 bg-[var(--md-sys-color-secondary-container)] rounded-lg"><Truck className="h-4 w-4 text-[var(--md-sys-color-secondary)]" /></div>
            </M3CardHeader>
            <M3CardContent>
              <div className="m3-headline-small text-[var(--md-sys-color-secondary)] font-medium">{shippedCount}</div>
            </M3CardContent>
          </M3Card>
          <M3Card variant="elevated" className="overflow-hidden">
            <M3CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <M3CardTitle className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">Pendentes</M3CardTitle>
              <div className="p-2 bg-[var(--md-sys-color-tertiary-container)] rounded-lg"><Clock className="h-4 w-4 text-[var(--md-sys-color-tertiary)]" /></div>
            </M3CardHeader>
            <M3CardContent>
              <div className="m3-headline-small text-[var(--md-sys-color-tertiary)] font-medium">{pendingCount}</div>
            </M3CardContent>
          </M3Card>
        </div>

        {/* Filters */}
        <M3Card variant="elevated">
          <M3CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)]" />
                <Input
                  placeholder="Buscar por número do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus-visible:border-[var(--md-sys-color-primary)]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-11 font-medium bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]">
                  <SelectValue placeholder="Filtrar status" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--md-sys-color-surface-container-high)] border-[var(--md-sys-color-outline-variant)]">
                  <SelectItem value="all" className="text-[var(--md-sys-color-on-surface)]">Todos os status</SelectItem>
                  <SelectItem value="pending" className="text-[var(--md-sys-color-on-surface)]">Pendente</SelectItem>
                  <SelectItem value="shipped" className="text-[var(--md-sys-color-on-surface)]">Enviado</SelectItem>
                  <SelectItem value="complete" className="text-[var(--md-sys-color-on-surface)]">Entregue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </M3CardContent>
        </M3Card>

        {/* Orders Table */}
        <M3Card variant="elevated" className="overflow-hidden">
          <M3CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="h-8 w-8 animate-spin text-[var(--md-sys-color-primary)]" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Truck className="h-12 w-12 text-[var(--md-sys-color-on-surface-variant)]/30 mb-4" />
                <p className="m3-title-medium text-[var(--md-sys-color-on-surface-variant)]">Nenhum envio encontrado</p>
                <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] mt-1">Ajuste os filtros ou aguarde novos pedidos.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Table>
                  <TableHeader className="bg-[var(--md-sys-color-surface-container-low)]">
                    <TableRow className="border-[var(--md-sys-color-outline-variant)]/50 hover:bg-transparent">
                      <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Pedido</TableHead>
                      <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Data</TableHead>
                      <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Produto</TableHead>
                      <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order: Order) => {
                      const isGift = giftOrderNumbers.has(order.number)
                      return (
                        <TableRow key={order.id} className="border-[var(--md-sys-color-outline-variant)]/30 hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">#{order.number}</span>
                              {isGift && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="border-[var(--md-sys-color-primary)]/30 bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] text-[9px] px-1.5 py-0.5">
                                      <Gift className="h-3 w-3 mr-1" />
                                      Presente
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)]">
                                    <p className="text-xs">Envio de Presente</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            <span className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">{order.lineItems?.[0]?.name || 'Brinde'}</span>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status || order.state)}</TableCell>
                          <TableCell>
                            <M3Button 
                              variant="text" 
                              size="sm" 
                              className="text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/8"
                              onClick={() => setSelectedOrder(order)}
                            >
                              Detalhes
                            </M3Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </M3CardContent>
        </M3Card>
      </PageContainer>

      {/* Order Details Modal */}
      <ResponsiveModal
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        title={
          <span className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[var(--md-sys-color-primary)]" />
            <span className="m3-title-large text-[var(--md-sys-color-on-surface)]">Pedido #{selectedOrder?.number}</span>
          </span>
        }
        description={<span className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)]">Detalhes do envio e logística de última milha.</span>}
        maxWidth="xl"
        footer={
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <M3Button variant="outlined" size="lg" className="sm:flex-1" icon={<FileDown className="h-4 w-4" />}>
              Exportar Protocolo
            </M3Button>
            <M3Button onClick={() => setSelectedOrder(null)} variant="filled" size="lg" className="sm:flex-1">
              Fechar Detalhes
            </M3Button>
          </div>
        }
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Gift Badge */}
            {giftOrderNumbers.has(selectedOrder.number) && (
              <div className="p-4 bg-[var(--md-sys-color-primary-container)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] flex items-start gap-3">
                <div className="p-2 bg-[var(--md-sys-color-primary)]/10 rounded-lg">
                  <Gift className="h-5 w-5 text-[var(--md-sys-color-primary)]" />
                </div>
                <div className="flex-1">
                  <span className="m3-label-medium text-[var(--md-sys-color-on-primary-container)] uppercase">Envio de Presente</span>
                  {selectedOrder.giftMessage && (
                    <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] italic mt-2">"{selectedOrder.giftMessage}"</p>
                  )}
                </div>
              </div>
            )}

            {/* Status & Date */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Status do Envio</Label>
                <div className="pt-1">{getStatusBadge(selectedOrder.status || selectedOrder.state)}</div>
              </div>
              <div className="space-y-2">
                <Label className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Data da Solicitação</Label>
                <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)] pt-1">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--md-sys-color-primary)]" />
                <span className="m3-label-small text-[var(--md-sys-color-on-surface)] uppercase">Destino da Entrega</span>
              </div>
              <div className="p-5 bg-[var(--md-sys-color-surface-container-low)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] space-y-1">
                <p className="m3-body-large font-medium text-[var(--md-sys-color-on-surface)]">{selectedOrder.shipAddress?.firstname} {selectedOrder.shipAddress?.lastname}</p>
                <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">{selectedOrder.shipAddress?.address1}</p>
                {selectedOrder.shipAddress?.address2 && (
                  <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">{selectedOrder.shipAddress?.address2}</p>
                )}
                <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] font-medium">{selectedOrder.shipAddress?.city} - {selectedOrder.shipAddress?.stateCode}</p>
                <p className="font-mono m3-label-small text-[var(--md-sys-color-primary)] mt-2 bg-[var(--md-sys-color-primary-container)] w-fit px-2 py-0.5 rounded">CEP: {selectedOrder.shipAddress?.zipcode}</p>
              </div>
            </div>

            {/* Package Contents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[var(--md-sys-color-primary)]" />
                  <span className="m3-label-small text-[var(--md-sys-color-on-surface)] uppercase">Conteúdo do Pacote</span>
                </div>
                <Badge variant="secondary" className="m3-label-small bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]">
                  {selectedOrder.lineItems?.length || 0} ITENS
                </Badge>
              </div>
              <div className="divide-y divide-[var(--md-sys-color-outline-variant)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl overflow-hidden bg-[var(--md-sys-color-surface-container-low)] shadow-sm">
                {selectedOrder.lineItems?.map((item: LineItem, idx: number) => {
                  const product = getCompanyProductById(item.productId) || getProductById(item.productId)
                  const productImage = product?.images?.[0] || product?.image
                  
                  return (
                    <div key={idx} className="p-4 flex items-center gap-3 text-sm group hover:bg-[var(--md-sys-color-surface-container)] transition-colors">
                      <div className="h-12 w-12 bg-[var(--md-sys-color-surface-container-high)] rounded-lg flex items-center justify-center shrink-0 border border-[var(--md-sys-color-outline-variant)] overflow-hidden">
                        {productImage ? (
                          <Image
                            src={productImage}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <ShoppingBag className="h-6 w-6 text-[var(--md-sys-color-on-surface-variant)]/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)] block">{item.name}</span>
                        <span className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] font-mono mt-0.5">{item.sku || "PROD-ITEM"}</span>
                      </div>
                      <span className="h-8 w-8 rounded-full bg-[var(--md-sys-color-surface-container-high)] flex items-center justify-center m3-label-medium font-medium text-[var(--md-sys-color-on-surface)] border border-[var(--md-sys-color-outline-variant)] shrink-0">
                        {item.quantity}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tracking Number */}
            <div className="space-y-4 pt-4 border-t border-[var(--md-sys-color-outline-variant)]">
              {selectedOrder.trackingNumber ? (
                <div className="p-5 border-2 border-dashed border-[var(--md-sys-color-outline-variant)] rounded-2xl bg-[var(--md-sys-color-surface-container-low)] flex items-center justify-between group transition-all hover:border-[var(--md-sys-color-primary)]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--md-sys-color-surface-container-high)] rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <Hash className="h-5 w-5 text-[var(--md-sys-color-primary)]" />
                    </div>
                    <div>
                      <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase mb-0.5">Código de Rastreio</p>
                      <p className="font-mono m3-headline-small font-medium text-[var(--md-sys-color-on-surface)]">{selectedOrder.trackingNumber}</p>
                    </div>
                  </div>
                  <M3Button variant="text" size="icon" className="text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/8" onClick={() => {
                    navigator.clipboard.writeText(selectedOrder.trackingNumber || "");
                    toast.success("Código copiado!");
                  }}>
                    <Copy className="h-5 w-5" />
                  </M3Button>
                </div>
              ) : (
                <div className="p-6 bg-[var(--md-sys-color-surface-container-low)] rounded-2xl border border-dashed border-[var(--md-sys-color-outline-variant)] flex flex-col items-center gap-3 text-center text-[var(--md-sys-color-on-surface-variant)]">
                  <div className="p-3 bg-[var(--md-sys-color-surface-container-high)] rounded-full shadow-sm">
                    <Info className="h-6 w-6 text-[var(--md-sys-color-on-surface-variant)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">Aguardando Postagem</p>
                    <p className="m3-body-small max-w-[200px]">O código de rastreio será gerado assim que a transportadora coletar o pacote.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </ResponsiveModal>
    </>
  )
}
