"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Product, createBudget, createBudgetItem, getBudgetById, getUserById, getCompanyProductsByCompany } from "@/lib/storage"
import { PageContainer } from "@/components/page-container"
import { M3Card, M3CardContent, M3CardHeader, M3CardTitle } from "@/components/ui/m3-card"
import { Input } from "@/components/ui/input"
import { M3Button } from "@/components/ui/m3-button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Box,
  RefreshCw,
  Edit,
  AlertTriangle,
  Package,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Download,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Loader2,
} from "lucide-react"
// useSWR removido - usando localStorage diretamente para demo
import { getCurrencyName } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// fetcher removido - produtos carregados diretamente do localStorage

interface RestockItem {
  id: string
  nome: string
  sku?: string
  image?: string
  images?: string[]
  estoque: number
  preco: number
  restockQty: number
  selected: boolean
}

export default function EstoquePage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [stockFilter, setStockFilter] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState({ nome: "", sku: "", preco: "", estoque: "", ncm: "" })
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [currentUserName, setCurrentUserName] = useState<string>("")
  
  // Restock modal state
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [restockItems, setRestockItems] = useState<RestockItem[]>([])
  const [isSubmittingRestock, setIsSubmittingRestock] = useState(false)

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
        if (auth.userId) {
          setCurrentUserId(auth.userId)
          const user = getUserById(auth.userId)
          if (user) {
            setCurrentUserName(user.name)
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Failed to parse auth data:", error)
        }
      }
    }
  }, [])

  // Buscar produtos diretamente do localStorage (client-side)
  // para garantir que os dados criados durante o onboarding estejam disponíveis
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const loadProducts = useCallback(() => {
    if (!companyId) {
      setProducts([])
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    try {
      const companyProducts = getCompanyProductsByCompany(companyId).map(cp => ({
        ...cp,
        stock: cp.stockQuantity,
        price: cp.price,
        priceInPoints: cp.pointsCost,
        name: cp.name,
        sku: cp.finalSku,
        images: cp.images,
        category: cp.category,
        available: cp.isActive,
        active: cp.isActive,
      }))
      setProducts(companyProducts)
    } catch (error) {
      console.error("[Estoque] Erro ao carregar produtos:", error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [companyId])
  
  useEffect(() => {
    loadProducts()
  }, [loadProducts])
  
  // Função para atualizar produtos (substitui mutate do SWR)
  const mutate = useCallback(() => {
    loadProducts()
  }, [loadProducts])
  
  const meta = { lastUpdate: new Date().toISOString() }

  const filteredProducts = useMemo(() => products.filter((p: any) => {
    const searchLower = search.toLowerCase()
    const name = p.name || p.nome || ""
    const sku = p.sku || p.codigo || ""
    const matchesSearch =
      !search ||
      name.toLowerCase().includes(searchLower) ||
      sku.toLowerCase().includes(searchLower)

    const stock = p.stock ?? p.estoque ?? 0
    let matchesStock = true
    if (stockFilter === "available") {
      matchesStock = stock > 0
    } else if (stockFilter === "low") {
      matchesStock = stock > 0 && stock < 10
    } else if (stockFilter === "out") {
      matchesStock = !stock || stock <= 0
    }

    return matchesSearch && matchesStock
  }), [products, search, stockFilter])

  const totalFiltered = filteredProducts.length
  const totalPages = Math.ceil(totalFiltered / perPage)
  const paginatedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage)

  const totalStock = useMemo(() => products.reduce((acc: number, p: any) => acc + (p.stock ?? p.estoque ?? 0), 0), [products])
  const lowStockProductsCount = useMemo(() => products.filter((p: any) => {
    const stock = p.stock ?? p.estoque ?? 0
    return stock > 0 && stock < 10
  }).length, [products])
  const lowStockProductsList = useMemo(() => products.filter((p: any) => {
    const stock = p.stock ?? p.estoque ?? 0
    return stock > 0 && stock < 10
  }), [products])
  const outOfStockProducts = useMemo(() => products.filter((p: any) => {
    const stock = p.stock ?? p.estoque ?? 0
    return !stock || stock <= 0
  }).length, [products])

  // Open restock modal and initialize items
  const openRestockModal = () => {
    const items: RestockItem[] = lowStockProductsList.map((p: any) => {
      const stock = p.stock ?? p.estoque ?? 0
      const price = p.price ?? p.preco ?? 0
      return {
        id: p.id,
        nome: p.name || p.nome || "",
        sku: p.sku || p.codigo || "",
        image: p.image || p.imagem || p.images?.[0] || p.imagens?.[0],
        images: p.images || p.imagens,
        estoque: stock,
        preco: price,
        restockQty: Math.max(10 - stock, 10), // Default: enough to reach 10 or min 10
        selected: true,
      }
    })
    setRestockItems(items)
    setShowRestockModal(true)
  }

  // Toggle item selection
  const toggleRestockItem = (itemId: string) => {
    setRestockItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    )
  }

  // Update restock quantity
  const updateRestockQty = (itemId: string, delta: number) => {
    setRestockItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, restockQty: Math.max(1, item.restockQty + delta) } 
          : item
      )
    )
  }

  // Select/deselect all
  const toggleSelectAll = () => {
    const allSelected = restockItems.every(item => item.selected)
    setRestockItems(prev => prev.map(item => ({ ...item, selected: !allSelected })))
  }

  // Submit restock budget
  const handleSubmitRestock = async () => {
    const selectedItems = restockItems.filter(item => item.selected)
    if (selectedItems.length === 0) {
      toast.error("Selecione pelo menos um produto para reposição")
      return
    }

    setIsSubmittingRestock(true)
    try {
      const totalCash = selectedItems.reduce((sum, item) => sum + (item.preco * item.restockQty), 0)
      const totalPoints = selectedItems.reduce((sum, item) => sum + (Math.round(item.preco * 6) * item.restockQty), 0)

      const budget = createBudget({
        companyId,
        title: `Reposição de Estoque - ${new Date().toLocaleDateString("pt-BR")}`,
        status: "submitted",
        budgetType: "restock",
        totalCash,
        totalPoints,
        requestedById: currentUserId,
        requestedByName: currentUserName,
        createdBy: currentUserId,
        updatedBy: currentUserId,
        submittedAt: new Date().toISOString(),
      })

      selectedItems.forEach(item => {
        createBudgetItem({
          budgetId: budget.id,
          baseProductId: item.id,
          qty: item.restockQty,
          unitPrice: item.preco,
          unitPoints: Math.round(item.preco * 6),
          subtotalCash: item.preco * item.restockQty,
          subtotalPoints: Math.round(item.preco * 6) * item.restockQty,
        })
      })

      const verifiedBudget = getBudgetById(budget.id)
      if (!verifiedBudget) {
        throw new Error("Falha ao criar orçamento de reposição")
      }

      toast.success(`Orçamento de reposição enviado com ${selectedItems.length} produto(s)!`)
      setShowRestockModal(false)
      
      setTimeout(() => {
        router.push(`/gestor/budgets?highlight=${budget.id}`)
      }, 100)
    } catch (error: unknown) {
      console.error("Error creating restock budget:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast.error(errorMessage || "Ocorreu um erro ao processar o orçamento de reposição.")
    } finally {
      setIsSubmittingRestock(false)
    }
  }

  const selectedRestockCount = restockItems.filter(item => item.selected).length
  const totalRestockValue = restockItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.preco * item.restockQty), 0)

  const openEditDialog = (product: any) => {
    setEditingProduct(product)
    const price = product.price ?? product.preco ?? 0
    const stock = product.stock ?? product.estoque ?? 0
    setEditForm({
      nome: product.name || product.nome || "",
      sku: product.sku || product.codigo || "",
      preco: price.toString(),
      estoque: stock.toString(),
      ncm: product.ncm || "",
    })
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editForm.nome,
          sku: editForm.sku,
          preco: Number.parseFloat(editForm.preco),
          estoque: Number.parseInt(editForm.estoque),
          ncm: editForm.ncm,
        }),
      })
      mutate()
      setEditingProduct(null)
    } catch (error) {
      console.error("Erro ao salvar:", error)
    }
  }

  const getStockBadge = (stock: number) => {
    if (!stock || stock <= 0) {
      return <Badge className="bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] border-none shadow-sm">Sem estoque</Badge>
    }
    if (stock < 10) {
      return <Badge className="bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] border-none shadow-sm">Baixo</Badge>
    }
    return <Badge className="bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-none shadow-sm">Disponível</Badge>
  }

  const clearFilters = () => {
    setSearch("")
    setStockFilter("")
    setPage(1)
  }

  const hasActiveFilters = search || stockFilter

  const handleExportCSV = () => {
    const headers = ["Nome", "SKU", "Código", "NCM", "Preço (R$)", "Preço (Pontos)", "Estoque", "Status"]
    const rows = filteredProducts.map((p: any) => {
      const price = p.price ?? p.preco ?? 0
      const priceInPoints = p.priceInPoints ?? 0
      const stock = p.stock ?? p.estoque ?? 0
      return [
        p.name || p.nome || "",
        p.sku || "",
        p.codigo || "",
        p.ncm || "",
        price.toFixed(2),
        priceInPoints.toString(),
        stock.toString(),
        stock > 0 ? "Disponível" : "Sem estoque"
      ]
    })
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `estoque_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <PageContainer className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m3-headline-medium text-[var(--md-sys-color-on-surface)] flex items-center gap-3">
            <Box className="h-8 w-8 text-[var(--md-sys-color-primary)]" />
            Estoque
          </h1>
          <p className="mt-1 m3-body-medium text-[var(--md-sys-color-on-surface-variant)]">Gestão de inventário e reposição de produtos.</p>
        </div>
        <M3Button onClick={() => mutate()} variant="outlined" size="md" icon={<RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />}>
          Sincronizar cubbo
        </M3Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <M3Card variant="elevated" className="overflow-hidden">
          <M3CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <M3CardTitle className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Total Produtos</M3CardTitle>
            <div className="p-2 bg-[var(--md-sys-color-surface-container-high)] rounded-xl"><Package className="h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" /></div>
          </M3CardHeader>
          <M3CardContent>
            <div className="m3-headline-small text-[var(--md-sys-color-on-surface)]">{products.length}</div>
            <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] mt-1 uppercase">SKUS CADASTRADOS</p>
          </M3CardContent>
        </M3Card>
        <M3Card variant="elevated" className="overflow-hidden">
          <M3CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <M3CardTitle className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Total em Estoque</M3CardTitle>
            <div className="p-2 bg-[var(--md-sys-color-surface-container-high)] rounded-xl"><Box className="h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" /></div>
          </M3CardHeader>
          <M3CardContent>
            <div className="m3-headline-small text-[var(--md-sys-color-on-surface)]">{totalStock}</div>
            <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] mt-1 uppercase">UNIDADES TOTAIS</p>
          </M3CardContent>
        </M3Card>
        <M3Card variant="filled" className="overflow-hidden bg-[var(--md-sys-color-tertiary-container)] border-l-4 border-[var(--md-sys-color-tertiary)]">
          <M3CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <M3CardTitle className="m3-label-small text-[var(--md-sys-color-on-tertiary-container)] uppercase tracking-wider">Estoque Baixo</M3CardTitle>
            <div className="p-2 bg-[var(--md-sys-color-tertiary)]/20 rounded-xl"><TrendingDown className="h-4 w-4 text-[var(--md-sys-color-on-tertiary-container)]" /></div>
          </M3CardHeader>
          <M3CardContent>
            <div className="m3-headline-small text-[var(--md-sys-color-on-tertiary-container)]">{lowStockProductsCount}</div>
            <p className="m3-label-small text-[var(--md-sys-color-on-tertiary-container)]/80 mt-1 uppercase">REPOSIÇÃO NECESSÁRIA</p>
          </M3CardContent>
        </M3Card>
        <M3Card variant="filled" className="overflow-hidden bg-[var(--md-sys-color-error-container)] border-l-4 border-[var(--md-sys-color-error)]">
          <M3CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <M3CardTitle className="m3-label-small text-[var(--md-sys-color-on-error-container)] uppercase tracking-wider">Esgotados</M3CardTitle>
            <div className="p-2 bg-[var(--md-sys-color-error)]/20 rounded-xl"><AlertTriangle className="h-4 w-4 text-[var(--md-sys-color-on-error-container)]" /></div>
          </M3CardHeader>
          <M3CardContent>
            <div className="m3-headline-small text-[var(--md-sys-color-on-error-container)]">{outOfStockProducts}</div>
            <p className="m3-label-small text-[var(--md-sys-color-on-error-container)]/80 mt-1 uppercase">ITENS SEM SALDO</p>
          </M3CardContent>
        </M3Card>
      </div>

      {/* Restock CTA Card */}
      {lowStockProductsCount > 0 && (
        <M3Card variant="filled" className="overflow-hidden bg-gradient-to-r from-[var(--md-sys-color-tertiary-container)] to-[var(--md-sys-color-tertiary-container)]/80 border-l-4 border-[var(--md-sys-color-tertiary)]">
          <M3CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--md-sys-color-tertiary)]/20 rounded-2xl">
                  <ShoppingCart className="h-8 w-8 text-[var(--md-sys-color-on-tertiary-container)]" />
                </div>
                <div>
                  <p className="m3-title-medium text-[var(--md-sys-color-on-tertiary-container)] font-bold">
                    {lowStockProductsCount} produto{lowStockProductsCount > 1 ? "s" : ""} com estoque baixo
                  </p>
                  <p className="m3-body-small text-[var(--md-sys-color-on-tertiary-container)]/80 mt-0.5">
                    Solicite um orçamento de reposição para manter seu estoque abastecido
                  </p>
                </div>
              </div>
              <M3Button 
                variant="filled" 
                size="lg"
                onClick={openRestockModal}
                className="bg-[var(--md-sys-color-tertiary)] text-[var(--md-sys-color-on-tertiary)] hover:bg-[var(--md-sys-color-tertiary)]/90 shrink-0"
                icon={<ShoppingCart className="h-5 w-5" />}
              >
                Solicitar Reposição
              </M3Button>
            </div>
          </M3CardContent>
        </M3Card>
      )}

      {/* Source indicator */}
      {meta.source && (
        <M3Card variant="outlined" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 m3-body-small text-[var(--md-sys-color-on-surface)]">
              <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse", meta.source === "cubbo" ? "bg-[var(--md-sys-color-primary)]" : "bg-[var(--md-sys-color-secondary)]")} />
              Sincronizado via {meta.source === "cubbo" ? "Cubbo Fulfillment" : "Tiny ERP"}
              {meta.fromCache && <Badge className="ml-2 text-[10px] bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] border-[var(--md-sys-color-outline-variant)]">Cache</Badge>}
            </div>
            <div className="flex items-center gap-2 m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">
              <Clock className="h-3.5 w-3.5" />
              Última atualização: {meta.lastUpdate ? new Date(meta.lastUpdate).toLocaleString("pt-BR") : "N/A"}
            </div>
          </div>
        </M3Card>
      )}

      {/* Search and Filters */}
      <M3Card variant="elevated">
        <M3CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)]" />
              <Input
                placeholder="Buscar por nome, SKU ou código..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10 h-11 bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus-visible:border-[var(--md-sys-color-primary)]"
              />
            </div>
            <M3Button variant="outlined" size="md" onClick={handleExportCSV} icon={<Download className="h-4 w-4" />}>
              Exportar CSV
            </M3Button>
            <Select
              value={stockFilter}
              onValueChange={(value) => {
                setStockFilter(value === "all" ? "" : value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-48 h-11 bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]">
                <SelectValue placeholder="Filtrar estoque" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]">
                <SelectItem value="all">Todos os produtos</SelectItem>
                <SelectItem value="available">Com estoque</SelectItem>
                <SelectItem value="low">Estoque baixo</SelectItem>
                <SelectItem value="out">Sem estoque</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <M3Button variant="text" onClick={clearFilters} className="text-[var(--md-sys-color-error)]">
                Limpar filtros
              </M3Button>
            )}
          </div>
        </M3CardContent>
      </M3Card>

      {/* Products Table */}
      <M3Card variant="elevated" className="overflow-hidden">
        <M3CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-[var(--md-sys-color-primary)]" />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="h-12 w-12 text-[var(--md-sys-color-on-surface-variant)]/30 mb-4" />
              <p className="m3-title-medium text-[var(--md-sys-color-on-surface-variant)]">Nenhum produto encontrado</p>
              {hasActiveFilters && (
                <M3Button variant="text" onClick={clearFilters} className="mt-2">
                  Limpar filtros de busca
                </M3Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader className="bg-[var(--md-sys-color-surface-container-low)]">
                  <TableRow className="border-[var(--md-sys-color-outline-variant)]/50 hover:bg-transparent">
                    <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Produto</TableHead>
                    <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">SKU</TableHead>
                    <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">NCM</TableHead>
                    <TableHead className="text-right m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Preço</TableHead>
                    <TableHead className="text-right m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Saldo Atual</TableHead>
                    <TableHead className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product: any) => (
                    <TableRow key={product.id} className="group border-[var(--md-sys-color-outline-variant)]/30 hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/30 shrink-0">
                            {product.image || product.imagem || product.images?.[0] || product.imagens?.[0] ? (
                              <img 
                                src={product.image || product.imagem || product.images?.[0] || product.imagens?.[0]} 
                                alt={product.name || product.nome} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                            ) : null}
                            <div className={cn(
                              "h-full w-full flex items-center justify-center",
                              (product.image || product.imagem || product.images?.[0] || product.imagens?.[0]) && "hidden"
                            )}>
                              <Package className="h-5 w-5 text-[var(--md-sys-color-on-surface-variant)]" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)] truncate">{product.name || product.nome}</p>
                            {(product.category || product.categoria) && (
                              <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase truncate">{product.category || product.categoria}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="rounded-lg bg-[var(--md-sys-color-surface-container-high)] px-2 py-1 text-[10px] font-mono text-[var(--md-sys-color-on-surface)]">
                          {product.sku || product.codigo || "-"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <code className="rounded-lg bg-[var(--md-sys-color-secondary-container)] px-2 py-1 text-[10px] font-mono text-[var(--md-sys-color-on-secondary-container)]">
                          {product.ncm || "-"}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">
                          R$ {(product.price ?? product.preco ?? 0).toFixed(2)}
                        </div>
                        {(product.priceInPoints ?? 0) > 0 && (
                          <div className="m3-label-small text-[var(--md-sys-color-on-surface-variant)]">
                            {(product.priceInPoints ?? 0).toLocaleString("pt-BR")} {getCurrencyName(companyId, true).toUpperCase()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">{product.stock ?? product.estoque ?? 0}</TableCell>
                      <TableCell>{getStockBadge(product.stock ?? product.estoque ?? 0)}</TableCell>
                      <TableCell>
                        <M3Button variant="text" size="icon-sm" onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4" />
                        </M3Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </M3CardContent>

        {totalPages > 0 && (
          <div className="flex flex-col gap-4 border-t border-[var(--md-sys-color-outline-variant)]/30 bg-[var(--md-sys-color-surface-container-low)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">
                Página {page} de {totalPages} ({totalFiltered} itens)
              </p>
              <div className="flex items-center gap-2">
                <span className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">Exibir:</span>
                <Select
                  value={perPage.toString()}
                  onValueChange={(value) => {
                    setPerPage(Number(value))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-20 h-8 text-xs bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]">
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-1">
              <M3Button variant="outlined" size="icon-sm" onClick={() => setPage(1)} disabled={page === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </M3Button>
              <M3Button variant="outlined" size="icon-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </M3Button>
              <M3Button variant="outlined" size="icon-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </M3Button>
              <M3Button variant="outlined" size="icon-sm" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                <ChevronsRight className="h-4 w-4" />
              </M3Button>
            </div>
          </div>
        )}
      </M3Card>
    </PageContainer>

      {/* Edit Inventory Modal */}
      <ResponsiveModal
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
        title={
          <span className="flex items-center gap-2 m3-title-large text-[var(--md-sys-color-on-surface)]">
            <Box className="h-5 w-5 text-[var(--md-sys-color-primary)]" />
            Editar Inventário
          </span>
        }
        description={<span className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)]">Atualize os saldos e preços manualmente (Override).</span>}
        maxWidth="md"
        className="space-y-6"
        footer={
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <M3Button 
              variant="outlined" 
              onClick={() => setEditingProduct(null)} 
              className="sm:flex-1"
              size="lg"
            >
              Cancelar
            </M3Button>
            <M3Button 
              variant="filled"
              onClick={handleSaveEdit} 
              className="sm:flex-1"
              size="lg"
            >
              Salvar Alterações
            </M3Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">Nome do Produto</Label>
            <Input
              id="nome"
              value={editForm.nome}
              onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
              className="h-12 rounded-xl bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)] focus-visible:border-[var(--md-sys-color-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku" className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">SKU</Label>
              <div className="relative">
                <Input
                  id="sku"
                  value={editForm.sku}
                  onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                  className="h-12 rounded-xl bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] font-mono text-sm pl-10 text-[var(--md-sys-color-on-surface)] focus-visible:border-[var(--md-sys-color-primary)]"
                />
                <Edit className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ncm" className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">NCM</Label>
              <Input
                id="ncm"
                value={editForm.ncm}
                onChange={(e) => setEditForm({ ...editForm, ncm: e.target.value })}
                placeholder="00000000"
                maxLength={8}
                className="h-12 rounded-xl bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] font-mono text-sm text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)] focus-visible:border-[var(--md-sys-color-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco" className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">Preço ({getCurrencyName(companyId, true).toUpperCase()})</Label>
              <div className="relative">
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={editForm.preco}
                  onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
                  className="h-12 rounded-xl bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] font-medium pl-14 text-[var(--md-sys-color-on-surface)] focus-visible:border-[var(--md-sys-color-primary)]"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 m3-label-small text-[var(--md-sys-color-on-surface-variant)]">{getCurrencyName(companyId, true).toUpperCase()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estoque" className="m3-label-medium text-[var(--md-sys-color-on-surface-variant)] uppercase">Saldo Atual</Label>
              <div className="relative">
                <Input
                  id="estoque"
                  type="number"
                  value={editForm.estoque}
                  onChange={(e) => setEditForm({ ...editForm, estoque: e.target.value })}
                  className="h-12 rounded-xl bg-[var(--md-sys-color-surface-container-low)] border-[var(--md-sys-color-outline-variant)] font-medium pl-10 text-[var(--md-sys-color-on-surface)] focus-visible:border-[var(--md-sys-color-primary)]"
                />
                <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-[var(--md-sys-color-tertiary-container)] rounded-2xl flex gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--md-sys-color-on-tertiary-container)] shrink-0" />
            <p className="m3-body-small text-[var(--md-sys-color-on-tertiary-container)] leading-relaxed">
              <strong>Atenção:</strong> Alterar o estoque manualmente sobrescreve a sincronização automática até o próximo ciclo.
            </p>
          </div>
        </div>
      </ResponsiveModal>

      {/* Restock Request Modal */}
      <ResponsiveModal
        open={showRestockModal}
        onOpenChange={(open) => !open && setShowRestockModal(false)}
        title={
          <span className="flex items-center gap-2 m3-title-large text-[var(--md-sys-color-on-surface)]">
            <ShoppingCart className="h-5 w-5 text-[var(--md-sys-color-primary)]" />
            Solicitar Reposição de Estoque
          </span>
        }
        description={
          <span className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)]">
            Selecione os produtos e quantidades para criar um orçamento de reposição.
          </span>
        }
        maxWidth="2xl"
        className="space-y-4"
        footer={
          <div className="flex flex-col gap-4 w-full">
            {/* Summary */}
            <div className="flex items-center justify-between p-4 bg-[var(--md-sys-color-surface-container)] rounded-xl">
              <div>
                <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase">
                  {selectedRestockCount} produto{selectedRestockCount !== 1 ? "s" : ""} selecionado{selectedRestockCount !== 1 ? "s" : ""}
                </p>
                <p className="m3-title-medium text-[var(--md-sys-color-on-surface)] font-bold">
                  Total: R$ {totalRestockValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <M3Button 
                variant="outlined" 
                onClick={() => setShowRestockModal(false)} 
                className="sm:flex-1"
                size="lg"
                disabled={isSubmittingRestock}
              >
                Cancelar
              </M3Button>
              <M3Button 
                variant="filled"
                onClick={handleSubmitRestock} 
                className="sm:flex-1"
                size="lg"
                disabled={isSubmittingRestock || selectedRestockCount === 0}
                icon={isSubmittingRestock ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              >
                {isSubmittingRestock ? "Enviando..." : "Enviar Orçamento"}
              </M3Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Select All Header */}
          <div className="flex items-center justify-between p-3 bg-[var(--md-sys-color-surface-container-low)] rounded-xl">
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={restockItems.length > 0 && restockItems.every(item => item.selected)}
                onCheckedChange={toggleSelectAll}
                className="border-[var(--md-sys-color-outline)] data-[state=checked]:bg-[var(--md-sys-color-primary)] data-[state=checked]:border-[var(--md-sys-color-primary)]"
              />
              <span className="m3-label-medium text-[var(--md-sys-color-on-surface)]">Selecionar todos</span>
            </div>
            <Badge className="bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] border-none">
              {restockItems.length} produto{restockItems.length !== 1 ? "s" : ""} com estoque baixo
            </Badge>
          </div>

          {/* Products List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {restockItems.map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                    item.selected 
                      ? "bg-[var(--md-sys-color-primary-container)]/30 border-[var(--md-sys-color-primary)]/30" 
                      : "bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-outline-variant)]/30"
                  )}
                >
                  {/* Checkbox */}
                  <Checkbox 
                    checked={item.selected}
                    onCheckedChange={() => toggleRestockItem(item.id)}
                    className="border-[var(--md-sys-color-outline)] data-[state=checked]:bg-[var(--md-sys-color-primary)] data-[state=checked]:border-[var(--md-sys-color-primary)]"
                  />
                  
                  {/* Product Image */}
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]/30 shrink-0">
                    {item.image || item.images?.[0] ? (
                      <img 
                        src={item.image || item.images?.[0]} 
                        alt={item.nome} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-[var(--md-sys-color-on-surface-variant)]" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)] truncate">
                      {item.nome}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.sku && (
                        <code className="rounded-lg bg-[var(--md-sys-color-surface-container-high)] px-2 py-0.5 text-[10px] font-mono text-[var(--md-sys-color-on-surface)]">
                          {item.sku}
                        </code>
                      )}
                      <Badge className="bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] border-none text-[10px]">
                        Estoque: {item.estoque}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <M3Button 
                      variant="outlined" 
                      size="icon-sm"
                      onClick={() => updateRestockQty(item.id, -1)}
                      disabled={item.restockQty <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </M3Button>
                    <div className="w-12 text-center">
                      <p className="m3-body-medium font-bold text-[var(--md-sys-color-on-surface)]">
                        {item.restockQty}
                      </p>
                    </div>
                    <M3Button 
                      variant="outlined" 
                      size="icon-sm"
                      onClick={() => updateRestockQty(item.id, 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </M3Button>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="text-right shrink-0 w-24">
                    <p className="m3-body-medium font-bold text-[var(--md-sys-color-on-surface)]">
                      R$ {(item.preco * item.restockQty).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="m3-label-small text-[var(--md-sys-color-on-surface-variant)]">
                      {item.restockQty} × R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
              
              {restockItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-[var(--md-sys-color-on-surface-variant)]/30 mb-4" />
                  <p className="m3-title-medium text-[var(--md-sys-color-on-surface-variant)]">
                    Nenhum produto com estoque baixo
                  </p>
                  <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]/80 mt-1">
                    Todos os produtos estão com estoque adequado
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </ResponsiveModal>
    </>
  )
}
