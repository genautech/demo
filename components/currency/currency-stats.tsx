"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import { type StoreSettings } from "@/lib/storage"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  color?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function CurrencyStatCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Icon className="h-3 w-3" style={{ color }} />
            {title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span 
              className="text-3xl font-black"
              style={{ color }}
            >
              {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
            </span>
            {trend && (
              <span 
                className={`text-xs font-bold ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-[10px] text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface CurrencyStatsProps {
  stats: {
    totalCirculating: number
    totalTransactions24h: number
    engagementIndex: number
    allTimeHigh: number
  }
  currency: StoreSettings["currency"]
}

export function CurrencyStats({ stats, currency }: CurrencyStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CurrencyStatCard
        title="Market Cap"
        value={`${currency.symbol} ${stats.totalCirculating.toLocaleString("pt-BR")}`}
        description={`${currency.plural} em circulação`}
        icon={() => <span className="text-sm">{currency.icon}</span>}
        color={currency.primaryColor}
      />
      <CurrencyStatCard
        title="Volume 24h"
        value={stats.totalTransactions24h}
        description={`${currency.plural} transacionados`}
        icon={() => <span className="text-sm">📊</span>}
        color="#3b82f6"
        trend={{ value: 12.5, isPositive: true }}
      />
      <CurrencyStatCard
        title="Engajamento"
        value={`${stats.engagementIndex}%`}
        description="Usuários ativos"
        icon={() => <span className="text-sm">🔥</span>}
        color="#f97316"
      />
      <CurrencyStatCard
        title="All-Time High"
        value={`${currency.symbol} ${stats.allTimeHigh.toLocaleString("pt-BR")}`}
        description="Maior saldo individual"
        icon={() => <span className="text-sm">🏆</span>}
        color="#eab308"
      />
    </div>
  )
}
