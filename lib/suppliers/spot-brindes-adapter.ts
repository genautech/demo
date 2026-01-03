/**
 * ===========================================
 * SPOT BRINDES API ADAPTER
 * ===========================================
 *
 * Adaptador para integração com a API da Spot Brindes
 * Permite sincronização de produtos, preços e estoque
 *
 * @version 1.0.0
 */

import {
  type Supplier,
  type BaseProduct,
  type PriceTier,
  updateBaseProduct,
  getBaseProducts,
  createSupplierSyncLog,
  getSupplierById,
} from "@/lib/storage"

// ===========================================
// TIPOS DA API SPOT BRINDES
// ===========================================

/**
 * Produto retornado pela API da Spot Brindes
 */
export interface SpotBrindesProduct {
  id: string
  sku: string
  name: string
  description: string
  category: string
  images: string[]
  basePrice: number
  priceTiers: SpotBrindesPriceTier[]
  stockQuantity: number
  available: boolean
  customizationOptions: string[]
  minOrderQuantity: number
  maxOrderQuantity: number
  leadTimeDays: number
  updatedAt: string
}

/**
 * Tier de preço da Spot Brindes
 */
export interface SpotBrindesPriceTier {
  minQty: number
  maxQty: number | null
  unitPrice: number
  discountPercent: number
}

/**
 * Resultado de sincronização
 */
export interface SyncResult {
  success: boolean
  productsUpdated: number
  productsCreated: number
  productsFailed: number
  errors: string[]
  duration: number
}

// ===========================================
// CLASSE ADAPTADORA
// ===========================================

/**
 * Adaptador para API da Spot Brindes
 * 
 * Em produção, esta classe faria chamadas reais à API.
 * Por enquanto, simula respostas para desenvolvimento.
 */
export class SpotBrindesAdapter {
  private supplier: Supplier | null = null
  private apiEndpoint: string = ""
  private apiKey: string = ""

  constructor(supplierId?: string) {
    if (supplierId) {
      this.supplier = getSupplierById(supplierId) || null
      if (this.supplier) {
        this.apiEndpoint = this.supplier.apiEndpoint || ""
        this.apiKey = this.supplier.apiKey || ""
      }
    }
  }

  /**
   * Verifica se o adaptador está configurado corretamente
   */
  isConfigured(): boolean {
    return !!this.supplier && this.supplier.status === "active"
  }

  /**
   * Busca produtos da API da Spot Brindes
   * Em produção, faria uma chamada HTTP real
   */
  async fetchProducts(): Promise<SpotBrindesProduct[]> {
    // Simular latência de API
    await this.delay(500)

    // Em produção:
    // const response = await fetch(`${this.apiEndpoint}/products`, {
    //   headers: { Authorization: `Bearer ${this.apiKey}` }
    // })
    // return response.json()

    // Dados simulados para desenvolvimento
    return this.getMockProducts()
  }

  /**
   * Busca detalhes de um produto específico
   */
  async fetchProductDetails(sku: string): Promise<SpotBrindesProduct | null> {
    await this.delay(200)

    const products = await this.fetchProducts()
    return products.find(p => p.sku === sku) || null
  }

