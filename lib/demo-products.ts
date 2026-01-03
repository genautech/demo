/**
 * Demo Products - Produtos de demonstração para a loja
 * Estes produtos são mapeados para produtos do catálogo base (BaseProducts)
 * para garantir consistência entre a demo e o sistema real.
 * 
 * Mapeamento para BaseProducts:
 * - demo_1 -> base_product_12 (Mochila Executive Pro)
 * - demo_2 -> base_product_15 (Garrafa Térmica Eco 500ml)
 * - demo_3 -> base_product_19 (Kit Escritório Completo)
 * - demo_4 -> base_product_11 (Camiseta Corporate Premium)
 * - demo_5 -> base_product_17 (Jaqueta Windbreaker Pro)
 * - demo_6 -> base_product_20 (Mousepad Gamer XL)
 * - demo_7 -> base_product_14 (Caneca Térmica Premium)
 * - demo_8 -> base_product_13 (Boné Trucker Style)
 */

export interface DemoProduct {
  id: string
  baseProductId: string // Referência ao produto base
  name: string
  description: string
  category: string
  price: number
  pointsCost: number
  stockQuantity: number
  images: string[]
  isActive: boolean
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "demo_1",
    baseProductId: "base_product_12",
    name: "Mochila Executive Pro",
    description: "Mochila executiva com compartimento acolchoado para notebook até 15 polegadas",
    category: "Swag",
    price: 289.00,
    pointsCost: 2890,
    stockQuantity: 45,
    images: ["/green-corporate-backpack.jpg"],
    isActive: true
  },
  {
    id: "demo_2",
    baseProductId: "base_product_15",
    name: "Garrafa Térmica Eco 500ml",
    description: "Garrafa térmica ecológica de aço inoxidável, mantém temperatura por 24h",
    category: "Brindes Corporativos",
    price: 99.90,
    pointsCost: 999,
    stockQuantity: 120,
    images: ["/green-thermal-bottle.jpg"],
    isActive: true
  },
  {
    id: "demo_3",
    baseProductId: "base_product_19",
    name: "Kit Escritório Completo",
    description: "Kit premium com canetas, marca-textos, post-its e organizador de mesa",
    category: "Brindes Corporativos",
    price: 149.00,
    pointsCost: 1490,
    stockQuantity: 80,
    images: ["/green-corporate-stationery-kit.jpg"],
    isActive: true
  },
  {
    id: "demo_4",
    baseProductId: "base_product_11",
    name: "Camiseta Corporate Premium",
    description: "Camiseta 100% algodão pima com estampa personalizada da marca",
    category: "Swag",
    price: 89.90,
    pointsCost: 899,
    stockQuantity: 200,
    images: ["/green-corporate-t-shirt.jpg"],
    isActive: true
  },
  {
    id: "demo_5",
    baseProductId: "base_product_17",
    name: "Jaqueta Windbreaker Pro",
    description: "Jaqueta corta-vento impermeável com capuz e bolsos laterais",
    category: "Swag",
    price: 349.00,
    pointsCost: 3490,
    stockQuantity: 30,
    images: ["/green-corporate-windbreaker-jacket.jpg"],
    isActive: true
  },
  {
    id: "demo_6",
    baseProductId: "base_product_20",
    name: "Mousepad Gamer XL",
    description: "Mousepad extra grande 90x40cm com superfície de controle e base antiderrapante",
    category: "Brindes Corporativos",
    price: 89.90,
    pointsCost: 899,
    stockQuantity: 150,
    images: ["/green-corporate-gaming-mousepad.jpg"],
    isActive: true
  },
  {
    id: "demo_7",
    baseProductId: "base_product_14",
    name: "Caneca Térmica Premium",
    description: "Caneca térmica de aço inox com capacidade de 350ml e tampa anti-vazamento",
    category: "Brindes Corporativos",
    price: 79.90,
    pointsCost: 799,
    stockQuantity: 300,
    images: ["/green-corporate-mug.jpg"],
    isActive: true
  },
  {
    id: "demo_8",
    baseProductId: "base_product_13",
    name: "Boné Trucker Style",
    description: "Boné estilo trucker com ajuste regulável e logo bordado",
    category: "Swag",
    price: 59.90,
    pointsCost: 599,
    stockQuantity: 95,
    images: ["/green-corporate-cap.jpg"],
    isActive: true
  }
]

/**
 * Busca um produto demo por ID
 */
export function getDemoProductById(id: string): DemoProduct | undefined {
  return DEMO_PRODUCTS.find(p => p.id === id)
}
