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
// TYPE DECLARATIONS
// ===========================================

declare global {
  // eslint-disable-next-line no-var
  var __demoLocalStorage: Map<string, string> | undefined
}

// ===========================================
// INTERFACES - BASEADAS NO SPREE COMMERCE 5
// ===========================================

/**
 * Interface de endereço baseada em Spree::Address
 */
export interface Address {
  address1: string
  address2?: string
  city: string
  stateCode: string
  zipcode: string
  country: string
  phone?: string
}

/**
 * Interface de endereço salvo pelo usuário (com metadados adicionais)
 */
export interface SavedAddress extends Address {
  id: string
  label: string
  isDefault?: boolean
}

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
  // Endereço principal (Spree::Address) - mantido para compatibilidade
  address?: Address
  // Lista de endereços salvos do usuário
  addresses?: SavedAddress[]
  // Campos customizados - Gamificação
  points: number
  level: UserLevel
  totalPurchases: number
  totalSpent: number
  totalPointsEarned: number
  totalPointsSpent: number
  role: import('./roles').UserRole
  achievements: Achievement[]
  // Tags para segmentação na loja
  tags: string[]
  // ID da empresa (tenant)
  companyId?: string
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
 * Transação de Pontos
 */
export interface PointsTransaction {
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
  priceInPoints: number
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
  // Gamificação
  rarity?: "comum" | "incomum" | "raro" | "épico" | "lendário"
  minLevel?: UserLevel
  // Fiscal
  ncm?: string // Nomenclatura Comum do Mercosul (8 dígitos)
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
  // Agendamento (Send Gifts)
  scheduledAt?: string
  isGift?: boolean
  giftMessage?: string
  // Pagamento com Pontos
  paidWithPoints?: number
  paidWithMoney?: number // Valor pago com dinheiro (para calcular cashback)
  pointsEarned?: number
  // Método de pagamento (demo)
  paymentMethod?: "points" | "pix" | "card" | "free"
  demoPaymentId?: string // ID do pagamento demo associado
  // Produtos Digitais (entrega por email)
  isDigitalOnly?: boolean // True se todos os itens são digitais
  digitalDeliveryEmail?: string // Email para entrega de produtos digitais
  digitalDeliveredAt?: string // Data/hora de entrega digital
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
  isDigital?: boolean // True se o item é digital (sem frete, entrega por email)
}

// Estados baseados no Spree
export type OrderState = "cart" | "address" | "delivery" | "payment" | "confirm" | "complete" | "canceled" | "returned" | "scheduled"
export type PaymentState = "balance_due" | "paid" | "credit_owed" | "failed" | "void"
export type ShipmentState = "pending" | "ready" | "shipped" | "delivered" | "canceled"

// ADDED: Adding OrderStatus type alias for compatibility
export type OrderStatus = OrderState

// ===========================================
// DEMO PAYMENT SIMULATION
// ===========================================

/**
 * Tipo de método de pagamento suportado
 */
export type PaymentMethod = "points" | "pix" | "card" | "free"

/**
 * Interface para pagamentos simulados (demo)
 */
export interface DemoPayment {
  id: string
  orderId: string
  orderNumber: string
  method: PaymentMethod
  amount: number
  status: "pending" | "paid" | "failed" | "canceled"
  // Referências PIX
  pixCode?: string
  pixQrCodeData?: string
  // Referências Cartão
  cardLastFour?: string
  cardBrand?: string
  // Timestamps
  createdAt: string
  paidAt?: string
  updatedAt: string
}

// ===========================================
// CONFIGURAÇÕES DE GAMIFICAÇÃO
// ===========================================

export const LEVEL_CONFIG: Record<UserLevel, { minPoints: number; multiplier: number; color: string; label: string }> =
  {
    bronze: { minPoints: 0, multiplier: 1.0, color: "#CD7F32", label: "Bronze" },
    silver: { minPoints: 1000, multiplier: 1.1, color: "#C0C0C0", label: "Prata" },
    gold: { minPoints: 5000, multiplier: 1.25, color: "#FFD700", label: "Ouro" },
    platinum: { minPoints: 15000, multiplier: 1.5, color: "#E5E4E2", label: "Platina" },
    diamond: { minPoints: 50000, multiplier: 2.0, color: "#B9F2FF", label: "Diamante" },
  }

export const ACHIEVEMENTS_CATALOG = [
  { id: "first_purchase", name: "Primeira Compra", description: "Realizou a primeira compra na loja", icon: "🛒" },
  {
    id: "big_spender",
    name: "Grande Gastador",
    description: "Gastou mais de 500 em valor na loja",
    icon: "💰",
  },
  { id: "collector", name: "Colecionador", description: "Comprou 5 produtos diferentes", icon: "📦" },
  { id: "loyal", name: "Cliente Fiel", description: "Realizou 10 compras", icon: "⭐" },
  { id: "points_master", name: "Mestre dos Pontos", description: "Acumulou 5000 pontos", icon: "🏆" },
  { id: "early_adopter", name: "Pioneiro", description: "Um dos primeiros 100 usuários", icon: "🚀" },
  { id: "reviewer", name: "Avaliador", description: "Avaliou 5 produtos", icon: "✍️" },
  { id: "referral", name: "Embaixador", description: "Indicou 3 amigos", icon: "👥" },
]

export interface CorporateAchievementExtended extends Omit<Achievement, 'earnedAt'> {
  category?: string
  corporateLevel?: UserLevel
  teamValue?: number
  requirements?: {
    type: "automatic" | "manual" | "team_based"
    criteria: string
    target?: number
  }
  earnedAt?: string
}

export const CORPORATE_ACHIEVEMENTS_CATALOG: CorporateAchievementExtended[] = [
  {
    id: "team_leader",
    name: "Líder de Equipe",
    description: "Liderou equipe com performance superior a 90%",
    icon: "👥",
    category: "leadership",
    corporateLevel: "gold",
    teamValue: 1000,
    requirements: {
      type: "team_based",
      criteria: "Team performance > 90%",
      target: 90
    }
  },
  {
    id: "innovation_champion",
    name: "Campeão de Inovação",
    description: "Implementou 3 melhorias de processo",
    icon: "💡",
    category: "innovation",
    corporateLevel: "silver",
    teamValue: 750,
    requirements: {
      type: "manual",
      criteria: "3 process improvements",
      target: 3
    }
  },
  {
    id: "mentor_excellence",
    name: "Excelência em Mentoria",
    description: "Mentorou 5 membros para promoção",
    icon: "🎓",
    category: "development",
    corporateLevel: "platinum",
    teamValue: 1500,
    requirements: {
      type: "manual",
      criteria: "5 mentees promoted",
      target: 5
    }
  },
  {
    id: "sales_master",
    name: "Mestre de Vendas",
    description: "Atingiu 125% da meta de vendas",
    icon: "📈",
    category: "performance",
    corporateLevel: "silver",
    teamValue: 800,
    requirements: {
      type: "automatic",
      criteria: "Sales > 125% of target",
      target: 125
    }
  },
  {
    id: "customer_hero",
    name: "Herói do Cliente",
    description: "Alcançou 98% de satisfação",
    icon: "❤️",
    category: "service",
    corporateLevel: "silver",
    teamValue: 600,
    requirements: {
      type: "automatic",
      criteria: "Customer satisfaction ≥ 98%",
      target: 98
    }
  },
  {
    id: "collaboration_star",
    name: "Estrela da Colaboração",
    description: "Participou em 5 projetos interdepartamentais",
    icon: "🤝",
    category: "teamwork",
    corporateLevel: "gold",
    teamValue: 900,
    requirements: {
      type: "manual",
      criteria: "5 cross-departmental projects",
      target: 5
    }
  },
  {
    id: "sustainability_champion",
    name: "Campeão de Sustentabilidade",
    description: "Implementou 3 iniciativas verdes",
    icon: "🌱",
    category: "sustainability",
    corporateLevel: "bronze",
    teamValue: 400,
    requirements: {
      type: "manual",
      criteria: "3 green initiatives",
      target: 3
    }
  },
  {
    id: "learning_master",
    name: "Mestre do Aprendizado",
    description: "Completou 10 certificações",
    icon: "📚",
    category: "development",
    corporateLevel: "gold",
    teamValue: 700,
    requirements: {
      type: "automatic",
      criteria: "10 certifications completed",
      target: 10
    }
  }
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
    points: 4500,
    level: "gold",
    totalPurchases: 12,
    totalSpent: 1850.0,
    totalPointsEarned: 5500,
    totalPointsSpent: 1000,
    role: "manager",
    companyId: "company_1",
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
    points: 8200,
    level: "gold",
    totalPurchases: 18,
    totalSpent: 2450.0,
    totalPointsEarned: 9500,
    totalPointsSpent: 1300,
    role: "manager",
    companyId: "company_1",
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
        description: "Gastou mais de 500 em valor na loja",
        icon: "💰",
        earnedAt: "2024-04-20",
      },
      { id: "loyal", name: "Cliente Fiel", description: "Realizou 10 compras", icon: "⭐", earnedAt: "2024-07-01" },
      {
        id: "points_master",
        name: "Mestre dos Pontos",
        description: "Acumulou 5000 pontos",
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
    points: 1200,
    level: "silver",
    totalPurchases: 5,
    totalSpent: 620.0,
    totalPointsEarned: 1500,
    totalPointsSpent: 300,
    role: "member",
    companyId: "company_1",
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
        description: "Gastou mais de 500 em valor na loja",
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
    points: 15800,
    level: "platinum",
    totalPurchases: 35,
    totalSpent: 5200.0,
    totalPointsEarned: 18000,
    totalPointsSpent: 2200,
    role: "superAdmin",
    companyId: "company_1",
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
        description: "Gastou mais de 500 em valor na loja",
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
        id: "points_master",
        name: "Mestre dos Pontos",
        description: "Acumulou 5000 pontos",
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
    points: 650,
    level: "bronze",
    totalPurchases: 2,
    totalSpent: 180.0,
    totalPointsEarned: 800,
    totalPointsSpent: 150,
    role: "member",
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
    points: 3200,
    level: "silver",
    totalPurchases: 8,
    totalSpent: 950.0,
    totalPointsEarned: 3800,
    totalPointsSpent: 600,
    role: "member",
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
        description: "Gastou mais de 500 em valor na loja",
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
    points: 6500,
    level: "gold",
    totalPurchases: 15,
    totalSpent: 1780.0,
    totalPointsEarned: 7200,
    totalPointsSpent: 700,
    role: "member",
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
        id: "points_master",
        name: "Mestre dos Pontos",
        description: "Acumulou 5000 pontos",
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
    points: 2100,
    level: "silver",
    totalPurchases: 6,
    totalSpent: 720.0,
    totalPointsEarned: 2500,
    totalPointsSpent: 400,
    role: "member",
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
        description: "Gastou mais de 500 em valor na loja",
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
    priceInPoints: 25000,
    images: ["/smartphone-moderno-preto.jpg"],
    stock: 45,
    category: "Eletrônicos",
    tags: ["destaque", "novo", "5g"],
    available: true,
    active: true,
    totalSold: 89,
    rarity: "lendário",
    minLevel: "diamond",
    ncm: "85171231",
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
    priceInPoints: 39000,
    images: ["/notebook-profissional-prata.jpg"],
    stock: 28,
    category: "Eletrônicos",
    tags: ["premium", "trabalho"],
    available: true,
    active: true,
    totalSold: 67,
    rarity: "épico",
    minLevel: "gold",
    ncm: "84713012",
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
    priceInPoints: 19000,
    images: ["/tablet-preto-caneta.jpg"],
    stock: 52,
    category: "Eletrônicos",
    tags: ["destaque", "criativo"],
    available: true,
    active: true,
    totalSold: 134,
    ncm: "84713019",
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
    priceInPoints: 5000,
    images: ["/fone-ouvido-bluetooth-preto.jpg"],
    stock: 156,
    category: "Acessórios",
    tags: ["bestseller", "audio"],
    available: true,
    active: true,
    totalSold: 312,
    ncm: "85183000",
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
    priceInPoints: 9000,
    images: ["/smartwatch-esportivo-preto.jpg"],
    stock: 78,
    category: "Wearables",
    tags: ["fitness", "saude"],
    available: true,
    active: true,
    totalSold: 189,
    ncm: "91022100",
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
    priceInPoints: 1900,
    images: ["/mouse-gamer-rgb-preto.jpg"],
    stock: 124,
    category: "Periféricos",
    tags: ["gamer", "rgb"],
    available: true,
    active: true,
    totalSold: 245,
    ncm: "84716052",
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
    priceInPoints: 3500,
    images: ["/teclado-mecanico-rgb.jpg"],
    stock: 92,
    category: "Periféricos",
    tags: ["gamer", "mecanico"],
    available: true,
    active: true,
    totalSold: 178,
    ncm: "84716060",
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
    priceInPoints: 4500,
    images: ["/webcam-profissional-preta.jpg"],
    stock: 67,
    category: "Periféricos",
    tags: ["home-office", "streaming"],
    available: true,
    active: true,
    totalSold: 156,
    ncm: "85258022",
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
    priceInPoints: 1500,
    images: ["/power-bank-preto.jpg"],
    stock: 203,
    category: "Acessórios",
    tags: ["portatil", "carregamento"],
    available: true,
    active: true,
    totalSold: 289,
    ncm: "85076000",
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
    priceInPoints: 6000,
    images: ["/ssd-externo-compacto.jpg"],
    stock: 85,
    category: "Armazenamento",
    tags: ["armazenamento", "velocidade"],
    available: true,
    active: true,
    totalSold: 134,
    ncm: "84717019",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
  },
  // Produtos com estoque baixo para testes
  {
    id: "spree_product_11",
    name: "Camiseta Polo Corporativa",
    description: "Camiseta polo bordada com logo da empresa, 100% algodão pima",
    slug: "camiseta-polo-corporativa",
    sku: "POLO-CORP-M",
    price: 89.9,
    priceInPoints: 900,
    images: ["/green-corporate-polo-shirt.jpg"],
    stock: 3,
    category: "Vestuário",
    tags: ["uniforme", "corporativo"],
    available: true,
    active: true,
    totalSold: 567,
    ncm: "61051000",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  {
    id: "spree_product_12",
    name: "Mochila Executiva Premium",
    description: "Mochila para notebook 15.6\" com compartimento anti-furto e USB integrado",
    slug: "mochila-executiva-premium",
    sku: "MOCH-EXEC-PRE",
    price: 249.9,
    priceInPoints: 2500,
    images: ["/green-corporate-backpack.jpg"],
    stock: 5,
    category: "Acessórios",
    tags: ["executivo", "viagem"],
    available: true,
    active: true,
    totalSold: 234,
    ncm: "42021210",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
  },
  {
    id: "spree_product_13",
    name: "Garrafa Térmica Inox 750ml",
    description: "Garrafa térmica em aço inox com isolamento a vácuo, mantém temperatura por 24h",
    slug: "garrafa-termica-inox-750",
    sku: "GARR-TERM-750",
    price: 79.9,
    priceInPoints: 800,
    images: ["/green-thermal-bottle.jpg"],
    stock: 7,
    category: "Utilidades",
    tags: ["sustentavel", "drink"],
    available: true,
    active: true,
    totalSold: 412,
    ncm: "96170000",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-12-19T00:00:00Z",
  },
  {
    id: "spree_product_14",
    name: "Caneca Cerâmica Personalizada",
    description: "Caneca de cerâmica 350ml com acabamento fosco e personalização a laser",
    slug: "caneca-ceramica-personalizada",
    sku: "CAN-CER-350",
    price: 34.9,
    priceInPoints: 350,
    images: ["/green-corporate-mug.jpg"],
    stock: 2,
    category: "Utilidades",
    tags: ["escritorio", "brinde"],
    available: true,
    active: true,
    totalSold: 890,
    ncm: "69120000",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-12-21T00:00:00Z",
  },
  {
    id: "spree_product_15",
    name: "Boné Esportivo Bordado",
    description: "Boné esportivo com ajuste snapback e bordado frontal personalizado",
    slug: "bone-esportivo-bordado",
    sku: "BONE-ESP-BRD",
    price: 45.9,
    priceInPoints: 460,
    images: ["/green-corporate-cap.jpg"],
    stock: 8,
    category: "Vestuário",
    tags: ["esportivo", "outdoor"],
    available: true,
    active: true,
    totalSold: 345,
    ncm: "65050010",
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-12-17T00:00:00Z",
  },
  {
    id: "spree_product_16",
    name: "Caderno A5 Capa Dura",
    description: "Caderno A5 com 200 páginas, capa dura reciclada e fita marcadora",
    slug: "caderno-a5-capa-dura",
    sku: "CAD-A5-HD",
    price: 29.9,
    priceInPoints: 300,
    images: ["/green-corporate-notebook-a5.jpg"],
    stock: 4,
    category: "Papelaria",
    tags: ["escritorio", "sustentavel"],
    available: true,
    active: true,
    totalSold: 678,
    ncm: "48201090",
    createdAt: "2024-04-10T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
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
    pointsEarned: 195,
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
    pointsEarned: 210,
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
    pointsEarned: 192,
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
    paidWithPoints: 500,
    pointsEarned: 270,
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
    paidWithPoints: 300,
    pointsEarned: 320,
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
    pointsEarned: 275,
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
    pointsEarned: 182,
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

const initialTransactions: PointsTransaction[] = [
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
// UTILS
// ===========================================

function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) as T
  } catch (error) {
    console.error("Error parsing JSON from storage:", error)
    return fallback
  }
}

// ===========================================
// FUNÇÕES DE STORAGE - USUÁRIOS
// ===========================================

// Migration helper: converts old field names (brents) to new (points)
function migrateUserFields(user: Record<string, unknown>): User {
  const migrated = { ...user } as Record<string, unknown>
  
  // Migrate brents -> points
  if (migrated.brents !== undefined && migrated.points === undefined) {
    migrated.points = migrated.brents
    delete migrated.brents
  }
  // Ensure points has a default value
  if (migrated.points === undefined) {
    migrated.points = 0
  }
  
  // Migrate totalBrentsEarned -> totalPointsEarned
  if (migrated.totalBrentsEarned !== undefined && migrated.totalPointsEarned === undefined) {
    migrated.totalPointsEarned = migrated.totalBrentsEarned
    delete migrated.totalBrentsEarned
  }
  if (migrated.totalPointsEarned === undefined) {
    migrated.totalPointsEarned = 0
  }
  
  // Migrate totalBrentsSpent -> totalPointsSpent
  if (migrated.totalBrentsSpent !== undefined && migrated.totalPointsSpent === undefined) {
    migrated.totalPointsSpent = migrated.totalBrentsSpent
    delete migrated.totalBrentsSpent
  }
  if (migrated.totalPointsSpent === undefined) {
    migrated.totalPointsSpent = 0
  }
  
  return migrated as unknown as User
}

export function getUsers(): User[] {
  const storage = getStorage()
  
  // Try to get v3 first
  const storedV3 = storage.getItem("yoobe_users_v3")
  if (storedV3) {
    const users = safeParse(storedV3, initialUsers)
    // Apply migration to ensure all fields are up-to-date
    const migratedUsers = users.map(migrateUserFields)
    // Check if migration was needed and save
    const needsMigration = users.some((u: Record<string, unknown>) => 
      u.brents !== undefined || u.totalBrentsEarned !== undefined || u.totalBrentsSpent !== undefined
    )
    if (needsMigration) {
      storage.setItem("yoobe_users_v3", JSON.stringify(migratedUsers))
    }
    return migratedUsers
  }
  
  // Fallback to v2 if v3 doesn't exist (migration)
  const storedV2 = storage.getItem("prio_users_v2")
  if (storedV2) {
    const users = safeParse(storedV2, initialUsers)
    // Apply migration and save to v3
    const migratedUsers = users.map(migrateUserFields)
    storage.setItem("yoobe_users_v3", JSON.stringify(migratedUsers))
    return migratedUsers
  }
  
  // If neither exist, seed with initialUsers
  storage.setItem("yoobe_users_v3", JSON.stringify(initialUsers))
  return initialUsers
}

export function saveUsers(users: User[]): void {
  const storage = getStorage()
  // Always save to v3 now to be consistent with getUsers
  storage.setItem("yoobe_users_v3", JSON.stringify(users))
  // Also keep v2 for backward compatibility if needed, but the primary is v3
  storage.setItem("prio_users_v2", JSON.stringify(users))
}

