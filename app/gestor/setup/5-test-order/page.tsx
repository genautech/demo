"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemoState } from "@/hooks/use-demo-state"
import { demoClient } from "@/lib/demoClient"
import { Product, Order, WalletSummaryDTO } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight, Loader2, Coins, Store, CheckCircle2, Package } from "lucide-react"
import { toast } from "sonner"
import { eventBus } from "@/lib/eventBus"

export default function TestOrderStep() {
  const { env } = useDemoState()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [wallet, setWallet] = useState<WalletSummaryDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState<string | null>(null)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  const TEST_USER_ID = "spree_user_demo_test"

  useEffect(() => {
    setLoading(true)
    Promise.all([
      demoClient.getProducts(env),
      demoClient.getWalletSummary(env, TEST_USER_ID)
    ]).then(([p, w]) => {
      setProducts(p.slice(0, 3)) // Just show top 3
      setWallet(w)
      setLoading(false)
    })
  }, [env])

  const handlePlaceOrder = async (product: Product) => {
    if ((wallet?.available || 0) < product.priceInPoints) {
      toast.error("Saldo insuficiente para resgatar este produto.")
      return
    }

    setPlacingOrder(product.id)
    try {
      // 1. Create Order
      const order = await demoClient.createOrder(env, {
        userId: TEST_USER_ID,
        email: "usuario.teste@exemplo.com",
        totalPoints: product.priceInPoints,
        paymentMode: "points",
        items: [{ productId: product.id, name: product.name, qty: 1 }],
        shipment: { status: "requested", updatedAt: new Date().toISOString() }
      })

      // 2. Deduct points (side effect in demoClient handles storage)
      await demoClient.creditPoints(env, TEST_USER_ID, -product.priceInPoints, `Resgate: ${product.name}`)
      
      // 3. Emit event
      await eventBus.emit(env, "order.created", { orderId: order.id, number: order.number })
      
      setLastOrder(order)
      
      // 4. Update setup step
      await demoClient.updateSetupStep(env, "test_order", "done")
      
      toast.success(`Pedido ${order.number} realizado com sucesso!`)

      // 5. Simulate fulfillment timeline
      setTimeout(() => {
        eventBus.emit(env, "shipment.updated", { orderId: order.id, status: "packed" })
      }, 5000)

    } finally {
      setPlacingOrder(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.push("/gestor/setup")} className="mb-4">
          ← Voltar para visão geral
        </Button>
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Step 5: Sandbox Store</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Teste a experiência do seu colaborador. Resgate um produto usando os pontos que você creditou no passo anterior.
        </p>
      </div>

      <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium">Saldo do Usuário de Teste:</span>
          <span className="text-lg font-bold text-yellow-700">{wallet?.available || 0} BRTS</span>
        </div>
        <p className="text-xs text-yellow-600 font-medium italic">Ambiente de Sandbox</p>
      </div>

      {!lastOrder ? (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="aspect-square bg-slate-100 relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic">No image</div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                  {product.category}
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base truncate">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-lg font-bold">{product.priceInPoints}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">BRTS</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  onClick={() => handlePlaceOrder(product)} 
                  disabled={!!placingOrder} 
                  className="w-full h-8 text-xs"
                >
                  {placingOrder === product.id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : (
                    <ShoppingBag className="h-3 w-3 mr-2" />
                  )}
                  Resgatar Agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader className="text-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Pedido Realizado!</CardTitle>
            <CardDescription>O pedido {lastOrder.number} foi criado e está sendo processado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-100">
              <div className="flex items-center gap-4">
                <Package className="h-10 w-10 text-slate-400" />
                <div>
                  <p className="font-semibold text-sm">Status do Envio</p>
                  <p className="text-xs text-muted-foreground capitalize">{lastOrder.shipment?.status || "Pendente"}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push(`/gestor/orders/${lastOrder.id}`)}>
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center border-t border-green-100 pt-6">
            <Button onClick={() => router.push("/gestor/setup/6-go-live")} className="gap-2">
              Finalizar Setup <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
