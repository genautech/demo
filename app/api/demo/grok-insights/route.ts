import { NextRequest, NextResponse } from "next/server"
import { getGrokClient, rateLimiter, callGrokJSONWithFallback } from "@/lib/grok-api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyId, campaignType, provider = "grok" } = body

    let insights: any[]

    if (provider === "grok") {
      try {
        await rateLimiter.waitForSlot()
        const grokClient = getGrokClient()
        
        const prompt = `Como especialista em análise de dados corporativos da Yoobe, gere insights para uma campanha de ${campaignType}.

Baseado em dados típicos de gamificação corporativa, retorne um array JSON com 3 insights de performance, cada um com:
{
  "title": "Título do indicador",
  "value": "valor atual (ex: 78%, 4.2/5, 65%)",
  "trend": "up|down|stable",
  "description": "breve descrição do insight"
}

Use métricas realistas para uma empresa de médio porte (50-200 funcionários). Considere:
- Taxa de engajamento atual
- Participação em campanhas anteriores
- Satisfação da equipe
- Nível de gamificação ativo
- Progressão em metas individuais`

        insights = await grokClient.generateJSON(prompt, {
          temperature: 0.7,
          maxTokens: 800
        })
      } catch (error) {
        console.warn("Grok insights failed, using fallback:", error)
        insights = getFallbackInsights(campaignType)
      }
    } else {
      insights = await callGeminiInsights(campaignType)
    }

    return NextResponse.json({
      insights,
      provider,
      campaignType,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error("Grok Insights API Error:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

async function callGeminiInsights(campaignType: string): Promise<any[]> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return getFallbackInsights(campaignType)
  }

  try {
    const prompt = `Gere 3 insights de performance para campanha de ${campaignType} em formato JSON array.
Cada objeto deve ter: title, value, trend (up/down/stable), description.
Use métricas realistas para empresa de médio porte.`

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
      return getFallbackInsights(campaignType)
    }
  } catch (error) {
    console.warn("Gemini insights failed, using fallback:", error)
    return getFallbackInsights(campaignType)
  }
}

function getFallbackInsights(campaignType: string): any[] {
  const baseInsights = [
    {
      title: "Taxa de Engajamento",
      value: "78%",
      trend: "up",
      description: "Aumento de 12% neste mês"
    },
    {
      title: "Participação em Campanhas",
      value: "65%",
      trend: "stable", 
      description: "Consistente com média trimestral"
    },
    {
      title: "Satisfação da Equipe",
      value: "4.2/5",
      trend: "up",
      description: "Melhora de 0.3 pontos"
    }
  ]

  const campaignSpecificInsights: Record<string, any[]> = {
    onboarding: [
      {
        title: "Conclusão de Onboarding",
        value: "92%",
        trend: "up",
        description: "Tempo médio de conclusão: 5 dias"
      },
      {
        title: "Adoção de Ferramentas",
        value: "85%",
        trend: "up",
        description: "Uso ativo das plataformas principais"
      },
      {
        title: "Integração Social",
        value: "71%",
        trend: "stable",
        description: "Participação em atividades de team building"
      }
    ],
    recognition: [
      {
        title: "Reconhecimentos Recebidos",
        value: "4.8/mês",
        trend: "up",
        description: "Média por funcionário"
      },
      {
        title: "Programas de Reconhecimento",
        value: "6",
        trend: "up",
        description: "Programas ativos este trimestre"
      },
      {
        title: "NPS de Reconhecimento",
        value: "8.1/10",
        trend: "stable",
        description: "Satisfação com programas atuais"
      }
    ],
    wellness: [
      {
        title: "Programas de Bem-estar",
        value: "8",
        trend: "up",
        description: "Iniciativas ativas este mês"
      },
      {
        title: "Participação em Wellness",
        value: "73%",
        trend: "up",
        description: "Engajamento em programas de saúde"
      },
      {
        title: "Índice de Bem-estar",
        value: "7.6/10",
        trend: "stable",
        description: "Avaliação geral do time"
      }
    ],
    engagement: [
      {
        title: "Desafios Concluídos",
        value: "156",
        trend: "up",
        description: "Este trimestre"
      },
      {
        title: "Taxa de Participação",
        value: "84%",
        trend: "up",
        description: "Em iniciativas de engajamento"
      },
      {
        title: "Nível de Gamificação",
        value: "3.2",
        trend: "stable",
        description: "Nível médio dos funcionários"
      }
    ]
  }

  return campaignSpecificInsights[campaignType] || baseInsights
}