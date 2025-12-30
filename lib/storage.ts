/**
 * ===========================================
 * SISTEMA DE ARMAZENAMENTO LOCAL
 * ===========================================
 *
 * Este arquivo gerencia o armazenamento local de dados enquanto
 * a integração com o Spree Commerce não está implementada.
 *
 * ESTRUTURA BASEADA NO SPREE COMMERCE 5:
 * - Usuários mapeados de Spree::User
 * - Produtos mapeados de Spree::Product
 * - Pedidos mapeados de Spree::Order
 *
 * NOTA: Em produção, estes dados devem vir da API do Spree.
 * Este arquivo serve como mock/fallback para desenvolvimento.
 *
 * @author Seu Nome
 * @version 2.0.0
 */

// ===========================================
// INTERFACES - BASEADAS NO SPREE COMMERCE 5
// ===========================================

/**
 * Interface de usuário baseada em Spree::User
 * Campos customizados adicionados para gamificação
 */
export interface User {
  id: string
  // Campos padrão do Spree
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string // URL da imagem do avatar
  // Endereço (Spree::Address)
  address?: {
    address1: string
    address2?: string
    city: string
    stateCode: string
    zipcode: string
    country: string
  }
  // Campos customizados - Gamificação
  brents: number
  level: UserLevel
  totalPurchases: number
  totalSpent: number
  totalBrentsEarned: number
  totalBrentsSpent: number
  achievements: Achievement[]
  // Tags para segmentação na loja
  tags: string[]
  // Metadados
  createdAt: string
  updatedAt: string
  lastPurchaseAt?: string
}

/**
 * Níveis de gamificação do usuário
 */
export type UserLevel = "bronze" | "silver" | "gold" | "platinum" | "diamond"

/**
 * Interface de conquista/achievement
 */
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

/**
 * Transação de BRENTS
 */
export interface BrentTransaction {
  id: string
  userId: string
  type: "credit" | "debit"
  amount: number
  description: string
  orderId?: string
  orderNumber?: string
  createdAt: string
}

/**
 * Interface de produto baseada em Spree::Product
 */
export interface Product {
  id: string
  // Campos padrão do Spree
  name: string
  description: string
  slug?: string
  sku?: string
  price: number
  compareAtPrice?: number
  // Campos customizados
  priceInBrents: number
  image?: string
  images?: string[]
  // Estoque (Spree::StockItem)
  stock: number
  // Taxon/Categoria
  category: string
  taxonIds?: string[]
  // Tags para visualização na loja
  tags?: string[]
  // Variantes (Spree::Variant)
  variants?: ProductVariant[]
  // Status
  available?: boolean
  active: boolean
  // Estatísticas
  totalSold?: number
  // Metadados
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  sku: string
  optionValues: string[]
  price: number
  stock: number
}

/**
 * Interface de pedido baseada em Spree::Order
 */
export interface Order {
  id: string
  // Campos padrão do Spree
  number: string
  state: OrderState
  itemTotal: number
  shipmentTotal: number
  total: number
  paymentState: PaymentState
  shipmentState?: ShipmentState
  // Cliente (Spree::User)
  userId: string
  email: string
  // Itens (Spree::LineItem)
  lineItems: LineItem[]
  // Endereço de entrega (Spree::Address)
  shipAddress?: {
    firstname: string
    lastname: string
    address1: string
    address2?: string
    city: string
    stateCode: string
    zipcode: string
    phone?: string
  }
  // Rastreamento (Spree::Shipment)
  trackingNumber?: string
  trackingUrl?: string
  carrier?: string
  // Datas
  completedAt?: string
  shippedAt?: string
  deliveredAt?: string
  canceledAt?: string
  // Pagamento com BRENTS
  paidWithBrents?: number
  brentsEarned?: number
  // Metadados
  createdAt: string
  updatedAt: string
}

export interface LineItem {
  id: string
  productId: string
  variantId?: string
  name: string
  sku: string
  quantity: number
  price: number
  total: number
}

// Estados baseados no Spree
export type OrderState = "cart" | "address" | "delivery" | "payment" | "confirm" | "complete" | "canceled" | "returned"
export type PaymentState = "balance_due" | "paid" | "credit_owed" | "failed" | "void"
export type ShipmentState = "pending" | "ready" | "shipped" | "delivered" | "canceled"

// ADDED: Adding OrderStatus type alias for compatibility
export type OrderStatus = OrderState

// ===========================================
// CONFIGURAÇÕES DE GAMIFICAÇÃO
// ===========================================

export const LEVEL_CONFIG: Record<UserLevel, { minBrents: number; multiplier: number; color: string; label: string }> =
  {
    bronze: { minBrents: 0, multiplier: 1.0, color: "#CD7F32", label: "Bronze" },
    silver: { minBrents: 1000, multiplier: 1.1, color: "#C0C0C0", label: "Prata" },
    gold: { minBrents: 5000, multiplier: 1.25, color: "#FFD700", label: "Ouro" },
    platinum: { minBrents: 15000, multiplier: 1.5, color: "#E5E4E2", label: "Platina" },
    diamond: { minBrents: 50000, multiplier: 2.0, color: "#B9F2FF", label: "Diamante" },
  }

export const ACHIEVEMENTS_CATALOG = [
  { id: "first_purchase", name: "Primeira Compra", description: "Realizou a primeira compra na loja", icon: "🛒" },
  {
    id: "big_spender",
    name: "Grande Gastador",
    description: "Gastou mais de 500 BRTS na loja",
    icon: "💰",
  },
  { id: "collector", name: "Colecionador", description: "Comprou 5 produtos diferentes", icon: "📦" },
  { id: "loyal", name: "Cliente Fiel", description: "Realizou 10 compras", icon: "⭐" },
  { id: "brents_master", name: "Mestre dos BRENTS", description: "Acumulou 5000 BRENTS", icon: "🏆" },
  { id: "early_adopter", name: "Pioneiro", description: "Um dos primeiros 100 usuários", icon: "🚀" },
  { id: "reviewer", name: "Avaliador", description: "Avaliou 5 produtos", icon: "✍️" },
  { id: "referral", name: "Embaixador", description: "Indicou 3 amigos", icon: "👥" },
]

// ===========================================
// DADOS MOCKADOS - BASEADOS NO SPREE COMMERCE 5
// ===========================================

