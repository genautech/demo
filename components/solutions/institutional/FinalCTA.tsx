"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, MessageCircle, Clock, Sparkles, Rocket, CheckCircle2, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export function FinalCTA() {
  return (
    <section id="agendar-demo" className="py-24 bg-gradient-to-br from-primary via-primary to-violet-600 text-primary-foreground overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[50%] -right-[25%] w-[80%] h-[80%] bg-white/5 blur-[100px] rounded-full" />
        <div className="absolute -bottom-[50%] -left-[25%] w-[80%] h-[80%] bg-white/5 blur-[100px] rounded-full" />
        {/* Animated dots */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[20%] left-[10%] w-3 h-3 rounded-full bg-white/20"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-[30%] right-[15%] w-4 h-4 rounded-full bg-white/15"
        />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Innovation Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8"
          >
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-medium">Inovação que transforma equipes</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Engajamento que escala, resultados que aparecem
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Descubra como empresas líderes estão transformando a experiência dos colaboradores 
            e aumentando a retenção de talentos. <span className="font-semibold">Sua jornada começa aqui.</span>
          </motion.p>

          {/* Value Props Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Experiência inovadora</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <Users className="w-4 h-4" />
              <span className="text-sm">Engajamento escalável</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Retenção de talentos</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="h-14 px-8 text-base font-semibold shadow-xl active:scale-[0.98] transition-all group"
            >
              <Link href="https://calendly.com/yoobe/demo" target="_blank">
                <Calendar className="mr-2 w-5 h-5" />
                Agendar Demo Gratuita
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="ghost"
              className="h-14 px-8 text-base font-semibold text-primary-foreground hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              <Link href="https://wa.me/5511999999999" target="_blank">
                <MessageCircle className="mr-2 w-5 h-5" />
                Falar pelo WhatsApp
              </Link>
            </Button>
          </motion.div>

          {/* Trust Badges - Enhanced */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2 opacity-90">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center gap-2 opacity-90">
              <CheckCircle2 className="w-4 h-4" />
              <span>30 minutos</span>
            </div>
            <div className="flex items-center gap-2 opacity-90">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demo personalizada</span>
            </div>
            <div className="flex items-center gap-2 opacity-90">
              <CheckCircle2 className="w-4 h-4" />
              <span>Plano sob medida</span>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm opacity-70"
          >
            Junte-se a empresas inovadoras que já transformaram a experiência dos seus colaboradores
          </motion.p>
        </div>
      </div>
    </section>
  )
}
