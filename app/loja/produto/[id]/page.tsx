"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  ShoppingCart, 
  CheckCircle2, 
  Package,
  Tag as TagIcon,
  Wallet,
  Minus,
  Plus,
  Layers,
  Palette,
  Building2,
  Check,
} from "lucide-react"
import { 
  getCompanyProductById, 
  getProducts, 
  getUserById, 
  getTagsByProductV3,
  getCompanyById,
  getCurrencyName,
  getBaseProductById,
  calculatePriceByQuantity,
  getProductCustomizationOptions,
  getSupplierById,
  type CompanyProduct,
  type Product,
  type User,
  type Company,
  type PriceTier,
  type CustomizationOption,
  type Supplier,
} from "@/lib/storage"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { BrandedProductImage } from "@/components/demo/branded-product-image"
import { getDemoProductById, type DemoProduct } from "@/lib/demo-products"

type ProductUnion = CompanyProduct | Product | DemoProduct

interface CartItem {
  id: string
  name: string
  quantity: number
  pointsCost: number
  price: number
  images?: string[]
  stockQuantity?: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<ProductUnion | null>(null)
  const [isCompanyProduct, setIsCompanyProduct] = useState(false)
  const [isDemoProduct, setIsDemoProduct] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<CartItem[]>([])
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([])
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOption[]>([])
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([])
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [currentTierPrice, setCurrentTierPrice] = useState<number | null>(null)
  const [currentDiscount, setCurrentDiscount] = useState<number>(0)
  const [baseProductPrice, setBaseProductPrice] = useState<number>(0)

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      const auth = JSON.parse(authData)
      const user = getUserById(auth.userId)
      setCurrentUser(user)
      