const initialUsers: User[] = [
  {
    id: "spree_user_1",
    email: "joao.silva@empresa.com.br",
    firstName: "João",
    lastName: "Silva",
    phone: "(11) 99999-1111",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    address: {
      address1: "Rua das Flores, 123",
      address2: "Apto 45",
      city: "São Paulo",
      stateCode: "SP",
      zipcode: "01234-567",
      country: "BR",
    },
    brents: 4500,
    level: "gold",
    totalPurchases: 12,
    totalSpent: 1850.0,
    totalBrentsEarned: 5500,
    totalBrentsSpent: 1000,
    achievements: [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realizou a primeira compra na loja",
        icon: "🛒",
        earnedAt: "2024-01-20",
      },
      { id: "loyal", name: "Cliente Fiel", description: "Realizou 10 compras", icon: "⭐", earnedAt: "2024-08-15" },
      {
        id: "collector",
        name: "Colecionador",
        description: "Comprou 5 produtos diferentes",
        icon: "📦",
        earnedAt: "2024-05-10",
      },
    ],
    tags: ["vip", "colaborador", "embaixador"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-11-28T14:30:00Z",
    lastPurchaseAt: "2024-11-25T16:45:00Z",
  },
  {
    id: "spree_user_2",
    email: "maria.santos@empresa.com.br",
    firstName: "Maria",
    lastName: "Santos",
    phone: "(11) 99999-2222",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    address: {
      address1: "Av. Paulista, 1000",
      address2: "Conj 501",
      city: "São Paulo",
      stateCode: "SP",
      zipcode: "01310-100",
      country: "BR",
    },
    brents: 8200,
    level: "gold",
    totalPurchases: 18,
    totalSpent: 2450.0,
    totalBrentsEarned: 9500,
    totalBrentsSpent: 1300,
    achievements: [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realizou a primeira compra na loja",
        icon: "🛒",
        earnedAt: "2024-02-12",
      },
      {
        id: "big_spender",
        name: "Grande Gastador",
        description: "Gastou mais de 500 BRTS na loja",
        icon: "💰",
        earnedAt: "2024-04-20",
      },
      { id: "loyal", name: "Cliente Fiel", description: "Realizou 10 compras", icon: "⭐", earnedAt: "2024-07-01" },
      {
        id: "brents_master",
        name: "Mestre dos BRENTS",
        description: "Acumulou 5000 BRENTS",
        icon: "🏆",
        earnedAt: "2024-09-15",
      },
    ],
    tags: ["premium", "early_adopter"],
    createdAt: "2024-02-10T09:30:00Z",
    updatedAt: "2024-12-01T11:00:00Z",
    lastPurchaseAt: "2024-11-30T10:20:00Z",
  },
  {
    id: "spree_user_3",
    email: "pedro.costa@empresa.com.br",
    firstName: "Pedro",
    lastName: "Costa",
    phone: "(21) 99999-3333",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
    address: {
      address1: "Rua do Catete, 500",
      address2: "Casa 2",
      city: "Rio de Janeiro",
      stateCode: "RJ",
      zipcode: "22220-000",
      country: "BR",
    },
    brents: 1200,
    level: "silver",
    totalPurchases: 5,
    totalSpent: 620.0,
    totalBrentsEarned: 1500,
    totalBrentsSpent: 300,
    achievements: [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realizou a primeira compra na loja",
        icon: "🛒",
        earnedAt: "2024-03-08",
      },
      {
        id: "big_spender",
        name: "Grande Gastador",
        description: "Gastou mais de 500 BRTS na loja",
        icon: "💰",
        earnedAt: "2024-06-15",
      },
    ],
    tags: ["colaborador"],
    createdAt: "2024-03-05T14:00:00Z",
    updatedAt: "2024-11-20T16:45:00Z",
    lastPurchaseAt: "2024-11-18T09:30:00Z",
  },
  {
    id: "spree_user_4",
    email: "ana.oliveira@empresa.com.br",
    firstName: "Ana",
    lastName: "Oliveira",
    phone: "(11) 99999-4444",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    address: {
      address1: "Rua Oscar Freire, 200",
      address2: "Sala 1502",
      city: "São Paulo",
      stateCode: "SP",
      zipcode: "01426-000",
      country: "BR",
    },
    brents: 15800,
    level: "platinum",
    totalPurchases: 35,
    totalSpent: 5200.0,
    totalBrentsEarned: 18000,
    totalBrentsSpent: 2200,
    achievements: [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realizou a primeira compra na loja",
        icon: "🛒",
        earnedAt: "2024-01-22",
      },
      {
        id: "early_adopter",
        name: "Pioneiro",
        description: "Um dos primeiros 100 usuários",
        icon: "🚀",
        earnedAt: "2024-01-22",
      },
      {
        id: "big_spender",
        name: "Grande Gastador",
        description: "Gastou mais de 500 BRTS na loja",
        icon: "💰",
        earnedAt: "2024-02-28",
      },
      { id: "loyal", name: "Cliente Fiel", description: "Realizou 10 compras", icon: "⭐", earnedAt: "2024-04-10" },
      {
        id: "collector",
        name: "Colecionador",
        description: "Comprou 5 produtos diferentes",
        icon: "📦",
        earnedAt: "2024-03-15",
      },
      {
        id: "brents_master",
        name: "Mestre dos BRENTS",
        description: "Acumulou 5000 BRENTS",
        icon: "🏆",
        earnedAt: "2024-05-20",
      },
      { id: "referral", name: "Embaixador", description: "Indicou 3 amigos", icon: "👥", earnedAt: "2024-07-01" },
    ],
    tags: ["vip", "embaixador", "influencer"],
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-12-02T18:00:00Z",
    lastPurchaseAt: "2024-12-02T17:30:00Z",
  },
  {
    id: "spree_user_5",
    email: "carlos.ferreira@empresa.com.br",
    firstName: "Carlos",
    lastName: "Ferreira",
    phone: "(31) 99999-5555",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    address: {
      address1: "Av. Afonso Pena, 1500",
      address2: "",
      city: "Belo Horizonte",
      stateCode: "MG",
      zipcode: "30130-002",
      country: "BR",
    },
    brents: 650,
    level: "bronze",
    totalPurchases: 2,
    totalSpent: 180.0,
    totalBrentsEarned: 800,
    totalBrentsSpent: 150,
    achievements: [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realizou a primeira compra na loja",
        icon: "🛒",
        earnedAt: "2024-04-05",
      },
    ],
    tags: ["novo"],
    createdAt: "2024-04-01T11:00:00Z",
    updatedAt: "2024-10-15T10:00:00Z",
    lastPurchaseAt: "2024-10-12T14:00:00Z",
  },
  {
    id: "spree_user_6",
    email: "fernanda.lima@empresa.com.br",
    firstName: "Fernanda",
    lastName: "Lima",
    phone: "(41) 99999-6666",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda",
    address: {
      address1: "Rua XV de Novembro, 800",
      address2: "Apto 301",
      city: "Curitiba",
      stateCode: "PR",
      zipcode: "80020-310",
      country: "BR",
    },
    brents: 3200,
    level: "silver",
    totalPurchases: 8,
    totalSpent: 950.0,
    totalBrentsEarned: 3800,
    totalBrentsSpent: 600,
    achievements: [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realizou a primeira compra na loja",
        icon: "🛒",
        earnedAt: "2024-02-20",
      },
      {
        id: "big_spender",
        name: "Grande Gastador",
        description: "Gastou mais de 500 BRTS na loja",
        icon: "💰",
        earnedAt: "2024-05-10",
      },
      {
        id: "collector",
        name: "Colecionador",
        description: "Comprou 5 produtos diferentes",
        icon: "📦",
        earnedAt: "2024-06-22",
      },
    ],
    tags: ["colaborador", "reviewer"],
    createdAt: "2024-02-18T13:00:00Z",
    updatedAt: "2024-11-28T09:30:00Z",
    lastPurchaseAt: "2024-11-26T11:15:00Z",
  },
  {
    id: "spree_user_7",
    email: "ricardo.alves@empresa.com.br",
    firstName: "Ricardo",
    lastName: "Alves",
    phone: "(85) 99999-7777",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ricardo",
    address: {
      address1: "Av. Ipiranga, 1200",
      city: "Porto Alegre",
      stateCode: "RS",
      zipcode: "90160-090",
      country: "BR",
    },
    brents: 6500,
    level: "gold",
    totalPurchases: 15,
    totalSpent: 1780.0,
    totalBrentsEarned: 7200,
    totalBrentsSpent: 700,
    achievements: [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realizou a primeira compra na loja",
        icon: "🛒",
        earnedAt: "2024-01-28",
      },
      { id: "loyal", name: "Cliente Fiel", description: "Realizou 10 compras", icon: "⭐", earnedAt: "2024-06-15" },
      {
        id: "brents_master",
        name: "Mestre dos BRENTS",
        description: "Acumulou 5000 BRENTS",
        icon: "🏆",
        earnedAt: "2024-08-01",
      },
    ],
    tags: ["premium", "embaixador"],
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-12-01T15:00:00Z",
    lastPurchaseAt: "2024-11-29T16:00:00Z",
  },
  {
    id: "spree_user_8",
    email: "juliana.rocha@empresa.com.br",
    firstName: "Juliana",
    lastName: "Rocha",
    phone: "(61) 99999-8888",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juliana",
    address: {
      address1: "Av. Tancredo Neves, 620",
      city: "Salvador",
      stateCode: "BA",
      zipcode: "41820-020",
      country: "BR",
    },
    brents: 2100,
    level: "silver",
    totalPurchases: 6,
    totalSpent: 720.0,
    totalBrentsEarned: 2500,
    totalBrentsSpent: 400,
    achievements: [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realizou a primeira compra na loja",
        icon: "🛒",
        earnedAt: "2024-03-15",
      },
      {
        id: "big_spender",
        name: "Grande Gastador",
        description: "Gastou mais de 500 BRTS na loja",
        icon: "💰",
        earnedAt: "2024-07-20",
      },
    ],
    tags: ["colaborador"],
    createdAt: "2024-03-12T09:00:00Z",
    updatedAt: "2024-11-25T14:00:00Z",
    lastPurchaseAt: "2024-11-22T10:30:00Z",
  },
]

