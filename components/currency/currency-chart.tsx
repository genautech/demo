"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Activity } from "lucide-react"
import { type StoreSettings } from "@/lib/storage"

interface CurrencyChartProps {
  data: { date: string; volume: number }[]
  currency: StoreSettings["currency"]
}

export function CurrencyChart({ data, currency }: CurrencyChartProps) {
  // Format data for display
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("pt-BR", { 
      weekday: "short",
      day: "2-digit",
    }),
    formattedVolume: item.volume.toLocaleString("pt-BR"),
  }))

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          Volume de Transações
        </CardTitle>
        <CardDescription>
          Últimos 7 dias de movimentação de {currency.plural}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currency.primaryColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={currency.primaryColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
                formatter={(value: number) => [
                  `${value.toLocaleString("pt-BR")} ${currency.abbreviation}`,
                  "Volume"
                ]}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke={currency.primaryColor}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
