import { NextRequest, NextResponse } from "next/server"
import { getProducts, getCompanyProductsByCompany } from "@/lib/storage"
import { getGrokClient, rateLimiter } from "@/lib/grok-api"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { description, budget, recipientCount, useGrok = false } = body

    if (!description) {
      return NextResponse.json(
        { error: "Descrição é obrigatória" },
        { status: 400 }
      )
    }

    let companyId = body.companyId || "company_1"

    let allProducts: any[] = []
    try {
      const companyProducts = getCompanyProductsByCompany(companyId)
      if (companyProducts && companyProducts.length > 0) {
        allProducts = companyProducts
          .filter((p: any) => p.isActive && p.status === "active")
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            pointsCost: p.pointsCost || 0,
            stockQuantity: p.stockQuantity || 0,
            category: p.category || "",
            image: p.images?.[0] || "",
          }))
      }
    } catch (error) {
      console.error("[AI Recommend Enhanced] Erro ao buscar CompanyProducts:", error)
    }

    if (allProducts.length === 0) {
      try {
        const products = getProducts()
        allProducts = products
          .filter((p) => p.active)
          .map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            pointsCost: p.priceInPoints || 0,
            stockQuantity: p.stock || 0,
            category: p.category || "",
            image: p.image || p.images?.[0] || "",
          }))
      } catch (error) {
        console.error("[AI Recommend Enhanced] Erro ao buscar Products:", error)
      }
    }

    if (allProducts.length === 0) {
      return NextResponse.json(
        { error: "Nenhum produto disponível no catálogo" },
        { status: 400 }
      )
    }

    const inStockProducts = allProducts.filter((p) => (p.stockQuantity || 0) > 0)
    const outOfStockProducts = allProducts.filter((p) => (p.stockQuantity || 0) === 0)

    const inStockList = inStockProducts
      .map(
        (p) =>
          `- ID: ${p.id}, Nome: ${p.name}, Descrição: ${p.description}, Preço: ${p.pointsCost} pontos, Estoque Disponível: ${p.stockQuantity} unidades, Categoria: ${p.category} [EM ESTOQUE]`
      )
      .join("\n")

    const catalogList = outOfStockProducts
      .map(
        (p) =>
          `- ID: ${p.id}, Nome: ${p.name}, Descrição: ${p.description}, Preço: ${p.pointsCost} pontos, Estoque Disponível: 0 unidades, Categoria: ${p.category} [CATÁLOGO - NECESSITA COMPRA]`
      )
      .join("\n")

    const budgetConstraint = budget
      ? `\nOrçamento máximo: ${budget} pontos por pessoa.`
      : ""
    const recipientConstraint = recipientCount
      ? `\nNúmero de destinatários: ${recipientCount}.`
      : ""

    const aiPrompt = `Você é um consultor criativo de Customer Success e especialista em Branding Corporativo da Yoobe. 
Sua missão é ajudar gestores a criarem campanhas de marketing interno e onboarding que gerem o "fator UAU".

CATÁLOGO COMPLETO DE PRODUTOS DISPONÍVEIS:

PRODUTOS EM ESTOQUE (Pronta entrega):
${inStockList || "Nenhum produto em estoque no momento."}

PRODUTOS DO CATÁLOGO GERAL (Necessitam pedido de compra):
${catalogList || "Nenhum produto adicional no catálogo."}

SOLICITAÇÃO DO GESTOR: "${description}"
${budgetConstraint}${recipientConstraint}

SUAS REGRAS DE OURO:
1. CRIATIVIDADE: Não recomende apenas produtos soltos. Pense em CONJUNTOS TEMÁTICOS (Kits). 
2. NARRATIVA (RAZÃO): Em cada produto, escreva uma justificativa envolvente e persuasiva.
3. PRIORIDADE E LOGÍSTICA: Priorize produtos [EM ESTOQUE] para rapidez.
4. RIGOR TÉCNICO: Use APENAS os IDs fornecidos, não ultrapasse o estoque, respeite o orçamento.
5. FORMATO DE RESPOSTA: Retorne APENAS o JSON array.

Retorne APENAS um JSON array válido:
[
  {
    "productId": "id_do_produto",
    "quantity": 1,
    "reason": "Sua justificativa criativa e estratégica aqui."
  }
]`

    let recommendations: Array<{
      productId: string
      quantity: number
      reason?: string
    }> = []

    if (useGrok) {
      try {
        await rateLimiter.waitForSlot()
        const grokClient = getGrokClient()
        const response = await grokClient.generateJSON<Array<{
          productId: string
          quantity: number
          reason?: string
        }>>(aiPrompt, { temperature: 0.8, maxTokens: 2000 })
        recommendations = response
      } catch (error) {
        console.warn("[AI Recommend Enhanced] Grok call failed, using fallback:", error)
        recommendations = getFallbackRecommendations(inStockProducts, outOfStockProducts, budget)
      }
    } else {
      recommendations = await callGeminiRecommendation(aiPrompt)
    }

    if (!Array.isArray(recommendations)) {
      throw new Error("Resposta da IA não é um array")
    }

    const validRecommendations = recommendations
      .filter((rec) => {
        if (!rec.productId) return false
        
        const product = allProducts.find((p) => p.id === rec.productId)
        if (!product) {
          console.warn(`[AI Recommend Enhanced] Produto ${rec.productId} não encontrado`)
          return false
        }
        
        return true
      })
      .map((rec) => {
        const product = allProducts.find((p) => p.id === rec.productId)!
        const requestedQuantity = rec.quantity || 1
        const hasStock = (product.stockQuantity || 0) > 0
        const isStockRecommendation = hasStock && requestedQuantity <= product.stockQuantity
        
        const finalQuantity = isStockRecommendation 
          ? Math.min(requestedQuantity, product.stockQuantity)
          : requestedQuantity
        
        return {
          productId: rec.productId,
          quantity: Math.max(1, finalQuantity),
          reason: rec.reason || "",
          isStockRecommendation,
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            pointsCost: product.pointsCost,
            stockQuantity: product.stockQuantity,
            category: product.category,
            image: product.image,
          },
        }
      })

    if (validRecommendations.length === 0) {
      return NextResponse.json(
        {
          error: "Não foi possível gerar recomendações válidas",
        },
        { status: 400 }
      )
    }

    const stockCount = validRecommendations.filter((r) => r.isStockRecommendation).length
    const catalogCount = validRecommendations.filter((r) => !r.isStockRecommendation).length

    return NextResponse.json({
      success: true,
      recommendations: validRecommendations,
      summary: `Recomendados ${validRecommendations.length} produto(s): ${stockCount} em estoque, ${catalogCount} do catálogo`,
      provider: useGrok ? 'grok' : 'gemini'
    })
  } catch (error: any) {
    console.error("[AI Gifts Recommend Enhanced] Erro:", error.message)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

async function callGeminiRecommendation(prompt: string): Promise<any[]> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada")
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

  let cleaned = text.trim()
  cleaned = cleaned.replace(/```json\s*/g, "").replace(/```\s*/g, "")
  cleaned = cleaned.trim()
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }
  
  const recommendations = JSON.parse(cleaned)
  
  if (!Array.isArray(recommendations)) {
    throw new Error("Resposta da IA não é um array")
  }

  return recommendations
}

function getFallbackRecommendations(
  inStockProducts: any[],
  outOfStockProducts: any[],
  budget?: number
): Array<{ productId: string; quantity: number; reason: string }> {
  const recommendations: Array<{ productId: string; quantity: number; reason: string }> = []
  
  if (inStockProducts.length > 0) {
    const firstProduct = inStockProducts[0]
    recommendations.push({
      productId: firstProduct.id,
      quantity: 1,
      reason: "Produto essencial para engajamento da equipe, disponível para entrega imediata."
    })
  }
  
  if (outOfStockProducts.length > 0 && (!budget || budget >= 1000)) {
    const firstCatalogProduct = outOfStockProducts[0]
    recommendations.push({
      productId: firstCatalogProduct.id,
      quantity: 1,
      reason: "Item premium que demonstra investimento no desenvolvimento profissional da equipe."
    })
  }

  return recommendations
}