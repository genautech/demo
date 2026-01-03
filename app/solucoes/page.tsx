"use client"

import {
  InstitutionalHeader,
  InstitutionalFooter,
  SolutionsHub,
  ClientLogos,
  FinalCTA,
} from "@/components/solutions/institutional"

export default function SolucoesPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <InstitutionalHeader />
      
      <main className="flex-1 pt-16">
        {/* Hub de Escolha - Plataforma ou API */}
        <SolutionsHub />
        
        {/* Social Proof */}
        <ClientLogos />
        
        {/* CTA Final */}
        <FinalCTA />
      </main>

      <InstitutionalFooter />
    </div>
  )
}
