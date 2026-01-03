import { NextRequest, NextResponse } from "next/server"
import {
  getSuppliers,
  createSupplier,
  validateSupplierToken,
  useSupplierToken,
  type Supplier,
} from "@/lib/storage"

/**
 * GET /api/suppliers
 * Lista todos os fornecedores
 */
export async function GET(request: NextRequest) {
  try {
    const suppliers = getSuppliers()
    
    // Filter by status if provided
    const status = request.nextUrl.searchParams.get("status")
    const filtered = status 
      ? suppliers.filter(s => s.status === status)
      : suppliers
    
    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar fornecedores" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/suppliers
 * Cria um novo fornecedor
 * 
 * Headers:
 *   - Authorization: Bearer <token> (Super Admin) ou X-Supplier-Token: <token> (Gestor)
 * 
 * Body:
 *   - name: string (required)
 *   - apiType: "spot_brindes" | "custom" | "manual"
 *   - apiEndpoint?: string
 *   - apiKey?: string
 *   - contactInfo?: { email?, phone?, website? }
 *   - metadata?: { cnpj?, address?, notes? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Nome é obrigatório" },
        { status: 400 }
      )
    }
    
    // Check authentication
    const authHeader = request.headers.get("authorization")
    const supplierToken = request.headers.get("x-supplier-token")
    
    let createdBy = "api"
    let status: Supplier["status"] = "pending"
    
    if (authHeader?.startsWith("Bearer ")) {
      // Super Admin authentication (would validate JWT in production)
      createdBy = "super_admin"
      status = "active"
    } else if (supplierToken) {
      // Gestor with token
      const validation = validateSupplierToken(supplierToken)
      
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error || "Token inválido" },
          { status: 401 }
        )
      }
      
      if (!validation.tokenData?.permissions.includes("add_supplier")) {
        return NextResponse.json(
          { success: false, error: "Token sem permissão para adicionar fornecedores" },
          { status: 403 }
        )
      }
      
      // Register token usage
      useSupplierToken(supplierToken)
      
      createdBy = `company:${validation.tokenData.companyId}`
      status = "pending" // Needs Super Admin approval
    } else {
      return NextResponse.json(
        { success: false, error: "Autenticação necessária" },
        { status: 401 }
      )
    }
    
    // Create supplier
    const supplierData: Partial<Supplier> = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      apiType: body.apiType || "manual",
      apiEndpoint: body.apiEndpoint,
      apiKey: body.apiKey,
      status,
      contactInfo: body.contactInfo || {},
      metadata: body.metadata || {},
      syncSettings: body.syncSettings || {
        autoSyncPrices: false,
        autoSyncStock: false,
        syncInterval: 60,
      },
    }
    
    const supplier = createSupplier(supplierData, createdBy)
    
    return NextResponse.json({
      success: true,
      data: supplier,
      message: status === "pending" 
        ? "Fornecedor criado e aguardando aprovação do Super Admin"
        : "Fornecedor criado com sucesso",
    }, { status: 201 })
    
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao criar fornecedor" },
      { status: 500 }
    )
  }
}
