import { NextRequest, NextResponse } from "next/server"
import { getGrokClient, callGrokWithFallback, callGrokJSONWithFallback, rateLimiter } from "@/lib/grok-api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, prompt, profile, useGrok = false } = body

    if (action === "generate-profile") {
      const aiPrompt = `
        Você é um especialista em onboarding de gamificação corporativa.
        Com base no seguinte pedido do cliente: "${prompt}"
        
        Gere um perfil de empresa estruturado em JSON com os seguintes campos:
        {
          "companyName": "Nome Criativo",
          "industry": "Setor",
          "teamSize": "Tamanho do time",
          "primaryGoal": "Objetivo principal",
          "colors": {
            "primary": "Hex Color",
            "secondary": "Hex Color"
          }
        }
        
        Seja criativo e use cores que combinem com o setor. Retorne APENAS o JSON.
      `

      let response: any

      if (useGrok) {
        await rateLimiter.waitForSlot()
        response = await callGrokJSONWithFallback(aiPrompt, {
          companyName: "Empresa Inovadora",
          industry: "Tecnologia",
          teamSize: "50-100",
          primaryGoal: "Engajamento de equipe",
          colors: {
            primary: "#3B82F6",
            secondary: "#10B981"
          }
        }, { temperature: 0.8 })
      } else {
        response = await callGeminiWithFallback(aiPrompt, {
          companyName: "Empresa Inovadora",
          industry: "Tecnologia", 
          teamSize: "50-100",
          primaryGoal: "Engajamento de equipe",
          colors: {
            primary: "#3B82F6",
            secondary: "#10B981"
          }
        })
      }

      return NextResponse.json({ profile: response, provider: useGrok ? 'grok' : 'gemini' })
    }

    if (action === "generate-products") {
      const customPrompt = body.prompt || "Gere produtos de swag personalizados"
      const aiPrompt = `
        Você é um especialista em criar swags corporativos personalizados.
        
        Perfil da empresa: ${JSON.stringify(profile)}
        Solicitação específica: "${customPrompt}"
        
        Gere 3-5 produtos de swag (brindes) que sejam perfeitos para essa empresa e seus funcionários, considerando a solicitação acima.
        Retorne um array JSON de objetos com:
        {
          "name": "Nome do Produto",
          "description": "Descrição envolvente",
          "price": 50.00,
          "priceInPoints": 500,
          "category": "Vestuário|Acessórios|Kits|Eletrônicos|Bem-estar",
          "image": "/placeholder.svg",
          "stock": 100
        }
        
        Use nomes criativos relacionados ao setor da empresa e à solicitação. Seja específico e criativo.
        Retorne APENAS o JSON array, sem markdown.
      `

      let response: any

      if (useGrok) {
        await rateLimiter.waitForSlot()
        response = await callGrokJSONWithFallback(aiPrompt, [
          {
            name: "Camiseta Tech Premium",
            description: "Camiseta de algodão orgânico com design moderno e logo da empresa",
            price: 89.90,
            priceInPoints: 899,
            category: "Vestuário",
            image: "/placeholder.svg",
            stock: 50
          },
          {
            name: "Mochila Smart Pro",
            description: "Mochila com compartimento para laptop e carregador portátil",
            price: 199.90,
            priceInPoints: 1999,
            category: "Acessórios",
            image: "/placeholder.svg", 
            stock: 25
          },
          {
            name: "Fone Bluetooth Corporativo",
            description: "Fone de ouvido sem fio com cancelamento de ruído",
            price: 149.90,
            priceInPoints: 1499,
            category: "Eletrônicos",
            image: "/placeholder.svg",
            stock: 30
          }
        ], { temperature: 0.9 })
      } else {
        response = await callGeminiWithFallback(aiPrompt, [
          {
            name: "Camiseta Tech Premium",
            description: "Camiseta de algodão orgânico com design moderno",
            price: 89.90,
            priceInPoints: 899,
            category: "Vestuário",
            image: "/placeholder.svg",
            stock: 50
          },
          {
            name: "Mochila Smart Pro", 
            description: "Mochila com compartimento para laptop",
            price: 199.90,
            priceInPoints: 1999,
            category: "Acessórios",
            image: "/placeholder.svg",
            stock: 25
          }
        ])
      }

      return NextResponse.json({ products: response, provider: useGrok ? 'grok' : 'gemini' })
    }

    if (action === "analyze-performance") {
      const { data } = body
      
      if (!data) {
        return NextResponse.json({ error: "Performance data is required" }, { status: 400 })
      }

      const aiPrompt = `
        Como especialista em análise de dados corporativos, analise estes dados de performance da equipe:
        ${JSON.stringify(data, null, 2)}
        
        Forneça insights em formato JSON com:
        {
          "summary": "Resumo dos principais destaques",
          "trends": ["tendência 1", "tendência 2"],
          "recommendations": ["recomendação 1", "recomendação 2"],
          "achievements": ["conquista 1", "conquista 2"],
          "areasForImprovement": ["área 1", "área 2"]
        }
      `

      let insights: any

      if (useGrok) {
        await rateLimiter.waitForSlot()
        insights = await callGrokJSONWithFallback(aiPrompt, {
          summary: "Performance da equipe está estável com crescimento moderado",
          trends: ["Engajamento aumentou 15%", "Participação em eventos estável"],
          recommendations: ["Focar em programas de reconhecimento", "Incentivar colaboração interequipe"],
          achievements: ["Meta trimestral atingida", "Alta satisfação da equipe"],
          areasForImprovement: ["Comunicação interdepartamental", "Adoção de novas ferramentas"]
        }, { temperature: 0.6 })
      } else {
        insights = await callGeminiJSONWithFallback(aiPrompt, {
          summary: "Performance da equipe mostrando bons resultados",
          trends: ["Progresso consistente", "Alta participação"],
          recommendations: ["Continuar estratégia atual", "Expandir programas de sucesso"],
          achievements: ["Metas alcançadas", "Feedback positivo"],
          areasForImprovement: ["Inovação", "Desenvolvimento de habilidades"]
        })
      }

      return NextResponse.json({ insights, provider: useGrok ? 'grok' : 'gemini' })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Enhanced AI API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function callGeminiWithFallback(prompt: string, fallback: any): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.warn("GEMINI_API_KEY not configured, using fallback")
    return fallback
  }

  try {
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
    
    const cleaned = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleaned)
  } catch (error) {
    console.warn("Gemini API call failed, using fallback:", error)
    return fallback
  }
}

async function callGeminiJSONWithFallback(prompt: string, fallback: any): Promise<any> {
  return callGeminiWithFallback(prompt, fallback)
}