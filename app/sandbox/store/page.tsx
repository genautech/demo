"use client"

import { useState, useEffect } from "react"
import { useDemoState } from "@/hooks/use-demo-state"
import { useCatalog, useWalletSummary } from "@/hooks/use-console-data"
import { demoClient } from "@/lib/demoClient"
import { Product, WalletSummaryDTO } from "@/lib/storage"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Coins, Store, Search, LayoutGrid, List, ArrowRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { eventBus } from "@/lib/eventBus"
import { useRouter } from "next/navigation"

export default function SandboxStorePage() {
  const { env } = useDemoState()
  const TEST_USER_ID = "spree_user_demo_test"
  const { products, isLoading: loadingProducts } = useCatalog(env)
  const { summary, mutate: mutateWallet } = useWalletSummary(env, TEST_USER_ID)
  const [search, setSearch] = useState("")
  const [placingOrder, setPlacingOrder] = useState<string | null>(null)
  const router = useRouter()

  const filteredProducts = products.filter(p => 
    p.active && (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  )

  const handleRedeem = async (product: Product) => {
    if ((summary?.available || 0) < product.priceInPoints) {
      toast.error("Saldo insuficiente!")
      return
    }

    setPlacingOrder(product.id)
    try {
      const order = await demoClient.createOrder(env, {
        userId: TEST_USER_ID,
        email: "usuario.teste@exemplo.com",
        totalPoints: product.priceInPoints,
        paidWithPoints: product.priceInPoints,
        paymentMode: "points",
        items: [{ productId: product.id, name: product.name, qty: 1 }],
        state: "complete"
      })

      await demoClient.creditPoints(env, TEST_USER_ID, -product.priceInPoints, `Resgate: ${product.name}`)
      mutateWallet()
      
      await eventBus.emit(env, "order.created", { orderId: order.id, number: order.number, env })
      
      toast.success(`Resgate concluído! Pedido ${order.number}`)
      router.push(`/gestor/orders`)
    } finally {
      setPlacingOrder(null)
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/60 flex items-center px-8 text-white">
        <div className="relative z-10 space-y-2 max-w-lg">
          <h1 className="text-3xl font-black tracking-tight">Sandbox Store</h1>
          <p className="text-primary-foreground/80 text-sm">
            Esta é a vitrine que seus colaboradores verão. Teste o fluxo de resgate no ambiente {env}.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-[-20deg] translate-x-20" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[72px] z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 border-b">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="O que você está procurando?" 
            className="pl-9 bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500/10 p-1 rounded-full">
              <Coins className="h-4 w-4 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Seu Saldo:</span>
            <span className="text-base font-black text-slate-900">{(summary?.available || 0).toLocaleString()} <span className="text-[10px]">BRTS</span></span>
          </div>
        </div>
      </div>

      {loadingProducts ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-32 space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
          <h2 className="text-xl font-bold">Nenhum produto disponível</h2>
          <p className="text-muted-foreground">Certifique-se de ter importado produtos no console.</p>
          <Button onClick={() => router.push("/gestor/catalog/import")}>Ir para Importação</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group flex flex-col rounded-2xl bg-white">
              <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                <img 
                  src={product.image || "/placeholder.jpg"} 
                  alt={product.name} 
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-primary text-[10px] font-black border-none backdrop-blur-sm shadow-sm uppercase tracking-tighter">
                    {product.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="p-5 pb-0 flex-1">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs h-8 mt-1 leading-relaxed">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-4">
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investimento</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xl font-black text-slate-900">{(product.priceInPoints || 0).toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-yellow-600 bg-yellow-500/10 px-1.5 py-0.5 rounded uppercase">BRTS</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button 
                  onClick={() => handleRedeem(product)} 
                  disabled={!!placingOrder}
                  className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all"
                >
                  {placingOrder === product.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Resgatar <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
