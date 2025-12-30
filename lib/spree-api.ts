/**
 * ===========================================
 * SPREE COMMERCE API INTEGRATION
 * ===========================================
 *
 * Este arquivo contém a estrutura base para integração com a API do Spree Commerce 5.
 * O Spree já está conectado com o Tiny, então os dados de clientes, produtos e pedidos
 * serão obtidos diretamente do Spree.
 *
 * CONFIGURAÇÃO NECESSÁRIA:
 * 1. Defina a variável de ambiente SPREE_API_URL com a URL base da sua instância Spree
 * 2. Defina SPREE_API_TOKEN com o token de autenticação da API
 *
 * DOCUMENTAÇÃO SPREE:
 * - API V2 Storefront: https://api.spreecommerce.org/docs/api-v2/storefront
 * - API V2 Platform: https://api.spreecommerce.org/docs/api-v2/platform
 *
 * @author Seu Nome
 * @version 1.0.0
 */

// ===========================================
// CONFIGURAÇÃO
// ===========================================

/**
 * URL base da API do Spree Commerce
 * Exemplo: https://sua-loja.spreecommerce.com/api/v2
 */
const SPREE_API_URL = process.env.SPREE_API_URL || "https://your-spree-instance.com/api/v2"

/**
 * Token de autenticação para a API do Spree
 * Pode ser obtido no painel administrativo do Spree
 */
const SPREE_API_TOKEN = process.env.SPREE_API_TOKEN || ""

// ===========================================
// TIPOS E INTERFACES
// ===========================================

/**
 * Interface para representar um cliente/usuário do Spree
 */
export interface SpreeCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  // Endereço
  address?: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  // Campos customizados
  brents?: number // Pontos BRENTS do usuário
  tags?: string[] // Tags associadas ao usuário
  createdAt: string
  updatedAt: string
}

/**
 * Interface para representar um produto do Spree
 */
export interface SpreeProduct {
  id: string
  name: string
  description: string
  slug: string
  sku: string
  price: number
  priceInBrents?: number
  stock: number
  images: string[]
  category?: string
  tags?: string[] // Tags para visualização na loja
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Interface para representar um pedido do Spree
 */
export interface SpreeOrder {
  id: string
  number: string
  status: SpreeOrderStatus
  customer: {
    id: string
    name: string
    email: string
  }
  items: SpreeOrderItem[]
  shipping: {
    trackingCode?: string
    trackingUrl?: string
    carrier?: string
    address: string
  }
  total: number
  paymentStatus: string
  shippedAt?: string
  deliveredAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * Interface para itens de um pedido
 */
export interface SpreeOrderItem {
  id: string
  productId: string
  name: string
  sku: string
  quantity: number
  price: number
}

/**
 * Status possíveis de um pedido no Spree
 */
export type SpreeOrderStatus =
  | "pending" // Pendente - aguardando pagamento
  | "processing" // Processando - pagamento confirmado, preparando
  | "shipped" // Enviado - pedido despachado
  | "in_transit" // Em trânsito - com a transportadora
  | "delivered" // Entregue - pedido recebido pelo cliente
  | "cancelled" // Cancelado - pedido cancelado
  | "returned" // Devolvido - pedido devolvido

/**
 * Mapeamento de status para exibição em português
 */
export const ORDER_STATUS_LABELS: Record<SpreeOrderStatus, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  in_transit: "Em Trânsito",
  delivered: "Entregue",
  cancelled: "Cancelado",
  returned: "Devolvido",
}

/**
 * Cores para badges de status
 */
export const ORDER_STATUS_COLORS: Record<SpreeOrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  in_transit: "bg-amber-100 text-amber-800 border-amber-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  returned: "bg-gray-100 text-gray-800 border-gray-200",
}

// ===========================================
// FUNÇÕES AUXILIARES
// ===========================================

/**
 * Função auxiliar para fazer requisições autenticadas à API do Spree
 *
 * @param endpoint - Endpoint da API (ex: "/storefront/products")
 * @param options - Opções adicionais do fetch
 * @returns Dados da resposta em JSON
 *
 * @example
 * const products = await spreeApiRequest("/storefront/products")
 */
