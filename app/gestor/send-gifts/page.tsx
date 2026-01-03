"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { 
  CalendarIcon, 
  Users, 
  Package, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Truck,
  MapPin,
  Clock,
  Hash,
  Copy,
  Gift,
  Sparkles,
  Eye,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { getProducts, getCompanyProductsByCompany, getUsers, getOrders, saveOrders, type User, type Product, type Order, type LineItem } from "@/lib/storage"
import { InventorySelector } from "@/components/gifts/InventorySelector"
import { AIRecommendationView } from "@/components/gifts/AIRecommendationView"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

// Mock tracking events for demo
const generateMockTrackingEvents = (order: Order) => {
  const events = []
  const now = new Date()
  const scheduledDate = order.scheduledAt ? new Date(order.scheduledAt) : now
  
  // Event 1: Order created
  events.push({
    status: "created",
    label: "Pedido Criado",
    description: "Presente agendado com sucesso",
    date: scheduledDate.toISOString(),
    completed: true,
  })

  // Event 2: Processing (1 day later)
  const processingDate = new Date(scheduledDate)
  processingDate.setDate(processingDate.getDate() + 1)
  events.push({
    status: "processing",
    label: "Em Processamento",
    description: "Preparando o envio",
    date: processingDate.toISOString(),
    completed: processingDate <= now,
  })

  // Event 3: Shipped (2 days later)
  const shippedDate = new Date(scheduledDate)
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
    trackingNumber: order.trackingNumber || `BR${Math.floor(100000000 + Math.random() * 900000000)}`,
    carrier: order.carrier || "Correios",
  })

  // Event 4: In Transit (3 days later)
  const transitDate = new Date(scheduledDate)
  transitDate.setDate(transitDate.getDate() + 3)
  events.push({
    status: "transit",
    label: "Em Trânsito",
    description: "A caminho do destinatário",
    date: transitDate.toISOString(),
    completed: transitDate <= now && isShipped,
  })

  // Event 5: Delivered (5 days later)
  const deliveredDate = new Date(scheduledDate)
  deliveredDate.setDate(deliveredDate.getDate() + 5)
  const isDelivered = deliveredDate <= now
  events.push({
    status: "delivered",
    label: "Entregue",
    description: "Presente entregue com sucesso! 🎉",
    date: deliveredDate.toISOString(),
    completed: isDelivered,
  })

  return events
}

