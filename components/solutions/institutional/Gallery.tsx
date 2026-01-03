"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Sparkles, Trophy, Gift, BarChart3, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GALLERY_ITEMS = [
  {
    id: "gamificacao",
    title: "Bolsa de Pontos",
    subtitle: "Gamificação em tempo real",
    description: "Visualize o engajamento da equipe com dashboard estilo mercado financeiro. Rankings, transações e conquistas atualizados instantaneamente.",
    image: "/screenshots/gamificacao-dashboard-pontos.png",
    icon: Trophy,
    color: "from-amber-500 to-orange-600",
    badge: "Mais popular",
  },
  {
    id: "conquistas",
    title: "Conquistas & Badges",
    subtitle: "Celebre cada vitória",
    description: "Sistema completo de achievements que reconhece performance, tempo de casa, metas batidas e comportamentos alinhados com a cultura.",
    image: "/screenshots/gamificacao-conquistas.png",
    icon: Target,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "loja",
    title: "Loja de Resgate",
    subtitle: "Catálogo personalizado",
    description: "De eletrônicos a experiências. Cada colaborador escolhe o que faz sentido para ele, fortalecendo o senso de recompensa real.",
    image: "/screenshots/loja-catalogo.png",
    icon: Gift,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "envio",
    title: "Envio de Presentes",
    subtitle: "Logística simplificada",
    description: "Selecione destinatários, agende envios e acompanhe entregas. Tudo sem precisar gerenciar estoque ou fornecedores.",
    image: "/screenshots/envio-presentes.png",
    icon: Zap,
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "dashboard",
    title: "Dashboard Gestor",
    subtitle: "Métricas que importam",
    description: "KPIs de engajamento, custos por departamento, tendências e projeções. Dados prontos para apresentar à diretoria.",
    image: "/screenshots/dashboard-metricas.png",
    icon: BarChart3,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "campanhas",
    title: "Landing Pages",
    subtitle: "Campanhas personalizadas",
    description: "Crie experiências de onboarding, campanhas sazonais e ações especiais com sua marca, sem precisar de desenvolvedor.",
    image: "/screenshots/campanhas-landing-pages.png",
    icon: Sparkles,
    color: "from-violet-500 to-purple-600",
  },
]

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = GALLERY_ITEMS[activeIndex]

  const goTo = (index: number) => {
    if (index < 0) setActiveIndex(GALLERY_ITEMS.length - 1)
    else if (index >= GALLERY_ITEMS.length) setActiveIndex(0)
    else setActiveIndex(index)
  }

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Experiência do colaborador</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Funcionalidades que{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              encantam seu time
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Explore as telas que seus colaboradores vão amar usar todos os dias
          </motion.p>
        </div>

        {/* Gallery */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Image Display */}
          <div className="relative order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Glow */}
                <div className={cn(
                  "absolute -inset-8 rounded-3xl blur-3xl opacity-30",
                  `bg-gradient-to-br ${activeItem.color}`
                )} />
                
                {/* Image Container */}
                <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/80 border-b border-border/30">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="flex-1 h-7 rounded-lg bg-background/60 max-w-[280px] flex items-center px-3">
                      <span className="text-xs text-muted-foreground truncate">
                        app.yoobe.com.br
                      </span>
                    </div>
                  </div>
                  
                  {/* Screenshot */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={activeItem.image}
                      alt={activeItem.title}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>

                {/* Badge */}
                {activeItem.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg"
                  >
                    {activeItem.badge}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg h-10 w-10"
                onClick={() => goTo(activeIndex - 1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg h-10 w-10"
                onClick={() => goTo(activeIndex + 1)}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content & Tabs */}
          <div className="order-1 lg:order-2">
            {/* Active Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className={cn(
                  "inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6",
                  `bg-gradient-to-br ${activeItem.color}`
                )}>
                  <activeItem.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {activeItem.title}
                </h3>
                <p className="text-lg font-medium text-primary mb-4">
                  {activeItem.subtitle}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {activeItem.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {GALLERY_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200",
                    index === activeIndex
                      ? "border-primary ring-2 ring-primary/20 scale-105"
                      : "border-transparent hover:border-primary/30 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    `bg-gradient-to-br ${item.color}`
                  )}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </button>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {GALLERY_ITEMS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === activeIndex
                      ? "w-6 bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
