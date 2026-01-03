"use client"

import { motion } from "framer-motion"

const PARTNERS = [
  { name: "Prio3", label: "Workvivo Integration", logo: "/placeholder-logo.svg" },
  { name: "Hapvida", label: "Beehome Integration", logo: "/placeholder-logo.svg" },
  { name: "Yampi", label: "Direct API Partner", logo: "/placeholder-logo.svg" },
]

export function SocialProof() {
  return (
    <section className="py-12 border-y bg-card/50">
      <div className="container px-4 mx-auto">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-10">
          CONFIADO POR LÍDERES EM GAMIFICAÇÃO CORPORATIVA
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {PARTNERS.map((partner, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-10 md:h-12 w-32 relative bg-muted/20 rounded flex items-center justify-center p-2">
                <span className="font-bold text-lg">{partner.name}</span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{partner.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
