import { NextResponse } from "next/server"
import { scheduleGiftOrder } from "@/lib/storage"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { senderEmail, recipients, items, scheduledDate, message } = body

    if (!senderEmail || !recipients || !items || !scheduledDate) {
      return NextResponse.json(
        { error: "Dados incompletos para o agendamento" },
        { status: 400 }
      )
    }

    const orders = scheduleGiftOrder({
      senderEmail,
      recipients,
      items,
      scheduledDate,
      message,
    })

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error: any) {
    console.error("[API Gifts] Erro:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
