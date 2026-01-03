"use client"

import { motion } from "framer-motion"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  DollarSign,
  Package,
  ShoppingCart,
  Target,
  Award,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  Calendar,
  Zap,
  Crown,
  Shield,
  Star,
  AlertTriangle,
  CheckCircle2
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Link from "next/link"

const kpiData = {
  totalRevenue: 2847500,
  revenueGrowth: 12.5,
  totalCompanies: 156,
  activeCompanies: 142,
  totalUsers: 12450,
  activeUsers: 8932,
  totalOrders: 8934,
  orderGrowth: 8.3,
  avgOrderValue: 318.50,
  userRetention: 87.2,
  npsScore: 72,
  conversionRate: 68.4,
  churnRate: 2.8,
  mrrGrowth: 15.2,
  arpu: 145.30
}

const revenueData = [
  { month: "Jan", revenue: 1950000, target: 2000000, orders: 723 },
  { month: "Fev", revenue: 2180000, target: 2100000, orders: 812 },
  { month: "Mar", revenue: 2390000, target: 2300000, orders: 891 },
  { month: "Abr", revenue: 2670000, target: 2500000, orders: 956 },
  { month: "Mai", revenue: 2847500, target: 2700000, orders: 1034 },
  { month: "Jun", revenue: 3100000, target: 2900000, orders: 1145 },
]

const companyPerformance = [
  { name: "TechCorp", revenue: 425000, users: 892, satisfaction: 94, growth: 18.2 },
  { name: "GlobalInc", revenue: 382000, users: 756, satisfaction: 91, growth: 15.7 },
  { name: "InnoLab", revenue: 356000, users: 623, satisfaction: 89, growth: 22.1 },
  { name: "DataFlow", revenue: 298000, users: 534, satisfaction: 87, growth: 12.4 },
  { name: "CloudBase", revenue: 274000, users: 489, satisfaction: 92, growth: 19.8 },
]

const channelDistribution = [
  { name: "Direto", value: 35, color: "#10b981" },
  { name: "Parceiros", value: 28, color: "#3b82f6" },
  { name: "Marketing", value: 22, color: "#8b5cf6" },
  { name: "Orgânico", value: 15, color: "#f59e0b" },
]

const performanceMetrics = [
  { metric: "Receita", current: 85, target: 100, fullMark: 100 },
  { metric: "Usuários", current: 92, target: 100, fullMark: 100 },
  { metric: "Satisfação", current: 88, target: 100, fullMark: 100 },
  { metric: "Crescimento", current: 78, target: 100, fullMark: 100 },
  { metric: "Eficiência", current: 81, target: 100, fullMark: 100 },
]

const recentAlerts = [
  { type: "success", title: "Meta de Q2 atingida", description: "Receita 15% acima do planejado", time: "2h atrás" },
  { type: "warning", title: "Churn elevado", description: "TechCorp com churn acima da média", time: "4h atrás" },
  { type: "info", title: "Novo contrato", description: "StartupX assinou plano Enterprise", time: "6h atrás" },
  { type: "success", title: "NPS em alta", description: "Satisfação geral aumentou 3 pontos", time: "1d atrás" },
]

export default function ExecutiveKPIDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getKPIDirection = (value: number) => {
    return value > 0 ? "up" : value < 0 ? "down" : "neutral"
  }

  return (
    <PageContainer className="space-y-6">
    
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Executivo</h1>
          <p className="mt-1 text-muted-foreground">KPIs corporativos e métricas estratégicas</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2">
            {["1m", "3m", "6m", "1y"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period === "1m" ? "1M" : period === "3m" ? "3M" : period === "6m" ? "6M" : "1A"}
              </Button>
            ))}
          </div>
          <Button onClick={refreshData} variant="outline" disabled={isLoading}>
            <Filter className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Receita Total",
            value: formatCurrency(kpiData.totalRevenue),
            change: kpiData.revenueGrowth,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-950"
          },
          {
            title: "Empresas Ativas",
            value: `${kpiData.activeCompanies}/${kpiData.totalCompanies}`,
            change: ((kpiData.activeCompanies / kpiData.totalCompanies) * 100),
            icon: Building,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-950"
          },
          {
            title: "Usuários Ativos",
            value: kpiData.activeUsers.toLocaleString("pt-BR"),
            change: kpiData.userRetention,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-950"
          },
          {
            title: "Ticket Médio",
            value: formatCurrency(kpiData.avgOrderValue),
            change: kpiData.orderGrowth,
            icon: ShoppingCart,
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-950"
          },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", kpi.bg)}>
                  <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {getKPIDirection(kpi.change) === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <p className={cn(
                    "text-xs font-medium",
                    getKPIDirection(kpi.change) === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {Math.abs(kpi.change)}%
                  </p>
                  <p className="text-xs text-muted-foreground">vs período anterior</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Evolução de Receita
            </CardTitle>
            <CardDescription>Receita mensal vs meta</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), "Receita"]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Canais de Aquisição
            </CardTitle>
            <CardDescription>Distribuição por origem</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={channelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Participação"]} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Métricas de Performance
            </CardTitle>
            <CardDescription>Visão geral de indicadores chave</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Atual" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Meta" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Top Empresas
            </CardTitle>
            <CardDescription>Performance por cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyPerformance.map((company, index) => (
                <div key={company.name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {company.users} usuários • {company.satisfaction}% satisfação
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(company.revenue)}</p>
                    <p className="text-xs text-green-600">+{company.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "NPS Score", value: kpiData.npsScore, suffix: "/100", icon: Star, color: "text-yellow-600" },
          { label: "Taxa de Conversão", value: kpiData.conversionRate, suffix: "%", icon: Target, color: "text-blue-600" },
          { label: "Taxa de Retenção", value: kpiData.userRetention, suffix: "%", icon: Shield, color: "text-green-600" },
          { label: "Taxa de Churn", value: kpiData.churnRate, suffix: "%", icon: AlertTriangle, color: "text-red-600" },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">
                    {metric.value}{metric.suffix}
                  </p>
                </div>
                <metric.icon className={cn("h-8 w-8 opacity-20", metric.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Alertas Recentes
          </CardTitle>
          <CardDescription>Eventos importantes do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                <div className={cn(
                  "p-2 rounded-lg",
                  alert.type === "success" && "bg-green-100 dark:bg-green-950",
                  alert.type === "warning" && "bg-yellow-100 dark:bg-yellow-950",
                  alert.type === "info" && "bg-blue-100 dark:bg-blue-950"
                )}>
                  {alert.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  {alert.type === "info" && <Eye className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                </div>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/super-admin/reports">
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios Detalhados
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/super-admin/companies">
            <Building className="h-4 w-4 mr-2" />
            Gerenciar Empresas
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/super-admin/analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Análise Avançada
          </Link>
        </Button>
      </div>
    </PageContainer>
  )
}