const initialProducts: Product[] = [
  {
    id: "spree_product_1",
    name: "Smartphone Pro 5G",
    description: "Smartphone 5G com tela AMOLED 6.7 polegadas, 256GB de armazenamento",
    slug: "smartphone-pro-5g",
    sku: "SMART-5G-256",
    price: 2499.9,
    compareAtPrice: 2999.9,
    priceInBrents: 25000,
    images: ["/smartphone-moderno-preto.jpg"],
    stock: 45,
    category: "Eletrônicos",
    tags: ["destaque", "novo", "5g"],
    available: true,
    active: true,
    totalSold: 89,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "spree_product_2",
    name: "Notebook Ultra 15",
    description: "Notebook profissional com processador i7, 16GB RAM, SSD 512GB",
    slug: "notebook-ultra-15",
    sku: "NOTE-ULTRA-15",
    price: 3899.9,
    priceInBrents: 39000,
    images: ["/notebook-profissional-prata.jpg"],
    stock: 28,
    category: "Eletrônicos",
    tags: ["premium", "trabalho"],
    available: true,
    active: true,
    totalSold: 67,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
  },
  {
    id: "spree_product_3",
    name: "Tablet Pro 11",
    description: "Tablet com tela 11 polegadas, 128GB, caneta stylus incluída",
    slug: "tablet-pro-11",
    sku: "TAB-PRO-11",
    price: 1899.9,
    compareAtPrice: 2199.9,
    priceInBrents: 19000,
    images: ["/tablet-preto-caneta.jpg"],
    stock: 52,
    category: "Eletrônicos",
    tags: ["destaque", "criativo"],
    available: true,
    active: true,
    totalSold: 134,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-02T00:00:00Z",
  },
  {
    id: "spree_product_4",
    name: "Fone Bluetooth Premium",
    description: "Fone de ouvido bluetooth com cancelamento de ruído ativo, 30h de bateria",
    slug: "fone-bluetooth-premium",
    sku: "FONE-BT-ANC",
    price: 499.9,
    priceInBrents: 5000,
    images: ["/fone-ouvido-bluetooth-preto.jpg"],
    stock: 156,
    category: "Acessórios",
    tags: ["bestseller", "audio"],
    available: true,
    active: true,
    totalSold: 312,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-30T00:00:00Z",
  },
  {
    id: "spree_product_5",
    name: "Smartwatch Fitness Pro",
    description: "Relógio inteligente com GPS, monitor cardíaco e 50 modos esportivos",
    slug: "smartwatch-fitness-pro",
    sku: "WATCH-FIT-PRO",
    price: 899.9,
    priceInBrents: 9000,
    images: ["/smartwatch-esportivo-preto.jpg"],
    stock: 78,
    category: "Wearables",
    tags: ["fitness", "saude"],
    available: true,
    active: true,
    totalSold: 189,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-29T00:00:00Z",
  },
  {
    id: "spree_product_6",
    name: "Mouse Gamer RGB",
    description: "Mouse gamer com 7 botões programáveis, sensor óptico 12000 DPI",
    slug: "mouse-gamer-rgb",
    sku: "MOUSE-GAME-RGB",
    price: 189.9,
    priceInBrents: 1900,
    images: ["/mouse-gamer-rgb-preto.jpg"],
    stock: 124,
    category: "Periféricos",
    tags: ["gamer", "rgb"],
    available: true,
    active: true,
    totalSold: 245,
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
  },
  {
    id: "spree_product_7",
    name: "Teclado Mecânico RGB",
    description: "Teclado mecânico com switches blue, iluminação RGB personalizável",
    slug: "teclado-mecanico-rgb",
    sku: "KEYB-MECH-RGB",
    price: 349.9,
    priceInBrents: 3500,
    images: ["/teclado-mecanico-rgb.jpg"],
    stock: 92,
    category: "Periféricos",
    tags: ["gamer", "mecanico"],
    available: true,
    active: true,
    totalSold: 178,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "spree_product_8",
    name: "Webcam Full HD Pro",
    description: "Webcam 1080p 60fps com microfone duplo e foco automático",
    slug: "webcam-full-hd-pro",
    sku: "CAM-FHD-PRO",
    price: 449.9,
    priceInBrents: 4500,
    images: ["/webcam-profissional-preta.jpg"],
    stock: 67,
    category: "Periféricos",
    tags: ["home-office", "streaming"],
    available: true,
    active: true,
    totalSold: 156,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-11-25T00:00:00Z",
  },
  {
    id: "spree_product_9",
    name: "Power Bank 20000mAh",
    description: "Bateria externa 20000mAh com carregamento rápido e 3 portas USB",
    slug: "power-bank-20000",
    sku: "PWR-20K-USB3",
    price: 149.9,
    priceInBrents: 1500,
    images: ["/power-bank-preto.jpg"],
    stock: 203,
    category: "Acessórios",
    tags: ["portatil", "carregamento"],
    available: true,
    active: true,
    totalSold: 289,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-11-30T00:00:00Z",
  },
  {
    id: "spree_product_10",
    name: "SSD Externo 1TB",
    description: "SSD portátil 1TB USB 3.2 com velocidade de leitura 1000MB/s",
    slug: "ssd-externo-1tb",
    sku: "SSD-EXT-1TB",
    price: 599.9,
    priceInBrents: 6000,
    images: ["/ssd-externo-compacto.jpg"],
    stock: 85,
    category: "Armazenamento",
    tags: ["armazenamento", "velocidade"],
    available: true,
    active: true,
    totalSold: 134,
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
  },
]

