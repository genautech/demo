import { NextRequest, NextResponse } from "next/server"
import { getGrokClient, rateLimiter, callGrokWithFallback } from "@/lib/grok-api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, provider = "grok" } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from user" },
        { status: 400 }
      )
    }

    let response: string

    if (provider === "grok") {
      try {
        await rateLimiter.waitForSlot()
        const grokClient = getGrokClient()
        
        const systemPrompt = `Você é um assistente especialista da plataforma Yoobe, focado em gamificação corporativa e engajamento de equipe. 
Você ajuda gestores e funcionários com:
- Análise de performance e engajamento
- Recomendações de produtos e campanhas
- Insights sobre cultura organizacional
- Sugestões de melhorias em processos
- Geração de conteúdo para comunicação interna

Seja sempre prestativo, profissional e específico nas suas respostas. Use dados quando disponíveis e forneça ações práticas.`

        const grokMessages = [
          { role: "system" as const, content: systemPrompt },
          ...messages.map((msg: any) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content
          }))
        ]

        const grokResponse = await grokClient.chat(grokMessages, {
          temperature: 0.7,
          maxTokens: 1000
        })

        response = grokResponse.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação."
      } catch (error) {
        console.warn("Grok API failed in chat, using fallback:", error)
        response = getFallbackResponse(lastMessage.content)
      }
    } else {
      response = await callGeminiChat(messages)
    }

    return NextResponse.json({
      content: response,
      provider,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error("Grok Chat API Error:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

async function callGeminiChat(messages: any[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return getFallbackResponse(messages[messages.length - 1]?.content || "")
  }

  try {
    const systemPrompt = `Você é um assistente especialista da plataforma Yoobe, focado em gamificação corporativa e engajamento de equipe.
Seja sempre prestativo, profissional e específico nas suas respostas.`

    const allMessages = [
      { role: "user", content: systemPrompt },
      ...messages
    ]

    const prompt = allMessages.map(msg => `${msg.role}: ${msg.content}`).join("\n")

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
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(messages[messages.length - 1]?.content || "")
  } catch (error) {
    console.warn("Gemini API failed in chat, using fallback:", error)
    return getFallbackResponse(messages[messages.length - 1]?.content || "")
  }
}

function getFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase()
  
  if (input.includes("analisar") || input.includes("performance")) {
    return `Para analisar a performance da equipe, recomendo:

📊 **Métricas principais:**
- Taxa de engajamento atual
- Progresso em metas individuais e de equipe
- Participação em desafios e campanhas
- Nível de satisfação da equipe

💡 **Sugestões práticas:**
- Defina KPIs claros para gamificação
- Crie desafios alinhados aos objetivos da empresa
- Reconheça publicamente as conquistas
- Use dados para personalizar recompensas

Posso ajudar a gerar um relatório detalhado se você fornecer os dados específicos da sua equipe.`
  }
  
  if (input.includes("produto") || input.includes("recomenda")) {
    return `Para recomendações de produtos, considero:

🎯 **Fatores importantes:**
- Perfil da equipe (cargo, senioridade)
- Objetivo da campanha
- Orçamento disponível
- Logística de entrega

📦 **Categorias populares:**
- Tech Essentials (fones, mousepads, carregadores)
- Comfort & Wellness (garrafas, almofadas, mantas)
- Brand Apparel (camisetas, mochillas, bonés)
- Desk Accessories ( agendas, canecas, suportes)

Precisa de recomendações específicas para algum perfil ou campanha?`
  }
  
  if (input.includes("engajamento") || input.includes("insight")) {
    return `**Insights de Engajamento:**

🔥 **O que funciona:**
- Reconhecimento imediato
- Progressão visível
- Desafios colaborativos
- Recompensas personalizadas

📈 **Para aumentar engajamento:**
- Lance micro-desafios semanais
- Crie narrativas para as campanhas
- Envolva líderes nas iniciativas
- Compartilhe histórias de sucesso

Posso analisar seus dados específicos e gerar um plano personalizado de engajamento.`
  }

  return `Sou um assistente especializado da Yoobe! 

Posso ajudar com:
- 📊 Análise de performance da equipe
- 🎯 Recomendações de produtos para campanhas
- 💡 Insights de engajamento e cultura
- 📈 Sugestões de melhorias
- 🎲 Conteúdo para comunicação interna

Como posso ajudar você hoje?`
}