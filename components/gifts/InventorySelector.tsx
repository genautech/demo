"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingBag, CheckCircle2 } from "lucide-react"
import { getCurrencyName } from "@/lib/storage"

interface Product {
  id: string
  name: string
  description?: string
  pointsCost: number
  stockQuantity: number
  images?: string[]
}

interface InventorySelectorProps {
  products: Product[]
  onSelect: (selectedItems: { productId: string; quantity: number }[]) => void
}

export function InventorySelector({ products, onSelect }: InventorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({})
  const [companyId, setCompanyId] = useState<string>("company_1")

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch {}
    }
  }, [])

  const selectedItemsArray = useMemo(
    () =>
      Object.entries(selectedItems).map(([id, quantity]) => ({
        productId: id,
        quantity,
      })),
    [selectedItems]
  )

  // Notify parent after state changes (avoid side effects in state updaters)
  useEffect(() => {
    onSelect(selectedItemsArray)
  }, [onSelect, selectedItemsArray])

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUpdateQuantity = (productId: string, delta: number, stock: number) => {
    setSelectedItems((prev) => {
      const current = prev[productId] || 0
      const next = Math.max(0, Math.min(stock, current + delta))
      
      const newItems = { ...prev }
      if (next === 0) {
        delete newItems[productId]
      } else {
        newItems[productId] = next
      }
      return newItems
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar no inventário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const quantity = selectedItems[product.id] || 0
          return (
            <Card key={product.id} className={`overflow-hidden transition-all ${quantity > 0 ? 'border-primary ring-1 ring-primary' : ''}`}>
              <div className="aspect-square bg-muted relative">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="text-xs">{product.pointsCost} {getCurrencyName(companyId, true)}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Estoque: {product.stockQuantity}</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleUpdateQuantity(product.id, -1, product.stockQuantity)}
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => handleUpdateQuantity(product.id, 1, product.stockQuantity)}
                      disabled={quantity >= product.stockQuantity}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
