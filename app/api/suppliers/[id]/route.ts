import { NextRequest, NextResponse } from "next/server"
import {
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  approveSupplier,
} from "@/lib/storage"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/suppliers/[id]
 * Obtém um fornecedor específico
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const supplier = getSupplierById(id)
    
    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Fornecedor não encontrado" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: supplier,
    })
  } catch (error) {
    console.error("Error fetching supplier:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar fornecedor" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/suppliers/[id]
 * Atualiza um fornecedor
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const existing = getSupplierById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Fornecedor não encontrado" },
        { status: 404 }
      )
    }
    
    const updated = updateSupplier(id, body)
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Erro ao atualizar fornecedor" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updated,
      message: "Fornecedor atualizado com sucesso",
    })
  } catch (error) {
    console.error("Error updating supplier:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar fornecedor" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/suppliers/[id]
 * Remove um fornecedor
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    
    const existing = getSupplierById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Fornecedor não encontrado" },
        { status: 404 }
      )
    }
    
    const deleted = deleteSupplier(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Erro ao excluir fornecedor" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Fornecedor excluído com sucesso",
    })
  } catch (error) {
    console.error("Error deleting supplier:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao excluir fornecedor" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/suppliers/[id]
 * Operações especiais no fornecedor (approve, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const existing = getSupplierById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Fornecedor não encontrado" },
        { status: 404 }
      )
    }
    
    // Handle special actions
    if (body.action === "approve") {
      const approved = approveSupplier(id, body.approvedBy || "super_admin")
      
      if (!approved) {
        return NextResponse.json(
          { success: false, error: "Erro ao aprovar fornecedor" },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: approved,
        message: "Fornecedor aprovado com sucesso",
      })
    }
    
    // Generic update
    const updated = updateSupplier(id, body)
    
    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error("Error patching supplier:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar fornecedor" },
      { status: 500 }
    )
  }
}