const initialOrders: Order[] = [
  {
    id: "spree_order_1",
    number: "YOO-0001",
    state: "complete",
    itemTotal: 179.8,
    shipmentTotal: 15.0,
    total: 194.8,
    paymentState: "paid",
    shipmentState: "delivered",
    userId: "spree_user_1",
    email: "joao.silva@empresa.com.br",
    lineItems: [
      {
        id: "li_1",
        productId: "spree_product_1",
        name: "Camiseta Corporate Premium",
        sku: "CAM-CORP-001",
        quantity: 2,
        price: 89.9,
        total: 179.8,
      },
    ],
    shipAddress: {
      firstname: "João",
      lastname: "Silva",
      address1: "Rua das Flores, 123",
      address2: "Apto 45",
      city: "São Paulo",
      stateCode: "SP",
      zipcode: "01234-567",
      phone: "(11) 99999-1111",
    },
    trackingNumber: "BR123456789BR",
    trackingUrl: "https://rastreamento.correios.com.br/app/index.php",
    carrier: "Correios",
    completedAt: "2024-11-15T14:30:00Z",
    shippedAt: "2024-11-16T09:00:00Z",
    deliveredAt: "2024-11-20T15:30:00Z",
    brentsEarned: 195,
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2024-11-20T15:30:00Z",
  },
  {
    id: "spree_order_2",
    number: "YOO-0002",
    state: "complete",
    itemTotal: 189.9,
    shipmentTotal: 20.0,
    total: 209.9,
    paymentState: "paid",
    shipmentState: "shipped",
    userId: "spree_user_2",
    email: "maria.santos@empresa.com.br",
    lineItems: [
      {
        id: "li_2",
        productId: "spree_product_4",
        name: "Mochila Executive Pro",
        sku: "MOC-EXEC-001",
        quantity: 1,
        price: 189.9,
        total: 189.9,
      },
    ],
    shipAddress: {
      firstname: "Maria",
      lastname: "Santos",
      address1: "Av. Paulista, 1000",
      address2: "Conj 501",
      city: "São Paulo",
      stateCode: "SP",
      zipcode: "01310-100",
      phone: "(11) 99999-2222",
    },
    trackingNumber: "JD987654321BR",
    trackingUrl: "https://jadlog.com.br/tracking",
    carrier: "Jadlog",
    completedAt: "2024-11-20T16:00:00Z",
    shippedAt: "2024-11-21T10:00:00Z",
    brentsEarned: 210,
    createdAt: "2024-11-20T14:00:00Z",
    updatedAt: "2024-11-21T10:00:00Z",
  },
  {
    id: "spree_order_3",
    number: "YOO-0003",
    state: "complete",
    itemTotal: 179.7,
    shipmentTotal: 12.0,
    total: 191.7,
    paymentState: "paid",
    shipmentState: "pending",
    userId: "spree_user_3",
    email: "pedro.costa@empresa.com.br",
    lineItems: [
      {
        id: "li_3",
        productId: "spree_product_2",
        name: "Boné Trucker Style",
        sku: "BON-TRUC-001",
        quantity: 3,
        price: 59.9,
        total: 179.7,
      },
    ],
    shipAddress: {
      firstname: "Pedro",
      lastname: "Costa",
      address1: "Rua do Catete, 500",
      address2: "Casa 2",
      city: "Rio de Janeiro",
      stateCode: "RJ",
      zipcode: "22220-000",
      phone: "(21) 99999-3333",
    },
    trackingNumber: "BR555666777BR",
    trackingUrl: "https://rastreamento.correios.com.br/app/index.php",
    carrier: "Correios",
    completedAt: "2024-11-25T11:00:00Z",
    brentsEarned: 192,
    createdAt: "2024-11-25T09:00:00Z",
    updatedAt: "2024-11-25T11:00:00Z",
  },
  {
    id: "spree_order_4",
    number: "YOO-0004",
    state: "confirm",
    itemTotal: 159.8,
    shipmentTotal: 18.0,
    total: 177.8,
    paymentState: "balance_due",
    userId: "spree_user_4",
    email: "ana.oliveira@empresa.com.br",
    lineItems: [
      {
        id: "li_4",
        productId: "spree_product_5",
        name: "Garrafa Térmica Eco 500ml",
        sku: "GAR-ECO-001",
        quantity: 2,
        price: 79.9,
        total: 159.8,
      },
    ],
    shipAddress: {
      firstname: "Ana",
      lastname: "Oliveira",
      address1: "Rua Oscar Freire, 200",
      address2: "Sala 1502",
      city: "São Paulo",
      stateCode: "SP",
      zipcode: "01426-000",
      phone: "(11) 99999-4444",
    },
    trackingNumber: "",
    trackingUrl: "",
    carrier: "Aguardando pagamento",
    createdAt: "2024-11-28T16:00:00Z",
    updatedAt: "2024-11-28T16:00:00Z",
  },
  {
    id: "spree_order_5",
    number: "YOO-0005",
    state: "complete",
    itemTotal: 269.7,
    shipmentTotal: 0,
    total: 269.7,
    paymentState: "paid",
    shipmentState: "delivered",
    userId: "spree_user_4",
    email: "ana.oliveira@empresa.com.br",
    lineItems: [
      {
        id: "li_5a",
        productId: "spree_product_1",
        name: "Camiseta Corporate Premium",
        sku: "CAM-CORP-001",
        quantity: 1,
        price: 89.9,
        total: 89.9,
      },
      {
        id: "li_5b",
        productId: "spree_product_3",
        name: "Caneca Térmica Premium",
        sku: "CAN-TERM-001",
        quantity: 2,
        price: 49.9,
        total: 99.8,
      },
      {
        id: "li_5c",
        productId: "spree_product_5",
        name: "Garrafa Térmica Eco 500ml",
        sku: "GAR-ECO-001",
        quantity: 1,
        price: 79.9,
        total: 79.9,
      },
    ],
    shipAddress: {
      firstname: "Ana",
      lastname: "Oliveira",
      address1: "Rua Oscar Freire, 200",
      address2: "Sala 1502",
      city: "São Paulo",
      stateCode: "SP",
      zipcode: "01426-000",
      phone: "(11) 99999-4444",
    },
    trackingNumber: "ME123789456BR",
    trackingUrl: "https://mercadolivre.com.br/tracking",
    carrier: "Mercado Envios",
    completedAt: "2024-10-15T10:00:00Z",
    shippedAt: "2024-10-16T08:00:00Z",
    deliveredAt: "2024-10-19T14:00:00Z",
    paidWithBrents: 500,
    brentsEarned: 270,
    createdAt: "2024-10-15T09:00:00Z",
    updatedAt: "2024-10-19T14:00:00Z",
  },
  {
    id: "spree_order_6",
    number: "YOO-0006",
    state: "canceled",
    itemTotal: 129.9,
    shipmentTotal: 15.0,
    total: 144.9,
    paymentState: "void",
    userId: "spree_user_5",
    email: "carlos.ferreira@empresa.com.br",
    lineItems: [
      {
        id: "li_6",
        productId: "spree_product_6",
        name: "Polo Corporate Piquet",
        sku: "POL-CORP-001",
        quantity: 1,
        price: 129.9,
        total: 129.9,
      },
    ],
    shipAddress: {
      firstname: "Carlos",
      lastname: "Ferreira",
      address1: "Av. Afonso Pena, 1500",
      address2: "",
      city: "Belo Horizonte",
      stateCode: "MG",
      zipcode: "30130-002",
      phone: "(31) 99999-5555",
    },
    trackingNumber: "",
    trackingUrl: "",
    carrier: "Pedido cancelado",
    canceledAt: "2024-09-20T12:00:00Z",
    createdAt: "2024-09-18T14:00:00Z",
    updatedAt: "2024-09-20T12:00:00Z",
  },
  {
    id: "spree_order_7",
    number: "YOO-0007",
    state: "complete",
    itemTotal: 319.7,
    shipmentTotal: 0,
    total: 319.7,
    paymentState: "paid",
    shipmentState: "delivered",
    userId: "spree_user_6",
    email: "fernanda.lima@empresa.com.br",
    lineItems: [
      {
        id: "li_7a",
        productId: "spree_product_4",
        name: "Mochila Executive Pro",
        sku: "MOC-EXEC-001",
        quantity: 1,
        price: 189.9,
        total: 189.9,
      },
      {
        id: "li_7b",
        productId: "spree_product_6",
        name: "Polo Corporate Piquet",
        sku: "POL-CORP-001",
        quantity: 1,
        price: 129.9,
        total: 129.9,
      },
    ],
    shipAddress: {
      firstname: "Fernanda",
      lastname: "Lima",
      address1: "Rua XV de Novembro, 800",
      address2: "Apto 301",
      city: "Curitiba",
      stateCode: "PR",
      zipcode: "80020-310",
      phone: "(41) 99999-6666",
    },
    trackingNumber: "BR888999000BR",
    trackingUrl: "https://rastreamento.correios.com.br/app/index.php",
    carrier: "Correios",
    completedAt: "2024-08-10T15:00:00Z",
    shippedAt: "2024-08-11T09:00:00Z",
    deliveredAt: "2024-08-14T16:30:00Z",
    paidWithBrents: 300,
    brentsEarned: 320,
    createdAt: "2024-08-10T13:00:00Z",
    updatedAt: "2024-08-14T16:30:00Z",
  },
  {
    id: "spree_order_8",
    number: "YOO-0008",
    state: "complete",
    itemTotal: 249.9,
    shipmentTotal: 25.0,
    total: 274.9,
    paymentState: "paid",
    shipmentState: "shipped",
    userId: "spree_user_7",
    email: "ricardo.alves@empresa.com.br",
    lineItems: [
      {
        id: "li_8",
        productId: "spree_product_8",
        name: "Jaqueta Windbreaker Pro",
        sku: "JAQ-WIND-001",
        quantity: 1,
        price: 249.9,
        total: 249.9,
      },
    ],
    shipAddress: {
      firstname: "Ricardo",
      lastname: "Alves",
      address1: "Av. Ipiranga, 1200",
      city: "Porto Alegre",
      stateCode: "RS",
      zipcode: "90160-090",
      phone: "(51) 99999-7777",
    },
    trackingNumber: "SE789456123BR",
    trackingUrl: "https://sequoialogistica.com.br/rastreamento",
    carrier: "Sequoia",
    completedAt: "2024-11-29T15:00:00Z",
    shippedAt: "2024-11-30T08:00:00Z",
    brentsEarned: 275,
    createdAt: "2024-11-29T14:00:00Z",
    updatedAt: "2024-11-30T08:00:00Z",
  },
  {
    id: "spree_order_9",
    number: "YOO-0009",
    state: "complete",
    itemTotal: 169.7,
    shipmentTotal: 12.0,
    total: 181.7,
    paymentState: "paid",
    shipmentState: "ready",
    userId: "spree_user_8",
    email: "juliana.rocha@empresa.com.br",
    lineItems: [
      {
        id: "li_9a",
        productId: "spree_product_7",
        name: "Caderno Executivo A5",
        sku: "CAD-EXEC-001",
        quantity: 2,
        price: 39.9,
        total: 79.8,
      },
      {
        id: "li_9b",
        productId: "spree_product_9",
        name: "Kit Escritório Completo",
        sku: "KIT-ESCR-001",
        quantity: 1,
        price: 69.9,
        total: 69.9,
      },
    ],
    shipAddress: {
      firstname: "Juliana",
      lastname: "Rocha",
      address1: "Av. Tancredo Neves, 620",
      city: "Salvador",
      stateCode: "BA",
      zipcode: "41820-020",
      phone: "(71) 99999-8888",
    },
    completedAt: "2024-12-01T11:00:00Z",
    brentsEarned: 182,
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T11:00:00Z",
  },
  {
    id: "spree_order_10",
    number: "YOO-0010",
    state: "payment",
    itemTotal: 119.8,
    shipmentTotal: 15.0,
    total: 134.8,
    paymentState: "balance_due",
    userId: "spree_user_2",
    email: "maria.santos@empresa.com.br",
    lineItems: [
      {
        id: "li_10a",
        productId: "spree_product_2",
        name: "Boné Trucker Style",
        sku: "BON-TRUC-001",
        quantity: 1,
        price: 59.9,
        total: 59.9,
      },
      {
        id: "li_10b",
        productId: "spree_product_10",
        name: "Mousepad Gamer XL",
        sku: "MOU-GAME-001",
        quantity: 1,
        price: 59.9,
        total: 59.9,
      },
    ],
    shipAddress: {
      firstname: "Maria",
      lastname: "Santos",
      address1: "Av. Paulista, 1000",
      address2: "Conj 501",
      city: "São Paulo",
      stateCode: "SP",
      zipcode: "01310-100",
      phone: "(11) 99999-2222",
    },
    createdAt: "2024-12-02T18:00:00Z",
    updatedAt: "2024-12-02T18:00:00Z",
  },
]

