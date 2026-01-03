import { eventBus } from "./eventBus"
import { demoClient } from "./demoClient"
import { Env, updateOrder } from "./storage"

/**
 * Fulfillment Simulator
 * Automatically advances order shipment status in Demo Mode
 */
class FulfillmentSimulator {
  private activeTimers: Map<string, NodeJS.Timeout[]> = new Map()

  init() {
    console.log("[FulfillmentSimulator] initialized")
    
    // Listen for new orders
    eventBus.subscribe("order.created", async (payload) => {
      const { orderId, env } = payload
      if (!orderId) return

      console.log(`[FulfillmentSimulator] Scheduling fulfillment for order ${orderId} in ${env}`)
      this.scheduleFulfillment(orderId, env as Env)
    })
  }

  private scheduleFulfillment(orderId: string, env: Env) {
    const timers: NodeJS.Timeout[] = []

    // 1. Packed after 10s
    timers.push(setTimeout(async () => {
      await this.updateStatus(orderId, env, "packed")
    }, 10000))

    // 2. Shipped after 25s
    timers.push(setTimeout(async () => {
      await this.updateStatus(orderId, env, "shipped", {
        trackingCode: `TRK${Math.floor(Math.random() * 900000)}BR`,
        trackingUrl: "https://rastreio.com.br"
      })
    }, 25000))

    // 3. Delivered after 45s
    timers.push(setTimeout(async () => {
      await this.updateStatus(orderId, env, "delivered")
    }, 45000))

    this.activeTimers.set(orderId, timers)
  }

  private async updateStatus(orderId: string, env: Env, status: any, extras: any = {}) {
    console.log(`[FulfillmentSimulator] Updating order ${orderId} to status: ${status}`)
    
    // Update storage directly for speed in demo
    updateOrder(orderId, {
      shipment: {
        status,
        ...extras,
        updatedAt: new Date().toISOString()
      }
    })

    // Emit event for real-time UI updates or webhooks
    await eventBus.emit(env, "shipment.updated", {
      orderId,
      status,
      ...extras,
      timestamp: new Date().toISOString()
    })
  }

  stop(orderId: string) {
    const timers = this.activeTimers.get(orderId)
    if (timers) {
      timers.forEach(clearTimeout)
      this.activeTimers.delete(orderId)
    }
  }
}

export const fulfillmentSimulator = new FulfillmentSimulator()
