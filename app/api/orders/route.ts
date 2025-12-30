/**
 * ===========================================
 * API DE PEDIDOS
 * ===========================================
 *
 * Endpoint para gerenciamento de pedidos.
 *
 * TODO: Integrar com a API do Spree Commerce
 * Atualmente usando dados locais (localStorage) como mock.
 *
 * Endpoints do Spree para referência:
 * - GET /api/v2/platform/orders - Lista pedidos
 * - GET /api/v2/platform/orders/:id - Detalhes do pedido
 * - PATCH /api/v2/platform/orders/:id - Atualiza pedido
 */

import { NextResponse } from "next/server"
import { getOrders, updateOrderStatus, type OrderStatus } from "@/lib/storage"

// Mapeamento de status para exibição
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  in_transit: "Em Trânsito",
  delivered: "Entregue",
  cancelled: "Cancelado",
  returned: "Devolvido",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Parâmetros de paginação
  const page = Number.parseInt(searchParams.get("page") || "1")
  const perPage = Number.parseInt(searchParams.get("perPage") || "20")

  // Parâmetros de filtro
  const email = searchParams.get("email") || ""
  const orderNumber = searchParams.get("orderNumber") || ""
  const product = searchParams.get("product") || ""
  const status = searchParams.get("status") || ""
  const dateFrom = searchParams.get("dateFrom") || ""
  const dateTo = searchParams.get("dateTo") || ""

  try {
    // TODO: Substituir por chamada à API do Spree
    // const spreeOrders = await getOrders({ page, perPage, ... })

    let orders = getOrders()

    // Aplicar filtros
    if (email) {
      orders = orders.filter((o) => o.email.toLowerCase().includes(email.toLowerCase()))
    }
    if (orderNumber) {
      orders = orders.filter((o) => o.numero.toLowerCase().includes(orderNumber.toLowerCase()))
    }
    if (product) {
      orders = orders.filter((o) =>
        o.itens.some(
          (i) =>
            i.nome.toLowerCase().includes(product.toLowerCase()) ||
            (i.sku && i.sku.toLowerCase().includes(product.toLowerCase())),
        ),
      )
    }
    if (status) {
      orders = orders.filter((o) => o.status === status)
    }
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      orders = orders.filter((o) => new Date(o.dataPedido) >= fromDate)
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999)
      orders = orders.filter((o) => new Date(o.dataPedido) <= toDate)
    }

    // Ordenar por data (mais recentes primeiro)
    orders.sort((a, b) => new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime())

    // Calcular estatísticas de status
    const allOrders = getOrders()
    const statusStats = {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === "pending").length,
      processing: allOrders.filter((o) => o.status === "processing").length,
      shipped: allOrders.filter((o) => o.status === "shipped").length,
      in_transit: allOrders.filter((o) => o.status === "in_transit").length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
      returned: allOrders.filter((o) => o.status === "returned").length,
    }

    // Paginação
    const total = orders.length
    const totalPages = Math.ceil(total / perPage)
    const startIndex = (page - 1) * perPage
    const paginatedOrders = orders.slice(startIndex, startIndex + perPage)

    // Formatar pedidos para resposta
    const formattedOrders = paginatedOrders.map((order) => ({
      ...order,
      statusLabel: STATUS_LABELS[order.status] || order.status,
    }))

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
      meta: {
        statusStats,
        lastUpdate: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("[API Orders] Erro:", error.message)
    return NextResponse.json({ error: error.message, orders: [] }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID e status são obrigatórios" }, { status: 400 })
    }

    // TODO: Substituir por chamada à API do Spree
    // await updateOrderStatus(id, status)

    const updatedOrder = updateOrderStatus(id, status as OrderStatus)

    if (!updatedOrder) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order: {
        ...updatedOrder,
        statusLabel: STATUS_LABELS[updatedOrder.status] || updatedOrder.status,
      },
    })
  } catch (error: any) {
    console.error("[API Orders] Erro ao atualizar:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
