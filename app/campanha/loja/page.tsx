"use client"

import { Suspense, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  Eye,
  X,
  ArrowLeft,
} from "lucide-react"
import {
  getCampaignStoreProducts,
  getLandingPageBySlug,
  getCompanyById,
  type CompanyProduct,
  type LandingPage,
} from "@/lib/storage"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

function CampanhaLojaPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const landingPageSlug = searchParams.get("lp") || undefined
  const isPreviewMode = searchParams.get("preview") === "true"

  const [products, setProducts] = useState<CompanyProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<CompanyProduct[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null)
  const [companyId, setCompanyId] = useState("company_1")
  const [showPreviewBanner, setShowPreviewBanner] = useState(true)

  useEffect(() => {
    let currentCompanyId = companyId

    // Get company ID from landing page or default
    if (landingPageSlug) {
      const page = getLandingPageBySlug(landingPageSlug)
      if (page) {
        setLandingPage(page)
        currentCompanyId = page.companyId
        setCompanyId(page.companyId)
      }
    } else {
      // Get company ID from auth if available
      const authData = localStorage.getItem("yoobe_auth")
      if (authData) {
        try {
          const auth = JSON.parse(authData)
          if (auth.companyId) {
            currentCompanyId = auth.companyId
            setCompanyId(auth.companyId)
          }
        } catch (e) {
          // Ignore
        }
      }
    }

    // Load products using the determined company ID
    const campaignProducts = getCampaignStoreProducts(currentCompanyId, landingPageSlug)
    setProducts(campaignProducts)
    setFilteredProducts(campaignProducts)

    // Load cart (skip in preview mode - don't persist anything)
    if (!isPreviewMode) {
      const savedCart = localStorage.getItem("yoobe_campaign_cart")
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart)
          setCart(cartData)
        } catch {
          // Invalid cart data
        }
      }
    }

    setIsLoading(false)
  }, [landingPageSlug, isPreviewMode]) // Removed companyId from deps to avoid loop, we set it inside

  useEffect(() => {
    // Filter products based on search
    if (!searchTerm) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.finalSku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const addToCart = (product: CompanyProduct, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      let newCart: any[]

      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newCart = [
          ...prevCart,
          {
            ...product,
            quantity,
          },
        ]
      }

      // Persist cart (skip in preview mode)
      if (!isPreviewMode) {
        localStorage.setItem("yoobe_campaign_cart", JSON.stringify(newCart))
      }
      return newCart
    })

    if (isPreviewMode) {
      toast.info(`${product.name} adicionado (modo preview)`, {
        description: "Nenhum dado será salvo no modo preview"
      })
    } else {
      toast.success(`${product.name}${quantity > 1 ? ` (${quantity}x)` : ""} adicionado ao carrinho!`)
    }
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId)
      // Persist (skip in preview mode)
      if (!isPreviewMode) {
        if (newCart.length > 0) {
          localStorage.setItem("yoobe_campaign_cart", JSON.stringify(newCart))
        } else {
          localStorage.removeItem("yoobe_campaign_cart")
        }
      }
      return newCart
    })
    toast.success("Item removido do carrinho")
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
      // Persist (skip in preview mode)
      if (!isPreviewMode) {
        localStorage.setItem("yoobe_campaign_cart", JSON.stringify(newCart))
      }
      return newCart
    })
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price > 0 ? item.price : item.pointsCost || 0
      return total + price * item.quantity
    }, 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  // Apply landing page styles if available
  const styles = landingPage
    ? {
        "--primary-color": landingPage.primaryColor,
        "--secondary-color": landingPage.secondaryColor,
        "--background-color": landingPage.backgroundColor,
        "--text-color": landingPage.textColor,
      }
    : {}

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={styles}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={styles}>
      {/* Preview Mode Banner */}
      {isPreviewMode && showPreviewBanner && (
        <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 px-4 py-3 shadow-md">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Modo Preview - Loja de Campanha</p>
                <p className="text-xs opacity-80">
                  Explore a loja como um usuário faria. Nenhuma ação será salva.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {landingPageSlug && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-amber-950"
                  onClick={() => router.push(`/landing/${landingPageSlug}?preview=true`)}
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Voltar
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-amber-950 hover:bg-amber-600/20"
                onClick={() => setShowPreviewBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div
        className="w-full py-16 md:py-24 text-center"
        style={{
          background: landingPage
            ? `linear-gradient(135deg, ${landingPage.primaryColor} 0%, ${landingPage.secondaryColor} 100%)`
            : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          color: "#ffffff",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            {isPreviewMode && <Eye className="h-6 w-6 opacity-70" />}
            <Sparkles className="h-8 w-8" />
            <h1 className="text-4xl md:text-6xl font-bold">
              {landingPage?.title || "Loja de Campanha"}
            </h1>
          </div>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            {landingPage?.welcomeMessage ||
              "Resgate seus produtos exclusivos da campanha"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="container mx-auto px-4 py-8"
        style={{ backgroundColor: landingPage?.backgroundColor || "#ffffff" }}
      >
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="mt-4"
                >
                  Limpar busca
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id)
              const inCart = !!cartItem

              return (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative w-full h-48 bg-muted overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {product.stockQuantity > 0 && (
                      <Badge
                        className="absolute top-2 right-2 bg-green-500 text-white"
                        variant="default"
                      >
                        Em estoque
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {product.price > 0 ? (
                          <span className="text-xl font-bold">
                            R$ {product.price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xl font-bold">
                            {product.pointsCost || 0} pts
                          </span>
                        )}
                      </div>
                      {product.stockQuantity > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {product.stockQuantity} disponíveis
                        </Badge>
                      )}
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                          className="flex-1"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="flex-1 text-center font-semibold">
                          {cartItem.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                          className="flex-1"
                          disabled={cartItem.quantity >= product.stockQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        style={
                          landingPage
                            ? {
                                backgroundColor: landingPage.primaryColor,
                                color: "#ffffff",
                              }
                            : {}
                        }
                        onClick={() => addToCart(product)}
                        disabled={product.stockQuantity === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Cart Summary - Fixed Bottom */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {getCartItemsCount() > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                      style={
                        landingPage
                          ? {
                              backgroundColor: landingPage.primaryColor,
                            }
                          : {}
                      }
                    >
                      {getCartItemsCount()}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {getCartItemsCount()} item(s) no carrinho
                    {isPreviewMode && <span className="text-xs text-amber-600 ml-2">(preview)</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: R$ {getCartTotal().toFixed(2)}
                  </p>
                </div>
              </div>
              {isPreviewMode ? (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    toast.info("Checkout disponível apenas no modo real", {
                      description: "No modo preview, você pode explorar a loja mas não pode finalizar pedidos."
                    })
                  }}
                  className="border-amber-500 text-amber-700 hover:bg-amber-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview do Checkout
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => router.push(`/campanha/checkout${landingPageSlug ? `?lp=${landingPageSlug}` : ""}`)}
                  style={
                    landingPage
                      ? {
                          backgroundColor: landingPage.primaryColor,
                          color: "#ffffff",
                        }
                      : {}
                  }
                >
                  Finalizar Pedido
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CampanhaLojaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <CampanhaLojaPageContent />
    </Suspense>
  )
}
