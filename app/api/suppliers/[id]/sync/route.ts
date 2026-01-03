import { NextRequest, NextResponse } from "next/server"
import { getSupplierById } from "@/lib/storage"
import { createSpotBrindesAdapter } from "@/lib/suppliers/spot-brindes-adapter"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/suppliers/[id]/sync
 * Dispara sincronização manual com fornecedor
 * 
 * Body:
 *   - type: "prices" | "stock" | "products" | "full"
 *   - productIds?: string[] (opcional, para sincronizar apenas produtos específicos)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const supplier = getSupplierById(id)
    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Fornecedor não encontrado" },
        { status: 404 }
      )
    }
    
    if (supplier.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Fornecedor não está ativo" },
        { status: 400 }
      )
    }
    
    const syncType = body.type || "full"
    const productIds = body.productIds as string[] | undefined
    
    // Select adapter based on supplier type
    let result
    
    if (supplier.apiType === "spot_brindes") {
      const adapter = createSpotBrindesAdapter(id)
      
      if (!adapter.isConfigured()) {
        return NextResponse.json(
          { success: false, error: "Adaptador não configurado corretamente" },
          { status: 400 }
        )
      }
      
      switch (syncType) {
        case "prices":
          result = await adapter.syncPrices(productIds)
          break
        case "stock":
          result = await adapter.syncStock(productIds)
          break
        case "full":
        default:
          result = await adapter.syncFull()
          break
      }
    } else if (supplier.apiType === "custom") {
      // For custom APIs, we would use a generic adapter
      // For now, return not implemented
      return NextResponse.json(
        { success: false, error: "Sincronização para APIs customizadas ainda não implementada" },
        { status: 501 }
      )
    } else {
      // Manual suppliers don't support sync
      return NextResponse.json(
        { success: false, error: "Fornecedores manuais não suportam sincronização automática" },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: result.success,
      data: {
        syncType,
        productsUpdated: result.productsUpdated,
        productsCreated: result.productsCreated,
        productsFailed: result.productsFailed,
        duration: result.duration,
        errors: result.errors,
      },
      message: result.success 
        ? `Sincronização de ${syncType} concluída com sucesso`
        : `Sincronização de ${syncType} concluída com erros`,
    })
    
  } catch (error) {
    console.error("Error syncing supplier:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao sincronizar fornecedor" },
      { status: 500 }
    )
  }
}
