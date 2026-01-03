"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Mail,
  Truck,
  DollarSign,
  Layers,
  Building2,
  Palette,
  Upload,
  Download,
  Info,
  Percent,
} from "lucide-react"
import { 
  getBaseProducts, 
  createBaseProduct, 
  updateBaseProduct, 
  deleteBaseProduct,
  ensureBaseProductsSeeded,
  getSuppliers,
  getCustomizationOptions,
  generateDefaultPriceTiers,
  importPriceTiersFromCSV,
  generatePriceTierCSVTemplate,
  type BaseProduct,
  type PriceTier,
  type Supplier,
  type CustomizationOption,
} from "@/lib/storage"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

// Product categories for the catalog
const PRODUCT_CATEGORIES = [
  { value: "Eletrônicos", label: "Eletrônicos" },
  { value: "Swag", label: "Swag" },
  { value: "Brindes Corporativos", label: "Brindes Corporativos" },
  { value: "Produtos Digitais", label: "Produtos Digitais" },
  { value: "Vestuário", label: "Vestuário" },
  { value: "Acessórios", label: "Acessórios" },
  { value: "Wearables", label: "Wearables" },
  { value: "Periféricos", label: "Periféricos" },
  { value: "Papelaria", label: "Papelaria" },
  { value: "Outros", label: "Outros" },
]

interface FormData {
  name: string
  sku: string
  ncm: string
  category: string
  description: string
  price: string
  imageUrl: string
  isDigital: boolean
  priceTiers: PriceTier[]
  customizationOptionIds: string[]
  supplierId: string
  supplierSku: string
  stockAvailable: string
}

const initialFormData: FormData = {
  name: "",
  sku: "",
  ncm: "",
  category: "Eletrônicos",
  description: "",
  price: "0",
  imageUrl: "",
  isDigital: false,
  priceTiers: [],
  customizationOptionIds: [],
  supplierId: "",
  supplierSku: "",
  stockAvailable: "0",
}

