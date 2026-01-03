"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  Package, 
  ShoppingCart,
  Loader2,
  Zap,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Mail,
  Truck,
  Box,
  TrendingDown,
  Eye,
  DollarSign,
  Layers,
  Info,
} from "lucide-react"
import { 
  getBaseProducts, 
  ensureBaseProductsSeeded, 
  getCompanyProductsByCompany,
  createBudget,
  createBudgetItem,
  getBudgetById,
  getCompanyById,
  getUserById,
  getCurrencyName,
  cloneProductToCompany,
  getCostCentersByCompany,
  seedCostCenters,
  type BaseProduct, 
  type Company,
  type User,
  type CostCenter,
} from "@/lib/storage"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useDemoState } from "@/hooks/use-demo-state"

interface CartItem {
  baseProductId: string
  name: string
  qty: number
  unitPrice: number
  unitPoints: number
  image?: string
  isDigital?: boolean
}

export default function CatalogPage() {
  const router = useRouter()
  const { env } = useDemoState()
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([])
  const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [company, setCompany] = useState<Company | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // Cart state
  const [cart, setCart] = useState<Record<string, CartItem>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [showMobileCart, setShowMobileCart] = useState(false)
  
  // Product detail modal
  const [selectedProduct, setSelectedProduct] = useState<BaseProduct | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  
  // Cost center selection
  const [costCenters, setCostCenters] = useState<CostCenter[]>([])
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>("")

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        const user = getUserById(auth.userId)
        if (user) {
          setCurrentUser(user)
        }
        
        if (auth.companyId) {
          setCompanyId(auth.companyId)
          const companyData = getCompanyById(auth.companyId)
          if (companyData) {
            setCompany(companyData)
          }
          
          // Get products the company already owns
          const companyProducts = getCompanyProductsByCompany(auth.companyId)
          const ownedIds = new Set(companyProducts.map(cp => cp.baseProductId).filter(Boolean))
          setOwnedProductIds(ownedIds)
          
          // Load cost centers
          seedCostCenters(auth.companyId)
          const centers = getCostCentersByCompany(auth.companyId)
          setCostCenters(centers)
          if (centers.length > 0) {
            setSelectedCostCenter(centers[0].id)
          }
        }
      } catch (error) {
        console.error("Error parsing auth:", error)
      }
    }
    
    // Load base products from master catalog
    ensureBaseProductsSeeded()
    const products = getBaseProducts()
    setBaseProducts(products)
    setIsLoading(false)
  }, [])

  // Get unique categories for filter
  const categories = Array.from(new Set(baseProducts.map(p => p.category).filter(Boolean)))
  
  // Filter products: exclude owned + apply search/category filters
  const availableProducts = baseProducts.filter(bp => {
    // Exclude products already owned by company
    if (ownedProductIds.has(bp.id)) return false
    
    // Text search
    const matchesSearch = bp.name.toLowerCase().includes(search.toLowerCase()) ||
      (bp.description?.toLowerCase().includes(search.toLowerCase()))
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || bp.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Cart functions
  const handleQuantityChange = (productId: string, delta: number) => {
    const product = baseProducts.find(p => p.id === productId)
    if (!product) return

    setCart(prev => {
      const current = prev[productId]
      const newQty = Math.max(0, (current?.qty || 0) + delta)
      
      if (newQty === 0) {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      }

      // Use actual product price from catalog
      const unitPrice = product.price || 99.90
      const unitPoints = Math.round(unitPrice * 6)

      return {
        ...prev,
        [productId]: {
          baseProductId: productId,
          name: product.name,
          qty: newQty,
          unitPrice: current?.unitPrice || unitPrice,
          unitPoints: current?.unitPoints || unitPoints,
          image: product.images?.[0],
          isDigital: product.isDigital,
        }
      }
    })
  }

  const handleSetQuantity = (productId: string, qty: number) => {
    const product = baseProducts.find(p => p.id === productId)
    if (!product) return

    if (qty <= 0) {
      setCart(prev => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
      return
    }

    // Use actual product price from catalog
    const unitPrice = product.price || 99.90
    const unitPoints = Math.round(unitPrice * 6)

    setCart(prev => ({
      ...prev,
      [productId]: {
        baseProductId: productId,
        name: product.name,
        qty,
        unitPrice: prev[productId]?.unitPrice || unitPrice,
        unitPoints: prev[productId]?.unitPoints || unitPoints,
        image: product.images?.[0],
        isDigital: product.isDigital,
      }
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const updated = { ...prev }
      delete updated[productId]
      return updated
    })
  }

  const clearCart = () => {
    setCart({})
  }

  // Open product detail modal
  const handleOpenProductDetail = (product: BaseProduct) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  // Calculate price based on quantity tiers
  const calculatePriceForQuantity = (product: BaseProduct, qty: number): number => {
    if (!product.priceTiers || product.priceTiers.length === 0) {
      return product.price || 99.90
    }
    
    const tier = product.priceTiers.find(t => 
      qty >= t.minQuantity && (t.maxQuantity === null || qty <= t.maxQuantity)
    )
    
    return tier?.price || product.price || 99.90
  }

  const cartItems = Object.values(cart)
  const totalCash = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0)
  const totalPoints = cartItems.reduce((sum, item) => sum + (item.unitPoints * item.qty), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0)

  // Submit budget
  const handleSubmitBudget = async () => {
    if (cartItems.length === 0) {
      toast.error("Adicione pelo menos um produto ao carrinho.")
      return
    }

    if (!currentUser) {
      toast.error("Usuário não encontrado. Faça login novamente.")
      return
    }

    if (!company) {
      toast.error("Empresa não encontrada. Verifique sua configuração.")
      return
    }

    setIsSubmitting(true)
    try {
      // Get selected cost center info
      const selectedCC = costCenters.find(cc => cc.id === selectedCostCenter)
      
      const budget = createBudget({
        companyId: company.id,
        title: `Orçamento - ${new Date().toLocaleDateString("pt-BR")}`,
        status: "submitted",
        budgetType: "new",
        totalCash,
        totalPoints,
        costCenterId: selectedCostCenter || undefined,
        costCenterName: selectedCC?.name || undefined,
        requestedById: currentUser.id,
        requestedByName: currentUser.name,
        createdBy: currentUser.id,
        updatedBy: currentUser.id,
        submittedAt: new Date().toISOString(),
      })

      cartItems.forEach(item => {
        createBudgetItem({
          budgetId: budget.id,
          baseProductId: item.baseProductId,
          qty: item.qty,
          unitPrice: item.unitPrice,
          unitPoints: item.unitPoints,
          subtotalCash: item.unitPrice * item.qty,
          subtotalPoints: item.unitPoints * item.qty,
        })
      })

      const verifiedBudget = getBudgetById(budget.id)
      if (!verifiedBudget) {
        throw new Error("Falha ao criar orçamento")
      }

      toast.success(`Orçamento enviado com ${cartItems.length} produto(s)!`)
      clearCart()
      
      setTimeout(() => {
        router.push(`/gestor/budgets?highlight=${budget.id}`)
      }, 100)
    } catch (error: unknown) {
      console.error("Error creating budget:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(errorMessage || "Ocorreu um erro ao processar seu orçamento.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Direct clone for sandbox mode
  const handleDirectClone = async () => {
    if (cartItems.length === 0) {
      toast.error("Adicione pelo menos um produto ao carrinho.")
      return
    }

    if (!company) {
      toast.error("Empresa não encontrada. Verifique sua configuração.")
      return
    }

    setIsCloning(true)
    try {
      let successCount = 0
      let errorCount = 0

      for (const item of cartItems) {
        const result = cloneProductToCompany(
          item.baseProductId,
          company.id,
          {
            price: item.unitPrice,
            pointsCost: item.unitPoints,
            stockQuantity: item.qty,
            isActive: true,
          }
        )

        if (result) {
          successCount++
        } else {
          errorCount++
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} produto(s) adicionado(s) ao seu catálogo!`)
        clearCart()
        
        // Refresh owned products
        const updatedCompanyProducts = getCompanyProductsByCompany(company.id)
        const newOwnedIds = new Set(updatedCompanyProducts.map(cp => cp.baseProductId).filter(Boolean))
        setOwnedProductIds(newOwnedIds)
      }
      
      if (errorCount > 0) {
        toast.warning(`${errorCount} produto(s) não puderam ser adicionados.`)
      }
    } catch (error: unknown) {
      console.error("Error cloning products:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(errorMessage || "Ocorreu um erro ao adicionar os produtos.")
    } finally {
      setIsCloning(false)
    }
  }

  const isSandboxMode = env === "sandbox"

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de Produtos</h1>
          <p className="text-muted-foreground text-sm">
            Selecione os produtos que deseja adicionar ao seu catálogo
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/gestor/budgets")} className="gap-2">
          <Package className="h-4 w-4" /> Meus Orçamentos
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Disponíveis</p>
          <p className="text-2xl font-bold">{availableProducts.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Já Possui</p>
          <p className="text-2xl font-bold text-green-600">{ownedProductIds.size}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-muted-foreground">Categorias</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, descrição..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Cart Button */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => setShowMobileCart(true)}
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
              {totalItems}
            </Badge>
          </Button>
        </div>
      )}

      {/* Mobile Cart Overlay */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileCart(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Seu Carrinho</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileCart(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <CartContent 
              cartItems={cartItems}
              totalCash={totalCash}
              totalPoints={totalPoints}
              companyId={companyId}
              isSubmitting={isSubmitting}
              isCloning={isCloning}
              isSandboxMode={isSandboxMode}
              costCenters={costCenters}
              selectedCostCenter={selectedCostCenter}
              onCostCenterChange={setSelectedCostCenter}
              onRemove={removeFromCart}
              onClear={clearCart}
              onSubmit={handleSubmitBudget}
              onClone={handleDirectClone}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[280px] bg-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold">Nenhum produto disponível</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {ownedProductIds.size > 0 
                  ? "Você já possui todos os produtos do catálogo." 
                  : "Não há produtos no catálogo mestre."}
              </p>
              {ownedProductIds.size > 0 && (
                <Button variant="outline" onClick={() => router.push("/gestor/produtos-cadastrados")}>
                  Ver Meus Produtos
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableProducts.map((product) => {
                const inCart = cart[product.id]
                const qty = inCart?.qty || 0

                const stockAvailable = product.stockAvailable || 0
                const hasPriceTiers = product.priceTiers && product.priceTiers.length > 0

                return (
                  <Card 
                    key={product.id} 
                    className={cn(
                      "overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col",
                      qty > 0 && "ring-2 ring-primary shadow-md"
                    )}
                  >
                    {/* Image Container - Clickable for details */}
                    <div 
                      className="aspect-square bg-slate-50 relative overflow-hidden cursor-pointer"
                      onClick={() => handleOpenProductDetail(product)}
                    >
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <div className={cn(
                        "absolute inset-0 flex items-center justify-center bg-slate-100",
                        product.images?.[0] ? "hidden" : ""
                      )}>
                        <Package className="h-12 w-12 text-slate-300" />
                      </div>
                      
                      {/* Category Badge */}
                      {product.category && (
                        <Badge className="absolute top-2 left-2 text-[10px]" variant="secondary">
                          {product.category}
                        </Badge>
                      )}
                      
                      {/* Digital/Physical + Stock Badges */}
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                        <div className="flex gap-1">
                          {product.isDigital ? (
                            <Badge className="bg-purple-500 text-white text-[9px] gap-1">
                              <Mail className="h-3 w-3" />
                              Digital
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-500 text-white text-[9px] gap-1">
                              <Truck className="h-3 w-3" />
                              Físico
                            </Badge>
                          )}
                        </div>
                        {/* Stock Indicator */}
                        {stockAvailable > 0 && (
                          <Badge className={cn(
                            "text-[9px] gap-1",
                            stockAvailable > 50 ? "bg-green-500 text-white" : 
                            stockAvailable > 10 ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                          )}>
                            <Box className="h-3 w-3" />
                            {stockAvailable} un.
                          </Badge>
                        )}
                      </div>
                      
                      {/* Qty Badge when in cart */}
                      {qty > 0 && (
                        <Badge className="absolute top-2 right-2 bg-primary text-[10px]">
                          {qty}x
                        </Badge>
                      )}
                      
                      {/* Price Tiers Indicator */}
                      {hasPriceTiers && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          {qty === 0 && (
                            <Badge className="bg-amber-500 text-white text-[9px] gap-1">
                              <TrendingDown className="h-3 w-3" />
                              Desconto Qtd.
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Hover overlay for details */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Badge className="bg-white text-slate-800 shadow-lg">
                            <Eye className="h-3 w-3 mr-1" /> Ver Detalhes
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="p-4 pb-2 grow">
                      <CardTitle 
                        className="text-sm font-bold line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleOpenProductDetail(product)}
                      >
                        {product.name}
                      </CardTitle>
                      {product.description && (
                        <CardDescription className="text-xs line-clamp-2 mt-1.5">
                          {product.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0 space-y-3">
                      {/* Price Display */}
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-primary">
                          R$ {(product.price || 99.90).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        {hasPriceTiers && (
                          <p className="text-[10px] text-muted-foreground">
                            A partir de R$ {Math.min(...product.priceTiers!.map(t => t.price)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em quantidade
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        {qty === 0 ? (
                          <Button 
                            className="w-full gap-2" 
                            size="sm"
                            onClick={() => handleQuantityChange(product.id, 1)}
                          >
                            <Plus className="h-4 w-4" /> Adicionar
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 w-full">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 shrink-0"
                              onClick={() => handleQuantityChange(product.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={qty}
                              onChange={(e) => handleSetQuantity(product.id, parseInt(e.target.value) || 0)}
                              className="h-9 text-center flex-1 font-medium"
                              min={0}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 shrink-0"
                              onClick={() => handleQuantityChange(product.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Cart Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Carrinho
                </CardTitle>
                {cartItems.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearCart} className="text-xs h-7">
                    Limpar
                  </Button>
                )}
              </div>
              <CardDescription>
                {cartItems.length === 0 
                  ? "Nenhum item selecionado" 
                  : `${cartItems.length} produto(s), ${totalItems} unidade(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CartContent 
                cartItems={cartItems}
                totalCash={totalCash}
                totalPoints={totalPoints}
                companyId={companyId}
                isSubmitting={isSubmitting}
                isCloning={isCloning}
                isSandboxMode={isSandboxMode}
                costCenters={costCenters}
                selectedCostCenter={selectedCostCenter}
                onCostCenterChange={setSelectedCostCenter}
                onRemove={removeFromCart}
                onClear={clearCart}
                onSubmit={handleSubmitBudget}
                onClone={handleDirectClone}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700">
          <strong>Dica:</strong> Adicione produtos ao carrinho e envie um orçamento para aprovação. Após aprovado, os produtos serão disponibilizados no seu catálogo.
        </p>
      </div>

      {/* Product Detail Modal */}
      <ResponsiveModal
        open={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        title={selectedProduct?.name || "Detalhes do Produto"}
        description={selectedProduct?.category || ""}
        maxWidth="2xl"
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative">
              {selectedProduct.images?.[0] ? (
                <img 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-slate-300" />
                </div>
              )}
            </div>

            {/* Description */}
            {selectedProduct.description && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Descrição
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            )}

            {/* Stock & Price Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="border-none shadow-sm">
                <CardContent className="pt-4 pb-3 text-center">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xl font-bold text-primary">
                    R$ {(selectedProduct.price || 99.90).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] uppercase text-muted-foreground font-medium">Preço Unitário</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="pt-4 pb-3 text-center">
                  <Box className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-xl font-bold">
                    {selectedProduct.stockAvailable || 0}
                  </p>
                  <p className="text-[10px] uppercase text-muted-foreground font-medium">Estoque Disponível</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm col-span-2 md:col-span-1">
                <CardContent className="pt-4 pb-3 text-center">
                  <Layers className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                  <p className="text-xl font-bold">
                    {selectedProduct.priceTiers?.length || 0}
                  </p>
                  <p className="text-[10px] uppercase text-muted-foreground font-medium">Faixas de Preço</p>
                </CardContent>
              </Card>
            </div>

            {/* Price Tiers Table */}
            {selectedProduct.priceTiers && selectedProduct.priceTiers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  Preços por Quantidade
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Quantidade</th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">Preço Unit.</th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">Desconto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedProduct.priceTiers.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            {tier.minQuantity} - {tier.maxQuantity === null ? '∞' : tier.maxQuantity} un.
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            R$ {tier.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {tier.discount > 0 ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                -{tier.discount}%
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Separator />

            {/* Quick Add Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Adicionar ao Carrinho</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => {
                      const current = cart[selectedProduct.id]?.qty || 0
                      if (current > 0) {
                        handleQuantityChange(selectedProduct.id, -1)
                      }
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={cart[selectedProduct.id]?.qty || 0}
                    onChange={(e) => handleSetQuantity(selectedProduct.id, parseInt(e.target.value) || 0)}
                    className="h-10 text-center w-20"
                    min={0}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleQuantityChange(selectedProduct.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    if (!cart[selectedProduct.id]) {
                      handleQuantityChange(selectedProduct.id, 1)
                    }
                    setIsProductModalOpen(false)
                    toast.success("Produto adicionado ao carrinho!")
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {cart[selectedProduct.id] ? 'Atualizar Carrinho' : 'Adicionar'}
                </Button>
              </div>
              
              {/* Price Preview */}
              {cart[selectedProduct.id] && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cart[selectedProduct.id].qty}x R$ {calculatePriceForQuantity(selectedProduct, cart[selectedProduct.id].qty).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="font-bold text-primary">
                      R$ {(cart[selectedProduct.id].qty * calculatePriceForQuantity(selectedProduct, cart[selectedProduct.id].qty)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
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

// Cart Content Component (shared between mobile and desktop)
function CartContent({
  cartItems,
  totalCash,
  totalPoints,
  companyId,
  isSubmitting,
  isCloning,
  isSandboxMode,
  costCenters,
  selectedCostCenter,
  onCostCenterChange,
  onRemove,
  onClear,
  onSubmit,
  onClone,
}: {
  cartItems: CartItem[]
  totalCash: number
  totalPoints: number
  companyId: string
  isSubmitting: boolean
  isCloning: boolean
  isSandboxMode: boolean
  costCenters: CostCenter[]
  selectedCostCenter: string
  onCostCenterChange: (value: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onSubmit: () => void
  onClone: () => void
}) {
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">Carrinho vazio</p>
        <p className="text-xs mt-1">Adicione produtos para continuar</p>
      </div>
    )
  }

  const selectedCC = costCenters.find(cc => cc.id === selectedCostCenter)

  return (
    <div className="space-y-4">
      {/* Cost Center Selector */}
      {costCenters.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase">Centro de Custos</Label>
          <Select value={selectedCostCenter} onValueChange={onCostCenterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o Centro de Custo" />
            </SelectTrigger>
            <SelectContent>
              {costCenters.map(cc => (
                <SelectItem key={cc.id} value={cc.id}>
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{cc.name}</span>
                    <Badge variant="outline" className="text-[10px] ml-2">
                      R$ {cc.availableBudget.toLocaleString('pt-BR')}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCC && (
            <div className="p-2 bg-slate-50 rounded-lg space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Saldo Disponível:</span>
                <span className={cn(
                  "font-bold",
                  selectedCC.availableBudget >= totalCash ? "text-green-600" : "text-red-600"
                )}>
                  R$ {selectedCC.availableBudget.toLocaleString('pt-BR')}
                </span>
              </div>
              <Progress 
                value={(selectedCC.usedBudget / selectedCC.allocatedBudget) * 100} 
                className="h-1.5"
              />
              {totalCash > selectedCC.availableBudget && (
                <p className="text-[10px] text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  Orçamento excede o saldo disponível
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cart Items */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.baseProductId} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50">
            {item.image && (
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium truncate">{item.name}</p>
                {item.isDigital && (
                  <Mail className="h-3 w-3 text-purple-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.qty}x R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-red-500"
              onClick={() => onRemove(item.baseProductId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total em R$:</span>
          <span className="font-bold text-lg">R$ {totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total em {getCurrencyName(companyId, true).toUpperCase()}:</span>
          <span className="font-bold">{totalPoints.toLocaleString("pt-BR")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button 
          className="w-full h-11" 
          onClick={onSubmit}
          disabled={isSubmitting || isCloning}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Enviar Orçamento
            </>
          )}
        </Button>
        
        {isSandboxMode && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onClone}
            disabled={isSubmitting || isCloning}
          >
            {isCloning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adicionando...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Adicionar Direto (Sandbox)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
