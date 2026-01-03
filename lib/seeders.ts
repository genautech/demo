import * as storage from "./storage"

export type ScenarioName = "PRIO Onboarding" | "Hapvida Incentivos" | "Yampi Cultura" | "Boticário Seasonal"

interface Scenario {
  products: {
    id: string;
    name: string;
    category: string;
    priceInPoints: number;
    active: boolean;
    stock: number;
    image: string;
  }[];
  ledger: { amount: number; reason: string }[];
  tags: string[];
}

export const SCENARIOS: Record<ScenarioName, Scenario> = {
  "PRIO Onboarding": {
    products: [
      { id: "prio_1", name: "Kit Boas-Vindas PRIO", category: "Kits", priceInPoints: 500, active: true, stock: 100, image: "/green-corporate-stationery-kit.jpg" },
      { id: "prio_2", name: "Moleton PRIO Energy", category: "Vestuário", priceInPoints: 1500, active: true, stock: 50, image: "/green-corporate-t-shirt.jpg" },
    ],
    ledger: [
      { amount: 500, reason: "Bônus Onboarding" }
    ],
    tags: ["onboarding", "new-hire"]
  },
  "Hapvida Incentivos": {
    products: [
      { id: "hap_1", name: "Voucher Saúde & Bem-estar", category: "Vouchers", priceInPoints: 2000, active: true, stock: 1000, image: "/green-thermal-bottle.jpg" },
      { id: "hap_2", name: "Smartwatch Fitness Hap", category: "Wearables", priceInPoints: 5000, active: true, stock: 30, image: "/smartwatch-esportivo-preto.jpg" },
    ],
    ledger: [
      { amount: 3000, reason: "Meta Batida - Comercial" }
    ],
    tags: ["incentivo", "comercial"]
  },
  "Yampi Cultura": {
    products: [
      { id: "yampi_1", name: "Livro: A Cultura do Uau", category: "Cultura", priceInPoints: 300, active: true, stock: 200, image: "/green-corporate-notebook-a5.jpg" },
      { id: "yampi_2", name: "Ingresso Yampi Summit", category: "Eventos", priceInPoints: 10000, active: true, stock: 10, image: "/placeholder.jpg" },
    ],
    ledger: [
      { amount: 1000, reason: "Prêmio Reconhecimento Colega" }
    ],
    tags: ["cultura", "reconhecimento"]
  },
  "Boticário Seasonal": {
    products: [
      { id: "bot_1", name: "Kit Natal Boticário", category: "Kits", priceInPoints: 800, active: true, stock: 500, image: "/diverse-products-still-life.png" },
      { id: "bot_2", name: "Perfume Exclusivo Colab", category: "Beleza", priceInPoints: 2500, active: true, stock: 100, image: "/placeholder.jpg" },
    ],
    ledger: [
      { amount: 1200, reason: "Campanha Natal 2024" }
    ],
    tags: ["campanha", "sazonal"]
  }
}

