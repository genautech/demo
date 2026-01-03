"use client"

import { motion } from "framer-motion"
import { useState, useMemo } from "react"
import { 
  Calculator,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Sparkles,
  Building2,
  Rocket,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Formatador de moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Formatador de percentual
const formatPercent = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value / 100)
}

export function ROICalculator() {
  // Build vs Buy State
  const [monthlyOrders, setMonthlyOrders] = useState(5000)
  const [avgTicket, setAvgTicket] = useState(80)
  
  // Gamification ROI State
  const [activeUsers, setActiveUsers] = useState(1000)
  const [avgPurchaseValue, setAvgPurchaseValue] = useState(150)
  const [currentRepurchaseRate, setCurrentRepurchaseRate] = useState(20)

  // Build vs Buy Calculations
  const buildVsBuyResults = useMemo(() => {
    // Custos de desenvolvimento próprio
    const devTeamCost = 150000 // 6 meses de time de 3 devs
    const infrastructureCost = 30000 // Servidores, APIs de terceiros
    const maintenanceCostYearly = 60000 // Manutenção anual
    const timeToLaunch = 6 // meses
    
    // Custo total primeiro ano (desenvolvimento + manutenção)
    const totalInternalFirstYear = devTeamCost + infrastructureCost + maintenanceCostYearly
    
    // Custo 4UNIK (baseado no volume)
    let monthlyPlan = 999 // Starter
    if (monthlyOrders > 200000) monthlyPlan = 24999 // Enterprise
    else if (monthlyOrders > 50000) monthlyPlan = 7999 // Scale
    else if (monthlyOrders > 10000) monthlyPlan = 2999 // Business
    
    const yearlyCost4UNIK = monthlyPlan * 12
    
    // Economia
    const savingsFirstYear = totalInternalFirstYear - yearlyCost4UNIK
    const savingsPercent = Math.round((savingsFirstYear / totalInternalFirstYear) * 100)
    
    // Tempo economizado
    const timeSaved = timeToLaunch - 0.5 // 15 dias vs 6 meses
    
    // Receita adicional por lançar mais cedo
    const revenuePerMonth = monthlyOrders * avgTicket * 0.03 // ~3% margem adicional
    const additionalRevenue = revenuePerMonth * timeSaved
    
    return {
      internalCost: totalInternalFirstYear,
      cost4UNIK: yearlyCost4UNIK,
      savings: savingsFirstYear,
      savingsPercent,
      timeSaved,
      additionalRevenue,
      monthlyPlan,
      totalBenefit: savingsFirstYear + additionalRevenue,
    }
  }, [monthlyOrders, avgTicket])

  // Gamification ROI Calculations
  const gamificationResults = useMemo(() => {
    // Premissas baseadas em cases reais
    const repurchaseIncrease = 35 // +35% na taxa de recompra com gamificação
    const engagementIncrease = 40 // +40% engajamento
    
    // Cálculos
    const newRepurchaseRate = Math.min(currentRepurchaseRate * 1.35, 80) // Cap em 80%
    const monthlyRevenueWithoutGamification = activeUsers * (currentRepurchaseRate / 100) * avgPurchaseValue
    const monthlyRevenueWithGamification = activeUsers * (newRepurchaseRate / 100) * avgPurchaseValue
    const additionalMonthlyRevenue = monthlyRevenueWithGamification - monthlyRevenueWithoutGamification
    const additionalYearlyRevenue = additionalMonthlyRevenue * 12
    
    // Custo do plano de gamificação
    const gamificationCost = 4999 + (activeUsers * 0.5) // Base + por usuário
    const monthlyCost = gamificationCost
    const yearlyCost = monthlyCost * 12
    
    // ROI
    const roi = ((additionalYearlyRevenue - yearlyCost) / yearlyCost) * 100
    const paybackMonths = yearlyCost / additionalMonthlyRevenue
    
    return {
      currentRate: currentRepurchaseRate,
      newRate: Math.round(newRepurchaseRate),
      additionalMonthlyRevenue,
      additionalYearlyRevenue,
      monthlyCost,
      yearlyCost,
      roi: Math.round(roi),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      netProfit: additionalYearlyRevenue - yearlyCost,
    }
  }, [activeUsers, avgPurchaseValue, currentRepurchaseRate])

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Calculator className="w-4 h-4" />
            <span className="text-sm font-medium">Calculadora de ROI Interativa</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Calcule sua Economia e Retorno
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Descubra quanto você economiza ao escolher 4UNIK em vez de desenvolver internamente,
            e o ROI que a gamificação pode trazer para seu negócio.
          </motion.p>
        </div>

        {/* Calculator Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Tabs defaultValue="build-vs-buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
              <TabsTrigger value="build-vs-buy" className="text-sm md:text-base h-full gap-2">
                <Building2 className="w-4 h-4" />
                Build vs Buy
              </TabsTrigger>
              <TabsTrigger value="gamification-roi" className="text-sm md:text-base h-full gap-2">
                <TrendingUp className="w-4 h-4" />
                ROI Gamificação
              </TabsTrigger>
            </TabsList>

            {/* Build vs Buy Calculator */}
            <TabsContent value="build-vs-buy">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Seus Dados
                    </CardTitle>
                    <CardDescription>
                      Informe o volume estimado da sua operação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="orders" className="text-base">
                        Pedidos/Requests por mês
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[monthlyOrders]}
                          onValueChange={([value]) => setMonthlyOrders(value)}
                          min={1000}
                          max={500000}
                          step={1000}
                          className="flex-1"
                        />
                        <Input
                          id="orders"
                          type="number"
                          value={monthlyOrders}
                          onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                          className="w-28"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {monthlyOrders.toLocaleString('pt-BR')} pedidos/mês
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="ticket" className="text-base">
                        Ticket Médio (R$)
                      </Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[avgTicket]}
                          onValueChange={([value]) => setAvgTicket(value)}
                          min={20}
                          max={500}
                          step={10}
                          className="flex-1"
                        />
                        <Input
                          id="ticket"
                          type="number"
                          value={avgTicket}
                          onChange={(e) => setAvgTicket(Number(e.target.value))}
                          className="w-28"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <p className="text-sm font-medium">Plano Recomendado:</p>
                      <p className="text-2xl font-bold text-primary">
                        {buildVsBuyResults.monthlyPlan === 999 && "Starter API"}
                        {buildVsBuyResults.monthlyPlan === 2999 && "Business API"}
                        {buildVsBuyResults.monthlyPlan === 7999 && "Scale API"}
                        {buildVsBuyResults.monthlyPlan === 24999 && "Enterprise API"}
                        {" - "}
                        {formatCurrency(buildVsBuyResults.monthlyPlan)}/mês
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Sua Economia
                    </CardTitle>
                    <CardDescription>
                      Comparativo: Desenvolvimento Próprio vs 4UNIK
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-destructive/10 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Desenvolvimento Próprio</p>
                        <p className="text-xl font-bold text-destructive">
                          {formatCurrency(buildVsBuyResults.internalCost)}
                        </p>
                        <p className="text-xs text-muted-foreground">no primeiro ano</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-500/10 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Com 4UNIK</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(buildVsBuyResults.cost4UNIK)}
                        </p>
                        <p className="text-xs text-muted-foreground">no primeiro ano</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-primary text-primary-foreground text-center">
                      <p className="text-sm opacity-90 mb-2">Economia Total</p>
                      <p className="text-4xl font-bold mb-1">
                        {formatCurrency(buildVsBuyResults.savings)}
                      </p>
                      <p className="text-sm opacity-90">
                        {buildVsBuyResults.savingsPercent}% mais barato
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Clock className="w-8 h-8 text-primary shrink-0" />
                        <div>
                          <p className="text-2xl font-bold">{buildVsBuyResults.timeSaved} meses</p>
                          <p className="text-xs text-muted-foreground">economizados</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Rocket className="w-8 h-8 text-primary shrink-0" />
                        <div>
                          <p className="text-2xl font-bold">15 dias</p>
                          <p className="text-xs text-muted-foreground">para go-live</p>
                        </div>
                      </div>
                    </div>

                    <Button asChild size="lg" className="w-full h-12 font-semibold">
                      <Link href="#agendar-demo">
                        Agendar Demo Gratuita
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gamification ROI Calculator */}
            <TabsContent value="gamification-roi">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Dados do seu Negócio
                    </CardTitle>
                    <CardDescription>
                      Informe os dados atuais para calcular o potencial de ROI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-base">Usuários Ativos</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[activeUsers]}
                          onValueChange={([value]) => setActiveUsers(value)}
                          min={100}
                          max={50000}
                          step={100}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={activeUsers}
                          onChange={(e) => setActiveUsers(Number(e.target.value))}
                          className="w-28"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Valor Médio de Compra/Transação (R$)</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[avgPurchaseValue]}
                          onValueChange={([value]) => setAvgPurchaseValue(value)}
                          min={20}
                          max={1000}
                          step={10}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={avgPurchaseValue}
                          onChange={(e) => setAvgPurchaseValue(Number(e.target.value))}
                          className="w-28"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Taxa de Recompra Atual (%)</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[currentRepurchaseRate]}
                          onValueChange={([value]) => setCurrentRepurchaseRate(value)}
                          min={5}
                          max={60}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={currentRepurchaseRate}
                          onChange={(e) => setCurrentRepurchaseRate(Number(e.target.value))}
                          className="w-28"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <p className="text-sm font-medium">Baseado em resultados reais:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          +35% taxa de recompra (média de clientes)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          +40% engajamento com gamificação
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Potencial de Retorno
                    </CardTitle>
                    <CardDescription>
                      Projeção com gamificação 4UNIK
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Taxa Atual</p>
                        <p className="text-xl font-bold">{gamificationResults.currentRate}%</p>
                        <p className="text-xs text-muted-foreground">recompra</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-500/10 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Nova Taxa</p>
                        <p className="text-xl font-bold text-green-600">{gamificationResults.newRate}%</p>
                        <p className="text-xs text-muted-foreground">com gamificação</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-primary text-primary-foreground text-center">
                      <p className="text-sm opacity-90 mb-2">Lucro Adicional Anual</p>
                      <p className="text-4xl font-bold mb-1">
                        {formatCurrency(gamificationResults.netProfit)}
                      </p>
                      <p className="text-sm opacity-90">
                        ROI de {gamificationResults.roi}%
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <DollarSign className="w-8 h-8 text-primary shrink-0" />
                        <div>
                          <p className="text-lg font-bold">
                            {formatCurrency(gamificationResults.additionalMonthlyRevenue)}
                          </p>
                          <p className="text-xs text-muted-foreground">receita extra/mês</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Clock className="w-8 h-8 text-primary shrink-0" />
                        <div>
                          <p className="text-lg font-bold">{gamificationResults.paybackMonths} meses</p>
                          <p className="text-xs text-muted-foreground">payback</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                      <p>
                        <strong>Investimento:</strong> {formatCurrency(gamificationResults.monthlyCost)}/mês
                        {" "}→{" "}
                        <strong>Retorno:</strong> {formatCurrency(gamificationResults.additionalMonthlyRevenue)}/mês
                      </p>
                    </div>

                    <Button asChild size="lg" className="w-full h-12 font-semibold">
                      <Link href="#agendar-demo">
                        Quero Aumentar minha Retenção
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-12 max-w-2xl mx-auto"
        >
          * Os cálculos são estimativas baseadas em médias de mercado e cases reais de clientes. 
          Resultados podem variar conforme o segmento e implementação.
        </motion.p>
      </div>
    </section>
  )
}
