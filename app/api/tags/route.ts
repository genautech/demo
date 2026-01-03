/**
 * ===========================================
 * API DE TAGS
 * ===========================================
 *
 * Endpoint para gerenciamento de tags globais e locais.
 */

import { NextResponse } from "next/server"
import {
  getTagsV3,
  getTagByIdV3,
  createTagV3,
  updateTagV3,
  getTagsByScopeV3,
  getProductTags,
  addProductTagV3,
  removeProductTagV3,
  getTagsByProductV3,
  getEmployeeTags,
  addTagToEmployee,
  removeTagFromEmployee,
  getTagsByEmployeeV3,
} from "@/lib/storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const scope = searchParams.get("scope") as "global" | "company" | "store" | null
  const companyId = searchParams.get("companyId")
  const storeId = searchParams.get("storeId")
  const productId = searchParams.get("productId")
  const productType = searchParams.get("productType") as "base" | "company" | null
  const userId = searchParams.get("userId")

  try {
    if (id) {
      const tag = getTagByIdV3(id)
      if (!tag) {
        return NextResponse.json({ error: "Tag não encontrada" }, { status: 404 })
      }
      return NextResponse.json({ tag })
    }

    if (productId && productType) {
      const tags = getTagsByProductV3(productId, productType)
      return NextResponse.json({ tags })
    }

    if (userId) {
      const tags = getTagsByEmployeeV3(userId)
      return NextResponse.json({ tags })
    }

    if (scope) {
      const tags = getTagsByScopeV3(scope, companyId || undefined, storeId || undefined)
      return NextResponse.json({ tags })
    }

    const tags = getTagsV3()
    return NextResponse.json({ tags })
  } catch (error: any) {
    console.error("[API Tags] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === "create") {
      if (!data.name) {
        return NextResponse.json({ error: "Nome da tag é obrigatório" }, { status: 400 })
      }

      const tag = createTagV3(data)
      return NextResponse.json({ tag }, { status: 201 })
    }

    if (action === "add_to_product") {
      if (!data.productId || !data.tagId || !data.productType) {
        return NextResponse.json(
          { error: "productId, tagId e productType são obrigatórios" },
          { status: 400 }
        )
      }

      const productTag = addProductTagV3(data.productId, data.tagId, data.productType)
      return NextResponse.json({ productTag }, { status: 201 })
    }

    if (action === "add_to_employee") {
      if (!data.userId || !data.tagId) {
        return NextResponse.json({ error: "userId e tagId são obrigatórios" }, { status: 400 })
      }

      const employeeTag = addTagToEmployee(data.userId, data.tagId)
      return NextResponse.json({ employeeTag }, { status: 201 })
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
  } catch (error: any) {
    console.error("[API Tags] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "ID da tag é obrigatório" }, { status: 400 })
    }

    const tag = getTagByIdV3(id)
    if (!tag) {
      return NextResponse.json({ error: "Tag não encontrada" }, { status: 404 })
    }

    const updated = updateTagV3(id, updates)
    return NextResponse.json({ tag: updated })
  } catch (error: any) {
    console.error("[API Tags] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const productId = searchParams.get("productId")
    const tagId = searchParams.get("tagId")
    const productType = searchParams.get("productType") as "base" | "company" | null
    const userId = searchParams.get("userId")

    if (action === "remove_from_product") {
      if (!productId || !tagId || !productType) {
        return NextResponse.json(
          { error: "productId, tagId e productType são obrigatórios" },
          { status: 400 }
        )
      }

      const removed = removeProductTagV3(productId, tagId, productType)
      return NextResponse.json({ removed })
    }

    if (action === "remove_from_employee") {
      if (!userId || !tagId) {
        return NextResponse.json({ error: "userId e tagId são obrigatórios" }, { status: 400 })
      }

      const removed = removeTagFromEmployee(userId, tagId)
      return NextResponse.json({ removed })
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
  } catch (error: any) {
    console.error("[API Tags] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
