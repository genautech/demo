import type { LandingPage, CompanyProduct, Tag } from "@/lib/storage"

export interface WizardFormData {
  title: string
  slug: string
  type: "onboarding" | "campaign"
  primaryColor: string
  secondaryColor: string
  welcomeTitle: string
  welcomeMessage: string
  ctaText: string
  bannerUrl: string
  bannerText: string
  backgroundColor: string
  textColor: string
  productIds: string[]
  assignedTags: string[]
  isActive: boolean
  // Gamification fields
  enableConfetti: boolean
  enableParticles: boolean
  enableGlow: boolean
  animationStyle: "fade" | "slide" | "bounce" | "scale"
  badgeIcon: string
  pointsReward: number
}

export interface ValidationErrors {
  title?: string
  slug?: string
  welcomeTitle?: string
  ctaText?: string
  [key: string]: string | undefined
}

export interface LandingWizardProps {
  open: boolean
  onClose: () => void
  onSave: (data: LandingPage) => Promise<void>
  editingPage?: LandingPage | null
  companyId: string
  products: CompanyProduct[]
  tags: Tag[]
  existingPages: LandingPage[]
}

export interface StepProps {
  formData: WizardFormData
  setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>
  errors: ValidationErrors
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
}

export interface StepProductsProps extends StepProps {
  products: CompanyProduct[]
  selectedProducts: { productId: string; quantity: number }[]
  setSelectedProducts: React.Dispatch<React.SetStateAction<{ productId: string; quantity: number }[]>>
  companyId: string
}

export interface StepTagsProps extends StepProps {
  tags: Tag[]
}

export const WIZARD_STEPS = [
  { id: 1, label: "Identidade", description: "Título, slug e cores" },
  { id: 2, label: "Conteúdo", description: "Mensagens e banner" },
  { id: 3, label: "Produtos", description: "Selecione os produtos" },
  { id: 4, label: "Configurações", description: "Tags e status" },
] as const

export const DEFAULT_FORM_DATA: WizardFormData = {
  title: "",
  slug: "",
  type: "onboarding",
  primaryColor: "#16a34a",
  secondaryColor: "#8b5cf6",
  welcomeTitle: "Bem-vindo!",
  welcomeMessage: "Estamos felizes em tê-lo conosco. Resgate seu kit de onboarding agora!",
  ctaText: "Acessar Loja",
  bannerUrl: "",
  bannerText: "",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  productIds: [],
  assignedTags: [],
  isActive: true,
  // Gamification defaults
  enableConfetti: false,
  enableParticles: false,
  enableGlow: false,
  animationStyle: "fade",
  badgeIcon: "",
  pointsReward: 0,
}
