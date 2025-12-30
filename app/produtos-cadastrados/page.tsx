"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AppShell } from "@/components/app-shell"
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
import { ShoppingBag, Plus, Search, Edit, Trash2, ImagePlus, Coins, Package, DollarSign, Tag, X } from "lucide-react"
import { getProducts, saveProducts, getTags, addTagToProduct, removeTagFromProduct, type Product } from "@/lib/storage"

export default function ProdutosCadastradosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formSku, setFormSku] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formPriceInBrents, setFormPriceInBrents] = useState("")
  const [formStock, setFormStock] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formImages, setFormImages] = useState<string[]>([])
  const [formActive, setFormActive] = useState(true)
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    setProducts(getProducts())
    setAllTags(getTags())
  }, [])

  const categories = [...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesTag = !tagFilter || (product.tags || []).includes(tagFilter)
    return matchesSearch && matchesCategory && matchesTag
  })

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.active).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  const resetForm = () => {
    setFormName("")
    setFormDescription("")
    setFormSku("")
    setFormPrice("")
    setFormPriceInBrents("")
    setFormStock("")
    setFormCategory("")
    setFormImages([])
    setFormActive(true)
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormName(product.name)
    setFormDescription(product.description)
    setFormSku(product.sku || "")
    setFormPrice(product.price.toString())
    setFormPriceInBrents(product.priceInBrents.toString())
    setFormStock(product.stock.toString())
    setFormCategory(product.category)
    setFormImages(product.images || [])
    setFormActive(product.active)
    setIsEditOpen(true)
  }

  const openNewDialog = () => {
    resetForm()
    setIsNewOpen(true)
  }

  const handleSaveProduct = () => {
    if (!selectedProduct || !formName || !formPrice) return

    const updatedProducts = products.map((p) =>
      p.id === selectedProduct.id
        ? {
            ...p,
            name: formName,
            description: formDescription,
            sku: formSku || undefined,
            price: Number.parseFloat(formPrice),
            priceInBrents: Number.parseInt(formPriceInBrents) || 0,
            stock: Number.parseInt(formStock) || 0,
            category: formCategory,
            images: formImages,
            active: formActive,
            updatedAt: new Date().toISOString().split("T")[0],
          }
        : p,
    )
    saveProducts(updatedProducts)
    setProducts(updatedProducts)
    setIsEditOpen(false)
    setSelectedProduct(null)
  }

  const handleCreateProduct = () => {
    if (!formName || !formPrice) return

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formName,
      description: formDescription,
      sku: formSku || undefined,
      price: Number.parseFloat(formPrice),
      priceInBrents: Number.parseInt(formPriceInBrents) || 0,
      stock: Number.parseInt(formStock) || 0,
      category: formCategory || "Outros",
      images: formImages,
      tags: [],
      active: formActive,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    const updatedProducts = [...products, newProduct]
    saveProducts(updatedProducts)
    setProducts(updatedProducts)
    setIsNewOpen(false)
    resetForm()
  }

  const handleDeleteProduct = () => {
    if (!selectedProduct) return
    const updatedProducts = products.filter((p) => p.id !== selectedProduct.id)
    saveProducts(updatedProducts)
    setProducts(updatedProducts)
    setIsDeleteOpen(false)
    setSelectedProduct(null)
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

  const handleManageTags = (product: Product) => {
    setSelectedProduct(product)
    setNewTag("")
    setIsTagsOpen(true)
  }

  const handleAddTag = () => {
    if (!selectedProduct || !newTag.trim()) return
    addTagToProduct(selectedProduct.id, newTag.trim())
    setProducts(getProducts())
    setAllTags(getTags())
    setSelectedProduct(getProducts().find((p) => p.id === selectedProduct.id) || null)
    setNewTag("")
  }

  const handleRemoveTag = (tag: string) => {
    if (!selectedProduct) return
    removeTagFromProduct(selectedProduct.id, tag)
    setProducts(getProducts())
    setSelectedProduct(getProducts().find((p) => p.id === selectedProduct.id) || null)
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produtos Cadastrados</h1>
            <p className="text-muted-foreground">Gerencie os produtos da loja PRIO</p>
          </div>
          <Button onClick={openNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRTS
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Catálogo de Produtos</CardTitle>
            <CardDescription>Visualize e edite os produtos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, descrição ou SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag filters */}
              <div className="flex gap-2 flex-wrap">
                <Button variant={tagFilter === "" ? "default" : "outline"} size="sm" onClick={() => setTagFilter("")}>
                  Todas
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={tagFilter === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTagFilter(tag === tagFilter ? "" : tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className={`overflow-hidden ${!product.active ? "opacity-60" : ""}`}>
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={
                        product.images?.[0] || product.image || "/placeholder.svg?height=200&width=200&query=product"
                      }
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                    {!product.active && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary">Inativo</Badge>
                      </div>
                    )}
                    {/* Tags overlay */}
                    {(product.tags || []).length > 0 && (
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {(product.tags || []).slice(0, 2).map((tag) => (
                          <Badge key={tag} className="bg-primary/90 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(product.tags || []).length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{(product.tags || []).length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold">
                          {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} BRTS
                        </p>
                        <p className="text-sm text-amber-600 flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          {product.priceInBrents.toLocaleString()} BRENTS
                        </p>
                      </div>
                      <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                        {product.stock > 0 ? `${product.stock} un.` : "Esgotado"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handleManageTags(product)}
                        title="Gerenciar tags"
                      >
                        <Tag className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsDeleteOpen(true)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum produto encontrado</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Produto
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label>Nome do Produto</Label>
                  <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label>SKU</Label>
                  <Input value={formSku} onChange={(e) => setFormSku(e.target.value)} placeholder="Código único" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label>Categoria</Label>
                  <Input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label>Preço (BRTS)</Label>
                  <Input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                </div>
                <div>
                  <Label>Preço em BRENTS</Label>
                  <Input
                    type="number"
                    value={formPriceInBrents}
                    onChange={(e) => setFormPriceInBrents(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Estoque</Label>
                  <Input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} />
                </div>
                <div className="flex items-end pb-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={formActive} onCheckedChange={setFormActive} />
                    <Label>Ativo</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label>Imagens do Produto</Label>
                <div className="flex items-center gap-4 mt-2">
                  {formImages[0] && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={formImages[0] || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      placeholder="URL da imagem ou faça upload"
                      value={formImages[0]}
                      onChange={(e) => setFormImages([e.target.value])}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Upload de Imagem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProduct}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Product Dialog */}
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Produto
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label>Nome do Produto</Label>
                  <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label>SKU</Label>
                  <Input value={formSku} onChange={(e) => setFormSku(e.target.value)} placeholder="Código único" />
                </div>
              </div>
              <div>
                <Label>Categoria</Label>
                <Input
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="Ex: Vestuário, Acessórios..."
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label>Preço (BRTS)</Label>
                  <Input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                </div>
                <div>
                  <Label>Preço em BRENTS</Label>
                  <Input
                    type="number"
                    value={formPriceInBrents}
                    onChange={(e) => setFormPriceInBrents(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Estoque</Label>
                  <Input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} />
                </div>
                <div className="flex items-end pb-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={formActive} onCheckedChange={setFormActive} />
                    <Label>Ativo</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label>Imagens do Produto</Label>
                <div className="flex items-center gap-4 mt-2">
                  {formImages[0] && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={formImages[0] || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      placeholder="URL da imagem ou faça upload"
                      value={formImages[0]}
                      onChange={(e) => setFormImages([e.target.value])}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Upload de Imagem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProduct}>Criar Produto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tags Dialog */}
        <Dialog open={isTagsOpen} onOpenChange={setIsTagsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-purple-600" />
                Gerenciar Tags - {selectedProduct?.name}
              </DialogTitle>
              <DialogDescription>Tags são usadas para categorizar e destacar produtos na loja</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Current tags */}
              <div className="space-y-2">
                <Label>Tags atuais</Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-muted/50">
                  {(selectedProduct?.tags || []).length > 0 ? (
                    (selectedProduct?.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Nenhuma tag adicionada</span>
                  )}
                </div>
              </div>

              {/* Add new tag */}
              <div className="space-y-2">
                <Label>Adicionar tag</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite uma nova tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Suggested tags */}
              <div className="space-y-2">
                <Label>Tags sugeridas</Label>
                <div className="flex flex-wrap gap-2">
                  {allTags
                    .filter((tag) => !(selectedProduct?.tags || []).includes(tag))
                    .map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewTag(tag)
                          handleAddTag()
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tag}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsTagsOpen(false)}>Concluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Excluir Produto
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir <strong>{selectedProduct?.name}</strong>? Esta ação não pode ser
                desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
