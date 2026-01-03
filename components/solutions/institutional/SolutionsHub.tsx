"use client"

import { motion } from "framer-motion"
import { 
  Building2, 
  Code2, 
  ArrowRight, 
  Users, 
  Puzzle, 
  Trophy, 
  Gift,
  Zap,
  DollarSign,
  Clock,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"

const SOLUTIONS = [
  {
    id: "plataforma",
    title: "Plataforma Completa",
    subtitle: "Para empresas que querem solução pronta",
    description: "Gamificação, loja de resgates, envio de presentes e dashboard completo. Tudo integrado, sem precisar desenvolver nada.",
    icon: Building2,
    color: "from-violet-500 to-purple-600",
    bgColor: "from-violet-500/10 to-purple-600/10",
    href: "/solucoes/plataforma",
    cta: "Conhecer Plataforma",
    audience: "RH, Gestores, People",
    highlights: [
      { icon: Trophy, text: "Gamificação completa" },
      { icon: Gift, text: "Loja de resgates" },
      { icon: Users, text: "Dashboard do gestor" },
    ],
    badge: null,
  },
  {
    id: "api",
    title: "API para Integradores",
    subtitle: "Para plataformas que querem integrar",
    description: "APIs de E-commerce, Fulfillment e Gamificação. Integre sua plataforma em 15 dias e economize R$ 100k+ vs desenvolver internamente.",
    icon: Code2,
    color: "from-primary to-blue-600",
    bgColor: "from-primary/10 to-blue-600/10",
    href: "/solucoes/api",
    cta: "Ver Planos API",
    audience: "CTOs, Desenvolvedores, Partners",
    highlights: [
      { icon: Clock, text: "Go-live em 15 dias" },
      { icon: DollarSign, text: "Economia de R$ 100k+" },
      { icon: Puzzle, text: "APIs REST completas" },
    ],
    badge: "Novo",
  },
]

export function SolutionsHub() {
  return (
    <section className="py-24 md:py-32">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Escolha sua solução</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Engajamento e recompensas{" "}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              do seu jeito
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            Plataforma pronta para usar ou APIs para integrar no seu sistema.
            Escolha o caminho que faz sentido para sua empresa.
          </motion.p>
        </div>

        {/* Solution Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {SOLUTIONS.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="relative h-full overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
                {solution.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-primary text-primary-foreground">
                      {solution.badge}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8">
                  {/* Icon */}
                  <div className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6",
                    `bg-gradient-to-br ${solution.color}`
                  )}>
                    <solution.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {solution.title}
                  </h2>
                  <p className="text-lg text-primary font-medium mb-4">
                    {solution.subtitle}
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {solution.description}
                  </p>

                  {/* Audience Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground mb-6">
                    <Users className="w-3.5 h-3.5" />
                    <span>Para: {solution.audience}</span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3 mb-8">
                    {solution.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          `bg-gradient-to-br ${solution.bgColor}`
                        )}>
                          <highlight.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{highlight.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button asChild size="lg" className="w-full h-12 font-semibold group-hover:shadow-lg transition-all">
                    <Link href={solution.href}>
                      {solution.cta}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Não sabe qual escolher?{" "}
            <Link href="#agendar-demo" className="text-primary font-medium hover:underline">
              Fale com nosso time
            </Link>
            {" "}e descubra a melhor opção para sua empresa.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