export function getUserById(id: string): User | undefined {
  const users = getUsers()
  return users.find((u) => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function deleteUser(userId: string): boolean {
  const users = getUsers()
  const filtered = users.filter(u => u.id !== userId)
  if (filtered.length < users.length) {
    saveUsers(filtered)
    return true
  }
  return false
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    return null
  }

  // Validar email único se estiver sendo atualizado
  if (data.email && data.email !== users[index].email) {
    const existingByEmail = getUserByEmail(data.email)
    if (existingByEmail && existingByEmail.id !== id) {
      throw new Error(`Email ${data.email} já está em uso`)
    }
  }

  users[index] = {
    ...users[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  
  saveUsers(users)
  return users[index]
}

// ===========================================
// FUNÇÕES DE STORAGE - ENDEREÇOS DO USUÁRIO
// ===========================================

/**
 * Retorna todos os endereços salvos de um usuário
 */
export function getUserAddresses(userId: string): SavedAddress[] {
  const user = getUserById(userId)
  if (!user) return []
  
  // Se o usuário tem addresses, retorna diretamente
  if (user.addresses && user.addresses.length > 0) {
    return user.addresses
  }
  
  // Fallback: se não tem addresses mas tem address principal, converte
  if (user.address) {
    const defaultAddress: SavedAddress = {
      id: "default",
      label: "Endereço Principal",
      address1: user.address.address1,
      address2: user.address.address2,
      city: user.address.city,
      stateCode: user.address.stateCode,
      zipcode: user.address.zipcode,
      country: user.address.country || "BR",
      phone: user.address.phone,
      isDefault: true,
    }
    return [defaultAddress]
  }
  
  return []
}

/**
 * Salva um novo endereço para o usuário
 * Se isDefault for true, atualiza também o campo address principal
 */
export function saveUserAddress(userId: string, address: Omit<SavedAddress, "id"> & { id?: string }): SavedAddress | null {
  const user = getUserById(userId)
  if (!user) return null
  
  const currentAddresses = getUserAddresses(userId)
  const addressId = address.id || `addr_${Date.now()}`
  
  const newAddress: SavedAddress = {
    ...address,
    id: addressId,
    country: address.country || "BR",
  }
  
  let updatedAddresses: SavedAddress[]
  
  // Verifica se é uma atualização ou novo endereço
  const existingIndex = currentAddresses.findIndex(a => a.id === addressId)
  
  if (existingIndex >= 0) {
    // Atualização de endereço existente
    updatedAddresses = currentAddresses.map((addr, idx) => {
      if (idx === existingIndex) {
        return newAddress
      }
      // Se o novo endereço é default, remove default dos outros
      if (newAddress.isDefault) {
        return { ...addr, isDefault: false }
      }
      return addr
    })
  } else {
    // Novo endereço
    if (newAddress.isDefault) {
      // Remove default dos outros
      updatedAddresses = [
        ...currentAddresses.map(addr => ({ ...addr, isDefault: false })),
        newAddress,
      ]
    } else {
      updatedAddresses = [...currentAddresses, newAddress]
    }
  }
  
  // Atualiza o usuário com os novos endereços
  const updateData: Partial<User> = {
    addresses: updatedAddresses,
  }
  
  // Se é o endereço default, atualiza também o campo address principal
  if (newAddress.isDefault) {
    updateData.address = {
      address1: newAddress.address1,
      address2: newAddress.address2,
      city: newAddress.city,
      stateCode: newAddress.stateCode,
      zipcode: newAddress.zipcode,
      country: newAddress.country || "BR",
      phone: newAddress.phone,
    }
    if (newAddress.phone) {
      updateData.phone = newAddress.phone
    }
  }
  
  updateUser(userId, updateData)
  return newAddress
}

/**
 * Remove um endereço do usuário
 */
export function deleteUserAddress(userId: string, addressId: string): boolean {
  const user = getUserById(userId)
  if (!user) return false
  
  const currentAddresses = getUserAddresses(userId)
  const addressToDelete = currentAddresses.find(a => a.id === addressId)
  
  if (!addressToDelete) return false
  
  const updatedAddresses = currentAddresses.filter(a => a.id !== addressId)
  
  // Se o endereço deletado era o default, define o primeiro como default
  const updateData: Partial<User> = {
    addresses: updatedAddresses,
  }
  
  if (addressToDelete.isDefault && updatedAddresses.length > 0) {
    updatedAddresses[0].isDefault = true
    updateData.address = {
      address1: updatedAddresses[0].address1,
      address2: updatedAddresses[0].address2,
      city: updatedAddresses[0].city,
      stateCode: updatedAddresses[0].stateCode,
      zipcode: updatedAddresses[0].zipcode,
      country: updatedAddresses[0].country || "BR",
      phone: updatedAddresses[0].phone,
    }
  } else if (addressToDelete.isDefault && updatedAddresses.length === 0) {
    updateData.address = undefined
  }
  
  updateUser(userId, updateData)
  return true
}

/**
 * Define um endereço como padrão
 */
export function setDefaultAddress(userId: string, addressId: string): SavedAddress | null {
  const user = getUserById(userId)
  if (!user) return null
  
  const currentAddresses = getUserAddresses(userId)
  const addressToSetDefault = currentAddresses.find(a => a.id === addressId)
  
  if (!addressToSetDefault) return null
  
  const updatedAddresses = currentAddresses.map(addr => ({
    ...addr,
    isDefault: addr.id === addressId,
  }))
  
  const defaultAddress = updatedAddresses.find(a => a.id === addressId)!
  
  updateUser(userId, {
    addresses: updatedAddresses,
    address: {
      address1: defaultAddress.address1,
      address2: defaultAddress.address2,
      city: defaultAddress.city,
      stateCode: defaultAddress.stateCode,
      zipcode: defaultAddress.zipcode,
      country: defaultAddress.country || "BR",
      phone: defaultAddress.phone,
    },
    phone: defaultAddress.phone,
  })
  
  return defaultAddress
}

/**
 * Retorna o endereço padrão do usuário
 */
export function getDefaultAddress(userId: string): SavedAddress | null {
  const addresses = getUserAddresses(userId)
  return addresses.find(a => a.isDefault) || addresses[0] || null
}

/**
 * Calcula o nível do usuário baseado nos pontos totais ganhos
 */
export function calculateUserLevel(totalPointsEarned: number): UserLevel {
  if (totalPointsEarned >= 50000) return "diamond"
  if (totalPointsEarned >= 15000) return "platinum"
  if (totalPointsEarned >= 5000) return "gold"
  if (totalPointsEarned >= 1000) return "silver"
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

  let totalPoints = 0
  let totalPurchases = 0
  let totalSpent = 0

  users.forEach((user) => {
    levelCounts[user.level]++
    totalPoints += user.points
    totalPurchases += user.totalPurchases
    totalSpent += user.totalSpent
  })

  const topUsers = [...users].sort((a, b) => b.points - a.points).slice(0, 5)

  const mostActive = [...users].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 5)

  return {
    levelCounts,
    totalPoints,
    totalPurchases,
    totalSpent,
    averagePoints: users.length > 0 ? Math.round(totalPoints / users.length) : 0,
    topUsers,
    mostActive,
  }
}

// ===========================================
// FUNÇÕES DE STORAGE - PRODUTOS
// ===========================================

export function getProducts(): Product[] {
  const storage = getStorage()
  const stored = storage.getItem("prio_products_v2")
  if (!stored) {
    storage.setItem("prio_products_v2", JSON.stringify(initialProducts))
    return initialProducts
  }
  return JSON.parse(stored)
}

export function saveProducts(products: Product[]): void {
  const storage = getStorage()
  storage.setItem("prio_products_v2", JSON.stringify(products))
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
  const storage = getStorage()
  const stored = storage.getItem("prio_orders_v2")
  if (!stored) {
    storage.setItem("prio_orders_v2", JSON.stringify(initialOrders))
    return initialOrders
  }
  return safeParse(stored, initialOrders)
}

export function saveOrders(orders: Order[]): void {
  const storage = getStorage()
  storage.setItem("prio_orders_v2", JSON.stringify(orders))
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
 * Agenda um pedido de presente para um ou mais destinatários
 */
export function scheduleGiftOrder(data: {
  senderEmail: string
  recipients: { email: string; firstName: string; lastName: string; address: Address }[]
  items: { productId: string; quantity: number }[]
  scheduledDate: string
  message?: string
}) {
  const orders = getOrders()
  const v2Products = getProducts()
  const v3Products = getCompanyProducts()
  
  const results = []

  // 1. Validar estoque calculando demanda total para todos os itens e destinatários (Atomicidade)
  const totalItemsDemand: Record<string, number> = {}
  
  for (const item of data.items) {
    totalItemsDemand[item.productId] = (totalItemsDemand[item.productId] || 0) + (item.quantity * data.recipients.length)
  }

  for (const [productId, totalDemand] of Object.entries(totalItemsDemand)) {
    let product = v2Products.find((p) => p.id === productId) || v3Products.find((p) => p.id === productId)
    
    // Fallback for demo on server side if product not found
    if (!product && typeof window === "undefined") {
      product = {
        id: productId,
        name: "Produto de Demonstração",
        description: "Produto de demonstração para fallback",
        baseProductId: productId,
        companyId: "demo",
        category: "Demo",
        stockQuantity: 9999,
        pointsCost: 0,
        price: 0,
        isActive: true,
        finalSku: "DEMO-SKU",
        status: "active",
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as CompanyProduct
    }

    if (!product) {
      throw new Error(`Produto ${productId} não encontrado`)
    }
    
    const stock = 'stock' in product ? (product as Product).stock : (product as CompanyProduct).stockQuantity
    if (stock < totalDemand) {
      throw new Error(
        `Estoque insuficiente para o produto ${product.name}. ` +
        `Disponível: ${stock}, Necessário: ${totalDemand} para todos os destinatários.`
      )
    }
  }

  // 2. Processar deduções e criação de pedidos
  for (const recipient of data.recipients) {
    const lineItems: LineItem[] = []
    let orderTotal = 0

    for (const item of data.items) {
      let product = v2Products.find((p) => p.id === item.productId) || v3Products.find((p) => p.id === item.productId)
      
      // Same fallback for processing
      if (!product && typeof window === "undefined") {
        product = {
          id: item.productId,
          name: "Produto de Demonstração",
          description: "Produto de demonstração para fallback",
          baseProductId: item.productId,
          companyId: "demo",
          category: "Demo",
          stockQuantity: 9999,
          pointsCost: 0,
          price: 0,
          isActive: true,
          finalSku: "DEMO-SKU",
          status: "active",
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as CompanyProduct
      }

      if (!product) continue // Should not happen after validation
      
      // Deduzir estoque (já validado que há estoque suficiente)
      if ('stock' in product) {
        (product as Product).stock -= item.quantity
      } else {
        (product as CompanyProduct).stockQuantity -= item.quantity
      }

      const price = 'priceInPoints' in product ? (product as Product).priceInPoints : ((product as CompanyProduct).pointsCost || 0)

      lineItems.push({
        id: `li_${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        name: product.name,
        sku: ('sku' in product ? product.sku : (product as any).finalSku) || "",
        quantity: item.quantity,
        price: price,
        total: price * item.quantity,
      })
      orderTotal += price * item.quantity
    }

    const newOrder: Order = {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      number: `R${Math.floor(100000000 + Math.random() * 900000000)}`,
      state: "scheduled",
      itemTotal: orderTotal,
      shipmentTotal: 0,
      total: orderTotal,
      paymentState: "paid",
      userId: "spree_user_1", // Use seeded manager user instead of spree_user_demo
      email: recipient.email,
      lineItems,
      shipAddress: {
        firstname: recipient.firstName,
        lastname: recipient.lastName,
        address1: recipient.address.address1,
        address2: recipient.address.address2,
        city: recipient.address.city,
        stateCode: recipient.address.stateCode,
        zipcode: recipient.address.zipcode,
        phone: recipient.address.phone,
      },
      scheduledAt: data.scheduledDate,
      isGift: true,
      giftMessage: data.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    orders.push(newOrder)
    results.push(newOrder)
  }

  saveOrders(orders)
  saveProducts(v2Products)
  saveCompanyProducts(v3Products)
  return results
}

/**
 * Retorna estatísticas dos pedidos
 */
export function getOrderStats() {
  const orders = getOrders()

  const stateCounts: Record<string, number> = {}
  const shipmentCounts: Record<string, number> = {}

  let totalRevenue = 0
  let totalPointsEarned = 0
  let totalPointsSpent = 0

  orders.forEach((order) => {
    stateCounts[order.state] = (stateCounts[order.state] || 0) + 1
    if (order.shipmentState) {
      shipmentCounts[order.shipmentState] = (shipmentCounts[order.shipmentState] || 0) + 1
    }
    if (order.state === "complete") {
      totalRevenue += order.total
      totalPointsEarned += order.pointsEarned || 0
      totalPointsSpent += order.paidWithPoints || 0
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
    totalPointsEarned,
    totalPointsSpent,
    averageOrderValue: Number.isNaN(averageOrderValue) ? 0 : averageOrderValue,
    recentOrders,
  }
}

/**
 * Retorna pedidos de um usuário específico
 */
export function getUserOrders(userId: string): Order[] {
  const orders = getOrders()
  // Filter by userId, but also include orders with empty userId if they match by email
  const user = getUserById(userId)
  const userEmail = user?.email
  
  const filtered = orders.filter((o) => {
    // Primary check: userId matches
    if (o.userId === userId) return true
    
    // Fallback: if userId is empty/missing but email matches, include it
    // This handles legacy orders that might not have userId set
    if ((!o.userId || o.userId === "") && userEmail && o.email === userEmail) {
      return true
    }
    
    return false
  })
  
  return filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.completedAt || 0).getTime()
    const dateB = new Date(b.createdAt || b.completedAt || 0).getTime()
    return dateB - dateA
  })
}

// ===========================================
// FUNÇÕES DE STORAGE - TRANSAÇÕES PONTOS
// ===========================================

export function getTransactions(): PointsTransaction[] {
  const storage = getStorage()
  const stored = storage.getItem("prio_transactions_v2")
  if (!stored) {
    storage.setItem("prio_transactions_v2", JSON.stringify(initialTransactions))
    return initialTransactions
  }
  return safeParse(stored, initialTransactions)
}

export function saveTransactions(transactions: PointsTransaction[]): void {
  const storage = getStorage()
  storage.setItem("prio_transactions_v2", JSON.stringify(transactions))
}

export function getUserTransactions(userId: string): PointsTransaction[] {
  const transactions = getTransactions()
  return transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addPoints(userId: string, amount: number, description: string, orderNumber?: string): void {
  const users = getUsers()
  const transactions = getTransactions()

  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return

  users[userIndex].points += amount
  users[userIndex].totalPointsEarned += amount
  users[userIndex].level = calculateUserLevel(users[userIndex].totalPointsEarned)
  users[userIndex].updatedAt = new Date().toISOString()
  saveUsers(users)

  const newTransaction: PointsTransaction = {
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

export function deductPoints(userId: string, amount: number, description: string, orderNumber?: string): boolean {
  const users = getUsers()
  const transactions = getTransactions()

  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex === -1) return false

  if (users[userIndex].points < amount) return false

  users[userIndex].points -= amount
  users[userIndex].totalPointsSpent += amount
  users[userIndex].updatedAt = new Date().toISOString()
  saveUsers(users)

  const newTransaction: PointsTransaction = {
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

/**
 * Cria um novo usuário no sistema
 * @throws Error se o email já estiver em uso
 */
export function createUser(userData: Partial<User>): User {
  const users = getUsers()
  
  // Validar email único (exceto se estiver atualizando por ID)
  if (userData.email) {
    const existingByEmail = getUserByEmail(userData.email)
    // Se email existe e não é o mesmo usuário (por ID), lançar erro
    if (existingByEmail && existingByEmail.id !== userData.id) {
      throw new Error(`Email ${userData.email} já está em uso`)
    }
  }
  
  const newUser: User = {
    id: userData.id || `u_${Date.now()}`,
    email: userData.email || "",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    points: userData.points || 0,
    level: calculateUserLevel(userData.totalPointsEarned || 0),
    totalPurchases: 0,
    totalSpent: 0,
    totalPointsEarned: userData.totalPointsEarned || 0,
    totalPointsSpent: 0,
    achievements: [],
    tags: [],
    role: userData.role || "member",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...userData,
  }
  
  // Evitar duplicados se o ID já existir
  const existingIndex = users.findIndex(u => u.id === newUser.id)
  if (existingIndex > -1) {
    users[existingIndex] = newUser
  } else {
    users.push(newUser)
  }
  
  saveUsers(users)
  return newUser
}

/**
 * Simula usuários para demo personalizada
 * Cria usuários fictícios baseados no número solicitado
 */
export function simulateDemoUsers(count: number, companyId?: string): User[] {
  const users = getUsers()
  const existingCount = users.length
  const needed = Math.max(0, count - existingCount)
  
  if (needed <= 0) {
    // Se já temos usuários suficientes, apenas retornar os existentes
    return users.slice(0, count)
  }

  const firstNames = [
    "Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gabriel", "Helena",
    "Igor", "Juliana", "Lucas", "Mariana", "Nicolas", "Olivia", "Paulo", "Rafaela",
    "Sergio", "Tatiana", "Vitor", "Amanda", "Beatriz", "Caio", "Diana", "Felipe",
    "Giovanna", "Henrique", "Isabela", "João", "Karina", "Leonardo", "Marta", "Nathalia"
  ]
  
  const lastNames = [
    "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira",
    "Lima", "Gomes", "Ribeiro", "Carvalho", "Almeida", "Lopes", "Martins", "Rocha",
    "Costa", "Ramos", "Dias", "Nunes", "Moreira", "Mendes", "Freitas", "Barbosa"
  ]

  const levels: UserLevel[] = ["bronze", "silver", "gold", "platinum", "diamond"]
  const roles: Array<"member" | "manager"> = ["member", "member", "member", "member", "manager"]

  const newUsers: User[] = []
  
  for (let i = 0; i < needed; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyId ? getCompanyById(companyId)?.domain || "empresa.com" : "empresa.com"}`
    const role = roles[Math.floor(Math.random() * roles.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]
    
    // Generate realistic points based on level
    const pointsByLevel = {
      bronze: Math.floor(Math.random() * 500) + 100,
      silver: Math.floor(Math.random() * 2000) + 1000,
      gold: Math.floor(Math.random() * 5000) + 5000,
      platinum: Math.floor(Math.random() * 10000) + 15000,
      diamond: Math.floor(Math.random() * 20000) + 50000,
    }
    
    const totalPointsEarned = pointsByLevel[level]
    const userPoints = Math.floor(totalPointsEarned * 0.3) // Keep 30% as available
    
    const newUser: User = {
      id: `demo_user_${Date.now()}_${i}`,
      email,
      firstName,
      lastName,
      phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      points: userPoints,
      level,
      totalPurchases: Math.floor(Math.random() * 20) + (level === "diamond" ? 15 : 0),
      totalSpent: Math.floor(Math.random() * 2000) + (level === "diamond" ? 1000 : 0),
      totalPointsEarned,
      totalPointsSpent: Math.floor(totalPointsEarned * 0.7),
      role,
      achievements: level !== "bronze" ? [
        {
          id: "first_purchase",
          name: "Primeira Compra",
          description: "Realizou a primeira compra na loja",
          icon: "🛒",
          earnedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ] : [],
      tags: level === "diamond" || level === "platinum" ? ["vip"] : [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      lastPurchaseAt: level !== "bronze" 
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    }
    
    newUsers.push(newUser)
  }
  
  // Add new users to existing list
  const allUsers = [...users, ...newUsers]
  saveUsers(allUsers)
  
  return allUsers.slice(0, count)
}

/**
 * Cria um pedido de demonstração para o onboarding
 */
export function createDemoOrder(userId: string, productId?: string): Order | null {
  const user = getUserById(userId)
  if (!user) return null

  const products = getProducts()
  const product = productId ? products.find((p) => p.id === productId) : products[0]
  if (!product) return null

  const orderId = `demo_order_${Date.now()}`
  const orderNumber = `DEMO-${Math.floor(Math.random() * 9000) + 1000}`

  const newOrder: Order = {
    id: orderId,
    number: orderNumber,
    state: "complete",
    itemTotal: product.price,
    shipmentTotal: 0,
    total: product.price,
    paymentState: "paid",
    shipmentState: "delivered",
    userId: userId,
    email: user.email,
    lineItems: [
      {
        id: `li_${Date.now()}`,
        productId: product.id,
        name: product.name,
        sku: product.sku || "",
        quantity: 1,
        price: product.price,
        total: product.price,
      },
    ],
    shipAddress: user.address ? {
      firstname: user.firstName,
      lastname: user.lastName,
      address1: user.address.address1,
      address2: user.address.address2,
      city: user.address.city,
      stateCode: user.address.stateCode,
      zipcode: user.address.zipcode,
    } : undefined,
    completedAt: new Date().toISOString(),
    paidWithPoints: product.priceInPoints,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const orders = getOrders()
  orders.push(newOrder)
  saveOrders(orders)

  // Atualizar stats do usuário
  updateUser(userId, {
    totalPurchases: user.totalPurchases + 1,
    totalSpent: user.totalSpent + product.price,
    lastPurchaseAt: new Date().toISOString(),
  })

  return newOrder
}

/**
 * Cria um novo pedido
 */
/**
 * Verifica se todos os itens de um pedido são digitais
 */
export function isOrderDigitalOnly(lineItems: LineItem[]): boolean {
  if (!lineItems || lineItems.length === 0) return false
  return lineItems.every(item => item.isDigital === true)
}

/**
 * Calcula o frete baseado nos itens do pedido
 * Produtos digitais não possuem frete
 */
export function calculateShipmentTotal(lineItems: LineItem[], baseShipment: number = 15.90): number {
  if (isOrderDigitalOnly(lineItems)) {
    return 0 // Sem frete para produtos digitais
  }
  
  // Verifica se há algum item físico
  const hasPhysicalItems = lineItems.some(item => !item.isDigital)
  return hasPhysicalItems ? baseShipment : 0
}

export function createOrder(orderData: Partial<Order>): Order {
  const orders = getOrders()
  const users = getUsers()
  
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const orderNumber = `R${Math.floor(100000000 + Math.random() * 900000000)}`
  
  // Determina se é pedido digital-only
  const lineItems = orderData.lineItems || []
  const isDigitalOnly = isOrderDigitalOnly(lineItems)
  
  // Calcula o frete (zero para pedidos digitais)
  const shipmentTotal = isDigitalOnly ? 0 : (orderData.shipmentTotal || 0)
  
  // Para pedidos digitais, o estado de envio já começa como "delivered"
  const shipmentState = isDigitalOnly ? "delivered" : orderData.shipmentState
  
  const newOrder: Order = {
    id: orderId,
    number: orderNumber,
    state: orderData.state || "complete",
    itemTotal: orderData.itemTotal || 0,
    shipmentTotal,
    total: orderData.total || 0,
    paymentState: orderData.paymentState || "paid",
    shipmentState,
    userId: orderData.userId || "",
    email: orderData.email || "",
    lineItems,
    shipAddress: orderData.shipAddress,
    completedAt: orderData.completedAt || new Date().toISOString(),
    paidWithPoints: orderData.paidWithPoints,
    paidWithMoney: orderData.paidWithMoney || 0,
    // Campos de entrega digital
    isDigitalOnly,
    digitalDeliveryEmail: isDigitalOnly ? orderData.email : undefined,
    digitalDeliveredAt: isDigitalOnly ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...orderData,
  }
  
  orders.push(newOrder)
  saveOrders(orders)
  
  // Update user stats and apply cashback
  if (orderData.userId) {
    const user = users.find(u => u.id === orderData.userId)
    if (user) {
      // Update basic stats
      updateUser(orderData.userId, {
        totalPurchases: user.totalPurchases + 1,
        totalSpent: user.totalSpent + (orderData.total || 0),
        lastPurchaseAt: new Date().toISOString(),
      })
      
      // Calculate and apply cashback if order was paid with money (not points)
      // Cashback rule: 10 Pontos base per 1 unit spent, multiplied by user level
      if (orderData.paidWithMoney && orderData.paidWithMoney > 0) {
        const baseCashback = Math.floor(orderData.paidWithMoney * 10) // 10 Pontos per 1 unit
        const levelMultiplier = LEVEL_CONFIG[user.level].multiplier
        const totalCashback = Math.floor(baseCashback * levelMultiplier)
        
        // Add cashback to user
        if (totalCashback > 0) {
          addPoints(orderData.userId, totalCashback, `Cashback pedido #${orderNumber}`, orderNumber)
          
          // Update order with cashback info
          const orderIndex = orders.findIndex(o => o.id === orderId)
          if (orderIndex > -1) {
            orders[orderIndex].pointsEarned = totalCashback
            saveOrders(orders)
          }
        }
      }
    }
  }
  
  return newOrder
}

/**
 * Marca um pedido digital como entregue por email
 */
export function markDigitalOrderDelivered(orderId: string, deliveryEmail?: string): Order | null {
  const order = getOrderById(orderId)
  if (!order) return null
  
  // Só marca como entregue se for um pedido digital
  if (!order.isDigitalOnly) {
    console.warn(`[markDigitalOrderDelivered] Order ${orderId} is not digital-only`)
    return order
  }
  
  return updateOrder(orderId, {
    shipmentState: "delivered",
    digitalDeliveredAt: new Date().toISOString(),
    digitalDeliveryEmail: deliveryEmail || order.email,
    deliveredAt: new Date().toISOString(),
  })
}

// ===========================================
// DEMO PAYMENT FUNCTIONS
// ===========================================

const DEMO_PAYMENTS_KEY = "yoobe_demo_payments"

/**
 * Obtém todos os pagamentos demo
 */
export function getDemoPayments(): DemoPayment[] {
  const storage = getStorage()
  const stored = storage.getItem(DEMO_PAYMENTS_KEY)
  if (!stored) return []
  return JSON.parse(stored)
}

/**
 * Salva pagamentos demo
 */
function saveDemoPayments(payments: DemoPayment[]): void {
  const storage = getStorage()
  storage.setItem(DEMO_PAYMENTS_KEY, JSON.stringify(payments))
}

/**
 * Obtém pagamento demo por ID
 */
export function getDemoPaymentById(paymentId: string): DemoPayment | undefined {
  return getDemoPayments().find(p => p.id === paymentId)
}

/**
 * Obtém pagamento demo por ID do pedido
 */
export function getDemoPaymentByOrderId(orderId: string): DemoPayment | undefined {
  return getDemoPayments().find(p => p.orderId === orderId)
}

/**
 * Gera código PIX simulado (copia e cola)
 */
function generatePixCode(amount: number, orderId: string): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `00020126580014BR.GOV.BCB.PIX0136${orderId}520400005303986540${amount.toFixed(2)}5802BR5925YOOBE DEMO STORE6009SAO PAULO62070503***6304${randomPart}${timestamp}`
}

/**
 * Gera dados fake para QR Code PIX
 */
function generatePixQrData(pixCode: string): string {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="white" width="100" height="100"/><text x="50" y="50" text-anchor="middle" font-size="8">PIX QR</text></svg>`)}`
}

/**
 * Cria um pagamento demo para PIX
 */
export function createDemoPixPayment(orderId: string, orderNumber: string, amount: number): DemoPayment {
  const payments = getDemoPayments()
  const pixCode = generatePixCode(amount, orderId)
  
  const payment: DemoPayment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    orderNumber,
    method: "pix",
    amount,
    status: "pending",
    pixCode,
    pixQrCodeData: generatePixQrData(pixCode),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  payments.push(payment)
  saveDemoPayments(payments)
  return payment
}

/**
 * Cria um pagamento demo para cartão
 */
export function createDemoCardPayment(
  orderId: string, 
  orderNumber: string, 
  amount: number,
  cardLastFour: string,
  cardBrand: string
): DemoPayment {
  const payments = getDemoPayments()
  
  const payment: DemoPayment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    orderNumber,
    method: "card",
    amount,
    status: "pending",
    cardLastFour,
    cardBrand,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  payments.push(payment)
  saveDemoPayments(payments)
  return payment
}

/**
 * Confirma um pagamento demo (marca como pago)
 */
export function confirmDemoPayment(paymentId: string): DemoPayment | null {
  const payments = getDemoPayments()
  const index = payments.findIndex(p => p.id === paymentId)
  
  if (index === -1) return null
  
  payments[index].status = "paid"
  payments[index].paidAt = new Date().toISOString()
  payments[index].updatedAt = new Date().toISOString()
  
  saveDemoPayments(payments)
  
  // Atualiza o pedido correspondente
  const order = getOrderById(payments[index].orderId)
  if (order) {
    updateOrder(payments[index].orderId, {
      paymentState: "paid",
      state: "complete",
    })
  }
  
  return payments[index]
}

/**
 * Cancela um pagamento demo
 */
export function cancelDemoPayment(paymentId: string): DemoPayment | null {
  const payments = getDemoPayments()
  const index = payments.findIndex(p => p.id === paymentId)
  
  if (index === -1) return null
  
  payments[index].status = "canceled"
  payments[index].updatedAt = new Date().toISOString()
  
  saveDemoPayments(payments)
  return payments[index]
}

/**
 * Garante que existam produtos no storage
 */
export function ensureProductsSeeded(): void {
  const storage = getStorage()
  const stored = storage.getItem("prio_products_v2")
  if (!stored || JSON.parse(stored).length === 0) {
    storage.setItem("prio_products_v2", JSON.stringify(initialProducts))
  }
}

// ===========================================
// FUNÇÕES DE STORAGE - TAGS
// ===========================================

export function getTags(): string[] {
  const storage = getStorage()
  const stored = storage.getItem("prio_tags_v2")
  if (!stored) {
    storage.setItem("prio_tags_v2", JSON.stringify(initialTags))
    return initialTags
  }
  return JSON.parse(stored)
}

export function saveTags(tags: string[]): void {
  const storage = getStorage()
  storage.setItem("prio_tags_v2", JSON.stringify(tags))
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

  const product = products[index]
  if (!product.tags) product.tags = []

  if (!product.tags.includes(tag.toLowerCase())) {
    product.tags.push(tag.toLowerCase())
    product.updatedAt = new Date().toISOString()
    saveProducts(products)
  }
  addTag(tag)
}

export function removeTagFromProduct(productId: string, tag: string): void {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === productId)
  if (index === -1) return

  const product = products[index]
  if (!product.tags) return

  const tagIndex = product.tags.indexOf(tag.toLowerCase())
  if (tagIndex > -1) {
    product.tags.splice(tagIndex, 1)
    product.updatedAt = new Date().toISOString()
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
  scheduled: "Agendado",
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
  scheduled: "bg-indigo-100 text-indigo-800",
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

// ===========================================
// V3 INTERFACES - MULTI-TENANT ARCHITECTURE
// ===========================================

/**
 * Base Product - Catálogo Global (fonte da verdade)
 * Gerenciado apenas por Admin Geral
 */
export interface BaseProduct {
  id: string
  name: string
  description: string
  slug?: string
  images?: string[]
  category: string
  specs?: Record<string, unknown>
  // Campos opcionais para compatibilidade
  sku?: string
  price?: number
  // Campos fiscais
  ncm?: string // Nomenclatura Comum do Mercosul (8 dígitos)
  // Produto digital (sem frete, entrega por email)
  isDigital?: boolean
  // ========================================
  // NOVOS CAMPOS - Precificação e Fornecedores
  // ========================================
  // Precificação por quantidade (tiers)
  priceTiers?: {
    minQuantity: number
    maxQuantity: number | null
    price: number
    discount: number
  }[]
  // Opções de personalização (IDs)
  customizationOptionIds?: string[]
  // Fornecedor
  supplierId?: string
  supplierSku?: string
  supplierData?: {
    externalId?: string
    lastSyncAt?: string
    syncStatus?: "synced" | "pending" | "error"
  }
  // Estoque disponível no fornecedor
  stockAvailable?: number
  // Metadados
  createdAt: string
  updatedAt: string
  createdBy?: string
  version?: number
}

/**
 * Company - Empresa/Tenant
 */
export interface Company {
  id: string
  name: string
  alias: string // Usado para gerar SKUs (ex: "PRIO")
  domain?: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  // Informações de contato
  address?: string
  contactEmail?: string
  phone?: string
  category?: string
  // Configurações de política
  defaultPointsMultiplier?: number
  allowMixedPayment?: boolean
  // Metadados
  createdAt: string
  updatedAt: string
  isActive: boolean
  helpTourEnabled?: boolean
  demoFeaturesEnabled?: boolean
}

/**
 * Store - Loja dentro de uma Company
 */
export interface Store {
  id: string
  companyId: string
  name: string
  domain?: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  // Metadados
  createdAt: string
  updatedAt: string
  isActive: boolean
}

/**
 * Company Product - Produto clonado do BaseProduct para uma Company
 * Este é o "sink" onde produtos são replicados
 */
export interface CompanyProduct {
  id: string
  companyId: string
  baseProductId: string // Sempre referência ao BaseProduct
  name: string
  description: string
  slug?: string
  images?: string[]
  category: string
  // Overrides permitidos
  price: number
  pointsCost: number
  stockQuantity: number
  finalSku: string // Único por company (ex: "PRIO-000123")
  ean13?: string // 12/13 dígitos com checksum
  ncm?: string // Nomenclatura Comum do Mercosul (herdado do BaseProduct ou override)
  // Flags
  isActive: boolean
  isDigital?: boolean // Produto digital (sem frete, entrega por email)
  status: "active" | "inactive" | "pending"
  // Tags locais
  tags: string[]
  // Metadados
  createdAt: string
  updatedAt: string
  replicatedAt?: string
  replicatedBy?: string
}

/**
 * Budget - Orçamento para adicionar produtos ao catálogo
 */
export type BudgetStatus = 
  | "draft" 
  | "submitted" 
  | "reviewed" 
  | "awaiting_approval"
  | "approved" 
  | "awaiting_payment"
  | "payment_confirmed"
  | "released"
  | "in_production"
  | "in_stock"
  | "available"
  | "published"
  | "rejected"

/**
 * Tipo de orçamento - novo pedido ou reposição de estoque
 */
export type BudgetType = "new" | "restock"

export interface Budget {
  id: string
  companyId: string
  customerCompanyId?: string
  title: string
  status: BudgetStatus
  budgetType: BudgetType
  // Para restock: ID do produto de origem
  sourceProductId?: string
  // Totais calculados (STORED)
  totalCash: number
  totalPoints: number
  // Centro de Custos
  costCenterId?: string
  costCenterName?: string
  // Solicitante
  requestedById?: string
  requestedByName?: string
  // Metadados
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  submittedAt?: string
  reviewedAt?: string
  awaitingApprovalAt?: string
  approvedAt?: string
  awaitingPaymentAt?: string
  paymentConfirmedAt?: string
  inProductionAt?: string
  inStockAt?: string
  availableAt?: string
  publishedAt?: string
  scheduledPublishDate?: string
  releasedAt?: string
  replicatedAt?: string
  meta?: Record<string, unknown>
}

/**
 * Budget Item - Item dentro de um Budget
 */
export interface BudgetItem {
  id: string
  budgetId: string
  baseProductId: string
  qty: number
  unitPrice: number
  unitPoints: number
  subtotalCash: number
  subtotalPoints: number
  createdAt: string
  updatedAt: string
}

export interface TeamBudget {
  id: string
  companyId: string
  teamId: string
  teamName: string
  totalBudget: number
  allocatedBudget: number
  spentBudget: number
  currency: string
  period: "monthly" | "quarterly" | "yearly"
  startDate: string
  endDate: string
  managerId: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  updatedAt: string
}

export interface BudgetAllocation {
  id: string
  teamBudgetId: string
  userId: string
  allocatedAmount: number
  spentAmount: number
  category: string
  description: string
  approvedBy?: string
  approvedAt?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

/**
 * Centro de Custos - Departamento/área com orçamento alocado
 */
export interface CostCenter {
  id: string
  companyId: string
  name: string
  code: string
  managerId: string
  managerName?: string
  allocatedBudget: number
  usedBudget: number
  availableBudget: number
  pendingRequests: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Comprador da Empresa - Usuário autorizado a fazer compras
 */
export interface CompanyBuyer {
  id: string
  companyId: string
  userId: string
  name: string
  email: string
  role: "buyer" | "approver" | "admin"
  costCenterIds: string[] // Centros de custo que pode usar
  spendLimit: number
  totalSpent: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Transação de Centro de Custo - Histórico de movimentações
 */
export interface CostCenterTransaction {
  id: string
  costCenterId: string
  companyId: string
  type: "allocation" | "expense" | "refund" | "adjustment"
  amount: number
  description: string
  budgetId?: string
  budgetTitle?: string
  userId?: string
  userName?: string
  createdAt: string
}

export interface ExpenseCategory {
  id: string
  companyId: string
  name: string
  description: string
  color: string
  icon: string
  maxPercentage?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MarketingBudget {
  id: string
  companyId: string
  totalBudget: number
  allocatedBudget: number
  spentBudget: number
  currency: string
  period: "monthly" | "quarterly" | "yearly"
  startDate: string
  endDate: string
  campaigns: MarketingCampaign[]
  status: "active" | "inactive" | "pending"
  createdAt: string
  updatedAt: string
}

export interface MarketingCampaign {
  id: string
  marketingBudgetId: string
  name: string
  description: string
  allocatedBudget: number
  spentBudget: number
  startDate: string
  endDate: string
  category: string
  targetAudience: string
  expectedROI: number
  actualROI?: number
  status: "planning" | "active" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface CustomCurrency {
  id: string
  companyId: string
  name: string
  symbol: string
  pluralName: string
  icon: string
  color: string
  backgroundColor: string
  borderColor: string
  exchangeRate: number // Rate to BRL
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WalletPortfolio {
  id: string
  userId: string
  companyId: string
  currencies: WalletCurrency[]
  totalValueBRL: number
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export interface WalletCurrency {
  currencyId: string
  balance: number
  valueBRL: number
  percentageChange: number
  lastTransaction: string
  transactions: WalletTransaction[]
}

export interface WalletTransaction {
  id: string
  currencyId: string
  type: "credit" | "debit" | "conversion"
  amount: number
  balanceAfter: number
  description: string
  category: string
  referenceId?: string // Order ID, Budget ID, etc.
  metadata?: Record<string, any>
  createdAt: string
}

export interface BudgetApproval {
  id: string
  budgetId: string
  requesterId: string
  approverId: string
  level: number
  status: "pending" | "approved" | "rejected"
  comments?: string
  requestedAt: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * Mensagem de comunicação entre gestor e super admin sobre orçamentos
 */
export interface BudgetMessage {
  id: string
  budgetId: string
  senderId: string
  senderName: string
  senderRole: "manager" | "superAdmin"
  message: string
  isRead: boolean
  createdAt: string
}

// ===========================================
// BUDGET MESSAGE FUNCTIONS
// ===========================================

/**
 * Adiciona uma mensagem a um orçamento
 */
export function addBudgetMessage(
  budgetId: string,
  senderId: string,
  senderName: string,
  senderRole: "manager" | "superAdmin",
  message: string
): BudgetMessage {
  const messages = getBudgetMessages(budgetId)
  const newMessage: BudgetMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    budgetId,
    senderId,
    senderName,
    senderRole,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
  }
  
  messages.push(newMessage)
  const storage = getStorage()
  storage.setItem(`budget_messages_${budgetId}`, JSON.stringify(messages))
  
  return newMessage
}

/**
 * Obtém mensagens de um orçamento
 */
export function getBudgetMessages(budgetId: string): BudgetMessage[] {
  const storage = getStorage()
  const data = storage.getItem(`budget_messages_${budgetId}`)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * Marca mensagens como lidas
 */
export function markBudgetMessagesAsRead(budgetId: string, role: "manager" | "superAdmin"): void {
  const messages = getBudgetMessages(budgetId)
  const updated = messages.map(m => ({
    ...m,
    isRead: m.senderRole !== role ? true : m.isRead
  }))
  const storage = getStorage()
  storage.setItem(`budget_messages_${budgetId}`, JSON.stringify(updated))
}

/**
 * Conta mensagens não lidas de um orçamento
 */
export function getUnreadMessageCount(budgetId: string, role: "manager" | "superAdmin"): number {
  const messages = getBudgetMessages(budgetId)
  return messages.filter(m => !m.isRead && m.senderRole !== role).length
}

// ===========================================
// APPROVAL WORKFLOW SYSTEM
// ===========================================

/**
 * Condição para regras de aprovação
 */
export interface ApprovalCondition {
  field: 'value' | 'quantity' | 'category' | 'priority'
  operator: 'gt' | 'lt' | 'eq' | 'contains'
  value: string | number
}

/**
 * Regra de aprovação configurável
 */
export interface ApprovalRule {
  id: string
  companyId: string
  name: string
  description: string
  conditions: ApprovalCondition[]
  approverRoles: string[]
  autoApprove: boolean
  maxValue?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Prioridade de aprovação
 */
export type ApprovalPriority = 'alta' | 'media' | 'baixa'

/**
 * Tipo de solicitação de aprovação
 */
export type ApprovalRequestType = 'order' | 'budget' | 'gift' | 'requisition'

/**
 * Categoria de rejeição para aprovações
 */
export type RejectionCategory = 
  | "missing_info" 
  | "budget_exceeded" 
  | "unauthorized" 
  | "policy_violation" 
  | "other"

/**
 * Solicitação de aprovação
 */
export interface ApprovalRequest {
  id: string
  companyId: string
  type: ApprovalRequestType
  referenceId: string
  requesterId: string
  requesterName: string
  requesterEmail?: string
  requesterPhone?: string
  requesterDepartment?: string
  status: 'pending' | 'approved' | 'rejected' | 'info_requested'
  priority: ApprovalPriority
  value: number
  title: string
  description: string
  detailedDescription?: string
  attachedItems?: ApprovalAttachedItem[]
  approvedBy?: string
  rejectedBy?: string
  approvalNotes?: string
  rejectionReason?: string
  rejectionCategory?: RejectionCategory
  infoRequestMessage?: string
  comments?: string
  createdAt: string
  updatedAt: string
  reviewedAt?: string
}

/**
 * Item anexado a uma solicitação de aprovação
 */
export interface ApprovalAttachedItem {
  id: string
  type: 'product' | 'order' | 'budget_item'
  referenceId: string
  name: string
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  sku?: string
  image?: string
}

/**
 * Estatísticas de aprovação
 */
export interface ApprovalStats {
  approvedToday: number
  pending: number
  rejectedToday: number
  averageTimeHours: number
  totalApproved: number
  totalRejected: number
  totalPending: number
}

export interface ROIReport {
  id: string
  companyId: string
  budgetId?: string
  marketingBudgetId?: string
  investment: number
  returns: number
  roi: number
  period: string
  category: string
  breakdown: ROICategory[]
  status: "calculating" | "completed" | "error"
  createdAt: string
  updatedAt: string
}

export interface ROICategory {
  category: string
  investment: number
  returns: number
  roi: number
  percentage: number
}

/**
 * Tag - Sistema de tags global e local
 */
export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  // Escopo
  scope: "global" | "company" | "store"
  companyId?: string
  storeId?: string
  // Política de elegibilidade
  isEligibilityGate?: boolean
  // Metadados
  createdAt: string
  updatedAt: string
  createdBy?: string
}

/**
 * Product Tag - Associação produto-tag
 */
export interface ProductTag {
  id: string
  productId: string // Pode ser baseProductId ou companyProductId
  tagId: string
  productType: "base" | "company"
  createdAt: string
}

/**
 * Employee Tag - Associação usuário-tag
 */
export interface EmployeeTag {
  id: string
  userId: string
  tagId: string
  createdAt: string
}

// ===========================================
// V3 STORAGE FUNCTIONS - BASE PRODUCTS
// ===========================================

const initialBaseProducts: BaseProduct[] = [
  // ============================================
  // ELETRÔNICOS
  // ============================================
  {
    id: "base_product_1",
    name: "Smartphone Pro 5G",
    description: "Smartphone 5G com tela AMOLED 6.7 polegadas, 256GB de armazenamento",
    slug: "smartphone-pro-5g",
    images: ["/smartphone-moderno-preto.jpg"],
    category: "Eletrônicos",
    price: 4999.00,
    ncm: "85171231",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_2",
    name: "Notebook Ultra 15",
    description: "Notebook profissional com processador i7, 16GB RAM, SSD 512GB",
    slug: "notebook-ultra-15",
    images: ["/notebook-profissional-prata.jpg"],
    category: "Eletrônicos",
    price: 6499.00,
    ncm: "84713012",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_3",
    name: "Tablet Pro 11",
    description: "Tablet com tela 11 polegadas, 128GB, caneta stylus incluída",
    slug: "tablet-pro-11",
    images: ["/tablet-preto-caneta.jpg"],
    category: "Eletrônicos",
    price: 3299.00,
    ncm: "84713019",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_4",
    name: "Fone Bluetooth Premium",
    description: "Fone de ouvido bluetooth com cancelamento de ruído ativo, 30h de bateria",
    slug: "fone-bluetooth-premium",
    images: ["/fone-ouvido-bluetooth-preto.jpg"],
    category: "Eletrônicos",
    price: 899.00,
    ncm: "85183000",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_5",
    name: "Smartwatch Fitness Pro",
    description: "Relógio inteligente com GPS, monitor cardíaco e 50 modos esportivos",
    slug: "smartwatch-fitness-pro",
    images: ["/smartwatch-esportivo-preto.jpg"],
    category: "Eletrônicos",
    price: 1299.00,
    ncm: "91022100",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_6",
    name: "Mouse Gamer RGB",
    description: "Mouse gamer com 7 botões programáveis, sensor óptico 12000 DPI",
    slug: "mouse-gamer-rgb",
    images: ["/mouse-gamer-rgb-preto.jpg"],
    category: "Eletrônicos",
    price: 349.00,
    ncm: "84716052",
    isDigital: false,
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_7",
    name: "Teclado Mecânico RGB",
    description: "Teclado mecânico com switches blue, iluminação RGB personalizável",
    slug: "teclado-mecanico-rgb",
    images: ["/teclado-mecanico-rgb.jpg"],
    category: "Eletrônicos",
    price: 549.00,
    ncm: "84716051",
    isDigital: false,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_8",
    name: "Webcam Full HD Pro",
    description: "Webcam 1080p 60fps com microfone duplo e foco automático",
    slug: "webcam-full-hd-pro",
    images: ["/webcam-profissional-preta.jpg"],
    category: "Eletrônicos",
    price: 499.00,
    ncm: "85258019",
    isDigital: false,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_9",
    name: "Power Bank 20000mAh",
    description: "Bateria externa 20000mAh com carregamento rápido e 3 portas USB",
    slug: "power-bank-20000",
    images: ["/power-bank-preto.jpg"],
    category: "Eletrônicos",
    price: 249.00,
    ncm: "85076000",
    isDigital: false,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_10",
    name: "SSD Externo 1TB",
    description: "SSD portátil 1TB USB 3.2 com velocidade de leitura 1000MB/s",
    slug: "ssd-externo-1tb",
    images: ["/ssd-externo-compacto.jpg"],
    category: "Eletrônicos",
    price: 699.00,
    ncm: "84717019",
    isDigital: false,
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-04-01T00:00:00Z",
    version: 1,
  },
  // ============================================
  // SWAG / VESTUÁRIO CORPORATIVO
  // ============================================
  {
    id: "base_product_11",
    name: "Camiseta Corporate Premium",
    description: "Camiseta 100% algodão pima com estampa personalizada da marca",
    slug: "camiseta-corporate-premium",
    images: ["/green-corporate-t-shirt.jpg"],
    category: "Swag",
    price: 89.90,
    ncm: "61091000",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_12",
    name: "Mochila Executive Pro",
    description: "Mochila executiva com compartimento acolchoado para notebook até 15 polegadas",
    slug: "mochila-executive-pro",
    images: ["/green-corporate-backpack.jpg"],
    category: "Swag",
    price: 289.00,
    ncm: "42029200",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_13",
    name: "Boné Trucker Style",
    description: "Boné estilo trucker com ajuste regulável e logo bordado",
    slug: "bone-trucker-style",
    images: ["/green-corporate-cap.jpg"],
    category: "Swag",
    price: 59.90,
    ncm: "65050019",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_16",
    name: "Polo Corporate Piquet",
    description: "Polo social em piquet com gola e punhos reforçados, logo bordado",
    slug: "polo-corporate-piquet",
    images: ["/green-corporate-polo-shirt.jpg"],
    category: "Swag",
    price: 129.00,
    ncm: "61051000",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_17",
    name: "Jaqueta Windbreaker Pro",
    description: "Jaqueta corta-vento impermeável com capuz e bolsos laterais",
    slug: "jaqueta-windbreaker-pro",
    images: ["/green-corporate-windbreaker-jacket.jpg"],
    category: "Swag",
    price: 349.00,
    ncm: "62019300",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  // ============================================
  // BRINDES CORPORATIVOS
  // ============================================
  {
    id: "base_product_14",
    name: "Caneca Térmica Premium",
    description: "Caneca térmica de aço inox com capacidade de 350ml e tampa anti-vazamento",
    slug: "caneca-termica-premium",
    images: ["/green-corporate-mug.jpg"],
    category: "Brindes Corporativos",
    price: 79.90,
    ncm: "96170000",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_15",
    name: "Garrafa Térmica Eco 500ml",
    description: "Garrafa térmica ecológica de aço inoxidável, mantém temperatura por 24h",
    slug: "garrafa-termica-eco-500ml",
    images: ["/green-thermal-bottle.jpg"],
    category: "Brindes Corporativos",
    price: 99.90,
    ncm: "96170000",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_18",
    name: "Caderno Executivo A5",
    description: "Caderno executivo A5 com capa dura em couro sintético e 200 páginas pautadas",
    slug: "caderno-executivo-a5",
    images: ["/green-corporate-notebook-a5.jpg"],
    category: "Brindes Corporativos",
    price: 69.90,
    ncm: "48201000",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_19",
    name: "Kit Escritório Completo",
    description: "Kit premium com canetas, marca-textos, post-its e organizador de mesa",
    slug: "kit-escritorio-completo",
    images: ["/green-corporate-stationery-kit.jpg"],
    category: "Brindes Corporativos",
    price: 149.00,
    ncm: "96089900",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_20",
    name: "Mousepad Gamer XL",
    description: "Mousepad extra grande 90x40cm com superfície de controle e base antiderrapante",
    slug: "mousepad-gamer-xl",
    images: ["/green-corporate-gaming-mousepad.jpg"],
    category: "Brindes Corporativos",
    price: 89.90,
    ncm: "40169300",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_21",
    name: "Kit Boas-Vindas Premium",
    description: "Kit completo de onboarding com camiseta, garrafa, caderno e caneta personalizada",
    slug: "kit-boas-vindas-premium",
    images: ["/green-corporate-stationery-kit.jpg"],
    category: "Brindes Corporativos",
    price: 399.00,
    ncm: "96089900",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_22",
    name: "Organizador de Cabos USB",
    description: "Organizador de cabos magnético com design minimalista para mesa de trabalho",
    slug: "organizador-cabos-usb",
    images: ["/green-corporate-stationery-kit.jpg"],
    category: "Brindes Corporativos",
    price: 49.90,
    ncm: "39269090",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_23",
    name: "Suporte para Notebook Alumínio",
    description: "Suporte ergonômico em alumínio para notebook com ventilação otimizada",
    slug: "suporte-notebook-aluminio",
    images: ["/notebook-profissional-prata.jpg"],
    category: "Brindes Corporativos",
    price: 189.00,
    ncm: "83062900",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_24",
    name: "Hub USB-C 7 em 1",
    description: "Hub multiportas com HDMI, USB 3.0, leitor de cartão e carregamento PD",
    slug: "hub-usb-c-7em1",
    images: ["/ssd-externo-compacto.jpg"],
    category: "Eletrônicos",
    price: 279.00,
    ncm: "84733040",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_25",
    name: "Carregador Wireless 15W",
    description: "Carregador sem fio de mesa com suporte ajustável e LED indicador",
    slug: "carregador-wireless-15w",
    images: ["/power-bank-preto.jpg"],
    category: "Eletrônicos",
    price: 149.00,
    ncm: "85044090",
    isDigital: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  // ============================================
  // PRODUTOS DIGITAIS (sem frete, entrega por email)
  // ============================================
  {
    id: "base_product_digital_1",
    name: "Vale iFood R$ 50",
    description: "Crédito de R$ 50 para uso no aplicativo iFood. Código enviado por e-mail.",
    slug: "vale-ifood-50",
    images: ["/digital/voucher-ifood.svg"],
    category: "Produtos Digitais",
    price: 50.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_2",
    name: "Vale iFood R$ 100",
    description: "Crédito de R$ 100 para uso no aplicativo iFood. Código enviado por e-mail.",
    slug: "vale-ifood-100",
    images: ["/digital/voucher-ifood.svg"],
    category: "Produtos Digitais",
    price: 100.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_3",
    name: "Netflix Gift Card R$ 70",
    description: "Cartão presente Netflix de R$ 70 para assinatura ou aluguel. Código digital.",
    slug: "netflix-giftcard-70",
    images: ["/digital/voucher-netflix.svg"],
    category: "Produtos Digitais",
    price: 70.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_4",
    name: "Spotify Premium 3 meses",
    description: "Assinatura Spotify Premium por 3 meses. Código de ativação enviado por e-mail.",
    slug: "spotify-premium-3m",
    images: ["/digital/voucher-spotify.svg"],
    category: "Produtos Digitais",
    price: 59.70,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_5",
    name: "Uber Credits R$ 50",
    description: "Crédito de R$ 50 para corridas no aplicativo Uber. Código enviado por e-mail.",
    slug: "uber-credits-50",
    images: ["/digital/voucher-uber.svg"],
    category: "Produtos Digitais",
    price: 50.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_6",
    name: "99 Credits R$ 40",
    description: "Crédito de R$ 40 para corridas no aplicativo 99. Código enviado por e-mail.",
    slug: "99-credits-40",
    images: ["/digital/voucher-99.svg"],
    category: "Produtos Digitais",
    price: 40.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_7",
    name: "Amazon Gift Card R$ 100",
    description: "Cartão presente Amazon de R$ 100 para compras no site. Código digital.",
    slug: "amazon-giftcard-100",
    images: ["/digital/voucher-amazon.svg"],
    category: "Produtos Digitais",
    price: 100.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_8",
    name: "Google Play R$ 50",
    description: "Crédito de R$ 50 para Google Play Store. Código enviado por e-mail.",
    slug: "google-play-50",
    images: ["/digital/voucher-google-play.svg"],
    category: "Produtos Digitais",
    price: 50.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_9",
    name: "Steam Wallet R$ 100",
    description: "Crédito de R$ 100 para Steam. Ideal para gamers. Código enviado por e-mail.",
    slug: "steam-wallet-100",
    images: ["/digital/voucher-steam.svg"],
    category: "Produtos Digitais",
    price: 100.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_10",
    name: "Curso Udemy - Escolha Livre",
    description: "Voucher para qualquer curso na plataforma Udemy até R$ 99. Código enviado por e-mail.",
    slug: "curso-udemy-livre",
    images: ["/digital/voucher-udemy.svg"],
    category: "Produtos Digitais",
    price: 99.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_11",
    name: "Day Off - Folga Remunerada",
    description: "Vale 1 dia de folga remunerada para uso em data a combinar. Voucher digital.",
    slug: "day-off-folga",
    images: ["/digital/voucher-day-off.svg"],
    category: "Produtos Digitais",
    price: 0.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
  {
    id: "base_product_digital_12",
    name: "Gympass Mensal",
    description: "Acesso Gympass por 1 mês com acesso a academias e apps de bem-estar. Código digital.",
    slug: "gympass-mensal",
    images: ["/digital/voucher-gympass.svg"],
    category: "Produtos Digitais",
    price: 129.00,
    ncm: "49070090",
    isDigital: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    version: 1,
  },
]

export function getBaseProducts(): BaseProduct[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_base_products_v5")
  if (!stored) {
    storage.setItem("yoobe_base_products_v5", JSON.stringify(initialBaseProducts))
    return initialBaseProducts
  }
  return safeParse(stored, initialBaseProducts)
}

export function saveBaseProducts(products: BaseProduct[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_base_products_v5", JSON.stringify(products))
}

/**
 * Garante que existam base products no storage
 * Cura casos de localStorage vazio, JSON inválido ou array vazio
 */
export function ensureBaseProductsSeeded(): void {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_base_products_v5")
  if (!stored) {
    storage.setItem("yoobe_base_products_v5", JSON.stringify(initialBaseProducts))
    return
  }
  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      storage.setItem("yoobe_base_products_v5", JSON.stringify(initialBaseProducts))
    }
  } catch (error) {
    // JSON inválido, resetar
    storage.setItem("yoobe_base_products_v5", JSON.stringify(initialBaseProducts))
  }
}

export function getBaseProductById(id: string): BaseProduct | undefined {
  const products = getBaseProducts()
  return products.find((p) => p.id === id)
}

export function createBaseProduct(data: Partial<BaseProduct>): BaseProduct {
  const products = getBaseProducts()
  const newProduct: BaseProduct = {
    id: data.id || `base_product_${Date.now()}`,
    name: data.name || "",
    description: data.description || "",
    slug: data.slug,
    images: data.images || [],
    category: data.category || "Outros",
    specs: data.specs,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy,
    version: 1,
    ...data,
  }
  products.push(newProduct)
  saveBaseProducts(products)
  return newProduct
}

export function updateBaseProduct(id: string, data: Partial<BaseProduct>): BaseProduct | null {
  const products = getBaseProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null

  const current = products[index]
  products[index] = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
    version: (current.version || 1) + 1,
  }
  saveBaseProducts(products)
  return products[index]
}

export function deleteBaseProduct(id: string): void {
  const products = getBaseProducts()
  const filtered = products.filter((p) => p.id !== id)
  saveBaseProducts(filtered)
}

// ===========================================
// V3 STORAGE FUNCTIONS - COMPANIES
// ===========================================

const initialCompanies: Company[] = [
  {
    id: "company_1",
    name: "Yoobe LTDA",
    alias: "YOO",
    domain: "yoobe.co",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    defaultPointsMultiplier: 1.0,
    allowMixedPayment: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
]

export function getCompanies(): Company[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_companies_v3")
  if (!stored) {
    storage.setItem("yoobe_companies_v3", JSON.stringify(initialCompanies))
    return initialCompanies
  }
  return safeParse(stored, initialCompanies)
}

export function getUsersByCompany(companyId: string): User[] {
  return getUsers().filter(u => u.companyId === companyId)
}

export function getOrdersByCompany(companyId: string): Order[] {
  const users = getUsersByCompany(companyId)
  const userEmails = new Set(users.map(u => u.email))
  return getOrders().filter(o => userEmails.has(o.email))
}

export function saveCompanies(companies: Company[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_companies_v3", JSON.stringify(companies))
}

export function getCompanyById(id: string): Company | undefined {
  const companies = getCompanies()
  return companies.find((c) => c.id === id)
}

/**
 * Seeds all base products to a company with default stock and active status
 * This ensures new companies have products available immediately
 */
export function seedCompanyProducts(companyId: string): void {
  const baseProducts = getBaseProducts()
  const company = getCompanyById(companyId)
  
  if (!company) {
    console.warn(`[seedCompanyProducts] Company ${companyId} not found`)
    return
  }

  // Replicate all base products with default values
  baseProducts.forEach((baseProduct) => {
    // Check if product already exists for this company (idempotent)
    const existing = getCompanyProductByBaseProduct(companyId, baseProduct.id)
    if (existing) {
      // Product already exists, skip
      return
    }

    // Replicate with default values: 100 stock, active, 1000 points
    replicateProduct(
      baseProduct.id,
      companyId,
      {
        stockQuantity: 100,
        isActive: true,
        pointsCost: 1000, // Default points cost
        price: 0, // Price-based purchases disabled by default
      },
      "system" // Actor ID for system operations
    )
  })
}

/**
 * Demo company products with branded swag images
 * These are used for demo purposes to show a beautiful catalog
 */
const DEMO_COMPANY_PRODUCTS_DATA = [
  {
    name: "Kit Boas-Vindas Lulu Bloom: Desabr",
    description: "Kit completo de boas-vindas com itens exclusivos da marca Lulu Bloom.",
    category: "Kits",
    images: ["/green-corporate-stationery-kit.jpg"],
    pointsCost: 1000,
    price: 150,
    stockQuantity: 100,
    ncm: "96089900", // Artigos de escritório
  },
  {
    name: "Agenda 'Fashion Forward' Lulu Bloo",
    description: "Agenda premium com capa em couro sintético e acabamento dourado.",
    category: "Escritório",
    images: ["/green-corporate-notebook-a5.jpg"],
    pointsCost: 1000,
    price: 85,
    stockQuantity: 3, // ESTOQUE BAIXO - para teste
    ncm: "48201000", // Cadernos
  },
  {
    name: "Camiseta 'Trendsetter' Lulu Bloom",
    description: "Camiseta 100% algodão pima com logo bordado. Conforto e estilo.",
    category: "Vestuário",
    images: ["/green-corporate-t-shirt.jpg"],
    pointsCost: 1000,
    price: 120,
    stockQuantity: 5, // ESTOQUE BAIXO - para teste
    ncm: "61091000", // Camisetas de malha
  },
  {
    name: "Copo Térmico 'Stay Chic' Lulu Bloom",
    description: "Copo térmico de aço inoxidável que mantém bebidas quentes ou geladas por horas.",
    category: "Acessórios",
    images: ["/green-thermal-bottle.jpg"],
    pointsCost: 1000,
    price: 95,
    stockQuantity: 100,
    ncm: "96170000", // Garrafas térmicas
  },
  {
    name: "Mochila Executiva Premium",
    description: "Mochila resistente com compartimento para notebook e carregador USB.",
    category: "Acessórios",
    images: ["/green-corporate-backpack.jpg"],
    pointsCost: 1500,
    price: 250,
    stockQuantity: 7, // ESTOQUE BAIXO - para teste
    ncm: "42029200", // Mochilas
  },
  {
    name: "Jaqueta Corta-Vento Corporativa",
    description: "Jaqueta leve e impermeável, ideal para o dia a dia.",
    category: "Vestuário",
    images: ["/green-corporate-windbreaker-jacket.jpg"],
    pointsCost: 2200,
    price: 350,
    stockQuantity: 30,
    ncm: "62019300", // Jaquetas
  },
  {
    name: "Caneca de Cerâmica Fosca",
    description: "Design minimalista para o seu café de todas as manhãs.",
    category: "Acessórios",
    images: ["/green-corporate-mug.jpg"],
    pointsCost: 250,
    price: 45,
    stockQuantity: 2, // ESTOQUE BAIXO - para teste
    ncm: "69120000", // Louça de cerâmica
  },
  {
    name: "Boné Trucker Yoobe",
    description: "Estilo e proteção para os dias de sol e eventos externos.",
    category: "Vestuário",
    images: ["/green-corporate-cap.jpg"],
    pointsCost: 400,
    price: 65,
    stockQuantity: 8, // ESTOQUE BAIXO - para teste
    ncm: "65050019", // Bonés e chapéus
  },
]

/**
 * Seeds demo company products with branded swag images
 * Creates CompanyProducts directly without needing BaseProducts
 */
export function seedDemoCompanyProducts(companyId: string): CompanyProduct[] {
  const company = getCompanyById(companyId)
  if (!company) {
    console.warn(`[seedDemoCompanyProducts] Company ${companyId} not found`)
    return []
  }

  const existingProducts = getCompanyProducts()
  const companyProducts = existingProducts.filter(p => p.companyId === companyId)
  
  // Only seed if no products exist for this company
  if (companyProducts.length > 0) {
    // Update existing products to ensure they have images and correct stock for demo
    let modified = false
    const updatedProducts = existingProducts.map(p => {
      if (p.companyId !== companyId) return p
      
      // Find matching demo product by name similarity
      const demoMatch = DEMO_COMPANY_PRODUCTS_DATA.find(dp => 
        p.name.includes(dp.name.substring(0, 15)) || dp.name.includes(p.name.substring(0, 15))
      )
      
      if (demoMatch) {
        let shouldUpdate = false
        const updates: Partial<CompanyProduct> = {}
        
        // Update images if missing
        if (!p.images || p.images.length === 0 || p.images[0] === "/placeholder.jpg") {
          updates.images = demoMatch.images
          shouldUpdate = true
        }
        
        // Update stock if it differs from demo data (for testing low stock scenarios)
        if (p.stockQuantity !== demoMatch.stockQuantity) {
          updates.stockQuantity = demoMatch.stockQuantity
          shouldUpdate = true
        }
        
        if (shouldUpdate) {
          modified = true
          return { ...p, ...updates, updatedAt: new Date().toISOString() }
        }
      }
      return p
    })
    
    if (modified) {
      saveCompanyProducts(updatedProducts)
      return updatedProducts.filter(p => p.companyId === companyId)
    }
    return companyProducts
  }

  // Create new demo products
  const newProducts: CompanyProduct[] = DEMO_COMPANY_PRODUCTS_DATA.map((data, index) => {
    const finalSku = generateFinalSku(company.alias)
    const id = `cp_${companyId}_demo_${index + 1}`
    
    return {
      id,
      companyId,
      baseProductId: `demo_product_${index + 1}`,
      name: data.name,
      description: data.description,
      category: data.category,
      images: data.images,
      price: data.price,
      pointsCost: data.pointsCost,
      stockQuantity: data.stockQuantity,
      finalSku,
      ncm: data.ncm, // Include NCM from demo data
      isActive: true,
      status: "active" as const,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replicatedAt: new Date().toISOString(),
      replicatedBy: "system",
    }
  })

  // Save all products
  const allProducts = [...existingProducts, ...newProducts]
  saveCompanyProducts(allProducts)
  
  return newProducts
}

/**
 * Clones a BaseProduct directly to a CompanyProduct without requiring budget approval
 * Used for sandbox/demo mode
 */
export function cloneProductToCompany(
  baseProductId: string,
  companyId: string,
  overrides?: {
    price?: number
    pointsCost?: number
    stockQuantity?: number
    isActive?: boolean
    tags?: string[]
  }
): CompanyProduct | null {
  const baseProduct = getBaseProductById(baseProductId)
  if (!baseProduct) {
    console.error(`[cloneProductToCompany] BaseProduct ${baseProductId} not found`)
    return null
  }

  const company = getCompanyById(companyId)
  if (!company) {
    console.error(`[cloneProductToCompany] Company ${companyId} not found`)
    return null
  }

  // Check if product already exists (idempotent)
  const existing = getCompanyProductByBaseProduct(companyId, baseProductId)
  if (existing) {
    // Update stock if cloning again
    if (overrides?.stockQuantity) {
      const updated = updateCompanyProduct(existing.id, {
        stockQuantity: existing.stockQuantity + (overrides.stockQuantity || 0),
        isActive: overrides.isActive ?? existing.isActive,
        updatedAt: new Date().toISOString(),
      })
      return updated || existing
    }
    return existing
  }

  // Generate unique SKU
  const finalSku = generateFinalSku(company.alias)
  
  // Create CompanyProduct
  const products = getCompanyProducts()
  const deterministicId = `cp_${companyId}_${baseProductId}`
  
  const newProduct: CompanyProduct = {
    id: deterministicId,
    companyId,
    baseProductId,
    name: baseProduct.name,
    description: baseProduct.description,
    slug: baseProduct.slug,
    images: baseProduct.images || [],
    category: baseProduct.category,
    price: overrides?.price ?? baseProduct.price ?? 0,
    pointsCost: overrides?.pointsCost ?? 1000,
    stockQuantity: overrides?.stockQuantity ?? 100,
    finalSku,
    ncm: baseProduct.ncm, // Herda NCM do BaseProduct
    isActive: overrides?.isActive ?? true,
    isDigital: baseProduct.isDigital ?? false, // Herda flag digital do BaseProduct
    status: "active",
    tags: overrides?.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replicatedAt: new Date().toISOString(),
    replicatedBy: "direct_clone",
  }

  products.push(newProduct)
  saveCompanyProducts(products)
  
  return newProduct
}

/**
 * Ensures company products are seeded with images
 * Call this when loading the catalog page
 */
export function ensureCompanyProductsWithImages(companyId: string): void {
  seedDemoCompanyProducts(companyId)
}

export function createCompany(data: Partial<Company>): Company {
  const companies = getCompanies()
  const newCompany: Company = {
    id: data.id || `company_${Date.now()}`,
    name: data.name || "",
    alias: data.alias || (data.name ? data.name.substring(0, 4).toUpperCase() : "COMP"),
    domain: data.domain,
    logo: data.logo,
    primaryColor: data.primaryColor || "#10b981",
    secondaryColor: data.secondaryColor || "#059669",
    defaultPointsMultiplier: data.defaultPointsMultiplier || 1.0,
    allowMixedPayment: data.allowMixedPayment ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: data.isActive ?? true,
    ...data,
  }
  companies.push(newCompany)
  saveCompanies(companies)
  
  // Seed products for the new company
  seedCompanyProducts(newCompany.id)
  
  return newCompany
}

export function updateCompany(id: string, data: Partial<Company>): Company | null {
  const companies = getCompanies()
  const index = companies.findIndex((c) => c.id === id)
  if (index === -1) return null

  companies[index] = {
    ...companies[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveCompanies(companies)
  return companies[index]
}

/**
 * Atualiza a configuração de tour de ajuda da empresa
 */
export function updateCompanyHelpSetting(companyId: string, enabled: boolean): void {
  updateCompany(companyId, { helpTourEnabled: enabled })
}

/**
 * Obtém o progresso do tour do usuário
 */
export function getTourProgress(): Record<string, boolean> {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_tour_progress")
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

/**
 * Salva o progresso do tour do usuário
 */
export function saveTourProgress(tourId: string, completed: boolean): void {
  const storage = getStorage()
  const progress = getTourProgress()
  progress[tourId] = completed
  storage.setItem("yoobe_tour_progress", JSON.stringify(progress))
}

/**
 * Verifica se um tour foi completado
 */
export function isTourCompleted(tourId: string): boolean {
  const progress = getTourProgress()
  return progress[tourId] === true
}

// ===========================================
// V3 STORAGE FUNCTIONS - STORES
// ===========================================

const initialStores: Store[] = [
  {
    id: "store_1",
    companyId: "company_1",
    name: "Loja Principal Yoobe",
    domain: "loja.yoobe.co",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
]

export function getStores(): Store[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_stores_v3")
  if (!stored) {
    storage.setItem("yoobe_stores_v3", JSON.stringify(initialStores))
    return initialStores
  }
  return safeParse(stored, initialStores)
}

export function saveStores(stores: Store[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_stores_v3", JSON.stringify(stores))
}

export function getStoreById(id: string): Store | undefined {
  const stores = getStores()
  return stores.find((s) => s.id === id)
}

export function getStoresByCompany(companyId: string): Store[] {
  const stores = getStores()
  return stores.filter((s) => s.companyId === companyId)
}

export function createStore(data: Partial<Store>): Store {
  const stores = getStores()
  const newStore: Store = {
    id: data.id || `store_${Date.now()}`,
    companyId: data.companyId || "",
    name: data.name || "",
    domain: data.domain,
    logo: data.logo,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: data.isActive ?? true,
    ...data,
  }
  stores.push(newStore)
  saveStores(stores)
  return newStore
}

export function updateStore(id: string, data: Partial<Store>): Store | null {
  const stores = getStores()
  const index = stores.findIndex((s) => s.id === id)
  if (index === -1) return null

  stores[index] = {
    ...stores[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveStores(stores)
  return stores[index]
}

// ===========================================
// V3 STORAGE FUNCTIONS - COMPANY PRODUCTS
// ===========================================

const initialCompanyProducts: CompanyProduct[] = []

export function getCompanyProducts(): CompanyProduct[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_company_products_v3")
  
  let products: CompanyProduct[]
  if (!stored) {
    storage.setItem("yoobe_company_products_v3", JSON.stringify(initialCompanyProducts))
    products = initialCompanyProducts
  } else {
    products = safeParse(stored, initialCompanyProducts)
  }

  // Migration: ensure deterministic IDs
  let modified = false
  const seenIds = new Set<string>()
  
  const migratedProducts = products.map(p => {
    // Some products might not have baseProductId if created manually without it, but for demo they should
    if (!p.baseProductId || !p.companyId) {
      return p
    }
    
    const deterministicId = `cp_${p.companyId}_${p.baseProductId}`
    if (p.id !== deterministicId) {
      modified = true
      return { ...p, id: deterministicId }
    }
    return p
  }).filter(p => {
    // Deduplicate during migration
    if (seenIds.has(p.id)) {
      modified = true
      return false
    }
    seenIds.add(p.id)
    return true
  })
  
  if (modified) {
    storage.setItem("yoobe_company_products_v3", JSON.stringify(migratedProducts))
    return migratedProducts
  }
  
  return products
}

export function saveCompanyProducts(products: CompanyProduct[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_company_products_v3", JSON.stringify(products))
}

export function getCompanyProductById(id: string): CompanyProduct | undefined {
  const products = getCompanyProducts()
  return products.find((p) => p.id === id)
}

export function getCompanyProductsByCompany(companyId: string): CompanyProduct[] {
  const products = getCompanyProducts()
  let companyProducts = products.filter((p) => p.companyId === companyId)
  
  // Para fins de demo, se a empresa não tiver produtos, faz o seed automático com imagens
  if (companyProducts.length === 0) {
    seedDemoCompanyProducts(companyId)
    return getCompanyProducts().filter((p) => p.companyId === companyId)
  }
  
  // Check if existing products need image updates or stock sync (for demo)
  const productsNeedingImages = companyProducts.filter(p => !p.images || p.images.length === 0 || p.images[0] === "/placeholder.jpg")
  
  // Check if stock differs from demo data (for testing low stock scenarios)
  const productsNeedingStockSync = companyProducts.filter(p => {
    const demoMatch = DEMO_COMPANY_PRODUCTS_DATA.find(dp => 
      p.name.includes(dp.name.substring(0, 15)) || dp.name.includes(p.name.substring(0, 15))
    )
    return demoMatch && p.stockQuantity !== demoMatch.stockQuantity
  })
  
  if (productsNeedingImages.length > 0 || productsNeedingStockSync.length > 0) {
    // Trigger update
    seedDemoCompanyProducts(companyId)
    return getCompanyProducts().filter((p) => p.companyId === companyId)
  }
  
  // Migrate NCM: Check if existing products need NCM updates from BaseProducts
  const productsNeedingNCM = companyProducts.filter(p => !p.ncm && p.baseProductId)
  if (productsNeedingNCM.length > 0) {
    const allProducts = getCompanyProducts()
    let modified = false
    const updatedProducts = allProducts.map(p => {
      if (!p.ncm && p.baseProductId && p.companyId === companyId) {
        const baseProduct = getBaseProductById(p.baseProductId)
        if (baseProduct?.ncm) {
          modified = true
          return { ...p, ncm: baseProduct.ncm }
        }
      }
      return p
    })
    if (modified) {
      saveCompanyProducts(updatedProducts)
      return updatedProducts.filter(p => p.companyId === companyId)
    }
  }
  
  return companyProducts
}

export function getCompanyProductByBaseProduct(companyId: string, baseProductId: string): CompanyProduct | undefined {
  const products = getCompanyProducts()
  return products.find((p) => p.companyId === companyId && p.baseProductId === baseProductId)
}

export function getCompanyProductByFinalSku(companyId: string, finalSku: string): CompanyProduct | undefined {
  const products = getCompanyProducts()
  return products.find((p) => p.companyId === companyId && p.finalSku === finalSku)
}

/**
 * Gera um SKU final único para a empresa
 * Formato: <ALIAS>-<SEQ> (ex: PRIO-000123)
 */
function generateFinalSku(companyAlias: string): string {
  const products = getCompanyProducts()
  const companyProducts = products.filter((p) => {
    const company = getCompanyById(p.companyId)
    return company?.alias === companyAlias
  })

  const seq = companyProducts.length + 1
  return `${companyAlias}-${String(seq).padStart(6, "0")}`
}

/**
 * Valida EAN-13 (12 ou 13 dígitos com checksum)
 */
function validateEAN13(ean: string): boolean {
  if (!ean) return true // EAN opcional
  const digits = ean.replace(/\D/g, "")
  if (digits.length !== 12 && digits.length !== 13) return false
  // Validação básica de checksum (simplificada para demo)
  return /^\d{12,13}$/.test(digits)
}

/**
 * REPLICAÇÃO IDEMPOTENTE
 * Clona um BaseProduct para CompanyProduct
 * Retorna status "skipped" se já existir
 */
export interface ReplicationResult {
  status: "created" | "updated" | "skipped"
  product?: CompanyProduct
  duplicates?: CompanyProduct[]
  error?: string
}

/**
 * Log de Replicação
 */
export interface ReplicationLog {
  id: string
  budgetId?: string
  companyId: string
  baseProductId?: string
  actorId: string
  action: "replicate_single" | "replicate_budget" | "update" | "cancel"
  status: "success" | "partial" | "failed"
  results: ReplicationResult[]
  errors?: string[]
  summary: {
    total: number
    created: number
    updated: number
    skipped: number
    failed: number
  }
  metadata?: {
    dryRun?: boolean
    source?: string
  }
  createdAt: string
  completedAt?: string
}

/**
 * Configurações da Loja
 */
export interface StoreSettings {
  companyId: string
  redemptionTypes: {
    points: boolean
    pix: boolean
    card: boolean // Cartão de crédito/débito
    free: boolean
  }
  features: {
    gamification: boolean
    achievements: boolean
    cashback: boolean
    swagTrack: boolean
    sendGifts: boolean
  }
  branding: {
    primaryColor: string
    customDomain?: string
  }
  currency: {
    name: string // Nome singular da moeda (ex: "ponto")
    plural: string // Nome plural da moeda (ex: "pontos")
    abbreviation: string // Abreviação (ex: "BRTS", "PTS")
    symbol: string // Símbolo (ex: "₿", "★", "◆")
    icon: string // URL ou emoji do ícone
    primaryColor: string // Cor primária da moeda
    secondaryColor: string // Cor secundária da moeda
    badgeType?: 'gold' | 'silver' | 'bronze' | 'custom' // Tipo de badge visual para moeda
  }
  gamification: {
    showDashboard: boolean
    showRankings: boolean
    showTicker: boolean
    celebrateAchievements: boolean
    badgesEnabled?: boolean // Habilitar sistema de badges de moeda
  }
  updatedAt: string
}

/**
 * Transação de Budget entre times
 */
export interface BudgetTransaction {
  id: string
  teamId: string
  type: "allocation" | "usage" | "transfer_in" | "transfer_out" | "adjustment"
  amount: number
  description: string
  relatedOrderId?: string
  performedBy: string
  createdAt: string
}

/**
 * Solicitação de Verba
 */
export interface BudgetRequest {
  id: string
  teamId: string
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected"
  requestedBy: string
  requestedAt: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

/**
 * Budget de Time/Departamento
 */
export interface TeamBudget {
  id: string
  companyId: string
  teamId: string
  teamName: string
  allocatedAmount: number // Verba alocada
  usedAmount: number // Verba utilizada
  availableAmount: number // Saldo disponível
  requests: BudgetRequest[] // Solicitações pendentes
  history: BudgetTransaction[] // Histórico
  createdAt: string
  updatedAt: string
}

/**
 * Estatísticas da moeda gamificada
 */
export interface CurrencyStats {
  companyId: string
  totalCirculating: number // Total de moedas em circulação
  totalTransactions24h: number // Volume de transações nas últimas 24h
  totalRedemptions: number // Total de resgates
  engagementIndex: number // Índice de engajamento (0-100)
  allTimeHigh: number // Maior saldo já atingido
  topAccumulators: { userId: string; userName: string; balance: number }[]
  topSpenders: { userId: string; userName: string; spent: number }[]
  recentTransactions: PointsTransaction[]
  dailyVolume: { date: string; volume: number }[]
  updatedAt: string
}

/**
 * Seções configuráveis da loja
 */
export interface StoreSection {
  id: string
  enabled: boolean
  title?: string
  subtitle?: string
  image?: string
  backgroundColor?: string
  textColor?: string
  [key: string]: unknown
}

/**
 * Banner de comunicação global da Yoobe
 */
export interface AdminBanner {
  id: string
  title: string
  message: string
  ctaText?: string
  ctaLink?: string
  type: "info" | "warning" | "success" | "promotion"
  active: boolean
  backgroundImage?: string
  dismissible: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Badge Style for gamification display
 */
export type BadgeStyle = "default" | "minimal" | "glass" | "corporate" | "fun"

/**
 * Custom level configuration override
 */
export interface LevelCustomization {
  customIcon?: string // URL to custom icon or emoji
  customLabel?: string // Custom label override
  customColor?: string // Custom color override
  customMinPoints?: number // Custom minimum points for this level
  customMultiplier?: number // Custom multiplier for this level
}

/**
 * Merged level config with customizations
 */
export interface LevelConfigWithCustomization {
  minPoints: number
  multiplier: number
  color: string
  label: string
  icon?: string
}

/**
 * Company-specific achievement (customizable per company)
 */
export interface CompanyAchievement {
  id: string
  companyId: string
  name: string
  description: string
  icon: string
  category: string
  criteria: {
    type: "automatic" | "manual"
    condition: string
    target?: number
  }
  points: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Gamification settings for the company
 */
export interface GamificationSettings {
  enabled: boolean
  showBadgeForMembers: boolean
  showBadgeInStore: boolean
  badgeStyle: BadgeStyle
  showProgressBar: boolean
  showPointsBalance: boolean
  levelCustomizations: {
    bronze?: LevelCustomization
    silver?: LevelCustomization
    gold?: LevelCustomization
    platinum?: LevelCustomization
    diamond?: LevelCustomization
  }
}

/**
 * Configuração de Aparência da Loja (por Company)
 */
/**
 * Paleta de cores predefinida para Fun Mode
 */
export interface FunColorPalette {
  id: string
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  preview: string[] // Array de 3 cores para preview
}

/**
 * Paletas de cores disponíveis para Fun Mode
 */
export const FUN_COLOR_PALETTES: FunColorPalette[] = [
  {
    id: "violet-cyan",
    name: "Violeta & Ciano",
    description: "Moderno e vibrante, inspirado em interfaces tech",
    primaryColor: "#7c3aed",
    secondaryColor: "#06b6d4",
    accentColor: "#f43f5e",
    preview: ["#7c3aed", "#06b6d4", "#f43f5e"],
  },
  {
    id: "sunset",
    name: "Pôr do Sol",
    description: "Tons quentes de laranja, rosa e coral",
    primaryColor: "#f97316",
    secondaryColor: "#ec4899",
    accentColor: "#fbbf24",
    preview: ["#f97316", "#ec4899", "#fbbf24"],
  },
  {
    id: "ocean",
    name: "Oceano",
    description: "Azuis profundos com toques de verde água",
    primaryColor: "#0ea5e9",
    secondaryColor: "#14b8a6",
    accentColor: "#6366f1",
    preview: ["#0ea5e9", "#14b8a6", "#6366f1"],
  },
  {
    id: "forest",
    name: "Floresta",
    description: "Verdes naturais com toques de terra",
    primaryColor: "#22c55e",
    secondaryColor: "#84cc16",
    accentColor: "#a16207",
    preview: ["#22c55e", "#84cc16", "#a16207"],
  },
  {
    id: "candy",
    name: "Candy",
    description: "Rosa e roxo doce, lúdico e divertido",
    primaryColor: "#d946ef",
    secondaryColor: "#f472b6",
    accentColor: "#a855f7",
    preview: ["#d946ef", "#f472b6", "#a855f7"],
  },
  {
    id: "neon",
    name: "Neon",
    description: "Cores neon intensas, estilo cyberpunk",
    primaryColor: "#22d3ee",
    secondaryColor: "#a3e635",
    accentColor: "#f0abfc",
    preview: ["#22d3ee", "#a3e635", "#f0abfc"],
  },
  {
    id: "royal",
    name: "Realeza",
    description: "Dourado e roxo elegante, sofisticado",
    primaryColor: "#8b5cf6",
    secondaryColor: "#fbbf24",
    accentColor: "#dc2626",
    preview: ["#8b5cf6", "#fbbf24", "#dc2626"],
  },
  {
    id: "monochrome",
    name: "Monocromático",
    description: "Tons de cinza com acento colorido",
    primaryColor: "#6b7280",
    secondaryColor: "#9ca3af",
    accentColor: "#3b82f6",
    preview: ["#6b7280", "#9ca3af", "#3b82f6"],
  },
]

export interface FunModeSettings {
  enabled: boolean
  selectedPaletteId: string // ID da paleta selecionada
  primaryColor: string // Cor primária (pode ser da paleta ou customizada)
  secondaryColor: string // Cor secundária
  accentColor: string // Cor de destaque
  enableCardEffects: boolean // Card hover effects, shine, glassmorphism
  enableButtonEffects: boolean // Button glow, gradient animations
  enableBackgroundEffects: boolean // Background gradients and patterns
  enableIconEffects: boolean // Icon glow and animations
}

export const DEFAULT_FUN_MODE_SETTINGS: FunModeSettings = {
  enabled: true,
  selectedPaletteId: "violet-cyan",
  primaryColor: "#7c3aed", // Electric Violet
  secondaryColor: "#06b6d4", // Vibrant Cyan
  accentColor: "#f43f5e", // Hot Coral
  enableCardEffects: true,
  enableButtonEffects: true,
  enableBackgroundEffects: true,
  enableIconEffects: true,
}

/**
 * Configurações globais de Fun Mode (controlado pelo Super Admin)
 */
export interface GlobalFunModeConfig {
  availablePaletteIds: string[] // Paletas disponíveis para gestores
  allowCustomColors: boolean // Permitir cores personalizadas
  defaultPaletteId: string // Paleta padrão
}

export const DEFAULT_GLOBAL_FUN_CONFIG: GlobalFunModeConfig = {
  availablePaletteIds: FUN_COLOR_PALETTES.map(p => p.id), // Todas disponíveis por padrão
  allowCustomColors: true,
  defaultPaletteId: "violet-cyan",
}

/**
 * Obtém configuração global de Fun Mode
 */
export function getGlobalFunModeConfig(): GlobalFunModeConfig {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_global_fun_config")
  if (!stored) return DEFAULT_GLOBAL_FUN_CONFIG
  try {
    return { ...DEFAULT_GLOBAL_FUN_CONFIG, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_GLOBAL_FUN_CONFIG
  }
}

/**
 * Salva configuração global de Fun Mode
 */
export function saveGlobalFunModeConfig(config: GlobalFunModeConfig): void {
  const storage = getStorage()
  storage.setItem("yoobe_global_fun_config", JSON.stringify(config))
}

/**
 * Obtém paletas disponíveis para um gestor
 */
export function getAvailableFunPalettes(): FunColorPalette[] {
  const globalConfig = getGlobalFunModeConfig()
  return FUN_COLOR_PALETTES.filter(p => globalConfig.availablePaletteIds.includes(p.id))
}

/**
 * Obtém uma paleta pelo ID
 */
export function getFunPaletteById(id: string): FunColorPalette | undefined {
  return FUN_COLOR_PALETTES.find(p => p.id === id)
}

export interface CompanyAppearance {
  companyId: string
  theme: "light" | "dark" | "fun"
  colors: {
    primary: string
    secondary: string
    background?: string
    accent?: string
  }
  sections: {
    hero: StoreSection
    badges: StoreSection
    categories: StoreSection
    grid: StoreSection
    [key: string]: StoreSection
  }
  sectionOrder: string[]
  gamification?: GamificationSettings
  funSettings?: FunModeSettings
  updatedAt: string
}

/**
 * Configuração de Aparência da Loja (por Store - override)
 */
export interface StoreAppearance {
  storeId: string
  companyId: string
  theme?: "light" | "dark" | "fun"
  colors?: {
    primary?: string
    secondary?: string
    background?: string
    accent?: string
  }
  sections?: {
    [key: string]: Partial<StoreSection>
  }
  sectionOrder?: string[]
  updatedAt: string
}

/**
 * Aparência resolvida (company default + store override)
 */
export interface ResolvedAppearance {
  theme: "light" | "dark" | "fun"
  colors: {
    primary: string
    secondary: string
    background: string
    accent: string
  }
  sections: {
    [key: string]: StoreSection
  }
  sectionOrder: string[]
}

/**
 * Interface de Landing Page customizável
 */
export interface LandingPage {
  id: string
  companyId: string
  title: string
  slug: string
  type: "onboarding" | "campaign"
  welcomeTitle: string
  welcomeMessage: string
  ctaText: string
  bannerUrl?: string
  bannerText?: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  productIds: string[]
  assignedTags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function replicateProduct(
  baseProductId: string,
  companyId: string,
  overrides?: {
    price?: number
    pointsCost?: number
    stockQuantity?: number
    isActive?: boolean
    tags?: string[]
    ean13?: string
  },
  actorId?: string
): ReplicationResult {
  const baseProduct = getBaseProductById(baseProductId)
  if (!baseProduct) {
    return { status: "skipped", error: "BaseProduct não encontrado" }
  }

  const company = getCompanyById(companyId)
  if (!company) {
    return { status: "skipped", error: "Company não encontrada" }
  }

  // Verificar se já existe (idempotência)
  const existing = getCompanyProductByBaseProduct(companyId, baseProductId)
  if (existing) {
    // Atualizar se houver overrides
    if (overrides) {
      const updated = updateCompanyProduct(existing.id, {
        ...overrides,
        updatedAt: new Date().toISOString(),
      })
      return { status: "updated", product: updated || existing }
    }
    return { status: "skipped", product: existing, duplicates: [existing] }
  }

  // Gerar SKU final
  const finalSku = generateFinalSku(company.alias)

  // Validar EAN se fornecido
  if (overrides?.ean13 && !validateEAN13(overrides.ean13)) {
    return { status: "skipped", error: "EAN-13 inválido" }
  }

  // Criar CompanyProduct
  const products = getCompanyProducts()
  // Deterministic ID to avoid mismatch between client and server
  const deterministicId = `cp_${companyId}_${baseProductId}`
  const newProduct: CompanyProduct = {
    id: deterministicId,
    companyId,
    baseProductId,
    name: baseProduct.name,
    description: baseProduct.description,
    slug: baseProduct.slug,
    images: baseProduct.images || [],
    category: baseProduct.category,
    price: overrides?.price ?? 0,
    pointsCost: overrides?.pointsCost ?? 0,
    stockQuantity: overrides?.stockQuantity ?? 0,
    finalSku,
    ean13: overrides?.ean13,
    ncm: baseProduct.ncm, // Herda NCM do BaseProduct
    isActive: overrides?.isActive ?? false,
    isDigital: baseProduct.isDigital ?? false, // Herda flag digital do BaseProduct
    status: overrides?.isActive ? "active" : "pending",
    tags: overrides?.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replicatedAt: new Date().toISOString(),
    replicatedBy: actorId,
  }

  // Validar campos mínimos
  if (newProduct.price < 0 || newProduct.pointsCost < 0) {
    return { status: "skipped", error: "Preço e pontos devem ser >= 0" }
  }

  // Se não tem preço/estoque/tags obrigatórias, desativar
  if (!newProduct.price && !newProduct.pointsCost && newProduct.stockQuantity === 0) {
    newProduct.isActive = false
    newProduct.status = "pending"
  }

  products.push(newProduct)
  saveCompanyProducts(products)

  return { status: "created", product: newProduct }
}

export function createCompanyProduct(data: Partial<CompanyProduct>): CompanyProduct {
  const products = getCompanyProducts()
  const newProduct: CompanyProduct = {
    id: data.id || `cp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    companyId: data.companyId || "",
    baseProductId: data.baseProductId || "",
    name: data.name || "",
    description: data.description || "",
    slug: data.slug,
    images: data.images || [],
    category: data.category || "Outros",
    price: data.price ?? 0,
    pointsCost: data.pointsCost ?? 0,
    stockQuantity: data.stockQuantity ?? 0,
    finalSku: data.finalSku || "",
    ean13: data.ean13,
    isActive: data.isActive ?? false,
    status: data.status || "pending",
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  }
  products.push(newProduct)
  saveCompanyProducts(products)
  return newProduct
}

export function updateCompanyProduct(id: string, data: Partial<CompanyProduct>): CompanyProduct | null {
  const products = getCompanyProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveCompanyProducts(products)
  return products[index]
}

// ===========================================
// SERVER-SAFE STORAGE PROVIDER
// ===========================================

/**
 * Server-safe storage provider that works in both client and server environments.
 * Uses localStorage on the client and globalThis.__demoLocalStorage on the server.
 */
function getStorage(): Storage {
  if (typeof window !== "undefined") {
    return window.localStorage
  }
  
  // Server-side: use global storage
  if (typeof globalThis !== "undefined") {
    if (!globalThis.__demoLocalStorage) {
      globalThis.__demoLocalStorage = new Map<string, string>()
    }
    const storage = globalThis.__demoLocalStorage
    return {
      getItem: (key: string) => storage.get(key) || null,
      setItem: (key: string, value: string) => {
        storage.set(key, value)
      },
      removeItem: (key: string) => {
        storage.delete(key)
      },
      clear: () => {
        storage.clear()
      },
      get length() {
        return storage.size
      },
      key: (index: number) => {
        const keys = Array.from(storage.keys())
        return keys[index] || null
      },
    } as Storage
  }
  
  // Fallback: in-memory storage
  const memoryStorage = new Map<string, string>()
  return {
    getItem: (key: string) => memoryStorage.get(key) || null,
    setItem: (key: string, value: string) => {
      memoryStorage.set(key, value)
    },
    removeItem: (key: string) => {
      memoryStorage.delete(key)
    },
    clear: () => {
      memoryStorage.clear()
    },
    get length() {
      return memoryStorage.size
    },
    key: (index: number) => {
      const keys = Array.from(memoryStorage.keys())
      return keys[index] || null
    },
  } as Storage
}

// ===========================================
// V3 STORAGE FUNCTIONS - BUDGETS
// ===========================================

const initialBudgets: Budget[] = []
const initialBudgetItems: BudgetItem[] = []

export function getBudgets(): Budget[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_budgets_v3")
  if (!stored) {
    storage.setItem("yoobe_budgets_v3", JSON.stringify(initialBudgets))
    return initialBudgets
  }
  const parsed = JSON.parse(stored)
  return parsed
}

export function saveBudgets(budgets: Budget[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_budgets_v3", JSON.stringify(budgets))
}

export function getBudgetById(id: string): Budget | undefined {
  const budgets = getBudgets()
  return budgets.find((b) => b.id === id)
}

export function getBudgetsByCompany(companyId: string): Budget[] {
  const budgets = getBudgets()
  return budgets.filter((b) => b.companyId === companyId)
}

export function createBudget(data: Partial<Budget>): Budget {
  const budgets = getBudgets()
  const newBudget: Budget = {
    id: data.id || `budget_${Date.now()}`,
    companyId: data.companyId || "",
    customerCompanyId: data.customerCompanyId,
    title: data.title || "",
    status: data.status || "draft",
    budgetType: data.budgetType || "new",
    sourceProductId: data.sourceProductId,
    totalCash: 0,
    totalPoints: 0,
    createdBy: data.createdBy || "",
    updatedBy: data.updatedBy || data.createdBy || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meta: data.meta,
    ...data,
  }
  budgets.push(newBudget)
  saveBudgets(budgets)
  return newBudget
}

export function updateBudget(id: string, data: Partial<Budget>, skipRecalculation: boolean = false): Budget | null {
  const budgets = getBudgets()
  const index = budgets.findIndex((b) => b.id === id)
  if (index === -1) return null

  const updates: Partial<Budget> = { ...data }
  
  // Atualizar timestamps baseado no status
  const now = new Date().toISOString()
  switch (data.status) {
    case "submitted":
      updates.submittedAt = now
      break
    case "reviewed":
      updates.reviewedAt = now
      break
    case "awaiting_approval":
      updates.awaitingApprovalAt = now
      break
    case "approved":
      updates.approvedAt = now
      break
    case "awaiting_payment":
      updates.awaitingPaymentAt = now
      break
    case "payment_confirmed":
      updates.paymentConfirmedAt = now
      break
    case "in_production":
      updates.inProductionAt = now
      break
    case "in_stock":
      updates.inStockAt = now
      break
    case "available":
      updates.availableAt = now
      break
    case "published":
      updates.publishedAt = now
      break
    case "released":
      updates.releasedAt = now
      break
    case "replicated":
      updates.replicatedAt = now
      break
  }

  budgets[index] = {
    ...budgets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  // Recalcular totais se não for uma atualização de totais e não for solicitado pular
  if (!skipRecalculation && !(data.totalCash !== undefined || data.totalPoints !== undefined)) {
    const items = getBudgetItemsByBudget(id)
    budgets[index].totalCash = items.reduce((sum, item) => sum + item.subtotalCash, 0)
    budgets[index].totalPoints = items.reduce((sum, item) => sum + item.subtotalPoints, 0)
  }

  saveBudgets(budgets)
  return budgets[index]
}

export function getBudgetItems(): BudgetItem[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_budget_items_v3")
  if (!stored) {
    storage.setItem("yoobe_budget_items_v3", JSON.stringify(initialBudgetItems))
    return initialBudgetItems
  }
  return JSON.parse(stored)
}

export function saveBudgetItems(items: BudgetItem[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_budget_items_v3", JSON.stringify(items))
}

export function getBudgetItemsByBudget(budgetId: string): BudgetItem[] {
  const items = getBudgetItems()
  return items.filter((i) => i.budgetId === budgetId)
}

export function createBudgetItem(data: Partial<BudgetItem>): BudgetItem {
  const items = getBudgetItems()
  const qty = data.qty ?? 1
  const unitPrice = data.unitPrice ?? 0
  const unitPoints = data.unitPoints ?? 0

  const newItem: BudgetItem = {
    id: data.id || `item_${Date.now()}`,
    budgetId: data.budgetId || "",
    baseProductId: data.baseProductId || "",
    qty,
    unitPrice,
    unitPoints,
    subtotalCash: qty * unitPrice,
    subtotalPoints: qty * unitPoints,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  }
  items.push(newItem)
  saveBudgetItems(items)
  
  // Recalcular totais do budget
  if (newItem.budgetId) {
    calculateBudgetTotals(newItem.budgetId)
  }
  
  return newItem
}

export function updateBudgetItem(id: string, data: Partial<BudgetItem>): BudgetItem | null {
  const items = getBudgetItems()
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null

  const current = items[index]
  const qty = data.qty ?? current.qty
  const unitPrice = data.unitPrice ?? current.unitPrice
  const unitPoints = data.unitPoints ?? current.unitPoints

  items[index] = {
    ...current,
    ...data,
    qty,
    unitPrice,
    unitPoints,
    subtotalCash: qty * unitPrice,
    subtotalPoints: qty * unitPoints,
    updatedAt: new Date().toISOString(),
  }
  saveBudgetItems(items)
  
  // Recalcular totais do budget
  calculateBudgetTotals(current.budgetId)
  
  return items[index]
}

export function deleteBudgetItem(id: string): boolean {
  const items = getBudgetItems()
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return false

  const budgetId = items[index].budgetId
  items.splice(index, 1)
  saveBudgetItems(items)
  
  // Recalcular totais do budget
  if (budgetId) {
    calculateBudgetTotals(budgetId)
  }
  
  return true
}

/**
 * Calcula totais do budget (STORED/trigger)
 */
export function calculateBudgetTotals(budgetId: string): void {
  const budget = getBudgetById(budgetId)
  if (!budget) return

  const items = getBudgetItemsByBudget(budgetId)
  const totalCash = items.reduce((sum, item) => sum + item.subtotalCash, 0)
  const totalPoints = items.reduce((sum, item) => sum + item.subtotalPoints, 0)

  // Verificar se os valores realmente mudaram antes de atualizar
  // Isso evita atualizações desnecessárias e ajuda a prevenir loops
  if (budget.totalCash === totalCash && budget.totalPoints === totalPoints) {
    return // Nenhuma mudança, não precisa atualizar
  }

  // Usar skipRecalculation=true para evitar recursão infinita
  // já que estamos atualizando os totais que calculateBudgetTotals calcula
  updateBudget(budgetId, {
    totalCash,
    totalPoints,
  }, true) // skipRecalculation = true
}

// ===========================================
// BUDGET APPROVAL MANAGEMENT (Super Admin)
// ===========================================

/**
 * Get all budgets across all companies (for Super Admin)
 */
export function getAllBudgets(): Budget[] {
  return getBudgets()
}

/**
 * Get all budgets with a specific status
 */
export function getBudgetsByStatus(status: BudgetStatus): Budget[] {
  const budgets = getBudgets()
  return budgets.filter(b => b.status === status)
}

/**
 * Get pending budgets (submitted, awaiting review)
 */
export function getPendingBudgets(): Budget[] {
  const budgets = getBudgets()
  return budgets.filter(b => b.status === "submitted" || b.status === "reviewed")
}

/**
 * Interface for budget with enriched data
 */
export interface BudgetWithDetails extends Budget {
  items: BudgetItem[]
  company?: Company
  itemCount: number
}

/**
 * Get budget with all its items and company details
 */
export function getBudgetWithDetails(budgetId: string): BudgetWithDetails | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null

  const items = getBudgetItemsByBudget(budgetId)
  const company = getCompanyById(budget.companyId)

  return {
    ...budget,
    items,
    company,
    itemCount: items.length,
  }
}

/**
 * Get all budgets with details (for listing)
 */
export function getAllBudgetsWithDetails(): BudgetWithDetails[] {
  const budgets = getBudgets()
  return budgets.map(budget => {
    const items = getBudgetItemsByBudget(budget.id)
    const company = getCompanyById(budget.companyId)
    return {
      ...budget,
      items,
      company,
      itemCount: items.length,
    }
  })
}

/**
 * Mark budget as reviewed (admin opened it)
 */
export function markBudgetAsReviewed(budgetId: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  // Only mark as reviewed if it was submitted
  if (budget.status !== "submitted") return budget
  
  return updateBudget(budgetId, {
    status: "reviewed",
  })
}

/**
 * Approve a budget
 */
export function approveBudget(budgetId: string, approverId: string, notes?: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  return updateBudget(budgetId, {
    status: "approved",
    updatedBy: approverId,
    meta: {
      ...budget.meta,
      approvalNotes: notes,
      approvedBy: approverId,
    },
  })
}

/**
 * Reject a budget with reason
 */
export function rejectBudget(budgetId: string, approverId: string, reason: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  return updateBudget(budgetId, {
    status: "rejected",
    updatedBy: approverId,
    meta: {
      ...budget.meta,
      rejectionReason: reason,
      rejectedBy: approverId,
    },
  })
}

/**
 * Request changes (send back to client)
 */
export function requestBudgetChanges(budgetId: string, approverId: string, feedback: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  return updateBudget(budgetId, {
    status: "submitted", // Reset to submitted so client can edit
    updatedBy: approverId,
    meta: {
      ...budget.meta,
      changeRequestFeedback: feedback,
      changeRequestedBy: approverId,
      changeRequestedAt: new Date().toISOString(),
    },
  })
}

/**
 * Release an approved budget and automatically replicate products to company catalog
 */
export function releaseBudget(budgetId: string, approverId: string): { 
  budget: Budget | null; 
  replicationResult: { success: boolean; replicatedCount: number; errors: string[] } 
} {
  const budget = getBudgetById(budgetId)
  if (!budget) {
    return { 
      budget: null, 
      replicationResult: { success: false, replicatedCount: 0, errors: ["Budget not found"] } 
    }
  }
  
  if (budget.status !== "approved") {
    console.warn(`[releaseBudget] Budget ${budgetId} is not approved (status: ${budget.status})`)
    return { 
      budget: null, 
      replicationResult: { success: false, replicatedCount: 0, errors: ["Budget must be approved first"] } 
    }
  }
  
  // First mark as released
  updateBudget(budgetId, {
    status: "released",
    updatedBy: approverId,
  })
  
  // Auto-replicate products to company catalog
  const replicationResult = replicateBudgetProductsInternal(budgetId, approverId)
  
  // Update final status based on replication result
  const finalStatus = replicationResult.success ? "replicated" : "released"
  const updatedBudget = updateBudget(budgetId, {
    status: finalStatus,
    updatedBy: approverId,
    meta: {
      ...budget.meta,
      replicatedBy: approverId,
      replicatedProductCount: replicationResult.replicatedCount,
      replicationErrors: replicationResult.errors.length > 0 ? replicationResult.errors : undefined,
    },
  })
  
  return { budget: updatedBudget, replicationResult }
}

/**
 * Internal function to replicate products (used by releaseBudget)
 * For "restock" budgets, updates existing CompanyProduct stock instead of cloning from BaseProduct
 */
function replicateBudgetProductsInternal(budgetId: string, actorId: string): { 
  success: boolean; 
  replicatedCount: number; 
  errors: string[] 
} {
  const budget = getBudgetById(budgetId)
  if (!budget) {
    return { success: false, replicatedCount: 0, errors: ["Budget not found"] }
  }
  
  const items = getBudgetItemsByBudget(budgetId)
  const errors: string[] = []
  let replicatedCount = 0
  
  // Special handling for restock budgets - update existing CompanyProduct stock
  if (budget.budgetType === "restock") {
    for (const item of items) {
      try {
        // First, try to find existing CompanyProduct by ID
        let companyProduct = getCompanyProductById(item.baseProductId)
        
        // If not found, try to find by baseProductId in the company's catalog
        if (!companyProduct) {
          companyProduct = getCompanyProductByBaseProduct(budget.companyId, item.baseProductId)
        }
        
        // If still not found, try to find Product and create CompanyProduct from it
        if (!companyProduct) {
          const product = getProductById(item.baseProductId)
          if (product) {
            // Create a new CompanyProduct from the global Product
            const newProduct = createCompanyProductFromProduct(product, budget.companyId, {
              price: item.unitPrice,
              pointsCost: item.unitPoints,
              stockQuantity: item.qty,
              isActive: true,
            })
            if (newProduct) {
              replicatedCount++
              continue
            }
          }
        }
        
        if (companyProduct) {
          // Update stock quantity (add to existing)
          const updated = updateCompanyProduct(companyProduct.id, {
            stockQuantity: companyProduct.stockQuantity + item.qty,
            updatedAt: new Date().toISOString(),
          })
          if (updated) {
            replicatedCount++
          } else {
            errors.push(`Failed to update stock for product ${item.baseProductId}`)
          }
        } else {
          errors.push(`Product ${item.baseProductId} not found in company catalog`)
        }
      } catch (error) {
        errors.push(`Error restocking ${item.baseProductId}: ${error}`)
      }
    }
    return { success: errors.length === 0, replicatedCount, errors }
  }
  
  // Standard budget - clone from BaseProduct
  for (const item of items) {
    try {
      const result = cloneProductToCompany(
        item.baseProductId,
        budget.companyId,
        {
          price: item.unitPrice,
          pointsCost: item.unitPoints,
          stockQuantity: item.qty,
          isActive: true,
        }
      )
      
      if (result) {
        replicatedCount++
      } else {
        errors.push(`Failed to replicate product ${item.baseProductId}`)
      }
    } catch (error) {
      errors.push(`Error replicating ${item.baseProductId}: ${error}`)
    }
  }
  
  return { success: errors.length === 0, replicatedCount, errors }
}

/**
 * Create a CompanyProduct from a global Product (for restock purposes)
 */
function createCompanyProductFromProduct(
  product: Product,
  companyId: string,
  overrides?: {
    price?: number
    pointsCost?: number
    stockQuantity?: number
    isActive?: boolean
  }
): CompanyProduct | null {
  const company = getCompanyById(companyId)
  if (!company) return null
  
  // Check if already exists
  const existing = getCompanyProducts().find(
    p => p.companyId === companyId && (p.baseProductId === product.id || p.name === product.name)
  )
  if (existing) {
    // Update stock if exists
    if (overrides?.stockQuantity) {
      return updateCompanyProduct(existing.id, {
        stockQuantity: existing.stockQuantity + (overrides.stockQuantity || 0),
        isActive: overrides.isActive ?? existing.isActive,
        updatedAt: new Date().toISOString(),
      }) || existing
    }
    return existing
  }
  
  // Generate unique SKU
  const finalSku = generateFinalSku(company.alias)
  
  const products = getCompanyProducts()
  const deterministicId = `cp_${companyId}_${product.id}`
  
  const newProduct: CompanyProduct = {
    id: deterministicId,
    companyId,
    baseProductId: product.id, // Use Product.id as baseProductId for traceability
    name: product.name,
    description: product.description,
    slug: product.slug,
    images: product.images || [],
    category: product.category,
    price: overrides?.price ?? product.price ?? 0,
    pointsCost: overrides?.pointsCost ?? product.priceInPoints ?? 1000,
    stockQuantity: overrides?.stockQuantity ?? product.stock ?? 100,
    finalSku,
    ncm: product.ncm,
    isActive: overrides?.isActive ?? true,
    isDigital: false,
    tags: product.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  products.push(newProduct)
  saveCompanyProducts(products)
  
  return newProduct
}

/**
 * Replicate products from an approved/released budget to company catalog
 * @deprecated Use releaseBudget instead, which auto-replicates
 */
export function replicateBudgetProducts(budgetId: string, actorId: string): { 
  success: boolean; 
  replicatedCount: number; 
  errors: string[] 
} {
  const budget = getBudgetById(budgetId)
  if (!budget) {
    return { success: false, replicatedCount: 0, errors: ["Budget não encontrado"] }
  }
  
  if (budget.status !== "released" && budget.status !== "approved" && budget.status !== "replicated") {
    return { success: false, replicatedCount: 0, errors: ["Budget precisa estar aprovado ou liberado"] }
  }
  
  // Use the internal replication function
  const result = replicateBudgetProductsInternal(budgetId, actorId)
  
  // Update budget status to replicated if successful
  if (result.success) {
    updateBudget(budgetId, {
      status: "replicated",
      updatedBy: actorId,
      meta: {
        ...budget.meta,
        replicatedBy: actorId,
        replicatedProductCount: result.replicatedCount,
      },
    })
  }
  
  return result
}

/**
 * @deprecated Legacy code - kept for reference, not used
 */
function _legacyReplicateBudgetProducts_unused(budgetId: string, actorId: string): { 
  success: boolean; 
  replicatedCount: number; 
  errors: string[] 
} {
  const budget = getBudgetById(budgetId)
  if (!budget) {
    return { success: false, replicatedCount: 0, errors: ["Budget não encontrado"] }
  }
  
  const items = getBudgetItemsByBudget(budgetId)
  const errors: string[] = []
  let replicatedCount = 0
  
  for (const item of items) {
    try {
      const result = cloneProductToCompany(
        item.baseProductId,
        budget.companyId,
        {
          price: item.unitPrice,
          pointsCost: item.unitPoints,
          stockQuantity: item.qty,
          isActive: true,
        }
      )
      
      if (result) {
        replicatedCount++
      } else {
        errors.push(`Falha ao replicar produto ${item.baseProductId}`)
      }
    } catch (error) {
      errors.push(`Erro ao replicar ${item.baseProductId}: ${error}`)
    }
  }
  
  // Mark budget as replicated
  updateBudget(budgetId, {
    status: "replicated",
    updatedBy: actorId,
    meta: {
      ...budget.meta,
      replicatedBy: actorId,
      replicatedProductCount: replicatedCount,
    },
  })
  
  return { success: errors.length === 0, replicatedCount, errors }
}

// ===========================================
// BUDGET STATUS TRANSITION FUNCTIONS (NEW)
// ===========================================

/**
 * Send final values to gestor for approval
 */
export function sendFinalValuesToGestor(budgetId: string, adminId: string, notes?: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  if (budget.status !== "reviewed") {
    console.warn(`[sendFinalValuesToGestor] Budget ${budgetId} is not reviewed (status: ${budget.status})`)
    return null
  }
  
  return updateBudget(budgetId, {
    status: "awaiting_approval",
    updatedBy: adminId,
    meta: {
      ...budget.meta,
      finalValuesNotes: notes,
      finalValuesSentBy: adminId,
      finalValuesSentAt: new Date().toISOString(),
    },
  })
}

/**
 * Gestor approves the final values from admin
 */
export function approveValuesByGestor(budgetId: string, gestorId: string, notes?: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  if (budget.status !== "awaiting_approval") {
    console.warn(`[approveValuesByGestor] Budget ${budgetId} is not awaiting_approval (status: ${budget.status})`)
    return null
  }
  
  return updateBudget(budgetId, {
    status: "approved",
    updatedBy: gestorId,
    meta: {
      ...budget.meta,
      gestorApprovalNotes: notes,
      gestorApprovedBy: gestorId,
      gestorApprovedAt: new Date().toISOString(),
    },
  })
}

/**
 * Move budget to awaiting payment status
 */
export function setAwaitingPayment(budgetId: string, actorId: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  if (budget.status !== "approved") {
    console.warn(`[setAwaitingPayment] Budget ${budgetId} is not approved (status: ${budget.status})`)
    return null
  }
  
  return updateBudget(budgetId, {
    status: "awaiting_payment",
    updatedBy: actorId,
  })
}

/**
 * Confirm payment for a budget
 */
export function confirmBudgetPayment(budgetId: string, adminId: string, paymentRef?: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  if (budget.status !== "awaiting_payment" && budget.status !== "approved") {
    console.warn(`[confirmBudgetPayment] Budget ${budgetId} is not awaiting_payment or approved (status: ${budget.status})`)
    return null
  }
  
  return updateBudget(budgetId, {
    status: "payment_confirmed",
    updatedBy: adminId,
    meta: {
      ...budget.meta,
      paymentConfirmedBy: adminId,
      paymentConfirmedAt: new Date().toISOString(),
      paymentReference: paymentRef,
    },
  })
}

/**
 * Release budget to production
 */
export function releaseToProduction(budgetId: string, adminId: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  if (budget.status !== "payment_confirmed") {
    console.warn(`[releaseToProduction] Budget ${budgetId} is not payment_confirmed (status: ${budget.status})`)
    return null
  }
  
  return updateBudget(budgetId, {
    status: "in_production",
    updatedBy: adminId,
    meta: {
      ...budget.meta,
      releasedToProductionBy: adminId,
      releasedToProductionAt: new Date().toISOString(),
    },
  })
}

/**
 * Replicate budget items to stock
 */
export function replicateToStock(budgetId: string, adminId: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  if (budget.status !== "in_production") {
    console.warn(`[replicateToStock] Budget ${budgetId} is not in_production (status: ${budget.status})`)
    return null
  }
  
  // Replicate products to company catalog
  const replicationResult = replicateBudgetProductsInternal(budgetId, adminId)
  
  return updateBudget(budgetId, {
    status: "in_stock",
    updatedBy: adminId,
    meta: {
      ...budget.meta,
      replicatedToStockBy: adminId,
      replicatedToStockAt: new Date().toISOString(),
      replicatedProductCount: replicationResult.replicatedCount,
      replicationErrors: replicationResult.errors.length > 0 ? replicationResult.errors : undefined,
    },
  })
}

/**
 * Mark budget products as available for logistics
 */
export function markAsAvailable(budgetId: string, adminId: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  if (budget.status !== "in_stock") {
    console.warn(`[markAsAvailable] Budget ${budgetId} is not in_stock (status: ${budget.status})`)
    return null
  }
  
  return updateBudget(budgetId, {
    status: "available",
    updatedBy: adminId,
    meta: {
      ...budget.meta,
      markedAvailableBy: adminId,
      markedAvailableAt: new Date().toISOString(),
    },
  })
}

/**
 * Publish budget products to store
 */
export function publishToStore(budgetId: string, actorId: string, scheduledDate?: string): Budget | null {
  const budget = getBudgetById(budgetId)
  if (!budget) return null
  
  if (budget.status !== "available") {
    console.warn(`[publishToStore] Budget ${budgetId} is not available (status: ${budget.status})`)
    return null
  }
  
  return updateBudget(budgetId, {
    status: "published",
    updatedBy: actorId,
    scheduledPublishDate: scheduledDate,
    meta: {
      ...budget.meta,
      publishedBy: actorId,
      publishedAt: new Date().toISOString(),
    },
  })
}

/**
 * Create a restock budget from an existing product
 */
export function createRestockBudget(
  companyId: string,
  sourceProductId: string,
  quantity: number,
  createdBy: string,
  createdByName: string
): Budget {
  const budget = createBudget({
    companyId,
    title: `Reposição de Estoque - ${new Date().toLocaleDateString("pt-BR")}`,
    budgetType: "restock",
    sourceProductId,
    status: "draft",
    createdBy,
    requestedById: createdBy,
    requestedByName: createdByName,
    meta: {
      isRestock: true,
      requestedQuantity: quantity,
    },
  })
  
  return budget
}

/**
 * Get budgets by type (new or restock)
 */
export function getBudgetsByType(budgetType: BudgetType): Budget[] {
  const budgets = getBudgets()
  return budgets.filter(b => b.budgetType === budgetType)
}

/**
 * Get restock budgets (shortcut)
 */
export function getRestockBudgets(): Budget[] {
  return getBudgetsByType("restock")
}

/**
 * Get budget statistics for dashboard
 */
export function getBudgetStats(): {
  pending: number
  approvedToday: number
  rejectedToday: number
  totalPendingValue: number
} {
  const budgets = getBudgets()
  const today = new Date().toISOString().split("T")[0]
  
  const pending = budgets.filter(b => b.status === "submitted" || b.status === "reviewed").length
  
  const approvedToday = budgets.filter(b => 
    b.status === "approved" && 
    b.approvedAt?.startsWith(today)
  ).length
  
  const rejectedToday = budgets.filter(b => 
    b.status === "rejected" && 
    b.updatedAt?.startsWith(today)
  ).length
  
  const pendingBudgets = budgets.filter(b => b.status === "submitted" || b.status === "reviewed")
  const totalPendingValue = pendingBudgets.reduce((sum, b) => sum + b.totalCash, 0)
  
  return { pending, approvedToday, rejectedToday, totalPendingValue }
}

// ===========================================
// V3 STORAGE FUNCTIONS - TAGS
// =========================================== 

const initialTagsV3: Tag[] = [
  { id: "tag_1", name: "Premium", slug: "premium", scope: "global", isEligibilityGate: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "tag_2", name: "Executivo", slug: "executivo", scope: "global", isEligibilityGate: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "tag_3", name: "Onboarding", slug: "onboarding", scope: "global", isEligibilityGate: false, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "tag_4", name: "BR-RJ", slug: "br-rj", scope: "global", isEligibilityGate: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "tag_5", name: "BR-SP", slug: "br-sp", scope: "global", isEligibilityGate: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
]

const initialProductTags: ProductTag[] = []
const initialEmployeeTags: EmployeeTag[] = []
const initialReplicationLogs: ReplicationLog[] = []

export function getTagsV3(): Tag[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_tags_v3")
  if (!stored) {
    storage.setItem("yoobe_tags_v3", JSON.stringify(initialTagsV3))
    return initialTagsV3
  }
  return JSON.parse(stored)
}

export function saveTagsV3(tags: Tag[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_tags_v3", JSON.stringify(tags))
}

export function getTagByIdV3(id: string): Tag | undefined {
  const tags = getTagsV3()
  return tags.find((t) => t.id === id)
}

export function getTagsByScopeV3(scope: "global" | "company" | "store", companyId?: string, storeId?: string): Tag[] {
  const tags = getTagsV3()
  return tags.filter((t) => {
    if (t.scope !== scope) return false
    if (scope === "company" && t.companyId !== companyId) return false
    if (scope === "store" && t.storeId !== storeId) return false
    return true
  })
}

export function createTagV3(data: Partial<Tag>): Tag {
  const tags = getTagsV3()
  const slug = data.slug || data.name?.toLowerCase().replace(/\s+/g, "-") || ""
  
  const newTag: Tag = {
    id: data.id || `tag_${Date.now()}`,
    name: data.name || "",
    slug,
    description: data.description,
    scope: data.scope || "global",
    companyId: data.companyId,
    storeId: data.storeId,
    isEligibilityGate: data.isEligibilityGate ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy,
    ...data,
  }
  tags.push(newTag)
  saveTagsV3(tags)
  return newTag
}

export function updateTagV3(id: string, data: Partial<Tag>): Tag | null {
  const tags = getTagsV3()
  const index = tags.findIndex((t) => t.id === id)
  if (index === -1) return null

  tags[index] = {
    ...tags[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveTagsV3(tags)
  return tags[index]
}

export function deleteTagV3(id: string): boolean {
  const tags = getTagsV3()
  const index = tags.findIndex((t) => t.id === id)
  if (index === -1) return false

  tags.splice(index, 1)
  saveTagsV3(tags)
  return true
}

export function getProductTags(): ProductTag[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_product_tags_v3")
  if (!stored) {
    storage.setItem("yoobe_product_tags_v3", JSON.stringify(initialProductTags))
    return initialProductTags
  }
  return JSON.parse(stored)
}

export function saveProductTags(tags: ProductTag[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_product_tags_v3", JSON.stringify(tags))
}

export function addProductTagV3(productId: string, tagId: string, productType: "base" | "company"): ProductTag | null {
  const tags = getProductTags()
  // Verificar unicidade
  const existing = tags.find((t) => t.productId === productId && t.tagId === tagId && t.productType === productType)
  if (existing) return existing

  const newTag: ProductTag = {
    id: `pt_${Date.now()}`,
    productId,
    tagId,
    productType,
    createdAt: new Date().toISOString(),
  }
  tags.push(newTag)
  saveProductTags(tags)
  return newTag
}

export function removeProductTagV3(productId: string, tagId: string, productType: "base" | "company"): boolean {
  const tags = getProductTags()
  const index = tags.findIndex((t) => t.productId === productId && t.tagId === tagId && t.productType === productType)
  if (index === -1) return false

  tags.splice(index, 1)
  saveProductTags(tags)
  return true
}

export function getTagsByProductV3(productId: string, productType: "base" | "company"): Tag[] {
  const productTags = getProductTags()
  const tagIds = productTags
    .filter((pt) => pt.productId === productId && pt.productType === productType)
    .map((pt) => pt.tagId)
  const allTags = getTagsV3()
  return allTags.filter((t) => tagIds.includes(t.id))
}

export function getEmployeeTags(): EmployeeTag[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_employee_tags_v3")
  if (!stored) {
    storage.setItem("yoobe_employee_tags_v3", JSON.stringify([]))
    return []
  }
  return JSON.parse(stored)
}

export function saveEmployeeTags(tags: EmployeeTag[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_employee_tags_v3", JSON.stringify(tags))
}

export function addTagToEmployee(userId: string, tagId: string): EmployeeTag | null {
  const tags = getEmployeeTags()
  // Verificar unicidade
  const existing = tags.find((t) => t.userId === userId && t.tagId === tagId)
  if (existing) return existing

  const newTag: EmployeeTag = {
    id: `et_${Date.now()}`,
    userId,
    tagId,
    createdAt: new Date().toISOString(),
  }
  tags.push(newTag)
  saveEmployeeTags(tags)
  return newTag
}

export function removeTagFromEmployee(userId: string, tagId: string): boolean {
  const tags = getEmployeeTags()
  const index = tags.findIndex((t) => t.userId === userId && t.tagId === tagId)
  if (index === -1) return false

  tags.splice(index, 1)
  saveEmployeeTags(tags)
  return true
}

export function getTagsByEmployeeV3(userId: string): Tag[] {
  const employeeTags = getEmployeeTags()
  const tagIds = employeeTags.filter((et) => et.userId === userId).map((et) => et.tagId)
  const allTags = getTagsV3()
  return allTags.filter((t) => tagIds.includes(t.id))
}

// ===========================================
// V3 STORAGE FUNCTIONS - REPLICATION LOGS
// ===========================================

export function getReplicationLogs(): ReplicationLog[] {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_replication_logs_v3")
  if (!stored) {
    storage.setItem("yoobe_replication_logs_v3", JSON.stringify(initialReplicationLogs))
    return initialReplicationLogs
  }
  return JSON.parse(stored)
}

export function saveReplicationLogs(logs: ReplicationLog[]): void {
  const storage = getStorage()
  storage.setItem("yoobe_replication_logs_v3", JSON.stringify(logs))
}

export function getReplicationLogById(id: string): ReplicationLog | undefined {
  const logs = getReplicationLogs()
  return logs.find((l) => l.id === id)
}

export function getReplicationLogsByCompany(companyId: string): ReplicationLog[] {
  const logs = getReplicationLogs()
  return logs.filter((l) => l.companyId === companyId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getReplicationLogsByBudget(budgetId: string): ReplicationLog[] {
  const logs = getReplicationLogs()
  return logs.filter((l) => l.budgetId === budgetId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function createReplicationLog(data: {
  budgetId?: string
  companyId: string
  baseProductId?: string
  actorId: string
  action: "replicate_single" | "replicate_budget" | "update" | "cancel"
  results: ReplicationResult[]
  errors?: string[]
  metadata?: {
    dryRun?: boolean
    source?: string
  }
}): ReplicationLog {
  const logs = getReplicationLogs()
  
  const created = data.results.filter((r) => r.status === "created").length
  const updated = data.results.filter((r) => r.status === "updated").length
  const skipped = data.results.filter((r) => r.status === "skipped").length
  const failed = data.results.filter((r) => r.error).length

  let status: "success" | "partial" | "failed" = "success"
  if (failed > 0 || (data.errors && data.errors.length > 0)) {
    status = failed === data.results.length ? "failed" : "partial"
  }

  const newLog: ReplicationLog = {
    id: `replog_${Date.now()}`,
    budgetId: data.budgetId,
    companyId: data.companyId,
    baseProductId: data.baseProductId,
    actorId: data.actorId,
    action: data.action,
    status,
    results: data.results,
    errors: data.errors,
    summary: {
      total: data.results.length,
      created,
      updated,
      skipped,
      failed,
    },
    metadata: data.metadata,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  }

  logs.push(newLog)
  saveReplicationLogs(logs)
  return newLog
}

// ===========================================
// V3 STORAGE FUNCTIONS - STORE SETTINGS
// ===========================================

const defaultStoreSettings: Record<string, StoreSettings> = {
  "company_1": {
    companyId: "company_1",
    redemptionTypes: { points: true, pix: true, card: true, free: true },
    features: {
      gamification: true,
      achievements: true,
      cashback: true,
      swagTrack: true,
      sendGifts: true,
    },
    branding: { primaryColor: "#10b981" },
    currency: {
      name: "ponto",
      plural: "pontos",
      abbreviation: "PTS",
      symbol: "₿",
      icon: "⚡",
      primaryColor: "#FFD700",
      secondaryColor: "#FFA500",
      badgeType: 'gold',
    },
    gamification: {
      showDashboard: true,
      showRankings: true,
      showTicker: true,
      celebrateAchievements: true,
      badgesEnabled: true,
    },
    updatedAt: new Date().toISOString(),
  }
}

export function getStoreSettings(companyId: string): StoreSettings {
  const storage = getStorage()
  const stored = storage.getItem(`yoobe_store_settings_${companyId}`)
  if (!stored) {
    const defaults = defaultStoreSettings[companyId] || defaultStoreSettings["company_1"]
    storage.setItem(`yoobe_store_settings_${companyId}`, JSON.stringify(defaults))
    return defaults
  }
  return JSON.parse(stored)
}

export function saveStoreSettings(settings: StoreSettings): void {
  const storage = getStorage()
  storage.setItem(`yoobe_store_settings_${settings.companyId}`, JSON.stringify(settings))
}

/**
 * Obtém o nome da moeda (singular ou plural) baseado nas configurações da loja
 * @param companyId ID da empresa
 * @param plural Se true, retorna o plural; se false, retorna o singular
 * @returns Nome da moeda configurada
 */
export function getCurrencyName(companyId: string, plural: boolean = false): string {
  const settings = getStoreSettings(companyId)
  return plural ? (settings.currency?.plural || "pontos") : (settings.currency?.name || "ponto")
}

// ===========================================
// V3 STORAGE FUNCTIONS - APPEARANCE
// ===========================================

/**
 * Default gamification settings
 */
export const DEFAULT_GAMIFICATION_SETTINGS: GamificationSettings = {
  enabled: true,
  showBadgeForMembers: true,
  showBadgeInStore: true,
  badgeStyle: "default",
  showProgressBar: true,
  showPointsBalance: true,
  levelCustomizations: {},
}

const defaultCompanyAppearance: Record<string, CompanyAppearance> = {
  "company_1": {
    companyId: "company_1",
    theme: "light",
    colors: {
      primary: "#10b981",
      secondary: "#059669",
      background: "#ffffff",
      accent: "#10b981",
    },
    sections: {
      hero: {
        id: "hero",
        enabled: true,
        title: "Bem-vindo à Loja Corporativa",
        subtitle: "Resgate seus pontos e descubra produtos incríveis",
        image: "",
        backgroundColor: "",
        textColor: "",
      },
      badges: {
        id: "badges",
        enabled: true,
        title: "Destaques",
        subtitle: "",
        image: "",
        backgroundColor: "",
        textColor: "",
      },
      categories: {
        id: "categories",
        enabled: true,
        title: "Categorias",
        subtitle: "",
        image: "",
        backgroundColor: "",
        textColor: "",
      },
      grid: {
        id: "grid",
        enabled: true,
        title: "Produtos",
        subtitle: "",
        image: "",
        backgroundColor: "",
        textColor: "",
      },
    },
    sectionOrder: ["hero", "badges", "categories", "grid"],
    gamification: DEFAULT_GAMIFICATION_SETTINGS,
    updatedAt: new Date().toISOString(),
  },
}

export function getCompanyAppearance(companyId: string): CompanyAppearance {
  const storage = getStorage()
  const stored = storage.getItem(`yoobe_company_appearance_${companyId}`)
  if (!stored) {
    const defaults = defaultCompanyAppearance[companyId] || defaultCompanyAppearance["company_1"]
    // Ensure companyId is set correctly
    const withCompanyId = { ...defaults, companyId }
    storage.setItem(`yoobe_company_appearance_${companyId}`, JSON.stringify(withCompanyId))
    return withCompanyId
  }
  const parsed = JSON.parse(stored)
  // Ensure gamification settings exist with defaults
  if (!parsed.gamification) {
    parsed.gamification = { ...DEFAULT_GAMIFICATION_SETTINGS }
  } else {
    // Merge with defaults to ensure all fields exist
    parsed.gamification = { ...DEFAULT_GAMIFICATION_SETTINGS, ...parsed.gamification }
  }
  return parsed
}

export function saveCompanyAppearance(appearance: CompanyAppearance): void {
  const storage = getStorage()
  const updated = {
    ...appearance,
    updatedAt: new Date().toISOString(),
  }
  storage.setItem(`yoobe_company_appearance_${appearance.companyId}`, JSON.stringify(updated))
}

/**
 * Get gamification settings for a company
 */
export function getGamificationSettings(companyId: string): GamificationSettings {
  const appearance = getCompanyAppearance(companyId)
  return appearance.gamification || DEFAULT_GAMIFICATION_SETTINGS
}

/**
 * Update gamification settings for a company
 */
export function updateGamificationSettings(companyId: string, settings: Partial<GamificationSettings>): void {
  const appearance = getCompanyAppearance(companyId)
  const updatedGamification = {
    ...(appearance.gamification || DEFAULT_GAMIFICATION_SETTINGS),
    ...settings,
  }
  saveCompanyAppearance({
    ...appearance,
    gamification: updatedGamification,
  })
}

/**
 * Get merged level configuration for a company (base + customizations)
 * Returns the full level config with any company-specific overrides applied
 */
export function getCompanyLevelConfig(companyId: string): Record<UserLevel, LevelConfigWithCustomization> {
  const appearance = getCompanyAppearance(companyId)
  const customizations = appearance?.gamification?.levelCustomizations || {}
  
  const levels: UserLevel[] = ["bronze", "silver", "gold", "platinum", "diamond"]
  
  return levels.reduce((acc, level) => {
    const base = LEVEL_CONFIG[level]
    const custom = customizations[level] || {}
    
    acc[level] = {
      minPoints: custom.customMinPoints ?? base.minPoints,
      multiplier: custom.customMultiplier ?? base.multiplier,
      label: custom.customLabel ?? base.label,
      color: custom.customColor ?? base.color,
      icon: custom.customIcon
    }
    return acc
  }, {} as Record<UserLevel, LevelConfigWithCustomization>)
}

/**
 * Calculate user level based on company-specific thresholds
 */
export function calculateUserLevelForCompany(totalPoints: number, companyId: string): UserLevel {
  const config = getCompanyLevelConfig(companyId)
  if (totalPoints >= config.diamond.minPoints) return "diamond"
  if (totalPoints >= config.platinum.minPoints) return "platinum"
  if (totalPoints >= config.gold.minPoints) return "gold"
  if (totalPoints >= config.silver.minPoints) return "silver"
  return "bronze"
}

/**
 * Get company-specific achievements
 */
export function getCompanyAchievements(companyId: string): CompanyAchievement[] {
  const storage = getStorage()
  const stored = storage.getItem(`yoobe_company_achievements_${companyId}`)
  if (!stored) {
    // Return default achievements based on ACHIEVEMENTS_CATALOG, converted to CompanyAchievement
    return ACHIEVEMENTS_CATALOG.map((a, index) => ({
      id: a.id,
      companyId,
      name: a.name,
      description: a.description,
      icon: a.icon,
      category: "general",
      criteria: {
        type: "automatic" as const,
        condition: a.description,
      },
      points: 100 * (index + 1),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  }
  return JSON.parse(stored)
}

/**
 * Save a company-specific achievement
 */
export function saveCompanyAchievement(achievement: CompanyAchievement): void {
  const storage = getStorage()
  const achievements = getCompanyAchievements(achievement.companyId)
  const existingIndex = achievements.findIndex(a => a.id === achievement.id)
  
  if (existingIndex >= 0) {
    achievements[existingIndex] = { ...achievement, updatedAt: new Date().toISOString() }
  } else {
    achievements.push({ ...achievement, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }
  
  storage.setItem(`yoobe_company_achievements_${achievement.companyId}`, JSON.stringify(achievements))
}

/**
 * Delete a company-specific achievement
 */
export function deleteCompanyAchievement(id: string, companyId: string): void {
  const storage = getStorage()
  const achievements = getCompanyAchievements(companyId)
  const filtered = achievements.filter(a => a.id !== id)
  storage.setItem(`yoobe_company_achievements_${companyId}`, JSON.stringify(filtered))
}

/**
 * Save all company achievements at once
 */
export function saveCompanyAchievements(companyId: string, achievements: CompanyAchievement[]): void {
  const storage = getStorage()
  storage.setItem(`yoobe_company_achievements_${companyId}`, JSON.stringify(achievements))
}

export function getStoreAppearance(storeId: string, companyId: string): StoreAppearance | null {
  const storage = getStorage()
  const stored = storage.getItem(`yoobe_store_appearance_${storeId}`)
  if (!stored) return null
  const parsed = JSON.parse(stored)
  // Garantir que companyId está correto
  if (parsed.companyId !== companyId) return null
  return parsed
}

export function saveStoreAppearance(appearance: StoreAppearance): void {
  const storage = getStorage()
  const updated = {
    ...appearance,
    updatedAt: new Date().toISOString(),
  }
  storage.setItem(`yoobe_store_appearance_${appearance.storeId}`, JSON.stringify(updated))
}

/**
 * Resolve aparência final: company default + store override
 */
export function resolveAppearance(params: { companyId: string; storeId?: string }): ResolvedAppearance {
  const companyAppearance = getCompanyAppearance(params.companyId)
  const storeAppearance = params.storeId ? getStoreAppearance(params.storeId, params.companyId) : null

  // Começar com defaults da company
  const resolved: ResolvedAppearance = {
    theme: companyAppearance.theme,
    colors: {
      primary: companyAppearance.colors.primary,
      secondary: companyAppearance.colors.secondary,
      background: companyAppearance.colors.background || "#ffffff",
      accent: companyAppearance.colors.accent || companyAppearance.colors.primary,
    },
    sections: { ...companyAppearance.sections },
    sectionOrder: [...companyAppearance.sectionOrder],
  }

  // Aplicar overrides da store se existirem
  if (storeAppearance) {
    if (storeAppearance.theme) {
      resolved.theme = storeAppearance.theme
    }
    if (storeAppearance.colors) {
      resolved.colors = {
        ...resolved.colors,
        ...storeAppearance.colors,
      }
    }
    if (storeAppearance.sections) {
      Object.keys(storeAppearance.sections).forEach((key) => {
        if (resolved.sections[key]) {
          resolved.sections[key] = {
            ...resolved.sections[key],
            ...storeAppearance.sections![key],
          }
        }
      })
    }
    if (storeAppearance.sectionOrder) {
      resolved.sectionOrder = storeAppearance.sectionOrder
    }
  }

  return resolved
}

// ===========================================
// LANDING PAGES
// ===========================================

/**
 * Demo landing pages para inicialização
 */
const DEMO_LANDING_PAGES: Omit<LandingPage, "companyId">[] = [
  {
    id: "lp_demo_onboarding",
    title: "Kit de Onboarding 2024",
    slug: "kit-onboarding-2024",
    type: "onboarding",
    welcomeTitle: "Bem-vindo à equipe!",
    welcomeMessage: "Estamos muito felizes em tê-lo conosco! Resgate seu kit de boas-vindas exclusivo com produtos selecionados especialmente para você.",
    ctaText: "Resgatar Meu Kit",
    bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    bannerText: "Sua jornada começa aqui",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    productIds: [],
    assignedTags: [],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lp_demo_aniversario",
    title: "Campanha de Aniversário",
    slug: "aniversario-empresa",
    type: "campaign",
    welcomeTitle: "Celebre conosco!",
    welcomeMessage: "Em comemoração ao aniversário da empresa, preparamos uma seleção especial de presentes para você. Aproveite!",
    ctaText: "Ver Presentes",
    bannerUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200",
    bannerText: "5 anos de sucesso!",
    primaryColor: "#10b981",
    secondaryColor: "#f59e0b",
    backgroundColor: "#f0fdf4",
    textColor: "#166534",
    productIds: [],
    assignedTags: [],
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * Inicializa landing pages de demo para uma empresa
 */
export function seedDemoLandingPages(companyId: string): LandingPage[] {
  const storage = getStorage()
  const existing = storage.getItem(`yoobe_landing_pages_${companyId}`)
  if (existing) return JSON.parse(existing)
  
  const demoPages: LandingPage[] = DEMO_LANDING_PAGES.map(page => ({
    ...page,
    companyId,
  }))
  
  storage.setItem(`yoobe_landing_pages_${companyId}`, JSON.stringify(demoPages))
  return demoPages
}

/**
 * Obtém todas as landing pages de uma empresa
 */
export function getLandingPages(companyId: string): LandingPage[] {
  const storage = getStorage()
  const stored = storage.getItem(`yoobe_landing_pages_${companyId}`)
  
  // Auto-seed demo data if empty
  if (!stored) {
    return seedDemoLandingPages(companyId)
  }
  
  return JSON.parse(stored)
}

/**
 * Salva uma landing page
 */
export function saveLandingPage(landingPage: LandingPage): void {
  const storage = getStorage()
  const pages = getLandingPages(landingPage.companyId)
  const index = pages.findIndex((p) => p.id === landingPage.id)
  
  const updated = {
    ...landingPage,
    updatedAt: new Date().toISOString(),
  }
  
  if (index === -1) {
    pages.push(updated)
  } else {
    pages[index] = updated
  }
  
  storage.setItem(`yoobe_landing_pages_${landingPage.companyId}`, JSON.stringify(pages))
}

/**
 * Deleta uma landing page
 */
export function deleteLandingPage(companyId: string, landingPageId: string): void {
  const storage = getStorage()
  const pages = getLandingPages(companyId)
  const filtered = pages.filter((p) => p.id !== landingPageId)
  storage.setItem(`yoobe_landing_pages_${companyId}`, JSON.stringify(filtered))
}

/**
 * Obtém uma landing page por slug
 */
export function getLandingPageBySlug(slug: string): LandingPage | null {
  if (typeof window === "undefined") return null
  
  // Buscar em todas as empresas dinamicamente
  const companies = getCompanies()
  for (const company of companies) {
    const pages = getLandingPages(company.id)
    const page = pages.find((p) => p.slug === slug && p.isActive)
    if (page) return page
  }
  
  return null
}

/**
 * Obtém uma landing page por ID
 */
export function getLandingPageById(companyId: string, landingPageId: string): LandingPage | null {
  if (typeof window === "undefined") return null
  const pages = getLandingPages(companyId)
  return pages.find((p) => p.id === landingPageId) || null
}

/**
 * Obtém apenas landing pages ativas
 */
export function getActiveLandingPages(companyId: string): LandingPage[] {
  if (typeof window === "undefined") return []
  const pages = getLandingPages(companyId)
  return pages.filter(p => p.isActive)
}

/**
 * Obtém a landing page mais recente (por updatedAt)
 */
export function getLatestLandingPage(companyId: string): LandingPage | null {
  if (typeof window === "undefined") return null
  const pages = getLandingPages(companyId)
  if (pages.length === 0) return null
  
  const sorted = pages.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  return sorted[0]
}

/**
 * Obtém produtos para a loja de campanha
 * Reutiliza produtos do catálogo existente, auto-popula se vazio
 */
export function getCampaignStoreProducts(companyId: string, landingPageSlug?: string): CompanyProduct[] {
  if (typeof window === "undefined") return []
  
  let selectedProductIds: string[] = []
  
  // Se temos uma landing page, usar os produtos selecionados
  if (landingPageSlug) {
    const landingPage = getLandingPageBySlug(landingPageSlug)
    if (landingPage && landingPage.productIds.length > 0) {
      selectedProductIds = landingPage.productIds
    }
  }
  
  // Obter todos os produtos ativos da empresa
  const allCompanyProducts = getCompanyProductsByCompany(companyId)
  const activeProducts = allCompanyProducts.filter(p => p.isActive && p.stockQuantity > 0)
  
  // Se temos IDs selecionados, retornar esses produtos
  if (selectedProductIds.length > 0) {
    const selectedProducts = activeProducts.filter(p => selectedProductIds.includes(p.id))
    // Se encontrou produtos, retornar
    if (selectedProducts.length > 0) {
      return selectedProducts
    }
  }
  
  // Auto-popular: pegar top 12 produtos ativos com estoque
  // Priorizar produtos com maior estoque e preço/points definidos
  const sortedProducts = activeProducts
    .filter(p => (p.price > 0 || p.pointsCost > 0))
    .sort((a, b) => {
      // Priorizar maior estoque
      if (b.stockQuantity !== a.stockQuantity) {
        return b.stockQuantity - a.stockQuantity
      }
      // Depois priorizar produtos com pontos (mais relevantes para campanha)
      if (a.pointsCost > 0 && b.pointsCost === 0) return -1
      if (a.pointsCost === 0 && b.pointsCost > 0) return 1
      return 0
    })
    .slice(0, 12)
  
  return sortedProducts
}

/**
 * Verifica elegibilidade de produto para usuário
 * Política: interseção de tags (AND por padrão)
 */
export function checkEligibility(user: User, product: CompanyProduct | BaseProduct, productType: "base" | "company"): boolean {
  // Se não há tags no sistema, todos os produtos ativos são elegíveis
  const allTags = getTagsV3()
  if (allTags.length === 0) {
    if (productType === "company") {
      return (product as CompanyProduct).isActive
    }
    return true
  }

  // Obter tags do produto
  const productTags = productType === "company" 
    ? getTagsByProductV3((product as CompanyProduct).id, "company")
    : getTagsByProductV3((product as BaseProduct).id, "base")

  // Obter tags do usuário
  const userTags = getTagsByEmployeeV3(user.id)

  // Se produto não tem tags, é elegível para todos
  if (productTags.length === 0) {
    return productType === "company" ? (product as CompanyProduct).isActive : true
  }

  // Se usuário não tem tags, não é elegível para produtos com tags (a menos que seja produto sem tags)
  if (userTags.length === 0) {
    return false
  }

  // Política AND: usuário precisa ter pelo menos uma tag em comum com o produto
  const userTagIds = userTags.map((t) => t.id)
  const productTagIds = productTags.map((t) => t.id)
  const intersection = userTagIds.filter((id) => productTagIds.includes(id))

  return intersection.length > 0
}

/**
 * Filtra produtos elegíveis para um usuário
 */
export function getEligibleProducts(user: User, companyId: string): CompanyProduct[] {
  const products = getCompanyProductsByCompany(companyId)
  return products.filter((p) => p.isActive && checkEligibility(user, p, "company"))
}

// ===========================================
// DEMO CONSOLE DTOs & STORAGE (LOCAL)
// ===========================================

export type Env = "sandbox" | "production"

export interface ApiKeyDTO {
  id: string
  name: string
  prefix: string
  scopes: string[]
  env: Env
  createdAt: string
  lastUsedAt?: string
  revokedAt?: string
}

export type WebhookEventType =
  | "user.created"
  | "user.updated"
  | "points.credit"
  | "points.debit"
  | "points.reversal"
  | "points.expire"
  | "order.quoted"
  | "order.created"
  | "order.confirmed"
  | "order.completed"
  | "shipment.updated"

export interface WebhookDTO {
  id: string
  url: string
  secretMasked: string
  events: WebhookEventType[]
  env: Env
  isActive: boolean
  createdAt: string
}

export interface WebhookDeliveryDTO {
  id: string
  webhookId: string
  eventType: WebhookEventType
  status: "ok" | "failed" | "retrying"
  attempts: number
  lastAttemptAt: string
  traceId: string
  latencyMs: number
  responseCode?: number
}

export interface EventLogDTO {
  id: string
  type: string
  source: "partner" | "yoobe"
  env: Env
  traceId: string
  createdAt: string
  status: "ok" | "failed" | "retried"
  payloadPreview: Record<string, unknown>
}

export interface WalletSummaryDTO {
  userId?: string
  available: number
  pending: number
  expiringSoon: number
  expiringAt?: string
  updatedAt: string
}

export interface ProductRedemptionModeDTO {
  mode: "points" | "points_plus_cash" | "cash" | "free"
  points?: number
  cashCents?: number
  currency?: "BRL" | "USD"
  limitPerUser?: number
}

export interface CatalogProductDTO {
  id: string
  masterId?: string
  name: string
  description?: string
  images: string[]
  tags: string[]
  redemptionModes: ProductRedemptionModeDTO[]
  isActive: boolean
  inventoryStatus: "in_stock" | "low" | "out" | "preorder"
  updatedAt: string
}

export type SetupStepStatus = "todo" | "in_progress" | "done" | "blocked"

export interface SetupStatusDTO {
  env: Env
  steps: {
    connect: { status: SetupStepStatus; details?: string }
    catalog: { status: SetupStepStatus; details?: string }
    wallet: { status: SetupStepStatus; details?: string }
    webhooks: { status: SetupStepStatus; details?: string }
    test_order: { status: SetupStepStatus; details?: string }
    go_live: { status: SetupStepStatus; details?: string }
  }
  lastCheckedAt: string
}

// Prefix for Demo Console storage
const DEMO_PREFIX = "yoobe_demo"

function getDemoKey(env: Env, resource: string) {
  return `${DEMO_PREFIX}::${env}::${resource}`
}

export function getApiKeys(env: Env): ApiKeyDTO[] {
  const storage = getStorage()
  const stored = storage.getItem(getDemoKey(env, "api_keys"))
  return stored ? JSON.parse(stored) : []
}

export function saveApiKeys(keys: ApiKeyDTO[], env: Env): void {
  const storage = getStorage()
  storage.setItem(getDemoKey(env, "api_keys"), JSON.stringify(keys))
}

export function getWebhooks(env: Env): WebhookDTO[] {
  const storage = getStorage()
  const stored = storage.getItem(getDemoKey(env, "webhooks"))
  return stored ? JSON.parse(stored) : []
}

export function saveWebhooks(webhooks: WebhookDTO[], env: Env): void {
  const storage = getStorage()
  storage.setItem(getDemoKey(env, "webhooks"), JSON.stringify(webhooks))
}

export function getWebhookDeliveries(env: Env): WebhookDeliveryDTO[] {
  const storage = getStorage()
  const stored = storage.getItem(getDemoKey(env, "webhook_deliveries"))
  return stored ? JSON.parse(stored) : []
}

export function saveWebhookDeliveries(deliveries: WebhookDeliveryDTO[], env: Env): void {
  const storage = getStorage()
  storage.setItem(getDemoKey(env, "webhook_deliveries"), JSON.stringify(deliveries))
}

export function getEventLogs(env: Env): EventLogDTO[] {
  const storage = getStorage()
  const stored = storage.getItem(getDemoKey(env, "event_logs"))
  return stored ? JSON.parse(stored) : []
}

export function saveEventLogs(logs: EventLogDTO[], env: Env): void {
  const storage = getStorage()
  storage.setItem(getDemoKey(env, "event_logs"), JSON.stringify(logs))
}

export function getSetupStatus(env: Env): SetupStatusDTO {
  const defaultStatus: SetupStatusDTO = {
    env,
    steps: {
      connect: { status: "todo" },
      catalog: { status: "todo" },
      wallet: { status: "todo" },
      webhooks: { status: "todo" },
      test_order: { status: "todo" },
      go_live: { status: "todo" },
    },
    lastCheckedAt: new Date().toISOString(),
  }

  const storage = getStorage()
  const stored = storage.getItem(getDemoKey(env, "setup_status"))
  return stored ? JSON.parse(stored) : defaultStatus
}

export function saveSetupStatus(status: SetupStatusDTO, env: Env): void {
  const storage = getStorage()
  storage.setItem(getDemoKey(env, "setup_status"), JSON.stringify(status))
}

// ===========================================
// V3 STORAGE FUNCTIONS - ADMIN BANNER
// ===========================================

const defaultAdminBanner: AdminBanner = {
  id: "banner_1",
  title: "Bem-vindo à Yoobe!",
  message: "Sua plataforma de gestão de brindes corporativos.",
  ctaText: "Saiba mais",
  ctaLink: "/documentacao",
  type: "info",
  active: false,
  dismissible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function getAdminBanner(): AdminBanner {
  const storage = getStorage()
  const stored = storage.getItem("yoobe_admin_banner")
  if (!stored) {
    storage.setItem("yoobe_admin_banner", JSON.stringify(defaultAdminBanner))
    return defaultAdminBanner
  }
  return JSON.parse(stored)
}

export function saveAdminBanner(banner: AdminBanner): void {
  const storage = getStorage()
  const updated = {
    ...banner,
    updatedAt: new Date().toISOString(),
  }
  storage.setItem("yoobe_admin_banner", JSON.stringify(updated))
}

export function updateAdminBanner(data: Partial<AdminBanner>): AdminBanner {
  const current = getAdminBanner()
  const updated: AdminBanner = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveAdminBanner(updated)
  return updated
}

// ===========================================
// V3 STORAGE FUNCTIONS - TEAM BUDGETS
// ===========================================

const defaultTeamBudgets: TeamBudget[] = [
  {
    id: "budget_1",
    companyId: "company_1",
    teamId: "team_marketing",
    teamName: "Marketing",
    allocatedAmount: 50000,
    usedAmount: 12500,
    availableAmount: 37500,
    requests: [],
    history: [
      { id: "tx_1", teamId: "team_marketing", type: "allocation", amount: 50000, description: "Alocação inicial Q1 2026", performedBy: "admin", createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "budget_2",
    companyId: "company_1",
    teamId: "team_vendas",
    teamName: "Vendas",
    allocatedAmount: 35000,
    usedAmount: 8000,
    availableAmount: 27000,
    requests: [
      { id: "req_1", teamId: "team_vendas", amount: 5000, reason: "Campanha de fim de ano", status: "pending", requestedBy: "joao.silva", requestedAt: new Date().toISOString() }
    ],
    history: [
      { id: "tx_2", teamId: "team_vendas", type: "allocation", amount: 35000, description: "Alocação inicial Q1 2026", performedBy: "admin", createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "budget_3",
    companyId: "company_1",
    teamId: "team_rh",
    teamName: "Recursos Humanos",
    allocatedAmount: 25000,
    usedAmount: 15000,
    availableAmount: 10000,
    requests: [],
    history: [
      { id: "tx_3", teamId: "team_rh", type: "allocation", amount: 25000, description: "Alocação inicial Q1 2026", performedBy: "admin", createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "budget_4",
    companyId: "company_1",
    teamId: "team_ti",
    teamName: "Tecnologia",
    allocatedAmount: 20000,
    usedAmount: 5000,
    availableAmount: 15000,
    requests: [],
    history: [
      { id: "tx_4", teamId: "team_ti", type: "allocation", amount: 20000, description: "Alocação inicial Q1 2026", performedBy: "admin", createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function getTeamBudgets(companyId: string): TeamBudget[] {
  const storage = getStorage()
  const stored = storage.getItem(`yoobe_team_budgets_${companyId}`)
  if (!stored) {
    const defaults = defaultTeamBudgets.filter(b => b.companyId === companyId)
    storage.setItem(`yoobe_team_budgets_${companyId}`, JSON.stringify(defaults))
    return defaults
  }
  return JSON.parse(stored)
}

export function saveTeamBudgets(budgets: TeamBudget[], companyId: string): void {
  const storage = getStorage()
  storage.setItem(`yoobe_team_budgets_${companyId}`, JSON.stringify(budgets))
}

export function getTeamBudgetById(budgetId: string, companyId: string): TeamBudget | null {
  const budgets = getTeamBudgets(companyId)
  return budgets.find(b => b.id === budgetId) || null
}

export function updateTeamBudget(budgetId: string, companyId: string, updates: Partial<TeamBudget>): TeamBudget | null {
  const budgets = getTeamBudgets(companyId)
  const index = budgets.findIndex(b => b.id === budgetId)
  if (index === -1) return null
  
  budgets[index] = {
    ...budgets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveTeamBudgets(budgets, companyId)
  return budgets[index]
}

export function createBudgetRequest(companyId: string, teamId: string, request: Omit<BudgetRequest, "id" | "status" | "requestedAt">): BudgetRequest | null {
  const budgets = getTeamBudgets(companyId)
  const budget = budgets.find(b => b.teamId === teamId)
  if (!budget) return null
  
  const newRequest: BudgetRequest = {
    ...request,
    id: `req_${Date.now()}`,
    teamId,
    status: "pending",
    requestedAt: new Date().toISOString(),
  }
  
  budget.requests.push(newRequest)
  budget.updatedAt = new Date().toISOString()
  saveTeamBudgets(budgets, companyId)
  return newRequest
}

export function approveBudgetRequest(companyId: string, teamId: string, requestId: string, reviewedBy: string, notes?: string): boolean {
  const budgets = getTeamBudgets(companyId)
  const budget = budgets.find(b => b.teamId === teamId)
  if (!budget) return false
  
  const request = budget.requests.find(r => r.id === requestId)
  if (!request || request.status !== "pending") return false
  
  request.status = "approved"
  request.reviewedBy = reviewedBy
  request.reviewedAt = new Date().toISOString()
  request.reviewNotes = notes
  
  // Adicionar verba ao time
  budget.allocatedAmount += request.amount
  budget.availableAmount += request.amount
  
  // Registrar no histórico
  budget.history.push({
    id: `tx_${Date.now()}`,
    teamId,
    type: "allocation",
    amount: request.amount,
    description: `Solicitação aprovada: ${request.reason}`,
    performedBy: reviewedBy,
    createdAt: new Date().toISOString(),
  })
  
  budget.updatedAt = new Date().toISOString()
  saveTeamBudgets(budgets, companyId)
  return true
}

export function rejectBudgetRequest(companyId: string, teamId: string, requestId: string, reviewedBy: string, notes?: string): boolean {
  const budgets = getTeamBudgets(companyId)
  const budget = budgets.find(b => b.teamId === teamId)
  if (!budget) return false
  
  const request = budget.requests.find(r => r.id === requestId)
  if (!request || request.status !== "pending") return false
  
  request.status = "rejected"
  request.reviewedBy = reviewedBy
  request.reviewedAt = new Date().toISOString()
  request.reviewNotes = notes
  
  budget.updatedAt = new Date().toISOString()
  saveTeamBudgets(budgets, companyId)
  return true
}

export function allocateBudget(companyId: string, teamId: string, amount: number, description: string, performedBy: string): boolean {
  const budgets = getTeamBudgets(companyId)
  const budget = budgets.find(b => b.teamId === teamId)
  if (!budget) return false
  
  budget.allocatedAmount += amount
  budget.availableAmount += amount
  
  budget.history.push({
    id: `tx_${Date.now()}`,
    teamId,
    type: "allocation",
    amount,
    description,
    performedBy,
    createdAt: new Date().toISOString(),
  })
  
  budget.updatedAt = new Date().toISOString()
  saveTeamBudgets(budgets, companyId)
  return true
}

export function useBudget(companyId: string, teamId: string, amount: number, description: string, performedBy: string, orderId?: string): boolean {
  const budgets = getTeamBudgets(companyId)
  const budget = budgets.find(b => b.teamId === teamId)
  if (!budget || budget.availableAmount < amount) return false
  
  budget.usedAmount += amount
  budget.availableAmount -= amount
  
  budget.history.push({
    id: `tx_${Date.now()}`,
    teamId,
    type: "usage",
    amount: -amount,
    description,
    performedBy,
    relatedOrderId: orderId,
    createdAt: new Date().toISOString(),
  })
  
  budget.updatedAt = new Date().toISOString()
  saveTeamBudgets(budgets, companyId)
  return true
}

// ===========================================
// V3 STORAGE FUNCTIONS - CURRENCY STATS
// ===========================================

export function getCurrencyStats(companyId: string): CurrencyStats {
  const storage = getStorage()
  const stored = storage.getItem(`yoobe_currency_stats_${companyId}`)
  
  // Calcular estatísticas reais baseadas nos dados
  const users = getUsers().filter(u => u.companyId === companyId || !u.companyId)
  const transactions = getTransactions()
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  // Total em circulação
  const totalCirculating = users.reduce((sum, u) => sum + (u.points || 0), 0)
  
  // Transações 24h
  const transactions24h = transactions.filter(t => new Date(t.createdAt) > yesterday)
  const totalTransactions24h = transactions24h.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  // Total de resgates (débitos)
  const totalRedemptions = transactions.filter(t => t.type === "debit").length
  
  // Índice de engajamento (mock: baseado na proporção de usuários com saldo)
  const usersWithBalance = users.filter(u => (u.points || 0) > 0).length
  const engagementIndex = users.length > 0 ? Math.round((usersWithBalance / users.length) * 100) : 0
  
  // All-time high (maior saldo individual)
  const allTimeHigh = Math.max(...users.map(u => u.points || 0), 0)
  
  // Top acumuladores
  const topAccumulators = users
    .filter(u => (u.points || 0) > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5)
    .map(u => ({
      userId: u.id,
      userName: `${u.firstName} ${u.lastName}`,
      balance: u.points || 0,
    }))
  
  // Top gastadores
  const topSpenders = users
    .filter(u => (u.totalPointsSpent || 0) > 0)
    .sort((a, b) => (b.totalPointsSpent || 0) - (a.totalPointsSpent || 0))
    .slice(0, 5)
    .map(u => ({
      userId: u.id,
      userName: `${u.firstName} ${u.lastName}`,
      spent: u.totalPointsSpent || 0,
    }))
  
  // Transações recentes
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
  
  // Volume diário (últimos 7 dias)
  const dailyVolume: { date: string; volume: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split("T")[0]
    const dayStart = new Date(dateStr)
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
    
    const dayVolume = transactions
      .filter(t => {
        const tDate = new Date(t.createdAt)
        return tDate >= dayStart && tDate < dayEnd
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    dailyVolume.push({ date: dateStr, volume: dayVolume })
  }
  
  const stats: CurrencyStats = {
    companyId,
    totalCirculating,
    totalTransactions24h,
    totalRedemptions,
    engagementIndex,
    allTimeHigh,
    topAccumulators,
    topSpenders,
    recentTransactions,
    dailyVolume,
    updatedAt: new Date().toISOString(),
  }
  
  return stats
}

export function getCurrencyConfig(companyId: string): StoreSettings["currency"] {
  const settings = getStoreSettings(companyId)
  return settings.currency || {
    name: "ponto",
    plural: "pontos",
    abbreviation: "PTS",
    symbol: "★",
    icon: "⭐",
    primaryColor: "#FFD700",
    secondaryColor: "#FFA500",
  }
}

export function saveCurrencyConfig(companyId: string, currency: StoreSettings["currency"]): void {
  const settings = getStoreSettings(companyId)
  settings.currency = currency
  settings.updatedAt = new Date().toISOString()
  saveStoreSettings(settings)
}

// ===========================================
// APPROVAL WORKFLOW FUNCTIONS
// ===========================================

const APPROVAL_REQUESTS_KEY = "yoobe_approval_requests"
const APPROVAL_RULES_KEY = "yoobe_approval_rules"

/**
 * Dados iniciais de aprovações pendentes para demo
 * Usa dados estáticos para evitar dependências circulares com getUsers()
 */
function getInitialApprovalRequests(): ApprovalRequest[] {
  const now = new Date()
  
  // Dados estáticos de usuários demo para evitar dependência de getUsers()
  const demoUsers = [
    { id: "spree_user_1", name: "João Silva" },
    { id: "spree_user_2", name: "Maria Santos" },
    { id: "spree_user_3", name: "Pedro Costa" },
    { id: "spree_user_4", name: "Ana Oliveira" },
    { id: "spree_user_5", name: "Carlos Lima" },
  ]
  
  return [
    {
      id: "req_001",
      companyId: "company_1",
      type: "requisition",
      referenceId: "REQ001",
      requesterId: "spree_user_1",
      requesterName: "João Silva",
      requesterEmail: "joao.silva@empresa.com",
      requesterDepartment: "Tecnologia",
      status: "pending",
      priority: "alta",
      value: 3500,
      title: "Notebook Profissional",
      description: "Notebook para trabalho remoto - Desenvolvimento",
      detailedDescription: "Necessário para trabalho remoto da equipe de desenvolvimento. Especificações: 16GB RAM, SSD 512GB, processador i7 ou equivalente.",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "req_002",
      companyId: "company_1",
      type: "requisition",
      referenceId: "REQ002",
      requesterId: "spree_user_2",
      requesterName: "Maria Santos",
      requesterEmail: "maria.santos@empresa.com",
      requesterDepartment: "Design",
      status: "pending",
      priority: "media",
      value: 450,
      title: "Mouse Gamer RGB",
      description: "Mouse ergonômico para uso diário",
      detailedDescription: "Mouse ergonômico com precisão de 16000 DPI para trabalho prolongado de design gráfico.",
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "req_003",
      companyId: "company_1",
      type: "requisition",
      referenceId: "REQ003",
      requesterId: "spree_user_3",
      requesterName: "Pedro Costa",
      requesterEmail: "pedro.costa@empresa.com",
      requesterDepartment: "Vendas",
      status: "pending",
      priority: "baixa",
      value: 150,
      title: "Power Bank",
      description: "Carregador portátil para viagens",
      detailedDescription: "Power bank 20000mAh para uso em viagens de negócios e reuniões externas.",
      createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    },
    // Aprovados hoje
    {
      id: "req_004",
      companyId: "company_1",
      type: "order",
      referenceId: "ORD001",
      requesterId: "spree_user_1",
      requesterName: "João Silva",
      status: "approved",
      priority: "alta",
      value: 1200,
      title: "Kit Escritório",
      description: "Material de escritório completo",
      approvedBy: "spree_user_4",
      approvalNotes: "Aprovado conforme política de home office.",
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "req_005",
      companyId: "company_1",
      type: "budget",
      referenceId: "BUD001",
      requesterId: "spree_user_2",
      requesterName: "Maria Santos",
      status: "approved",
      priority: "media",
      value: 800,
      title: "Verba Marketing Q1",
      description: "Solicitação de verba para ações de marketing",
      approvedBy: "spree_user_4",
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    },
    // Mais aprovados para estatísticas (10 itens com valores fixos para consistência)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `req_approved_${i + 1}`,
      companyId: "company_1",
      type: "order" as ApprovalRequestType,
      referenceId: `ORD00${i + 2}`,
      requesterId: demoUsers[i % demoUsers.length].id,
      requesterName: demoUsers[i % demoUsers.length].name,
      status: "approved" as const,
      priority: (["alta", "media", "baixa"] as ApprovalPriority[])[i % 3],
      value: 500 + (i * 150), // Valores fixos para consistência
      title: `Solicitação ${i + 1}`,
      description: `Descrição da solicitação ${i + 1}`,
      approvedBy: "spree_user_4",
      createdAt: new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    })),
    // Rejeitados hoje
    {
      id: "req_rejected_1",
      companyId: "company_1",
      type: "gift",
      referenceId: "GFT001",
      requesterId: "spree_user_3",
      requesterName: "Pedro Costa",
      status: "rejected",
      priority: "baixa",
      value: 5000,
      title: "Kit Premium",
      description: "Kit premium fora do orçamento",
      rejectedBy: "spree_user_4",
      rejectionReason: "Valor acima do limite permitido para esta categoria.",
      rejectionCategory: "budget_exceeded",
      comments: "Valor acima do limite permitido",
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "req_rejected_2",
      companyId: "company_1",
      type: "requisition",
      referenceId: "REQ004",
      requesterId: "spree_user_1",
      requesterName: "João Silva",
      status: "rejected",
      priority: "media",
      value: 2500,
      title: "Monitor Ultrawide",
      description: "Monitor curvo 34 polegadas",
      rejectedBy: "spree_user_4",
      rejectionReason: "Solicitação duplicada - já existe aprovação similar em andamento.",
      rejectionCategory: "other",
      comments: "Duplicado - já existe solicitação similar",
      createdAt: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

/**
 * Dados iniciais de regras de aprovação
 */
function getInitialApprovalRules(): ApprovalRule[] {
  const now = new Date().toISOString()
  return [
    {
      id: "rule_001",
      companyId: "company_1",
      name: "Auto-aprovar até R$ 500",
      description: "Solicitações com valor até R$ 500 são aprovadas automaticamente",
      conditions: [{ field: "value", operator: "lt", value: 500 }],
      approverRoles: ["manager"],
      autoApprove: true,
      maxValue: 500,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "rule_002",
      companyId: "company_1",
      name: "Prioridade Alta - Aprovação Imediata",
      description: "Solicitações de alta prioridade precisam de aprovação em até 2 horas",
      conditions: [{ field: "priority", operator: "eq", value: "alta" }],
      approverRoles: ["manager", "superAdmin"],
      autoApprove: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "rule_003",
      companyId: "company_1",
      name: "Limite de Valor - Aprovação Dupla",
      description: "Solicitações acima de R$ 5.000 precisam de aprovação dupla",
      conditions: [{ field: "value", operator: "gt", value: 5000 }],
      approverRoles: ["superAdmin"],
      autoApprove: false,
      maxValue: 50000,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

/**
 * Garante que os dados de aprovação demo foram inicializados
 * Chame esta função antes de carregar dados de aprovação para garantir dados disponíveis
 */
export function ensureApprovalDataSeeded(): void {
  try {
    const storage = getStorage()
    const stored = storage.getItem(APPROVAL_REQUESTS_KEY)
    
    // Se não existe ou está vazio, inicializar com dados demo
    if (!stored || stored === "[]" || stored === "null") {
      const initial = getInitialApprovalRequests()
      storage.setItem(APPROVAL_REQUESTS_KEY, JSON.stringify(initial))
      console.log("[ensureApprovalDataSeeded] Dados de aprovação inicializados com", initial.length, "itens")
    }
    
    // Também verificar regras
    const storedRules = storage.getItem(APPROVAL_RULES_KEY)
    if (!storedRules || storedRules === "[]" || storedRules === "null") {
      const initialRules = getInitialApprovalRules()
      storage.setItem(APPROVAL_RULES_KEY, JSON.stringify(initialRules))
      console.log("[ensureApprovalDataSeeded] Regras de aprovação inicializadas com", initialRules.length, "itens")
    }
  } catch (error) {
    console.error("[ensureApprovalDataSeeded] Erro ao inicializar dados:", error)
  }
}

/**
 * Força a reinicialização dos dados de aprovação demo
 * Útil para resetar os dados para o estado inicial
 */
export function resetApprovalData(): void {
  try {
    const storage = getStorage()
    const initial = getInitialApprovalRequests()
    storage.setItem(APPROVAL_REQUESTS_KEY, JSON.stringify(initial))
    
    const initialRules = getInitialApprovalRules()
    storage.setItem(APPROVAL_RULES_KEY, JSON.stringify(initialRules))
    
    console.log("[resetApprovalData] Dados de aprovação resetados")
  } catch (error) {
    console.error("[resetApprovalData] Erro ao resetar dados:", error)
  }
}

/**
 * Obtém todas as solicitações de aprovação
 */
export function getApprovalRequests(companyId?: string): ApprovalRequest[] {
  try {
    const storage = getStorage()
    const stored = storage.getItem(APPROVAL_REQUESTS_KEY)
    
    if (!stored || stored === "null") {
      const initial = getInitialApprovalRequests()
      storage.setItem(APPROVAL_REQUESTS_KEY, JSON.stringify(initial))
      return companyId ? initial.filter(r => r.companyId === companyId) : initial
    }
    
    const requests: ApprovalRequest[] = JSON.parse(stored)
    
    // Se o array está vazio, reinicializar com dados demo
    if (!Array.isArray(requests) || requests.length === 0) {
      const initial = getInitialApprovalRequests()
      storage.setItem(APPROVAL_REQUESTS_KEY, JSON.stringify(initial))
      return companyId ? initial.filter(r => r.companyId === companyId) : initial
    }
    
    return companyId ? requests.filter(r => r.companyId === companyId) : requests
  } catch (error) {
    console.error("[getApprovalRequests] Erro ao carregar solicitações:", error)
    // Em caso de erro, retornar dados iniciais
    const initial = getInitialApprovalRequests()
    return companyId ? initial.filter(r => r.companyId === companyId) : initial
  }
}

/**
 * Salva as solicitações de aprovação
 */
export function saveApprovalRequests(requests: ApprovalRequest[]): void {
  const storage = getStorage()
  storage.setItem(APPROVAL_REQUESTS_KEY, JSON.stringify(requests))
}

/**
 * Obtém aprovações pendentes
 */
export function getPendingApprovals(companyId?: string): ApprovalRequest[] {
  return getApprovalRequests(companyId).filter(r => r.status === "pending")
}

/**
 * Obtém estatísticas de aprovação
 */
export function getApprovalStats(companyId?: string): ApprovalStats {
  try {
    const requests = getApprovalRequests(companyId)
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const approvedToday = requests.filter(r => 
      r.status === "approved" && r.reviewedAt && new Date(r.reviewedAt) >= startOfDay
    ).length
    const rejectedToday = requests.filter(r => 
      r.status === "rejected" && r.reviewedAt && new Date(r.reviewedAt) >= startOfDay
    ).length
    const pending = requests.filter(r => r.status === "pending").length
    
    // Calcular tempo médio de aprovação (em horas)
    const approvedRequests = requests.filter(r => r.status === "approved" && r.reviewedAt)
    let totalHours = 0
    for (const req of approvedRequests) {
      const created = new Date(req.createdAt).getTime()
      const reviewed = new Date(req.reviewedAt!).getTime()
      totalHours += (reviewed - created) / (1000 * 60 * 60)
    }
    const averageTimeHours = approvedRequests.length > 0 
      ? Math.round((totalHours / approvedRequests.length) * 10) / 10 
      : 0
    
    return {
      approvedToday,
      pending,
      rejectedToday,
      averageTimeHours,
      totalApproved: requests.filter(r => r.status === "approved").length,
      totalRejected: requests.filter(r => r.status === "rejected").length,
      totalPending: pending,
    }
  } catch (error) {
    console.error("[getApprovalStats] Erro ao calcular estatísticas:", error)
    // Retornar estatísticas zeradas em caso de erro
    return {
      approvedToday: 0,
      pending: 0,
      rejectedToday: 0,
      averageTimeHours: 0,
      totalApproved: 0,
      totalRejected: 0,
      totalPending: 0,
    }
  }
}

/**
 * Aprova uma solicitação
 */
export function approveRequest(id: string, approverId: string, approvalNotes?: string): ApprovalRequest | null {
  const requests = getApprovalRequests()
  const request = requests.find(r => r.id === id)
  
  if (!request || (request.status !== "pending" && request.status !== "info_requested")) return null
  
  request.status = "approved"
  request.approvedBy = approverId
  request.approvalNotes = approvalNotes
  request.reviewedAt = new Date().toISOString()
  request.updatedAt = new Date().toISOString()
  
  saveApprovalRequests(requests)
  return request
}

/**
 * Rejeita uma solicitação
 */
export function rejectRequest(
  id: string, 
  rejectorId: string, 
  reason?: string, 
  category?: RejectionCategory
): ApprovalRequest | null {
  const requests = getApprovalRequests()
  const request = requests.find(r => r.id === id)
  
  if (!request || (request.status !== "pending" && request.status !== "info_requested")) return null
  
  request.status = "rejected"
  request.rejectedBy = rejectorId
  request.rejectionReason = reason
  request.rejectionCategory = category
  request.reviewedAt = new Date().toISOString()
  request.updatedAt = new Date().toISOString()
  
  saveApprovalRequests(requests)
  return request
}

/**
 * Solicita mais informações sobre uma solicitação
 */
export function requestMoreInfo(id: string, requesterId: string, message: string): ApprovalRequest | null {
  const requests = getApprovalRequests()
  const request = requests.find(r => r.id === id)
  
  if (!request || request.status !== "pending") return null
  
  request.status = "info_requested"
  request.infoRequestMessage = message
  request.updatedAt = new Date().toISOString()
  
  saveApprovalRequests(requests)
  return request
}

/**
 * Aprova múltiplas solicitações
 */
export function approveMultipleRequests(ids: string[], approverId: string): number {
  let approved = 0
  for (const id of ids) {
    if (approveRequest(id, approverId)) {
      approved++
    }
  }
  return approved
}

/**
 * Cria uma nova solicitação de aprovação
 */
export function createApprovalRequest(data: Omit<ApprovalRequest, 'id' | 'createdAt' | 'updatedAt'>): ApprovalRequest {
  const requests = getApprovalRequests()
  const now = new Date().toISOString()
  
  const newRequest: ApprovalRequest = {
    ...data,
    id: `req_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  }
  
  requests.push(newRequest)
  saveApprovalRequests(requests)
  return newRequest
}

/**
 * Obtém todas as regras de aprovação
 */
export function getApprovalRules(companyId?: string): ApprovalRule[] {
  try {
    const storage = getStorage()
    const stored = storage.getItem(APPROVAL_RULES_KEY)
    
    if (!stored || stored === "null") {
      const initial = getInitialApprovalRules()
      storage.setItem(APPROVAL_RULES_KEY, JSON.stringify(initial))
      return companyId ? initial.filter(r => r.companyId === companyId) : initial
    }
    
    const rules: ApprovalRule[] = JSON.parse(stored)
    
    // Se o array está vazio, reinicializar com dados demo
    if (!Array.isArray(rules) || rules.length === 0) {
      const initial = getInitialApprovalRules()
      storage.setItem(APPROVAL_RULES_KEY, JSON.stringify(initial))
      return companyId ? initial.filter(r => r.companyId === companyId) : initial
    }
    
    return companyId ? rules.filter(r => r.companyId === companyId) : rules
  } catch (error) {
    console.error("[getApprovalRules] Erro ao carregar regras:", error)
    // Em caso de erro, retornar dados iniciais
    const initial = getInitialApprovalRules()
    return companyId ? initial.filter(r => r.companyId === companyId) : initial
  }
}

/**
 * Salva as regras de aprovação
 */
export function saveApprovalRules(rules: ApprovalRule[]): void {
  const storage = getStorage()
  storage.setItem(APPROVAL_RULES_KEY, JSON.stringify(rules))
}

/**
 * Cria uma nova regra de aprovação
 */
export function createApprovalRule(data: Omit<ApprovalRule, 'id' | 'createdAt' | 'updatedAt'>): ApprovalRule {
  const rules = getApprovalRules()
  const now = new Date().toISOString()
  
  const newRule: ApprovalRule = {
    ...data,
    id: `rule_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  }
  
  rules.push(newRule)
  saveApprovalRules(rules)
  return newRule
}

/**
 * Atualiza uma regra de aprovação
 */
export function updateApprovalRule(id: string, updates: Partial<ApprovalRule>): ApprovalRule | null {
  const rules = getApprovalRules()
  const index = rules.findIndex(r => r.id === id)
  
  if (index === -1) return null
  
  rules[index] = {
    ...rules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  saveApprovalRules(rules)
  return rules[index]
}

/**
 * Remove uma regra de aprovação
 */
export function deleteApprovalRule(id: string): boolean {
  const rules = getApprovalRules()
  const index = rules.findIndex(r => r.id === id)
  
  if (index === -1) return false
  
  rules.splice(index, 1)
  saveApprovalRules(rules)
  return true
}

/**
 * Obtém o histórico de aprovações
 */
export function getApprovalHistory(companyId?: string, limit = 50): ApprovalRequest[] {
  return getApprovalRequests(companyId)
    .filter(r => r.status !== "pending")
    .sort((a, b) => new Date(b.reviewedAt || b.updatedAt).getTime() - new Date(a.reviewedAt || a.updatedAt).getTime())
    .slice(0, limit)
}

// ===========================================
// SISTEMA DE PRECIFICAÇÃO POR QUANTIDADE
// ===========================================

/**
 * Tier de Preço - Define preço por faixa de quantidade
 */
export interface PriceTier {
  minQuantity: number
  maxQuantity: number | null  // null = infinito (para tier +1000)
  price: number
  discount: number  // percentual de desconto (ex: 15 = 15%)
}

/**
 * Tiers padrão de quantidade
 */
export const DEFAULT_QUANTITY_TIERS = [
  { min: 1, max: 10, discountPercent: 0 },
  { min: 10, max: 50, discountPercent: 5 },
  { min: 50, max: 100, discountPercent: 10 },
  { min: 100, max: 500, discountPercent: 15 },
  { min: 500, max: 1000, discountPercent: 20 },
  { min: 1000, max: null, discountPercent: 25 },
]

/**
 * Gera tiers de preço padrão baseado no preço base
 */
export function generateDefaultPriceTiers(basePrice: number): PriceTier[] {
  return DEFAULT_QUANTITY_TIERS.map(tier => ({
    minQuantity: tier.min,
    maxQuantity: tier.max,
    price: Math.round(basePrice * (1 - tier.discountPercent / 100) * 100) / 100,
    discount: tier.discountPercent,
  }))
}

/**
 * Calcula preço baseado na quantidade
 */
export function calculatePriceByQuantity(
  priceTiers: PriceTier[] | undefined,
  basePrice: number,
  quantity: number
): { price: number; discount: number; tier: PriceTier | null } {
  if (!priceTiers || priceTiers.length === 0) {
    return { price: basePrice, discount: 0, tier: null }
  }

  // Encontra o tier correto para a quantidade
  const tier = priceTiers.find(t => 
    quantity >= t.minQuantity && (t.maxQuantity === null || quantity < t.maxQuantity)
  )

  if (!tier) {
    return { price: basePrice, discount: 0, tier: null }
  }

  return { price: tier.price, discount: tier.discount, tier }
}

/**
 * Valida tiers de preço
 */
export function validatePriceTiers(tiers: PriceTier[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (tiers.length === 0) {
    errors.push("Pelo menos um tier de preço é necessário")
    return { valid: false, errors }
  }

  // Verificar ordem crescente de quantidades
  for (let i = 0; i < tiers.length - 1; i++) {
    if (tiers[i].maxQuantity !== null && tiers[i].maxQuantity! <= tiers[i].minQuantity) {
      errors.push(`Tier ${i + 1}: quantidade máxima deve ser maior que mínima`)
    }
    if (i < tiers.length - 1 && tiers[i].maxQuantity !== tiers[i + 1].minQuantity) {
      errors.push(`Tiers ${i + 1} e ${i + 2}: quantidades não são contínuas`)
    }
  }

  // Verificar preços não negativos
  tiers.forEach((tier, i) => {
    if (tier.price < 0) {
      errors.push(`Tier ${i + 1}: preço não pode ser negativo`)
    }
    if (tier.discount < 0 || tier.discount > 100) {
      errors.push(`Tier ${i + 1}: desconto deve estar entre 0 e 100%`)
    }
  })

  return { valid: errors.length === 0, errors }
}

// ===========================================
// SISTEMA DE PERSONALIZAÇÃO DE PRODUTOS
// ===========================================

/**
 * Opção de Personalização (silk, digital, bordado, etc.)
 */
export interface CustomizationOption {
  id: string
  name: string
  slug: string
  type: "predefined" | "custom"
  description?: string
  additionalCost: number  // custo adicional por unidade
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Opções de personalização pré-definidas
 */
const PREDEFINED_CUSTOMIZATIONS: Omit<CustomizationOption, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: "Silk (Serigrafia)", slug: "silk", type: "predefined", description: "Impressão em tela para tecidos e materiais planos", additionalCost: 5.00, isActive: true },
  { name: "Impressão Digital", slug: "digital", type: "predefined", description: "Impressão digital de alta qualidade", additionalCost: 8.00, isActive: true },
  { name: "Bordado", slug: "bordado", type: "predefined", description: "Bordado industrial com linhas de alta durabilidade", additionalCost: 12.00, isActive: true },
  { name: "Laser", slug: "laser", type: "predefined", description: "Gravação a laser para metais e acrílicos", additionalCost: 15.00, isActive: true },
  { name: "Transfer", slug: "transfer", type: "predefined", description: "Aplicação por transferência térmica", additionalCost: 6.00, isActive: true },
  { name: "Sem Personalização", slug: "sem-personalizacao", type: "predefined", description: "Produto sem personalização", additionalCost: 0, isActive: true },
]

const CUSTOMIZATION_OPTIONS_KEY = "yoobe_customization_options_v1"

/**
 * Obtém todas as opções de personalização
 */
export function getCustomizationOptions(): CustomizationOption[] {
  const storage = getStorage()
  const stored = storage.getItem(CUSTOMIZATION_OPTIONS_KEY)
  
  if (!stored) {
    // Seed com opções pré-definidas
    const now = new Date().toISOString()
    const initial: CustomizationOption[] = PREDEFINED_CUSTOMIZATIONS.map((opt, idx) => ({
      ...opt,
      id: `customization_${idx + 1}`,
      createdAt: now,
      updatedAt: now,
    }))
    storage.setItem(CUSTOMIZATION_OPTIONS_KEY, JSON.stringify(initial))
    return initial
  }
  
  return safeParse(stored, [])
}

/**
 * Salva opções de personalização
 */
export function saveCustomizationOptions(options: CustomizationOption[]): void {
  const storage = getStorage()
  storage.setItem(CUSTOMIZATION_OPTIONS_KEY, JSON.stringify(options))
}

/**
 * Obtém opção de personalização por ID
 */
export function getCustomizationOptionById(id: string): CustomizationOption | undefined {
  return getCustomizationOptions().find(o => o.id === id)
}

/**
 * Cria uma nova opção de personalização
 */
export function createCustomizationOption(data: Partial<CustomizationOption>): CustomizationOption {
  const options = getCustomizationOptions()
  const now = new Date().toISOString()
  
  const newOption: CustomizationOption = {
    id: `customization_${Date.now()}`,
    name: data.name || "",
    slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || "",
    type: data.type || "custom",
    description: data.description,
    additionalCost: data.additionalCost || 0,
    isActive: data.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  }
  
  options.push(newOption)
  saveCustomizationOptions(options)
  return newOption
}

/**
 * Atualiza uma opção de personalização
 */
export function updateCustomizationOption(id: string, data: Partial<CustomizationOption>): CustomizationOption | null {
  const options = getCustomizationOptions()
  const index = options.findIndex(o => o.id === id)
  
  if (index === -1) return null
  
  options[index] = {
    ...options[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  
  saveCustomizationOptions(options)
  return options[index]
}

/**
 * Remove uma opção de personalização
 */
export function deleteCustomizationOption(id: string): boolean {
  const options = getCustomizationOptions()
  const filtered = options.filter(o => o.id !== id)
  
  if (filtered.length === options.length) return false
  
  saveCustomizationOptions(filtered)
  return true
}

// ===========================================
// SISTEMA DE FORNECEDORES
// ===========================================

/**
 * Tipo de API do fornecedor
 */
export type SupplierApiType = "spot_brindes" | "custom" | "manual"

/**
 * Status do fornecedor
 */
export type SupplierStatus = "active" | "inactive" | "pending"

/**
 * Fornecedor de produtos
 */
export interface Supplier {
  id: string
  name: string
  slug: string
  apiEndpoint?: string
  apiKey?: string  // Armazenado de forma segura
  apiType: SupplierApiType
  status: SupplierStatus
  contactInfo: {
    email?: string
    phone?: string
    website?: string
  }
  syncSettings: {
    autoSyncPrices: boolean
    autoSyncStock: boolean
    syncInterval: number  // em minutos
    lastSync?: string
  }
  metadata: {
    cnpj?: string
    address?: string
    notes?: string
  }
  productsCount?: number
  createdAt: string
  updatedAt: string
  createdBy: string
  approvedBy?: string
  approvedAt?: string
}

/**
 * Token de autorização para gestores
 */
export interface SupplierToken {
  id: string
  token: string
  companyId: string
  supplierId?: string  // Opcional - limita a um fornecedor específico
  permissions: ("add_supplier" | "link_products" | "sync_data")[]
  expiresAt?: string
  usedCount: number
  maxUses?: number
  isActive: boolean
  createdBy: string
  createdAt: string
  lastUsedAt?: string
}

/**
 * Log de sincronização com fornecedor
 */
export interface SupplierSyncLog {
  id: string
  supplierId: string
  syncType: "prices" | "stock" | "products" | "full"
  status: "success" | "partial" | "failed"
  productsUpdated: number
  productsCreated: number
  productsFailed: number
  errors?: string[]
  startedAt: string
  completedAt: string
  duration: number  // em milissegundos
  triggeredBy: "auto" | "manual"
  triggeredByUser?: string
}

// Storage keys
const SUPPLIERS_KEY = "yoobe_suppliers_v1"
const SUPPLIER_TOKENS_KEY = "yoobe_supplier_tokens_v1"
const SUPPLIER_SYNC_LOGS_KEY = "yoobe_supplier_sync_logs_v1"

/**
 * Fornecedor inicial: Spot Brindes
 */
const INITIAL_SUPPLIERS: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Spot Brindes",
    slug: "spot-brindes",
    apiType: "spot_brindes",
    status: "active",
    contactInfo: {
      email: "contato@spotbrindes.com.br",
      website: "https://spotbrindes.com.br",
    },
    syncSettings: {
      autoSyncPrices: true,
      autoSyncStock: true,
      syncInterval: 60, // 1 hora
    },
    metadata: {
      notes: "Fornecedor principal de brindes corporativos",
    },
    createdBy: "system",
  },
]

/**
 * Obtém todos os fornecedores
 */
export function getSuppliers(): Supplier[] {
  const storage = getStorage()
  const stored = storage.getItem(SUPPLIERS_KEY)
  
  if (!stored) {
    // Seed com fornecedor inicial
    const now = new Date().toISOString()
    const initial: Supplier[] = INITIAL_SUPPLIERS.map((sup, idx) => ({
      ...sup,
      id: `supplier_${idx + 1}`,
      createdAt: now,
      updatedAt: now,
    }))
    storage.setItem(SUPPLIERS_KEY, JSON.stringify(initial))
    return initial
  }
  
  return safeParse(stored, [])
}

/**
 * Salva fornecedores
 */
export function saveSuppliers(suppliers: Supplier[]): void {
  const storage = getStorage()
  storage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers))
}

/**
 * Obtém fornecedor por ID
 */
export function getSupplierById(id: string): Supplier | undefined {
  return getSuppliers().find(s => s.id === id)
}

/**
 * Obtém fornecedor por slug
 */
export function getSupplierBySlug(slug: string): Supplier | undefined {
  return getSuppliers().find(s => s.slug === slug)
}

/**
 * Cria um novo fornecedor
 */
export function createSupplier(data: Partial<Supplier>, createdBy: string): Supplier {
  const suppliers = getSuppliers()
  const now = new Date().toISOString()
  
  const newSupplier: Supplier = {
    id: `supplier_${Date.now()}`,
    name: data.name || "",
    slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || "",
    apiEndpoint: data.apiEndpoint,
    apiKey: data.apiKey,
    apiType: data.apiType || "manual",
    status: data.status || "pending",
    contactInfo: data.contactInfo || {},
    syncSettings: data.syncSettings || {
      autoSyncPrices: false,
      autoSyncStock: false,
      syncInterval: 60,
    },
    metadata: data.metadata || {},
    createdBy,
    createdAt: now,
    updatedAt: now,
  }
  
  suppliers.push(newSupplier)
  saveSuppliers(suppliers)
  return newSupplier
}

/**
 * Atualiza um fornecedor
 */
export function updateSupplier(id: string, data: Partial<Supplier>): Supplier | null {
  const suppliers = getSuppliers()
  const index = suppliers.findIndex(s => s.id === id)
  
  if (index === -1) return null
  
  suppliers[index] = {
    ...suppliers[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  
  saveSuppliers(suppliers)
  return suppliers[index]
}

/**
 * Remove um fornecedor
 */
export function deleteSupplier(id: string): boolean {
  const suppliers = getSuppliers()
  const filtered = suppliers.filter(s => s.id !== id)
  
  if (filtered.length === suppliers.length) return false
  
  saveSuppliers(filtered)
  return true
}

/**
 * Aprova um fornecedor pendente
 */
export function approveSupplier(id: string, approvedBy: string): Supplier | null {
  return updateSupplier(id, {
    status: "active",
    approvedBy,
    approvedAt: new Date().toISOString(),
  })
}

/**
 * Conta produtos vinculados a um fornecedor
 */
export function countSupplierProducts(supplierId: string): number {
  const products = getBaseProducts()
  return products.filter(p => p.supplierId === supplierId).length
}

// ===========================================
// TOKENS DE FORNECEDORES
// ===========================================

/**
 * Obtém todos os tokens
 */
export function getSupplierTokens(): SupplierToken[] {
  const storage = getStorage()
  const stored = storage.getItem(SUPPLIER_TOKENS_KEY)
  return stored ? safeParse(stored, []) : []
}

/**
 * Salva tokens
 */
export function saveSupplierTokens(tokens: SupplierToken[]): void {
  const storage = getStorage()
  storage.setItem(SUPPLIER_TOKENS_KEY, JSON.stringify(tokens))
}

/**
 * Gera um token único
 */
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'spt_'  // Prefixo para identificar tokens de fornecedor
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Cria um novo token de fornecedor
 */
export function createSupplierToken(
  companyId: string,
  permissions: SupplierToken["permissions"],
  createdBy: string,
  options?: {
    supplierId?: string
    expiresAt?: string
    maxUses?: number
  }
): SupplierToken {
  const tokens = getSupplierTokens()
  const now = new Date().toISOString()
  
  const newToken: SupplierToken = {
    id: `token_${Date.now()}`,
    token: generateToken(),
    companyId,
    supplierId: options?.supplierId,
    permissions,
    expiresAt: options?.expiresAt,
    maxUses: options?.maxUses,
    usedCount: 0,
    isActive: true,
    createdBy,
    createdAt: now,
  }
  
  tokens.push(newToken)
  saveSupplierTokens(tokens)
  return newToken
}

/**
 * Valida um token de fornecedor
 */
export function validateSupplierToken(token: string): { valid: boolean; tokenData?: SupplierToken; error?: string } {
  const tokens = getSupplierTokens()
  const tokenData = tokens.find(t => t.token === token)
  
  if (!tokenData) {
    return { valid: false, error: "Token não encontrado" }
  }
  
  if (!tokenData.isActive) {
    return { valid: false, error: "Token desativado" }
  }
  
  if (tokenData.expiresAt && new Date(tokenData.expiresAt) < new Date()) {
    return { valid: false, error: "Token expirado" }
  }
  
  if (tokenData.maxUses && tokenData.usedCount >= tokenData.maxUses) {
    return { valid: false, error: "Token atingiu limite de uso" }
  }
  
  return { valid: true, tokenData }
}

/**
 * Registra uso de um token
 */
export function useSupplierToken(token: string): boolean {
  const tokens = getSupplierTokens()
  const index = tokens.findIndex(t => t.token === token)
  
  if (index === -1) return false
  
  tokens[index].usedCount++
  tokens[index].lastUsedAt = new Date().toISOString()
  saveSupplierTokens(tokens)
  return true
}

/**
 * Revoga um token
 */
export function revokeSupplierToken(tokenId: string): boolean {
  const tokens = getSupplierTokens()
  const index = tokens.findIndex(t => t.id === tokenId)
  
  if (index === -1) return false
  
  tokens[index].isActive = false
  saveSupplierTokens(tokens)
  return true
}

/**
 * Obtém tokens por empresa
 */
export function getSupplierTokensByCompany(companyId: string): SupplierToken[] {
  return getSupplierTokens().filter(t => t.companyId === companyId)
}

// ===========================================
// LOGS DE SINCRONIZAÇÃO
// ===========================================

/**
 * Obtém logs de sincronização
 */
export function getSupplierSyncLogs(supplierId?: string): SupplierSyncLog[] {
  const storage = getStorage()
  const stored = storage.getItem(SUPPLIER_SYNC_LOGS_KEY)
  const logs: SupplierSyncLog[] = stored ? safeParse(stored, []) : []
  
  if (supplierId) {
    return logs.filter(l => l.supplierId === supplierId)
  }
  
  return logs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
}

/**
 * Salva logs de sincronização
 */
export function saveSupplierSyncLogs(logs: SupplierSyncLog[]): void {
  const storage = getStorage()
  // Manter apenas os últimos 100 logs
  const trimmed = logs.slice(-100)
  storage.setItem(SUPPLIER_SYNC_LOGS_KEY, JSON.stringify(trimmed))
}

/**
 * Cria um log de sincronização
 */
export function createSupplierSyncLog(data: Omit<SupplierSyncLog, 'id'>): SupplierSyncLog {
  const logs = getSupplierSyncLogs()
  
  const newLog: SupplierSyncLog = {
    ...data,
    id: `sync_log_${Date.now()}`,
  }
  
  logs.push(newLog)
  saveSupplierSyncLogs(logs)
  
  // Atualizar última sincronização do fornecedor
  updateSupplier(data.supplierId, {
    syncSettings: {
      ...getSupplierById(data.supplierId)?.syncSettings,
      lastSync: data.completedAt,
    } as Supplier['syncSettings'],
  })
  
  return newLog
}

// ===========================================
// EXTENSÃO DO BASEPRODUCT COM NOVOS CAMPOS
// ===========================================

/**
 * Interface estendida de BaseProduct com novos campos
 */
export interface BaseProductExtended extends BaseProduct {
  priceTiers?: PriceTier[]
  customizationOptionIds?: string[]  // IDs das opções de personalização
  supplierId?: string
  supplierSku?: string
  supplierData?: {
    externalId?: string
    lastSyncAt?: string
    syncStatus?: "synced" | "pending" | "error"
  }
}

/**
 * Atualiza tiers de preço de um produto base
 */
export function updateBaseProductPriceTiers(baseProductId: string, tiers: PriceTier[]): BaseProduct | null {
  const validation = validatePriceTiers(tiers)
  if (!validation.valid) {
    console.error("Tiers inválidos:", validation.errors)
    return null
  }
  
  return updateBaseProduct(baseProductId, { 
    priceTiers: tiers 
  } as Partial<BaseProduct>)
}

/**
 * Vincula produto a um fornecedor
 */
export function linkProductToSupplier(
  baseProductId: string,
  supplierId: string,
  supplierSku?: string
): BaseProduct | null {
  const supplier = getSupplierById(supplierId)
  if (!supplier) {
    console.error("Fornecedor não encontrado:", supplierId)
    return null
  }
  
  return updateBaseProduct(baseProductId, {
    supplierId,
    supplierSku,
    supplierData: {
      syncStatus: "pending",
    },
  } as Partial<BaseProduct>)
}

/**
 * Remove vínculo de fornecedor de um produto
 */
export function unlinkProductFromSupplier(baseProductId: string): BaseProduct | null {
  return updateBaseProduct(baseProductId, {
    supplierId: undefined,
    supplierSku: undefined,
    supplierData: undefined,
  } as Partial<BaseProduct>)
}

/**
 * Adiciona opção de personalização a um produto
 */
export function addCustomizationToProduct(
  baseProductId: string,
  customizationId: string
): BaseProduct | null {
  const product = getBaseProductById(baseProductId) as BaseProductExtended | undefined
  if (!product) return null
  
  const currentOptions = product.customizationOptionIds || []
  if (currentOptions.includes(customizationId)) {
    return product // Já existe
  }
  
  return updateBaseProduct(baseProductId, {
    customizationOptionIds: [...currentOptions, customizationId],
  } as Partial<BaseProduct>)
}

/**
 * Remove opção de personalização de um produto
 */
export function removeCustomizationFromProduct(
  baseProductId: string,
  customizationId: string
): BaseProduct | null {
  const product = getBaseProductById(baseProductId) as BaseProductExtended | undefined
  if (!product) return null
  
  const currentOptions = product.customizationOptionIds || []
  
  return updateBaseProduct(baseProductId, {
    customizationOptionIds: currentOptions.filter(id => id !== customizationId),
  } as Partial<BaseProduct>)
}

/**
 * Obtém opções de personalização de um produto
 */
export function getProductCustomizationOptions(baseProductId: string): CustomizationOption[] {
  const product = getBaseProductById(baseProductId) as BaseProductExtended | undefined
  if (!product || !product.customizationOptionIds) return []
  
  const allOptions = getCustomizationOptions()
  return allOptions.filter(o => product.customizationOptionIds?.includes(o.id) && o.isActive)
}

/**
 * Obtém produtos de um fornecedor
 */
export function getProductsBySupplier(supplierId: string): BaseProduct[] {
  const products = getBaseProducts() as BaseProductExtended[]
  return products.filter(p => p.supplierId === supplierId)
}

// ===========================================
// IMPORTAÇÃO CSV DE TIERS
// ===========================================

/**
 * Resultado da importação de tiers via CSV
 */
export interface PriceTierImportResult {
  success: number
  failed: number
  errors: { row: number; sku: string; error: string }[]
}

/**
 * Importa tiers de preço via CSV
 * Formato esperado: sku,min_qty,max_qty,price,discount
 */
export function importPriceTiersFromCSV(csvData: string): PriceTierImportResult {
  const result: PriceTierImportResult = {
    success: 0,
    failed: 0,
    errors: [],
  }
  
  const lines = csvData.trim().split('\n')
  if (lines.length < 2) {
    result.errors.push({ row: 0, sku: '', error: 'CSV vazio ou sem dados' })
    return result
  }
  
  // Pular header
  const dataLines = lines.slice(1)
  
  // Agrupar por SKU
  const tiersBySku: Record<string, PriceTier[]> = {}
  
  dataLines.forEach((line, index) => {
    const row = index + 2 // +2 porque pulamos header e índice começa em 0
    const parts = line.split(',').map(s => s.trim())
    
    if (parts.length < 5) {
      result.errors.push({ row, sku: parts[0] || '', error: 'Linha incompleta' })
      result.failed++
      return
    }
    
    const [sku, minQty, maxQty, price, discount] = parts
    
    if (!sku) {
      result.errors.push({ row, sku: '', error: 'SKU não informado' })
      result.failed++
      return
    }
    
    if (!tiersBySku[sku]) {
      tiersBySku[sku] = []
    }
    
    tiersBySku[sku].push({
      minQuantity: parseInt(minQty) || 1,
      maxQuantity: maxQty === '' || maxQty === 'null' ? null : parseInt(maxQty),
      price: parseFloat(price) || 0,
      discount: parseFloat(discount) || 0,
    })
  })
  
  // Atualizar produtos
  const products = getBaseProducts()
  
  Object.entries(tiersBySku).forEach(([sku, tiers]) => {
    const product = products.find(p => p.sku === sku)
    
    if (!product) {
      result.errors.push({ row: 0, sku, error: 'Produto não encontrado' })
      result.failed++
      return
    }
    
    // Ordenar tiers por quantidade mínima
    tiers.sort((a, b) => a.minQuantity - b.minQuantity)
    
    const validation = validatePriceTiers(tiers)
    if (!validation.valid) {
      result.errors.push({ row: 0, sku, error: validation.errors.join('; ') })
      result.failed++
      return
    }
    
    const updated = updateBaseProduct(product.id, { priceTiers: tiers } as Partial<BaseProduct>)
    if (updated) {
      result.success++
    } else {
      result.errors.push({ row: 0, sku, error: 'Erro ao atualizar produto' })
      result.failed++
    }
  })
  
  return result
}

/**
 * Gera template CSV para importação de tiers
 */
export function generatePriceTierCSVTemplate(): string {
  const header = "sku,min_qty,max_qty,price,discount"
  const example1 = "PROD-001,1,10,100.00,0"
  const example2 = "PROD-001,10,50,95.00,5"
  const example3 = "PROD-001,50,100,90.00,10"
  const example4 = "PROD-001,100,500,85.00,15"
  const example5 = "PROD-001,500,1000,80.00,20"
  const example6 = "PROD-001,1000,null,75.00,25"
  
  return [header, example1, example2, example3, example4, example5, example6].join('\n')
}

// ===========================================
// CENTROS DE CUSTO (Cost Centers)
// ===========================================

const COST_CENTERS_KEY = "yoobe_cost_centers"

/**
 * Obtém todos os centros de custo
 */
export function getCostCenters(): CostCenter[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(COST_CENTERS_KEY)
  return data ? JSON.parse(data) : []
}

/**
 * Obtém centros de custo por empresa
 */
export function getCostCentersByCompany(companyId: string): CostCenter[] {
  return getCostCenters().filter(cc => cc.companyId === companyId)
}

/**
 * Obtém centro de custo por ID
 */
export function getCostCenterById(id: string): CostCenter | undefined {
  return getCostCenters().find(cc => cc.id === id)
}

/**
 * Cria um novo centro de custo
 */
export function createCostCenter(data: Omit<CostCenter, "id" | "createdAt" | "updatedAt" | "availableBudget" | "usedBudget" | "pendingRequests">): CostCenter {
  const costCenters = getCostCenters()
  const now = new Date().toISOString()
  
  const costCenter: CostCenter = {
    ...data,
    id: `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    usedBudget: 0,
    availableBudget: data.allocatedBudget,
    pendingRequests: 0,
    createdAt: now,
    updatedAt: now,
  }
  
  costCenters.push(costCenter)
  localStorage.setItem(COST_CENTERS_KEY, JSON.stringify(costCenters))
  
  return costCenter
}

/**
 * Atualiza um centro de custo
 */
export function updateCostCenter(id: string, updates: Partial<CostCenter>): CostCenter | null {
  const costCenters = getCostCenters()
  const index = costCenters.findIndex(cc => cc.id === id)
  
  if (index === -1) return null
  
  const updated: CostCenter = {
    ...costCenters[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  // Recalcular saldo disponível se orçamento alocado mudou
  if (updates.allocatedBudget !== undefined) {
    updated.availableBudget = updated.allocatedBudget - updated.usedBudget
  }
  
  costCenters[index] = updated
  localStorage.setItem(COST_CENTERS_KEY, JSON.stringify(costCenters))
  
  return updated
}

/**
 * Remove um centro de custo
 */
export function deleteCostCenter(id: string): boolean {
  const costCenters = getCostCenters()
  const filtered = costCenters.filter(cc => cc.id !== id)
  
  if (filtered.length === costCenters.length) return false
  
  localStorage.setItem(COST_CENTERS_KEY, JSON.stringify(filtered))
  return true
}

/**
 * Registra uso de verba em um centro de custo
 */
export function useCostCenterBudget(costCenterId: string, amount: number): CostCenter | null {
  const costCenter = getCostCenterById(costCenterId)
  if (!costCenter) return null
  
  return updateCostCenter(costCenterId, {
    usedBudget: costCenter.usedBudget + amount,
    availableBudget: costCenter.availableBudget - amount,
  })
}

/**
 * Seed inicial de centros de custo para demo
 */
export function seedCostCenters(companyId: string): void {
  const existing = getCostCentersByCompany(companyId)
  if (existing.length > 0) return
  
  const demoData = [
    { name: "Marketing", code: "team_marketing", allocatedBudget: 50000, managerId: "user_1", managerName: "Ana Costa" },
    { name: "Vendas", code: "team_vendas", allocatedBudget: 35000, managerId: "user_2", managerName: "Carlos Silva" },
    { name: "Recursos Humanos", code: "team_rh", allocatedBudget: 25000, managerId: "user_3", managerName: "Maria Santos" },
    { name: "Tecnologia", code: "team_ti", allocatedBudget: 40000, managerId: "user_4", managerName: "Pedro Oliveira" },
  ]
  
  const usedAmounts = [12500, 8000, 15000, 0] // Valores já utilizados para demo
  
  demoData.forEach((data, idx) => {
    const cc = createCostCenter({
      ...data,
      companyId,
      isActive: true,
    })
    // Simular uso
    if (usedAmounts[idx] > 0) {
      useCostCenterBudget(cc.id, usedAmounts[idx])
    }
  })
  
  // Adicionar solicitação pendente no centro de Vendas
  const vendas = getCostCentersByCompany(companyId).find(cc => cc.code === "team_vendas")
  if (vendas) {
    updateCostCenter(vendas.id, { pendingRequests: 1 })
  }
}

// ===========================================
// COMPRADORES DA EMPRESA (Company Buyers)
// ===========================================

const COMPANY_BUYERS_KEY = "yoobe_company_buyers"

/**
 * Obtém todos os compradores
 */
export function getCompanyBuyers(): CompanyBuyer[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(COMPANY_BUYERS_KEY)
  return data ? JSON.parse(data) : []
}

/**
 * Obtém compradores por empresa
 */
export function getCompanyBuyersByCompany(companyId: string): CompanyBuyer[] {
  return getCompanyBuyers().filter(b => b.companyId === companyId)
}

/**
 * Obtém comprador por ID
 */
export function getCompanyBuyerById(id: string): CompanyBuyer | undefined {
  return getCompanyBuyers().find(b => b.id === id)
}

/**
 * Obtém comprador por userId
 */
export function getCompanyBuyerByUserId(userId: string): CompanyBuyer | undefined {
  return getCompanyBuyers().find(b => b.userId === userId)
}

/**
 * Cria um novo comprador
 */
export function createCompanyBuyer(data: Omit<CompanyBuyer, "id" | "createdAt" | "updatedAt" | "totalSpent">): CompanyBuyer {
  const buyers = getCompanyBuyers()
  const now = new Date().toISOString()
  
  const buyer: CompanyBuyer = {
    ...data,
    id: `buyer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    totalSpent: 0,
    createdAt: now,
    updatedAt: now,
  }
  
  buyers.push(buyer)
  localStorage.setItem(COMPANY_BUYERS_KEY, JSON.stringify(buyers))
  
  return buyer
}

/**
 * Atualiza um comprador
 */
export function updateCompanyBuyer(id: string, updates: Partial<CompanyBuyer>): CompanyBuyer | null {
  const buyers = getCompanyBuyers()
  const index = buyers.findIndex(b => b.id === id)
  
  if (index === -1) return null
  
  const updated: CompanyBuyer = {
    ...buyers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  buyers[index] = updated
  localStorage.setItem(COMPANY_BUYERS_KEY, JSON.stringify(buyers))
  
  return updated
}

/**
 * Remove um comprador
 */
export function deleteCompanyBuyer(id: string): boolean {
  const buyers = getCompanyBuyers()
  const filtered = buyers.filter(b => b.id !== id)
  
  if (filtered.length === buyers.length) return false
  
  localStorage.setItem(COMPANY_BUYERS_KEY, JSON.stringify(filtered))
  return true
}

/**
 * Registra gasto de um comprador
 */
export function recordBuyerSpend(buyerId: string, amount: number): CompanyBuyer | null {
  const buyer = getCompanyBuyerById(buyerId)
  if (!buyer) return null
  
  return updateCompanyBuyer(buyerId, {
    totalSpent: buyer.totalSpent + amount,
  })
}

/**
 * Seed inicial de compradores para demo
 */
export function seedCompanyBuyers(companyId: string): void {
  const existing = getCompanyBuyersByCompany(companyId)
  if (existing.length > 0) return
  
  const costCenters = getCostCentersByCompany(companyId)
  const allCostCenterIds = costCenters.map(cc => cc.id)
  
  const demoData = [
    { name: "Ana Costa", email: "ana.costa@empresa.com", role: "admin" as const, spendLimit: 50000, userId: "user_1" },
    { name: "Carlos Silva", email: "carlos.silva@empresa.com", role: "approver" as const, spendLimit: 25000, userId: "user_2" },
    { name: "Maria Santos", email: "maria.santos@empresa.com", role: "buyer" as const, spendLimit: 10000, userId: "user_3" },
    { name: "Pedro Oliveira", email: "pedro.oliveira@empresa.com", role: "buyer" as const, spendLimit: 5000, userId: "user_4" },
  ]
  
  demoData.forEach((data, idx) => {
    createCompanyBuyer({
      ...data,
      companyId,
      costCenterIds: idx === 0 ? allCostCenterIds : [costCenters[idx % costCenters.length]?.id].filter(Boolean),
      isActive: true,
    })
  })
}

// ===========================================
// TRANSAÇÕES DE CENTRO DE CUSTO
// ===========================================

const COST_CENTER_TRANSACTIONS_KEY = "yoobe_cost_center_transactions"

/**
 * Obtém todas as transações
 */
export function getCostCenterTransactions(): CostCenterTransaction[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(COST_CENTER_TRANSACTIONS_KEY)
  return data ? JSON.parse(data) : []
}

/**
 * Obtém transações por centro de custo
 */
export function getTransactionsByCostCenter(costCenterId: string): CostCenterTransaction[] {
  return getCostCenterTransactions()
    .filter(t => t.costCenterId === costCenterId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * Obtém transações por empresa
 */
export function getTransactionsByCompany(companyId: string): CostCenterTransaction[] {
  return getCostCenterTransactions()
    .filter(t => t.companyId === companyId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

/**
 * Cria uma nova transação
 */
export function createCostCenterTransaction(data: Omit<CostCenterTransaction, "id" | "createdAt">): CostCenterTransaction {
  const transactions = getCostCenterTransactions()
  const now = new Date().toISOString()
  
  const transaction: CostCenterTransaction = {
    ...data,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
  }
  
  transactions.push(transaction)
  localStorage.setItem(COST_CENTER_TRANSACTIONS_KEY, JSON.stringify(transactions))
  
  return transaction
}

/**
 * Registra alocação de verba (cria transação + atualiza centro de custo)
 */
export function recordBudgetAllocation(
  costCenterId: string,
  amount: number,
  description: string,
  userId?: string,
  userName?: string
): CostCenterTransaction | null {
  const costCenter = getCostCenterById(costCenterId)
  if (!costCenter) return null
  
  // Atualiza o centro de custo
  updateCostCenter(costCenterId, {
    allocatedBudget: costCenter.allocatedBudget + amount,
    availableBudget: costCenter.availableBudget + amount,
  })
  
  // Cria a transação
  return createCostCenterTransaction({
    costCenterId,
    companyId: costCenter.companyId,
    type: "allocation",
    amount,
    description,
    userId,
    userName,
  })
}

/**
 * Registra despesa (cria transação + atualiza centro de custo)
 */
export function recordBudgetExpense(
  costCenterId: string,
  amount: number,
  description: string,
  budgetId?: string,
  budgetTitle?: string,
  userId?: string,
  userName?: string
): CostCenterTransaction | null {
  const costCenter = getCostCenterById(costCenterId)
  if (!costCenter) return null
  
  // Atualiza o centro de custo
  updateCostCenter(costCenterId, {
    usedBudget: costCenter.usedBudget + amount,
    availableBudget: costCenter.availableBudget - amount,
  })
  
  // Cria a transação
  return createCostCenterTransaction({
    costCenterId,
    companyId: costCenter.companyId,
    type: "expense",
    amount,
    description,
    budgetId,
    budgetTitle,
    userId,
    userName,
  })
}

/**
 * Registra reembolso (cria transação + atualiza centro de custo)
 */
export function recordBudgetRefund(
  costCenterId: string,
  amount: number,
  description: string,
  budgetId?: string,
  budgetTitle?: string,
  userId?: string,
  userName?: string
): CostCenterTransaction | null {
  const costCenter = getCostCenterById(costCenterId)
  if (!costCenter) return null
  
  // Atualiza o centro de custo
  updateCostCenter(costCenterId, {
    usedBudget: costCenter.usedBudget - amount,
    availableBudget: costCenter.availableBudget + amount,
  })
  
  // Cria a transação
  return createCostCenterTransaction({
    costCenterId,
    companyId: costCenter.companyId,
    type: "refund",
    amount,
    description,
    budgetId,
    budgetTitle,
    userId,
    userName,
  })
}

/**
 * Seed inicial de transações para demo
 */
export function seedCostCenterTransactions(companyId: string): void {
  const costCenters = getCostCentersByCompany(companyId)
  if (costCenters.length === 0) return
  
  // Check if transactions already exist for this company
  const existing = getTransactionsByCompany(companyId)
  if (existing.length > 0) return
  
  const now = new Date()
  
  // Create demo transactions for each cost center
  costCenters.forEach(cc => {
    // Initial allocation
    createCostCenterTransaction({
      costCenterId: cc.id,
      companyId,
      type: "allocation",
      amount: cc.allocatedBudget,
      description: "Alocação inicial de verba",
      userName: "Sistema",
    })
    
    // Some expenses if budget was used
    if (cc.usedBudget > 0) {
      createCostCenterTransaction({
        costCenterId: cc.id,
        companyId,
        type: "expense",
        amount: cc.usedBudget * 0.6,
        description: "Compra de materiais de escritório",
        userName: "Ana Costa",
      })
      
      createCostCenterTransaction({
        costCenterId: cc.id,
        companyId,
        type: "expense",
        amount: cc.usedBudget * 0.4,
        description: "Serviços de consultoria",
        userName: "Carlos Silva",
      })
    }
  })
}

// ===========================================
// SAVED DEMOS - GERENCIAMENTO DE DEMOS
// ===========================================

const SAVED_DEMOS_KEY = "yoobe_saved_demos"
const CURRENT_DEMO_KEY = "yoobe_current_demo"

/**
 * Interface para demos salvas
 */
export interface SavedDemo {
  id: string                    // UUID único (ex: "demo_abc123")
  createdAt: string             // ISO timestamp
  updatedAt: string             
  creatorEmail: string          // Email de quem criou
  creatorName: string           // Nome do criador
  companyName: string           // Nome da empresa demo
  companyId: string             // ID da company no storage
  colors: { 
    primary: string
    secondary: string 
  }
  logo?: string                 // URL do logo
  vertical: string              // tech, finance, etc.
  userCount: number             // Usuários simulados
  shareableLink: string         // Link público completo
  status: "active" | "archived"
}

/**
 * Gera um ID único para a demo
 */
export function generateDemoId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let id = ""
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `demo_${id}`
}

/**
 * Obtém todas as demos salvas
 */
export function getSavedDemos(): SavedDemo[] {
  const storage = getStorage()
  const stored = storage.getItem(SAVED_DEMOS_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

/**
 * Salva uma nova demo
 */
export function saveDemoSession(demo: SavedDemo): void {
  const demos = getSavedDemos()
  const existingIndex = demos.findIndex(d => d.id === demo.id)
  
  if (existingIndex >= 0) {
    demos[existingIndex] = { ...demo, updatedAt: new Date().toISOString() }
  } else {
    demos.push(demo)
  }
  
  const storage = getStorage()
  storage.setItem(SAVED_DEMOS_KEY, JSON.stringify(demos))
}

/**
 * Obtém uma demo pelo ID
 */
export function getDemoById(id: string): SavedDemo | null {
  const demos = getSavedDemos()
  return demos.find(d => d.id === id) || null
}

/**
 * Atualiza uma demo existente
 */
export function updateSavedDemo(id: string, data: Partial<SavedDemo>): SavedDemo | null {
  const demos = getSavedDemos()
  const index = demos.findIndex(d => d.id === id)
  
  if (index === -1) return null
  
  demos[index] = {
    ...demos[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  
  const storage = getStorage()
  storage.setItem(SAVED_DEMOS_KEY, JSON.stringify(demos))
  
  return demos[index]
}

/**
 * Exclui uma demo
 */
export function deleteSavedDemo(id: string): boolean {
  const demos = getSavedDemos()
  const filtered = demos.filter(d => d.id !== id)
  
  if (filtered.length === demos.length) return false
  
  const storage = getStorage()
  storage.setItem(SAVED_DEMOS_KEY, JSON.stringify(filtered))
  
  // Se a demo atual era a excluída, limpar
  const currentDemo = getCurrentDemoId()
  if (currentDemo === id) {
    storage.removeItem(CURRENT_DEMO_KEY)
  }
  
  return true
}

/**
 * Obtém o ID da demo atual
 */
export function getCurrentDemoId(): string | null {
  const storage = getStorage()
  return storage.getItem(CURRENT_DEMO_KEY)
}

/**
 * Define a demo atual
 */
export function setCurrentDemoId(demoId: string): void {
  const storage = getStorage()
  storage.setItem(CURRENT_DEMO_KEY, demoId)
}

/**
 * Carrega o contexto de uma demo (auth, company, etc.)
 * Retorna true se carregou com sucesso
 */
export function loadDemoContext(demoId: string): boolean {
  const demo = getDemoById(demoId)
  if (!demo) return false
  
  // Verificar se a company existe
  const company = getCompanyById(demo.companyId)
  if (!company) return false
  
  // Definir a demo como atual
  setCurrentDemoId(demoId)
  
  // Configurar auth para acessar a demo
  const storage = getStorage()
  const authData = {
    userId: `demo_user_${demoId}`,
    email: demo.creatorEmail,
    role: "manager",
    companyId: demo.companyId,
    companyName: demo.companyName,
    firstName: demo.creatorName.split(" ")[0] || "Demo",
    lastName: demo.creatorName.split(" ").slice(1).join(" ") || "User",
    isDemoAccess: true,
    demoId: demoId,
  }
  storage.setItem("yoobe_auth", JSON.stringify(authData))
  
  return true
}

/**
 * Cria uma demo completa a partir do onboarding
 */
export function createDemoFromOnboarding(params: {
  creatorEmail: string
  creatorName: string
  companyName: string
  companyId: string
  colors: { primary: string; secondary: string }
  logo?: string
  vertical: string
  userCount: number
}): SavedDemo {
  const now = new Date().toISOString()
  const demoId = generateDemoId()
  
  // Gerar link compartilhável (usa window.location.origin se disponível)
  let baseUrl = "http://localhost:3000"
  if (typeof window !== "undefined") {
    baseUrl = window.location.origin
  }
  
  const demo: SavedDemo = {
    id: demoId,
    createdAt: now,
    updatedAt: now,
    creatorEmail: params.creatorEmail,
    creatorName: params.creatorName,
    companyName: params.companyName,
    companyId: params.companyId,
    colors: params.colors,
    logo: params.logo,
    vertical: params.vertical,
    userCount: params.userCount,
    shareableLink: `${baseUrl}/demo/${demoId}`,
    status: "active",
  }
  
  saveDemoSession(demo)
  setCurrentDemoId(demoId)
  
  return demo
}

/**
 * Arquiva uma demo (soft delete)
 */
export function archiveDemo(id: string): boolean {
  const result = updateSavedDemo(id, { status: "archived" })
  return result !== null
}

/**
 * Restaura uma demo arquivada
 */
export function restoreDemo(id: string): boolean {
  const result = updateSavedDemo(id, { status: "active" })
  return result !== null
}

/**
 * Obtém demos ativas
 */
export function getActiveDemos(): SavedDemo[] {
  return getSavedDemos().filter(d => d.status === "active")
}

/**
 * Obtém demos arquivadas
 */
export function getArchivedDemos(): SavedDemo[] {
  return getSavedDemos().filter(d => d.status === "archived")
}
