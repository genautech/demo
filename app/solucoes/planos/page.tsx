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
import { Sparkles, DollarSign, Clock, TrendingUp } from "lucide-react"

export default function PlanosPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <InstitutionalHeader />
      
      <main className="flex-1 pt-16">
        {/* Hero for Pricing Page - Focused on ROI */}
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
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Preços transparentes, ROI garantido</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              APIs Premium a partir de{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                R$ 999/mês
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              50-70% mais competitivo que soluções internacionais. 
              Economize mais de R$ 100.000 vs desenvolvimento próprio.
            </motion.p>

            {/* Key Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 mb-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Go-live em 15 dias</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Economia de R$ 100k+</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">+35% retenção</span>
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
