"use client"

import { use, useState, useEffect } from "react"
import { useDemoState } from "@/hooks/use-demo-state"
import { useOrders } from "@/hooks/use-console-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, MapPin, User, Mail, CreditCard, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { getCurrencyName, getCompanyProductById, getProductById, getUserById, type LineItem } from "@/lib/storage"
import Image from "next/image"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { env } = useDemoState()
  const { orders, isLoading } = useOrders(env)
  const router = useRouter()
  const [companyId, setCompanyId] = useState<string>("company_1")

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch {}
    }
  }, [])

  const order = orders.find(o => o.id === id)

  if (isLoading) return <div className="p-8 animate-pulse">Carregando detalhes do pedido...</div>
  if (!order) return <div className="p-8 text-center text-muted-foreground">Pedido não encontrado.</div>

  const timeline = [
    { status: "requested", label: "Pedido Criado", icon: Clock, done: true },
    { status: "packed", label: "Embalado", icon: Package, done: ["packed", "shipped", "delivered"].includes(order.shipment?.status || "") },
    { status: "shipped", label: "Enviado", icon: Truck, done: ["shipped", "delivered"].includes(order.shipment?.status || "") },
    { status: "delivered", label: "Entregue", icon: CheckCircle2, done: order.shipment?.status === "delivered" },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-2 gap-2">
          <ArrowLeft className="h-4 w-4" /> Voltar para pedidos
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{order.number}</h1>
            <p className="text-muted-foreground text-sm">Realizado em {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-500 text-white border-none py-1.5 px-4 font-bold uppercase tracking-wider">{order.state}</Badge>
            {order.shipment?.status && (
              <Badge variant="outline" className="py-1.5 px-4 font-bold uppercase tracking-wider border-primary text-primary">{order.shipment.status}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" /> Itens do Resgate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {(order.lineItems || order.items || []).map((item: LineItem, i: number) => {
                  // Try to get product image
                  const product = getCompanyProductById(item.productId) || getProductById(item.productId)
                  const productImage = product?.images?.[0] || product?.image
                  
                  return (
                    <div key={i} className="flex items-center gap-4 p-6">
                      <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border overflow-hidden">
                        {productImage ? (
                          <Image
                            src={productImage}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <ShoppingBag className="h-8 w-8 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku || "N/A"} • Qtd: {item.quantity || 1}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary">{(item.total || item.price * item.quantity || 0).toLocaleString()} <span className="text-[10px]">{getCurrencyName(companyId, true).toUpperCase()}</span></p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" /> Timeline de Entrega
              </CardTitle>
              <CardDescription>Acompanhe o status do envio em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                <div className="space-y-10 relative">
                  {timeline.map((step, i) => (
                    <div key={i} className="flex items-start gap-6 ml-0">
                      <div className={cn(
                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                        step.done ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white border-slate-200 text-slate-300"
                      )}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={cn("font-bold text-sm", step.done ? "text-slate-900" : "text-slate-400")}>{step.label}</p>
                        {step.done && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">Atualizado automaticamente pelo simulador</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const orderUser = order.userId ? getUserById(order.userId) : null
                const userName = orderUser ? `${orderUser.firstName} ${orderUser.lastName}`.trim() : "Usuário"
                const userEmail = orderUser?.email || order.email || "N/A"
                
                return (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                      {orderUser?.avatar ? (
                        <Image
                          src={orderUser.avatar}
                          alt={userName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{userName}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {userEmail}</p>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Endereço de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.shipAddress ? (
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">{order.shipAddress.address1}</p>
                    {order.shipAddress.address2 && (
                      <p className="text-muted-foreground">{order.shipAddress.address2}</p>
                    )}
                    <p className="text-muted-foreground">{order.shipAddress.city} - {order.shipAddress.stateCode}</p>
                    <p className="text-muted-foreground">{order.shipAddress.zipcode} • {order.shipAddress.country || "Brasil"}</p>
                    {order.shipAddress.phone && (
                      <p className="text-muted-foreground">Tel: {order.shipAddress.phone}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="text-xs space-y-1">
                    <p className="text-muted-foreground italic">Endereço não disponível</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium">{getCurrencyName(companyId, true).toUpperCase()} Wallet</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px]">{order.paymentState}</Badge>
              </div>
              <div className="mt-4 border-t pt-4 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Total Debitado</span>
                <span className="text-xl font-black text-primary">{(order.totalPoints || order.paidWithPoints || 0).toLocaleString()} <span className="text-[10px] font-bold">{getCurrencyName(companyId, true).toUpperCase()}</span></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

