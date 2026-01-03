"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = [
  {
    question: "Quanto tempo leva para implementar a plataforma?",
    answer: "Para empresas que usam nossa configuração padrão, o setup pode ser feito em 48 horas. Para implementações customizadas com integrações específicas, o prazo varia de 1 a 4 semanas, dependendo da complexidade. Você terá um gerente de projeto dedicado durante todo o processo."
  },
  {
    question: "Preciso ter estoque próprio de brindes?",
    answer: "Não! Este é um dos nossos grandes diferenciais. Trabalhamos com um modelo de fulfillment onde você não precisa comprar, armazenar ou gerenciar estoque. Quando um colaborador resgata um brinde, nós cuidamos de todo o processo: desde a separação até a entrega na porta de casa."
  },
  {
    question: "Como funciona a gamificação?",
    answer: "Nossa plataforma oferece um sistema completo de gamificação: pontos, níveis, badges, rankings e conquistas. Você pode personalizar regras de pontuação, criar desafios e campanhas, e acompanhar tudo em tempo real no dashboard do gestor."
  },
  {
    question: "Posso personalizar a plataforma com a marca da minha empresa?",
    answer: "Absolutamente! Oferecemos white-label completo. Você pode customizar cores, logo, domínio personalizado e até a embalagem dos produtos enviados. Seus colaboradores terão uma experiência totalmente branded."
  },
  {
    question: "Quais tipos de recompensas estão disponíveis?",
    answer: "Temos um catálogo com centenas de opções: eletrônicos, vestuário, casa e decoração, experiências, vale-presentes, kits de bem-estar e muito mais. Você pode também adicionar produtos exclusivos da sua empresa."
  },
  {
    question: "Como funciona o suporte?",
    answer: "Todos os planos incluem suporte por chat e email. Planos Pro e Enterprise contam com suporte prioritário, SLA de resposta e um Customer Success Manager dedicado. Também oferecemos treinamentos periódicos para gestores e administradores."
  },
  {
    question: "A plataforma atende a LGPD?",
    answer: "Sim, somos totalmente aderentes à Lei Geral de Proteção de Dados. Implementamos criptografia em trânsito e em repouso, controles de acesso granulares, logs de auditoria e processos documentados para atender solicitações de titulares."
  },
  {
    question: "Posso integrar com outros sistemas?",
    answer: "Sim! Temos APIs RESTful documentadas e webhooks para integração com qualquer sistema de RH, ERP ou ferramenta interna. Também temos conectores prontos para as principais plataformas do mercado."
  },
]

export function PlatformFAQ() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Perguntas Frequentes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Tire suas dúvidas sobre a plataforma
            </motion.p>
          </div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-md transition-all"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Não encontrou o que procurava?
            </p>
            <a 
              href="mailto:contato@yoobe.com.br" 
              className="text-primary font-semibold hover:underline"
            >
              Entre em contato com nosso time →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
