"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Calculator, DollarSign, Shield, TrendingUp } from "lucide-react"

const FAQ_ITEMS = [
  {
    question: "R$ 999/mês é caro para nossa empresa",
    answer: "Na verdade, é um investimento mínimo comparado ao custo de desenvolvimento próprio. Uma equipe de 3 desenvolvedores trabalhando 6 meses custaria pelo menos R$ 150.000, sem contar infraestrutura e manutenção. Com a 4UNIK, você paga R$ 999/mês e tem acesso imediato a toda a infraestrutura pronta. Isso representa uma economia de mais de R$ 100.000 no primeiro ano. Use nossa calculadora de ROI para ver os números exatos para sua operação.",
    icon: DollarSign,
    category: "pricing",
  },
  {
    question: "Precisamos de mais requests do que o plano oferece",
    answer: "Nossos planos são escaláveis. Cada tier superior oferece descontos progressivos de até 60% no custo por request adicional. Por exemplo, no Enterprise você paga apenas R$ 0,06 por request extra (contra R$ 0,18 no Starter). Quanto maior seu volume, maior a economia. Podemos também criar um plano customizado para operações de altíssimo volume.",
    icon: TrendingUp,
    category: "pricing",
  },
  {
    question: "Vamos desenvolver internamente para ter mais controle",
    answer: "Entendemos a preocupação com controle, mas considere: desenvolvimento interno leva 6+ meses para ficar pronto, enquanto você pode estar operando com a 4UNIK em 15 dias. Além disso, oferecemos APIs completas, webhooks em tempo real e documentação detalhada, dando a você controle total sobre a experiência do usuário. Muitos clientes preferem focar seus desenvolvedores em features core do negócio e deixar a infraestrutura de fulfillment conosco.",
    icon: Calculator,
    category: "development",
  },
  {
    question: "Não confiamos em APIs de terceiros para operações críticas",
    answer: "Segurança e confiabilidade são nossa prioridade. Oferecemos SLA de até 99.99% (Enterprise), infraestrutura distribuída, backups automáticos e somos totalmente aderentes à LGPD. Temos clientes como Yampi, Hapvida e Prio3 processando milhares de transações diárias. Podemos fornecer nosso SOC 2 report e DPA (Data Processing Agreement) sob demanda, além de referências diretas de clientes enterprise.",
    icon: Shield,
    category: "security",
  },
  {
    question: "Como funciona a integração com nossos sistemas?",
    answer: "Nossa plataforma oferece APIs RESTful documentadas e webhooks para integração com qualquer sistema de RH, ERP ou ferramenta interna. Também temos conectores prontos para as principais plataformas do mercado. O tempo médio de integração é de 48 horas para integrações simples e até 2 semanas para cenários mais complexos.",
    category: "technical",
  },
  {
    question: "Preciso ter estoque próprio de brindes?",
    answer: "Não! Este é um dos nossos grandes diferenciais. Trabalhamos com um modelo de fulfillment onde você não precisa comprar, armazenar ou gerenciar estoque. Quando um colaborador resgata um brinde, nós cuidamos de todo o processo: desde a separação até a entrega na porta de casa.",
    category: "logistics",
  },
  {
    question: "Quanto tempo leva para implementar a plataforma?",
    answer: "Para empresas que usam nossa configuração padrão, o setup pode ser feito em 48 horas. Para implementações customizadas com integrações específicas, o prazo varia de 1 a 4 semanas, dependendo da complexidade. Você terá um gerente de projeto dedicado durante todo o processo. Compare isso com 6+ meses para desenvolvimento interno!",
    category: "implementation",
  },
  {
    question: "Posso personalizar a plataforma com a marca da minha empresa?",
    answer: "Absolutamente! Oferecemos white-label completo nos planos Enterprise. Você pode customizar cores, logo, domínio personalizado e até a embalagem dos produtos enviados. Seus colaboradores terão uma experiência totalmente branded.",
    category: "features",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Trabalhamos com faturamento mensal ou anual via boleto bancário, transferência ou PIX. Para empresas enterprise, oferecemos condições comerciais personalizadas e possibilidade de pagamento por departamento ou centro de custo. Planos anuais têm desconto de até 15%.",
    category: "billing",
  },
  {
    question: "Como funciona o suporte?",
    answer: "Todos os planos incluem suporte por chat e email. Planos Scale e Enterprise contam com suporte prioritário, SLA de resposta de até 1 hora (24/7 para Enterprise) e um Customer Success Manager dedicado. Também oferecemos treinamentos periódicos para gestores e administradores.",
    category: "support",
  },
  {
    question: "A plataforma atende a LGPD?",
    answer: "Sim, somos totalmente aderentes à Lei Geral de Proteção de Dados. Implementamos criptografia em trânsito e em repouso, controles de acesso granulares, logs de auditoria e processos documentados para atender solicitações de titulares. Podemos fornecer nosso DPA (Data Processing Agreement) sob demanda.",
    category: "security",
  },
  {
    question: "O que acontece se minha empresa crescer muito rápido?",
    answer: "Nossa infraestrutura foi projetada para escalar. Você pode fazer upgrade de plano a qualquer momento, e os descontos progressivos em requests adicionais garantem que quanto mais você cresce, mais economiza. Clientes Enterprise têm requests adicionais 60% mais baratos que o plano Starter.",
    category: "scaling",
  },
]

export function FAQ() {
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
              Tire suas dúvidas sobre a plataforma e nossos planos
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
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 gap-3">
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="w-5 h-5 text-primary shrink-0" />}
                      <span>{item.question}</span>
                    </div>
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
