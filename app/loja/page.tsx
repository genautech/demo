"use client"

import { useState, useEffect, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ShoppingBag,
  Search,
  Filter,
  ShoppingCart,
  Wallet,
  Star,
  Tag as TagIcon,
  CheckCircle2,
  X,
} from "lucide-react"
import {
  getEligibleProducts,
  getUserById,
  getCompanyById,
  getTagsByEmployeeV3,
  getTagsByProductV3,
  deductPoints,
  createDemoOrder,
  getCurrencyName,
  getStoreSettings,
  type CompanyProduct,
  type User,
  type Company,
  type StoreSettings
} from "@/lib/storage"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BrandedProductImage } from "@/components/demo/branded-product-image"
import { DEMO_PRODUCTS } from "@/lib/demo-products"

interface CartItem {
  id: string
  name: string
  quantity: number
  pointsCost: number
  price: number
  images?: string[]
  stockQuantity?: number
}

export default function LojaPage() {
  const router = useRouter()
  const [products, setProducts] = useState<CompanyProduct[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})
  const [companyId, setCompanyId] = useState<string>("company_1")

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
        
        // Get store settings for redemption types
        const settings = getStoreSettings(auth.companyId)
        setStoreSettings(settings)

        // Get eligible products based on user tags
        const eligibleProducts = getEligibleProducts(user!, auth.companyId)
        
        // Enrich with Demo Products for the full experience
        const demoEnriched = [
          ...eligibleProducts,
          ...DEMO_PRODUCTS.filter(dp => !eligibleProducts.find(p => p.id === dp.id))
        ]
        
        setProducts(demoEnriched)
      }
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("yoobe_cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        setCart(cartData)
      } catch {
        // Invalid cart data, ignore
      }
    }

    setIsLoading(false)
  }, [])

  // Listen for cart updates from GlobalCart or other components
  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem("yoobe_cart")
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart)
          setCart(cartData)
        } catch (error) {
          // Invalid cart data, ignore
          if (process.env.NODE_ENV === 'development') {
            console.warn("Failed to parse cart data:", error)
          }
        }
      } else {
        setCart([])
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  // Cart persistence is now handled in addToCart/removeFromCart/updateCartQuantity

  const categories = [...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.finalSku && product.finalSku.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory && product.isActive
  })

  const addToCart = (product: CompanyProduct, quantity: number = 1) => {
    // Normalize product fields
    const normalizedProduct = {
      ...product,
      pointsCost: product.pointsCost || product.priceInPoints || 0,
      price: product.price || 0,
      stockQuantity: product.stockQuantity || product.stock || 0,
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === normalizedProduct.id)
      let newCart: CartItem[]
      
      if (existingItem) {
        newCart = prevCart.map((item) => 
          item.id === normalizedProduct.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newCart = [...prevCart, { ...normalizedProduct, quantity }]
      }
      
      // Persist immediately
      if (newCart.length > 0) {
        try {
          localStorage.setItem("yoobe_cart", JSON.stringify(newCart))
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Error saving cart:", error)
          }
        }
      } else {
        localStorage.removeItem("yoobe_cart")
      }
      
      return newCart
    })
    
    // Dispatch events AFTER state update (using setTimeout to avoid render-phase setState)
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"))
      window.dispatchEvent(new Event("openCart"))
    }, 0)
    
    toast.success(`${normalizedProduct.name}${quantity > 1 ? ` (${quantity}x)` : ''} foi adicionado ao carrinho.`)
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId)
      // Persist immediately
      if (newCart.length > 0) {
        localStorage.setItem("yoobe_cart", JSON.stringify(newCart))
      } else {
        localStorage.removeItem("yoobe_cart")
      }
      return newCart
    })
    // Dispatch event AFTER state update
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"))
    }, 0)
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
      // Persist immediately
      if (newCart.length > 0) {
        localStorage.setItem("yoobe_cart", JSON.stringify(newCart))
      } else {
        localStorage.removeItem("yoobe_cart")
      }
      return newCart
    })
    // Dispatch event AFTER state update
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"))
    }, 0)
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const cartTotalPoints = cart.reduce((sum, item) => sum + (item.pointsCost || item.priceInPoints || 0) * item.quantity, 0)

  const handleCheckout = () => {
    if (!currentUser) return

    const currencyPlural = getCurrencyName(companyId, true)
    if (currentUser && currentUser.points < cartTotalPoints) {
      toast.error(`Saldo insuficiente. Você precisa de ${cartTotalPoints} ${currencyPlural.toUpperCase()}, mas tem apenas ${currentUser.points}.`)
      return
    }

    // Save cart to localStorage and redirect to checkout
    localStorage.setItem("yoobe_cart", JSON.stringify(cart))
    window.location.href = "/loja/checkout"
  }

  const userTags = currentUser ? getTagsByEmployeeV3(currentUser.id) : []

  return (
    <AppShell>
      <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loja Corporativa</h1>
            <p className="mt-2 text-muted-foreground">
              {company?.name || "Sua loja"} • {filteredProducts.length} produtos disponíveis
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border bg-primary/5 px-4 py-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">
                {currentUser?.points?.toLocaleString("pt-BR") || 0} {getCurrencyName(companyId, true).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* User Tags */}
        {userTags.length > 0 && (
          <Card className="bg-linear-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 flex-wrap">
                <TagIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Suas tags:</span>
                {userTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="bg-primary/20 text-primary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative" data-tour="search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2" data-tour="filters">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-1">
            {filteredProducts.slice(0, 1).map((product) => {
              // Adicionar data-tour apenas no primeiro produto para o tour
              return (
                <div key={`tour-${product.id}`} data-tour="product-card" style={{ display: 'none' }} />
              )
            })}
            {filteredProducts.map((product) => {
              const productTags = getTagsByProductV3(product.id, "company")
              const inCart = cart.find((item) => item.id === product.id)
              const cartQuantity = inCart?.quantity || 0

              return (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col border-2 hover:border-primary/20">
                  <Link 
                    href={`/loja/produto/${product.id}`}
                    className="relative aspect-square bg-muted overflow-hidden block"
                    onClick={() => {}}
                  >
                    <BrandedProductImage
                      productImage={product.images?.[0] || "/placeholder.jpg"}
                      companyId={company?.id}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      logoSize="md"
                      logoPosition="center"
                    />
                    {(product.stockQuantity || product.stock || 0) === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
                        <Badge variant="destructive" className="text-sm px-3 py-1">Esgotado</Badge>
                      </div>
                    )}
                  </Link>
                  <CardHeader className="pb-3 px-4 pt-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg line-clamp-2 flex-1 font-semibold group-hover:text-primary transition-colors">{product.name}</CardTitle>
                      {productTags.length > 0 && (
                        <div className="flex gap-1 flex-wrap shrink-0">
                          {productTags.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0 px-4 pb-4">
                    {/* Price and Stock Section */}
                    <div className="space-y-3">
                      {/* Price */}
                      <div>
                        {/* Display prices based on enabled redemption types */}
                        {(() => {
                          const hasMonetaryPayment = storeSettings?.redemptionTypes?.pix || storeSettings?.redemptionTypes?.card
                          const hasPointsPayment = storeSettings?.redemptionTypes?.points
                          const hasFreeRedemption = storeSettings?.redemptionTypes?.free
                          const pointsCost = product.pointsCost || product.priceInPoints || 0
                          const monetaryPrice = product.price || 0
                          
                          // If it's a free item (0 points or price)
                          if (hasFreeRedemption && pointsCost === 0 && monetaryPrice === 0) {
                            return (
                              <p className="text-2xl font-bold text-green-600">Grátis</p>
                            )
                          }
                          
                          // Show based on enabled redemption types
                          return (
                            <>
                              {hasMonetaryPayment && monetaryPrice > 0 && (
                                <p className="text-2xl font-bold">R$ {monetaryPrice.toFixed(2)}</p>
                              )}
                              {hasPointsPayment && pointsCost > 0 && (
                                <p className={`text-sm ${hasMonetaryPayment && monetaryPrice > 0 ? 'text-muted-foreground' : 'text-2xl font-bold text-primary'}`}>
                                  {hasMonetaryPayment && monetaryPrice > 0 ? 'ou ' : ''}
                                  {pointsCost.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                                </p>
                              )}
                              {!hasMonetaryPayment && !hasPointsPayment && hasFreeRedemption && (
                                <p className="text-2xl font-bold text-green-600">Resgate Disponível</p>
                              )}
                            </>
                          )
                        })()}
                      </div>
                      {/* Stock Badge */}
                      {(product.stockQuantity || product.stock || 0) > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 w-fit">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {product.stockQuantity || product.stock || 0} em estoque
                        </Badge>
                      )}
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateCartQuantity(product.id, cartQuantity - 1)
                          }}
                        >
                          -
                        </Button>
                        <span className="flex-1 text-center font-medium">{cartQuantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateCartQuantity(product.id, cartQuantity + 1)
                          }}
                          disabled={cartQuantity >= product.stockQuantity}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromCart(product.id)
                          }}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              const currentQty = productQuantities[product.id] || 1
                              const newQty = Math.max(1, currentQty - 1)
                              setProductQuantities({ ...productQuantities, [product.id]: newQty })
                            }}
                            disabled={(productQuantities[product.id] || 1) <= 1}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={productQuantities[product.id] || 1}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1
                              const max = product.stockQuantity || 0
                              const newQty = Math.max(1, Math.min(max, val))
                              setProductQuantities({ ...productQuantities, [product.id]: newQty })
                            }}
                            className="w-16 text-center"
                            min={1}
                            max={product.stockQuantity || product.stock || 0}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              const currentQty = productQuantities[product.id] || 1
                              const newQty = Math.min(product.stockQuantity || 0, currentQty + 1)
                              setProductQuantities({ ...productQuantities, [product.id]: newQty })
                            }}
                            disabled={(productQuantities[product.id] || 1) >= (product.stockQuantity || product.stock || 0)}
                          >
                            +
                          </Button>
                        </div>
                        {(() => {
                          const stockQty = product.stockQuantity || product.stock || 0
                          const qty = productQuantities[product.id] || 1
                          const pointsCost = product.pointsCost || product.priceInPoints || 0
                          const userPoints = currentUser?.points || 0
                          const requiredCost = pointsCost * qty
                          const isStockZero = stockQty === 0
                          const isInsufficientPoints = userPoints < requiredCost
                          const isDisabled = isStockZero || isInsufficientPoints
                          
                          return (
                            <Button
                              className="w-full font-semibold"
                              onClick={(e) => {
                                e.stopPropagation()
                                addToCart(product, qty)
                              }}
                              disabled={isDisabled}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Adicionar ao Carrinho
                            </Button>
                          )
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
              {userTags.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Você não possui tags atribuídas. Entre em contato com seu gestor.
                </p>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </AppShell>
  )
}
