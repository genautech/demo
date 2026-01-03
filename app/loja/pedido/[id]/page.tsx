"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Circle, 
  Hash, 
  Copy, 
  ArrowLeft,
  Gift,
  Calendar,
  CreditCard,
  QrCode,
  Coins,
  Clock,
} from "lucide-react"
import { 
  getOrderById, 
  getUserById, 
  getCurrencyName, 
  getDemoPaymentByOrderId,
  type Order, 
  type User,
  type DemoPayment,
} from "@/lib/storage"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Mock tracking events generator (similar to gestor page)
const generateMockTrackingEvents = (order: Order) => {
  const events = []
  const now = new Date()
  const orderDate = new Date(order.createdAt)
  
  // Event 1: Order created
  events.push({
    status: "created",
    label: "Pedido Criado",
    description: "Seu pedido foi confirmado",
    date: orderDate.toISOString(),
    completed: true,
  })

  // Event 2: Processing (1 day later)
  const processingDate = new Date(orderDate)
  processingDate.setDate(processingDate.getDate() + 1)
  events.push({
    status: "processing",
    label: "Em Processamento",
    description: "Preparando o envio",
    date: processingDate.toISOString(),
    completed: processingDate <= now,
  })

  // Event 3: Shipped (2 days later)
  const shippedDate = new Date(orderDate)
  shippedDate.setDate(shippedDate.getDate() + 2)
  const isShipped = shippedDate <= now
  events.push({
    status: "shipped",
    label: "Enviado",
    description: order.trackingNumber 
      ? `Código: ${order.trackingNumber}` 
      : "Aguardando código de rastreio",
    date: shippedDate.toISOString(),
    completed: isShipped,
    trackingNumber: order.trackingNumber || (isShipped ? `BR${Math.floor(100000000 + Math.random() * 900000000)}` : undefined),
    carrier: order.carrier || "Correios",
  })

  // Event 4: In Transit (3 days later)
  const transitDate = new Date(orderDate)
  transitDate.setDate(transitDate.getDate() + 3)
  events.push({
    status: "transit",
    label: "Em Trânsito",
    description: "A caminho do destinatário",
    date: transitDate.toISOString(),
    completed: transitDate <= now && isShipped,
  })

  // Event 5: Delivered (5 days later)
  const deliveredDate = new Date(orderDate)
  deliveredDate.setDate(deliveredDate.getDate() + 5)
  const isDelivered = deliveredDate <= now
  events.push({
    status: "delivered",
    label: "Entregue",
    description: "Pedido entregue com sucesso! 🎉",
    date: deliveredDate.toISOString(),
    completed: isDelivered,
  })

  return events
}

