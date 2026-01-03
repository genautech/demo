"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target, 
  Star, 
  ShoppingCart,
  Brain,
  Lightbulb
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  pointsCost: number
  stockQuantity: number
  category: string
  image: string
}

interface Recommendation {
  productId: string
  quantity: number
  reason: string
  isStockRecommendation: boolean
  product: Product
}

interface SmartRecommendationsProps {
  companyId?: string
  budget?: number
  recipientCount?: number
  onRecommendationSelect?: (recommendation: Recommendation) => void
  className?: string
}

interface InsightData {
  title: string
  value: string
  trend: "up" | "down" | "stable"
  icon: React.ReactNode
  description: string
}

export function SmartRecommendations({
  companyId = "company_1",
  budget,
  recipientCount,
  onRecommendationSelect,
  className
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [insights, setInsights] = useState<InsightData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<"grok" | "gemini">("grok")
  const [campaignType, setCampaignType] = useState<"onboarding" | "recognition" | "wellness" | "engagement">("onboarding")

  const campaignTypes = [
    { value: "onboarding", label: "Onboarding", icon: <Users className="w-4 h-4" /> },
    { value: "recognition", label: "Reconhecimento", icon: <Star className="w-4 h-4" /> },
    { value: "wellness", label: "Bem-estar", icon: <Target className="w-4 h-4" /> },
    { value: "engagement", label: "Engajamento", icon: <TrendingUp className="w-4 h-4" /> }
  ]

  const getInsights = async () => {
    const mockInsights: InsightData[] = [
      {
        title: "Taxa de Engajamento",
        value: "78%",
        trend: "up",
        icon: <TrendingUp className="w-4 h-4 text-green-600" />,
        description: "Aumento de 12% neste mês"
      },
      {
        title: "Participação em Campanhas",
        value: "65%",
        trend: "stable",
        icon: <Users className="w-4 h-4 text-blue-600" />,
        description: "Consistente com média trimestral"
      },
      {
        title: "Satisfação da Equipe",
        value: "4.2/5",
        trend: "up",
        icon: <Star className="w-4 h-4 text-yellow-600" />,
        description: "Melhora de 0.3 pontos"
      }
    ]

    if (provider === "grok") {
      try {
        const response = await fetch("/api/demo/grok-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyId,
            campaignType,
            provider
          })
        })

        if (response.ok) {
          const data = await response.json()
          return data.insights || mockInsights
        }
      } catch (error) {
        console.warn("Failed to get Grok insights, using mock data")
      }
    }

    return mockInsights
  }

  const generateRecommendations = async () => {
    setIsLoading(true)
    
    try {
      const prompt = `Gerar recomendações para campanha de ${campaignType} para ${recipientCount || '1'} destinatário(s)${budget ? ` com orçamento de ${budget} pontos por pessoa` : ''}`

      const response = await fetch("/api/gifts/recommend-enhanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: prompt,
          budget,
          recipientCount,
          companyId,
          useGrok: provider === "grok"
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setRecommendations(data.recommendations)
        }
      }
    } catch (error) {
      console.error("Failed to generate recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getInsights().then(setInsights)
  }, [provider, campaignType, companyId])

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Recomendações Inteligentes
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant={provider === "grok" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setProvider("grok")}
              >
                Grok
              </Badge>
              <Badge 
                variant={provider === "gemini" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setProvider("gemini")}
              >
                Gemini
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Campanha</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {campaignTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={campaignType === type.value ? "default" : "outline"}
                    className="h-auto p-2 flex flex-col items-center gap-1"
                    onClick={() => setCampaignType(type.value as any)}
                  >
                    {type.icon}
                    <span className="text-xs">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Insights da Equipe</h3>
                <p className="text-sm text-muted-foreground">
                  Baseado em dados históricos e padrões de comportamento
                </p>
              </div>
              <Button 
                onClick={generateRecommendations}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  <>Carregando...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Recomendações
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-lg font-bold">{insight.value}</p>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Produtos Recomendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img 
                    src={rec.product.image} 
                    alt={rec.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{rec.product.name}</h4>
                      <Badge variant={rec.isStockRecommendation ? "default" : "secondary"}>
                        {rec.isStockRecommendation ? "Em Estoque" : "Catálogo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{rec.product.pointsCost} pontos</span>
                      <span className="text-sm">Qtd: {rec.quantity}</span>
                      <span className="text-sm">Categoria: {rec.product.category}</span>
                    </div>
                    <div className="mt-2">
                      <Progress 
                        value={(rec.product.stockQuantity / 100) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {rec.product.stockQuantity} unidades disponíveis
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                    <Button 
                      size="sm"
                      onClick={() => onRecommendationSelect?.(rec)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Selecionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}