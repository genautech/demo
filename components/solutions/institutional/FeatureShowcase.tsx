"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { 
  ShoppingBag, 
  Trophy, 
  Gift, 
  BarChart3, 
  FileText, 
  CheckCircle2,
  ArrowRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const FEATURES = [
  {
    id: "loja",
    title: "Loja de Resgate",
    headline: "Seus colaboradores escolhem o que querem",
    description: "Uma vitrine personalizada com centenas de produtos. Do eletrônico ao kit de bem-estar, cada pessoa resgata o que faz sentido para ela.",
    icon: ShoppingBag,
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
    screenshot: "/screenshots/loja-catalogo.png",
  },
  {
    id: "gamificacao",
    title: "Gamificação Completa",
    headline: "Níveis, badges e rankings que motivam",
    description: "Transforme metas em conquistas. Sistema de pontos, níveis progressivos e rankings que criam competição saudável e engajamento genuíno.",
    icon: Trophy,
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-500",
    screenshot: "/screenshots/gamificacao-dashboard-pontos.png",
  },
  {
    id: "presentes",
    title: "Envio de Presentes",
    headline: "Brindes na porta de casa em poucos cliques",
    description: "Você foca no reconhecimento, nós cuidamos da logística. Rastreamento em tempo real e entrega em todo o Brasil sem você precisar gerenciar estoque.",
    icon: Gift,
    color: "from-pink-500/20 to-pink-600/10",
    iconColor: "text-pink-500",
    screenshot: "/screenshots/envio-presentes.png",
  },
  {
    id: "dashboard",
    title: "Dashboard do Gestor",
    headline: "Métricas em tempo real para decisões inteligentes",
    description: "Visualize engajamento, custos e tendências em um painel unificado. Relatórios prontos para apresentar resultados à diretoria.",
    icon: BarChart3,
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-500",
    screenshot: "/screenshots/dashboard-metricas.png",
  },
  {
    id: "campanhas",
    title: "Campanhas e Landing Pages",
    headline: "Crie experiências personalizadas para cada momento",
    description: "Onboarding de novos colaboradores, campanhas sazonais ou ações especiais. Tudo com sua marca e sem precisar de desenvolvedor.",
    icon: FileText,
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-500",
    screenshot: "/screenshots/campanhas-landing-pages.png",
  },
  {
    id: "aprovacoes",
    title: "Workflow de Aprovações",
    headline: "Controle total sobre orçamentos e pedidos",
    description: "Defina regras de aprovação por valor, departamento ou tipo de item. Governança que acompanha a complexidade da sua empresa.",
    icon: CheckCircle2,
    color: "from-teal-500/20 to-teal-600/10",
    iconColor: "text-teal-500",
    screenshot: "/screenshots/aprovacoes-workflow.png",
  },
]

function FeatureScreenshot({ feature, isReversed }: { feature: typeof FEATURES[0], isReversed: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div className={cn(
        "absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl",
        feature.color
      )} />
      
      {/* Screenshot Container */}
      <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 h-6 rounded-md bg-background/50 max-w-[300px] flex items-center px-3">
            <span className="text-[10px] text-muted-foreground truncate">
              app.yoobe.com.br/{feature.id}
            </span>
          </div>
        </div>
        
        {/* Screenshot Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={feature.screenshot}
            alt={`Screenshot da funcionalidade ${feature.title}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
        </div>
      </div>
      
      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className={cn(
          "absolute -bottom-4 -right-4 px-4 py-2 rounded-full shadow-lg",
          "bg-card border border-border/50 backdrop-blur-sm"
        )}
      >
        <div className="flex items-center gap-2">
          <feature.icon className={cn("w-4 h-4", feature.iconColor)} />
          <span className="text-sm font-semibold">{feature.title}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FeatureShowcase() {
  return (
    <section id="features" className="py-24">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Tudo que você precisa em uma{" "}
            <span className="text-primary">única plataforma</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Da gamificação à entrega do brinde na porta de casa. 
            Uma solução completa que escala com sua empresa.
          </motion.p>
        </div>

        {/* Features */}
        <div className="space-y-32">
          {FEATURES.map((feature, index) => {
            const isReversed = index % 2 === 1
            return (
              <div 
                key={feature.id}
                className={cn(
                  "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                )}
              >
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={cn(isReversed && "lg:order-2")}
                >
                  <div className={cn(
                    "inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6",
                    "bg-gradient-to-br",
                    feature.color
                  )}>
                    <feature.icon className={cn("w-7 h-7", feature.iconColor)} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {feature.headline}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button variant="ghost" className="group p-0 h-auto font-semibold text-primary hover:text-primary/80" asChild>
                    <Link href="#agendar-demo">
                      Agendar demo de {feature.title}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>

                {/* Screenshot */}
                <div className={cn(isReversed && "lg:order-1")}>
                  <FeatureScreenshot feature={feature} isReversed={isReversed} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
