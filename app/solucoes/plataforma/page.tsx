"use client"

import {
  InstitutionalHeader,
  InstitutionalFooter,
  PlatformHero,
  ClientLogos,
  ImpactNumbers,
  Gallery,
  UseCasesDetailed,
  FeatureShowcase,
  Testimonials,
  VideoSection,
  PlatformFAQ,
  FinalCTA,
} from "@/components/solutions/institutional"

export default function PlataformaPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <InstitutionalHeader />
      
      <main className="flex-1">
        {/* Hero - Foco em Engajamento e Reconhecimento */}
        <PlatformHero />
        
        {/* Social Proof - Logos + Google for Startups */}
        <ClientLogos />
        
        {/* Números de Impacto */}
        <ImpactNumbers />
        
        {/* Galeria Visual - Screenshots das Funcionalidades */}
        <Gallery />
        
        {/* Casos de Uso Concretos */}
        <UseCasesDetailed />
        
        {/* Features Detalhadas com Screenshots */}
        <div id="features">
          <FeatureShowcase />
        </div>
        
        {/* Vídeo Demonstração */}
        <VideoSection />
        
        {/* Depoimentos */}
        <Testimonials />
        
        {/* FAQ - Versão Plataforma */}
        <div id="faq">
          <PlatformFAQ />
        </div>
        
        {/* CTA Final */}
        <FinalCTA />
      </main>

      <InstitutionalFooter />
    </div>
  )
}
