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
import { Sparkles, Rocket, Clock, TrendingUp, Users, Target, Store, Coins, Gift, Smartphone, MapPin, Plug, Trophy, Zap, Warehouse, Truck, LayoutGrid, Users2, PackageSearch } from "lucide-react"

const PLATFORM_FEATURES = [
  { icon: Store, label: "Loja Multi-moeda", description: "Catálogo com moedas personalizadas" },
  { icon: Coins, label: "Resgate com Pontos", description: "Produtos com pontos de gamificação" },
  { icon: Gift, label: "Envio de Presentes", description: "Reconhecimento corporativo" },
  { icon: Smartphone, label: "Produtos Digitais", description: "Vouchers e gift cards" },
  { icon: LayoutGrid, label: "Catálogo Pronto", description: "Produtos pré-cadastrados" },
  { icon: Users2, label: "Portal de Fornecedores", description: "Cadastro de novos parceiros" },
  { icon: Warehouse, label: "Gestão de Estoque", description: "Controle físico integrado" },
  { icon: Truck, label: "Logística Integrada", description: "Fulfillment e distribuição" },
  { icon: PackageSearch, label: "Armazenamento", description: "Storage e inventário" },
  { icon: MapPin, label: "Rastreio em Tempo Real", description: "Acompanhamento de entregas" },
  { icon: Plug, label: "APIs de Gamificação", description: "Workvivo, Beehome e mais" },
  { icon: Trophy, label: "Gamificação Nativa", description: "Níveis e conquistas" },
]

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

        {/* Platform Features Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Tudo que você precisa para{" "}
                <span className="text-primary">dar vida aos seus pontos</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Complemente sua plataforma de gamificação com uma loja corporativa completa. 
                Ideal para quem usa Workvivo, Beehome ou qualquer sistema de pontos.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {PLATFORM_FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-background border hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.label}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
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
