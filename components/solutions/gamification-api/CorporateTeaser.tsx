"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Zap, Globe, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CorporateTeaser() {
  return (
    <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
            <div className="grid md:grid-cols-5 items-stretch">
              <div className="md:col-span-3 p-8 md:p-12">
                <Badge className="bg-primary/20 text-primary border-primary/20 mb-6 hover:bg-primary/30 transition-colors">
                  Plano Corporate
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Precisa de uma Solução sob Medida?
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Para empresas que exigem personalização total, anuidade estruturada 
                  e contratos de nível de serviço (SLA) dedicados. Integramos com seus 
                  sistemas legados sem a necessidade de fornecedores externos.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-white/10 p-1.5 rounded-md">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Security & Privacy</h4>
                      <p className="text-xs text-slate-500">Conformidade total com LGPD.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-white/10 p-1.5 rounded-md">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Dedicated API</h4>
                      <p className="text-xs text-slate-500">Alta performance e escalabilidade.</p>
                    </div>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full sm:w-auto h-12 active:scale-[0.98] transition-all">
                  <Link href="/solucoes/corporativo">
                    Conhecer Plano Corporate
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="md:col-span-2 bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex flex-col justify-center border-l border-white/10">
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <Globe className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-1">Global Scale</h3>
                    <p className="text-sm text-slate-400">Suporte a moedas e envios internacionais.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <MessageSquare className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-1">24/7 Support</h3>
                    <p className="text-sm text-slate-400">Gerente de conta dedicado para seu projeto.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
