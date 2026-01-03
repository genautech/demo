"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { type PointsTransaction, type StoreSettings } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface CurrencyTickerProps {
  transactions: PointsTransaction[]
  currency: StoreSettings["currency"]
}

export function CurrencyTicker({ transactions, currency }: CurrencyTickerProps) {
  // Duplicate transactions for seamless loop
  const tickerItems = [...transactions, ...transactions]

  return (
    <div className="relative overflow-hidden bg-muted/30 rounded-xl py-3 border">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {tickerItems.map((tx, index) => (
          <div
            key={`${tx.id}-${index}`}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-lg">{currency.icon}</span>
            <span 
              className={cn(
                "font-bold",
                tx.type === "credit" ? "text-green-600" : "text-red-600"
              )}
            >
              {tx.type === "credit" ? (
                <ArrowDownLeft className="inline h-3 w-3 mr-0.5" />
              ) : (
                <ArrowUpRight className="inline h-3 w-3 mr-0.5" />
              )}
              {tx.type === "credit" ? "+" : "-"}{Math.abs(tx.amount).toLocaleString("pt-BR")} {currency.abbreviation}
            </span>
            <span className="text-muted-foreground text-xs">
              {tx.description.length > 30 ? tx.description.substring(0, 30) + "..." : tx.description}
            </span>
            <span className="text-muted-foreground/50 text-xs">•</span>
          </div>
        ))}
      </motion.div>
      
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}
