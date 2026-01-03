"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Plus, Minus, Package, Wallet, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { getCurrencyName, getUserById } from "@/lib/storage"
import { toast } from "sonner"
import { UserRole } from "@/lib/roles"

interface GlobalCartProps {
  className?: string
  userRole?: UserRole
}

interface CartItem {
  id: string
  name: string
  quantity: number
  pointsCost: number
  price: number
  images?: string[]
  stockQuantity?: number
}

export function GlobalCart({ className, userRole }: GlobalCartProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [prevCartCount, setPrevCartCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [companyId, setCompanyId] = useState<string>("company_1")
  const { theme } = useTheme()
  const isFunMode = theme === "fun"

  // Lógica de visibilidade do carrinho baseada no papel do usuário:
  // - superAdmin: NUNCA mostrar (admin não compra nada)
  // - manager: só mostrar se está em /loja OU tem itens no carrinho
  // - member: SEMPRE mostrar (é o uso principal deles)
  const shouldShowCart = useMemo(() => {
    if (userRole === "superAdmin") return false
    if (userRole === "manager") {
      const isInStoreContext = pathname.startsWith("/loja")
      return isInStoreContext || cartCount > 0
    }
    return true // member sempre vê
  }, [userRole, pathname, cartCount])

  useEffect(() => {
    // Load initial cart count
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("yoobe_cart")
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart)
          const count = cartData.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
          setCartCount(prevCount => {
            setPrevCartCount(prevCount)
            return count
          })
          setCart(cartData)
        } catch {
          setCartCount(0)
          setCart([])
        }
      } else {
        setCartCount(prevCount => {
          setPrevCartCount(prevCount)
          return 0
        })
        setCart([])
      }
    }

    // Get company ID
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch {}
    }

    updateCartCount()

    // Listen for storage changes (cart updates from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "yoobe_cart") {
        updateCartCount()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events (same-tab updates)
    const handleCartUpdate = () => {
      updateCartCount()
    }

    // Listen for openCart event to open the modal
    const handleOpenCart = () => {
      // Read directly from localStorage to avoid stale state
      const savedCart = localStorage.getItem("yoobe_cart")
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart)
          if (cartData.length > 0) {
            setIsOpen(true)
          }
        } catch {
          // Invalid cart data, ignore
        }
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("openCart", handleOpenCart)

    // Poll for changes (fallback for same-tab updates)
    const interval = setInterval(updateCartCount, 500)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("openCart", handleOpenCart)
      clearInterval(interval)
    }
  }, []) // Remove cartCount dependency to prevent infinite loop

  const handleClick = () => {
    if (cartCount > 0) {
      setIsOpen(true)
    } else {
      router.push("/loja")
    }
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    const savedCart = localStorage.getItem("yoobe_cart")
    if (!savedCart) return

    try {
      const cartData = JSON.parse(savedCart)
      let newCart: CartItem[]

      if (quantity <= 0) {
        newCart = cartData.filter((item: CartItem) => item.id !== productId)
      } else {
        newCart = cartData.map((item: CartItem) =>
          item.id === productId ? { ...item, quantity } : item
        )
      }

      if (newCart.length > 0) {
        localStorage.setItem("yoobe_cart", JSON.stringify(newCart))
      } else {
        localStorage.removeItem("yoobe_cart")
      }

      // Trigger update
      window.dispatchEvent(new Event("cartUpdated"))
      setCart(newCart)
    } catch {
      toast.error("Erro ao atualizar carrinho")
    }
  }

  const removeFromCart = (productId: string) => {
    updateCartQuantity(productId, 0)
    toast.success("Item removido do carrinho")
  }

  const handleCheckout = () => {
    setIsOpen(false)
    router.push("/loja/checkout")
  }

  const cartTotalPoints = cart.reduce((sum, item) => sum + (item.pointsCost || 0) * item.quantity, 0)
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  const hasNewItems = cartCount > prevCartCount && prevCartCount > 0

  // Não renderizar o carrinho se não deve ser mostrado para o papel atual
  if (!shouldShowCart) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={isFunMode ? { scale: 1.1, rotate: 5 } : { scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn("relative", className)}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          className={cn(
            "relative h-9 w-9 rounded-lg transition-all",
            isFunMode && "hover:bg-primary/20"
          )}
          data-tour="cart"
        >
          <motion.div
            animate={hasNewItems ? {
              scale: [1, 1.3, 1],
              rotate: [0, -10, 10, 0],
            } : {}}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.div>

          <AnimatePresence>
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="absolute -top-1 -right-1"
              >
                <motion.div
                  animate={hasNewItems ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{
                    duration: 0.3,
                    repeat: hasNewItems ? 2 : 0,
                  }}
                >
                  <Badge
                    variant="destructive"
                    className={cn(
                      "h-5 w-5 flex items-center justify-center p-0 text-xs font-bold",
                      isFunMode && "ring-2 ring-primary/50 shadow-lg"
                    )}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulsing effect when items are added */}
          {hasNewItems && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-primary/20"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </Button>
      </motion.div>

      <ResponsiveModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Carrinho de Compras"
        description={`${cart.length} ${cart.length === 1 ? "item" : "itens"}`}
        maxWidth="lg"
        footer={
          cart.length > 0 ? (
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between text-sm border-t pt-3">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-lg font-bold">
                  {cartTotalPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                </span>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Finalizar Compra
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : null
        }
      >
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">Seu carrinho está vazio</p>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Product Image */}
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg"
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.pointsCost.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)} × {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        {(item.pointsCost * item.quantity).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Quantity Controls - Full Width Row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stockQuantity || 999)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </ResponsiveModal>
    </>
  )
}
