import { NextRequest, NextResponse } from "next/server"
import { getProducts, getCompanyProductsByCompany } from "@/lib/storage"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { description, budget, recipientCount } = body
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY não configurada" },
        { status: 500 }
      )
    }

    if (!description) {
      return NextResponse.json(
        { error: "Descrição é obrigatória" },
        { status: 400 }
      )
    }

    // Get company ID from request body or use default
    let companyId = body.companyId || "company_1"

    // Get all active products (prefer CompanyProducts V3, fallback to Products V2)
    // Include ALL active products regardless of stock level for catalog recommendations
    let allProducts: any[] = []
    try {
      const companyProducts = getCompanyProductsByCompany(companyId)
      if (companyProducts && companyProducts.length > 0) {
        // Include all active products, not just those with stock
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
      console.error("[AI Recommend] Erro ao buscar CompanyProducts:", error)
    }

    // Fallback to base products (V2) if no company products
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
        console.error("[AI Recommend] Erro ao buscar Products:", error)
      }
    }

    if (allProducts.length === 0) {
      return NextResponse.json(
        { error: "Nenhum produto disponível no catálogo" },
        { status: 400 }
      )
    }

    // Separate products by stock availability
    const inStockProducts = allProducts.filter((p) => (p.stockQuantity || 0) > 0)
    const outOfStockProducts = allProducts.filter((p) => (p.stockQuantity || 0) === 0)

    // Build the AI prompt with accurate stock information
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
   Ex: Se for Onboarding, recomende uma camiseta, uma mochila e um fone. 
   Ex: Se for Bem-estar, recomende uma garrafa térmica e um smartwatch.
2. NARRATIVA (RAZÃO): Em cada produto, escreva uma justificativa envolvente e persuasiva de por que esse item faz parte da estratégia. 
   Use termos como "fortalecer a cultura", "engajamento do time", "sentimento de pertencimento".
3. PRIORIDADE E LOGÍSTICA: Priorize produtos [EM ESTOQUE] para rapidez. Se escolher um do [CATÁLOGO], mencione na razão que é um item especial que vale o tempo de espera.
4. RIGOR TÉCNICO: 
   - Use APENAS os IDs de produtos fornecidos na lista acima.
   - Não ultrapasse o estoque disponível para itens [EM ESTOQUE].
   - Respeite o orçamento de ${budget || 'livre'} pontos por pessoa.
5. FORMATO DE RESPOSTA: Retorne APENAS o JSON array.

EXEMPLO DE RAZÃO CRIATIVA:
"Este fone premium não é apenas para música, é um sinal de que respeitamos o foco e a produtividade do novo colaborador no regime home office."

Retorne APENAS um JSON array válido:
[
  {
    "productId": "id_do_produto",
    "quantity": 1,
    "reason": "Sua justificativa criativa e estratégica aqui."
  }
]

IMPORTANTE: Seja o mais persuasivo e estratégico possível. Você quer que o gestor sinta que você entende de marketing e pessoas.`

    // Call Gemini API
    const response = await callGemini(aiPrompt, apiKey)

    // Parse and validate response
    let recommendations: Array<{
      productId: string
      quantity: number
      reason?: string
    }> = []

    try {
      // Clean response: remove markdown code blocks, JSON markers, etc.
      let cleaned = response.trim()
      // Remove markdown code blocks
      cleaned = cleaned.replace(/```json\s*/g, "").replace(/```\s*/g, "")
      // Remove any leading/trailing whitespace or newlines
      cleaned = cleaned.trim()
      // Try to extract JSON if wrapped in other text
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        cleaned = jsonMatch[0]
      }
      
      recommendations = JSON.parse(cleaned)
      
      // Ensure it's an array
      if (!Array.isArray(recommendations)) {
        throw new Error("Resposta da IA não é um array")
      }
    } catch (parseError) {
      console.error("[AI Recommend] Erro ao parsear resposta:", parseError)
      console.error("[AI Recommend] Resposta recebida:", response.substring(0, 500))
      return NextResponse.json(
        { error: "Erro ao processar recomendação da IA. A resposta não está no formato esperado." },
        { status: 500 }
      )
    }

    // Validate recommendations against all products and enrich with product data
    const validRecommendations = recommendations
      .filter((rec) => {
        if (!rec.productId) return false
        
        const product = allProducts.find((p) => p.id === rec.productId)
        if (!product) {
          console.warn(`[AI Recommend] Produto ${rec.productId} não encontrado no catálogo`)
          return false
        }
        
        return true
      })
      .map((rec) => {
        const product = allProducts.find((p) => p.id === rec.productId)!
        const requestedQuantity = rec.quantity || 1
        const hasStock = (product.stockQuantity || 0) > 0
        const isStockRecommendation = hasStock && requestedQuantity <= product.stockQuantity
        
        // For stock recommendations, ensure quantity doesn't exceed stock
        // For catalog recommendations, allow any quantity
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
          error:
            "Não foi possível gerar recomendações válidas com base na sua solicitação",
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
    })
  } catch (error: any) {
    console.error("[API Gifts Recommend] Erro:", error.message)
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

async function callGemini(prompt: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${errorData}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

  if (!text) {
    throw new Error("Resposta vazia da API Gemini")
  }

  return text
}
