"use client"

import { motion } from "framer-motion"
import { Settings, ShoppingBag, Package, ArrowRight } from "lucide-react"

const STEPS = [
  {
    number: "01",
    title: "Configure sua plataforma",
    description: "Personalize a loja com sua marca, defina regras de pontos e importe seus colaboradores. Tudo pronto em até 48 horas.",
    icon: Settings,
  },
  {
    number: "02",
    title: "Colaboradores resgatam",
    description: "Seus colaboradores acessam a loja, escolhem os produtos que desejam e resgatam usando seus pontos acumulados.",
    icon: ShoppingBag,
  },
  {
    number: "03",
    title: "Nós entregamos",
    description: "Cuidamos de todo o fulfillment: separação, embalagem e envio. O colaborador recebe em casa com rastreamento.",
    icon: Package,
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Como funciona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Três passos simples para transformar reconhecimento em recompensas reais
          </motion.p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow h-full">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 relative z-10">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Number */}
                  <div className="text-5xl font-bold text-primary/10 mb-4">
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (mobile) */}
                {index < STEPS.length - 1 && (
                  <div className="flex justify-center my-4 md:hidden">
                    <ArrowRight className="w-6 h-6 text-primary/40 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Sem estoque, sem logística, sem complicação.
          </p>
          <p className="text-sm text-muted-foreground">
            Você foca no que importa: <span className="text-primary font-semibold">reconhecer e motivar seu time</span>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