export default function BaseCatalogPage() {
  const [products, setProducts] = useState<BaseProduct[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOption[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  
  // State for Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<BaseProduct | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  
  // Form State
  const [formData, setFormData] = useState<FormData>(initialFormData)
  
  // Import CSV state
  const [csvContent, setCsvContent] = useState("")

  useEffect(() => {
    ensureBaseProductsSeeded()
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    try {
      const productsData = getBaseProducts()
      setProducts(productsData)
      setSuppliers(getSuppliers())
      setCustomizationOptions(getCustomizationOptions())
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast.error("Erro ao carregar catálogo")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormData(initialFormData)
    setActiveTab("basic")
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (product: BaseProduct) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku || product.id,
      ncm: product.ncm || "",
      category: product.category,
      description: product.description,
      price: String(product.price || 0),
      imageUrl: product.images?.[0] || "",
      isDigital: product.isDigital || false,
      priceTiers: product.priceTiers || [],
      customizationOptionIds: product.customizationOptionIds || [],
      supplierId: product.supplierId || "",
      supplierSku: product.supplierSku || "",
      stockAvailable: String(product.stockAvailable || 0),
    })
    setActiveTab("basic")
    setIsDialogOpen(true)
  }

  const handleGenerateDefaultTiers = () => {
    const basePrice = parseFloat(formData.price) || 0
    if (basePrice <= 0) {
      toast.error("Defina um preço base primeiro")
      return
    }
    const tiers = generateDefaultPriceTiers(basePrice)
    setFormData({ ...formData, priceTiers: tiers })
    toast.success("Tiers de preço gerados com desconto padrão")
  }

  const handleUpdateTier = (index: number, field: keyof PriceTier, value: number | null) => {
    const newTiers = [...formData.priceTiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    
    // Auto-calculate discount when price changes
    if (field === 'price') {
      const basePrice = parseFloat(formData.price) || 0
      if (basePrice > 0 && value !== null) {
        newTiers[index].discount = Math.round((1 - (value as number) / basePrice) * 100)
      }
    }
    
    setFormData({ ...formData, priceTiers: newTiers })
  }

  const handleSave = () => {
    if (!formData.name || !formData.category) {
      toast.error("Nome e categoria são obrigatórios")
      return
    }

    const productData: Partial<BaseProduct> = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      sku: formData.sku,
      ncm: formData.ncm || undefined,
      price: parseFloat(formData.price) || 0,
      images: formData.imageUrl ? [formData.imageUrl] : [],
      isDigital: formData.isDigital,
      priceTiers: formData.priceTiers.length > 0 ? formData.priceTiers : undefined,
      customizationOptionIds: formData.customizationOptionIds.length > 0 ? formData.customizationOptionIds : undefined,
      supplierId: formData.supplierId || undefined,
      supplierSku: formData.supplierSku || undefined,
      stockAvailable: parseInt(formData.stockAvailable) || 0,
    }

    try {
      if (editingProduct) {
        updateBaseProduct(editingProduct.id, productData)
        toast.success("Produto atualizado com sucesso")
      } else {
        createBaseProduct(productData)
        toast.success("Produto criado com sucesso")
      }
      setIsDialogOpen(false)
      loadData()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar produto")
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto base?")) {
      try {
        deleteBaseProduct(id)
        toast.success("Produto excluído com sucesso")
        loadData()
      } catch (error) {
        console.error("Erro ao excluir:", error)
        toast.error("Erro ao excluir produto")
      }
    }
  }

  const handleImportCSV = () => {
    if (!csvContent.trim()) {
      toast.error("Cole o conteúdo CSV primeiro")
      return
    }
    
    const result = importPriceTiersFromCSV(csvContent)
    
    if (result.success > 0) {
      toast.success(`${result.success} produto(s) atualizado(s) com sucesso`)
      loadData()
    }
    
    if (result.failed > 0) {
      result.errors.forEach(err => {
        toast.error(`Linha ${err.row} (${err.sku}): ${err.error}`)
      })
    }
    
    setIsImportDialogOpen(false)
    setCsvContent("")
  }

  const handleDownloadTemplate = () => {
    const template = generatePriceTierCSVTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'price_tiers_template.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Template baixado")
  }

  const toggleCustomization = (optionId: string) => {
    const current = formData.customizationOptionIds
    if (current.includes(optionId)) {
      setFormData({
        ...formData,
        customizationOptionIds: current.filter(id => id !== optionId)
      })
    } else {
      setFormData({
        ...formData,
        customizationOptionIds: [...current, optionId]
      })
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Count products by category
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const digitalCount = products.filter(p => p.isDigital).length
  const physicalCount = products.filter(p => !p.isDigital).length
  const withTiersCount = products.filter(p => p.priceTiers && p.priceTiers.length > 0).length

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo Base Global</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os produtos mestres com precificação por quantidade
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            Importar Tiers CSV
          </Button>
          <Button className="gap-2" onClick={handleOpenCreate} data-tour="add-base-product">
            <Plus className="h-4 w-4" />
            Novo Produto Base
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Truck className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{physicalCount}</p>
                <p className="text-sm text-muted-foreground">Físicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Mail className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{digitalCount}</p>
                <p className="text-sm text-muted-foreground">Digitais</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Layers className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{withTiersCount}</p>
                <p className="text-sm text-muted-foreground">Com Tiers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Building2 className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{suppliers.length}</p>
                <p className="text-sm text-muted-foreground">Fornecedores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome, SKU ou categoria..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todas categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label} {categoryCounts[cat.value] ? `(${categoryCounts[cat.value]})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={loadData}>
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagem</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço Base</TableHead>
                <TableHead>Tiers</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const supplier = suppliers.find(s => s.id === product.supplierId)
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {product.sku || product.id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.isDigital ? (
                          <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                            <Mail className="h-3 w-3 mr-1" />
                            Digital
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                            <Truck className="h-3 w-3 mr-1" />
                            Físico
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          R$ {(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.priceTiers && product.priceTiers.length > 0 ? (
                          <Badge className="bg-green-100 text-green-800 gap-1">
                            <Layers className="h-3 w-3" />
                            {product.priceTiers.length}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier ? (
                          <Badge variant="outline" className="gap-1">
                            <Building2 className="h-3 w-3" />
                            {supplier.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleOpenEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto Base" : "Novo Produto Base"}</DialogTitle>
            <DialogDescription>
              Configure informações, precificação por quantidade e personalização.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="gap-1">
                <Package className="h-4 w-4" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="pricing" className="gap-1">
                <DollarSign className="h-4 w-4" />
                Preços
              </TabsTrigger>
              <TabsTrigger value="customization" className="gap-1">
                <Palette className="h-4 w-4" />
                Personaliz.
              </TabsTrigger>
              <TabsTrigger value="supplier" className="gap-1">
                <Building2 className="h-4 w-4" />
                Fornecedor
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4 pr-4">
              <TabsContent value="basic" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nome do produto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="SKU-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => {
                        const isDigital = value === "Produtos Digitais"
                        setFormData({ ...formData, category: value, isDigital })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ncm">NCM</Label>
                    <Input
                      id="ncm"
                      value={formData.ncm}
                      onChange={(e) => setFormData({ ...formData, ncm: e.target.value })}
                      placeholder="00000000"
                      maxLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço Base (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagem</Label>
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    onRemove={() => setFormData({ ...formData, imageUrl: "" })}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="isDigital"
                    checked={formData.isDigital}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDigital: checked === true })}
                  />
                  <Label htmlFor="isDigital" className="text-sm font-normal cursor-pointer">
                    Produto Digital (entrega por e-mail, sem frete)
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição detalhada do produto..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Precificação por Quantidade</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure descontos progressivos por faixa de quantidade
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateDefaultTiers}
                  >
                    <Percent className="h-4 w-4 mr-2" />
                    Gerar Tiers Padrão
                  </Button>
                </div>

                {formData.priceTiers.length === 0 ? (
                  <div className="border rounded-lg p-6 text-center">
                    <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Nenhum tier de preço configurado
                    </p>
                    <Button variant="outline" onClick={handleGenerateDefaultTiers}>
                      Gerar Tiers Automáticos
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Qtd. Mín</TableHead>
                          <TableHead>Qtd. Máx</TableHead>
                          <TableHead>Preço Unit.</TableHead>
                          <TableHead>Desconto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formData.priceTiers.map((tier, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input
                                type="number"
                                min={1}
                                value={tier.minQuantity}
                                onChange={(e) => handleUpdateTier(index, 'minQuantity', parseInt(e.target.value))}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={tier.minQuantity}
                                value={tier.maxQuantity ?? ''}
                                placeholder="∞"
                                onChange={(e) => handleUpdateTier(index, 'maxQuantity', e.target.value ? parseInt(e.target.value) : null)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">R$</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={tier.price}
                                  onChange={(e) => handleUpdateTier(index, 'price', parseFloat(e.target.value))}
                                  className="w-24"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={tier.discount > 0 ? "default" : "secondary"}>
                                {tier.discount}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Tiers de quantidade padrão:</p>
                      <p>1-10 (0%), 10-50 (5%), 50-100 (10%), 100-500 (15%), 500-1000 (20%), +1000 (25%)</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customization" className="space-y-4 mt-0">
                <div>
                  <h4 className="font-medium">Opções de Personalização</h4>
                  <p className="text-sm text-muted-foreground">
                    Selecione os tipos de personalização disponíveis para este produto
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {customizationOptions.filter(o => o.isActive).map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        formData.customizationOptionIds.includes(option.id)
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => toggleCustomization(option.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.customizationOptionIds.includes(option.id)}
                          onCheckedChange={() => toggleCustomization(option.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{option.name}</p>
                          {option.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                          )}
                          {option.additionalCost > 0 && (
                            <Badge variant="secondary" className="mt-2 text-[10px]">
                              +R$ {option.additionalCost.toFixed(2)}/un
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {customizationOptions.filter(o => o.isActive).length === 0 && (
                  <div className="border rounded-lg p-6 text-center">
                    <Palette className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma opção de personalização disponível
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="supplier" className="space-y-4 mt-0">
                <div>
                  <h4 className="font-medium">Vínculo com Fornecedor</h4>
                  <p className="text-sm text-muted-foreground">
                    Vincule este produto a um fornecedor para sincronização automática
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <Select 
                      value={formData.supplierId || "none"} 
                      onValueChange={(value) => setFormData({ ...formData, supplierId: value === "none" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {suppliers.filter(s => s.status === "active").map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.supplierId && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="supplierSku">SKU do Fornecedor</Label>
                        <Input
                          id="supplierSku"
                          value={formData.supplierSku}
                          onChange={(e) => setFormData({ ...formData, supplierSku: e.target.value })}
                          placeholder="Código do produto no fornecedor"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stockAvailable">Estoque Disponível</Label>
                        <Input
                          id="stockAvailable"
                          type="number"
                          min={0}
                          value={formData.stockAvailable}
                          onChange={(e) => setFormData({ ...formData, stockAvailable: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>

                {suppliers.length === 0 && (
                  <div className="border rounded-lg p-6 text-center">
                    <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum fornecedor cadastrado
                    </p>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar Produto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Importar Tiers de Preço via CSV</DialogTitle>
            <DialogDescription>
              Importe tiers de precificação por quantidade para múltiplos produtos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Template
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Conteúdo CSV</Label>
              <Textarea
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="sku,min_qty,max_qty,price,discount&#10;PROD-001,1,10,100.00,0&#10;PROD-001,10,50,95.00,5&#10;..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Formato esperado:</p>
              <code className="text-xs">sku,min_qty,max_qty,price,discount</code>
              <p className="text-xs text-muted-foreground mt-2">
                Use "null" ou deixe vazio para max_qty infinito (tier +1000)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleImportCSV}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