async function spreeApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // TODO: Implementar a requisição real para a API do Spree
  //
  // Exemplo de implementação:
  //
  // const response = await fetch(`${SPREE_API_URL}${endpoint}`, {
  //   ...options,
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${SPREE_API_TOKEN}`,
  //     ...options.headers,
  //   },
  // })
  //
  // if (!response.ok) {
  //   const error = await response.text()
  //   throw new Error(`Spree API Error: ${response.status} - ${error}`)
  // }
  //
  // return response.json()

  throw new Error("Spree API não configurada. Configure SPREE_API_URL e SPREE_API_TOKEN.")
}

// ===========================================
// API DE CLIENTES
// ===========================================

/**
 * Busca todos os clientes do Spree
 *
 * @param params - Parâmetros de busca (página, filtros, etc)
 * @returns Lista de clientes
 *
 * @example
 * const customers = await getCustomers({ page: 1, perPage: 20 })
 */
export async function getCustomers(params?: {
  page?: number
  perPage?: number
  search?: string
}): Promise<{ customers: SpreeCustomer[]; total: number }> {
  // TODO: Implementar busca de clientes via Spree API
  //
  // Endpoint sugerido: GET /api/v2/platform/users
  //
  // Documentação: https://api.spreecommerce.org/docs/api-v2/platform/users

  throw new Error("Implementar getCustomers com a API do Spree")
}

/**
 * Busca um cliente específico por ID
 *
 * @param id - ID do cliente no Spree
 * @returns Dados do cliente
 */
export async function getCustomerById(id: string): Promise<SpreeCustomer> {
  // TODO: Implementar busca de cliente por ID
  //
  // Endpoint sugerido: GET /api/v2/platform/users/:id

  throw new Error("Implementar getCustomerById com a API do Spree")
}

/**
 * Atualiza dados de um cliente
 *
 * @param id - ID do cliente
 * @param data - Dados a serem atualizados
 * @returns Cliente atualizado
 */
export async function updateCustomer(id: string, data: Partial<SpreeCustomer>): Promise<SpreeCustomer> {
  // TODO: Implementar atualização de cliente
  //
  // Endpoint sugerido: PATCH /api/v2/platform/users/:id

  throw new Error("Implementar updateCustomer com a API do Spree")
}

// ===========================================
// API DE PRODUTOS
// ===========================================

/**
 * Busca todos os produtos do Spree
 *
 * @param params - Parâmetros de busca
 * @returns Lista de produtos
 *
 * @example
 * const products = await getProducts({ category: "vestuario" })
 */
export async function getProducts(params?: {
  page?: number
  perPage?: number
  search?: string
  category?: string
  tags?: string[]
}): Promise<{ products: SpreeProduct[]; total: number }> {
  // TODO: Implementar busca de produtos via Spree API
  //
  // Endpoint sugerido: GET /api/v2/storefront/products
  //
  // Documentação: https://api.spreecommerce.org/docs/api-v2/storefront/products

  throw new Error("Implementar getProducts com a API do Spree")
}

/**
 * Busca um produto específico por ID
 *
 * @param id - ID do produto no Spree
 * @returns Dados do produto
 */
export async function getProductById(id: string): Promise<SpreeProduct> {
  // TODO: Implementar busca de produto por ID
  //
  // Endpoint sugerido: GET /api/v2/storefront/products/:id

  throw new Error("Implementar getProductById com a API do Spree")
}

/**
 * Atualiza dados de um produto
 *
 * @param id - ID do produto
 * @param data - Dados a serem atualizados
 * @returns Produto atualizado
 */
export async function updateProduct(id: string, data: Partial<SpreeProduct>): Promise<SpreeProduct> {
  // TODO: Implementar atualização de produto
  //
  // Endpoint sugerido: PATCH /api/v2/platform/products/:id

  throw new Error("Implementar updateProduct com a API do Spree")
}

// ===========================================
// API DE PEDIDOS
// ===========================================

/**
 * Busca todos os pedidos do Spree
 *
 * @param params - Parâmetros de busca e filtros
 * @returns Lista de pedidos paginada
 *
 * @example
 * const orders = await getOrders({ status: "shipped", page: 1 })
 */
export async function getOrders(params?: {
  page?: number
  perPage?: number
  status?: SpreeOrderStatus
  customerId?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}): Promise<{ orders: SpreeOrder[]; total: number; totalPages: number }> {
  // TODO: Implementar busca de pedidos via Spree API
  //
  // Endpoint sugerido: GET /api/v2/platform/orders
  //
  // Documentação: https://api.spreecommerce.org/docs/api-v2/platform/orders

  throw new Error("Implementar getOrders com a API do Spree")
}

/**
 * Busca um pedido específico por ID
 *
 * @param id - ID do pedido no Spree
 * @returns Dados do pedido
 */
export async function getOrderById(id: string): Promise<SpreeOrder> {
  // TODO: Implementar busca de pedido por ID
  //
  // Endpoint sugerido: GET /api/v2/platform/orders/:id

  throw new Error("Implementar getOrderById com a API do Spree")
}

/**
 * Atualiza o status de um pedido
 *
 * @param id - ID do pedido
 * @param status - Novo status do pedido
 * @returns Pedido atualizado
 *
 * @example
 * await updateOrderStatus("123", "shipped")
 */
export async function updateOrderStatus(id: string, status: SpreeOrderStatus): Promise<SpreeOrder> {
  // TODO: Implementar atualização de status do pedido
  //
  // Endpoint sugerido: PATCH /api/v2/platform/orders/:id
  // Body: { order: { state: status } }

  throw new Error("Implementar updateOrderStatus com a API do Spree")
}

/**
 * Atualiza dados de rastreamento de um pedido
 *
 * @param id - ID do pedido
 * @param tracking - Dados de rastreamento
 * @returns Pedido atualizado
 */
export async function updateOrderTracking(
  id: string,
  tracking: {
    code: string
    url?: string
    carrier?: string
  },
): Promise<SpreeOrder> {
  // TODO: Implementar atualização de rastreamento
  //
  // Isso pode envolver atualização do shipment associado ao pedido
  // Endpoint sugerido: PATCH /api/v2/platform/shipments/:shipment_id

  throw new Error("Implementar updateOrderTracking com a API do Spree")
}

// ===========================================
// API DE TAGS
// ===========================================

/**
 * Busca todas as tags disponíveis
 *
 * @returns Lista de tags
 */
export async function getTags(): Promise<string[]> {
  // TODO: Implementar busca de tags
  //
  // As tags podem ser armazenadas como taxons ou propriedades customizadas no Spree
  // Endpoint sugerido: GET /api/v2/storefront/taxons ou tabela customizada

  throw new Error("Implementar getTags com a API do Spree")
}

/**
 * Adiciona uma tag a um produto
 *
 * @param productId - ID do produto
 * @param tag - Nome da tag
 */
export async function addTagToProduct(productId: string, tag: string): Promise<void> {
  // TODO: Implementar adição de tag ao produto

  throw new Error("Implementar addTagToProduct com a API do Spree")
}

/**
 * Remove uma tag de um produto
 *
 * @param productId - ID do produto
 * @param tag - Nome da tag
 */
export async function removeTagFromProduct(productId: string, tag: string): Promise<void> {
  // TODO: Implementar remoção de tag do produto

  throw new Error("Implementar removeTagFromProduct com a API do Spree")
}

/**
 * Adiciona uma tag a um usuário
 *
 * @param userId - ID do usuário
 * @param tag - Nome da tag
 */
export async function addTagToUser(userId: string, tag: string): Promise<void> {
  // TODO: Implementar adição de tag ao usuário

  throw new Error("Implementar addTagToUser com a API do Spree")
}

/**
 * Remove uma tag de um usuário
 *
 * @param userId - ID do usuário
 * @param tag - Nome da tag
 */
export async function removeTagFromUser(userId: string, tag: string): Promise<void> {
  // TODO: Implementar remoção de tag do usuário

  throw new Error("Implementar removeTagFromUser com a API do Spree")
}

// ===========================================
// EXPORTAÇÕES
// ===========================================

export { SPREE_API_URL, spreeApiRequest }