export default function OrderStatusPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [demoPayment, setDemoPayment] = useState<DemoPayment | null>(null)

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (!authData) {
      router.push("/loja")
      return
    }

    const auth = JSON.parse(authData)
    if (auth.companyId) {
      setCompanyId(auth.companyId)
    }
    const currentUser = getUserById(auth.userId)
    if (!currentUser) {
      router.push("/loja")
      return
    }

    setUser(currentUser)

    const orderData = getOrderById(orderId)
    // For members, check by userId. For managers/admins, allow viewing any order
    if (!orderData) {
      router.push("/loja")
      return
    }
    
    // Members can only see their own orders
    if (currentUser.role === "member" && orderData.userId !== currentUser.id) {
      router.push("/loja")
      return
    }

    setOrder(orderData)
    
    // Try to load associated demo payment
    const payment = getDemoPaymentByOrderId(orderId)
    if (payment) {
      setDemoPayment(payment)
    }
  }, [orderId, router])

  if (!order || !user) {
    return null
  }

  const trackingEvents = generateMockTrackingEvents(order)
  const currentStatus = trackingEvents.findLast(e => e.completed)?.status || "created"
  const isDelivered = currentStatus === "delivered"

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/loja")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Loja
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Status do Pedido</h1>
            <p className="text-muted-foreground mt-2">Acompanhe o andamento do seu pedido</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Pedido #{order.number}
                </CardTitle>
                <CardDescription className="mt-1">
                  Realizado em {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </CardDescription>
              </div>
              <Badge variant={isDelivered ? "default" : "secondary"} className="text-sm">
                {isDelivered ? "Entregue" : "Em Andamento"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold">
                  {order.paymentMethod === "points" || order.paymentMethod === "free" 
                    ? `${(order.paidWithPoints || order.total).toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)}`
                    : `R$ ${(order.paidWithMoney || order.total).toFixed(2)}`
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status do Pagamento</p>
                {order.paymentState === "paid" ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Pago
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">
                    <Clock className="h-3 w-3 mr-1" />
                    Pendente
                  </Badge>
                )}
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">Forma de Pagamento</p>
              <div className="flex items-center gap-3">
                {order.paymentMethod === "points" && (
                  <>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Coins className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{getCurrencyName(companyId, true).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {(order.paidWithPoints || 0).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)} utilizados
                      </p>
                    </div>
                  </>
                )}
                {order.paymentMethod === "pix" && (
                  <>
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <QrCode className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">PIX</p>
                      {demoPayment?.pixCode && (
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono truncate max-w-[200px]">
                            {demoPayment.pixCode.substring(0, 30)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => {
                              navigator.clipboard.writeText(demoPayment.pixCode!)
                              toast.success("Código PIX copiado!")
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {order.paymentMethod === "card" && (
                  <>
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                      <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="font-medium">Cartão de Crédito/Débito</p>
                      {demoPayment?.cardBrand && demoPayment?.cardLastFour && (
                        <p className="text-sm text-muted-foreground">
                          {demoPayment.cardBrand} ****{demoPayment.cardLastFour}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {order.paymentMethod === "free" && (
                  <>
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Resgate Gratuito</p>
                      <p className="text-sm text-muted-foreground">Sem custo</p>
                    </div>
                  </>
                )}
                {!order.paymentMethod && (
                  <>
                    <div className="p-2 bg-muted rounded-lg">
                      <Coins className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Pontos</p>
                      <p className="text-sm text-muted-foreground">
                        {(order.paidWithPoints || order.total).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Rastreamento
            </CardTitle>
            <CardDescription>Acompanhe cada etapa do seu pedido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {trackingEvents.map((event, index) => {
                const isLast = index === trackingEvents.length - 1
                const eventDate = new Date(event.date)
                
                return (
                  <div key={index} className="relative flex gap-4 pb-6">
                    {/* Timeline line */}
                    {!isLast && (
                      <div className={cn(
                        "absolute left-5 top-10 w-0.5 h-full",
                        event.completed ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                    
                    {/* Icon */}
                    <div className={cn(
                      "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2",
                      event.completed 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-muted text-muted-foreground border-muted"
                    )}>
                      {event.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={cn(
                            "font-semibold",
                            event.completed ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {event.label}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                          {event.trackingNumber && (
                            <div className="mt-2 flex items-center gap-2">
                              <Hash className="h-3 w-3 text-muted-foreground" />
                              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                {event.trackingNumber}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => {
                                  navigator.clipboard.writeText(event.trackingNumber!)
                                  toast.success("Código copiado!")
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          {event.carrier && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {event.carrier}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {format(eventDate, "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(eventDate, "HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Itens do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.lineItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-sm">
                      x{item.quantity}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.total.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        {order.shipAddress && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{order.shipAddress.address1}</p>
                {order.shipAddress.address2 && <p>{order.shipAddress.address2}</p>}
                <p>{order.shipAddress.city} - {order.shipAddress.stateCode}</p>
                <p className="font-mono">{order.shipAddress.zipcode}</p>
                {order.shipAddress.phone && <p>Tel: {order.shipAddress.phone}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push("/loja")} className="flex-1">
            Continuar Comprando
          </Button>
          <Button onClick={() => router.push("/membro/pedidos")} className="flex-1">
            Ver Meus Pedidos
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
