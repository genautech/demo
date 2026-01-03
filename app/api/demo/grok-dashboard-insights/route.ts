import { NextRequest, NextResponse } from "next/server"
import { getGrokClient, rateLimiter } from "@/lib/grok-api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyId, timeRange = "month", provider = "grok" } = body

    let insights: any[] = []
    let predictions: string[] = []
    let recommendations: string[] = []

    if (provider === "grok") {
      try {
        await rateLimiter.waitForSlot()
        const grokClient = getGrokClient()
        
        const insightsPrompt = `Como especialista em análise de dados corporativos da Yoobe, gere insights detalhados para o período "${timeRange}" de uma empresa de médio porte (50-200 funcionários).

Retorne um array JSON com 4 insights de performance no seguinte formato:
[
  {
    "title": "Título do indicador",
    "value": "valor atual (ex: 78%, 4.2/5, 65%)",
    "trend": "up|down|stable",
    "description": "breve descrição do insight",
    "score": 85
  }
]

Inclua métricas como:
- Taxa de engajamento geral
- Participação em campanhas
- Nível médio de gamificação
- Satisfação da equipe
- Conclusão de metas individuais
- Adoção de novas iniciativas`

        const predictionsPrompt = `Baseado em dados de gamificação corporativa, gere 3 previsões de performance para o próximo ${timeRange}.

Retorne um array JSON de strings com previsões realistas e acionáveis:
["Previsão 1...", "Previsão 2...", "Previsão 3..."]`

        const recommendationsPrompt = `Como consultor estratégico da Yoobe, gere 4 recomendações acionáveis para melhorar a performance de gamificação no próximo ${timeRange}.

Retorne um array JSON de strings com recomendações específicas:
["Recomendação 1...", "Recomendação 2...", "Recomendação 3...", "Recomendação 4..."]`

        const [insightsData, predictionsData, recommendationsData] = await Promise.allSettled([
          grokClient.generateJSON(insightsPrompt, { temperature: 0.7, maxTokens: 800 }),
          grokClient.generateJSON(predictionsPrompt, { temperature: 0.8, maxTokens: 400 }),
          grokClient.generateJSON(recommendationsPrompt, { temperature: 0.7, maxTokens: 600 })
        ])

        if (insightsData.status === "fulfilled") {
          insights = insightsData.value
        }

        if (predictionsData.status === "fulfilled") {
          predictions = predictionsData.value
        }

        if (recommendationsData.status === "fulfilled") {
          recommendations = recommendationsData.value
        }
      } catch (error) {
        console.warn("Grok dashboard insights failed, using fallback:", error)
        insights = getFallbackInsights(timeRange)
        predictions = getFallbackPredictions(timeRange)
        recommendations = getFallbackRecommendations(timeRange)
      }
    } else {
      const result = await callGeminiDashboard(timeRange)
      insights = result.insights
      predictions = result.predictions
      recommendations = result.recommendations
    }

    const enrichedInsights = insights.map(insight => ({
      ...insight,
      icon: getIconForInsight(insight.title)
    }))

    return NextResponse.json({
      success: true,
      insights: enrichedInsights,
      predictions,
      recommendations,
      provider,
      timeRange,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error("Grok Dashboard Insights API Error:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

async function callGeminiDashboard(timeRange: string): Promise<{
  insights: any[]
  predictions: string[]
  recommendations: string[]
}> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return {
      insights: getFallbackInsights(timeRange),
      predictions: getFallbackPredictions(timeRange),
      recommendations: getFallbackRecommendations(timeRange)
    }
  }

  try {
    const insightsPrompt = `Gere 4 insights de performance para período ${timeRange} em formato JSON array com: title, value, trend (up/down/stable), description, score (0-100).`
    const predictionsPrompt = `Gere 3 previsões de performance para próximo ${timeRange} em formato JSON array de strings.`
    const recommendationsPrompt = `Gere 4 recomendações estratégicas para ${timeRange} em formato JSON array de strings.`

    const [insightsData, predictionsData, recommendationsData] = await Promise.allSettled([
      callGeminiJSON(insightsPrompt),
      callGeminiJSON(predictionsPrompt),
      callGeminiJSON(recommendationsPrompt)
    ])

    return {
      insights: insightsData.status === "fulfilled" ? insightsData.value : getFallbackInsights(timeRange),
      predictions: predictionsData.status === "fulfilled" ? predictionsData.value : getFallbackPredictions(timeRange),
      recommendations: recommendationsData.status === "fulfilled" ? recommendationsData.value : getFallbackRecommendations(timeRange)
    }
  } catch (error) {
    console.warn("Gemini dashboard insights failed, using fallback:", error)
    return {
      insights: getFallbackInsights(timeRange),
      predictions: getFallbackPredictions(timeRange),
      recommendations: getFallbackRecommendations(timeRange)
    }
  }
}

async function callGeminiJSON(prompt: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  
  try {
    const cleaned = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleaned)
  } catch (parseError) {
    console.warn("Failed to parse Gemini response:", text)
    return []
  }
}

