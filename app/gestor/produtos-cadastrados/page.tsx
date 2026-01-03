"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ImagePlus, 
  Tag, 
  X, 
  Zap, 
  CheckCircle2, 
  DollarSign,
  AlertTriangle,
  Package,
  Eye,
  RefreshCw,
  Store
} from "lucide-react"
import { 
  getCompanyProductsByCompany, 
  saveCompanyProducts, 
  getCompanyProducts,
  updateCompanyProduct,
  getTagsV3,
  createRestockBudget,
  createBudgetItem,
  getBudgetsByCompany,
  type CompanyProduct,
  type Budget
} from "@/lib/storage"
import { toast } from "sonner"
import { PageContainer } from "@/components/page-container"
import { cn } from "@/lib/utils"
import { ProductDetailModal } from "@/components/modals"

export default function ProdutosCadastradosPage() {
  const [products, setProducts] = useState<CompanyProduct[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<CompanyProduct | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [companyId, setCompanyId] = useState<string>("company_1")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Restock modal state
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [restockProduct, setRestockProduct] = useState<CompanyProduct | null>(null)
  const [restockQty, setRestockQty] = useState("10")
  const [currentUserId, setCurrentUserId] = useState("")
  const [currentUserName, setCurrentUserName] = useState("")

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formSku, setFormSku] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formPointsCost, setFormPointsCost] = useState("")
  const [formStock, setFormStock] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formImages, setFormImages] = useState<string[]>([])
  const [formActive, setFormActive] = useState(true)
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    // Load companyId from auth
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
          const loadedProducts = getCompanyProductsByCompany(auth.companyId)
          setProducts(loadedProducts)
        }
        if (auth.userId) {
          setCurrentUserId(auth.userId)
        }
        if (auth.name) {
          setCurrentUserName(auth.name)
        }
      } catch (error) {
        console.error("Error parsing auth:", error)
      }
    }
    
    // Load tags
    const tags = getTagsV3()
    setAllTags(tags.map(t => t.name))
  }, [])

  const categories = Array.from(new Set(products.map((p) => p.category)))

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.finalSku && product.finalSku.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesTag = !tagFilter || (product.tags || []).includes(tagFilter)
    return matchesSearch && matchesCategory && matchesTag
  })

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.isActive).length
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stockQuantity || 0), 0)
  const totalPoints = products.reduce((sum, p) => sum + (p.pointsCost || 0) * (p.stockQuantity || 0), 0)

  const resetForm = () => {
    setFormName("")
    setFormDescription("")
    setFormSku("")
    setFormPrice("")
    setFormPointsCost("")
    setFormStock("")
    setFormCategory("")
    setFormImages([])
    setFormActive(true)
  }

  const openEditDialog = (product: CompanyProduct) => {
    setSelectedProduct(product)
    setFormName(product.name)
    setFormDescription(product.description)
    setFormSku(product.finalSku || "")
    setFormPrice(product.price.toString())
    setFormPointsCost(product.pointsCost?.toString() || "0")
    setFormStock(product.stockQuantity.toString())
    setFormCategory(product.category)
    setFormImages(product.images || [])
    setFormActive(product.isActive)
    setIsEditOpen(true)
  }

  const openNewDialog = () => {
    resetForm()
    setIsNewOpen(true)
  }

  const handleSaveProduct = () => {
    if (!selectedProduct || !formName) return

    // Use updateCompanyProduct for proper update
    const updated = updateCompanyProduct(selectedProduct.id, {
      name: formName,
      description: formDescription,
      price: Number.parseFloat(formPrice) || 0,
      pointsCost: Number.parseInt(formPointsCost) || 0,
      stockQuantity: Number.parseInt(formStock) || 0,
      category: formCategory,
      images: formImages,
      isActive: formActive,
      status: formActive ? "active" : "inactive",
    })
    
    if (updated) {
      setProducts(getCompanyProductsByCompany(companyId))
    }
    setIsEditOpen(false)
    setSelectedProduct(null)
  }

  const handleCreateProduct = () => {
    if (!formName) return

    // Create new CompanyProduct
    const allProducts = getCompanyProducts()
    const newProduct: CompanyProduct = {
      id: `cp_${companyId}_manual_${Date.now()}`,
      companyId,
      baseProductId: `manual_${Date.now()}`,
      name: formName,
      description: formDescription,
      slug: formName.toLowerCase().replace(/\s+/g, "-"),
      price: Number.parseFloat(formPrice) || 0,
      pointsCost: Number.parseInt(formPointsCost) || 0,
      stockQuantity: Number.parseInt(formStock) || 0,
      category: formCategory || "Outros",
      images: formImages,
      tags: [],
      isActive: formActive,
      status: formActive ? "active" : "inactive",
      finalSku: `${companyId.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    allProducts.push(newProduct)
    saveCompanyProducts(allProducts)
    setProducts(getCompanyProductsByCompany(companyId))
    setIsNewOpen(false)
    resetForm()
  }

  const handleDeleteProduct = () => {
    if (!selectedProduct) return
    const allProducts = getCompanyProducts()
    const updatedProducts = allProducts.filter((p) => p.id !== selectedProduct.id)
    saveCompanyProducts(updatedProducts)
    setProducts(getCompanyProductsByCompany(companyId))
    setIsDeleteOpen(false)
    setSelectedProduct(null)
  }

  // Handle opening restock modal
  const handleOpenRestock = (product: CompanyProduct) => {
    setRestockProduct(product)
    setRestockQty("10")
    setIsRestockOpen(true)
  }

  // Handle submitting restock request
  const handleSubmitRestock = () => {
    if (!restockProduct) return
    
    const qty = parseInt(restockQty) || 10
    
    // Create a restock budget
    const budget = createRestockBudget(
      companyId,
      restockProduct.id,
      qty,
      currentUserId || "gestor",
      currentUserName || "Gestor"
    )
    
    // Add the product as a budget item
    createBudgetItem({
      budgetId: budget.id,
      baseProductId: restockProduct.baseProductId || restockProduct.id,
      qty: qty,
      unitPrice: restockProduct.price || 0,
      unitPoints: restockProduct.pointsCost || 0,
    })
    
    toast.success(`Solicitação de reposição criada! ${qty} unidades de "${restockProduct.name}"`)
    setIsRestockOpen(false)
    setRestockProduct(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormImages([reader.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleManageTags = (product: CompanyProduct) => {
    setSelectedProduct(product)
    setNewTag("")
    setIsTagsOpen(true)
  }

  const handleAddTag = () => {
    if (!selectedProduct || !newTag.trim()) return
    // Update product tags directly
    const updated = updateCompanyProduct(selectedProduct.id, {
      tags: [...(selectedProduct.tags || []), newTag.trim()]
    })
    if (updated) {
      setProducts(getCompanyProductsByCompany(companyId))
      setSelectedProduct(updated)
    }
    setNewTag("")
  }

  const handleRemoveTag = (tag: string) => {
    if (!selectedProduct) return
    // Update product tags directly
    const updated = updateCompanyProduct(selectedProduct.id, {
      tags: (selectedProduct.tags || []).filter(t => t !== tag)
    })
    if (updated) {
      setProducts(getCompanyProductsByCompany(companyId))
      setSelectedProduct(updated)
    }
  }

  return (
    <PageContainer className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">Produtos Cadastrados</h1>
            <p className="text-muted-foreground font-medium">Gerencie o catálogo completo e estoque da vitrine.</p>
          </div>
          <Button onClick={openNewDialog} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Produtos" value={totalProducts} icon={<ShoppingBag className="h-4 w-4 text-primary" />} />
          <StatCard title="Produtos Ativos" value={activeProducts} icon={<CheckCircle2 className="h-4 w-4 text-primary" />} />
          <StatCard title="Valor em R$" value={`${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} icon={<DollarSign className="h-4 w-4 text-primary" />} />
          <StatCard title="Total Pontos" value={`${totalPoints.toLocaleString("pt-BR")}`} icon={<Zap className="h-4 w-4 text-primary fill-primary" />} />
        </div>

        {/* Filters and List */}
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-card overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border pb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-black text-foreground uppercase">Buscar no catálogo</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Nome, descrição ou SKU..." 
                    className="pl-10 border-border focus-visible:ring-primary bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48 space-y-2">
                <Label className="text-xs font-black text-foreground uppercase">Categoria</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-border bg-background">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 divide-x divide-y divide-border">
              {filteredProducts.map((product) => (
                <div key={product.id} className={cn("p-6 hover:bg-muted/30 transition-all group flex flex-col h-full", !product.isActive && "opacity-60")}>
                  <div className="aspect-square rounded-2xl bg-muted/30 overflow-hidden mb-4 relative border border-border/50 group-hover:border-primary/30 transition-colors">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                    ) : <ShoppingBag className="h-12 w-12 text-muted-foreground/30 m-auto absolute inset-0" />}
                    
                    {!product.isActive && (
                      <Badge className="absolute top-3 right-3 bg-rose-500 text-white border-none font-bold text-[9px] uppercase">Inativo</Badge>
                    )}

                    {/* Status badge */}
                    {product.isActive && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-none font-bold text-[9px] uppercase">
                        Ativo
                      </Badge>
                    )}
                    
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                      {product.tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} className="bg-background/90 text-primary border-border shadow-sm text-[9px] font-black uppercase">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                      <Badge variant="outline" className="shrink-0 text-[9px] font-black border-border text-primary uppercase">
                        {product.stockQuantity} UN
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                      {product.category} • SKU: {product.finalSku || '-'}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-foreground">R$ {(product.price || 0).toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-primary flex items-center gap-1">
                        <Zap className="h-3 w-3 fill-primary" />
                        {product.pointsCost} pontos
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => { setSelectedProduct(product); setIsViewDetailsOpen(true); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => openEditDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => handleManageTags(product)}>
                        <Tag className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-amber-600 hover:bg-amber-50" 
                        title="Solicitar Reposição"
                        onClick={() => handleOpenRestock(product)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50" onClick={() => { setSelectedProduct(product); setIsDeleteOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                <p className="text-foreground font-bold">Nenhum produto encontrado.</p>
                <Button variant="link" className="text-primary font-bold" onClick={() => { setSearchTerm(""); setCategoryFilter("all"); }}>
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog: Create/Edit Product */}
        <Dialog open={isNewOpen || isEditOpen} onOpenChange={(open) => { if (!open) { setIsNewOpen(false); setIsEditOpen(false); } }}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {isNewOpen ? "Novo Produto" : "Editar Produto"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do produto para o catálogo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-bold">Nome do Produto</Label>
                    <Input 
                      id="name" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                      placeholder="Ex: Mochila Executiva"
                      className="border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-foreground font-bold">SKU</Label>
                    <Input 
                      id="sku" 
                      value={formSku} 
                      onChange={(e) => setFormSku(e.target.value)} 
                      placeholder="Ex: MOC-001"
                      className="border-border"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-foreground font-bold">Preço (BRTS)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        value={formPrice} 
                        onChange={(e) => setFormPrice(e.target.value)} 
                        placeholder="0.00"
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points" className="text-foreground font-bold">Custo em Pontos</Label>
                      <div className="relative">
                        <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-primary fill-primary" />
                        <Input 
                          id="points" 
                          type="number" 
                          value={formPointsCost} 
                          onChange={(e) => setFormPointsCost(e.target.value)} 
                          placeholder="0"
                          className="pl-8 border-border"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground font-bold">Imagem do Produto</Label>
                    <div 
                      className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {formImages[0] ? (
                        <img src={formImages[0]} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground font-medium">Upload de Imagem</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-foreground font-bold">Estoque</Label>
                      <Input 
                        id="stock" 
                        type="number" 
                        value={formStock} 
                        onChange={(e) => setFormStock(e.target.value)} 
                        placeholder="0"
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-foreground font-bold">Categoria</Label>
                      <Select value={formCategory} onValueChange={setFormCategory}>
                        <SelectTrigger className="border-border">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vestuário">Vestuário</SelectItem>
                          <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                          <SelectItem value="Escritório">Escritório</SelectItem>
                          <SelectItem value="Acessórios">Acessórios</SelectItem>
                          <SelectItem value="Gourmet">Gourmet</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground font-bold">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={formDescription} 
                  onChange={(e) => setFormDescription(e.target.value)} 
                  placeholder="Descreva as características do produto..."
                  className="min-h-[100px] border-border"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                <div className="space-y-0.5">
                  <Label className="text-foreground font-bold">Produto Ativo</Label>
                  <p className="text-xs text-muted-foreground">Produtos inativos não aparecem na vitrine para os membros.</p>
                </div>
                <Switch checked={formActive} onCheckedChange={setFormActive} />
              </div>

            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => { setIsNewOpen(false); setIsEditOpen(false); }}>
                Cancelar
              </Button>
              <Button onClick={isNewOpen ? handleCreateProduct : handleSaveProduct} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isNewOpen ? "Criar Produto" : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Delete Product */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">Excluir Produto</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o produto <span className="font-bold text-foreground">"{selectedProduct?.name}"</span>?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100 text-rose-700 my-4">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-xs font-medium">O histórico de pedidos relacionados a este produto será preservado, mas ele será removido permanentemente do catálogo.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Confirmar Exclusão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Manage Tags */}
        <Dialog open={isTagsOpen} onOpenChange={setIsTagsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground font-bold flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Gerenciar Tags: {selectedProduct?.name}
              </DialogTitle>
              <DialogDescription>
                Tags ajudam na segmentação e busca de produtos na loja.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-foreground font-bold">Adicionar Tag</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ex: VIP, Verão, Limitado..." 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    className="border-border"
                  />
                  <Button onClick={handleAddTag} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-foreground font-bold">Tags Atuais</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct?.tags && selectedProduct.tags.length > 0 ? (
                    selectedProduct.tags.map(tag => (
                      <Badge key={tag} className="bg-muted text-primary border-border px-3 py-1 flex items-center gap-1 group">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <div className="w-full py-8 text-center bg-muted rounded-xl border border-dashed border-border">
                      <p className="text-xs text-muted-foreground font-medium">Nenhuma tag cadastrada.</p>
                    </div>
                  )}
                </div>
              </div>

              {allTags.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-foreground font-bold">Tags Sugeridas</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags
                      .filter(tag => !selectedProduct?.tags?.includes(tag))
                      .slice(0, 10)
                      .map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (selectedProduct) {
                              addTagToProduct(selectedProduct.id, tag)
                              const allProducts = getProducts()
                              setProducts(allProducts)
                              setSelectedProduct(allProducts.find(p => p.id === selectedProduct.id) || null)
                            }
                          }}
                          className="text-[10px] font-bold px-2 py-1 rounded-md bg-background border border-border text-primary hover:bg-primary hover:text-primary-foreground transition-all uppercase"
                        >
                          {tag}
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsTagsOpen(false)} className="w-full bg-primary hover:bg-primary/90">
                Concluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Restock Request */}
        <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-amber-900 font-bold flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Solicitar Reposição de Estoque
              </DialogTitle>
              <DialogDescription>
                Crie um orçamento de reposição para este produto.
              </DialogDescription>
            </DialogHeader>
            
            {restockProduct && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {restockProduct.images?.[0] ? (
                      <img 
                        src={restockProduct.images[0]} 
                        alt={restockProduct.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{restockProduct.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {restockProduct.sku || "N/A"}</p>
                      <p className="text-sm">Estoque atual: <span className="font-semibold">{restockProduct.stockQuantity || 0}</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restockQty">Quantidade para Repor</Label>
                  <Input
                    id="restockQty"
                    type="number"
                    min="1"
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value)}
                    className="text-lg font-semibold"
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Valor estimado:</strong> R$ {((restockProduct.price || 0) * (parseInt(restockQty) || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitRestock} className="bg-amber-600 hover:bg-amber-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Solicitar Reposição
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          open={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
          companyId={companyId}
          onEdit={(product) => {
            setIsViewDetailsOpen(false)
            openEditDialog(product)
          }}
          onDelete={(product) => {
            setIsViewDetailsOpen(false)
            setSelectedProduct(product)
            setIsDeleteOpen(true)
          }}
        />
    </PageContainer>
  )
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card className="border-none shadow-sm bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold text-primary uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}
