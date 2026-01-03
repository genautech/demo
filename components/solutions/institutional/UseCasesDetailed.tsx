"use client"

import { motion } from "framer-motion"
import { 
  ShoppingCart, 
  GraduationCap, 
  Users, 
  Building2, 
  Heart, 
  Rocket,
  TrendingUp,
  Award,
  Target,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

const USE_CASES = [
  {
    id: "ecommerce",
    category: "Fidelização",
    title: "E-commerce & Marketplace",
    company: "Yampi",
    companyType: "Plataforma de E-commerce",
    icon: ShoppingCart,
    color: "from-blue-500 to-cyan-500",
    challenge: "Aumentar recompra e lifetime value dos clientes",
    solution: "Programa de pontos integrado ao checkout com resgate de produtos físicos",
    results: [
      { metric: "+45%", label: "Recompra" },
      { metric: "+32%", label: "LTV" },
    ],
    featured: true,
  },
  {
    id: "saude",
    category: "Benefícios",
    title: "Saúde & Bem-estar",
    company: "Hapvida/Beehome",
    companyType: "Operadora de Saúde",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    challenge: "Engajar colaboradores em programas de prevenção e qualidade de vida",
    solution: "Gamificação de hábitos saudáveis com recompensas por metas atingidas",
    results: [
      { metric: "-28%", label: "Absenteísmo" },
      { metric: "+67%", label: "Adesão" },
    ],
    featured: true,
  },
  {
    id: "engajamento",
    category: "Engajamento",
    title: "Employee Experience",
    company: "Prio3 + Workvivo",
    companyType: "Plataforma de Engajamento",
    icon: Users,
    color: "from-violet-500 to-purple-500",
    challenge: "Reduzir turnover e aumentar engajamento em times distribuídos",
    solution: "Sistema de reconhecimento peer-to-peer com recompensas tangíveis",
    results: [
      { metric: "-35%", label: "Turnover" },
      { metric: "+52%", label: "eNPS" },
    ],
    featured: true,
  },
  {
    id: "plataforma",
    category: "Nativo",
    title: "Pontos na Plataforma",
    company: "Join",
    companyType: "Plataforma SaaS",
    icon: Target,
    color: "from-amber-500 to-orange-500",
    challenge: "Monetizar engajamento e aumentar retenção de usuários",
    solution: "Economia de pontos white-label totalmente integrada à plataforma",
    results: [
      { metric: "+89%", label: "Retenção" },
      { metric: "3x", label: "Uso diário" },
    ],
  },
  {
    id: "cursos",
    category: "Educação",
    title: "Cursos & LMS",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
    challenge: "Aumentar taxa de conclusão e engajamento em cursos online",
    solution: "Badges por módulo concluído, rankings e prêmios por certificação",
    results: [
      { metric: "+73%", label: "Conclusão" },
      { metric: "+41%", label: "NPS" },
    ],
  },
  {
    id: "afiliados",
    category: "Performance",
    title: "Programas de Afiliados",
    icon: Rocket,
    color: "from-indigo-500 to-blue-500",
    challenge: "Motivar afiliados além da comissão financeira",
    solution: "Níveis de afiliado com benefícios exclusivos e prêmios por meta",
    results: [
      { metric: "+56%", label: "Conversão" },
      { metric: "2.4x", label: "Vendas" },
    ],
  },
  {
    id: "corporativo",
    category: "Enterprise",
    title: "Grandes Empresas",
    icon: Building2,
    color: "from-slate-600 to-slate-800",
    challenge: "Unificar programas de incentivo em uma única plataforma",
    solution: "Solução white-label com SSO, multi-tenant e integrações corporativas",
    results: [
      { metric: "-60%", label: "Custo operacional" },
      { metric: "4.8/5", label: "Satisfação" },
    ],
  },
  {
    id: "retencao",
    category: "Retenção",
    title: "SaaS & Apps",
    icon: TrendingUp,
    color: "from-teal-500 to-cyan-500",
    challenge: "Reduzir churn e aumentar uso de features avançadas",
    solution: "Onboarding gamificado e recompensas por marcos de uso",
    results: [
      { metric: "-42%", label: "Churn" },
      { metric: "+78%", label: "Feature adoption" },
    ],
  },
]

function UseCaseCard({ useCase, index }: { useCase: typeof USE_CASES[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn(
        "h-full group hover:shadow-xl transition-all duration-300 overflow-hidden",
        useCase.featured && "ring-2 ring-primary/20"
      )}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              `bg-gradient-to-br ${useCase.color}`
            )}>
              <useCase.icon className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {useCase.category}
            </Badge>
          </div>

          {/* Title & Company */}
          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
            {useCase.title}
          </h3>
          {useCase.company && (
            <p className="text-sm text-primary font-medium mb-3">
              {useCase.company}
            </p>
          )}
          {useCase.companyType && (
            <p className="text-xs text-muted-foreground mb-4">
              {useCase.companyType}
            </p>
          )}

          {/* Challenge & Solution */}
          <div className="space-y-3 mb-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Desafio
              </span>
              <p className="text-sm text-foreground/80 mt-1">
                {useCase.challenge}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Solução Yoobe
              </span>
              <p className="text-sm text-foreground/80 mt-1">
                {useCase.solution}
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="flex gap-4 pt-4 border-t">
            {useCase.results.map((result, i) => (
              <div key={i} className="text-center flex-1">
                <div className={cn(
                  "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  useCase.color
                )}>
                  {result.metric}
                </div>
                <div className="text-xs text-muted-foreground">
                  {result.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function UseCasesDetailed() {
  const featuredCases = USE_CASES.filter(uc => uc.featured)
  const otherCases = USE_CASES.filter(uc => !uc.featured)

  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            <Award className="w-4 h-4" />
            <span>Cases de sucesso</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Empresas que já transformaram{" "}
            <span className="text-primary">engajamento em resultados</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Da fidelização de clientes ao reconhecimento de equipes. 
            Veja como diferentes indústrias usam gamificação para crescer.
          </motion.p>
        </div>

        {/* Featured Cases - Larger */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredCases.map((useCase, index) => (
            <UseCaseCard key={useCase.id} useCase={useCase} index={index} />
          ))}
        </div>

        {/* Other Cases */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {otherCases.map((useCase, index) => (
            <UseCaseCard key={useCase.id} useCase={useCase} index={index + 3} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Não encontrou seu segmento? A Yoobe se adapta a qualquer modelo de negócio.
          </p>
          <Button asChild size="lg" className="font-semibold">
            <Link href="#agendar-demo">
              Falar com especialista
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
