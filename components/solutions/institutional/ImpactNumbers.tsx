"use client"

import { motion } from "framer-motion"
import { Building2, Package, Users, ThumbsUp } from "lucide-react"

const STATS = [
  {
    value: "500+",
    label: "Empresas",
    description: "confiam na plataforma",
    icon: Building2,
  },
  {
    value: "1M+",
    label: "Entregas",
    description: "de brindes realizadas",
    icon: Package,
  },
  {
    value: "50k+",
    label: "Colaboradores",
    description: "engajados diariamente",
    icon: Users,
  },
  {
    value: "98%",
    label: "Satisfação",
    description: "NPS dos usuários",
    icon: ThumbsUp,
  },
]

export function ImpactNumbers() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-sm opacity-80">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
