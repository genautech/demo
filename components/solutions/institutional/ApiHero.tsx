"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Code2, Sparkles, Zap, Clock, DollarSign, TrendingUp, Puzzle } from "lucide-react"
import Link from "next/link"

export function ApiHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-[20%] -right-[15%] w-[50%] h-[50%] bg-primary/15 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-[30%] -left-[15%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-[20%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full" />
        
        {/* Code Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Floating Code Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] px-3 py-2 rounded-lg bg-card/80 border border-border/50 backdrop-blur-sm opacity-40"
        >
          <code className="text-xs text-primary font-mono">POST /api/orders</code>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] right-[8%] px-3 py-2 rounded-lg bg-card/80 border border-border/50 backdrop-blur-sm opacity-40"
        >
          <code className="text-xs text-green-500 font-mono">{"{ status: 200 }"}</code>
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[30%] left-[15%] px-3 py-2 rounded-lg bg-card/80 border border-border/50 backdrop-blur-sm opacity-40"
        >
          <code className="text-xs text-blue-500 font-mono">GET /api/products</code>
        </motion.div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-medium rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary border border-primary/20"
          >
            <Code2 className="w-4 h-4" />
            <span>APIs de E-commerce, Fulfillment e Gamificação</span>
          </motion.div>

          {/* Headline - Focused on Speed & Savings */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight"
          >
            Go-live em{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 bg-clip-text text-transparent">
                15 dias
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 100 8"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.path
                  d="M2 6C25 2 75 2 98 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-green-500/40"
                />
              </motion.svg>
            </span>
            {" "}vs 6 meses
          </motion.h1>

          {/* Subheadline - Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed"
          >
            Economize <span className="text-foreground font-semibold">mais de R$ 100.000</span> em desenvolvimento.
            APIs premium de <span className="text-foreground font-medium">E-commerce, Gamificação e Fulfillment</span>{" "}
            <span className="text-primary font-medium">50-70% mais competitivas</span> que a concorrência.
          </motion.p>

          {/* Integration Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 text-sm">
              <Puzzle className="w-4 h-4 text-primary" />
              <span className="font-mono text-muted-foreground">REST API</span>
              <span className="font-semibold">+ Webhooks</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 text-sm">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-muted-foreground">SDKs em</span>
              <span className="font-semibold">JS, Python, Ruby</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all group">
              <Link href="#calculadora">
                <DollarSign className="mr-2 w-5 h-5" />
                Calcular meu ROI
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold active:scale-[0.98] transition-all group">
              <Link href="/solucoes/planos">
                <Code2 className="mr-2 w-4 h-4 group-hover:text-primary transition-colors" />
                Ver Planos e Preços
              </Link>
            </Button>
          </motion.div>

          {/* Value Propositions - Key Numbers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50">
              <Clock className="w-5 h-5 text-green-500 mb-2" />
              <span className="text-2xl font-bold text-foreground">15 dias</span>
              <span className="text-xs text-muted-foreground">para go-live</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50">
              <DollarSign className="w-5 h-5 text-green-500 mb-2" />
              <span className="text-2xl font-bold text-foreground">R$ 100k+</span>
              <span className="text-xs text-muted-foreground">de economia</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50">
              <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
              <span className="text-2xl font-bold text-foreground">+35%</span>
              <span className="text-xs text-muted-foreground">retenção</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-card/50 border border-border/50">
              <Zap className="w-5 h-5 text-green-500 mb-2" />
              <span className="text-2xl font-bold text-foreground">99.9%</span>
              <span className="text-xs text-muted-foreground">SLA uptime</span>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="text-lg">📦</span>
              <span className="text-foreground font-medium">Fulfillment integrado</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
              <span className="text-lg">🤝</span>
              <span className="text-foreground font-medium">Revenue Share até 40%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="text-lg">🏆</span>
              <span className="text-foreground font-medium">Google for Startups</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
