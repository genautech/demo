"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  ChevronRight, 
  Plus, 
  Trash2, 
  Wallet, 
  ShoppingBag, 
  Zap,
  ArrowRight,
  User,
  Building,
  Users,
  Palette,
  Sparkles,
  CheckCircle2,
  Bot,
  PlayCircle,
  TrendingUp,
  Gift,
  BarChart3,
  Copy,
  Link2,
  ExternalLink,
  Info,
  HelpCircle,
  Layers
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { 
  createUser, 
  addPoints, 
  ensureProductsSeeded, 
  deductPoints,
  createCompany,
  getBaseProducts,
  createBudget,
  createBudgetItem,
  replicateProduct,
  getCompanyById,
  updateBudget,
  getCompanyProducts,
  getOrders,
  saveOrders,
  getCurrencyName,
  createDemoFromOnboarding,
  type User as UserType,
  type Company,
  type CompanyProduct,
  type Order,
  type LineItem,
  type SavedDemo
} from "@/lib/storage"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { seedAIScenario } from "@/lib/seeders"
import { useToast } from "@/hooks/use-toast"
import { eventBus } from "@/lib/eventBus"
import { AIDiscovery } from "./ai-discovery"
import { useAIDemo, AIDiscoveryProfile, AIProduct } from "@/hooks/use-ai-demo"

const accountSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  companyName: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
})

const brandingSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar no formato hexadecimal (#RRGGBB)"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar no formato hexadecimal (#RRGGBB)"),
})

type AccountFormValues = z.infer<typeof accountSchema>
type BrandingFormValues = z.infer<typeof brandingSchema>

const STEPS = [
  { number: 1, label: "Conta", icon: User, description: "Dados básicos da sua conta e empresa" },
  { number: 2, label: "Marca", icon: Palette, description: "Personalize as cores da sua marca" },
  { number: 3, label: "Time", icon: Users, description: "Convide colegas para a demo" },
  { number: 4, label: "Ativar", icon: Zap, description: "Configure produtos e catálogo" },
  { number: 5, label: "Pronto!", icon: Sparkles, description: "Sua demo está pronta!" },
]

