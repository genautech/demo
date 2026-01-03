"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Package, MapPin, ShoppingCart, Wallet, CheckCircle2, Plus, Home, Building2 } from "lucide-react"
import { 
  getUserById, 
  getProducts, 
  getCompanyProductById,
  updateCompanyProduct,
  deductPoints, 
  createOrder, 
  getCurrencyName,
  getStoreSettings,
  createDemoPixPayment,
  createDemoCardPayment,
  confirmDemoPayment,
  getUserAddresses,
  saveUserAddress,
  type User, 
  type Product,
  type Env,
  type StoreSettings,
  type DemoPayment,
  type SavedAddress,
} from "@/lib/storage"
import { CreditCard, Coins, QrCode, Gift, Copy, Check, Loader2 } from "lucide-react"
import { eventBus } from "@/lib/eventBus"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface CartItem {
  id: string
  name: string
  quantity: number
  pointsCost: number
  price: number
  images?: string[]
}

type PaymentMethod = "points" | "pix" | "card" | "free"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [step, setStep] = useState<"address" | "payment" | "review" | "pix_payment" | "card_payment">("address")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("points")
  
  // Demo payment states
  const [demoPayment, setDemoPayment] = useState<DemoPayment | null>(null)
  const [pixCopied, setPixCopied] = useState(false)
  const [cardForm, setCardForm] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvv: "",
  })

  // Address form state
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    stateCode: "",
    zipcode: "",
    phone: "",
  })
  
  // Saved addresses state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isNewAddress, setIsNewAddress] = useState(false)
  const [saveNewAddress, setSaveNewAddress] = useState(true)

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (!authData) {
      router.push("/loja")
      return
    }

    const auth = JSON.parse(authData)
    const user = getUserById(auth.userId)
    if (!user) {
      router.push("/loja")
      return
    }

    if (auth.companyId) {
      setCompanyId(auth.companyId)
      const settings = getStoreSettings(auth.companyId)
      setStoreSettings(settings)
      
      // Set default payment method based on available types
      if (settings.redemptionTypes.points) {
        setPaymentMethod("points")
      } else if (settings.redemptionTypes.pix) {
        setPaymentMethod("pix")
      } else if (settings.redemptionTypes.card) {
        setPaymentMethod("card")
      } else if (settings.redemptionTypes.free) {
        setPaymentMethod("free")
      }
    }

    setCurrentUser(user)

    // Load cart from localStorage
    const savedCart = localStorage.getItem("yoobe_cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        setCart(cartData)
      } catch {
        router.push("/loja")
      }
    } else {
      router.push("/loja")
    }

    // Load saved addresses
    const addresses = getUserAddresses(user.id)
    setSavedAddresses(addresses)
    
    // Pre-select default address or first address
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault) || addresses[0]
      setSelectedAddressId(defaultAddress.id)
      setAddress({
        address1: defaultAddress.address1 || "",
        address2: defaultAddress.address2 || "",
        city: defaultAddress.city || "",
        stateCode: defaultAddress.stateCode || "",
        zipcode: defaultAddress.zipcode || "",
        phone: defaultAddress.phone || user.phone || "",
      })
      setIsNewAddress(false)
    } else if (user.address) {
      // Fallback: use user's address if no saved addresses
      setAddress({
        address1: user.address.address1 || "",
        address2: user.address.address2 || "",
        city: user.address.city || "",
        stateCode: user.address.stateCode || "",
        zipcode: user.address.zipcode || "",
        phone: user.phone || "",
      })
      setIsNewAddress(true)
    } else {
      // No addresses at all - show form
      setIsNewAddress(true)
    }
  }, [router])

  const cartTotalPoints = cart.reduce((sum, item) => sum + item.pointsCost * item.quantity, 0)
  const cartTotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.address1 || !address.city || !address.stateCode || !address.zipcode) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios do endereço.",
        variant: "destructive",
      })
      return
    }
    
    // Save new address to user's profile if requested
    if (currentUser && isNewAddress && saveNewAddress) {
      const newAddress = saveUserAddress(currentUser.id, {
        label: savedAddresses.length === 0 ? "Endereço Principal" : `Endereço ${savedAddresses.length + 1}`,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        stateCode: address.stateCode,
        zipcode: address.zipcode,
        phone: address.phone,
        country: "BR",
        isDefault: savedAddresses.length === 0, // Set as default if it's the first address
      })
      
      if (newAddress) {
        // Refresh saved addresses
        const updatedAddresses = getUserAddresses(currentUser.id)
        setSavedAddresses(updatedAddresses)
        setSelectedAddressId(newAddress.id)
        setIsNewAddress(false)
      }
    }
    
    // Check if multiple payment methods are available
    const availableMethods = getAvailablePaymentMethods()
    if (availableMethods.length > 1) {
      setStep("payment")
    } else {
      setStep("review")
    }
  }
  
  // Handle selecting a saved address
  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id)
    setAddress({
      address1: addr.address1 || "",
      address2: addr.address2 || "",
      city: addr.city || "",
      stateCode: addr.stateCode || "",
      zipcode: addr.zipcode || "",
      phone: addr.phone || "",
    })
    setIsNewAddress(false)
  }
  
  // Handle adding a new address
  const handleAddNewAddress = () => {
    setSelectedAddressId(null)
    setAddress({
      address1: "",
      address2: "",
      city: "",
      stateCode: "",
      zipcode: "",
      phone: currentUser?.phone || "",
    })
    setIsNewAddress(true)
    setSaveNewAddress(true)
  }
  
  const getAvailablePaymentMethods = () => {
    const methods: PaymentMethod[] = []
    if (storeSettings?.redemptionTypes.points) methods.push("points")
    if (storeSettings?.redemptionTypes.pix) methods.push("pix")
    if (storeSettings?.redemptionTypes.card) methods.push("card")
    if (storeSettings?.redemptionTypes.free) methods.push("free")
    return methods
  }
  
  const handlePaymentMethodSelect = () => {
    setStep("review")
  }

  // Create line items helper
  const createLineItems = () => {
    return cart.map((item, index) => {
      let sku = ""
      if (item.id.startsWith("cp_")) {
        const companyProduct = getCompanyProductById(item.id)
        if (companyProduct) {
          sku = companyProduct.finalSku || ""
          if (companyProduct.stockQuantity < item.quantity) {
            throw new Error(`Estoque insuficiente para ${item.name}. Disponível: ${companyProduct.stockQuantity}, Solicitado: ${item.quantity}`)
          }
          updateCompanyProduct(item.id, {
            stockQuantity: companyProduct.stockQuantity - item.quantity,
          })
        }
      } else {
        const products = getProducts()
        const product = products.find((p) => p.id === item.id)
        if (product) {
          sku = product.sku || ""
          const stock = product.stockQuantity || product.stock || 0
          if (stock < item.quantity) {
            throw new Error(`Estoque insuficiente para ${item.name}. Disponível: ${stock}, Solicitado: ${item.quantity}`)
          }
        }
      }
      
      return {
        id: `li_${Date.now()}_${item.id}_${index}`,
        productId: item.id,
        name: item.name,
        sku: sku,
        quantity: item.quantity,
        price: item.pointsCost,
        total: item.pointsCost * item.quantity,
      }
    })
  }

  const handleCheckout = async () => {
    if (!currentUser) return

    const currencyPlural = getCurrencyName(companyId, true)
    
    // Only validate points balance if paying with points
    if (paymentMethod === "points" && currentUser.points < cartTotalPoints) {
      toast({
        title: "Saldo insuficiente",
        description: `Você precisa de ${cartTotalPoints.toLocaleString("pt-BR")} ${currencyPlural.toUpperCase()}, mas tem apenas ${currentUser.points.toLocaleString("pt-BR")}.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const lineItems = createLineItems()

      // Deduct points only if paying with points
      if (paymentMethod === "points") {
        deductPoints(currentUser.id, cartTotalPoints, `Compra: ${cart.map(i => i.name).join(", ")}`)
      }

      // Create order with appropriate payment info
      const order = createOrder({
        userId: currentUser.id,
        email: currentUser.email,
        lineItems,
        shipAddress: {
          firstname: currentUser.firstName,
          lastname: currentUser.lastName,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          stateCode: address.stateCode,
          zipcode: address.zipcode,
          phone: address.phone,
        },
        itemTotal: paymentMethod === "points" ? cartTotalPoints : cartTotalPrice,
        shipmentTotal: 0,
        total: paymentMethod === "points" ? cartTotalPoints : cartTotalPrice,
        paymentState: paymentMethod === "pix" || paymentMethod === "card" ? "balance_due" : "paid",
        paymentMethod: paymentMethod,
        paidWithPoints: paymentMethod === "points" ? cartTotalPoints : 0,
        paidWithMoney: paymentMethod !== "points" && paymentMethod !== "free" ? cartTotalPrice : 0,
        state: paymentMethod === "pix" || paymentMethod === "card" ? "payment" : "complete",
      } as any)

      // For PIX/Card, create demo payment and show simulation screen
      if (paymentMethod === "pix") {
        const payment = createDemoPixPayment(order.id, order.number, cartTotalPrice)
        setDemoPayment(payment)
        setStep("pix_payment")
        setIsSubmitting(false)
        return
      }
      
      if (paymentMethod === "card") {
        // Show card form step
        setDemoPayment({ 
          id: "", 
          orderId: order.id, 
          orderNumber: order.number, 
          method: "card", 
          amount: cartTotalPrice, 
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        setStep("card_payment")
        setIsSubmitting(false)
        return
      }

      // For points/free, complete immediately
      eventBus.emit("sandbox" as Env, "order.created" as any, order)
      localStorage.removeItem("yoobe_cart")

      toast({
        title: "Pedido realizado!",
        description: "Seu pedido foi processado com sucesso.",
      })

      router.push(`/loja/pedido/${order.id}`)
    } catch (error) {
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle PIX payment confirmation (simulated)
  const handleConfirmPixPayment = async () => {
    if (!demoPayment) return
    
    setIsSubmitting(true)
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const confirmedPayment = confirmDemoPayment(demoPayment.id)
    if (confirmedPayment) {
      eventBus.emit("sandbox" as Env, "order.created" as any, { id: demoPayment.orderId })
      localStorage.removeItem("yoobe_cart")
      
      toast({
        title: "Pagamento confirmado!",
        description: "Seu pagamento via PIX foi processado com sucesso.",
      })
      
      router.push(`/loja/pedido/${demoPayment.orderId}`)
    }
    
    setIsSubmitting(false)
  }
  
  // Handle Card payment submission (simulated)
  const handleSubmitCardPayment = async () => {
    if (!demoPayment || !cardForm.number || !cardForm.holder || !cardForm.expiry || !cardForm.cvv) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos do cartão.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate card processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create card payment record
    const cardLastFour = cardForm.number.replace(/\s/g, "").slice(-4)
    const cardBrand = detectCardBrand(cardForm.number)
    
    const payment = createDemoCardPayment(
      demoPayment.orderId,
      demoPayment.orderNumber,
      demoPayment.amount,
      cardLastFour,
      cardBrand
    )
    
    // Confirm immediately (simulated success)
    const confirmedPayment = confirmDemoPayment(payment.id)
    
    if (confirmedPayment) {
      eventBus.emit("sandbox" as Env, "order.created" as any, { id: demoPayment.orderId })
      localStorage.removeItem("yoobe_cart")
      
      toast({
        title: "Pagamento aprovado!",
        description: `Cartão ${cardBrand} ****${cardLastFour} processado com sucesso.`,
      })
      
      router.push(`/loja/pedido/${demoPayment.orderId}`)
    }
    
    setIsSubmitting(false)
  }
  
  // Detect card brand from number
  const detectCardBrand = (number: string): string => {
    const cleanNumber = number.replace(/\s/g, "")
    if (/^4/.test(cleanNumber)) return "Visa"
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard"
    if (/^3[47]/.test(cleanNumber)) return "Amex"
    if (/^6(?:011|5)/.test(cleanNumber)) return "Discover"
    if (/^(?:2131|1800|35)/.test(cleanNumber)) return "JCB"
    return "Cartão"
  }
  
  // Copy PIX code to clipboard
  const handleCopyPixCode = () => {
    if (demoPayment?.pixCode) {
      navigator.clipboard.writeText(demoPayment.pixCode)
      setPixCopied(true)
      toast({
        title: "Código copiado!",
        description: "Cole o código PIX no seu app de pagamentos.",
      })
      setTimeout(() => setPixCopied(false), 3000)
    }
  }
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16)
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(" ") : cleaned
  }
  
  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4)
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2)
    }
    return cleaned
  }

  if (!currentUser || cart.length === 0) {
    return null
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Finalizar Compra</h1>
            <p className="text-muted-foreground mt-2">Complete seu pedido em poucos passos</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4">
          <div className={cn("flex items-center gap-2", step === "address" && "text-primary")}>
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center border-2",
              step === "address" ? "bg-primary text-primary-foreground border-primary" : 
              step === "payment" || step === "review" ? "bg-green-500 text-white border-green-500" : "bg-muted border-muted-foreground"
            )}>
              {step === "payment" || step === "review" ? <CheckCircle2 className="h-4 w-4" /> : 1}
            </div>
            <span className="font-medium">Endereço</span>
          </div>
          <div className="flex-1 h-0.5 bg-muted" />
          {getAvailablePaymentMethods().length > 1 && (
            <>
              <div className={cn("flex items-center gap-2", step === "payment" && "text-primary")}>
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2",
                  step === "payment" ? "bg-primary text-primary-foreground border-primary" : 
                  step === "review" ? "bg-green-500 text-white border-green-500" : "bg-muted border-muted-foreground"
                )}>
                  {step === "review" ? <CheckCircle2 className="h-4 w-4" /> : 2}
                </div>
                <span className="font-medium">Pagamento</span>
              </div>
              <div className="flex-1 h-0.5 bg-muted" />
            </>
          )}
          <div className={cn("flex items-center gap-2", step === "review" && "text-primary")}>
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center border-2",
              step === "review" ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-muted-foreground"
            )}>
              {getAvailablePaymentMethods().length > 1 ? 3 : 2}
            </div>
            <span className="font-medium">Revisão</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === "address" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Endereço de Entrega
                  </CardTitle>
                  <CardDescription>Selecione um endereço salvo ou adicione um novo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Saved Addresses List */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Seus endereços salvos</Label>
                      <div className="grid gap-3">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectAddress(addr)}
                            className={cn(
                              "w-full p-4 rounded-lg border-2 flex items-start gap-4 text-left transition-all hover:border-primary/50",
                              selectedAddressId === addr.id && !isNewAddress
                                ? "border-primary bg-primary/5"
                                : "border-muted"
                            )}
                          >
                            <div className={cn(
                              "p-2 rounded-lg shrink-0",
                              selectedAddressId === addr.id && !isNewAddress
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}>
                              {addr.label.toLowerCase().includes("casa") || addr.label.toLowerCase().includes("home") ? (
                                <Home className="h-5 w-5" />
                              ) : (
                                <Building2 className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold truncate">{addr.label}</p>
                                {addr.isDefault && (
                                  <Badge variant="secondary" className="text-xs">Padrão</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{addr.address1}</p>
                              <p className="text-sm text-muted-foreground">
                                {addr.city} - {addr.stateCode}, {addr.zipcode}
                              </p>
                            </div>
                            {selectedAddressId === addr.id && !isNewAddress && (
                              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Add New Address Button */}
                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className={cn(
                          "w-full p-4 rounded-lg border-2 border-dashed flex items-center gap-4 transition-all hover:border-primary/50",
                          isNewAddress ? "border-primary bg-primary/5" : "border-muted"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          isNewAddress ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Plus className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Usar outro endereço</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Address Form - show when no saved addresses or adding new */}
                  {(savedAddresses.length === 0 || isNewAddress) && (
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      {savedAddresses.length > 0 && (
                        <div className="pb-4 border-b">
                          <Label className="text-sm font-medium">Novo endereço de entrega</Label>
                        </div>
                      )}
                      <div>
                        <Label htmlFor="address1">Endereço *</Label>
                        <Input
                          id="address1"
                          value={address.address1}
                          onChange={(e) => setAddress({ ...address, address1: e.target.value })}
                          placeholder="Rua, número"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address2">Complemento</Label>
                        <Input
                          id="address2"
                          value={address.address2}
                          onChange={(e) => setAddress({ ...address, address2: e.target.value })}
                          placeholder="Apartamento, bloco, etc."
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="city">Cidade *</Label>
                          <Input
                            id="city"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            placeholder="Cidade"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="stateCode">Estado *</Label>
                          <Input
                            id="stateCode"
                            value={address.stateCode}
                            onChange={(e) => setAddress({ ...address, stateCode: e.target.value })}
                            placeholder="UF"
                            maxLength={2}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="zipcode">CEP *</Label>
                          <Input
                            id="zipcode"
                            value={address.zipcode}
                            onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
                            placeholder="00000-000"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                      </div>
                      
                      {/* Save Address Checkbox */}
                      {isNewAddress && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Checkbox
                            id="saveAddress"
                            checked={saveNewAddress}
                            onCheckedChange={(checked) => setSaveNewAddress(checked as boolean)}
                          />
                          <Label htmlFor="saveAddress" className="text-sm cursor-pointer">
                            Salvar este endereço para compras futuras
                          </Label>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button type="submit">Continuar para Revisão</Button>
                      </div>
                    </form>
                  )}
                  
                  {/* Continue button when using saved address */}
                  {savedAddresses.length > 0 && !isNewAddress && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button onClick={handleAddressSubmit}>Continuar para Revisão</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Forma de Pagamento
                  </CardTitle>
                  <CardDescription>Escolha como deseja pagar pelo seu pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {storeSettings?.redemptionTypes.points && (
                    <button
                      onClick={() => setPaymentMethod("points")}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all hover:border-primary/50",
                        paymentMethod === "points" ? "border-primary bg-primary/5" : "border-muted"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-lg",
                        paymentMethod === "points" ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Coins className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{getCurrencyName(companyId, true).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          Usar seu saldo de {currentUser?.points?.toLocaleString("pt-BR") || 0} {getCurrencyName(companyId, true)}
                        </p>
                      </div>
                      <Badge variant={paymentMethod === "points" ? "default" : "outline"}>
                        {cartTotalPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                      </Badge>
                    </button>
                  )}

                  {storeSettings?.redemptionTypes.pix && (
                    <button
                      onClick={() => setPaymentMethod("pix")}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all hover:border-primary/50",
                        paymentMethod === "pix" ? "border-primary bg-primary/5" : "border-muted"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-lg",
                        paymentMethod === "pix" ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <QrCode className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">PIX</p>
                        <p className="text-sm text-muted-foreground">
                          Pagamento instantâneo via PIX
                        </p>
                      </div>
                      <Badge variant={paymentMethod === "pix" ? "default" : "outline"}>
                        R$ {cartTotalPrice.toFixed(2)}
                      </Badge>
                    </button>
                  )}

                  {storeSettings?.redemptionTypes.card && (
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all hover:border-primary/50",
                        paymentMethod === "card" ? "border-primary bg-primary/5" : "border-muted"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-lg",
                        paymentMethod === "card" ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">Cartão de Crédito/Débito</p>
                        <p className="text-sm text-muted-foreground">
                          Pague com seu cartão
                        </p>
                      </div>
                      <Badge variant={paymentMethod === "card" ? "default" : "outline"}>
                        R$ {cartTotalPrice.toFixed(2)}
                      </Badge>
                    </button>
                  )}

                  {storeSettings?.redemptionTypes.free && cartTotalPoints === 0 && (
                    <button
                      onClick={() => setPaymentMethod("free")}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all hover:border-primary/50",
                        paymentMethod === "free" ? "border-primary bg-primary/5" : "border-muted"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-lg",
                        paymentMethod === "free" ? "bg-green-500 text-white" : "bg-muted"
                      )}>
                        <Gift className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">Resgate Gratuito</p>
                        <p className="text-sm text-muted-foreground">
                          Sem custo para você
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Grátis
                      </Badge>
                    </button>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={() => setStep("address")}>
                      Voltar
                    </Button>
                    <Button onClick={handlePaymentMethodSelect} className="flex-1">
                      Continuar para Revisão
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Revisar Pedido
                  </CardTitle>
                  <CardDescription>Confirme os detalhes antes de finalizar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Items */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Itens do Pedido
                    </h3>
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
                        {item.images?.[0] ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="h-16 w-16 rounded object-cover bg-muted"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg"
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.pointsCost.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)} × {item.quantity}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {(item.pointsCost * item.quantity).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço de Entrega
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{address.address1}</p>
                      {address.address2 && <p>{address.address2}</p>}
                      <p>{address.city} - {address.stateCode}</p>
                      <p className="font-mono">{address.zipcode}</p>
                      {address.phone && <p>Tel: {address.phone}</p>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep("address")}>
                      Alterar Endereço
                    </Button>
                  </div>

                  {/* Selected Payment Method */}
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Forma de Pagamento
                    </h3>
                    <div className="flex items-center gap-3">
                      {paymentMethod === "points" && <Coins className="h-5 w-5 text-primary" />}
                      {paymentMethod === "pix" && <QrCode className="h-5 w-5 text-primary" />}
                      {paymentMethod === "card" && <CreditCard className="h-5 w-5 text-primary" />}
                      {paymentMethod === "free" && <Gift className="h-5 w-5 text-green-500" />}
                      <span className="font-medium">
                        {paymentMethod === "points" && getCurrencyName(companyId, true).toUpperCase()}
                        {paymentMethod === "pix" && "PIX"}
                        {paymentMethod === "card" && "Cartão de Crédito/Débito"}
                        {paymentMethod === "free" && "Resgate Gratuito"}
                      </span>
                      <Badge variant="outline">
                        {paymentMethod === "points" && `${cartTotalPoints.toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)}`}
                        {paymentMethod === "pix" && `R$ ${cartTotalPrice.toFixed(2)}`}
                        {paymentMethod === "card" && `R$ ${cartTotalPrice.toFixed(2)}`}
                        {paymentMethod === "free" && "Grátis"}
                      </Badge>
                    </div>
                    {getAvailablePaymentMethods().length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => setStep("payment")}>
                        Alterar Forma de Pagamento
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(getAvailablePaymentMethods().length > 1 ? "payment" : "address")}>
                      Voltar
                    </Button>
                    <Button onClick={handleCheckout} disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : "Confirmar Pedido"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PIX Payment Simulation Step */}
            {step === "pix_payment" && demoPayment && (
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-teal-600" />
                    Pagamento via PIX
                  </CardTitle>
                  <CardDescription>
                    Escaneie o QR Code ou copie o código para pagar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* QR Code Mock */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-xl border-2 border-dashed border-muted">
                      <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="h-24 w-24 mx-auto text-gray-600" />
                          <p className="text-xs text-muted-foreground mt-2">QR Code PIX</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Amount */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Valor a pagar</p>
                    <p className="text-3xl font-bold text-primary">
                      R$ {demoPayment.amount.toFixed(2)}
                    </p>
                  </div>

                  {/* PIX Copy/Paste Code */}
                  <div className="space-y-2">
                    <Label>Código PIX Copia e Cola</Label>
                    <div className="flex gap-2">
                      <Input
                        value={demoPayment.pixCode || ""}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyPixCode}
                        className={cn(pixCopied && "bg-green-100 text-green-600")}
                      >
                        {pixCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Demo Notice */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Modo Demo:</strong> Este é um ambiente de demonstração. 
                      Clique em &quot;Confirmar Pagamento&quot; para simular a confirmação do PIX.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setStep("review")
                        setDemoPayment(null)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleConfirmPixPayment} 
                      disabled={isSubmitting}
                      className="flex-1 bg-teal-600 hover:bg-teal-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Confirmando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Confirmar Pagamento
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Card Payment Simulation Step */}
            {step === "card_payment" && demoPayment && (
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-violet-600" />
                    Pagamento com Cartão
                  </CardTitle>
                  <CardDescription>
                    Preencha os dados do seu cartão
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Card Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ 
                          ...cardForm, 
                          number: formatCardNumber(e.target.value) 
                        })}
                        maxLength={19}
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardHolder">Nome no Cartão</Label>
                      <Input
                        id="cardHolder"
                        placeholder="NOME COMPLETO"
                        value={cardForm.holder}
                        onChange={(e) => setCardForm({ 
                          ...cardForm, 
                          holder: e.target.value.toUpperCase() 
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Validade</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/AA"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ 
                            ...cardForm, 
                            expiry: formatExpiry(e.target.value) 
                          })}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          placeholder="000"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ 
                            ...cardForm, 
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 4) 
                          })}
                          maxLength={4}
                          type="password"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Amount */}
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Valor a pagar</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {demoPayment.amount.toFixed(2)}
                    </p>
                    {cardForm.number && (
                      <Badge variant="outline" className="mt-2">
                        {detectCardBrand(cardForm.number)} ****{cardForm.number.replace(/\s/g, "").slice(-4)}
                      </Badge>
                    )}
                  </div>

                  {/* Demo Notice */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Modo Demo:</strong> Use qualquer número de cartão válido (ex: 4111 1111 1111 1111).
                      O pagamento será simulado automaticamente.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setStep("review")
                        setDemoPayment(null)
                        setCardForm({ number: "", holder: "", expiry: "", cvv: "" })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSubmitCardPayment} 
                      disabled={isSubmitting || !cardForm.number || !cardForm.holder || !cardForm.expiry || !cardForm.cvv}
                      className="flex-1 bg-violet-600 hover:bg-violet-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pagar R$ {demoPayment.amount.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                      <span className="font-medium">{(item.pointsCost * item.quantity).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">{cartTotalPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span className="font-medium">Grátis</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{cartTotalPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}</span>
                  </div>
                </div>
                {currentUser ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Wallet className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Seu saldo</p>
                      <p className="font-bold text-primary">
                        {(currentUser.points ?? 0).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-muted">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Carregando saldo...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
