/**
 * ===========================================
 * API DE COMPANIES (EMPRESAS)
 * ===========================================
 *
 * Endpoint para gerenciamento de empresas/tenants.
 */

import { NextResponse } from "next/server"
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
} from "@/lib/storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  try {
    if (id) {
      const company = getCompanyById(id)
      if (!company) {
        return NextResponse.json({ error: "Company não encontrada" }, { status: 404 })
      }
      return NextResponse.json({ company })
    }

    const companies = getCompanies()
    return NextResponse.json({ companies })
  } catch (error: any) {
    console.error("[API Companies] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Nome da empresa é obrigatório" }, { status: 400 })
    }

    const company = createCompany(body)
    return NextResponse.json({ company }, { status: 201 })
  } catch (error: any) {
    console.error("[API Companies] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "ID da empresa é obrigatório" }, { status: 400 })
    }

    const company = getCompanyById(id)
    if (!company) {
      return NextResponse.json({ error: "Company não encontrada" }, { status: 404 })
    }

    const updated = updateCompany(id, updates)
    return NextResponse.json({ company: updated })
  } catch (error: any) {
    console.error("[API Companies] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
