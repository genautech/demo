"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const TESTIMONIALS = [
  {
    quote: "Reduzimos o turnover em 35% no primeiro ano. Os colaboradores finalmente sentem que seu esforço é reconhecido de verdade.",
    author: "Diretora de RH",
    company: "Empresa de Tecnologia",
    sector: "Tech - 2.500 colaboradores",
    avatar: "👩‍💼"
  },
  {
    quote: "A integração foi surpreendentemente simples. Em menos de uma semana nosso time de vendas já estava usando a plataforma.",
    author: "CTO",
    company: "E-commerce Nacional",
    sector: "Varejo - 800 colaboradores",
    avatar: "👨‍💻"
  },
  {
    quote: "Não precisamos mais gerenciar estoque de brindes. A Yoobe cuida de tudo e nosso NPS de reconhecimento subiu 40 pontos.",
    author: "Head of People Ops",
    company: "Fintech",
    sector: "Financeiro - 1.200 colaboradores",
    avatar: "👩‍🔧"
  },
]

export function Testimonials() {
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
            O que nossos clientes dizem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Empresas de diferentes setores já transformaram seus programas de reconhecimento
          </motion.p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/5 hover:border-primary/20">
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Quote className="w-5 h-5 text-primary" />
                  </div>

                  {/* Quote Text */}
                  <blockquote className="text-lg leading-relaxed mb-8 text-foreground/90">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.sector}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
