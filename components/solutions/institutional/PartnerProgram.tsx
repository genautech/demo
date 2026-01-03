"use client"

import { motion } from "framer-motion"
import { 
  Handshake, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2,
  Building2,
  Rocket,
  Crown,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const PARTNER_TIERS = [
  {
    tier: "Silver",
    icon: Building2,
    revenueShare: "25%",
    minMRR: "R$ 5.000",
    benefits: [
      "Comissão de 25% do MRR dos clientes indicados",
      "Acesso à API em ambiente sandbox",
      "Suporte técnico por email",
      "Material de vendas básico",
      "Portal do parceiro",
    ],
    color: "text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800",
  },
  {
    tier: "Gold",
    icon: Rocket,
    revenueShare: "30%",
    minMRR: "R$ 15.000",
    benefits: [
      "Comissão de 30% do MRR dos clientes indicados",
      "Ambiente sandbox dedicado",
      "Suporte prioritário (resposta < 24h)",
      "Co-marketing e cases de sucesso",
      "Treinamento técnico exclusivo",
      "Gerente de parcerias dedicado",
    ],
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    highlight: true,
  },
  {
    tier: "Platinum",
    icon: Crown,
    revenueShare: "40%",
    minMRR: "R$ 50.000",
    benefits: [
      "Comissão de 40% do MRR dos clientes indicados",
      "Infraestrutura white-label completa",
      "Suporte 24/7 com SLA garantido",
      "Eventos exclusivos e roadmap preview",
      "Desenvolvimento de features sob demanda",
      "Diretor de conta dedicado",
      "Participação em advisory board",
    ],
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
]

const TARGET_PARTNERS = [
  "Plataformas de Gamificação (StriveCloud, Open Loyalty, Bunchball)",
  "ERPs e Sistemas de RH (TOTVS, Senior, Gupy)",
  "Plataformas de E-learning (Alura, Hotmart, Udemy for Business)",
  "Consultorias de Employee Experience",
  "Agências de Incentivo e Trade Marketing",
  "Softwares de Engajamento (Workvivo, Culture Amp)",
]

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Receita Recorrente",
    description: "Ganhe de 25% a 40% do MRR de cada cliente indicado, enquanto ele for cliente 4UNIK.",
  },
  {
    icon: TrendingUp,
    title: "Escala seu Negócio",
    description: "Adicione fulfillment de recompensas físicas ao seu portfólio sem investir em estoque ou logística.",
  },
  {
    icon: Users,
    title: "Clientes Mais Felizes",
    description: "Ofereça uma experiência completa: gamificação + recompensas tangíveis entregues em todo Brasil.",
  },
  {
    icon: Handshake,
    title: "Suporte Dedicado",
    description: "Time de parcerias para apoiar suas vendas, integrações e casos de uso específicos.",
  },
]

export function PartnerProgram() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Handshake className="w-4 h-4" />
            <span className="text-sm font-medium">Programa de Parcerias B2B2C</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Multiplique sua Receita com{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Revenue Share
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Integre a infraestrutura de fulfillment 4UNIK à sua plataforma e 
            ganhe até <span className="text-primary font-semibold">40% de comissão recorrente</span> sobre 
            cada cliente que você trouxer.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Partner Tiers */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-10"
          >
            Níveis de Parceria
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6">
            {PARTNER_TIERS.map((partner, index) => (
              <motion.div
                key={partner.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full relative overflow-hidden transition-all ${
                    partner.highlight 
                      ? "border-yellow-500/50 shadow-xl shadow-yellow-500/10" 
                      : "border-border/50 hover:border-primary/30 hover:shadow-lg"
                  }`}
                >
                  {partner.highlight && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg bg-yellow-500 text-black">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Recomendado
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl ${partner.bgColor} flex items-center justify-center mb-3`}>
                      <partner.icon className={`w-6 h-6 ${partner.color}`} />
                    </div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {partner.tier} Partner
                    </CardTitle>
                    <CardDescription>MRR mínimo: {partner.minMRR}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="text-center py-4 rounded-lg bg-muted/50">
                      <div className="text-4xl font-bold text-primary">{partner.revenueShare}</div>
                      <div className="text-sm text-muted-foreground">Revenue Share</div>
                    </div>

                    <div className="space-y-3">
                      {partner.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Target Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="border-dashed border-2 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-6 text-center">
                🎯 Parceiros que Buscamos
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {TARGET_PARTNERS.map((partner, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    {partner}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="h-14 px-8 text-base font-semibold">
            <Link href="#agendar-demo">
              <Handshake className="mr-2 w-5 h-5" />
              Aplicar como Parceiro
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base font-semibold">
            <Link href="#agendar-demo">
              Agendar Call Estratégica
            </Link>
          </Button>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          * O Revenue Share é calculado sobre o MRR (Monthly Recurring Revenue) dos clientes finais 
          que você indicar, enquanto eles permanecerem ativos na plataforma.
        </motion.p>
      </div>
    </section>
  )
}