  /**
   * Sincroniza preços dos produtos
   */
  async syncPrices(productIds?: string[]): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      success: true,
      productsUpdated: 0,
      productsCreated: 0,
      productsFailed: 0,
      errors: [],
      duration: 0,
    }

    try {
      const spotProducts = await this.fetchProducts()
      const baseProducts = getBaseProducts()

      for (const spotProduct of spotProducts) {
        const baseProduct = baseProducts.find(
          p => p.supplierSku === spotProduct.sku && p.supplierId === this.supplier?.id
        )

        if (!baseProduct) {
          continue // Produto não vinculado
        }

        if (productIds && !productIds.includes(baseProduct.id)) {
          continue // Não está na lista de IDs a sincronizar
        }

        try {
          // Converter tiers de preço
          const priceTiers: PriceTier[] = spotProduct.priceTiers.map(tier => ({
            minQuantity: tier.minQty,
            maxQuantity: tier.maxQty,
            price: tier.unitPrice,
            discount: tier.discountPercent,
          }))

          // Atualizar produto base
          const updated = updateBaseProduct(baseProduct.id, {
            price: spotProduct.basePrice,
            priceTiers,
            supplierData: {
              externalId: spotProduct.id,
              lastSyncAt: new Date().toISOString(),
              syncStatus: "synced",
            },
          })

          if (updated) {
            result.productsUpdated++
          } else {
            result.productsFailed++
            result.errors.push(`Falha ao atualizar ${baseProduct.name}`)
          }
        } catch (error) {
          result.productsFailed++
          result.errors.push(`Erro em ${baseProduct.name}: ${error}`)
        }
      }

      result.success = result.productsFailed === 0
    } catch (error) {
      result.success = false
      result.errors.push(`Erro geral: ${error}`)
    }

    result.duration = Date.now() - startTime

    // Registrar log de sincronização
    if (this.supplier) {
      createSupplierSyncLog({
        supplierId: this.supplier.id,
        syncType: "prices",
        status: result.success ? "success" : result.productsFailed > 0 && result.productsUpdated > 0 ? "partial" : "failed",
        productsUpdated: result.productsUpdated,
        productsCreated: result.productsCreated,
        productsFailed: result.productsFailed,
        errors: result.errors.length > 0 ? result.errors : undefined,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        duration: result.duration,
        triggeredBy: "manual",
      })
    }

    return result
  }

  /**
   * Sincroniza estoque dos produtos
   */
  async syncStock(productIds?: string[]): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      success: true,
      productsUpdated: 0,
      productsCreated: 0,
      productsFailed: 0,
      errors: [],
      duration: 0,
    }

    try {
      const spotProducts = await this.fetchProducts()
      const baseProducts = getBaseProducts()

      for (const spotProduct of spotProducts) {
        const baseProduct = baseProducts.find(
          p => p.supplierSku === spotProduct.sku && p.supplierId === this.supplier?.id
        )

        if (!baseProduct) {
          continue
        }

        if (productIds && !productIds.includes(baseProduct.id)) {
          continue
        }

        try {
          const updated = updateBaseProduct(baseProduct.id, {
            stockAvailable: spotProduct.stockQuantity,
            supplierData: {
              ...baseProduct.supplierData,
              lastSyncAt: new Date().toISOString(),
              syncStatus: "synced",
            },
          })

          if (updated) {
            result.productsUpdated++
          } else {
            result.productsFailed++
            result.errors.push(`Falha ao atualizar estoque de ${baseProduct.name}`)
          }
        } catch (error) {
          result.productsFailed++
          result.errors.push(`Erro em ${baseProduct.name}: ${error}`)
        }
      }

      result.success = result.productsFailed === 0
    } catch (error) {
      result.success = false
      result.errors.push(`Erro geral: ${error}`)
    }

    result.duration = Date.now() - startTime

    if (this.supplier) {
      createSupplierSyncLog({
        supplierId: this.supplier.id,
        syncType: "stock",
        status: result.success ? "success" : result.productsFailed > 0 && result.productsUpdated > 0 ? "partial" : "failed",
        productsUpdated: result.productsUpdated,
        productsCreated: result.productsCreated,
        productsFailed: result.productsFailed,
        errors: result.errors.length > 0 ? result.errors : undefined,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        duration: result.duration,
        triggeredBy: "manual",
      })
    }

    return result
  }

  /**
   * Sincronização completa (preços + estoque + produtos novos)
   */
  async syncFull(): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      success: true,
      productsUpdated: 0,
      productsCreated: 0,
      productsFailed: 0,
      errors: [],
      duration: 0,
    }

    // Sincronizar preços
    const pricesResult = await this.syncPrices()
    result.productsUpdated += pricesResult.productsUpdated
    result.errors.push(...pricesResult.errors)

    // Sincronizar estoque
    const stockResult = await this.syncStock()
    result.productsUpdated += stockResult.productsUpdated
    result.errors.push(...stockResult.errors)

    result.productsFailed = pricesResult.productsFailed + stockResult.productsFailed
    result.success = result.errors.length === 0
    result.duration = Date.now() - startTime

    if (this.supplier) {
      createSupplierSyncLog({
        supplierId: this.supplier.id,
        syncType: "full",
        status: result.success ? "success" : result.productsFailed > 0 && result.productsUpdated > 0 ? "partial" : "failed",
        productsUpdated: result.productsUpdated,
        productsCreated: result.productsCreated,
        productsFailed: result.productsFailed,
        errors: result.errors.length > 0 ? result.errors : undefined,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        duration: result.duration,
        triggeredBy: "manual",
      })
    }

    return result
  }

  /**
   * Verifica disponibilidade de um produto
   */
  async checkAvailability(sku: string, quantity: number): Promise<{ available: boolean; stock: number }> {
    await this.delay(100)

    const product = await this.fetchProductDetails(sku)
    if (!product) {
      return { available: false, stock: 0 }
    }

    return {
      available: product.available && product.stockQuantity >= quantity,
      stock: product.stockQuantity,
    }
  }

  // ===========================================
  // MÉTODOS AUXILIARES
  // ===========================================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Dados simulados para desenvolvimento
   */
  private getMockProducts(): SpotBrindesProduct[] {
    return [
      {
        id: "spot_001",
        sku: "SPOT-CANECA-001",
        name: "Caneca Personalizada 350ml",
        description: "Caneca de cerâmica branca para personalização",
        category: "Brindes Corporativos",
        images: ["/green-corporate-mug.jpg"],
        basePrice: 25.00,
        priceTiers: [
          { minQty: 1, maxQty: 10, unitPrice: 25.00, discountPercent: 0 },
          { minQty: 10, maxQty: 50, unitPrice: 23.75, discountPercent: 5 },
          { minQty: 50, maxQty: 100, unitPrice: 22.50, discountPercent: 10 },
          { minQty: 100, maxQty: 500, unitPrice: 21.25, discountPercent: 15 },
          { minQty: 500, maxQty: 1000, unitPrice: 20.00, discountPercent: 20 },
          { minQty: 1000, maxQty: null, unitPrice: 18.75, discountPercent: 25 },
        ],
        stockQuantity: 5000,
        available: true,
        customizationOptions: ["silk", "digital"],
        minOrderQuantity: 1,
        maxOrderQuantity: 10000,
        leadTimeDays: 7,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "spot_002",
        sku: "SPOT-CAMISA-001",
        name: "Camiseta Polo Corporativa",
        description: "Polo de algodão para personalização com bordado",
        category: "Vestuário",
        images: ["/green-corporate-polo-shirt.jpg"],
        basePrice: 45.00,
        priceTiers: [
          { minQty: 1, maxQty: 10, unitPrice: 45.00, discountPercent: 0 },
          { minQty: 10, maxQty: 50, unitPrice: 42.75, discountPercent: 5 },
          { minQty: 50, maxQty: 100, unitPrice: 40.50, discountPercent: 10 },
          { minQty: 100, maxQty: 500, unitPrice: 38.25, discountPercent: 15 },
          { minQty: 500, maxQty: 1000, unitPrice: 36.00, discountPercent: 20 },
          { minQty: 1000, maxQty: null, unitPrice: 33.75, discountPercent: 25 },
        ],
        stockQuantity: 2000,
        available: true,
        customizationOptions: ["bordado", "silk"],
        minOrderQuantity: 1,
        maxOrderQuantity: 5000,
        leadTimeDays: 10,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "spot_003",
        sku: "SPOT-GARRAFA-001",
        name: "Garrafa Térmica 500ml",
        description: "Garrafa térmica de inox com gravação a laser",
        category: "Brindes Corporativos",
        images: ["/green-thermal-bottle.jpg"],
        basePrice: 55.00,
        priceTiers: [
          { minQty: 1, maxQty: 10, unitPrice: 55.00, discountPercent: 0 },
          { minQty: 10, maxQty: 50, unitPrice: 52.25, discountPercent: 5 },
          { minQty: 50, maxQty: 100, unitPrice: 49.50, discountPercent: 10 },
          { minQty: 100, maxQty: 500, unitPrice: 46.75, discountPercent: 15 },
          { minQty: 500, maxQty: 1000, unitPrice: 44.00, discountPercent: 20 },
          { minQty: 1000, maxQty: null, unitPrice: 41.25, discountPercent: 25 },
        ],
        stockQuantity: 3000,
        available: true,
        customizationOptions: ["laser", "silk"],
        minOrderQuantity: 1,
        maxOrderQuantity: 5000,
        leadTimeDays: 7,
        updatedAt: new Date().toISOString(),
      },
    ]
  }
}

/**
 * Cria uma instância do adaptador para um fornecedor específico
 */
export function createSpotBrindesAdapter(supplierId: string): SpotBrindesAdapter {
  return new SpotBrindesAdapter(supplierId)
}