const initialTransactions: BrentTransaction[] = [
  {
    id: "tx_1",
    userId: "spree_user_1",
    type: "credit",
    amount: 500,
    description: "Bônus de boas-vindas",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "tx_2",
    userId: "spree_user_1",
    type: "credit",
    amount: 1000,
    description: "Meta trimestral Q1 atingida",
    createdAt: "2024-03-31T18:00:00Z",
  },
  {
    id: "tx_3",
    userId: "spree_user_1",
    type: "credit",
    amount: 195,
    description: "Cashback pedido #YOO-0001",
    orderNumber: "YOO-0001",
    createdAt: "2024-11-20T15:30:00Z",
  },
  {
    id: "tx_4",
    userId: "spree_user_1",
    type: "debit",
    amount: 900,
    description: "Resgate: Camiseta Corporate Premium",
    createdAt: "2024-08-10T14:00:00Z",
  },
  {
    id: "tx_5",
    userId: "spree_user_2",
    type: "credit",
    amount: 500,
    description: "Bônus de boas-vindas",
    createdAt: "2024-02-10T09:30:00Z",
  },
  {
    id: "tx_6",
    userId: "spree_user_2",
    type: "credit",
    amount: 2000,
    description: "Programa de indicação - 3 amigos",
    createdAt: "2024-04-15T16:00:00Z",
  },
  {
    id: "tx_7",
    userId: "spree_user_2",
    type: "credit",
    amount: 210,
    description: "Cashback pedido #YOO-0002",
    orderNumber: "YOO-0002",
    createdAt: "2024-11-21T10:00:00Z",
  },
  {
    id: "tx_8",
    userId: "spree_user_3",
    type: "credit",
    amount: 500,
    description: "Bônus de boas-vindas",
    createdAt: "2024-03-05T14:00:00Z",
  },
  {
    id: "tx_9",
    userId: "spree_user_3",
    type: "credit",
    amount: 192,
    description: "Cashback pedido #YOO-0003",
    orderNumber: "YOO-0003",
    createdAt: "2024-11-25T11:00:00Z",
  },
  {
    id: "tx_10",
    userId: "spree_user_4",
    type: "credit",
    amount: 500,
    description: "Bônus de boas-vindas",
    createdAt: "2024-01-20T08:00:00Z",
  },
  {
    id: "tx_11",
    userId: "spree_user_4",
    type: "credit",
    amount: 3000,
    description: "Projeto YOO Innovation concluído",
    createdAt: "2024-02-28T17:00:00Z",
  },
  {
    id: "tx_12",
    userId: "spree_user_4",
    type: "credit",
    amount: 1500,
    description: "Programa Embaixador - indicações",
    createdAt: "2024-05-15T12:00:00Z",
  },
  {
    id: "tx_13",
    userId: "spree_user_4",
    type: "debit",
    amount: 500,
    description: "Desconto no pedido #YOO-0005",
    orderNumber: "YOO-0005",
    createdAt: "2024-10-15T09:00:00Z",
  },
  {
    id: "tx_14",
    userId: "spree_user_4",
    type: "credit",
    amount: 270,
    description: "Cashback pedido #YOO-0005",
    orderNumber: "YOO-0005",
    createdAt: "2024-10-19T14:00:00Z",
  },
  {
    id: "tx_15",
    userId: "spree_user_5",
    type: "credit",
    amount: 500,
    description: "Bônus de boas-vindas",
    createdAt: "2024-04-01T11:00:00Z",
  },
  {
    id: "tx_16",
    userId: "spree_user_6",
    type: "credit",
    amount: 500,
    description: "Bônus de boas-vindas",
    createdAt: "2024-02-18T13:00:00Z",
  },
  {
    id: "tx_17",
    userId: "spree_user_6",
    type: "credit",
    amount: 320,
    description: "Cashback pedido #YOO-0007",
    orderNumber: "YOO-0007",
    createdAt: "2024-11-14T16:00:00Z",
  },
  {
    id: "tx_18",
    userId: "spree_user_7",
    type: "credit",
    amount: 500,
    description: "Bônus de boas-vindas",
    createdAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "tx_19",
    userId: "spree_user_7",
    type: "credit",
    amount: 2000,
    description: "Meta anual de vendas atingida",
    createdAt: "2024-06-30T18:00:00Z",
  },
  {
    id: "tx_20",
    userId: "spree_user_7",
    type: "credit",
    amount: 275,
    description: "Cashback pedido #YOO-0008",
    orderNumber: "YOO-0008",
    createdAt: "2024-11-30T08:00:00Z",
  },
  {
    id: "tx_21",
    userId: "spree_user_8",
    type: "credit",
    amount: 500,
    description: "Bônus de boas-vindas",
    createdAt: "2024-03-12T09:00:00Z",
  },
  {
    id: "tx_22",
    userId: "spree_user_8",
    type: "credit",
    amount: 182,
    description: "Cashback pedido #YOO-0009",
    orderNumber: "YOO-0009",
    createdAt: "2024-12-01T11:00:00Z",
  },
]

