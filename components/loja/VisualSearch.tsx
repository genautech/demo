"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Search, X, Sparkles, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getProducts, type Product, type CompanyProduct } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface VisualSearchProps {
  onProductSelect?: (product: Product | CompanyProduct) => void
  className?: string
}

type ProductUnion = Product | CompanyProduct

interface SearchResult {
  product: ProductUnion
  confidence: number
  matchType: "visual" | "text" | "category"
}

export function VisualSearch({ onProductSelect, className }: VisualSearchProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [scanProgress, setScanProgress] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const simulateVisualSearch = async (imageData: string): Promise<SearchResult[]> => {
    const allProducts = getProducts()
    const searchResults: SearchResult[] = []

    await new Promise(resolve => setTimeout(resolve, 2000))

    allProducts.forEach(product => {
      let confidence = 0
      let matchType: SearchResult["matchType"] = "visual"

      if (product.category.toLowerCase().includes("eletronicos")) {
        confidence = Math.random() * 0.3 + 0.7
        matchType = "visual"
      } else if (product.category.toLowerCase().includes("acessorios")) {
        confidence = Math.random() * 0.4 + 0.5
        matchType = "category"
      } else {
        confidence = Math.random() * 0.3 + 0.3
        matchType = "text"
      }

      if (confidence > 0.4) {
        searchResults.push({
          product,
          confidence,
          matchType
        })
      }
    })

    return searchResults.sort((a, b) => b.confidence - a.confidence).slice(0, 6)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setScanProgress(0)

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        const searchResults = await simulateVisualSearch(imageData)
        
        clearInterval(progressInterval)
        setScanProgress(100)
        
        setTimeout(() => {
          setResults(searchResults)
          setIsScanning(false)
          setScanProgress(0)
        }, 500)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      clearInterval(progressInterval)
      setIsScanning(false)
      setScanProgress(0)
    }
  }

  const performTextSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))

    const allProducts = getProducts()
    const searchResults: SearchResult[] = []

    allProducts.forEach(product => {
      let confidence = 0
      const query = searchQuery.toLowerCase()

      if (product.name.toLowerCase().includes(query)) {
        confidence = 0.9
      } else if (product.category.toLowerCase().includes(query)) {
        confidence = 0.7
      } else if (product.tags?.some(tag => tag.toLowerCase().includes(query))) {
        confidence = 0.6
      } else if (product.description.toLowerCase().includes(query)) {
        confidence = 0.5
      }

      if (confidence > 0.3) {
        searchResults.push({
          product,
          confidence,
          matchType: "text"
        })
      }
    })

    setResults(searchResults.sort((a, b) => b.confidence - a.confidence).slice(0, 8))
    setIsSearching(false)
  }, [searchQuery])

  const getMatchTypeColor = (matchType: SearchResult["matchType"]) => {
    switch (matchType) {
      case "visual": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "text": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "category": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    }
  }

  const getMatchTypeIcon = (matchType: SearchResult["matchType"]) => {
    switch (matchType) {
      case "visual": return <Camera className="h-3 w-3" />
      case "text": return <Search className="h-3 w-3" />
      case "category": return <Sparkles className="h-3 w-3" />
    }
  }

  const handleProductClick = (product: ProductUnion) => {
    if (onProductSelect) {
      onProductSelect(product)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Visual Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performTextSearch()}
              className="pl-10"
              disabled={isScanning}
            />
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            variant="outline"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Analyzing image...</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(results.length > 0 || isSearching) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Search className="h-6 w-6 animate-pulse text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Searching...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleProductClick(result.product)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/30 transition-colors">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {result.product.images?.[0] ? (
                            <img
                              src={result.product.images[0]}
                              alt={result.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1">
                            <Badge variant="secondary" className="text-xs px-1">
                              {Math.round(result.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate mb-1">
                            {result.product.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="secondary"
                              className={cn("text-xs", getMatchTypeColor(result.matchType))}
                            >
                              {getMatchTypeIcon(result.matchType)}
                              <span className="ml-1">{result.matchType}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!isScanning && !isSearching && searchQuery.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Upload an image or search by text</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}