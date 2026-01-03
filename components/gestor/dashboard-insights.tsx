"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Brain,
  Activity,
  BarChart3,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Insight {
  title: string
  value: string
  trend: "up" | "down" | "stable"
  description: string
  icon: React.ReactNode
  score?: number
}

interface DashboardInsightsProps {
  companyId?: string
  timeRange?: "week" | "month" | "quarter" | "year"
  className?: string
}

export function DashboardInsights({
  companyId = "company_1",
  timeRange = "month",
  className
}: DashboardInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [predictions, setPredictions] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<"grok" | "gemini">("grok")

  const [localTimeRange, setLocalTimeRange] = useState(timeRange)

  const timeRanges = [
    { value: "week", label: "Semana" },
    { value: "month", label: "Mês" },
    { value: "quarter", label: "Trimestre" },
    { value: "year", label: "Ano" }
  ]

  const generateInsights = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/demo/grok-dashboard-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          timeRange: localTimeRange,
          provider
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setInsights(data.insights || [])
          setPredictions(data.predictions || [])
          setRecommendations(data.recommendations || [])
        }
      }
    } catch (error) {
      console.error("Failed to generate insights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateInsights()
  }, [provider, localTimeRange, companyId])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
      default:
        return <Activity className="w-4 h-4 text-blue-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Insights com {provider === "grok" ? "Grok" : "Gemini"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={localTimeRange}
                onChange={(e) => setLocalTimeRange(e.target.value as any)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
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
              <Button 
                size="sm" 
                variant="outline"
                onClick={generateInsights}
                disabled={isLoading}
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{insight.title}</p>
                      {getTrendIcon(insight.trend)}
                    </div>
                    <p className="text-xl font-bold mb-1">{insight.value}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                    {insight.score && (
                      <div className="mt-2">
                        <Progress value={insight.score} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Previsões de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.map((prediction, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                  <p className="text-sm">{prediction}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recomendações Estratégicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-1 rounded-full bg-primary/10">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">Recomendação {index + 1}</p>
                    <p className="text-sm text-muted-foreground">{recommendation}</p>
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