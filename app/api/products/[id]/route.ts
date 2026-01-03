/**
 * ===========================================
 * API DE PRODUTO INDIVIDUAL
 * ===========================================
 *
 * Endpoints para operações em um produto específico.
 */

import { NextResponse } from "next/server"
import { getProductById, updateProduct, type Product } from "@/lib/storage"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = getProductById(id)
    
    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error: any) {
    console.error("[API Product GET] Erro:", error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Map the incoming fields to the Product interface
    const updateData: Partial<Product> = {}
    
    if (body.nome !== undefined) {
      updateData.name = body.nome
    }
    if (body.sku !== undefined) {
      updateData.sku = body.sku
    }
    if (body.preco !== undefined) {
      updateData.priceInPoints = body.preco
      updateData.price = body.preco
    }
    if (body.estoque !== undefined) {
      updateData.stock = body.estoque
    }
    if (body.ncm !== undefined) {
      updateData.ncm = body.ncm
    }
    
    const updatedProduct = updateProduct(id, updateData)
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      product: updatedProduct 
    })
  } catch (error: any) {
    console.error("[API Product PATCH] Erro:", error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
