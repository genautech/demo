/**
 * ===========================================
 * API DE PRODUTOS
 * ===========================================
 *
 * Endpoint para gerenciamento de produtos.
 *
 * TODO: Integrar com a API do Spree Commerce
 * Atualmente usando dados locais (localStorage) como mock.
 *
 * Endpoints do Spree para referência:
 * - GET /api/v2/storefront/products - Lista produtos
 * - GET /api/v2/storefront/products/:id - Detalhes do produto
 * - PATCH /api/v2/platform/products/:id - Atualiza produto
 */

import { NextResponse } from "next/server"
import { getProducts } from "@/lib/storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Parâmetros de paginação
  const page = Number.parseInt(searchParams.get("page") || "1")
  const perPage = Number.parseInt(searchParams.get("perPage") || "20")

  // Parâmetros de filtro
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const tag = searchParams.get("tag") || ""

  try {
    // TODO: Substituir por chamada à API do Spree
    // const spreeProducts = await getProducts({ page, perPage, ... })

    let products = getProducts()

    // Aplicar filtros
    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())),
      )
    }
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category)
    }
    if (tag) {
      products = products.filter((p) => p.tags.includes(tag.toLowerCase()))
    }

    // Paginação
    const total = products.length
    const totalPages = Math.ceil(total / perPage)
    const startIndex = (page - 1) * perPage
    const paginatedProducts = products.slice(startIndex, startIndex + perPage)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
      meta: {
        lastUpdate: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("[API Products] Erro:", error.message)
    return NextResponse.json({ error: error.message, products: [] }, { status: 500 })
  }
}
