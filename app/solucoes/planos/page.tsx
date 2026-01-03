"use client"

import {
  InstitutionalHeader,
  InstitutionalFooter,
  PricingTable,
  ComparisonTable,
  PartnerProgram,
  ROICalculator,
  HowItWorks,
  FinalCTA,
  FAQ,
} from "@/components/solutions/institutional"
import { motion } from "framer-motion"
import { Sparkles, Rocket, Clock, TrendingUp, Users, Target } from "lucide-react"

export default function PlanosPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <InstitutionalHeader />
      
      <main className="flex-1 pt-16">
        {/* Hero for Pricing Page - Focused on Innovation & Engagement */}
        <section className="py-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-violet-500/10 blur-[100px] rounded-full" />
          </div>

          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-medium">Inovação que escala com você</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Transforme engajamento em{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                resultados reais
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Planos flexíveis para cada momento da sua jornada. 
              Escale o engajamento da sua equipe e maximize a retenção de talentos.
            </motion.p>

            {/* Key Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Implementação ágil</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Engajamento escalável</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Retenção de talentos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Novas oportunidades</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Table - 5 Tiers + Combos */}
        <PricingTable />
        
        {/* Comparison Table - Detailed Features */}
        <ComparisonTable />
        
        {/* ROI Calculator */}
        <div id="calculadora">
          <ROICalculator />
        </div>
        
        {/* Partner Program */}
        <div id="parceiros">
          <PartnerProgram />
        </div>
        
        {/* How It Works */}
        <div id="como-funciona">
          <HowItWorks />
        </div>
        
        {/* FAQ */}
        <FAQ />
        
        {/* Final CTA */}
        <FinalCTA />
      </main>

      <InstitutionalFooter />
    </div>
  )
}
