"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Box, Check, Copy, Package, Play, Send, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

const MOCK_API_CALL = `{
  "action": "ship_reward",
  "customer": {
    "name": "Alex Silva",
    "email": "alex@example.com"
  },
  "product": {
    "sku": "YOOBE-SWAG-001",
    "name": "Mochila Corporate Pro"
  },
  "shipping": {
    "address": "Av. Paulista, 1000",
    "city": "São Paulo",
    "state": "SP"
  }
}`

export function ApiDemo() {
  const [isShipping, setIsShipping] = useState(false)
  const [step, setStep] = useState(0)

  const handleSimulate = () => {
    setIsShipping(true)
    setStep(1)
    
    setTimeout(() => setStep(2), 1500)
    setTimeout(() => setStep(3), 3000)
    setTimeout(() => {
      setStep(4)
      setTimeout(() => {
        setIsShipping(false)
        setStep(0)
      }, 2000)
    }, 4500)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Veja a Mágica Acontecer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Uma chamada de API para nós é um sorriso no rosto do seu cliente. 
            Nós cuidamos de tudo após o clique.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Code Block */}
          <Card className="bg-slate-950 text-slate-300 font-mono text-sm overflow-hidden border-none shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="text-xs text-slate-500">POST /api/v1/shipments</div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <CardContent className="p-6">
              <pre className="whitespace-pre-wrap">
                {MOCK_API_CALL}
              </pre>
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleSimulate} 
                  disabled={isShipping}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium active:scale-[0.98] transition-all"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Simular API Call
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Visual Animation */}
          <Card className="relative overflow-hidden flex flex-col items-center justify-center p-8 bg-card shadow-xl border-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
            
            <div className="relative w-full max-w-md h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                      <Send className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">Aguardando comando...</p>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div 
                    key="process"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <motion.div 
                      animate={{ 
                        rotate: [0, 360],
                        borderRadius: ["20%", "50%", "20%"]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 bg-primary/20 flex items-center justify-center mb-4 border-2 border-primary/30 border-dashed"
                    >
                      <Package className="w-10 h-10 text-primary" />
                    </motion.div>
                    <p className="text-primary font-bold">Processando Pedido...</p>
                    <p className="text-xs text-muted-foreground mt-1">Verificando estoque e gerando etiqueta</p>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="shipped"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col items-center text-center"
                  >
                    <motion.div 
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-4"
                    >
                      <Truck className="w-12 h-12 text-blue-500" />
                    </motion.div>
                    <p className="text-blue-600 font-bold">Em Trânsito!</p>
                    <p className="text-xs text-muted-foreground mt-1">Saiu para entrega com transportadora parceira</p>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="delivered"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/40"
                      >
                        <Check className="w-12 h-12 text-white" />
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [1, 2, 2.5] }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-green-500 rounded-full"
                      />
                    </div>
                    <p className="text-green-600 font-bold text-xl">Entregue!</p>
                    <p className="text-sm text-muted-foreground mt-1">Pedido recebido pelo Alex Silva</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full mt-auto space-y-4">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className={step >= 1 ? "text-primary" : "text-muted-foreground"}>Processado</span>
                <span className={step >= 2 ? "text-primary" : "text-muted-foreground"}>Despachado</span>
                <span className={step >= 3 ? "text-primary" : "text-muted-foreground"}>Entregue</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: step === 0 ? "0%" : 
                           step === 1 ? "33%" : 
                           step === 2 ? "66%" : "100%" 
                  }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
