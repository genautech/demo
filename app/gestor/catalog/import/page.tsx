"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Plus, 
  Minus, 
  Package, 
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Zap,
  Loader2,
  Mail,
  Truck,
  Filter,
} from "lucide-react"
import { getBaseProducts, ensureBaseProductsSeeded, createBudget, createBudgetItem, getBudgetById, getCompanyById, getUserById, getCurrencyName, cloneProductToCompany, type BaseProduct, type BudgetItem, type User, type Company } from "@/lib/storage"
import { toast } from "sonner"
import { useDemoState } from "@/hooks/use-demo-state"
import { cn } from "@/lib/utils"

interface SelectedItem {
  baseProductId: string
  name: string
  qty: number
  unitPrice: number
  unitPoints: number
  image?: string
  isDigital?: boolean
}

export default function CatalogImportPage() {
  const router = useRouter()
  const { env } = useDemoState()
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [companyId, setCompanyId] = useState<string>("company_1")

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        const user = getUserById(auth.userId)
        if (!user) {
          // If it's the legacy demo user, we can try to recover or just redirect
          if (auth.userId === "spree_user_demo") {
            console.warn("Legacy demo user detected, redirecting to login for session refresh")
          } else {
            console.error("User not found:", auth.userId)
          }
          
          toast.error("Sessão inválida ou usuário não encontrado. Redirecionando para login...")
          // Clear invalid auth and redirect to login
          localStorage.removeItem("yoobe_auth")
          setTimeout(() => {
            router.push("/login")
          }, 1500)
          return
        }
        setCurrentUser(user)
        
        if (auth.companyId) {
          setCompanyId(auth.companyId)
          const companyData = getCompanyById(auth.companyId)
          if (!companyData) {
            console.error("Company not found:", auth.companyId)
            toast.error("Empresa não encontrada. Verifique sua configuração.")
            return
          }
          setCompany(companyData)
        } else {
          console.error("No companyId in auth")
          toast.error("Empresa não configurada. Verifique sua configuração.")
        }
      } catch (error) {
        console.error("Error parsing auth:", error)
        toast.error("Erro ao carregar dados de autenticação.")
      }
    }

    // Ensure base products are seeded before loading
    ensureBaseProductsSeeded()
    const products = getBaseProducts()
    setBaseProducts(products)
  }, [])

  // Get unique categories from products
  const categories = Array.from(new Set(baseProducts.map(p => p.category))).sort()

  const filteredProducts = baseProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Group products by category for display
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    const cat = product.category || "Outros"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(product)
    return acc
  }, {} as Record<string, BaseProduct[]>)

  const handleQuantityChange = (productId: string, delta: number) => {
    const product = baseProducts.find(p => p.id === productId)
    if (!product) return

    setSelectedItems(prev => {
      const current = prev[productId]
      const newQty = Math.max(0, (current?.qty || 0) + delta)
      
      if (newQty === 0) {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      }

      // Use actual product price from catalog (or default if not set)
      const unitPrice = product.price || 99.90
      const unitPoints = Math.round(unitPrice * 6) // Points conversion ratio

      return {
        ...prev,
        [productId]: {
          baseProductId: productId,
          name: product.name,
          qty: newQty,
          unitPrice,
          unitPoints,
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
      setSelectedItems(prev => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
      return
    }

    // Use actual product price from catalog
    const unitPrice = product.price || 99.90
    const unitPoints = Math.round(unitPrice * 6)

    setSelectedItems(prev => ({
      ...prev,
      [productId]: {
        baseProductId: productId,
        name: product.name,
        qty,
        unitPrice,
        unitPoints,
        image: product.images?.[0],
        isDigital: product.isDigital,
      }
    }))
  }

  const selectedItemsArray = Object.values(selectedItems)
  const totalCash = selectedItemsArray.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0)
  const totalPoints = selectedItemsArray.reduce((sum, item) => sum + (item.unitPoints * item.qty), 0)
  const digitalItemsCount = selectedItemsArray.filter(item => item.isDigital).length
  const physicalItemsCount = selectedItemsArray.filter(item => !item.isDigital).length

  const handleSubmitBudget = async () => {
    if (selectedItemsArray.length === 0) {
      toast.error("Por favor, selecione pelo menos um item.")
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
      // Create budget
      const budget = createBudget({
        companyId: company.id,
        title: `Orçamento - ${new Date().toLocaleDateString("pt-BR")}`,
        status: "submitted",
        totalCash,
        totalPoints,
        createdBy: currentUser.id,
        updatedBy: currentUser.id,
        submittedAt: new Date().toISOString(),
      })

      // Create budget items
      selectedItemsArray.forEach(item => {
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

      // Verify budget was created correctly
      const verifiedBudget = getBudgetById(budget.id)
      if (!verifiedBudget) {
        throw new Error("Falha ao criar orçamento")
      }

      toast.success(`Orçamento #${verifiedBudget.id.substring(0, 8)} com ${selectedItemsArray.length} item(ns) foi enviado para aprovação.`)

      // Clear selection
      setSelectedItems({})
      
      // Small delay to ensure state is saved
      setTimeout(() => {
        // Redirect to budgets page with highlight
        router.push(`/gestor/budgets?highlight=${budget.id}`)
      }, 100)
    } catch (error: any) {
      console.error("Error creating budget:", error)
      toast.error(error.message || "Ocorreu um erro ao processar seu orçamento. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Direct clone for sandbox/demo mode - no approval needed
  const handleDirectClone = async () => {
    if (selectedItemsArray.length === 0) {
      toast.error("Por favor, selecione pelo menos um item.")
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

      for (const item of selectedItemsArray) {
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
        toast.success(`${successCount} produto(s) clonado(s) diretamente para o catálogo!`)
        setSelectedItems({})
        
        setTimeout(() => {
          router.push("/gestor/catalog")
        }, 100)
      }
      
      if (errorCount > 0) {
        toast.warning(`${errorCount} produto(s) não puderam ser clonados.`)
      }
    } catch (error: any) {
      console.error("Error cloning products:", error)
      toast.error(error.message || "Ocorreu um erro ao clonar os produtos.")
    } finally {
      setIsCloning(false)
    }
  }

  // Check if in sandbox mode for direct clone option
  const isSandboxMode = env === "sandbox"

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.push("/gestor/catalog")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Catálogo
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Importar do Catálogo Mestre</h1>
          <p className="text-muted-foreground mt-2">
            Selecione produtos do catálogo mestre e envie um orçamento para adicionar ao estoque
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Como funciona</h3>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                <li>Selecione os produtos e quantidades desejadas</li>
                <li>Envie o orçamento para aprovação do administrador</li>
                <li>Após aprovação, os produtos serão adicionados ao estoque</li>
                <li>Os produtos ficarão disponíveis para resgate na loja</li>
              </ol>
              <div className="mt-3 flex gap-4 text-xs">
                <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300">
                  <Truck className="h-3 w-3" /> Produtos físicos: entrega com frete
                </span>
                <span className="flex items-center gap-1 text-purple-700 dark:text-purple-300">
                  <Mail className="h-3 w-3" /> Produtos digitais: entrega por e-mail
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum produto encontrado</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      ensureBaseProductsSeeded()
                      const products = getBaseProducts()
                      setBaseProducts(products)
                      toast.success("Catálogo mestre resetado com sucesso.")
                    }}
                  >
                    Resetar Catálogo Mestre
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(productsByCategory).map(([category, products]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        {category}
                        <Badge variant="secondary" className="text-xs">
                          {products.length}
                        </Badge>
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {products.map((product) => {
                          const selected = selectedItems[product.id]
                          const qty = selected?.qty || 0
                          const displayPrice = product.price || 99.90

                          return (
                            <Card key={product.id} className={cn("overflow-hidden transition-all", qty > 0 && "border-primary ring-1 ring-primary")}>
                              <div className="aspect-square bg-muted relative">
                                {product.images?.[0] ? (
                                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-10 w-10 text-muted-foreground/30" />
                                  </div>
                                )}
                                {/* Digital/Physical Badge */}
                                <div className="absolute top-2 right-2">
                                  {product.isDigital ? (
                                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-[10px]">
                                      <Mail className="h-3 w-3 mr-1" />
                                      Digital
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-[10px]">
                                      <Truck className="h-3 w-3 mr-1" />
                                      Físico
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
                                {product.description && (
                                  <CardDescription className="text-xs line-clamp-2">{product.description}</CardDescription>
                                )}
                              </CardHeader>
                              <CardContent className="p-4 pt-2 space-y-3">
                                <div className="text-xs">
                                  <p className="text-muted-foreground">Preço unitário:</p>
                                  <p className="font-semibold text-base">
                                    R$ {displayPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                  <p className="text-muted-foreground mt-1">
                                    ou {Math.round(displayPrice * 6).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 border rounded-lg">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleQuantityChange(product.id, -1)
                                      }}
                                      disabled={qty === 0}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                      type="number"
                                      value={qty}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0
                                        handleSetQuantity(product.id, val)
                                      }}
                                      onBlur={(e) => {
                                        const val = parseInt(e.target.value) || 0
                                        if (val !== qty) {
                                          handleSetQuantity(product.id, val)
                                        }
                                      }}
                                      className="w-16 text-center border-0 h-8"
                                      min={0}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleQuantityChange(product.id, 1)
                                      }}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {qty > 0 && (
                                    <Badge variant="default" className="text-xs">
                                      {qty} selecionado{qty !== 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-base">Resumo do Orçamento</CardTitle>
              <CardDescription>
                {selectedItemsArray.length} {selectedItemsArray.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedItemsArray.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum item selecionado
                </p>
              ) : (
                <>
                  {/* Item type summary */}
                  <div className="flex gap-2 text-xs">
                    {physicalItemsCount > 0 && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        <Truck className="h-3 w-3 mr-1" />
                        {physicalItemsCount} físico{physicalItemsCount !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    {digitalItemsCount > 0 && (
                      <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                        <Mail className="h-3 w-3 mr-1" />
                        {digitalItemsCount} digital{digitalItemsCount !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedItemsArray.map((item) => (
                      <div key={item.baseProductId} className="flex items-center gap-3 p-2 rounded-lg border text-sm">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium truncate">{item.name}</p>
                            {item.isDigital && (
                              <Mail className="h-3 w-3 text-purple-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.qty}x R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.qty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total em R$:</span>
                      <span className="font-bold">R$ {totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total em {getCurrencyName(companyId, true).toUpperCase()}:</span>
                      <span className="font-bold">{totalPoints.toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleSubmitBudget}
                    disabled={isSubmitting || isCloning || selectedItemsArray.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : selectedItemsArray.length === 0 ? (
                      "Selecione ao menos 1 item"
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Enviar Orçamento ({selectedItemsArray.length})
                      </>
                    )}
                  </Button>
                  
                  {/* Direct Clone for Sandbox Mode */}
                  {isSandboxMode && (
                    <Button 
                      className="w-full mt-2" 
                      variant="outline"
                      onClick={handleDirectClone}
                      disabled={isSubmitting || isCloning || selectedItemsArray.length === 0}
                    >
                      {isCloning ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Clonando...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Clonar Direto (Sandbox)
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