const initialTags: string[] = [
  "destaque",
  "novo",
  "popular",
  "premium",
  "eco",
  "vip",
  "colaborador",
  "embaixador",
  "promocao",
  "limitado",
  "bestseller",
  "casual",
  "executivo",
  "sustentavel",
  "outdoor",
  "kit",
  "presente",
  "gamer",
  "tech",
  "formal",
  "early_adopter",
  "influencer",
  "reviewer",
]

// ===========================================
// FUNÇÕES DE STORAGE - USUÁRIOS
// ===========================================

export function getUsers(): User[] {
  if (typeof window === "undefined") return initialUsers
  const stored = localStorage.getItem("prio_users_v2")
  if (!stored) {
    localStorage.setItem("prio_users_v2", JSON.stringify(initialUsers))
    return initialUsers
  }
  return JSON.parse(stored)
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("prio_users_v2", JSON.stringify(users))
}

export function getUserById(id: string): User | undefined {
  const users = getUsers()
  return users.find((u) => u.id === id)
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null

  users[index] = {
    ...users[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveUsers(users)
  return users[index]
}

/**
 * Calcula o nível do usuário baseado nos BRENTS totais ganhos
 */
export function calculateUserLevel(totalBrentsEarned: number): UserLevel {
  if (totalBrentsEarned >= 50000) return "diamond"
  if (totalBrentsEarned >= 15000) return "platinum"
  if (totalBrentsEarned >= 5000) return "gold"
  if (totalBrentsEarned >= 1000) return "silver"
  return "bronze"
}

/**
 * Retorna estatísticas de gamificação dos usuários
 */
export function getUserGamificationStats() {
  const users = getUsers()
  const levelCounts: Record<UserLevel, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    diamond: 0,
  }

  let totalBrents = 0
  let totalPurchases = 0
  let totalSpent = 0

  users.forEach((user) => {
    levelCounts[user.level]++
    totalBrents += user.brents
    totalPurchases += user.totalPurchases
    totalSpent += user.totalSpent
  })

  const topUsers = [...users].sort((a, b) => b.brents - a.brents).slice(0, 5)

  const mostActive = [...users].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 5)

  return {
    levelCounts,
    totalBrents,
    totalPurchases,
    totalSpent,
    averageBrents: users.length > 0 ? Math.round(totalBrents / users.length) : 0,
    topUsers,
    mostActive,
  }
}

