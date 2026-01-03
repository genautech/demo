import * as storage from "./storage"

/**
 * Simulates network latency
 */
const delay = (ms?: number) => {
  const wait = ms || Math.floor(Math.random() * 600) + 200
  return new Promise((resolve) => setTimeout(resolve, wait))
}

export const demoClient = {
  // Setup Status
  getSetupStatus: async (env: storage.Env): Promise<storage.SetupStatusDTO> => {
    await delay()
    return storage.getSetupStatus(env)
  },

  updateSetupStep: async (
    env: storage.Env,
    step: keyof storage.SetupStatusDTO["steps"],
    status: storage.SetupStepStatus,
    details?: string
  ): Promise<storage.SetupStatusDTO> => {
    await delay(300)
    const current = storage.getSetupStatus(env)
    current.steps[step] = { status, details }
    current.lastCheckedAt = new Date().toISOString()
    storage.saveSetupStatus(current, env)
    return current
  },

  // API Keys
  getApiKeys: async (env: storage.Env): Promise<storage.ApiKeyDTO[]> => {
    await delay()
    return storage.getApiKeys(env)
  },

  createApiKey: async (env: storage.Env, name: string): Promise<storage.ApiKeyDTO> => {
    await delay(500)
    const keys = storage.getApiKeys(env)
    const newKey: storage.ApiKeyDTO = {
      id: `ak_${Date.now()}`,
      name,
      prefix: "yb_" + (env === "sandbox" ? "sb_" : "live_"),
      scopes: ["all"],
      env,
      createdAt: new Date().toISOString(),
    }
    keys.push(newKey)
    storage.saveApiKeys(keys, env)
    return newKey
  },

  revokeApiKey: async (env: storage.Env, id: string): Promise<void> => {
    await delay(400)
    const keys = storage.getApiKeys(env)
    const index = keys.findIndex((k) => k.id === id)
    if (index !== -1) {
      keys[index].revokedAt = new Date().toISOString()
      storage.saveApiKeys(keys, env)
    }
  },

  // Webhooks
  getWebhooks: async (env: storage.Env): Promise<storage.WebhookDTO[]> => {
    await delay()
    return storage.getWebhooks(env)
  },

  createWebhook: async (
    env: storage.Env,
    url: string,
    events: storage.WebhookEventType[]
  ): Promise<storage.WebhookDTO> => {
    await delay(500)
    const webhooks = storage.getWebhooks(env)
    const newWebhook: storage.WebhookDTO = {
      id: `wh_${Date.now()}`,
      url,
      secretMasked: "whsec_**********",
      events,
      env,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    webhooks.push(newWebhook)
    storage.saveWebhooks(webhooks, env)
    return newWebhook
  },

  deleteWebhook: async (env: storage.Env, id: string): Promise<void> => {
    await delay(400)
    const webhooks = storage.getWebhooks(env)
    const filtered = webhooks.filter((wh) => wh.id !== id)
    storage.saveWebhooks(filtered, env)
  },

  // Webhook Deliveries
  getWebhookDeliveries: async (env: storage.Env): Promise<storage.WebhookDeliveryDTO[]> => {
    await delay()
    return storage.getWebhookDeliveries(env)
  },

  // Event Logs
  getEventLogs: async (env: storage.Env): Promise<storage.EventLogDTO[]> => {
    await delay()
    return storage.getEventLogs(env)
  },

  // Catalog
  getProducts: async (env: storage.Env): Promise<storage.Product[]> => {
    await delay()
    // For now using the existing getProducts from storage which returns V2 Product[]
    // In a real V3 setup we'd use CompanyProduct
    return storage.getProducts()
  },

  importMasterProducts: async (env: storage.Env): Promise<void> => {
    await delay(1500)
    // Simulates importing products from a master catalog
    storage.ensureBaseProductsSeeded()
    storage.ensureProductsSeeded() // Also ensure V2 products for backward compatibility
  },

  // Wallet / Ledger
  getWalletSummary: async (env: storage.Env, userId: string): Promise<storage.WalletSummaryDTO> => {
    await delay()
    const user = storage.getUserById(userId)
    return {
      userId,
      available: user?.points || 0,
      pending: 0,
      expiringSoon: 0,
      updatedAt: new Date().toISOString(),
    }
  },

  getTransactions: async (env: storage.Env, userId: string): Promise<storage.PointsTransaction[]> => {
    await delay()
    return storage.getUserTransactions(userId)
  },

  creditPoints: async (
    env: storage.Env,
    userId: string,
    amount: number,
    reason: string
  ): Promise<void> => {
    await delay(600)
    storage.addPoints(userId, amount, reason)
  },

  createUser: async (env: storage.Env, userData: Partial<storage.User>): Promise<storage.User> => {
    await delay(500)
    return storage.createUser(userData)
  },

  // Orders
  getOrders: async (env: storage.Env): Promise<storage.Order[]> => {
    await delay()
    return storage.getOrders()
  },

  getOrder: async (env: storage.Env, id: string): Promise<storage.Order | undefined> => {
    await delay()
    return storage.getOrderById(id)
  },

  createOrder: async (env: storage.Env, orderData: Partial<storage.Order>): Promise<storage.Order> => {
    await delay(800)
    const orders = storage.getOrders()
    const newOrder: storage.Order = {
      id: `ord_${Date.now()}`,
      number: `YOO-${Math.floor(Math.random() * 90000) + 10000}`,
      state: "complete",
      paymentState: "paid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData,
    } as storage.Order
    orders.push(newOrder)
    storage.saveOrders(orders)
    return newOrder
  },
}
