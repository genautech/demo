"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Award, CheckCircle2 } from "lucide-react"

const CLIENTS = [
  { 
    name: "Yampi", 
    sector: "E-commerce",
    useCase: "Placas de conquistas de vendas",
    logo: null,
  },
  { 
    name: "Hapvida", 
    sector: "Saúde",
    useCase: "Gamificação via Beehome",
    logo: null,
  },
  { 
    name: "Prio3", 
    sector: "Tecnologia",
    useCase: "Integração Workvivo",
    logo: null,
  },
  { 
    name: "Workvivo", 
    sector: "Employee Experience",
    useCase: "Recompensas físicas",
    logo: null,
  },
  { 
    name: "Beehome", 
    sector: "Proptech",
    useCase: "Gamificação corporativa",
    logo: null,
  },
  { 
    name: "Join", 
    sector: "Plataforma SaaS",
    useCase: "Sistema de pontos nativo",
    logo: null,
  },
]

export function ClientLogos() {
  return (
    <section className="py-16 border-y bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 mx-auto">
        {/* Google for Startups Badge - More Prominent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-card border-2 border-primary/20 shadow-lg shadow-primary/5">
            <div className="flex items-center gap-3">
              {/* Google Colors Dots - Larger */}
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#4285F4]" />
                <div className="w-3 h-3 rounded-full bg-[#EA4335]" />
                <div className="w-3 h-3 rounded-full bg-[#FBBC05]" />
                <div className="w-3 h-3 rounded-full bg-[#34A853]" />
              </div>
              <span className="text-base font-bold text-foreground">
                Google for Startups
              </span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-base font-semibold text-primary">
                Alumni 2024
              </span>
            </div>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10"
        >
          Empresas que já transformam engajamento em resultado
        </motion.p>
        
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {CLIENTS.map((client, index) => (
            <motion.div 
              key={client.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group"
            >
              {client.logo ? (
                <div className="h-14 md:h-16 px-6 flex items-center justify-center rounded-xl bg-card border border-border/50 shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
              ) : (
                <div className="h-14 md:h-16 px-6 md:px-8 flex flex-col items-center justify-center rounded-xl bg-card border border-border/50 shadow-sm group-hover:shadow-md group-hover:border-primary/30 group-hover:bg-primary/5 transition-all cursor-default">
                  <span className="text-base md:text-lg font-bold text-foreground/80 group-hover:text-primary transition-colors">
                    {client.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground group-hover:text-primary/70 transition-colors">
                    {client.sector}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust indicators - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <span className="text-lg font-bold text-foreground">500+</span>
              <span className="text-sm text-muted-foreground ml-1">empresas ativas</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <span className="text-lg font-bold text-foreground">1M+</span>
              <span className="text-sm text-muted-foreground ml-1">entregas realizadas</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <span className="text-lg font-bold text-foreground">98%</span>
              <span className="text-sm text-muted-foreground ml-1">de satisfação</span>
            </div>
          </div>
        </motion.div>

        {/* Competitive Advantage Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          💡 <span className="font-medium">50-70% mais competitivo</span> que soluções internacionais como VTEX, Shopify e Open Loyalty
        </motion.p>
      </div>
    </section>
  )
}
