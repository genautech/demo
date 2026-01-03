"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Play, Sparkles, Trophy, Gift, Users, Heart } from "lucide-react"
import Link from "next/link"

export function PlatformHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-[20%] -right-[15%] w-[50%] h-[50%] bg-violet-500/15 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-[30%] -left-[15%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-[20%] w-[30%] h-[30%] bg-amber-500/10 blur-[100px] rounded-full" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-20 flex items-center justify-center"
        >
          <Trophy className="w-6 h-6 text-white/50" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] right-[8%] w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 opacity-15 flex items-center justify-center"
        >
          <Gift className="w-8 h-8 text-white/50" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[30%] left-[15%] w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 opacity-20 flex items-center justify-center"
        >
          <Heart className="w-5 h-5 text-white/50" />
        </motion.div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-medium rounded-full bg-gradient-to-r from-violet-500/10 to-pink-500/10 text-primary border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plataforma completa de incentivos</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight"
          >
            Engaje, recompense e{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                celebre seu time
              </span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.path
                  d="M2 6C50 2 150 2 198 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-pink-500/40"
                />
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
          >
            Gamificação, loja de resgates e envio de presentes em uma única plataforma. 
            <span className="text-foreground font-medium"> Sem precisar gerenciar estoque ou logística.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 active:scale-[0.98] transition-all group">
              <Link href="#agendar-demo">
                <span className="mr-2">🚀</span>
                Agendar uma Demo
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold active:scale-[0.98] transition-all group">
              <Link href="#features">
                <Play className="mr-2 w-4 h-4 group-hover:text-primary transition-colors" />
                Ver Funcionalidades
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="text-lg">⚡</span>
              <span className="text-foreground font-medium">Setup em 48h</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="text-lg">📦</span>
              <span className="text-foreground font-medium">Zero estoque</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Users className="w-4 h-4 text-violet-500" />
              <span className="text-foreground font-medium">500+ empresas</span>
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
