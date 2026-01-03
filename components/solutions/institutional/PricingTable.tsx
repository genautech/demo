"use client"

import { motion } from "framer-motion"
import { Check, X, ArrowRight, Sparkles, Zap, Crown, Rocket, Building2, Gamepad2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

// 5 Tiers ordenados do mais caro para o mais barato (Price Anchoring)
const API_PLANS = [
  {
    name: "Enterprise API",
    description: "Para grandes operações e plataformas",
    icon: Crown,
    price: "R$ 24.999",
    priceValue: 24999,
    priceNote: "/mês",
    requestsIncluded: "500.000 requests",
    overageRate: "R$ 0,06/request adicional",
    overageDiscount: "60% OFF",
    highlight: false,
    features: [
      { name: "500.000 requests inclusos", included: true },
      { name: "SLA 99.99% garantido", included: true },
      { name: "Suporte 24/7 com gerente dedicado", included: true },
      { name: "Webhooks ilimitados em tempo real", included: true },
      { name: "Ambiente sandbox dedicado", included: true },
      { name: "Integração white-label completa", included: true },
      { name: "Customizações sob demanda", included: true },
      { name: "Onboarding com equipe técnica", included: true },
    ],
    cta: "Falar com Especialista",
    ctaVariant: "outline" as const,
  },
  {
    name: "Scale API",
    description: "Para empresas em rápida expansão",
    icon: Rocket,
    price: "R$ 7.999",
    priceValue: 7999,
    priceNote: "/mês",
    requestsIncluded: "200.000 requests",
    overageRate: "R$ 0,08/request adicional",
    overageDiscount: "46% OFF",
    highlight: false,
    features: [
      { name: "200.000 requests inclusos", included: true },
      { name: "SLA 99.9% garantido", included: true },
      { name: "Suporte prioritário (resposta < 4h)", included: true },
      { name: "Webhooks em tempo real", included: true },
      { name: "Ambiente sandbox compartilhado", included: true },
      { name: "Relatórios avançados + exports", included: true },
      { name: "Customizações limitadas", included: true },
      { name: "Onboarding guiado", included: true },
    ],
    cta: "Agendar Demo",
    ctaVariant: "default" as const,
  },
  {
    name: "Business API",
    description: "Para operações consolidadas",
    icon: Building2,
    price: "R$ 2.999",
    priceValue: 2999,
    priceNote: "/mês",
    requestsIncluded: "50.000 requests",
    overageRate: "R$ 0,12/request adicional",
    overageDiscount: "33% OFF",
    highlight: true,
    badge: "Mais Popular",
    features: [
      { name: "50.000 requests inclusos", included: true },
      { name: "SLA 99.5% garantido", included: true },
      { name: "Suporte em horário comercial", included: true },
      { name: "Webhooks para eventos principais", included: true },
      { name: "Ambiente sandbox compartilhado", included: true },
      { name: "Relatórios e dashboard completo", included: true },
      { name: "Documentação completa + SDKs", included: true },
      { name: "Onboarding self-service", included: true },
    ],
    cta: "Agendar Demo",
    ctaVariant: "default" as const,
  },
  {
    name: "Starter API",
    description: "Para começar sua integração",
    icon: Zap,
    price: "R$ 999",
    priceValue: 999,
    priceNote: "/mês",
    requestsIncluded: "10.000 requests",
    overageRate: "R$ 0,18/request adicional",
    overageDiscount: null,
    highlight: false,
    features: [
      { name: "10.000 requests inclusos", included: true },
      { name: "SLA 99% garantido", included: true },
      { name: "Suporte por email", included: true },
      { name: "Webhooks básicos", included: true },
      { name: "Ambiente sandbox compartilhado", included: true },
      { name: "Dashboard básico", included: true },
      { name: "Documentação completa", included: true },
      { name: "Onboarding self-service", included: true },
    ],
    cta: "Começar Agora",
    ctaVariant: "outline" as const,
  },
]

// Plano especial de Gamificação
const GAMIFICATION_PLAN = {
  name: "Gamification & Loyalty API",
  description: "Engajamento e retenção integrados",
  icon: Gamepad2,
  price: "A partir de R$ 4.999",
  priceValue: 4999,
  priceNote: "/mês + R$ 0,50/usuário ativo",
  requestsIncluded: "100.000 requests",
  highlight: true,
  badge: "Destaque",
  features: [
    { name: "100.000 requests inclusos", included: true },
    { name: "Sistema de pontos e moedas", included: true },
    { name: "Conquistas e badges dinâmicos", included: true },
    { name: "Níveis e progressão", included: true },
    { name: "Integração com loja de recompensas", included: true },
    { name: "APIs de ranking e leaderboards", included: true },
    { name: "Webhooks para eventos de gamificação", included: true },
    { name: "Dashboard de métricas de engajamento", included: true },
  ],
  cta: "Conhecer Gamificação",
  ctaVariant: "default" as const,
}

// Combos
const COMBOS = [
  {
    name: "Business + Gamification",
    originalPrice: "R$ 7.998",
    comboPrice: "R$ 6.499",
    discount: "19% OFF",
    description: "50.000 requests + Gamificação completa",
    icon: Package,
  },
  {
    name: "Scale + Gamification",
    originalPrice: "R$ 12.998",
    comboPrice: "R$ 9.999",
    discount: "23% OFF",
    description: "200.000 requests + Gamificação completa",
    icon: Package,
  },
]

export function PricingTable() {
  const [showCombos, setShowCombos] = useState(true)

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Preços transparentes, sem surpresas</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            APIs Premium para sua Plataforma
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Economize <span className="text-primary font-semibold">mais de R$ 100.000</span> em desenvolvimento 
            e entre no ar em <span className="text-primary font-semibold">15 dias</span> ao invés de 6 meses.
          </motion.p>
        </div>

        {/* API Pricing Cards - 4 Main Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {API_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "h-full relative overflow-hidden transition-all",
                  plan.highlight 
                    ? "border-primary shadow-xl shadow-primary/10 scale-[1.02] z-10" 
                    : "border-border/50 hover:border-primary/30 hover:shadow-lg"
                )}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <plan.icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {plan.priceNote}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {plan.requestsIncluded}
                    </div>
                    {plan.overageRate && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{plan.overageRate}</span>
                        {plan.overageDiscount && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {plan.overageDiscount}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Button 
                    asChild 
                    variant={plan.ctaVariant} 
                    className={cn(
                      "w-full h-11 font-semibold",
                      plan.highlight && "bg-primary hover:bg-primary/90"
                    )}
                  >
                    <Link href="#agendar-demo">
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>

                  {/* Features */}
                  <div className="space-y-2.5 pt-4 border-t">
                    {plan.features.map((feature, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex items-start gap-2 text-sm",
                          !feature.included && "opacity-50"
                        )}
                      >
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span className="text-muted-foreground">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Gamification Special Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16"
        >
          <Card className="relative overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-primary/5 via-background to-primary/5">
            <div className="absolute top-0 right-0">
              <Badge className="rounded-none rounded-bl-lg bg-gradient-to-r from-primary to-purple-600 text-white">
                <Gamepad2 className="w-3 h-3 mr-1" />
                {GAMIFICATION_PLAN.badge}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{GAMIFICATION_PLAN.name}</h3>
                    <p className="text-sm text-muted-foreground">{GAMIFICATION_PLAN.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-foreground">{GAMIFICATION_PLAN.price}</div>
                  <div className="text-sm text-muted-foreground">{GAMIFICATION_PLAN.priceNote}</div>
                  <div className="text-sm text-muted-foreground mt-1">{GAMIFICATION_PLAN.requestsIncluded}</div>
                </div>

                <Button asChild className="w-full md:w-auto h-12 px-8 font-semibold">
                  <Link href="#agendar-demo">
                    {GAMIFICATION_PLAN.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {GAMIFICATION_PLAN.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-muted-foreground">{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Combos Section */}
        {showCombos && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">🎁 Pacotes Combo</h3>
              <p className="text-muted-foreground">Combine E-commerce + Gamificação e economize ainda mais</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {COMBOS.map((combo, index) => (
                <motion.div
                  key={combo.name}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="relative overflow-hidden border-dashed border-2 border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg">
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg bg-green-500 text-white font-bold">
                        {combo.discount}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <combo.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{combo.name}</h4>
                          <p className="text-xs text-muted-foreground">{combo.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm text-muted-foreground line-through">{combo.originalPrice}</span>
                        <span className="text-2xl font-bold text-primary">{combo.comboPrice}</span>
                        <span className="text-sm text-muted-foreground">/mês</span>
                      </div>

                      <Button asChild variant="outline" className="w-full">
                        <Link href="#agendar-demo">
                          Quero esse combo
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mt-16 space-y-4"
        >
          <p className="text-sm text-muted-foreground">
            * Todos os planos incluem acesso à API completa de E-commerce e Fulfillment. 
            Requests excedentes são cobrados conforme a tabela de cada plano.
          </p>
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium">Precisa de mais requests?</span> Tiers superiores têm 
            custo por request até 60% menor. Fale conosco para um plano personalizado.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
