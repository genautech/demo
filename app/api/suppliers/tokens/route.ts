import { NextRequest, NextResponse } from "next/server"
import {
  getSupplierTokens,
  createSupplierToken,
  revokeSupplierToken,
  getSupplierTokensByCompany,
  type SupplierToken,
} from "@/lib/storage"

/**
 * GET /api/suppliers/tokens
 * Lista tokens de fornecedores
 * 
 * Query params:
 *   - companyId: Filtra por empresa
 */
export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get("companyId")
    
    const tokens = companyId 
      ? getSupplierTokensByCompany(companyId)
      : getSupplierTokens()
    
    // Remove o token real da resposta por segurança
    const safeTokens = tokens.map(t => ({
      ...t,
      token: `${t.token.substring(0, 12)}...`, // Mostrar apenas prefixo
    }))
    
    return NextResponse.json({
      success: true,
      data: safeTokens,
      total: safeTokens.length,
    })
  } catch (error) {
    console.error("Error fetching tokens:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar tokens" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/suppliers/tokens
 * Cria um novo token de fornecedor
 * 
 * Body:
 *   - companyId: string (required)
 *   - permissions: string[] (required)
 *   - expiresInDays?: number
 *   - maxUses?: number
 *   - supplierId?: string (optional, limita a um fornecedor específico)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.companyId) {
      return NextResponse.json(
        { success: false, error: "companyId é obrigatório" },
        { status: 400 }
      )
    }
    
    if (!body.permissions || !Array.isArray(body.permissions)) {
      return NextResponse.json(
        { success: false, error: "permissions é obrigatório e deve ser um array" },
        { status: 400 }
      )
    }
    
    // Validate permissions
    const validPermissions = ["add_supplier", "link_products", "sync_data"]
    const invalidPerms = body.permissions.filter((p: string) => !validPermissions.includes(p))
    if (invalidPerms.length > 0) {
      return NextResponse.json(
        { success: false, error: `Permissões inválidas: ${invalidPerms.join(", ")}` },
        { status: 400 }
      )
    }
    
    // Calculate expiration
    let expiresAt: string | undefined
    if (body.expiresInDays && body.expiresInDays > 0) {
      expiresAt = new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    }
    
    // Create token
    const token = createSupplierToken(
      body.companyId,
      body.permissions as SupplierToken["permissions"],
      body.createdBy || "api",
      {
        supplierId: body.supplierId,
        expiresAt,
        maxUses: body.maxUses > 0 ? body.maxUses : undefined,
      }
    )
    
    // Return full token only on creation
    return NextResponse.json({
      success: true,
      data: token,
      message: "Token criado com sucesso. Guarde-o em local seguro, ele não será mostrado novamente.",
    }, { status: 201 })
    
  } catch (error) {
    console.error("Error creating token:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao criar token" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/suppliers/tokens
 * Revoga um token
 * 
 * Query params:
 *   - id: ID do token a ser revogado
 */
export async function DELETE(request: NextRequest) {
  try {
    const tokenId = request.nextUrl.searchParams.get("id")
    
    if (!tokenId) {
      return NextResponse.json(
        { success: false, error: "id é obrigatório" },
        { status: 400 }
      )
    }
    
    const revoked = revokeSupplierToken(tokenId)
    
    if (!revoked) {
      return NextResponse.json(
        { success: false, error: "Token não encontrado" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Token revogado com sucesso",
    })
    
  } catch (error) {
    console.error("Error revoking token:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao revogar token" },
      { status: 500 }
    )
  }
}
