"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Package,
  Save,
  Edit,
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { 
  getCompanyProductById, 
  getBaseProductById,
  updateCompanyProduct,
  getCurrencyName,
  type CompanyProduct,
  type BaseProduct,
} from "@/lib/storage"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function CatalogProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<CompanyProduct | null>(null)
  const [baseProduct, setBaseProduct] = useState<BaseProduct | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [companyId, setCompanyId] = useState<string>("company_1")
  
  // Form state
  const [formData, setFormData] = useState({
    price: 0,
    pointsCost: 0,
    stockQuantity: 0,
    isActive: true,
  })

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Failed to parse auth data:", error)
        }
      }
    }
    
    const companyProduct = getCompanyProductById(productId)
    if (!companyProduct) {
      toast.error("Produto não encontrado.")
      router.push("/gestor/catalog")
      return
    }

    setProduct(companyProduct)
    setFormData({
      price: companyProduct.price || 0,
      pointsCost: companyProduct.pointsCost || 0,
      stockQuantity: companyProduct.stockQuantity || 0,
      isActive: companyProduct.isActive ?? true,
    })

    // Load base product for reference
    if (companyProduct.baseProductId) {
      const base = getBaseProductById(companyProduct.baseProductId)
      setBaseProduct(base || null)
    }
  }, [productId, router])

  const handleSave = async () => {
    if (!product) return

    setIsSaving(true)
    try {
      const updated = updateCompanyProduct(product.id, {
        price: formData.price,
        pointsCost: formData.pointsCost,
        stockQuantity: formData.stockQuantity,
        isActive: formData.isActive,
      })

      if (updated) {
        setProduct(updated)
        setIsEditing(false)
        toast.success("Produto atualizado com sucesso.")
      } else {
        throw new Error("Falha ao atualizar produto")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar produto. Tente novamente."
      if (process.env.NODE_ENV === 'development') {
        console.error("Error updating product:", error)
      }
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (!product) return
    setFormData({
      price: product.price || 0,
      pointsCost: product.pointsCost || 0,
      stockQuantity: product.stockQuantity || 0,
      isActive: product.isActive ?? true,
    })
    setIsEditing(false)
  }

  if (!product) {
    return null
  }

  const isOutOfStock = (product.stockQuantity || 0) === 0

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/gestor/catalog")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Catálogo
        </Button>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <Card className="overflow-hidden border-none shadow-sm">
            <div className="aspect-square bg-muted relative">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground/50" />
                </div>
              )}
            </div>
          </Card>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img src={img} alt={`${product.name} ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex gap-2">
                {product.isActive ? (
                  <Badge className="bg-green-500">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Inativo</Badge>
                )}
                {isOutOfStock ? (
                  <Badge variant="destructive">Esgotado</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Em Estoque
                  </Badge>
                )}
              </div>
            </div>
            {product.description && (
              <p className="text-muted-foreground text-lg">{product.description}</p>
            )}
            {baseProduct && (
              <p className="text-sm text-muted-foreground mt-2">
                Baseado em: <span className="font-medium">{baseProduct.name}</span>
              </p>
            )}
          </div>

          {/* Price & Stock */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Preço e Estoque</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço em R$</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pointsCost">Preço em {getCurrencyName(companyId, true).toUpperCase()}</Label>
                    <Input
                      id="pointsCost"
                      type="number"
                      min="0"
                      value={formData.pointsCost}
                      onChange={(e) => setFormData({ ...formData, pointsCost: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Quantidade em Estoque</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Label htmlFor="isActive">Produto Ativo</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Preço</p>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">R$ {(product.price || 0).toFixed(2)}</p>
                      <p className="text-lg text-muted-foreground">
                        ou {(product.pointsCost || 0).toLocaleString("pt-BR")} {getCurrencyName(companyId, true)}
                      </p>
                    </div>
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
                          {product.stockQuantity} disponível{product.stockQuantity !== 1 ? 'is' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Informações do Produto</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU Final:</span>
                <span className="font-mono">{product.finalSku || "N/A"}</span>
              </div>
              {product.baseProductId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Base Product:</span>
                  <span className="font-mono text-xs">{product.baseProductId}</span>
                </div>
              )}
              {product.category && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categoria:</span>
                  <span>{product.category}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline">{product.status || "active"}</Badge>
              </div>
              {product.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{new Date(product.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
              )}
              {product.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Atualizado em:</span>
                  <span>{new Date(product.updatedAt).toLocaleDateString("pt-BR")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
