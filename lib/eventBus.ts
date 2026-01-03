import { Env, WebhookEventType, WebhookDeliveryDTO, EventLogDTO, getWebhooks, getWebhookDeliveries, saveWebhookDeliveries, getEventLogs, saveEventLogs } from "./storage"

type Callback = (data: any) => void

class EventBus {
  private listeners: Map<string, Callback[]> = new Map()

  subscribe(event: string, callback: Callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(callback)

    return () => {
      const filtered = this.listeners.get(event)?.filter((cb) => cb !== callback)
      if (filtered) {
        this.listeners.set(event, filtered)
      }
    }
  }

  async emit(env: Env, eventType: WebhookEventType, payload: any) {
    console.log(`[EventBus] Emitting ${eventType} in ${env}`, payload)

    // 1. Log the event locally
    const logs = getEventLogs(env)
    const newLog: EventLogDTO = {
      id: `evt_${Date.now()}`,
      type: eventType,
      source: "yoobe",
      env,
      traceId: `tr_${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
      status: "ok",
      payloadPreview: payload,
    }
    logs.unshift(newLog)
    saveEventLogs(logs, env)

    // 2. Simulate Webhook Delivery
    const webhooks = getWebhooks(env)
    const activeWebhooks = webhooks.filter((wh) => wh.isActive && wh.events.includes(eventType))

    for (const wh of activeWebhooks) {
      // Simulate delivery attempt
      const deliveries = getWebhookDeliveries(env)
      const isSuccess = Math.random() > 0.1 // 90% success rate by default

      const delivery: WebhookDeliveryDTO = {
        id: `dlv_${Date.now()}_${wh.id}`,
        webhookId: wh.id,
        eventType,
        status: isSuccess ? "ok" : "failed",
        attempts: 1,
        lastAttemptAt: new Date().toISOString(),
        traceId: newLog.traceId,
        latencyMs: Math.floor(Math.random() * 800) + 100,
        responseCode: isSuccess ? 200 : 500,
      }

      deliveries.unshift(delivery)
      saveWebhookDeliveries(deliveries, env)
    }

    // 3. Notify internal subscribers
    this.listeners.get(eventType)?.forEach((cb) => cb(payload))
    this.listeners.get("*")?.forEach((cb) => cb({ eventType, payload }))
  }
}

export const eventBus = new EventBus()
