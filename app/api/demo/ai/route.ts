import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, prompt, profile } = body
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 })
    }

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

      const response = await callGemini(aiPrompt, apiKey)
      return NextResponse.json({ profile: JSON.parse(response) })
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

      const response = await callGemini(aiPrompt, apiKey)
      return NextResponse.json({ products: JSON.parse(response) })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function callGemini(prompt: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  
  // Clean JSON response (remove markdown code blocks if any)
  return text.replace(/```json|```/g, "").trim()
}