// ===========================================
// FUNÇÕES DE STORAGE - PRODUTOS
// ===========================================

export function getProducts(): Product[] {
  if (typeof window === "undefined") return initialProducts
  const stored = localStorage.getItem("prio_products_v2")
  if (!stored) {
    localStorage.setItem("prio_products_v2", JSON.stringify(initialProducts))
    return initialProducts
  }
  return JSON.parse(stored)
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("prio_products_v2", JSON.stringify(products))
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts()
  return products.find((p) => p.id === id)
}

export function updateProduct(id: string, data: Partial<Product>): Product | null {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveProducts(products)
  return products[index]
}

/**
 * Retorna estatísticas dos produtos
 */
export function getProductStats() {
  const products = getProducts()

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.active).length
  const outOfStock = products.filter((p) => p.stock === 0).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length
  const totalSold = products.reduce((acc, p) => acc + (p.totalSold ?? 0), 0)
  const totalRevenue = products.reduce((acc, p) => acc + (p.totalSold ?? 0) * p.price, 0)

  const topSelling = [...products].sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0)).slice(0, 5)

  const categories = products.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalProducts,
    activeProducts,
    outOfStock,
    lowStock,
    totalSold,
    totalRevenue,
    topSelling,
    categories,
  }
}

// ===========================================
// FUNÇÕES DE STORAGE - PEDIDOS
// ===========================================

export function getOrders(): Order[] {
  if (typeof window === "undefined") return initialOrders
  const stored = localStorage.getItem("prio_orders_v2")
  if (!stored) {
    localStorage.setItem("prio_orders_v2", JSON.stringify(initialOrders))
    return initialOrders
  }
  return JSON.parse(stored)
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("prio_orders_v2", JSON.stringify(orders))
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find((o) => o.id === id)
}

