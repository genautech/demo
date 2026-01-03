"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Users, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProducts, getProductById, type Product, type CompanyProduct } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface AIRecommendationProps {
  currentProduct?: Product
  userTags?: string[]
  maxRecommendations?: number
  className?: string
}

type ProductUnion = Product | CompanyProduct

interface RecommendationItem {
  product: ProductUnion
  reason: string
  confidence: number
  type: "similar" | "trending" | "collaborative" | "popular"
}

const getPointsCost = (product: ProductUnion): number => {
  return 'pointsCost' in product ? product.pointsCost : product.priceInPoints
}

const getStockQuantity = (product: ProductUnion): number => {
  return 'stockQuantity' in product ? product.stockQuantity : product.stock
}

const getProductImages = (product: ProductUnion): string[] | undefined => {
  return product.images
}

export function AIRecommendations({ 
  currentProduct, 
  userTags = [], 
  maxRecommendations = 4,
  className 
}: AIRecommendationProps) {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateRecommendations()
  }, [currentProduct, userTags])

  const generateRecommendations = async () => {
    setLoading(true)
    const allProducts = getProducts()
    const recs: RecommendationItem[] = []

    if (currentProduct) {
      const similar = allProducts
        .filter(p => 
          p.id !== currentProduct.id && 
          p.category === currentProduct.category &&
          (p.tags?.some(tag => currentProduct.tags?.includes(tag)) || false)
        )
        .slice(0, 2)
        .map(product => ({
          product,
          reason: "Similar to what you're viewing",
          confidence: 0.85,
          type: "similar" as const
        }))
      recs.push(...similar)
    }

    const trending = allProducts
      .filter(p => !recs.find(r => r.product.id === p.id))
      .sort((a, b) => getPointsCost(b) - getPointsCost(a))
      .slice(0, 2)
      .map(product => ({
        product,
        reason: "Trending in your company",
        confidence: 0.75,
        type: "trending" as const
      }))
    recs.push(...trending)

    const collaborative = allProducts
      .filter(p => 
        !recs.find(r => r.product.id === p.id) &&
        p.tags?.some(tag => userTags.includes(tag))
      )
      .slice(0, 2)
      .map(product => ({
        product,
        reason: "Popular with similar preferences",
        confidence: 0.70,
        type: "collaborative" as const
      }))
    recs.push(...collaborative)

    setRecommendations(recs.slice(0, maxRecommendations))
    setLoading(false)
  }

  const getReasonIcon = (type: RecommendationItem["type"]) => {
    switch (type) {
      case "similar": return <ShoppingBag className="h-4 w-4" />
      case "trending": return <TrendingUp className="h-4 w-4" />
      case "collaborative": return <Users className="h-4 w-4" />
      case "popular": return <Sparkles className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  const getReasonColor = (type: RecommendationItem["type"]) => {
    switch (type) {
      case "similar": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "trending": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "collaborative": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "popular": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  const handleAddToCart = (product: ProductUnion) => {
    const savedCart = localStorage.getItem("yoobe_cart")
    const cart = savedCart ? JSON.parse(savedCart) : []
    
    const existingItem = cart.find((item: any) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        quantity: 1,
        pointsCost: getPointsCost(product),
        price: 'price' in product ? product.price : 0,
        images: getProductImages(product),
        stockQuantity: getStockQuantity(product)
      })
    }
    
    localStorage.setItem("yoobe_cart", JSON.stringify(cart))
    
    // Dispatch events after a microtask to avoid render-phase setState conflicts
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"))
      window.dispatchEvent(new Event("openCart"))
    }, 0)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((item, index) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg border bg-card hover:border-primary/30 transition-all">
                  <div className="aspect-square overflow-hidden">
                    {getProductImages(item.product)?.[0] ? (
                      <img
                        src={getProductImages(item.product)![0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(item.confidence * 100)}% match
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-semibold text-sm line-clamp-1 mb-1">
                      {item.product.name}
                    </h4>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {getReasonIcon(item.type)}
                      <span className="text-xs text-muted-foreground">
                        {item.reason}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-primary">
                        {getPointsCost(item.product).toLocaleString("pt-BR")} pts
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", getReasonColor(item.type))}
                      >
                        {getReasonIcon(item.type)}
                        <span className="ml-1">{item.type}</span>
                      </Badge>
                    </div>
                    
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(item.product)}
                      disabled={getStockQuantity(item.product) < 1}
                    >
                      {getStockQuantity(item.product) < 1 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" onClick={generateRecommendations}>
            <Sparkles className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}