"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
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
  Sparkles,
  Home
} from "lucide-react"
import { motion } from "framer-motion"
import { getOrderById, getCurrencyName, getLandingPageBySlug, type Order, type LandingPage } from "@/lib/storage"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import confetti from "canvas-confetti"

function CampanhaPedidoStatusPageContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.id as string
  const lpSlug = searchParams.get("lp")
  
  const [order, setOrder] = useState<Order | null>(null)
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null)
  const [companyId, setCompanyId] = useState<string>("company_1")

  useEffect(() => {
    if (lpSlug) {
      const page = getLandingPageBySlug(lpSlug)
      if (page) {
        setLandingPage(page)
        setCompanyId(page.companyId)
      }
    }

    const orderData = getOrderById(orderId)
    if (!orderData) {
      toast.error("Pedido não encontrado")
      router.push("/loja")
      return
    }
    
    setOrder(orderData)
    
    // Celebrate!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: landingPage ? [landingPage.primaryColor, landingPage.secondaryColor] : undefined
    })
  }, [orderId, lpSlug, router])

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Apply landing page styles
  const styles = landingPage ? {
    "--primary-color": landingPage.primaryColor,
    "--secondary-color": landingPage.secondaryColor,
    "--background-color": landingPage.backgroundColor,
    "--text-color": landingPage.textColor,
  } : {}

  return (
    <div className="min-h-screen pb-12" style={styles as any}>
      {/* Header */}
      <div className={cn(
        "w-full py-16 text-center text-white relative overflow-hidden",
        !landingPage && "bg-linear-to-r from-indigo-600 via-blue-600 to-cyan-500"
      )} style={landingPage ? { 
        background: `linear-gradient(135deg, ${landingPage.primaryColor} 0%, ${landingPage.secondaryColor} 100%)` 
      } : {}}>
        <div className="absolute inset-0 bg-[url('/sparkles.svg')] opacity-20 animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/20 p-6 rounded-full backdrop-blur-md shadow-2xl">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-4 text-white drop-shadow-lg"
          >
            Fator UAU Ativado! 🎉
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl opacity-90 text-white font-medium"
          >
            Seu pedido #{order.number} foi processado com sucesso.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Order Brief */}
          <Card className="shadow-xl border-none">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Número do Pedido</p>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    #{order.number}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                      navigator.clipboard.writeText(order.number)
                      toast.success("Copiado!")
                    }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </h2>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Data</p>
                  <p className="font-medium">{format(new Date(order.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
                </div>
                <Badge className="w-fit px-4 py-1 text-sm bg-green-500 hover:bg-green-600">
                  Processando
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" style={landingPage ? { color: landingPage.primaryColor } : {}} />
                  Produtos Resgatados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.lineItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border bg-muted/30">
                    <div className="h-12 w-12 rounded bg-white border flex items-center justify-center flex-shrink-0">
                      <Gift className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" style={landingPage ? { color: landingPage.primaryColor } : {}} />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shipAddress ? (
                  <div className="text-sm space-y-1">
                    <p className="font-bold">{order.shipAddress.firstname} {order.shipAddress.lastname}</p>
                    <p className="text-muted-foreground">{order.shipAddress.address1}</p>
                    {order.shipAddress.address2 && <p className="text-muted-foreground">{order.shipAddress.address2}</p>}
                    <p className="text-muted-foreground">{order.shipAddress.city}, {order.shipAddress.stateCode}</p>
                    <p className="text-muted-foreground font-mono">{order.shipAddress.zipcode}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Informações de entrega não disponíveis.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="bg-primary/5 border-primary/20" style={landingPage ? { backgroundColor: landingPage.primaryColor + '08', borderColor: landingPage.primaryColor + '20' } : {}}>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" style={landingPage ? { color: landingPage.primaryColor } : {}} />
                O que acontece agora?
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0" style={landingPage ? { backgroundColor: landingPage.primaryColor } : {}}>1</div>
                  <p className="text-sm">Enviamos um email de confirmação para <strong>{order.email}</strong>.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0" style={landingPage ? { backgroundColor: landingPage.primaryColor } : {}}>2</div>
                  <p className="text-sm">Nosso time vai separar seus produtos com todo carinho.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0" style={landingPage ? { backgroundColor: landingPage.primaryColor } : {}}>3</div>
                  <p className="text-sm">Assim que for enviado, você receberá o código de rastreamento.</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button variant="outline" className="gap-2" onClick={() => router.push("/")}>
              <Home className="h-4 w-4" />
              Voltar ao Início
            </Button>
            {lpSlug && (
              <Button className="gap-2" onClick={() => router.push(`/landing/${lpSlug}`)} style={landingPage ? { backgroundColor: landingPage.primaryColor } : {}}>
                <ArrowLeft className="h-4 w-4" />
                Voltar para Landing Page
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CampanhaPedidoStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <CampanhaPedidoStatusPageContent />
    </Suspense>
  )
}
