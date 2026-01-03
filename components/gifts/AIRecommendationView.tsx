"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Package, Sparkles, CheckCircle2 } from "lucide-react"
import { getCurrencyName } from "@/lib/storage"
import { motion } from "framer-motion"

interface Product {
  id: string
  name: string
  description?: string
  pointsCost: number
  stockQuantity: number
  category?: string
  image?: string
  images?: string[]
}

interface Recommendation {
  productId: string
  quantity: number
  reason: string
  isStockRecommendation: boolean
  product: Product
}

interface AIRecommendationViewProps {
  recommendations: Recommendation[]
  onApply: (recommendations: Recommendation[]) => void
  onCancel: () => void
  companyId?: string
}

export function AIRecommendationView({
  recommendations,
  onApply,
  onCancel,
  companyId = "company_1",
}: AIRecommendationViewProps) {
  const stockRecommendations = recommendations.filter((r) => r.isStockRecommendation)
  const catalogRecommendations = recommendations.filter((r) => !r.isStockRecommendation)

  const totalStockItems = stockRecommendations.reduce((sum, r) => sum + r.quantity, 0)
  const totalCatalogItems = catalogRecommendations.reduce((sum, r) => sum + r.quantity, 0)
  const totalCost = recommendations.reduce((sum, r) => sum + r.product.pointsCost * r.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Resumo das Recomendações</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">
              Total de Produtos
            </p>
            <p className="font-medium text-lg">{recommendations.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">
              Custo Total
            </p>
            <p className="font-medium text-lg">
              {totalCost} {getCurrencyName(companyId, true)}
            </p>
          </div>
          {stockRecommendations.length > 0 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">
                Em Estoque
              </p>
              <p className="font-medium">
                {stockRecommendations.length} produto(s) • {totalStockItems} unidade(s)
              </p>
            </div>
          )}
          {catalogRecommendations.length > 0 && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">
                Do Catálogo
              </p>
              <p className="font-medium">
                {catalogRecommendations.length} produto(s) • {totalCatalogItems} unidade(s)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-4">
        {stockRecommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-green-600" />
              Produtos em Estoque ({stockRecommendations.length})
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {stockRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecommendationCard recommendation={rec} companyId={companyId} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {catalogRecommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-orange-600" />
              Recomendações de Compra do Catálogo ({catalogRecommendations.length})
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {catalogRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (stockRecommendations.length + index) * 0.1 }}
                >
                  <RecommendationCard recommendation={rec} companyId={companyId} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          onClick={() => onApply(recommendations)}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Aplicar Recomendações
        </Button>
      </div>
    </div>
  )
}

function RecommendationCard({
  recommendation,
  companyId,
}: {
  recommendation: Recommendation
  companyId: string
}) {
  const { product, quantity, reason, isStockRecommendation } = recommendation
  const productImage = product.image || product.images?.[0]

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <div className="aspect-square bg-muted relative shrink-0">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={isStockRecommendation ? "default" : "secondary"}
            className={
              isStockRecommendation
                ? "bg-green-600 text-white"
                : "bg-orange-600 text-white"
            }
          >
            {isStockRecommendation ? "Em Estoque" : "Catálogo"}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-1 text-[10px] text-primary font-bold uppercase tracking-wider mb-1">
          <Sparkles className="h-3 w-3" />
          Fator UAU
        </div>
        <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="text-xs">
          {product.category && <span className="font-semibold text-primary/70">{product.category} • </span>}
          {product.pointsCost} {getCurrencyName(companyId, true)} • Qtd: {quantity}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Estoque:</span>
            <span className={product.stockQuantity > 0 ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
              {product.stockQuantity} unidades
            </span>
          </div>
          {reason && (
            <div className="pt-2 border-t bg-primary/5 -mx-4 px-4 py-2 mt-2">
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{reason}"
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
