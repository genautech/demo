/**
 * ===========================================
 * API DE REPLICAÇÃO
 * ===========================================
 *
 * Endpoint para replicação idempotente de produtos do catálogo base
 * para o catálogo da empresa (company_products).
 */

import { NextResponse } from "next/server"
import {
  replicateProduct,
  getCompanyProductsByCompany,
  getBudgetById,
  getBudgets,
  saveBudgets,
  getBudgetItemsByBudget,
  getBudgetItems,
  saveBudgetItems,
  updateBudget,
  createReplicationLog,
  getReplicationLogs,
  getReplicationLogsByCompany,
  getReplicationLogsByBudget,
  type ReplicationResult,
} from "@/lib/storage"

export async function POST(request: Request) {
  try {
    let body
    try {
      body = await request.json()
      console.log("[API Replication] Request body recebido:", { budgetId: body.budgetId, baseProductId: body.baseProductId, companyId: body.companyId })
    } catch (parseError) {
      console.error("[API Replication] Erro ao parsear body:", parseError)
      return NextResponse.json({ 
        error: "Corpo da requisição inválido. JSON esperado." 
      }, { status: 400 })
    }
    const { budgetId, baseProductId, companyId, overrides, dryRun, actorId, budgetData, budgetItems: requestBudgetItems } = body

    // Modo: replicar de um budget aprovado e liberado
    if (budgetId) {
      console.log("[API Replication] Tentando replicar budget:", budgetId)
      
      // Tentar obter do storage local
      let budget = getBudgetById(budgetId)
      
      // Se recebeu dados do budget na requisição, usá-los para garantir sincronia com o client
      // (localStorage no client vs in-memory no server)
      if (budgetData) {
        console.log("[API Replication] Usando budgetData enviado pelo client para garantir sincronia")
        budget = budgetData
        
        // Sincronizar storage do servidor
        try {
          const budgets = getBudgets()
          const existingIndex = budgets.findIndex(b => b.id === budgetId)
          if (existingIndex >= 0) {
            budgets[existingIndex] = budget
          } else {
            budgets.push(budget)
          }
          saveBudgets(budgets)
        } catch (saveError) {
          console.warn("[API Replication] Erro ao sincronizar budget no storage:", saveError)
        }
      }
      
      if (!budget) {
        console.error("[API Replication] Budget não encontrado:", budgetId)
        // Tentar listar todos os budgets para debug
        const allBudgets = getBudgets()
        console.error("[API Replication] Budgets disponíveis:", allBudgets.map(b => ({ id: b.id, title: b.title, status: b.status })))
        return NextResponse.json({ 
          error: "Budget não encontrado",
          debug: {
            budgetId,
            availableBudgets: allBudgets.length
          }
        }, { status: 404 })
      }
      
      console.log("[API Replication] Budget encontrado:", { id: budget.id, status: budget.status, companyId: budget.companyId })

      if (budget.status !== "released") {
        return NextResponse.json(
          { error: "Budget deve estar com status 'released' para replicação" },
          { status: 400 }
        )
      }

      // Usar itens da requisição se fornecidos, caso contrário buscar do storage
      let items = requestBudgetItems || getBudgetItemsByBudget(budgetId)
      
      // Sincronizar itens recebidos com o storage do servidor
      if (requestBudgetItems && requestBudgetItems.length > 0) {
        try {
          const allItems = getBudgetItems()
          requestBudgetItems.forEach((item: any) => {
            const existingIndex = allItems.findIndex(i => i.id === item.id)
            if (existingIndex >= 0) {
              allItems[existingIndex] = item
            } else {
              allItems.push(item)
            }
          })
          saveBudgetItems(allItems)
        } catch (saveError) {
          console.warn("[API Replication] Erro ao sincronizar itens no storage:", saveError)
        }
      }
      if (items.length === 0) {
        return NextResponse.json({ error: "Budget não possui itens" }, { status: 400 })
      }

      const results: ReplicationResult[] = []
      const errors: string[] = []

      for (const item of items) {
        const result = replicateProduct(
          item.baseProductId,
          budget.companyId,
          {
            price: item.unitPrice,
            pointsCost: item.unitPoints,
            stockQuantity: item.qty,
            isActive: true,
          },
          actorId || budget.updatedBy
        )

        if (result.error) {
          errors.push(`${item.baseProductId}: ${result.error}`)
        } else {
          results.push(result)
        }
      }

      // Criar log de replicação
      let log
      try {
        log = createReplicationLog({
          budgetId,
          companyId: budget.companyId,
          actorId: actorId || budget.updatedBy || "system",
          action: "replicate_budget",
          results,
          errors: errors.length > 0 ? errors : undefined,
          metadata: {
            dryRun: dryRun || false,
            source: "api",
          },
        })
      } catch (logError: any) {
        console.error("[API Replication] Erro ao criar log:", logError)
        // Continuar mesmo se o log falhar
        log = { id: `replog_${Date.now()}` } as any
      }

      if (!dryRun && errors.length === 0) {
        // Atualizar status do budget para "replicated"
        try {
          updateBudget(budgetId, {
            status: "replicated",
            replicatedAt: new Date().toISOString(),
          })
        } catch (updateError: any) {
          console.error("[API Replication] Erro ao atualizar budget:", updateError)
          // Não falhar a replicação se a atualização do status falhar
        }
      }

      return NextResponse.json({
        budgetId,
        logId: log.id,
        dryRun: dryRun || false,
        results,
        errors: errors.length > 0 ? errors : undefined,
        summary: {
          total: items.length,
          created: results.filter((r) => r.status === "created").length,
          updated: results.filter((r) => r.status === "updated").length,
          skipped: results.filter((r) => r.status === "skipped").length,
        },
      })
    }

    // Modo: replicar produto individual
    if (baseProductId && companyId) {
      const result = replicateProduct(baseProductId, companyId, overrides, actorId)

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      // Criar log de replicação
      const log = createReplicationLog({
        companyId,
        baseProductId,
        actorId: actorId || "system",
        action: "replicate_single",
        results: [result],
        metadata: {
          dryRun: dryRun || false,
          source: "api",
        },
      })

      return NextResponse.json({
        result,
        logId: log.id,
        dryRun: dryRun || false,
      })
    }

    return NextResponse.json(
      { error: "budgetId ou (baseProductId + companyId) são obrigatórios" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("[API Replication] Erro completo:", error)
    const errorMessage = error?.message || error?.toString() || "Erro desconhecido ao processar replicação"
    console.error("[API Replication] Mensagem de erro:", errorMessage)
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error?.stack : undefined
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const companyId = searchParams.get("companyId")
  const budgetId = searchParams.get("budgetId")
  const logsOnly = searchParams.get("logs") === "true"

  // Se for para buscar logs
  if (logsOnly) {
    try {
      if (budgetId) {
        const logs = getReplicationLogsByBudget(budgetId)
        return NextResponse.json({ logs })
      }
      if (companyId) {
        const logs = getReplicationLogsByCompany(companyId)
        return NextResponse.json({ logs })
      }
      const logs = getReplicationLogs()
      return NextResponse.json({ logs })
    } catch (error: any) {
      console.error("[API Replication] Erro ao buscar logs:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  // Buscar produtos (comportamento original)
  if (!companyId) {
    return NextResponse.json({ error: "companyId é obrigatório" }, { status: 400 })
  }

  try {
    const products = getCompanyProductsByCompany(companyId)
    return NextResponse.json({ products })
  } catch (error: any) {
    console.error("[API Replication] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
