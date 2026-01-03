"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Building2, 
  User, 
  ArrowRight, 
  Gift, 
  Trophy, 
  Package, 
  Sparkles,
  Store,
  BarChart3
} from "lucide-react"

const PERSONAS = [
  {
    id: "superAdmin",
    title: "Super Admin",
    subtitle: "Administrador Master",
    description: "Acesso total ao sistema. Gerencie empresas, catálogo base, usuários globais e configurações avançadas.",
    icon: Shield,
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    features: ["Gestão de Empresas", "Catálogo Mestre", "Usuários Globais", "Conductor"],
    badge: "Admin",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  },
  {
    id: "manager",
    title: "Gestor",
    subtitle: "Gerente de Loja",
    description: "Administre sua loja corporativa. Gerencie produtos, pedidos, usuários, orçamentos e campanhas.",
    icon: Building2,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    features: ["Catálogo", "Pedidos", "Usuários", "Enviar Presentes"],
    badge: "Gestor",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
  },
  {
    id: "member",
    title: "Membro",
    subtitle: "Colaborador",
    description: "Explore a loja, resgate produtos com seus pontos, acompanhe pedidos e conquistas.",
    icon: User,
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    features: ["Loja", "Meus Pedidos", "Gamificação", "Swag Track"],
    badge: "Membro",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }
]

const FEATURES = [
  { icon: Store, label: "Loja Corporativa", description: "Catálogo de produtos personalizável" },
  { icon: Trophy, label: "Gamificação", description: "Sistema de pontos e níveis" },
  { icon: Gift, label: "Envio de Presentes", description: "Reconheça sua equipe" },
  { icon: Package, label: "Rastreamento", description: "Acompanhe entregas em tempo real" },
  { icon: BarChart3, label: "Analytics", description: "Dashboards e relatórios" },
  { icon: Sparkles, label: "Fun Mode", description: "Experiência visual moderna" },
]

export default function Home() {
  const router = useRouter()

  const handleAccess = (role: string) => {
    router.push(`/login?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo-4yoonik.jpg" 
              alt="Yoobe" 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded-lg object-contain"
              priority
            />
            <span className="font-bold text-xl">Yoobe</span>
            <Badge variant="outline" className="ml-2 text-xs">Demo</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/solucoes")}>
              Soluções
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/documentacao")}>
              Docs
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          Plataforma de Loja Corporativa
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Yoobe Corporate Store
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Sistema completo de gestão de loja corporativa com gamificação, 
          catálogo multi-tenant e experiência de reconhecimento de equipe.
        </p>
        
        {/* Quick Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {FEATURES.map((feature) => (
            <div 
              key={feature.label}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full border shadow-sm"
            >
              <feature.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{feature.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Persona Selection */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Escolha como acessar</h2>
          <p className="text-muted-foreground">
            Selecione uma persona para explorar o sistema com dados de demonstração
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PERSONAS.map((persona) => (
            <Card 
              key={persona.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${persona.bgColor} ${persona.borderColor} border-2`}
              onClick={() => handleAccess(persona.id)}
            >
              {/* Gradient Top Bar */}
              <div className={`h-2 bg-gradient-to-r ${persona.color}`} />
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${persona.color} text-white shadow-lg`}>
                    <persona.icon className="w-6 h-6" />
                  </div>
                  <Badge className={persona.badgeColor}>{persona.badge}</Badge>
                </div>
                <CardTitle className="text-xl mt-3">{persona.title}</CardTitle>
                <CardDescription className="text-sm font-medium">
                  {persona.subtitle}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {persona.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5">
                  {persona.features.map((feature) => (
                    <Badge 
                      key={feature} 
                      variant="secondary" 
                      className="text-xs font-normal"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${persona.color} hover:opacity-90 text-white`}
                >
                  Acessar como {persona.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Info Box */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="max-w-3xl mx-auto bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Modo Demonstração</h3>
                <p className="text-sm text-muted-foreground">
                  Este sistema usa dados locais no seu navegador. Cada pessoa que acessa 
                  tem seus próprios dados isolados. Experimente todas as funcionalidades 
                  sem preocupação - seus dados são salvos apenas no seu dispositivo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Yoobe Corporate Store &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">
            Desenvolvido para demonstração e testes
          </p>
        </div>
      </footer>
    </div>
  )
}