const VERTICAL_OPTIONS = [
  { id: "tech", label: "Tecnologia", description: "Startups e empresas de tecnologia" },
  { id: "finance", label: "Financeiro", description: "Bancos, fintechs e serviços financeiros" },
  { id: "creative", label: "Criativo", description: "Agências, design e marketing" },
  { id: "retail", label: "Varejo", description: "Lojas físicas e e-commerce" },
  { id: "healthcare", label: "Saúde", description: "Hospitais, clínicas e saúde" },
  { id: "education", label: "Educação", description: "Escolas, universidades e cursos" },
  { id: "corporate", label: "Corporativo", description: "Grandes corporações tradicionais" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [invites, setInvites] = useState<{ email: string; role: string }[]>([
    { email: "", role: "member" }
  ])
  const [auth, setAuth] = useState<{
    userId: string;
    email?: string;
    role?: string;
    companyId?: string | null;
    companyName?: string;
    firstName?: string;
    lastName?: string;
  } | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [replicationComplete, setReplicationComplete] = useState(false)
  const [onboardingMode, setOnboardingMode] = useState<"choice" | "standard" | "ai">("choice")
  const [savedDemo, setSavedDemo] = useState<SavedDemo | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [selectedVertical, setSelectedVertical] = useState<string>("tech")
  const { applyAIDiscovery } = useAIDemo()

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (!authData) {
      router.push("/login")
      return
    }
    setAuth(JSON.parse(authData))
    ensureProductsSeeded()
    
    // Restaurar progresso do onboarding
    const savedStep = localStorage.getItem("yoobe_onboarding_step")
    const savedCompanyId = localStorage.getItem("yoobe_onboarding_companyId")
    const savedDemoData = localStorage.getItem("yoobe_onboarding_savedDemo")
    
    if (savedStep) {
      setStep(parseInt(savedStep, 10))
    }
    if (savedCompanyId) {
      setCompanyId(savedCompanyId)
    }
    if (savedDemoData) {
      try {
        setSavedDemo(JSON.parse(savedDemoData))
      } catch (e) {
        console.error("[Onboarding] Erro ao restaurar savedDemo:", e)
      }
    }
  }, [router])
  
  // Persistir progresso ao mudar de step
  useEffect(() => {
    if (step > 1) {
      localStorage.setItem("yoobe_onboarding_step", step.toString())
    }
    if (companyId) {
      localStorage.setItem("yoobe_onboarding_companyId", companyId)
    }
  }, [step, companyId])

  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
    },
  })

  const brandingForm = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: "#10b981",
      secondaryColor: "#059669",
    },
  })

  useEffect(() => {
    if (auth && accountForm.getValues("email") === "") {
      accountForm.setValue("email", auth.email || "")
    }
  }, [auth, accountForm])

  const onAccountSubmit = (values: AccountFormValues) => {
    setIsLoading(true)
    
    try {
      const newUser = createUser({
        id: auth.userId,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
      })

      const company = createCompany({
        name: values.companyName,
        alias: values.companyName.substring(0, 4).toUpperCase().replace(/\s/g, ""),
        primaryColor: "#10b981",
        secondaryColor: "#059669",
      })
      setCompanyId(company.id)

      addPoints(newUser.id, 1000, "Bônus de boas-vindas Onboarding")

      const updatedAuth = {
        ...auth,
        email: values.email,
        role: "manager",
        companyId: company.id,
        companyName: values.companyName,
      }
      localStorage.setItem("yoobe_auth", JSON.stringify(updatedAuth))
      setAuth(updatedAuth)

      eventBus.emit("sandbox" as any, "celebration.test" as any, { step: "account" })
      
      toast({
        title: "Conta configurada!",
        description: "Agora vamos personalizar sua marca.",
      })
      
      setStep(2)
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível salvar os dados.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onBrandingSubmit = (values: BrandingFormValues) => {
    if (!companyId) return
    
    setIsLoading(true)
    
    try {
      const company = getCompanyById(companyId)
      if (company) {
        const companies = JSON.parse(localStorage.getItem("yoobe_companies_v3") || "[]") as Company[]
        const index = companies.findIndex((c: Company) => c.id === companyId)
        if (index > -1) {
          companies[index] = {
            ...companies[index],
            primaryColor: values.primaryColor,
            secondaryColor: values.secondaryColor,
            updatedAt: new Date().toISOString(),
          }
          localStorage.setItem("yoobe_companies_v3", JSON.stringify(companies))
        }
      }

      eventBus.emit("sandbox" as any, "celebration.test" as any, { step: "branding" })
      
      toast({
        title: "Marca personalizada!",
        description: "Agora vamos convidar seu time.",
      })
      
      setStep(3)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as cores.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addInvite = () => {
    setInvites([...invites, { email: "", role: "member" }])
  }

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index))
  }

  const updateInvite = (index: number, field: string, value: string) => {
    const newInvites = [...invites]
    newInvites[index] = { ...newInvites[index], [field]: value }
    setInvites(newInvites)
  }

  const handleInvitesSubmit = () => {
    // Validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = invites.filter(i => i.email !== "" && !emailRegex.test(i.email))
    
    if (invalidEmails.length > 0) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, verifique os e-mails informados.",
        variant: "destructive",
      })
      return
    }
    
    const validInvites = invites.filter(i => i.email !== "")
    localStorage.setItem("yoobe_onboarding_invites", JSON.stringify(validInvites))
    
    toast({
      title: "Convites enviados!",
      description: "Seu time receberá um e-mail em breve.",
    })
    setStep(4)
  }

  const handleCompleteOnboarding = async () => {
    if (!companyId || !auth.userId) return
    
    setIsLoading(true)
    
    // Usar dados do auth se form estiver vazio (modo IA)
    const firstName = accountForm.getValues("firstName") || auth.firstName || "Demo"
    const lastName = accountForm.getValues("lastName") || auth.lastName || "User"
    const email = accountForm.getValues("email") || auth.email || "demo@example.com"
    const companyName = accountForm.getValues("companyName") || auth.companyName || "Demo Company"
    const primaryColor = brandingForm.getValues("primaryColor") || "#10b981"
    const secondaryColor = brandingForm.getValues("secondaryColor") || "#059669"
    
    try {
      const baseProducts = getBaseProducts()
      const demoProducts = baseProducts.slice(0, 3)

      const budget = createBudget({
        companyId,
        title: "Catálogo Inicial - Onboarding",
        status: "draft",
        createdBy: auth.userId,
        updatedBy: auth.userId,
      })

      for (const baseProduct of demoProducts) {
        createBudgetItem({
          budgetId: budget.id,
          baseProductId: baseProduct.id,
          qty: 10,
          unitPrice: 50,
          unitPoints: 500,
        })
      }

      updateBudget(budget.id, {
        status: "released",
        releasedAt: new Date().toISOString(),
      })

      const replicationResults = []
      for (const baseProduct of demoProducts) {
        const result = replicateProduct(
          baseProduct.id,
          companyId,
          {
            price: 50,
            pointsCost: 500,
            stockQuantity: 10,
            isActive: true,
            tags: [],
          },
          auth.userId
        )
        replicationResults.push(result)
      }

      setReplicationComplete(true)

      const companyProducts = getCompanyProducts()
      const firstCompanyProduct = companyProducts.find((cp: CompanyProduct) => cp.companyId === companyId)
      
      if (firstCompanyProduct) {
        // Criar/atualizar usuário com dados corretos
        createUser({
          id: auth.userId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          companyId: companyId,
        })

        const orders = getOrders()
        const newOrder = {
          id: `demo_order_${Date.now()}`,
          number: `DEMO-${Math.floor(Math.random() * 9000) + 1000}`,
          state: "complete",
          itemTotal: firstCompanyProduct.price,
          shipmentTotal: 0,
          total: firstCompanyProduct.price,
          paymentState: "paid",
          shipmentState: "delivered",
          userId: auth.userId,
          email: email,
          lineItems: [{
            id: `li_${Date.now()}`,
            productId: firstCompanyProduct.id,
            name: firstCompanyProduct.name,
            sku: firstCompanyProduct.finalSku,
            quantity: 1,
            price: firstCompanyProduct.price,
            total: firstCompanyProduct.price,
          }],
          completedAt: new Date().toISOString(),
          paidWithPoints: firstCompanyProduct.pointsCost,
          pointsEarned: Math.floor(firstCompanyProduct.price * 0.1),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        orders.push(newOrder)
        saveOrders(orders)

        deductPoints(auth.userId, firstCompanyProduct.pointsCost, `Resgate demo: ${firstCompanyProduct.name}`)

        eventBus.emit("sandbox" as any, "order.created" as any, { 
          orderId: newOrder.id, 
          number: newOrder.number,
          onboardingComplete: true 
        })
      }

      // Salvar a demo para acesso posterior
      const demo = createDemoFromOnboarding({
        creatorEmail: email,
        creatorName: `${firstName} ${lastName}`.trim(),
        companyName: companyName,
        companyId: companyId,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
        },
        vertical: selectedVertical,
        userCount: 50, // Default demo users
      })
      setSavedDemo(demo)
      
      // Persistir savedDemo no localStorage para recuperação futura
      localStorage.setItem("yoobe_onboarding_savedDemo", JSON.stringify(demo))

      // Garantir que auth tem role manager e dados corretos
      const finalAuth = {
        ...auth,
        role: "manager",
        companyId: companyId,
        companyName: companyName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        onboardingComplete: true,
        demoId: demo.id,
      }
      localStorage.setItem("yoobe_auth", JSON.stringify(finalAuth))
      setAuth(finalAuth)
      
      toast({
        title: "Demo criada com sucesso! 🎉",
        description: `${replicationResults.length} produtos adicionados. Link compartilhável disponível!`,
      })
      
      // Não redireciona automaticamente - mostra o link primeiro
      setStep(5)
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao finalizar.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIDiscoveryComplete = async (profile: AIDiscoveryProfile, products: AIProduct[]) => {
    setIsLoading(true)
    
    // Passar userId e email para criar usuário no fluxo IA
    const result = await applyAIDiscovery(profile, products, auth?.userId, auth?.email)
    
    if (result && auth?.userId) {
      setCompanyId(result.companyId)
      
      await seedAIScenario(profile, products, auth.userId)

      // Parse name from company name for demo
      const nameParts = profile.companyName.split(" ")
      const firstName = nameParts[0] || "Demo"
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User"

      // Atualizar formulários com dados da IA
      accountForm.setValue("companyName", profile.companyName)
      accountForm.setValue("firstName", firstName)
      accountForm.setValue("lastName", lastName)
      accountForm.setValue("email", auth.email || "")
      
      brandingForm.setValue("primaryColor", profile.colors.primary)
      brandingForm.setValue("secondaryColor", profile.colors.secondary)
      
      // CRÍTICO: Atualizar auth com role manager e companyId
      const updatedAuth = {
        ...auth,
        role: "manager",
        companyId: result.companyId,
        companyName: profile.companyName,
        firstName,
        lastName,
      }
      localStorage.setItem("yoobe_auth", JSON.stringify(updatedAuth))
      setAuth(updatedAuth)
      
      // Definir vertical baseado na indústria
      if (profile.industry) {
        const industryToVertical: Record<string, string> = {
          "technology": "tech",
          "tech": "tech",
          "finance": "finance",
          "financeiro": "finance",
          "creative": "creative",
          "criativo": "creative",
          "retail": "retail",
          "varejo": "retail",
          "healthcare": "healthcare",
          "saude": "healthcare",
          "education": "education",
          "educacao": "education",
          "corporate": "corporate",
          "corporativo": "corporate",
        }
        const vertical = industryToVertical[profile.industry.toLowerCase()] || "tech"
        setSelectedVertical(vertical)
      }
      
      setStep(3)
      setOnboardingMode("ai")
      
      toast({
        title: "Perfil IA Gerado! 🚀",
        description: `${profile.companyName} configurada com produtos personalizados.`,
      })
    }
    setIsLoading(false)
  }

  if (!auth) return null

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 lg:p-12 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {onboardingMode === "choice" ? (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              {/* V8 */}
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Bem-vindo ao <span className="text-primary">Yoobe Demo</span>
              </h1>
              <p className="text-slate-600 max-w-lg mx-auto">
                Escolha como deseja configurar sua experiência de demonstração hoje.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary/50"
                onClick={() => setOnboardingMode("ai")}
              >
                <div className="absolute top-0 right-0 p-3">
                  <Badge className="bg-yellow-400 hover:bg-yellow-500 border-0 text-white font-bold">RECOMENDADO</Badge>
                </div>
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Bot className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle>Modo Inteligente</CardTitle>
                  <CardDescription>
                    Deixe a nossa IA criar uma empresa, catálogo e histórico personalizado para sua demo em segundos.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                    Começar com IA
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card 
                className="group cursor-pointer hover:shadow-xl transition-all border-2 hover:border-slate-300"
                onClick={() => setOnboardingMode("standard")}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <User className="h-6 w-6 text-slate-600" />
                  </div>
                  <CardTitle>Configuração Manual</CardTitle>
                  <CardDescription>
                    Configure manualmente o nome da sua empresa, cores da marca e convide seu time passo a passo.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Configurar Manualmente
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : onboardingMode === "ai" && step === 1 ? (
          <AIDiscovery onComplete={handleAIDiscoveryComplete} />
        ) : (
          <>
            {/* Barra de Progresso */}
            <div className="mb-8">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {step} de {STEPS.length} etapas
              </p>
            </div>
            
            <div className="flex items-center justify-center mb-12">
              {STEPS.map((stepData, index) => {
                const Icon = stepData.icon
                const isActive = step === stepData.number
                const isCompleted = step > stepData.number
                
                return (
                  <div key={stepData.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div 
                        className={cn(
                          "h-14 w-14 rounded-full flex items-center justify-center font-bold transition-all border-2 shadow-lg",
                          isActive 
                            ? "bg-primary text-white border-primary scale-110" 
                            : isCompleted
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-slate-400 border-slate-200"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Icon className={cn("h-6 w-6", isActive && "text-white")} />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs mt-2 font-medium transition-colors",
                        isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-slate-400"
                      )}>
                        {stepData.label}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div 
                        className={cn(
                          "h-1 w-12 sm:w-20 mx-2 rounded transition-colors",
                          isCompleted ? "bg-green-500" : "bg-slate-200"
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {step === 1 && (
              <Card className="shadow-2xl border-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Configuração da Conta</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Conte-nos um pouco sobre você e sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-md">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 mb-1">
                          💡 Caso de Uso Real
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong>Sarah, Gerente de RH</strong>, precisa enviar 500 kits de boas-vindas para novos funcionários. 
                          Com o Yoobe, ela faz isso em <strong>3 cliques</strong> e acompanha tudo em tempo real. 
                          Veja como é fácil!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="pt-0">
                  <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
                    <TooltipProvider>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="firstName">Nome</Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Seu primeiro nome. Aparecerá no dashboard e relatórios.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input id="firstName" {...accountForm.register("firstName")} placeholder="Ex: João" />
                          {accountForm.formState.errors.firstName && (
                            <p className="text-xs text-red-500">{accountForm.formState.errors.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Sobrenome</Label>
                          <Input id="lastName" {...accountForm.register("lastName")} placeholder="Ex: Silva" />
                          {accountForm.formState.errors.lastName && (
                            <p className="text-xs text-red-500">{accountForm.formState.errors.lastName.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="email">E-mail Corporativo</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Este e-mail será usado para identificar a demo e receber notificações.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input id="email" {...accountForm.register("email")} type="email" placeholder="joao@empresa.com" />
                        {accountForm.formState.errors.email && (
                          <p className="text-xs text-red-500">{accountForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="password">Senha</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mínimo 6 caracteres. Usada apenas na demo.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input id="password" {...accountForm.register("password")} type="password" placeholder="••••••••" />
                        {accountForm.formState.errors.password && (
                          <p className="text-xs text-red-500">{accountForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="companyName">Nome da Empresa</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Nome que aparecerá em toda a plataforma. Use o nome real do cliente para demos de vendas.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="companyName" className="pl-10" {...accountForm.register("companyName")} placeholder="Ex: Yoobe LTDA" />
                        </div>
                        {accountForm.formState.errors.companyName && (
                          <p className="text-xs text-red-500">{accountForm.formState.errors.companyName.message}</p>
                        )}
                      </div>
                      
                      {/* Seletor de Vertical */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Segmento da Empresa</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Escolha o segmento para personalizar cores e estilo da demo.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {VERTICAL_OPTIONS.slice(0, 4).map((vertical) => (
                            <button
                              key={vertical.id}
                              type="button"
                              onClick={() => setSelectedVertical(vertical.id)}
                              className={cn(
                                "p-3 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                                selectedVertical === vertical.id 
                                  ? "border-primary bg-primary/5" 
                                  : "border-slate-200"
                              )}
                            >
                              <p className="text-xs font-semibold">{vertical.label}</p>
                              <p className="text-[10px] text-muted-foreground">{vertical.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </TooltipProvider>
                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Continuar"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="shadow-2xl border-0 animate-in fade-in slide-in-from-right-4 duration-500">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500 flex items-center justify-center mb-4 shadow-lg">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Personalize sua Marca</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Escolha as cores que representam sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={brandingForm.handleSubmit(onBrandingSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="primaryColor" className="text-sm font-semibold">
                          Cor Principal
                        </Label>
                        <div className="flex gap-3 items-center">
                          <Input
                            id="primaryColor"
                            type="color"
                            {...brandingForm.register("primaryColor")}
                            className="h-16 w-24 cursor-pointer rounded-lg border-2"
                          />
                          <Input
                            {...brandingForm.register("primaryColor")}
                            placeholder="#10b981"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="secondaryColor" className="text-sm font-semibold">
                          Cor Secundária
                        </Label>
                        <div className="flex gap-3 items-center">
                          <Input
                            id="secondaryColor"
                            type="color"
                            {...brandingForm.register("secondaryColor")}
                            className="h-16 w-24 cursor-pointer rounded-lg border-2"
                          />
                          <Input
                            {...brandingForm.register("secondaryColor")}
                            placeholder="#059669"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 rounded-xl border-2 border-dashed bg-slate-50">
                      <p className="text-sm font-medium text-slate-600 mb-4 text-center">Preview da Loja</p>
                      <div 
                        className="h-32 rounded-lg shadow-lg flex items-center justify-center transition-all"
                        style={{
                          background: `linear-gradient(135deg, ${brandingForm.watch("primaryColor")} 0%, ${brandingForm.watch("secondaryColor")} 100%)`
                        }}
                      >
                        <Building className="h-12 w-12 text-white/90" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={isLoading} size="lg">
                      {isLoading ? "Salvando..." : "Continuar"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button variant="ghost" className="w-full" onClick={() => setStep(3)}>
                    Pular por enquanto
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card className="shadow-2xl border-0 animate-in fade-in slide-in-from-right-4 duration-500">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-500 flex items-center justify-center mb-4 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Convite ao Time</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Convide seus colegas para gerenciar a loja corporativa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {invites.map((invite, index) => (
                      <div key={index} className="flex gap-2 items-end animate-in slide-in-from-left-2">
                        <div className="flex-1 space-y-2">
                          <Label className={index > 0 ? "sr-only" : ""}>E-mail</Label>
                          <Input 
                            placeholder="colega@empresa.com" 
                            value={invite.email} 
                            onChange={(e) => updateInvite(index, "email", e.target.value)}
                          />
                        </div>
                        <div className="w-[140px] space-y-2">
                          <Label className={index > 0 ? "sr-only" : ""}>Perfil</Label>
                          <Select 
                            value={invite.role} 
                            onValueChange={(val) => updateInvite(index, "role", val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Membro</SelectItem>
                              <SelectItem value="manager">Gestor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {invites.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeInvite(index)} className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" onClick={addInvite}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar outro
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button className="w-full" onClick={handleInvitesSubmit}>
                    Enviar Convites
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setStep(4)}>
                    Pular por enquanto
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 4 && (
              <Card className="shadow-2xl border-0 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                <div 
                  className="p-10 text-center text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${brandingForm.watch("primaryColor") || "#10b981"} 0%, ${brandingForm.watch("secondaryColor") || "#059669"} 100%)`
                  }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="mx-auto h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm animate-bounce shadow-2xl">
                      <Sparkles className="h-12 w-12 text-white" fill="white" />
                    </div>
                    <CardTitle className="text-4xl font-black mb-3 drop-shadow-lg">
                      Tudo Pronto! 🎉
                    </CardTitle>
                    <p className="text-white/90 text-lg font-medium">
                      Sua loja está configurada e pronta para uso
                    </p>
                  </div>
                </div>
                <CardContent className="pt-10 space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center shadow-lg">
                      <Wallet className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                      <p className="text-xs text-emerald-700 font-semibold mb-1">Saldo Inicial</p>
                      <p className="text-3xl font-black text-emerald-700">1.000</p>
                      <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold mt-1">
                        {getCurrencyName(companyId || "company_1", true)}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center shadow-lg">
                      <ShoppingBag className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <p className="text-xs text-blue-700 font-semibold mb-1">Produtos</p>
                      <p className="text-3xl font-black text-blue-700">3</p>
                      <p className="text-[10px] text-blue-600 uppercase tracking-widest font-bold mt-1">REPLICADOS</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 text-center shadow-lg">
                      <CheckCircle2 className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                      <p className="text-xs text-purple-700 font-semibold mb-1">Status</p>
                      <p className="text-2xl font-black text-purple-700">Ativo</p>
                      <p className="text-[10px] text-purple-600 uppercase tracking-widest font-bold mt-1">PRONTO</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Impacto em Tempo Real</h4>
                        <p className="text-xs text-slate-600">Veja o poder dos dados</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                        <TrendingUp className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 mb-0.5">Engajamento</p>
                        <p className="text-lg font-black text-emerald-700">87%</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                        <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 mb-0.5">Usuários Ativos</p>
                        <p className="text-lg font-black text-blue-700">1.2K</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                        <Gift className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 mb-0.5">Presentes Enviados</p>
                        <p className="text-lg font-black text-purple-700">450</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-3 italic">
                      Dados de exemplo - Seu dashboard real mostrará métricas da sua empresa
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-center text-slate-800 text-lg">
                      Experimente o fluxo completo agora:
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-6 border-2 border-primary/30 border-dashed flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-primary/60 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-14 w-14 rounded-xl bg-white border-2 border-primary/20 flex items-center justify-center shadow-md">
                          <Zap className="h-7 w-7 text-primary" fill="currentColor" />
                        </div>
                        <div>
                          <p className="font-bold text-base text-slate-800">Ativar Catálogo e Fazer Primeiro Pedido</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {replicationComplete 
                              ? "✓ Produtos replicados! Criando pedido demo..." 
                              : "Vamos replicar produtos do catálogo base e criar um pedido de teste"}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="lg" 
                        className="shadow-lg group-hover:scale-105 transition-transform bg-primary" 
                        onClick={handleCompleteOnboarding}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Processando...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Começar
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 border-t p-6">
                  <p className="text-xs text-center w-full text-slate-500 uppercase tracking-widest font-semibold">
                    Yoobe Swag Track &bull; Gamificação Corporativa
                  </p>
                </CardFooter>
              </Card>
            )}

            {step === 5 && savedDemo && (
              <Card className="shadow-2xl border-0 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                <div 
                  className="p-10 text-center text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${savedDemo.colors.primary} 0%, ${savedDemo.colors.secondary} 100%)`
                  }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="mx-auto h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm shadow-2xl">
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="text-4xl font-black mb-3 drop-shadow-lg">
                      Demo Criada! 🎉
                    </CardTitle>
                    <p className="text-white/90 text-lg font-medium">
                      {savedDemo.companyName} está pronta para apresentação
                    </p>
                  </div>
                </div>
                <CardContent className="pt-10 space-y-8">
                  {/* Link Compartilhável */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border-2 border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                        <Link2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">Link Compartilhável</h4>
                        <p className="text-sm text-slate-600">Envie este link para qualquer pessoa acessar sua demo</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white rounded-lg border-2 border-slate-200 p-3 font-mono text-sm text-slate-700 truncate">
                        {savedDemo.shareableLink}
                      </div>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => {
                          navigator.clipboard.writeText(savedDemo.shareableLink)
                          setLinkCopied(true)
                          toast({
                            title: "Link copiado!",
                            description: "Cole o link para compartilhar sua demo.",
                          })
                          setTimeout(() => setLinkCopied(false), 2000)
                        }}
                        className="shrink-0"
                      >
                        {linkCopied ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Este link permite acesso à demo mesmo sem login
                    </p>
                  </div>

                  {/* Resumo da Demo */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 text-center border">
                      <Building className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Empresa</p>
                      <p className="font-bold text-slate-800 truncate">{savedDemo.companyName}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border">
                      <User className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Criador</p>
                      <p className="font-bold text-slate-800 truncate">{savedDemo.creatorName}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border">
                      <Layers className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Vertical</p>
                      <p className="font-bold text-slate-800 capitalize">{savedDemo.vertical}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center border">
                      <Users className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Usuários</p>
                      <p className="font-bold text-slate-800">{savedDemo.userCount}</p>
                    </div>
                  </div>

                  {/* Próximos Passos */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-center text-slate-800 text-lg">
                      O que fazer agora?
                    </h3>
                    <div className="grid gap-3">
                      <Button 
                        size="lg" 
                        className="w-full shadow-lg bg-primary"
                        onClick={() => router.push("/dashboard")}
                      >
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Acessar Dashboard da Demo
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => router.push("/demos")}
                        >
                          <Layers className="mr-2 h-4 w-4" />
                          Minhas Demos
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => window.open(savedDemo.shareableLink, "_blank")}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Testar Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 border-t p-6">
                  <p className="text-xs text-center w-full text-slate-500">
                    Demo ID: <span className="font-mono font-bold">{savedDemo.id}</span> • 
                    Criada em {new Date(savedDemo.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </CardFooter>
              </Card>
            )}

            {/* Fallback para step 5 sem savedDemo */}
            {step === 5 && !savedDemo && (
              <Card className="shadow-2xl border-0 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                <div className="p-10 text-center text-white relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="mx-auto h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm shadow-2xl">
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="text-4xl font-black mb-3 drop-shadow-lg text-white">
                      Onboarding Concluído! 🎉
                    </CardTitle>
                    <p className="text-white/90 text-lg font-medium">
                      Sua demo já foi criada anteriormente
                    </p>
                  </div>
                </div>
                <CardContent className="pt-10 pb-8 text-center space-y-6">
                  <p className="text-muted-foreground">
                    Você já completou o processo de onboarding. Acesse o dashboard para gerenciar sua demo.
                  </p>
                  <div className="flex flex-col gap-3 max-w-sm mx-auto">
                    <Button 
                      size="lg" 
                      className="w-full shadow-lg"
                      onClick={() => {
                        // Limpar dados de onboarding ao ir para o dashboard
                        localStorage.removeItem("yoobe_onboarding_step")
                        localStorage.removeItem("yoobe_onboarding_companyId")
                        localStorage.removeItem("yoobe_onboarding_savedDemo")
                        localStorage.removeItem("yoobe_onboarding_invites")
                        router.push("/dashboard")
                      }}
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Ir para o Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => {
                        // Recomeçar onboarding
                        localStorage.removeItem("yoobe_onboarding_step")
                        localStorage.removeItem("yoobe_onboarding_companyId")
                        localStorage.removeItem("yoobe_onboarding_savedDemo")
                        localStorage.removeItem("yoobe_onboarding_invites")
                        setStep(1)
                        setOnboardingMode("choice")
                        setSavedDemo(null)
                        setCompanyId(null)
                      }}
                    >
                      Criar Nova Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
