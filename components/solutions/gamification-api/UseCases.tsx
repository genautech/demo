"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Trophy, Users, Star, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

const USE_CASES = [
  {
    title: "Cursos Online & LMS",
    description: "Eleve a experiência do aluno. Quando um módulo for concluído ou um certificado for emitido, nossa API envia automaticamente um 'Welcome Kit' ou uma placa física de conclusão.",
    icon: BookOpen,
    tag: "Educação",
    color: "bg-blue-500/10 text-blue-500",
    stats: "Aumento de 40% no NPS do curso"
  },
  {
    title: "Programas de Afiliados",
    description: "Recompense seus top parceiros. Automatize o envio de swags exclusivos (moletons, canecas, tech kits) quando atingirem metas de vendas, sem intervenção manual.",
    icon: Users,
    tag: "Marketing",
    color: "bg-purple-500/10 text-purple-500",
    stats: "25% mais engajamento dos parceiros"
  },
  {
    title: "Gamificação de Vendas",
    description: "Para ferramentas de CRM e Vendas. Celebre o fechamento de grandes contas com o envio imediato de um troféu ou kit comemorativo diretamente para a casa do vendedor.",
    icon: Trophy,
    tag: "Vendas",
    color: "bg-amber-500/10 text-amber-500",
    stats: "Entrega em até 48h em capitais"
  }
]

export function UseCases() {
  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Um Mundo de Possibilidades <br /> 
              <span className="text-primary">Alimentado por API</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Não importa o nicho da sua plataforma de gamificação, se existe uma 
              conquista digital, nós entregamos a recompensa física.
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
            Flexibilidade Total
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {USE_CASES.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-primary/5 hover:border-primary/20 overflow-hidden">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${useCase.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <useCase.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="mb-2 font-normal">{useCase.tag}</Badge>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {useCase.description}
                  </p>
                  <div className="pt-6 border-t border-primary/5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      {useCase.stats}
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
