"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
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
  Zap,
  MapPin,
} from "lucide-react"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const { data, isLoading, mutate } = useSWR(`/api/orders`, fetcher)

  const orders = data?.orders || []
  
  const filteredOrders = orders.filter((o: any) => {
    const matchesSearch = !searchTerm || o.number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("entreg") || s === "delivered" || s === "complete") {
      return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px]">ENTREGUE</Badge>
    }
    if (s.includes("enviad") || s.includes("trânsito") || s === "shipped") {
      return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px]">EM TRÂNSITO</Badge>
    }
    return <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px]">PENDENTE</Badge>
  }

  return (
    <PageContainer maxWidth="6xl" className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900 flex items-center gap-3">
              <Truck className="h-8 w-8 text-emerald-600" />
              Swag Track
            </h1>
            <p className="text-emerald-600/70 font-medium">Acompanhe seus resgates e envios em tempo real.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => mutate()} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white">
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Tracking Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value={orders.length} icon={<Package className="h-4 w-4 text-emerald-600" />} />
          <StatCard title="Entregues" value={orders.filter((o: any) => o.status === 'complete').length} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} />
          <StatCard title="Em Trânsito" value={orders.filter((o: any) => o.status === 'shipped').length} icon={<Truck className="h-4 w-4 text-emerald-600" />} />
          <StatCard title="Pendentes" value={orders.filter((o: any) => o.status === 'pending').length} icon={<Clock className="h-4 w-4 text-emerald-600" />} />
        </div>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-black text-emerald-900 uppercase">Número do Pedido</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                  <Input 
                    placeholder="Ex: #12345" 
                    className="pl-10 border-emerald-100 focus-visible:ring-emerald-500 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48 space-y-2">
                <Label className="text-xs font-black text-emerald-900 uppercase">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-emerald-100 bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="complete">Entregue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader className="bg-emerald-50/20">
                  <TableRow className="border-emerald-50 hover:bg-transparent">
                    <TableHead className="text-emerald-900 font-bold uppercase text-[10px]">Pedido</TableHead>
                    <TableHead className="text-emerald-900 font-bold uppercase text-[10px]">Data</TableHead>
                    <TableHead className="text-emerald-900 font-bold uppercase text-[10px]">Produto</TableHead>
                    <TableHead className="text-emerald-900 font-bold uppercase text-[10px]">Status</TableHead>
                    <TableHead className="text-emerald-900 font-bold uppercase text-[10px] text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: any) => (
                    <TableRow key={order.id} className="border-emerald-50 hover:bg-emerald-50/10 transition-colors">
                      <TableCell className="font-bold text-emerald-900">#{order.number}</TableCell>
                      <TableCell className="text-xs text-emerald-600 font-medium">{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-xs text-emerald-900 font-bold">{order.lineItems?.[0]?.name || 'Brinde'}</TableCell>
                      <TableCell>{getStatusBadge(order.status || order.state)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-100 font-bold text-[10px] uppercase" onClick={() => setSelectedOrder(order)}>
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <Truck className="h-12 w-12 text-emerald-100 mx-auto" />
                <p className="text-emerald-900 font-bold">Nenhum envio encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        <ResponsiveModal
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
          title={
            selectedOrder ? (
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-emerald-600" />
                <span>Pedido #{selectedOrder.number}</span>
              </div>
            ) : undefined
          }
          description={selectedOrder ? "Acompanhe o status e a entrega do seu resgate." : undefined}
          maxWidth="lg"
          footer={
            selectedOrder ? (
              <Button onClick={() => setSelectedOrder(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full font-black h-12 rounded-xl shadow-lg shadow-emerald-600/20 uppercase tracking-wider">
                Fechar Detalhes
              </Button>
            ) : undefined
          }
        >
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Status Atual</Label>
                  <div className="pt-1">{getStatusBadge(selectedOrder.status || selectedOrder.state)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Data do Resgate</Label>
                  <p className="text-sm font-bold text-emerald-950 pt-1">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-black uppercase text-emerald-900 tracking-widest">Endereço de Entrega</span>
                </div>
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 space-y-1">
                  <p className="font-bold text-emerald-950">{selectedOrder.shipAddress?.firstname} {selectedOrder.shipAddress?.lastname}</p>
                  <p className="text-sm text-emerald-800/80">{selectedOrder.shipAddress?.address1}</p>
                  {selectedOrder.shipAddress?.address2 && (
                    <p className="text-sm text-emerald-800/80">{selectedOrder.shipAddress?.address2}</p>
                  )}
                  <p className="text-sm text-emerald-800/80 font-medium">{selectedOrder.shipAddress?.city} - {selectedOrder.shipAddress?.stateCode}</p>
                  <p className="font-mono text-[10px] text-emerald-600 mt-2 bg-emerald-100/50 w-fit px-2 py-0.5 rounded">CEP: {selectedOrder.shipAddress?.zipcode}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px] font-black uppercase text-emerald-900 tracking-widest">Itens no Pacote</span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px] font-bold">
                    {selectedOrder.lineItems?.length || 0} ITENS
                  </Badge>
                </div>
                <div className="divide-y divide-emerald-50 border border-emerald-50 rounded-2xl overflow-hidden bg-card shadow-sm">
                  {selectedOrder.lineItems?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 flex items-center justify-between text-sm group hover:bg-emerald-50/30 transition-colors">
                      <span className="font-bold text-emerald-950">{item.name}</span>
                      <span className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center font-bold text-emerald-700 border border-emerald-100">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-emerald-50">
                {selectedOrder.trackingNumber ? (
                  <div className="p-5 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30 flex items-center justify-between group transition-all hover:border-emerald-400">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                        <Hash className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-0.5">Código de Rastreio</p>
                        <p className="font-mono font-bold text-emerald-950 text-lg">{selectedOrder.trackingNumber}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-emerald-600 hover:bg-emerald-100 rounded-xl" onClick={() => {
                      navigator.clipboard.writeText(selectedOrder.trackingNumber);
                      toast.success("Código copiado!");
                    }}>
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-3 text-center text-slate-500">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <Info className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700">Aguardando Envio</p>
                      <p className="text-xs max-w-[200px]">Seu pacote está sendo preparado. O rastreio estará disponível em breve.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </ResponsiveModal>
    </PageContainer>
  )
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-emerald-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-emerald-900">{value}</div>
      </CardContent>
    </Card>
  )
}
