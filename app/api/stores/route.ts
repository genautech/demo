/**
 * ===========================================
 * API DE STORES (LOJAS)
 * ===========================================
 *
 * Endpoint para gerenciamento de lojas dentro de empresas.
 */

import { NextResponse } from "next/server"
import {
  getStores,
  getStoreById,
  getStoresByCompany,
  createStore,
  updateStore,
} from "@/lib/storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const companyId = searchParams.get("companyId")

  try {
    if (id) {
      const store = getStoreById(id)
      if (!store) {
        return NextResponse.json({ error: "Store não encontrada" }, { status: 404 })
      }
      return NextResponse.json({ store })
    }

    if (companyId) {
      const stores = getStoresByCompany(companyId)
      return NextResponse.json({ stores })
    }

    const stores = getStores()
    return NextResponse.json({ stores })
  } catch (error: any) {
    console.error("[API Stores] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.companyId) {
      return NextResponse.json(
        { error: "Nome e companyId são obrigatórios" },
        { status: 400 }
      )
    }

    const store = createStore(body)
    return NextResponse.json({ store }, { status: 201 })
  } catch (error: any) {
    console.error("[API Stores] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "ID da loja é obrigatório" }, { status: 400 })
    }

    const store = getStoreById(id)
    if (!store) {
      return NextResponse.json({ error: "Store não encontrada" }, { status: 404 })
    }

    const updated = updateStore(id, updates)
    return NextResponse.json({ store: updated })
  } catch (error: any) {
    console.error("[API Stores] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
