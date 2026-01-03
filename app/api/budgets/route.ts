/**
 * ===========================================
 * API DE BUDGETS (ORÇAMENTOS)
 * ===========================================
 *
 * Endpoint para gerenciamento de orçamentos.
 * Workflow: draft → submitted → reviewed → approved/rejected → released → replicated
 */

import { NextResponse } from "next/server"
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  getBudgetsByCompany,
  getBudgetItemsByBudget,
  createBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  calculateBudgetTotals,
  type BudgetStatus,
} from "@/lib/storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const companyId = searchParams.get("companyId")
  const status = searchParams.get("status") as BudgetStatus | null

  try {
    if (id) {
      const budget = getBudgetById(id)
      if (!budget) {
        return NextResponse.json({ error: "Budget não encontrado" }, { status: 404 })
      }
      const items = getBudgetItemsByBudget(id)
      return NextResponse.json({ budget, items })
    }

    let budgets = companyId ? getBudgetsByCompany(companyId) : getBudgets()

    if (status) {
      budgets = budgets.filter((b) => b.status === status)
    }

    return NextResponse.json({ budgets })
  } catch (error: any) {
    console.error("[API Budgets] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { budget, items } = body

    // Validar campos obrigatórios
    if (!budget.companyId || !budget.title || !budget.createdBy) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR: companyId, title e createdBy são obrigatórios" },
        { status: 400 }
      )
    }

    // Criar budget
    const newBudget = createBudget({
      ...budget,
      status: budget.status || "draft",
      updatedBy: budget.createdBy,
    })

    // Criar itens se fornecidos
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (!item.baseProductId) {
          return NextResponse.json(
            { error: "VALIDATION_ERROR: base_product_id_required" },
            { status: 400 }
          )
        }

        if (item.qty < 1 || item.unitPrice < 0 || item.unitPoints < 0) {
          return NextResponse.json(
            { error: "VALIDATION_ERROR: qty >= 1, unitPrice >= 0, unitPoints >= 0" },
            { status: 400 }
          )
        }

        createBudgetItem({
          budgetId: newBudget.id,
          baseProductId: item.baseProductId,
          qty: item.qty,
          unitPrice: item.unitPrice,
          unitPoints: item.unitPoints,
        })
      }
    }

    // Recalcular totais
    calculateBudgetTotals(newBudget.id)

    const finalBudget = getBudgetById(newBudget.id)
    const finalItems = getBudgetItemsByBudget(newBudget.id)

    return NextResponse.json({ budget: finalBudget, items: finalItems }, { status: 201 })
  } catch (error: any) {
    console.error("[API Budgets] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "ID do budget é obrigatório" }, { status: 400 })
    }

    const budget = getBudgetById(id)
    if (!budget) {
      return NextResponse.json({ error: "Budget não encontrado" }, { status: 404 })
    }

    // Validar transições de status
    const validTransitions: Record<BudgetStatus, BudgetStatus[]> = {
      draft: ["submitted", "draft"],
      submitted: ["reviewed", "submitted"],
      reviewed: ["approved", "rejected", "reviewed"],
      approved: ["released", "approved"],
      rejected: ["draft", "rejected"],
      released: ["replicated", "released"],
      replicated: ["replicated"],
    }

    if (updates.status && !validTransitions[budget.status]?.includes(updates.status)) {
      return NextResponse.json(
        { error: `Transição inválida: ${budget.status} → ${updates.status}` },
        { status: 400 }
      )
    }

    const updated = updateBudget(id, updates)
    const items = getBudgetItemsByBudget(id)

    return NextResponse.json({ budget: updated, items })
  } catch (error: any) {
    console.error("[API Budgets] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ===========================================
// BUDGET ITEMS ENDPOINTS
// ===========================================

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { action, budgetId, item } = body

    if (action === "add_item") {
      if (!budgetId || !item.baseProductId) {
        return NextResponse.json(
          { error: "VALIDATION_ERROR: budgetId e baseProductId são obrigatórios" },
          { status: 400 }
        )
      }

      const newItem = createBudgetItem({
        budgetId,
        baseProductId: item.baseProductId,
        qty: item.qty || 1,
        unitPrice: item.unitPrice || 0,
        unitPoints: item.unitPoints || 0,
      })

      return NextResponse.json({ item: newItem }, { status: 201 })
    }

    if (action === "update_item") {
      if (!item.id) {
        return NextResponse.json({ error: "ID do item é obrigatório" }, { status: 400 })
      }

      const updated = updateBudgetItem(item.id, {
        qty: item.qty,
        unitPrice: item.unitPrice,
        unitPoints: item.unitPoints,
      })

      return NextResponse.json({ item: updated })
    }

    if (action === "delete_item") {
      if (!item.id) {
        return NextResponse.json({ error: "ID do item é obrigatório" }, { status: 400 })
      }

      const deleted = deleteBudgetItem(item.id)
      return NextResponse.json({ deleted })
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
  } catch (error: any) {
    console.error("[API Budgets] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
