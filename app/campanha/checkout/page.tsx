"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Package, MapPin, ShoppingCart, Wallet, CheckCircle2, Sparkles, Plus, Home, Building2 } from "lucide-react"
import {
  getLandingPageBySlug,
  getCompanyProductById,
  updateCompanyProduct,
  createUser,
  getUserByEmail,
  getUserById,
  addTagToEmployee,
  getCompanyById,
  createOrder,
  deductPoints,
  addPoints,
  getCurrencyName,
  getStorage,
  getUserAddresses,
  saveUserAddress,
  type LandingPage,
  type User,
  type SavedAddress,
} from "@/lib/storage"
import { eventBus } from "@/lib/eventBus"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  quantity: number
  pointsCost: number
  price: number
  images?: string[]
  stockQuantity?: number
}

function CampanhaCheckoutPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const landingPageSlug = searchParams.get("lp") || undefined

  const [cart, setCart] = useState<CartItem[]>([])
  const [step, setStep] = useState<"address" | "review">("address")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null)
  const [companyId, setCompanyId] = useState("company_1")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [email, setEmail] = useState("")

  // Address form state
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
  const [isNewAddress, setIsNewAddress] = useState(true)
  const [saveNewAddress, setSaveNewAddress] = useState(true)

  useEffect(() => {
    // Load landing page if slug provided
    if (landingPageSlug) {
      const page = getLandingPageBySlug(landingPageSlug)
      if (page) {
        setLandingPage(page)
        setCompanyId(page.companyId)
      }
    }

    // Check if user is authenticated
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        const user = auth.userId ? getUserById(auth.userId) : getUserByEmail(auth.email)
        if (user) {
          setCurrentUser(user)
          setEmail(user.email)
          
          // Load saved addresses
          const addresses = getUserAddresses(user.id)
          setSavedAddresses(addresses)
          
          // Pre-select default address or first address
          if (addresses.length > 0) {
            const defaultAddress = addresses.find(a => a.isDefault) || addresses[0]
            setSelectedAddressId(defaultAddress.id)
            setAddress({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              address1: defaultAddress.address1 || "",
              address2: defaultAddress.address2 || "",
              city: defaultAddress.city || "",
              stateCode: defaultAddress.stateCode || "",
              zipcode: defaultAddress.zipcode || "",
              phone: defaultAddress.phone || user.phone || "",
            })
            setIsNewAddress(false)
          } else {
            // No saved addresses, use user's main address as fallback
            setAddress({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              address1: user.address?.address1 || "",
              address2: user.address?.address2 || "",
              city: user.address?.city || "",
              stateCode: user.address?.stateCode || "",
              zipcode: user.address?.zipcode || "",
              phone: user.phone || "",
            })
            setIsNewAddress(true)
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    // Load campaign cart
    const savedCart = localStorage.getItem("yoobe_campaign_cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        setCart(cartData)
      } catch {
        router.push("/campanha/loja" + (landingPageSlug ? `?lp=${landingPageSlug}` : ""))
      }
    } else {
      router.push("/campanha/loja" + (landingPageSlug ? `?lp=${landingPageSlug}` : ""))
    }
  }, [router, landingPageSlug])

  const cartTotalPoints = cart.reduce((sum, item) => sum + (item.pointsCost || 0) * item.quantity, 0)
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.firstName || !address.lastName || !address.email || !address.address1 || !address.city || !address.stateCode || !address.zipcode) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    // Validate email
    if (!address.email.includes("@")) {
      toast.error("Por favor, insira um email válido")
      return
    }

    // Save new address to user's profile if requested and user exists
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
        isDefault: savedAddresses.length === 0,
      })
      
      if (newAddress) {
        const updatedAddresses = getUserAddresses(currentUser.id)
        setSavedAddresses(updatedAddresses)
        setSelectedAddressId(newAddress.id)
        setIsNewAddress(false)
      }
    }

    setStep("review")
  }
  
  // Handle selecting a saved address
  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id)
    setAddress({
      ...address,
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
      ...address,
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

  const handleCheckout = async () => {
    setIsSubmitting(true)

    try {
      // Get or create user
      let user = getUserByEmail(address.email)
      const company = getCompanyById(companyId)

      if (!user) {
        // Create new user
        try {
          const initialPoints = cartTotalPoints > 0 ? cartTotalPoints : 1000
          user = createUser({
            email: address.email,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            role: "member",
            points: initialPoints, // Give enough points for the current order
            tags: [],
            companyId: companyId,
            address: {
              address1: address.address1,
              address2: address.address2,
              city: address.city,
              stateCode: address.stateCode,
              zipcode: address.zipcode,
              country: "BR",
            },
          })
        } catch (error) {
          // Se email já existe, tentar buscar novamente (pode ter sido criado em outra aba)
          user = getUserByEmail(address.email)
          if (!user) {
            toast.error(error instanceof Error ? error.message : "Erro ao criar usuário")
            setIsSubmitting(false)
            return
          }
        }

        // Assign tags from landing page if available
        if (landingPage) {
          for (const tagId of landingPage.assignedTags) {
            addTagToEmployee(user.id, tagId)
          }
        }

        // Set auth
        const authData = {
          userId: user.id,
          email: user.email,
          role: user.role,
          companyId: companyId,
          storeId: company?.stores?.[0]?.id || null,
        }
        localStorage.setItem("yoobe_auth", JSON.stringify(authData))
        
        // Update currentUser state to reflect the newly created/updated user
        setCurrentUser(user)
      } else {
        // User exists, but might have 0 points if they were created differently
        if (cartTotalPoints > 0 && user.points < cartTotalPoints) {
          // Top up points for demo purposes
          addPoints(user.id, cartTotalPoints - user.points, "Recarga automática de demonstração")
          // Reload user object
          user = getUserByEmail(address.email)!
        }
        
        // Save new address to user's profile if it's a new address and saveNewAddress is true
        if (isNewAddress && saveNewAddress && address.address1) {
          saveUserAddress(user.id, {
            label: savedAddresses.length === 0 ? "Endereço Principal" : `Endereço ${savedAddresses.length + 1}`,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            stateCode: address.stateCode,
            zipcode: address.zipcode,
            phone: address.phone,
            country: "BR",
            isDefault: savedAddresses.length === 0,
          })
        }
        
        // Update currentUser state to reflect the updated user
        setCurrentUser(user)
      }

      // Check if user has enough points (if using points)
      const currencyPlural = getCurrencyName(companyId, true)
      if (cartTotalPoints > 0 && user.points < cartTotalPoints) {
        toast.error(
          `Saldo insuficiente. Você precisa de ${cartTotalPoints} ${currencyPlural.toUpperCase()}, mas tem apenas ${user.points}.`
        )
        setIsSubmitting(false)
        return
      }

      // Create line items
      const lineItems = cart.map((item, index) => {
        let sku = ""
        if (item.id.startsWith("cp_")) {
          const companyProduct = getCompanyProductById(item.id)
          if (companyProduct) {
            sku = companyProduct.finalSku || ""
            // Validate stock
            const availableStock = companyProduct.stockQuantity || 0
            if (availableStock < item.quantity) {
              throw new Error(
                `Estoque insuficiente para ${item.name}. Disponível: ${availableStock}, Solicitado: ${item.quantity}`
              )
            }
            // Deduct stock
            updateCompanyProduct(item.id, {
              stockQuantity: availableStock - item.quantity,
            })
          }
        }

        return {
          id: `li_${Date.now()}_${item.id}_${index}`,
          productId: item.id,
          name: item.name,
          sku: sku,
          quantity: item.quantity,
          price: cartTotalPoints > 0 ? item.pointsCost : item.price,
          total: cartTotalPoints > 0 ? item.pointsCost * item.quantity : item.price * item.quantity,
        }
      })

      // Deduct points if using points
      if (cartTotalPoints > 0) {
        deductPoints(user.id, cartTotalPoints, `Compra Campanha: ${cart.map((i) => i.name).join(", ")}`)
      }

      // Create order
      const order = createOrder({
        userId: user.id,
        email: user.email,
        lineItems,
        shipAddress: {
          firstname: address.firstName,
          lastname: address.lastName,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          stateCode: address.stateCode,
          zipcode: address.zipcode,
          phone: address.phone,
        },
        itemTotal: cartTotalPoints > 0 ? cartTotalPoints : cartTotalPrice,
        shipmentTotal: 0,
        total: cartTotalPoints > 0 ? cartTotalPoints : cartTotalPrice,
        paymentState: "paid",
        paidWithPoints: cartTotalPoints,
        paidWithMoney: cartTotalPoints > 0 ? 0 : cartTotalPrice,
        state: "complete",
      })

      // Emit order created event for Wow effect (confetti etc)
      eventBus.emit("sandbox" as any, "order.created" as any, { 
        orderId: order.id, 
        number: order.number,
        isCampaign: true 
      })

      // Clear campaign cart
      localStorage.removeItem("yoobe_campaign_cart")

      toast.success("Pedido realizado com sucesso!")

      // Redirect to order status or success page
      router.push(`/campanha/pedido/${order.id}${landingPageSlug ? `?lp=${landingPageSlug}` : ""}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar pedido. Tente novamente."
      if (process.env.NODE_ENV === 'development') {
        console.error("[Checkout] Erro fatal:", error)
      }
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return null
  }

  // Apply landing page styles
  const styles = landingPage
    ? {
        "--primary-color": landingPage.primaryColor,
        "--secondary-color": landingPage.secondaryColor,
        "--background-color": landingPage.backgroundColor,
        "--text-color": landingPage.textColor,
      }
    : {}

  return (
    <div className="min-h-screen" style={styles}>
      {/* Header */}
      <div
        className="w-full py-8 border-b"
        style={{
          backgroundColor: landingPage?.backgroundColor || "#ffffff",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/campanha/loja${landingPageSlug ? `?lp=${landingPageSlug}` : ""}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Loja
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" style={{ color: landingPage?.primaryColor }} />
              <h1
                className="text-2xl font-bold"
                style={{ color: landingPage?.textColor || "#1f2937" }}
              >
                Finalizar Compra
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container mx-auto px-4 py-8"
        style={{ backgroundColor: landingPage?.backgroundColor || "#ffffff" }}
      >
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex items-center gap-2",
                step === "address" && "text-primary"
              )}
              style={step === "address" ? { color: landingPage?.primaryColor } : {}}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2",
                  step === "address"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted border-muted-foreground"
                )}
                style={
                  step === "address"
                    ? {
                        backgroundColor: landingPage?.primaryColor,
                        borderColor: landingPage?.primaryColor,
                        color: "#ffffff",
                      }
                    : {}
                }
              >
                1
              </div>
              <span className="font-medium">Endereço</span>
            </div>
            <div className="flex-1 h-0.5 bg-muted" />
            <div
              className={cn("flex items-center gap-2", step === "review" && "text-primary")}
              style={step === "review" ? { color: landingPage?.primaryColor } : {}}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2",
                  step === "review"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted border-muted-foreground"
                )}
                style={
                  step === "review"
                    ? {
                        backgroundColor: landingPage?.primaryColor,
                        borderColor: landingPage?.primaryColor,
                        color: "#ffffff",
                      }
                    : {}
                }
              >
                2
              </div>
              <span className="font-medium">Revisão</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === "address" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Informações de Entrega
                  </CardTitle>
                  <CardDescription>
                    {savedAddresses.length > 0 
                      ? "Selecione um endereço salvo ou adicione um novo"
                      : "Preencha seus dados para receber o pedido"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Saved Addresses List - only show if user is logged in and has addresses */}
                  {currentUser && savedAddresses.length > 0 && (
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
                            style={
                              selectedAddressId === addr.id && !isNewAddress
                                ? { borderColor: landingPage?.primaryColor, backgroundColor: landingPage?.primaryColor + "10" }
                                : {}
                            }
                          >
                            <div className={cn(
                              "p-2 rounded-lg shrink-0",
                              selectedAddressId === addr.id && !isNewAddress
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                            style={
                              selectedAddressId === addr.id && !isNewAddress
                                ? { backgroundColor: landingPage?.primaryColor, color: "#ffffff" }
                                : {}
                            }
                            >
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
                              <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: landingPage?.primaryColor }} />
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
                        style={
                          isNewAddress
                            ? { borderColor: landingPage?.primaryColor, backgroundColor: landingPage?.primaryColor + "10" }
                            : {}
                        }
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          isNewAddress ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
                        style={
                          isNewAddress
                            ? { backgroundColor: landingPage?.primaryColor, color: "#ffffff" }
                            : {}
                        }
                        >
                          <Plus className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Usar outro endereço</span>
                      </button>
                    </div>
                  )}

                  {/* Address Form - show when no saved addresses or adding new */}
                  {(savedAddresses.length === 0 || isNewAddress || !currentUser) && (
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      {savedAddresses.length > 0 && currentUser && (
                        <div className="pb-4 border-b">
                          <Label className="text-sm font-medium">Novo endereço de entrega</Label>
                        </div>
                      )}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="firstName">Nome *</Label>
                          <Input
                            id="firstName"
                            value={address.firstName}
                            onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                            placeholder="Seu nome"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Sobrenome *</Label>
                          <Input
                            id="lastName"
                            value={address.lastName}
                            onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                            placeholder="Seu sobrenome"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={address.email}
                          onChange={(e) => setAddress({ ...address, email: e.target.value })}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
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
                      
                      {/* Save Address Checkbox - only show for logged in users with new address */}
                      {currentUser && isNewAddress && (
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
                        <Button
                          type="submit"
                          style={
                            landingPage
                              ? {
                                  backgroundColor: landingPage.primaryColor,
                                  color: "#ffffff",
                                }
                              : {}
                          }
                        >
                          Continuar para Revisão
                        </Button>
                      </div>
                    </form>
                  )}
                  
                  {/* Continue button when using saved address */}
                  {currentUser && savedAddresses.length > 0 && !isNewAddress && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button 
                        onClick={handleAddressSubmit}
                        style={
                          landingPage
                            ? {
                                backgroundColor: landingPage.primaryColor,
                                color: "#ffffff",
                              }
                            : {}
                        }
                      >
                        Continuar para Revisão
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
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
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {cartTotalPoints > 0
                              ? `${(item.pointsCost || 0).toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)} × ${item.quantity}`
                              : `R$ ${(item.price || 0).toFixed(2)} × ${item.quantity}`}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {cartTotalPoints > 0
                            ? `${((item.pointsCost || 0) * item.quantity).toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)}`
                            : `R$ ${((item.price || 0) * item.quantity).toFixed(2)}`}
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
                      <p>
                        {address.firstName} {address.lastName}
                      </p>
                      <p>{address.email}</p>
                      <p>{address.address1}</p>
                      {address.address2 && <p>{address.address2}</p>}
                      <p>
                        {address.city} - {address.stateCode}
                      </p>
                      <p className="font-mono">{address.zipcode}</p>
                      {address.phone && <p>Tel: {address.phone}</p>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep("address")}>
                      Alterar Endereço
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep("address")}>
                      Voltar
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="flex-1"
                      style={
                        landingPage
                          ? {
                              backgroundColor: landingPage.primaryColor,
                              color: "#ffffff",
                            }
                          : {}
                      }
                    >
                      {isSubmitting ? "Processando..." : "Confirmar Pedido"}
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
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {cartTotalPoints > 0
                          ? `${((item.pointsCost || 0) * item.quantity).toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)}`
                          : `R$ ${((item.price || 0) * item.quantity).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {cartTotalPoints > 0
                        ? `${cartTotalPoints.toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)}`
                        : `R$ ${cartTotalPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span className="font-medium">Grátis</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      {cartTotalPoints > 0
                        ? `${cartTotalPoints.toLocaleString("pt-BR")} ${getCurrencyName(companyId, true)}`
                        : `R$ ${cartTotalPrice.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                {currentUser ? (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg border"
                    style={{
                      backgroundColor: landingPage?.primaryColor + "10",
                      borderColor: landingPage?.primaryColor + "30",
                    }}
                  >
                    <Wallet
                      className="h-4 w-4"
                      style={{ color: landingPage?.primaryColor }}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Seu saldo</p>
                      <p
                        className="font-bold"
                        style={{ color: landingPage?.primaryColor }}
                      >
                        {(currentUser.points ?? 0).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg border border-muted bg-muted/50"
                  >
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Seu saldo</p>
                      <p className="font-bold text-muted-foreground">
                        Preencha seus dados para ver seu saldo
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CampanhaCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <CampanhaCheckoutPageContent />
    </Suspense>
  )
}
