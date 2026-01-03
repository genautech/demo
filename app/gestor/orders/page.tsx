"use client"

import { useDemoState } from "@/hooks/use-demo-state"
import { useOrders } from "@/hooks/use-console-data"
import { PageContainer } from "@/components/page-container"
import { M3Card, M3CardContent, M3CardHeader, M3CardTitle } from "@/components/ui/m3-card"
import { M3Button } from "@/components/ui/m3-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Search, Filter, ArrowRight, Package, Truck, CheckCircle2, Download, Eye, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { getCurrencyName, type Order } from "@/lib/storage"
import { OrderDetailModal } from "@/components/modals"

export default function OrdersPage() {
  const { env } = useDemoState()
  const { orders, isLoading } = useOrders(env)
  const [search, setSearch] = useState("")
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const router = useRouter()

  useEffect(() => {
    const authData = typeof window !== 'undefined' ? localStorage.getItem("yoobe_auth") : null
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Failed to parse auth data:", error)
        }
      }
    }
  }, [])

  const filteredOrders = orders.filter(o => 
    o.number.toLowerCase().includes(search.toLowerCase()) || 
    o.email.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete": return <Badge className="bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-none shadow-sm">Concluído</Badge>
      case "pending": return <Badge className="bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] border-none shadow-sm">Pendente</Badge>
      case "canceled": return <Badge className="bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] border-none shadow-sm">Cancelado</Badge>
      default: return <Badge className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)]">{status}</Badge>
    }
  }

  const getShipmentBadge = (status?: string) => {
    if (!status) return null
    switch (status) {
      case "delivered": return <Badge className="text-[10px] gap-1 bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] border-none"><CheckCircle2 className="h-3 w-3" /> Entregue</Badge>
      case "shipped": return <Badge className="text-[10px] gap-1 bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] border-none"><Truck className="h-3 w-3" /> Enviado</Badge>
      case "packed": return <Badge className="text-[10px] gap-1 bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] border-none"><Package className="h-3 w-3" /> Embalado</Badge>
      default: return <Badge className="text-[10px] gap-1 bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)]">{status}</Badge>
    }
  }

  const handleExportCSV = () => {
    const headers = ["Pedido", "Status", "Cliente", "Email", "Itens", "Valor Total", "Data"]
    const rows = filteredOrders.map(order => [
      order.number,
      order.state,
      `${order.shipAddress?.firstname || ""} ${order.shipAddress?.lastname || ""}`.trim(),
      order.email || "",
      order.lineItems.length.toString(),
      order.total.toFixed(2),
      new Date(order.createdAt).toLocaleDateString("pt-BR")
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `pedidos_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <PageContainer className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m3-headline-medium text-[var(--md-sys-color-on-surface)] flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-[var(--md-sys-color-primary)]" />
            Pedidos & Resgates
          </h1>
          <p className="mt-1 m3-body-medium text-[var(--md-sys-color-on-surface-variant)]">
            Acompanhe todos os resgates realizados no ambiente {env}.
          </p>
        </div>
        <div className="flex gap-2">
          <M3Button variant="outlined" size="md" icon={<Download className="h-4 w-4" />} onClick={handleExportCSV}>
            Exportar CSV
          </M3Button>
          <M3Button variant="tonal" size="md" icon={<Filter className="h-4 w-4" />}>
            Filtros
          </M3Button>
        </div>
      </div>

      {/* Search */}
      <M3Card variant="elevated">
        <M3CardContent className="p-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" />
            <Input 
              placeholder="Buscar por número do pedido ou e-mail..." 
              className="pl-10 h-11 bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus-visible:border-[var(--md-sys-color-primary)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
          ) : (
            <Table>
              <TableHeader className="bg-[var(--md-sys-color-surface-container-low)]">
                <TableRow className="border-[var(--md-sys-color-outline-variant)]/50 hover:bg-transparent">
                  <TableHead className="w-[120px] m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Pedido</TableHead>
                  <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Status</TableHead>
                  <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Itens</TableHead>
                  <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Valor</TableHead>
                  <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Cliente</TableHead>
                  <TableHead className="text-right m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-[var(--md-sys-color-on-surface-variant)]">
                        <ClipboardList className="h-12 w-12 text-[var(--md-sys-color-on-surface-variant)]/30" />
                        <p className="m3-title-medium">Nenhum pedido encontrado.</p>
                        <p className="m3-body-small">Ajuste os filtros ou aguarde novos pedidos.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="group border-[var(--md-sys-color-outline-variant)]/30 hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors">
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">{order.number}</span>
                          <span className="m3-label-small text-[var(--md-sys-color-on-surface-variant)]">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5 items-start">
                          {getStatusBadge(order.state)}
                          {getShipmentBadge(order.shipment?.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="m3-body-small text-[var(--md-sys-color-on-surface)]">
                          <span className="font-medium">{order.lineItems?.[0]?.name || order.items?.[0]?.name}</span>
                          {(order.lineItems?.length || order.items?.length || 0) > 1 && (
                            <span className="text-[var(--md-sys-color-on-surface-variant)] ml-1">+{ (order.lineItems?.length || order.items?.length || 0) - 1 } mais</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-baseline gap-1">
                          <span className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">{order.totalPoints || order.paidWithPoints || 0}</span>
                          <span className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">{getCurrencyName(companyId, true)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] max-w-[150px] truncate">
                        {order.email}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <M3Button 
                            variant="text" 
                            size="icon-sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </M3Button>
                          <M3Button 
                            variant="text" 
                            size="sm"
                            onClick={() => router.push(`/gestor/orders/${order.id}`)}
                            trailingIcon={<ArrowRight className="h-3.5 w-3.5" />}
                          >
                            Detalhes
                          </M3Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </M3CardContent>
      </M3Card>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        companyId={companyId}
      />
    </PageContainer>
  )
}