export async function seedScenario(name: ScenarioName, env: storage.Env) {
  const scenario = SCENARIOS[name]
  
  // 1. Seed Products
  const currentProducts = storage.getProducts()
  const newProducts = [...currentProducts, ...scenario.products.map((p: any) => ({
    ...p,
    id: `${name.replace(/\s+/g, "_")}_${p.id}_${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))]
  storage.saveProducts(newProducts)

  // 2. Seed Tags
  const currentTags = storage.getTags()
  const newTags = Array.from(new Set([...currentTags, ...scenario.tags]))
  storage.saveTags(newTags)

  // 3. Seed Wallet for Test User
  const TEST_USER_ID = "spree_user_demo_test"
  for (const entry of scenario.ledger) {
    storage.addPoints(TEST_USER_ID, entry.amount, `[${name}] ${entry.reason}`)
  }

  // 4. Mark setup steps as partially done
  const status = storage.getSetupStatus(env)
  status.steps.catalog.status = "done"
  status.steps.wallet.status = "done"
  storage.saveSetupStatus(status, env)

  return true
}

export function resetDemo() {
  if (typeof window === "undefined") return
  
  // Find all keys with yoobe_demo prefix
  const keys = Object.keys(localStorage).filter(k => k.startsWith("yoobe_demo"))
  keys.forEach(k => localStorage.removeItem(k))
  
  // Also reset auth and other related things if needed
  // localStorage.removeItem("yoobe_auth")
  
  window.location.reload()
}

export async function seedAIScenario(profile: any, products: any[], userId: string) {
  // 1. Seed Base Products
  const baseProducts = products.map((p, i) => ({
    ...p,
    id: `ai_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
  storage.saveBaseProducts(baseProducts)

  // 2. Get or create user
  let user = storage.getUserById(userId)
  if (!user) {
    user = storage.createUser({
      id: userId,
      email: "demo@exemplo.com",
      firstName: "Demo",
      lastName: "Usuário",
      points: 0,
      totalPointsEarned: 0,
    })
  }
  
  // Ensure user has at least bronze level for cashback calculation
  if (!user.level || user.level === "bronze") {
    // User will get level updated when points are added
  }

  // 3. Create Initial Orders History (Behavioral Simulation)
  const numOrders = 15 + Math.floor(Math.random() * 10)
  const availableProducts = baseProducts.filter(p => p.active && (p.stock || 0) > 0)
  const createdOrders: any[] = []

  for (let i = 0; i < numOrders && availableProducts.length > 0; i++) {
    const product = availableProducts[Math.floor(Math.random() * availableProducts.length)]
    const quantity = Math.floor(Math.random() * 2) + 1 // 1-2 items
    const orderValue = product.price * quantity
    const paidWithMoney = Math.random() > 0.3 ? orderValue : 0 // 70% paid with money
    const paidWithPoints = paidWithMoney === 0 ? product.priceInPoints * quantity : 0

    // Create order
    const order = storage.createOrder({
      userId: userId,
      email: user.email,
      lineItems: [{
        id: `li_${Date.now()}_${i}`,
        productId: product.id,
        name: product.name,
        sku: product.sku || "",
        quantity: quantity,
        price: product.price,
        total: orderValue,
      }],
      itemTotal: orderValue,
      shipmentTotal: 0,
      total: orderValue,
      paymentState: "paid",
      shipmentState: i < 5 ? "delivered" : i < 10 ? "shipped" : "ready",
      state: "complete",
      paidWithMoney: paidWithMoney,
      paidWithPoints: paidWithPoints,
      completedAt: new Date(Date.now() - (numOrders - i) * 24 * 60 * 60 * 1000).toISOString(),
    })

    createdOrders.push(order)

    // If paid with points, deduct them
    if (paidWithPoints > 0) {
      storage.deductPoints(userId, paidWithPoints, `Compra: ${product.name}`, order.number)
    }
  }

  // 4. Ensure user exists and add initial points
  let finalUser = storage.getUserById(userId)
  if (!finalUser) {
    // Create user if still doesn't exist
    finalUser = storage.createUser({
      id: userId,
      email: user?.email || "demo@exemplo.com",
      firstName: user?.firstName || "Demo",
      lastName: user?.lastName || "Usuário",
      points: 0,
      totalPointsEarned: 0,
    })
  }
  
  // Always ensure user has at least 5000 points for demo
  const currentPoints = finalUser.points || 0
  const targetPoints = 5000
  if (currentPoints < targetPoints) {
    const pointsToAdd = targetPoints - currentPoints
    storage.addPoints(userId, pointsToAdd, "Saldo inicial de demonstração")
  }
  
  // Ensure user has earned enough points to have at least silver level for better cashback
  const updatedUser = storage.getUserById(userId)
  if (updatedUser && (updatedUser.totalPointsEarned || 0) < 1000) {
    const earnedToAdd = 1000 - (updatedUser.totalPointsEarned || 0)
    if (earnedToAdd > 0) {
      storage.addPoints(userId, earnedToAdd, "Bônus de demonstração para nível")
    }
  }

  // 5. Unlock first purchase achievement if user has orders
  if (createdOrders.length > 0) {
    const updatedUser = storage.getUserById(userId)
    if (updatedUser && !updatedUser.achievements.find(a => a.id === "first_purchase")) {
      storage.updateUser(userId, {
        achievements: [
          ...updatedUser.achievements,
          {
            id: "first_purchase",
            name: "Primeira Compra",
            description: "Realizou a primeira compra na loja",
            icon: "🛒",
            earnedAt: new Date().toISOString(),
          }
        ]
      })
    }
  }

  return true
}
