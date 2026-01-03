"use client"

import {
  InstitutionalHeader,
  InstitutionalFooter,
  ApiHero,
  ClientLogos,
  ROICalculator,
  PricingTable,
  ComparisonTable,
  PartnerProgram,
  HowItWorks,
  FAQ,
  FinalCTA,
} from "@/components/solutions/institutional"

export default function ApiPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <InstitutionalHeader />
      
      <main className="flex-1">
        {/* Hero - Foco em Velocidade, Economia e ROI */}
        <ApiHero />
        
        {/* Social Proof - Logos + Google for Startups */}
        <ClientLogos />
        
        {/* Calculadora de ROI - Build vs Buy */}
        <div id="calculadora">
          <ROICalculator />
        </div>
        
        {/* Tabela de Preços - 5 Tiers API + Combos */}
        <div id="planos">
          <PricingTable />
        </div>
        
        {/* Tabela Comparativa Detalhada */}
        <ComparisonTable />
        
        {/* Programa de Parcerias - Revenue Share */}
        <div id="parceiros">
          <PartnerProgram />
        </div>
        
        {/* Como Funciona - Fluxo de Integração */}
        <div id="como-funciona">
          <HowItWorks />
        </div>
        
        {/* FAQ - Com objeções do Sales Playbook */}
        <div id="faq">
          <FAQ />
        </div>
        
        {/* CTA Final */}
        <FinalCTA />
      </main>

      <InstitutionalFooter />
    </div>
  )
}
