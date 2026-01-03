"use client"

import { motion } from "framer-motion"
import { Check, X, Minus, Sparkles, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface FeatureRow {
  feature: string
  tooltip?: string
  starter: string | boolean
  business: string | boolean
  scale: string | boolean
  enterprise: string | boolean
  gamification?: string | boolean
}

const COMPARISON_DATA: FeatureRow[] = [
  {
    feature: "Mensalidade",
    starter: "R$ 999",
    business: "R$ 2.999",
    scale: "R$ 7.999",
    enterprise: "R$ 24.999",
    gamification: "A partir de R$ 4.999",
  },
  {
    feature: "Requests Inclusos",
    tooltip: "Chamadas de API incluídas no plano mensal",
    starter: "10.000",
    business: "50.000",
    scale: "200.000",
    enterprise: "500.000",
    gamification: "100.000",
  },
  {
    feature: "Custo por Request Adicional",
    tooltip: "Valor cobrado quando excede o limite incluso",
    starter: "R$ 0,18",
    business: "R$ 0,12",
    scale: "R$ 0,08",
    enterprise: "R$ 0,06",
    gamification: "R$ 0,10",
  },
  {
    feature: "Desconto em Overage",
    starter: "-",
    business: "33% OFF",
    scale: "46% OFF",
    enterprise: "60% OFF",
    gamification: "45% OFF",
  },
  {
    feature: "SLA de Uptime",
    tooltip: "Garantia de disponibilidade do serviço",
    starter: "99%",
    business: "99.5%",
    scale: "99.9%",
    enterprise: "99.99%",
    gamification: "99.5%",
  },
  {
    feature: "Tempo de Resposta Suporte",
    starter: "48h",
    business: "24h",
    scale: "4h",
    enterprise: "1h (24/7)",
    gamification: "24h",
  },
  {
    feature: "Webhooks",
    tooltip: "Notificações em tempo real para eventos",
    starter: "Básicos",
    business: "Principais",
    scale: "Tempo Real",
    enterprise: "Ilimitados",
    gamification: "Gamificação",
  },
  {
    feature: "Ambiente Sandbox",
    starter: "Compartilhado",
    business: "Compartilhado",
    scale: "Compartilhado",
    enterprise: "Dedicado",
    gamification: "Compartilhado",
  },
  {
    feature: "Relatórios e Analytics",
    starter: "Básico",
    business: "Completo",
    scale: "Avançado + Exports",
    enterprise: "Customizado + BI",
    gamification: "Engajamento",
  },
  {
    feature: "Customizações",
    starter: false,
    business: false,
    scale: "Limitadas",
    enterprise: "Sob Demanda",
    gamification: false,
  },
  {
    feature: "White-label",
    starter: false,
    business: false,
    scale: false,
    enterprise: true,
    gamification: false,
  },
  {
    feature: "Gerente de Conta Dedicado",
    starter: false,
    business: false,
    scale: false,
    enterprise: true,
    gamification: false,
  },
  {
    feature: "Onboarding",
    starter: "Self-service",
    business: "Self-service",
    scale: "Guiado",
    enterprise: "Equipe Técnica",
    gamification: "Guiado",
  },
  {
    feature: "Sistema de Pontos e Moedas",
    starter: false,
    business: false,
    scale: false,
    enterprise: false,
    gamification: true,
  },
  {
    feature: "Conquistas e Badges",
    starter: false,
    business: false,
    scale: false,
    enterprise: false,
    gamification: true,
  },
  {
    feature: "Níveis e Progressão",
    starter: false,
    business: false,
    scale: false,
    enterprise: false,
    gamification: true,
  },
  {
    feature: "Leaderboards e Rankings",
    starter: false,
    business: false,
    scale: false,
    enterprise: false,
    gamification: true,
  },
]

const TIERS = [
  { key: "starter", name: "Starter", highlight: false },
  { key: "business", name: "Business", highlight: true, badge: "Mais Popular" },
  { key: "scale", name: "Scale", highlight: false },
  { key: "enterprise", name: "Enterprise", highlight: false },
  { key: "gamification", name: "Gamification", highlight: false, badge: "Destaque" },
]

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" />
  }
  if (value === false) {
    return <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
  }
  if (value === "-") {
    return <Minus className="w-5 h-5 text-muted-foreground/50 mx-auto" />
  }
  return <span className="text-sm">{value}</span>
}

export function ComparisonTable() {
  return (
    <section className="py-24">
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
            <span className="text-sm font-medium">Comparativo Detalhado</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Compare os Planos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Veja em detalhes o que cada plano oferece e escolha o ideal para sua operação.
          </motion.p>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <Card className="min-w-[900px]">
            <CardContent className="p-0">
              <TooltipProvider>
                <table className="w-full">
                  {/* Header */}
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold text-muted-foreground w-[200px]">
                        Recurso
                      </th>
                      {TIERS.map((tier) => (
                        <th 
                          key={tier.key} 
                          className={cn(
                            "p-4 text-center min-w-[140px]",
                            tier.highlight && "bg-primary/5"
                          )}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {tier.badge && (
                              <Badge 
                                variant={tier.key === "business" ? "default" : "secondary"}
                                className="text-[10px]"
                              >
                                {tier.badge}
                              </Badge>
                            )}
                            <span className="font-semibold">{tier.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                    {COMPARISON_DATA.map((row, index) => (
                      <tr 
                        key={row.feature} 
                        className={cn(
                          "border-b last:border-0",
                          index % 2 === 0 && "bg-muted/30"
                        )}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{row.feature}</span>
                            {row.tooltip && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-[200px] text-sm">{row.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                        {TIERS.map((tier) => (
                          <td 
                            key={tier.key} 
                            className={cn(
                              "p-4 text-center",
                              tier.highlight && "bg-primary/5"
                            )}
                          >
                            <CellValue value={row[tier.key as keyof FeatureRow] as string | boolean} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TooltipProvider>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mobile Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-6 md:hidden"
        >
          ← Deslize para ver todos os planos →
        </motion.p>
      </div>
    </section>
  )
}
