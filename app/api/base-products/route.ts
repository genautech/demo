/**
 * ===========================================
 * API DE BASE PRODUCTS (CATÁLOGO GLOBAL)
 * ===========================================
 *
 * Endpoint para gerenciamento do catálogo base (fonte da verdade).
 * Apenas Admin Geral pode criar/editar.
 */

import { NextResponse } from "next/server"
import {
  getBaseProducts,
  getBaseProductById,
  createBaseProduct,
  updateBaseProduct,
} from "@/lib/storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  try {
    if (id) {
      const product = getBaseProductById(id)
      if (!product) {
        return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
      }
      return NextResponse.json({ product })
    }

    let products = getBaseProducts()

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({ products })
  } catch (error: any) {
    console.error("[API Base Products] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Nome e categoria são obrigatórios" },
        { status: 400 }
      )
    }

    const product = createBaseProduct({
      ...body,
      createdBy: body.createdBy,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    console.error("[API Base Products] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    const product = getBaseProductById(id)
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    const updated = updateBaseProduct(id, updates)
    return NextResponse.json({ product: updated })
  } catch (error: any) {
    console.error("[API Base Products] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
  }

  try {
    const { deleteBaseProduct } = await import("@/lib/storage")
    deleteBaseProduct(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API Base Products] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