export default function SendGiftsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [giftOrders, setGiftOrders] = useState<Order[]>([])
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([])
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  // AI Assistant state
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiBudget, setAiBudget] = useState("")
  const [aiRecipientCount, setAiRecipientCount] = useState("")
  const [isAILoading, setIsAILoading] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)

  useEffect(() => {
    // Get company ID from auth
    let companyId = "company_1"
    try {
      const authData = localStorage.getItem("yoobe_auth")
      if (authData) {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          companyId = auth.companyId
        }
      }
    } catch {}

    // Carregar dados iniciais - prefer CompanyProducts (V3), fallback to Products (V2)
    interface TransformedProduct {
      id: string
      name: string
      description?: string
      pointsCost: number
      stockQuantity: number
      images: string[]
    }
    let transformedProducts: TransformedProduct[] = []
    
    try {
      // Try CompanyProducts first (V3)
      const companyProducts = getCompanyProductsByCompany(companyId)
      if (companyProducts && companyProducts.length > 0) {
        transformedProducts = companyProducts
          .filter(p => p.isActive && p.status === "active" && (p.stockQuantity || 0) > 0)
          .map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            pointsCost: p.pointsCost || 0,
            stockQuantity: p.stockQuantity || 0,
            images: p.images || [],
          }))
      }
    } catch (error) {
      console.error("[SendGifts] Erro ao buscar CompanyProducts:", error)
    }

    // Fallback to Products (V2) if no CompanyProducts
    if (transformedProducts.length === 0) {
      try {
        const allProducts = getProducts()
        transformedProducts = allProducts
          .filter(p => p.active && (p.stock || 0) > 0)
          .map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            pointsCost: p.priceInPoints || 0,
            stockQuantity: p.stock || 0,
            images: p.images || (p.image ? [p.image] : []),
          }))
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("[SendGifts] Erro ao buscar Products:", error)
        }
      }
    }

    const loadedUsers = getUsers()
    setProducts(transformedProducts)
    setUsers(loadedUsers)
    loadGiftOrders(transformedProducts, loadedUsers)
  }, [])

  const loadGiftOrders = (productsList?: any[], usersList?: any[]) => {
    const orders = getOrders()
    const gifts = orders.filter(o => o.isGift).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
    
    // Se não houver envios, criar mocks para demonstração
    if (gifts.length === 0) {
      const mockGifts = generateMockGiftOrders(productsList || products, usersList || users)
      setGiftOrders(mockGifts)
    } else {
      setGiftOrders(gifts)
    }
  }

  const generateMockGiftOrders = (productsList: any[], usersList: User[]): Order[] => {
    const mockUsers = usersList.slice(0, 3) // Pegar até 3 usuários para mock
    const mockProducts = productsList.slice(0, 2) // Pegar até 2 produtos para mock
    
    if (mockUsers.length === 0 || mockProducts.length === 0) {
      return []
    }

    const now = new Date()
    const mockOrders: Order[] = []

    mockUsers.forEach((user, index) => {
      const scheduledDate = new Date(now)
      scheduledDate.setDate(scheduledDate.getDate() - (5 - index)) // Distribuir datas

      const product = mockProducts[index % mockProducts.length]
      const lineItems: LineItem[] = [{
        id: `li_mock_${index}`,
        productId: product.id,
        name: product.name,
        sku: product.sku || "",
        quantity: 1,
        price: product.pointsCost || product.priceInPoints || 0,
        total: product.pointsCost || product.priceInPoints || 0,
      }]

      mockOrders.push({
        id: `ord_mock_${index}`,
        number: `R${Math.floor(100000000 + Math.random() * 900000000)}`,
        state: index === 0 ? "complete" : index === 1 ? "shipped" : "scheduled",
        itemTotal: product.pointsCost || product.priceInPoints || 0,
        shipmentTotal: 0,
        total: product.pointsCost || product.priceInPoints || 0,
        paymentState: "paid",
        userId: "spree_user_1", // Use seeded manager user instead of spree_user_demo
        email: user.email,
        lineItems,
        shipAddress: {
          firstname: user.firstName,
          lastname: user.lastName,
          address1: user.address?.address1 || "Rua Exemplo, 123",
          address2: user.address?.address2 || "",
          city: user.address?.city || "São Paulo",
          stateCode: user.address?.stateCode || "SP",
          zipcode: user.address?.zipcode || "01234-567",
          phone: user.address?.phone || "",
        },
        scheduledAt: scheduledDate.toISOString(),
        isGift: true,
        giftMessage: index === 0 ? "Parabéns pelo seu desempenho!" : "Agradecemos sua dedicação!",
        createdAt: scheduledDate.toISOString(),
        updatedAt: scheduledDate.toISOString(),
        trackingNumber: index < 2 ? `BR${Math.floor(100000000 + Math.random() * 900000000)}` : undefined,
        carrier: index < 2 ? "Correios" : undefined,
      })
    })

    return mockOrders.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
  }

  const handleToggleRecipient = (email: string) => {
    setSelectedRecipients(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    )
  }

  const handleAIRecommendation = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Por favor, descreva o tipo de presente que você precisa")
      return
    }

    // Get company ID from auth
    let companyId = "company_1"
    try {
      const authData = localStorage.getItem("yoobe_auth")
      if (authData) {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          companyId = auth.companyId
        }
      }
    } catch {}

    setIsAILoading(true)
    try {
      const response = await fetch("/api/gifts/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: aiPrompt,
          budget: aiBudget ? parseInt(aiBudget) : undefined,
          recipientCount: aiRecipientCount ? parseInt(aiRecipientCount) : undefined,
          companyId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Erro ao obter recomendações da IA")
        return
      }

      if (data.recommendations && data.recommendations.length > 0) {
        // Store recommendations and show the recommendations view
        setAiRecommendations(data.recommendations)
        setShowRecommendations(true)
        toast.success(data.summary || "Recomendações geradas com sucesso!")
      } else {
        toast.warning("A IA não conseguiu gerar recomendações para sua solicitação")
      }
    } catch (error) {
      console.error("[AI Recommendation] Erro:", error)
      toast.error("Erro ao comunicar com o assistente de IA")
    } finally {
      setIsAILoading(false)
    }
  }

  const handleApplyRecommendations = (recommendations: any[]) => {
    // Get company ID from auth
    let companyId = "company_1"
    try {
      const authData = localStorage.getItem("yoobe_auth")
      if (authData) {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          companyId = auth.companyId
        }
      }
    } catch {}

    // Map AI recommendations to selectedItems format
    const newSelectedItems = recommendations.map((rec: any) => ({
      productId: rec.productId,
      quantity: rec.quantity || 1,
    }))

    setSelectedItems(newSelectedItems)
    
    // Reset AI dialog state
    setIsAIDialogOpen(false)
    setShowRecommendations(false)
    setAiRecommendations([])
    setAiPrompt("")
    setAiBudget("")
    setAiRecipientCount("")

    toast.success("Produtos recomendados pela IA adicionados!", {
      description: `${recommendations.length} produto(s) selecionado(s)`,
    })
  }

  const handleCancelRecommendations = () => {
    setShowRecommendations(false)
    setAiRecommendations([])
  }

  const handleSubmit = async () => {
    if (selectedRecipients.length === 0 || selectedItems.length === 0 || !scheduledDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSubmitting(true)
    try {
      const recipientData = selectedRecipients.map(email => {
        const user = users.find(u => u.email === email)!
        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address || {
            address1: "Endereço não informado",
            city: "Cidade não informada",
            stateCode: "UF",
            zipcode: "00000-000"
          }
        }
      })

      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: "admin@yoobe.com.br", // Demo default
          recipients: recipientData,
          items: selectedItems,
          scheduledDate: scheduledDate.toISOString(),
          message
        })
      })

      const data = await response.json()

      if (data.success) {
        // Save orders to client-side localStorage (API saves server-side, we need both for demo)
        if (data.orders && data.orders.length > 0) {
          const existingOrders = getOrders()
          const newOrderIds = new Set(data.orders.map((o: Order) => o.id))
          // Filter out any duplicates and add the new orders
          const updatedOrders = [
            ...existingOrders.filter((o: Order) => !newOrderIds.has(o.id)),
            ...data.orders
          ]
          saveOrders(updatedOrders)
        }
        
        toast.success("Presentes agendados com sucesso!", {
          description: `${selectedRecipients.length} presente(s) agendado(s)`
        })
        // Reset form
        setSelectedItems([])
        setSelectedRecipients([])
        setScheduledDate(new Date())
        setMessage("")
        setStep(1)
        // Reload gift orders from storage
        loadGiftOrders(products, users)
      } else {
        toast.error(data.error || "Erro ao agendar presentes")
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            Enviar Presentes
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie o envio de presentes para membros da equipe com rastreamento completo
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Sparkles className="h-3 w-3 mr-1" />
          Experiência WOW
        </Badge>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviar Novo Presente
          </TabsTrigger>
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Meus Envios ({giftOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-8">
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium justify-center">
            <span className={cn("px-3 py-1.5 rounded-md", step === 1 ? "bg-primary text-primary-foreground" : "bg-muted")}>
              1. Itens
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className={cn("px-3 py-1.5 rounded-md", step === 2 ? "bg-primary text-primary-foreground" : "bg-muted")}>
              2. Destinatários
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className={cn("px-3 py-1.5 rounded-md", step === 3 ? "bg-primary text-primary-foreground" : "bg-muted")}>
              3. Agendamento
            </span>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Selecionar Itens
                </CardTitle>
                <CardDescription>Escolha os produtos do estoque corporativo para o presente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Selecione manualmente ou use o assistente de IA para recomendações inteligentes
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAIDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Assistente de Campanhas
                  </Button>
                </div>
                <InventorySelector 
                  products={products} 
                  onSelect={setSelectedItems} 
                />
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => setStep(2)} 
                    disabled={selectedItems.length === 0}
                  >
                    Próximo: Destinatários
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Selecionar Destinatários
                </CardTitle>
                <CardDescription>Para quem você deseja enviar esses presentes?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
                    {users.map((user) => (
                      <div key={user.email} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <Checkbox 
                          id={`user-${user.email}`} 
                          checked={selectedRecipients.includes(user.email)}
                          onCheckedChange={() => handleToggleRecipient(user.email)}
                        />
                        <label 
                          htmlFor={`user-${user.email}`}
                          className="flex-1 flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="outline">{user.level}</Badge>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      disabled={selectedRecipients.length === 0}
                    >
                      Próximo: Agendamento
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Agendar Entrega
                </CardTitle>
                <CardDescription>Escolha a data e adicione uma mensagem opcional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Data de Envio</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">O estoque será reservado imediatamente.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Mensagem (Opcional)</Label>
                      <Textarea 
                        placeholder="Escreva uma mensagem carinhosa..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg space-y-3 border border-primary/10">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Resumo do Agendamento
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Itens</p>
                        <p className="font-medium">{selectedItems.reduce((acc, item) => acc + item.quantity, 0)} unidades de {selectedItems.length} produtos</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Destinatários</p>
                        <p className="font-medium">{selectedRecipients.length} membros da equipe</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Envio</p>
                        <p className="font-medium">{scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      {isSubmitting ? (
                        "Agendando..."
                      ) : (
                        <>
                          Confirmar e Agendar
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shipments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Histórico de Envios
              </CardTitle>
              <CardDescription>
                Visualize todos os presentes enviados e seus status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {giftOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum presente enviado ainda</p>
                  <p className="text-sm text-muted-foreground mt-2">Use a aba "Enviar Novo Presente" para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {giftOrders.map((order) => {
                    const trackingEvents = generateMockTrackingEvents(order)
                    const currentStatus = trackingEvents.findLast(e => e.completed)?.status || "created"
                    const statusLabels: Record<string, string> = {
                      created: "Agendado",
                      processing: "Processando",
                      shipped: "Enviado",
                      transit: "Em Trânsito",
                      delivered: "Entregue",
                    }
                    const statusColors: Record<string, string> = {
                      created: "bg-blue-100 text-blue-800",
                      processing: "bg-yellow-100 text-yellow-800",
                      shipped: "bg-purple-100 text-purple-800",
                      transit: "bg-orange-100 text-orange-800",
                      delivered: "bg-green-100 text-green-800",
                    }

                    return (
                      <Card
                        key={order.id}
                        className="border border-slate-200 hover:border-primary/30 shadow-sm hover:shadow-md transition-all"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                              <Gift className="h-5 w-5 text-primary shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Pedido</p>
                                <CardTitle className="text-xl font-black leading-tight truncate">#{order.number}</CardTitle>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 md:justify-end">
                              <Badge className={cn("font-bold", statusColors[currentStatus] || "bg-gray-100 text-gray-800")}>
                                {statusLabels[currentStatus] || "Desconhecido"}
                              </Badge>
                              {order.trackingNumber && (
                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                  <Hash className="h-3 w-3" />
                                  {order.trackingNumber}
                                </Badge>
                              )}
                              {order.carrier && (
                                <Badge variant="secondary" className="text-xs">
                                  {order.carrier}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-6 pt-0">
                          <div className="grid gap-4 md:grid-cols-[2fr_auto] md:items-start">
                            <div className="space-y-3 min-w-0">
                              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                                <div className="space-y-1 min-w-0">
                                  <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Destinatário</p>
                                  <p className="text-sm font-semibold text-slate-900 truncate">
                                    {order.shipAddress?.firstname} {order.shipAddress?.lastname}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">{order.email}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Data de Envio</p>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {order.scheduledAt
                                      ? format(new Date(order.scheduledAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                                      : "N/A"}
                                  </p>
                                  {order.shipAddress?.city && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {order.shipAddress.city} - {order.shipAddress.stateCode}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Itens</p>
                                <div className="flex flex-wrap gap-2">
                                  {order.lineItems.map((item, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs bg-muted/50 border-dashed">
                                      {item.name} x{item.quantity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {trackingEvents && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>
                                    Última atualização:{" "}
                                    {format(new Date(trackingEvents[trackingEvents.length - 1].date), "dd/MM/yyyy", {
                                      locale: ptBR,
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-stretch gap-2 w-full md:w-[180px]">
                              <Button
                                variant="outline"
                                className="justify-between"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <span className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  Ver detalhes
                                </span>
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                              {order.trackingNumber && (
                                <Button
                                  variant="ghost"
                                  className="justify-between text-xs"
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.trackingNumber!)
                                    toast.success("Código copiado!")
                                  }}
                                >
                                  Copiar rastreio
                                  <Copy className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Assistant Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={(open) => {
        setIsAIDialogOpen(open)
        if (!open) {
          // Reset state when dialog closes
          setShowRecommendations(false)
          setAiRecommendations([])
          setAiPrompt("")
          setAiBudget("")
          setAiRecipientCount("")
        }
      }}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Assistente de Campanhas
            </DialogTitle>
            <DialogDescription>
              {showRecommendations 
                ? "Revise as recomendações da IA e aplique-as à sua campanha"
                : "Descreva o tipo de campanha ou presente que você precisa e nossa IA recomendará os produtos ideais do catálogo"}
            </DialogDescription>
          </DialogHeader>
          
          {showRecommendations ? (
            (() => {
              // Get company ID from auth
              let companyId = "company_1"
              try {
                const authData = localStorage.getItem("yoobe_auth")
                if (authData) {
                  const auth = JSON.parse(authData)
                  if (auth.companyId) {
                    companyId = auth.companyId
                  }
                }
              } catch {}
              
              return (
                <AIRecommendationView
                  recommendations={aiRecommendations}
                  onApply={handleApplyRecommendations}
                  onCancel={handleCancelRecommendations}
                  companyId={companyId}
                />
              )
            })()
          ) : (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Descreva o presente desejado</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Ex: Preciso de uma campanha de onboarding para 5 novos desenvolvedores, com foco em produtividade e estilo, orçamento de 500 pontos por pessoa."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[120px]"
                  disabled={isAILoading}
                />
                <p className="text-xs text-muted-foreground">
                  Seja específico: mencione o tipo de campanha (onboarding, incentivo, reconhecimento), público-alvo, estilo desejado, quantidade de pessoas, etc.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-budget">Orçamento por pessoa (opcional)</Label>
                  <Input
                    id="ai-budget"
                    type="number"
                    placeholder="Ex: 500"
                    value={aiBudget}
                    onChange={(e) => setAiBudget(e.target.value)}
                    disabled={isAILoading}
                  />
                  <p className="text-xs text-muted-foreground">Em pontos</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-recipients">Número de destinatários (opcional)</Label>
                  <Input
                    id="ai-recipients"
                    type="number"
                    placeholder="Ex: 5"
                    value={aiRecipientCount}
                    onChange={(e) => setAiRecipientCount(e.target.value)}
                    disabled={isAILoading}
                  />
                  <p className="text-xs text-muted-foreground">Quantidade de pessoas</p>
                </div>
              </div>

              {isAILoading && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-sm font-medium">Analisando catálogo e gerando recomendações...</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAIDialogOpen(false)
                    setAiPrompt("")
                    setAiBudget("")
                    setAiRecipientCount("")
                  }}
                  disabled={isAILoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAIRecommendation}
                  disabled={isAILoading || !aiPrompt.trim()}
                  className="flex items-center gap-2"
                >
                  {isAILoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Obter Recomendações
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Details Modal */}
      <ResponsiveModal
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        title={
          selectedOrder && (() => {
            const trackingEvents = generateMockTrackingEvents(selectedOrder)
            const currentStatus = trackingEvents.findLast(e => e.completed)?.status || "created"
            const statusLabels: Record<string, string> = {
              created: "Agendado",
              processing: "Processando",
              shipped: "Enviado",
              transit: "Em Trânsito",
              delivered: "Entregue",
            }
            const statusColors: Record<string, string> = {
              created: "bg-blue-100 text-blue-800",
              processing: "bg-yellow-100 text-yellow-800",
              shipped: "bg-purple-100 text-purple-800",
              transit: "bg-orange-100 text-orange-800",
              delivered: "bg-green-100 text-green-800",
            }
            return (
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Pedido #{selectedOrder.number}
                </span>
                <Badge className={cn("border-none font-bold ml-4", statusColors[currentStatus] || "bg-gray-100 text-gray-800")}>
                  {statusLabels[currentStatus] || "Desconhecido"}
                </Badge>
              </div>
            )
          })()
        }
        description={selectedOrder ? `Detalhes completos do presente enviado para ${selectedOrder.shipAddress?.firstname}` : ""}
        maxWidth="2xl"
        footer={
          <Button onClick={() => setSelectedOrder(null)} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider shadow-lg shadow-primary/20">
            Fechar Detalhes
          </Button>
        }
      >
        {selectedOrder && (() => {
          const trackingEvents = generateMockTrackingEvents(selectedOrder)
          
          return (
            <div className="space-y-6">
              {/* Recipient Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  Destinatário
                </h4>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nome</p>
                      <p className="font-bold text-slate-900">{selectedOrder.shipAddress?.firstname} {selectedOrder.shipAddress?.lastname}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">E-mail</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{selectedOrder.email}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200/50">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> Endereço de Entrega
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{selectedOrder.shipAddress?.address1}, {selectedOrder.shipAddress?.city} - {selectedOrder.shipAddress?.stateCode}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-slate-400" />
                  Conteúdo do Presente
                </h4>
                <div className="space-y-2">
                  {selectedOrder.lineItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-primary/30 transition-all">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">SKU: {item.sku || "WOW-GIFT"}</p>
                      </div>
                      <Badge variant="outline" className="h-8 min-w-[40px] flex items-center justify-center font-black bg-primary/5 text-primary border-primary/10">
                        x{item.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-400" />
                  Status do Rastreamento
                </h4>
                <div className="relative pl-8 space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {trackingEvents.map((event, index) => {
                    const eventDate = new Date(event.date)
                    return (
                      <div key={index} className="relative">
                        <div className={cn(
                          "absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 bg-white z-10 transition-all duration-500",
                          event.completed ? "border-primary scale-110 shadow-[0_0_0_4px_rgba(var(--primary),0.1)] bg-primary" : "border-slate-200"
                        )}>
                          {event.completed && <CheckCircle2 className="h-full w-full text-white p-0.5" />}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              "font-bold text-sm",
                              event.completed ? "text-slate-900" : "text-slate-400"
                            )}>
                              {event.label}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase">
                              {format(eventDate, "dd MMM", { locale: ptBR })}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{event.description}</p>
                          
                          {event.trackingNumber && event.completed && (
                            <div className="mt-3 p-3 bg-slate-900 rounded-xl flex items-center justify-between group/tracking transition-all hover:bg-black">
                              <div className="flex items-center gap-3">
                                <Hash className="h-4 w-4 text-primary" />
                                <code className="text-xs font-mono text-white tracking-widest">{event.trackingNumber}</code>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => {
                                navigator.clipboard.writeText(event.trackingNumber!)
                                toast.success("Código de rastreio copiado!")
                              }}>
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Gift Message */}
              {selectedOrder.giftMessage && (
                <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Cartão Personalizado</span>
                  </div>
                  <p className="text-sm italic text-slate-600 leading-relaxed">"{selectedOrder.giftMessage}"</p>
                </div>
              )}
            </div>
          )
        })()}
      </ResponsiveModal>
    </PageContainer>
  )
}