export function updateOrder(id: string, data: Partial<Order>): Order | null {
  const orders = getOrders()
  const index = orders.findIndex((o) => o.id === id)
  if (index === -1) return null

  orders[index] = {
    ...orders[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveOrders(orders)
  return orders[index]
}

export function updateOrderState(id: string, state: OrderState): Order | null {
  return updateOrder(id, { state })
}

// ADDED: Adding updateOrderStatus function as alias for updateOrderState
export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const updates: Partial<Order> = { state: status }

  // Update timestamps based on status
  if (status === "canceled") {
    updates.canceledAt = new Date().toISOString()
  } else if (status === "complete") {
    updates.completedAt = new Date().toISOString()
  }

  return updateOrder(id, updates)
}

export function updateShipmentState(id: string, shipmentState: ShipmentState): Order | null {
  const updates: Partial<Order> = { shipmentState }

  if (shipmentState === "shipped") {
    updates.shippedAt = new Date().toISOString()
  } else if (shipmentState === "delivered") {
    updates.deliveredAt = new Date().toISOString()
  }

  return updateOrder(id, updates)
}

/**
 * Retorna estatísticas dos pedidos
 */
export function getOrderStats() {
  const orders = getOrders()

  const stateCounts: Record<string, number> = {}
  const shipmentCounts: Record<string, number> = {}

  let totalRevenue = 0
  let totalBrentsEarned = 0
  let totalBrentsSpent = 0

  orders.forEach((order) => {
    stateCounts[order.state] = (stateCounts[order.state] || 0) + 1
    if (order.shipmentState) {
      shipmentCounts[order.shipmentState] = (shipmentCounts[order.shipmentState] || 0) + 1
    }
    if (order.state === "complete") {
      totalRevenue += order.total
      totalBrentsEarned += order.brentsEarned || 0
      totalBrentsSpent += order.paidWithBrents || 0
    }
  })

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  const completeOrders = orders.filter((o) => o.state === "complete")
  const averageOrderValue = completeOrders.length > 0 ? totalRevenue / completeOrders.length : 0

  return {
    total: orders.length,
    stateCounts,
    shipmentCounts,
    totalRevenue,
    totalBrentsEarned,
    totalBrentsSpent,
    averageOrderValue: Number.isNaN(averageOrderValue) ? 0 : averageOrderValue,
    recentOrders,
  }
}

/**
 * Retorna pedidos de um usuário específico
 */
export function getUserOrders(userId: string): Order[] {
  const orders = getOrders()
  return orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// ===========================================
// FUNÇÕES DE STORAGE - TRANSAÇÕES BRENTS
// ===========================================

export function getTransactions(): BrentTransaction[] {
  if (typeof window === "undefined") return initialTransactions
  const stored = localStorage.getItem("prio_transactions_v2")
  if (!stored) {
    localStorage.setItem("prio_transactions_v2", JSON.stringify(initialTransactions))
    return initialTransactions
  }
  return JSON.parse(stored)
}

export function saveTransactions(transactions: BrentTransaction[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("prio_transactions_v2", JSON.stringify(transactions))
}

export function getUserTransactions(userId: string): BrentTransaction[] {
  const transactions = getTransactions()
  return transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addBrents(userId: string, amount: number, description: string, orderNumber?: string): void {
  const users = getUsers()
  const transactions = getTransactions()

  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return

  users[userIndex].brents += amount
  users[userIndex].totalBrentsEarned += amount
  users[userIndex].level = calculateUserLevel(users[userIndex].totalBrentsEarned)
  users[userIndex].updatedAt = new Date().toISOString()
  saveUsers(users)

  const newTransaction: BrentTransaction = {
    id: `tx_${Date.now()}`,
    userId,
    type: "credit",
    amount,
    description,
    orderNumber,
    createdAt: new Date().toISOString(),
  }
  transactions.push(newTransaction)
  saveTransactions(transactions)
}

export function deductBrents(userId: string, amount: number, description: string, orderNumber?: string): boolean {
  const users = getUsers()
  const transactions = getTransactions()

  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return false

  if (users[userIndex].brents < amount) return false

  users[userIndex].brents -= amount
  users[userIndex].totalBrentsSpent += amount
  users[userIndex].updatedAt = new Date().toISOString()
  saveUsers(users)

  const newTransaction: BrentTransaction = {
    id: `tx_${Date.now()}`,
    userId,
    type: "debit",
    amount,
    description,
    orderNumber,
    createdAt: new Date().toISOString(),
  }
  transactions.push(newTransaction)
  saveTransactions(transactions)

  return true
}

// ===========================================
// FUNÇÕES DE STORAGE - TAGS
// ===========================================

export function getTags(): string[] {
  if (typeof window === "undefined") return initialTags
  const stored = localStorage.getItem("prio_tags_v2")
  if (!stored) {
    localStorage.setItem("prio_tags_v2", JSON.stringify(initialTags))
    return initialTags
  }
  return JSON.parse(stored)
}

export function saveTags(tags: string[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("prio_tags_v2", JSON.stringify(tags))
}

export function addTag(tag: string): void {
  const tags = getTags()
  if (!tags.includes(tag.toLowerCase())) {
    tags.push(tag.toLowerCase())
    saveTags(tags)
  }
}

export function removeTag(tag: string): void {
  const tags = getTags()
  const index = tags.indexOf(tag.toLowerCase())
  if (index > -1) {
    tags.splice(index, 1)
    saveTags(tags)
  }
}

export function addTagToUser(userId: string, tag: string): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) return

  if (!users[index].tags.includes(tag.toLowerCase())) {
    users[index].tags.push(tag.toLowerCase())
    users[index].updatedAt = new Date().toISOString()
    saveUsers(users)
  }
  addTag(tag)
}

export function removeTagFromUser(userId: string, tag: string): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === userId)
  if (index === -1) return

  const tagIndex = users[index].tags.indexOf(tag.toLowerCase())
  if (tagIndex > -1) {
    users[index].tags.splice(tagIndex, 1)
    users[index].updatedAt = new Date().toISOString()
    saveUsers(users)
  }
}

export function addTagToProduct(productId: string, tag: string): void {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === productId)
  if (index === -1) return

  if (!products[index].tags.includes(tag.toLowerCase())) {
    products[index].tags.push(tag.toLowerCase())
    products[index].updatedAt = new Date().toISOString()
    saveProducts(products)
  }
  addTag(tag)
}

export function removeTagFromProduct(productId: string, tag: string): void {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === productId)
  if (index === -1) return

  const tagIndex = products[index].tags.indexOf(tag.toLowerCase())
  if (tagIndex > -1) {
    products[index].tags.splice(tagIndex, 1)
    products[index].updatedAt = new Date().toISOString()
    saveProducts(products)
  }
}

// ===========================================
// UTILITÁRIOS DE FORMATAÇÃO
// ===========================================

export const ORDER_STATE_LABELS: Record<OrderState, string> = {
  cart: "Carrinho",
  address: "Endereço",
  delivery: "Entrega",
  payment: "Pagamento",
  confirm: "Confirmação",
  complete: "Completo",
  canceled: "Cancelado",
  returned: "Devolvido",
}

export const SHIPMENT_STATE_LABELS: Record<ShipmentState, string> = {
  pending: "Pendente",
  ready: "Pronto",
  shipped: "Enviado",
  delivered: "Entregue",
  canceled: "Cancelado",
}

export const ORDER_STATE_COLORS: Record<OrderState, string> = {
  cart: "bg-gray-100 text-gray-800",
  address: "bg-gray-100 text-gray-800",
  delivery: "bg-blue-100 text-blue-800",
  payment: "bg-yellow-100 text-yellow-800",
  confirm: "bg-purple-100 text-purple-800",
  complete: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
  returned: "bg-orange-100 text-orange-800",
}

export const SHIPMENT_STATE_COLORS: Record<ShipmentState, string> = {
  pending: "bg-gray-100 text-gray-800",
  ready: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
}

export const LEVEL_COLORS: Record<UserLevel, string> = {
  bronze: "bg-amber-100 text-amber-800 border-amber-300",
  silver: "bg-gray-100 text-gray-800 border-gray-300",
  gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  platinum: "bg-slate-100 text-slate-800 border-slate-300",
  diamond: "bg-cyan-100 text-cyan-800 border-cyan-300",
}