      if (auth.companyId) {
        setCompanyId(auth.companyId)
        const companyData = getCompanyById(auth.companyId)
        setCompany(companyData)
      }
    }

    // Load cart
    const savedCart = localStorage.getItem("yoobe_cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch {}
    }

    // Try CompanyProduct first (V3), then fallback to Product (V2), then Demo Products
    let found: ProductUnion | undefined
    let isCompany = false
    let isDemo = false
    
    // Check if it's a CompanyProduct (starts with cp_)
    if (productId.startsWith("cp_")) {
      found = getCompanyProductById(productId)
      if (found) {
        isCompany = true
      }
    }
    
    // If not found, try Product V2
    if (!found) {
      const products = getProducts()
      found = products.find(p => p.id === productId)
      if (found) {
        isCompany = false
      }
    }
    
    // If still not found, try Demo Products
    if (!found) {
      const demoProduct = getDemoProductById(productId)
      if (demoProduct) {
        found = demoProduct
        isDemo = true
        isCompany = false
      }
    }
    
    if (!found) {
      toast.error("O produto que você está procurando não existe.")
      router.push("/loja")
      return
    }
    
    setIsCompanyProduct(isCompany)
    setIsDemoProduct(isDemo)
    setProduct(found)

    // Set base product price
    if (isDemo) {
      setBaseProductPrice((found as DemoProduct).price || 0)
    } else if (isCompany) {
      setBaseProductPrice((found as CompanyProduct).price || 0)
    } else {
      setBaseProductPrice((found as Product).price || 0)
    }

    // Load price tiers, customization options and supplier from base product
    if (isCompany && found) {
      const companyProduct = found as CompanyProduct
      const baseProduct = getBaseProductById(companyProduct.baseProductId)
      if (baseProduct) {
        if (baseProduct.priceTiers) {
          setPriceTiers(baseProduct.priceTiers)
        }
        if (baseProduct.customizationOptionIds) {
          const options = getProductCustomizationOptions(baseProduct.id)
          setCustomizationOptions(options)
        }
        if (baseProduct.supplierId) {
          const sup = getSupplierById(baseProduct.supplierId)
          if (sup) setSupplier(sup)
        }
      }
    } else if (!isDemo && found) {
      // For base products directly
      const baseProduct = found as Product
      if ((baseProduct as any).priceTiers) {
        setPriceTiers((baseProduct as any).priceTiers)
      }
      if ((baseProduct as any).customizationOptionIds) {
        const options = getProductCustomizationOptions(baseProduct.id)
        setCustomizationOptions(options)
      }
      if ((baseProduct as any).supplierId) {
        const sup = getSupplierById((baseProduct as any).supplierId)
        if (sup) setSupplier(sup)
      }
    }

    // Set initial quantity if already in cart
    const inCart = savedCart ? JSON.parse(savedCart).find((item: CartItem) => item.id === productId) : null
    if (inCart) {
      setQuantity(inCart.quantity)
    }
  }, [productId, router])

  // Update price based on quantity tier
  useEffect(() => {
    if (priceTiers.length > 0 && baseProductPrice > 0) {
      const result = calculatePriceByQuantity(priceTiers, baseProductPrice, quantity)
      setCurrentTierPrice(result.price)
      setCurrentDiscount(result.discount)
    } else {
      setCurrentTierPrice(null)
      setCurrentDiscount(0)
    }
  }, [quantity, priceTiers, baseProductPrice])

  const updateQuantity = (delta: number) => {
    if (!product) return
    let stock = 0
    if (isDemoProduct) {
      stock = (product as DemoProduct).stockQuantity || 0
    } else if (isCompanyProduct) {
      stock = (product as CompanyProduct).stockQuantity || 0
    } else {
      stock = (product as Product).stockQuantity || (product as Product).stock || 0
    }
    const newQuantity = Math.max(1, Math.min(stock, quantity + delta))
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (!product || !currentUser) {
      return
    }

    let pointsCost = 0
    if (isDemoProduct) {
      pointsCost = (product as DemoProduct).pointsCost || 0
    } else if (isCompanyProduct) {
      pointsCost = (product as CompanyProduct).pointsCost || 0
    } else {
      pointsCost = (product as Product).pointsCost || (product as Product).priceInPoints || 0
    }

    if (currentUser && currentUser.points < pointsCost * quantity) {
      const currencyPlural = getCurrencyName(companyId, true)
      toast.error(`Saldo insuficiente. Você precisa de ${(pointsCost * quantity).toLocaleString("pt-BR")} ${currencyPlural.toUpperCase()}, mas tem apenas ${currentUser.points.toLocaleString("pt-BR")}.`)
      return
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      let updatedCart: CartItem[]
      
      if (existingItem) {
        updatedCart = prevCart.map((item) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        updatedCart = [...prevCart, { ...product, quantity }]
      }

      // Persist immediately
      if (updatedCart.length > 0) {
        try {
          localStorage.setItem("yoobe_cart", JSON.stringify(updatedCart))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Erro ao salvar carrinho"
          if (process.env.NODE_ENV === 'development') {
            console.error("Error saving cart:", error)
          }
        }
      } else {
        localStorage.removeItem("yoobe_cart")
      }

      return updatedCart
    })

    // Dispatch cart update event (use setTimeout to avoid render-phase setState conflicts)
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"))
      window.dispatchEvent(new Event("openCart"))
    }, 0)

    toast.success(`${product.name} (${quantity}x) foi adicionado ao carrinho.`)
  }

  if (!product) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Carregando produto...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  // Normalize product fields for display
  let productPrice = 0
  let productPointsCost = 0
  let productStock = 0
  let productSku: string | undefined
  let productImages: string[] = []
  let productCategory: string | undefined

  if (isDemoProduct) {
    const demo = product as DemoProduct
    productPrice = demo.price || 0
    productPointsCost = demo.pointsCost || 0
    productStock = demo.stockQuantity || 0
    productSku = undefined
    productImages = demo.images || []
    productCategory = demo.category
  } else if (isCompanyProduct) {
    const cp = product as CompanyProduct
    productPrice = cp.price || 0
    productPointsCost = cp.pointsCost || 0
    productStock = cp.stockQuantity || 0
    productSku = cp.finalSku
    productImages = cp.images || []
    productCategory = cp.category
  } else {
    const p = product as Product
    productPrice = p.price || 0
    productPointsCost = p.pointsCost || p.priceInPoints || 0
    productStock = p.stockQuantity || p.stock || 0
    productSku = p.sku
    productImages = p.images || (p.image ? [p.image] : [])
    productCategory = p.category
  }

  // Demo products don't have tags, so only query for company/base products
  const productTags = isDemoProduct ? [] : getTagsByProductV3(product.id, isCompanyProduct ? "company" : "base")
  const inCart = cart.find((item) => item.id === product.id)
  const canAfford = currentUser && currentUser.points >= productPointsCost * quantity
  const isOutOfStock = productStock === 0

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="ghost" onClick={() => router.push("/loja")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à Loja
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-2">
              <div className="aspect-square bg-muted relative rounded-lg overflow-hidden">
                <BrandedProductImage
                  productImage={productImages?.[0] || "/placeholder.jpg"}
                  companyId={company?.id}
                  className="w-full h-full"
                  logoSize="lg"
                  logoPosition="center"
                />
              </div>
            </Card>
            {productImages && productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <BrandedProductImage
                      productImage={img || "/placeholder.jpg"}
                      companyId={company?.id}
                      className="w-full h-full"
                      logoSize="sm"
                      logoPosition="center"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl font-bold flex-1">{product.name}</h1>
                {productTags.length > 0 && (
                  <div className="flex gap-2 flex-wrap shrink-0">
                    {productTags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {product.description && (
                <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Price */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Preço Unitário</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold">
                        R$ {(currentTierPrice ?? productPrice).toFixed(2)}
                      </p>
                      {currentDiscount > 0 && (
                        <Badge className="bg-green-500 text-white">
                          -{currentDiscount}%
                        </Badge>
                      )}
                    </div>
                    {currentDiscount > 0 && (
                      <p className="text-sm text-muted-foreground line-through mt-1">
                        R$ {productPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-lg text-muted-foreground mt-1">
                      ou {productPointsCost.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Estoque</p>
                      {isOutOfStock ? (
                        <Badge variant="destructive" className="mt-1">
                          Esgotado
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {productStock} disponível{productStock !== 1 ? 'eis' : ''}
                        </Badge>
                      )}
                    </div>
                    {currentUser && (
                      <div>
                        <p className="text-sm text-muted-foreground">Seu Saldo</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Wallet className="h-4 w-4 text-primary" />
                          <span className="font-bold text-primary">
                            {currentUser.points.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Tiers */}
            {priceTiers.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Descontos por Quantidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {priceTiers.map((tier, idx) => {
                      const isActive = quantity >= tier.minQuantity && 
                        (tier.maxQuantity === null || quantity < tier.maxQuantity)
                      return (
                        <div 
                          key={idx}
                          className={cn(
                            "border rounded-lg p-3 text-center transition-colors",
                            isActive 
                              ? "border-primary bg-primary/5 ring-1 ring-primary" 
                              : "border-muted"
                          )}
                        >
                          <p className="text-xs text-muted-foreground">
                            {tier.minQuantity} - {tier.maxQuantity ?? '∞'} un.
                          </p>
                          <p className="font-bold text-lg">R$ {tier.price.toFixed(2)}</p>
                          {tier.discount > 0 && (
                            <Badge variant="secondary" className="text-[10px] mt-1">
                              {tier.discount}% off
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customization Options */}
            {customizationOptions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Personalização Disponível
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {customizationOptions.map((option) => (
                      <div 
                        key={option.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Palette className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{option.name}</p>
                            {option.description && (
                              <p className="text-xs text-muted-foreground">{option.description}</p>
                            )}
                          </div>
                        </div>
                        {option.additionalCost > 0 ? (
                          <Badge variant="outline">
                            +R$ {option.additionalCost.toFixed(2)}/un
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Incluído
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Supplier Info */}
            {supplier && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fornecedor</p>
                      <p className="font-medium">{supplier.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quantidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => updateQuantity(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1
                          setQuantity(Math.max(1, Math.min(productStock, val)))
                        }}
                        className="w-20 text-center border-0 focus-visible:ring-0"
                        min={1}
                        max={productStock}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => updateQuantity(1)}
                        disabled={quantity >= productStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">
                        {(productPointsCost * quantity).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add to Cart Button */}
            {!isOutOfStock && (
              <div className="space-y-2">
                {inCart && (
                  <p className="text-sm text-muted-foreground">
                    Você já tem {inCart.quantity} deste item no carrinho
                  </p>
                )}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!canAfford || isOutOfStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {inCart ? "Adicionar Mais ao Carrinho" : "Adicionar ao Carrinho"}
                </Button>
                {!canAfford && currentUser && (
                  <p className="text-sm text-destructive text-center">
                    Saldo insuficiente. Você precisa de {(productPointsCost * quantity).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}.
                  </p>
                )}
              </div>
            )}

            {/* Product Details */}
            {(productSku || productCategory) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações do Produto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {productSku && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-mono">{productSku}</span>
                    </div>
                  )}
                  {productCategory && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categoria:</span>
                      <span>{productCategory}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
