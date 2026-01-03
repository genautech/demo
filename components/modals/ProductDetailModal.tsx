"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  Tag,
  Coins,
  DollarSign,
  Edit,
  Trash2,
  ShoppingCart,
  Box,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { 
  type CompanyProduct, 
  getCurrencyName,
} from "@/lib/storage"
import { cn } from "@/lib/utils"

interface ProductDetailModalProps {
  product: CompanyProduct | null
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId?: string
  onEdit?: (product: CompanyProduct) => void
  onDelete?: (product: CompanyProduct) => void
  onAddToCart?: (product: CompanyProduct) => void
}

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
  companyId = "company_1",
  onEdit,
  onDelete,
  onAddToCart,
}: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) return null

  const images = product.images?.length ? product.images : ["/placeholder.jpg"]
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const stockStatus = product.stockQuantity > 10 
    ? { label: "Em Estoque", color: "bg-green-100 text-green-700 border-green-200" }
    : product.stockQuantity > 0 
      ? { label: "Estoque Baixo", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
      : { label: "Sem Estoque", color: "bg-red-100 text-red-700 border-red-200" }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={product.name}
      description={`SKU: ${product.finalSku || product.sku || "N/A"}`}
      maxWidth="2xl"
      footer={
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(product)}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" onClick={() => onDelete(product)}>
              <Trash2 className="h-4 w-4 mr-2" /> Excluir
            </Button>
          )}
          {onAddToCart && product.stockQuantity > 0 && (
            <Button onClick={() => onAddToCart(product)}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Adicionar ao Carrinho
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Galeria de Imagens */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="aspect-video bg-muted rounded-xl overflow-hidden relative">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.jpg"
              }}
            />
            
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Indicadores de imagem */}
          {hasMultipleImages && (
            <div className="flex justify-center gap-2 mt-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    idx === currentImageIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  )}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Status e Preço */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex items-center gap-2">
            <Badge className={cn("border px-3 py-1", stockStatus.color)}>
              {product.stockQuantity > 0 ? (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              ) : (
                <XCircle className="h-3.5 w-3.5 mr-1" />
              )}
              {stockStatus.label}
            </Badge>
            <Badge variant={product.isActive ? "default" : "secondary"} className="px-3 py-1">
              {product.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">
              {product.pointsCost?.toLocaleString("pt-BR")}
            </span>
            <span className="text-sm font-bold uppercase text-muted-foreground">
              {getCurrencyName(companyId, true)}
            </span>
          </div>
        </motion.div>

        {/* Descrição */}
        {product.description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Package className="h-4 w-4" /> Descrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Grid de Informações */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <Box className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <p className="text-xl font-bold">{product.stockQuantity}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-medium">Em Estoque</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <p className="text-xl font-bold">R$ {product.price?.toFixed(2)}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-medium">Preço Base</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <Coins className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold">{product.pointsCost?.toLocaleString("pt-BR")}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-medium">Custo em {getCurrencyName(companyId, true)}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4 pb-3">
              <BarChart3 className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <p className="text-xl font-bold">{product.totalSold || 0}</p>
              <p className="text-[10px] uppercase text-muted-foreground font-medium">Vendidos</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categoria e Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid gap-4 md:grid-cols-2"
        >
          <Card>
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4" /> Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {product.category || "Sem categoria"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Tag className="h-4 w-4" /> Tags ({product.tags?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.tags && product.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Nenhuma tag</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Informações Adicionais */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-medium mb-1">SKU</p>
                  <p className="font-mono">{product.finalSku || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-medium mb-1">NCM</p>
                  <p className="font-mono text-primary">{product.ncm || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-medium mb-1">Peso</p>
                  <p>{product.weight ? `${product.weight}kg` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-medium mb-1">Criado em</p>
                  <p>{product.createdAt ? new Date(product.createdAt).toLocaleDateString("pt-BR") : "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-medium mb-1">Atualizado em</p>
                  <p>{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("pt-BR") : "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ResponsiveModal>
  )
}
