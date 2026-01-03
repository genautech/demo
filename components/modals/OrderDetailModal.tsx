"use client"

import { motion } from "framer-motion"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  Copy,
  Calendar,
} from "lucide-react"
import { 
  type Order, 
  type LineItem, 
  getCurrencyName, 
  getCompanyProductById, 
  getProductById, 
  getUserById,
  type OrderStatus,
} from "@/lib/storage"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface OrderDetailModalProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId?: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
  processing: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  shipped: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
  in_transit: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  delivered: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  cancelled: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
  complete: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  returned: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700",
  scheduled: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  processing: <Package className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  in_transit: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle2 className="h-4 w-4" />,
  complete: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <Clock className="h-4 w-4" />,
  returned: <Package className="h-4 w-4" />,
  scheduled: <Calendar className="h-4 w-4" />,
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  in_transit: "Em Trânsito",
  delivered: "Entregue",
  complete: "Concluído",
  cancelled: "Cancelado",
  returned: "Devolvido",
  scheduled: "Agendado",
}

export function OrderDetailModal({
  order,
  open,
  onOpenChange,
  companyId = "company_1",
}: OrderDetailModalProps) {
  if (!order) return null

  const orderUser = order.userId ? getUserById(order.userId) : null
  const userName = orderUser 
    ? `${orderUser.firstName} ${orderUser.lastName}`.trim() 
    : order.shipAddress?.firstname && order.shipAddress?.lastname 
      ? `${order.shipAddress.firstname} ${order.shipAddress.lastname}`.trim()
      : "Cliente"
  const userEmail = orderUser?.email || order.email || "N/A"

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch {
      return "-"
    }
  }

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleString("pt-BR")
    } catch {
      return "-"
    }
  }

  const getProductImage = (productId: string) => {
    if (productId.startsWith("cp_")) {
      const companyProduct = getCompanyProductById(productId)
      if (companyProduct?.images?.[0]) return companyProduct.images[0]
    }
    const product = getProductById(productId)
    return product?.image || product?.images?.[0] || "/placeholder.svg"
  }

  const getProductName = (productId: string, fallbackName: string) => {
    if (productId.startsWith("cp_")) {
      const companyProduct = getCompanyProductById(productId)
      if (companyProduct?.name) return companyProduct.name
    }
    const product = getProductById(productId)
    return product?.name || fallbackName
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copiado para a área de transferência")
  }

  const orderStatus = order.state || order.status || "pending"
  const timeline = [
    { status: "pending", label: "Pedido Criado", done: true },
    { status: "processing", label: "Processando", done: ["processing", "shipped", "in_transit", "delivered", "complete"].includes(orderStatus) },
    { status: "shipped", label: "Enviado", done: ["shipped", "in_transit", "delivered", "complete"].includes(orderStatus) || order.shipment?.status === "shipped" },
    { status: "delivered", label: "Entregue", done: orderStatus === "delivered" || orderStatus === "complete" || order.shipment?.status === "delivered" },
  ]
  
  const progressValue = timeline.filter(s => s.done).length / timeline.length * 100

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Pedido ${order.number}`}
      description={`Realizado em ${formatDateTime(order.createdAt)}`}
      maxWidth="2xl"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {order.trackingNumber && (
            <Button onClick={() => copyToClipboard(order.trackingNumber || "")}>
              <Copy className="h-4 w-4 mr-2" /> Copiar Rastreio
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status e Progresso */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <Badge className={cn("px-3 py-1.5 border", STATUS_COLORS[orderStatus] || STATUS_COLORS.pending)}>
              <span className="flex items-center gap-2">
                {STATUS_ICONS[orderStatus] || STATUS_ICONS.pending}
                {STATUS_LABELS[orderStatus] || orderStatus}
              </span>
            </Badge>
            {order.shipment?.status && (
              <Badge variant="outline" className="px-3 py-1.5">
                <Truck className="h-3.5 w-3.5 mr-2" />
                {order.shipment.status}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso do pedido</span>
              <span>{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </motion.div>

        {/* Grid de Informações */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Cliente */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <User className="h-4 w-4" /> Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={orderUser?.avatar} alt={userName} />
                    <AvatarFallback>
                      {userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 shrink-0" /> {userEmail}
                    </p>
                    {order.shipAddress?.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 shrink-0" /> {order.shipAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Endereço */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shipAddress ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.shipAddress.address1}</p>
                    {order.shipAddress.address2 && (
                      <p className="text-muted-foreground">{order.shipAddress.address2}</p>
                    )}
                    <p className="text-muted-foreground">
                      {order.shipAddress.city} - {order.shipAddress.stateCode}
                    </p>
                    <p className="text-muted-foreground">CEP: {order.shipAddress.zipcode}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Endereço não informado</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Itens do Pedido */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Itens do Pedido ({order.lineItems?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {(order.lineItems || order.items || []).map((item: LineItem, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.05 }}
                    className="flex items-center gap-4 p-4"
                  >
                    <div className="h-14 w-14 rounded-lg border overflow-hidden bg-muted shrink-0">
                      <img
                        src={getProductImage(item.productId) || "/placeholder.svg"}
                        alt={getProductName(item.productId, item.name)}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {getProductName(item.productId, item.name)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x • SKU: {item.sku || "N/A"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">
                        {(item.total || item.price * item.quantity || 0).toLocaleString("pt-BR")}{" "}
                        <span className="text-[10px] uppercase">{getCurrencyName(companyId, true)}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Total */}
              <div className="bg-muted/30 p-4 flex justify-between items-center border-t">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {(order.paidWithPoints || order.totalPoints || order.total || 0).toLocaleString("pt-BR")}{" "}
                  <span className="text-xs uppercase">{getCurrencyName(companyId, true)}</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rastreamento */}
        {order.trackingNumber && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Código de Rastreio</p>
                    <p className="font-mono text-sm text-muted-foreground">{order.trackingNumber}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(order.trackingNumber || "")}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </ResponsiveModal>
  )
}