function getFallbackInsights(timeRange: string): any[] {
  return [
    {
      title: "Taxa de Engajamento",
      value: "78%",
      trend: "up",
      description: "Aumento de 12% neste período",
      score: 85
    },
    {
      title: "Participação em Campanhas",
      value: "65%",
      trend: "stable",
      description: "Consistente com média histórica",
      score: 72
    },
    {
      title: "Nível de Gamificação",
      value: "3.2",
      trend: "up",
      description: "Progressão média dos funcionários",
      score: 68
    },
    {
      title: "Satisfação da Equipe",
      value: "4.2/5",
      trend: "up",
      description: "Melhora de 0.3 pontos",
      score: 84
    }
  ]
}

function getFallbackPredictions(timeRange: string): string[] {
  const predictionsMap: Record<string, string[]> = {
    week: [
      "Aumento de 8% na participação em desafios diários",
      "Pico de engajamento nos dias de quinta-feira",
      "15% mais interações em conteúdos de reconhecimento"
    ],
    month: [
      "Taxa de conclusão de metas deverá atingir 82%",
      "Novos programas de bem-estar terão 30% mais adesão",
      "Engajamento em campanhas colaborativas deve aumentar 25%"
    ],
    quarter: [
      "Crescimento de 18% no nível médio de gamificação",
      "Expansão para 3 novas áreas da empresa",
      "Redução de turnover em equipes engajadas"
    ],
    year: [
      "Maturidade completa em programa de gamificação",
      "ROI de 250% em iniciativas de engajamento",
      "Evolução para cultura de alto performance"
    ]
  }

  return predictionsMap[timeRange] || predictionsMap.month
}

function getFallbackRecommendations(timeRange: string): string[] {
  const recommendationsMap: Record<string, string[]> = {
    week: [
      "Lançar desafios rápidos de 24 horas para impulsionar participação imediata",
      "Criar campanha de reconhecimento entre pares",
      "Ativar notificações personalizadas para aumentar engajamento"
    ],
    month: [
      "Implementar programa de mentorias com sistema de pontos",
      "Expandir gamificação para processos de feedback",
      "Criar desafios interdepartamentais para quebrar silos"
    ],
    quarter: [
      "Desenvolver trilha de aprendizagem gamificada",
      "Implementar sistema de badges por competências",
      "Criar torneios trimestrais com prêmios exclusivos"
    ],
    year: [
      "Estruturar programa completo de cultura de performance",
      "Integrar gamificação com sistema de gestão de talentos",
      "Expandir para ecossistema completo de bem-estar e desenvolvimento"
    ]
  }

  return recommendationsMap[timeRange] || recommendationsMap.month
}

function getIconForInsight(title: string): string {
  if (title.includes("Engajamento")) return "TrendingUp"
  if (title.includes("Participação")) return "Users"
  if (title.includes("Gamificação")) return "Target"
  if (title.includes("Satisfação")) return "Award"
  return "Activity"
}