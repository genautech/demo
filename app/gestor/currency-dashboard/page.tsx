"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  BarChart3,
  Users,
  Zap,
  Trophy,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Flame,
  Target,
  Crown,
  Settings,
} from "lucide-react"
import { 
  getCurrencyStats, 
  getCurrencyConfig,
  getStoreSettings,
  type CurrencyStats,
  type StoreSettings,
} from "@/lib/storage"
import { CurrencyTicker } from "@/components/currency/currency-ticker"
import { CurrencyChart } from "@/components/currency/currency-chart"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export default function CurrencyDashboardPage() {
  const [companyId, setCompanyId] = useState("company_1")
  const [stats, setStats] = useState<CurrencyStats | null>(null)
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [currency, setCurrency] = useState<StoreSettings["currency"] | null>(null)
  const [priceChange, setPriceChange] = useState(2.5) // Mock price change

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch {}
    }
  }, [])

  useEffect(() => {
    const currencyStats = getCurrencyStats(companyId)
    const storeSettings = getStoreSettings(companyId)
    const currencyConfig = getCurrencyConfig(companyId)
    setStats(currencyStats)
    setSettings(storeSettings)
    setCurrency(currencyConfig)
    
    // Simulate price changes
    const interval = setInterval(() => {
      setPriceChange(prev => {
        const change = (Math.random() - 0.45) * 2
        return Math.max(-10, Math.min(15, prev + change))
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [companyId])

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  if (!stats || !settings || !currency) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Carregando dashboard...</div>
        </div>
      </PageContainer>
    )
  }

  const isPositive = priceChange >= 0

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${currency.primaryColor}, ${currency.secondaryColor})` 
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-2xl">{currency.icon}</span>
          </motion.div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              Bolsa de {currency.plural.charAt(0).toUpperCase() + currency.plural.slice(1)}
              <Badge variant="outline" className="text-xs font-mono">
                {currency.abbreviation}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Dashboard de gamificação e estatísticas em tempo real
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => window.location.href = "/gestor/currency"} className="gap-2">
          <Settings className="h-4 w-4" />
          Configurar Moeda
        </Button>
      </div>

      {/* Live Ticker */}
      {settings.gamification?.showTicker && (
        <CurrencyTicker 
          transactions={stats.recentTransactions} 
          currency={currency}
        />
      )}

      {/* Main Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card 
            className="border-none shadow-lg overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${currency.primaryColor}15, ${currency.secondaryColor}15)` 
            }}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Cotação {currency.abbreviation}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black" style={{ color: currency.primaryColor }}>
                  {currency.symbol} 1.00
                </span>
                <Badge 
                  variant="secondary"
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-bold",
                    isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isPositive ? "+" : ""}{priceChange.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Índice de valor percebido</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Market Cap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Market Cap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">
                {stats.totalCirculating.toLocaleString("pt-BR")}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {currency.plural} em circulação
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Volume 24h */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Volume 24h
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-blue-600">
                {stats.totalTransactions24h.toLocaleString("pt-BR")}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {currency.plural} transacionados hoje
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Engagement Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="h-3 w-3" />
                Índice de Engajamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-orange-500">
                  {stats.engagementIndex}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Usuários ativos com saldo
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart and Rankings */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          <CurrencyChart 
            data={stats.dailyVolume} 
            currency={currency}
          />
        </div>

        {/* Additional Stats */}
        <div className="space-y-6">
          {/* All-Time High */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-yellow-600" />
                All-Time High
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-yellow-600">
                {currency.symbol} {stats.allTimeHigh.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                Maior saldo individual já atingido
              </p>
            </CardContent>
          </Card>

          {/* Total Redemptions */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4 text-primary" />
                Total de Resgates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">
                {stats.totalRedemptions}
              </div>
              <p className="text-xs text-muted-foreground">
                Transações de débito realizadas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rankings */}
      {settings.gamification?.showRankings && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Accumulators */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-5 w-5 text-yellow-500" />
                Top 5 Acumuladores
              </CardTitle>
              <CardDescription>
                Usuários com maior saldo de {currency.plural}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.topAccumulators.length > 0 ? (
                stats.topAccumulators.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          index === 0 && "bg-yellow-100 text-yellow-700",
                          index === 1 && "bg-gray-100 text-gray-700",
                          index === 2 && "bg-orange-100 text-orange-700",
                          index > 2 && "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium">{user.userName}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold" style={{ color: currency.primaryColor }}>
                      {currency.symbol} {user.balance.toLocaleString("pt-BR")}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum acumulador encontrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Spenders */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-green-500" />
                Top 5 Gastadores
              </CardTitle>
              <CardDescription>
                Usuários mais ativos em resgates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.topSpenders.length > 0 ? (
                stats.topSpenders.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          index === 0 && "bg-green-100 text-green-700",
                          index === 1 && "bg-emerald-100 text-emerald-700",
                          index === 2 && "bg-teal-100 text-teal-700",
                          index > 2 && "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium">{user.userName}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-green-600">
                      <ArrowUpRight className="h-3 w-3" />
                      {user.spent.toLocaleString("pt-BR")}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum gastador encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Transactions */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Transações Recentes</CardTitle>
              <CardDescription>
                Últimas movimentações de {currency.plural}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={triggerCelebration}>
              🎉 Celebrar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentTransactions.slice(0, 5).map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    tx.type === "credit" ? "bg-green-100" : "bg-red-100"
                  )}>
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "font-bold",
                  tx.type === "credit" ? "text-green-600" : "text-red-600"
                )}>
                  {tx.type === "credit" ? "+" : "-"}{Math.abs(tx.amount).toLocaleString("pt-BR")} {currency.abbreviation}
                </div>
              </motion.div>
            ))}
            {stats.recentTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma transação recente encontrada
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
