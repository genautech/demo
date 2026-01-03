"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Sparkles, 
  Send, 
  Bot, 
  X, 
  MessageCircle, 
  Zap, 
  TrendingUp, 
  Gift, 
  Loader2,
  ChevronDown,
  RefreshCw,
  Package
} from "lucide-react"
import { useAIDemo } from "@/hooks/use-ai-demo"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { eventBus } from "@/lib/eventBus"
import { getCompanyById, getBaseProducts, saveBaseProducts } from "@/lib/storage"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "assistant" | "user", content: string }[]>([
    { role: "assistant", content: "Como posso ajudar na sua demonstração hoje? Posso simular pedidos, criar conquistas ou gerar relatórios em tempo real." }
  ])
  const [inputValue, setInputValue] = useState("")
  const { isLoading } = useAIDemo()
  const { toast } = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    const userMessage = inputValue
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setInputValue("")

    // Check if user wants to generate products
    const generateKeywords = ["gerar", "criar", "adicionar", "novo produto", "novos itens", "campanha", "kit"]
    const wantsGenerate = generateKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))

    if (wantsGenerate) {
      await generateMoreProducts(userMessage)
      return
    }

    // In a real implementation, we would send this to /api/demo/ai for dynamic execution
    // For the demo, we'll simulate a few responses and actions
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Certo! Estou processando seu pedido: "${userMessage}". Atualizando o sistema em tempo real...` 
      }])
      
      // Simulating a system update based on keywords
      if (userMessage.toLowerCase().includes("pedido") || userMessage.toLowerCase().includes("order")) {
        eventBus.emit("sandbox" as any, "order.created" as any, { simulated: true })
      }
    }, 1000)
  }

  const generateMoreProducts = async (prompt: string) => {
    setMessages(prev => [...prev, { 
      role: "assistant", 
      content: "Gerando novos produtos personalizados com base no seu pedido..." 
    }])

    try {
      // Get current company profile
      const authData = localStorage.getItem("yoobe_auth")
      if (!authData) {
        setMessages(prev => [...prev, { role: "assistant", content: "Erro: Não encontrei o perfil da empresa." }])
        return
      }

      const auth = JSON.parse(authData)
      const company = getCompanyById(auth.companyId)
      
      if (!company) {
        setMessages(prev => [...prev, { role: "assistant", content: "Erro: Empresa não encontrada." }])
        return
      }

      // Create a profile object for the API
      const profile = {
        companyName: company.name,
        industry: "Custom",
        teamSize: "50-200",
        primaryGoal: prompt,
        colors: {
          primary: company.primaryColor || "#10b981",
          secondary: company.secondaryColor || "#059669",
        },
        logo: company.logo,
      }

      const response = await fetch("/api/demo/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "generate-products", 
          profile,
          prompt: `Generate 3-5 new products based on: ${prompt}`,
        }),
      })

      if (!response.ok) throw new Error("Falha ao gerar produtos")

      const data = await response.json()
      const newProducts = data.products || []

      if (newProducts.length > 0) {
        // Add to base products
        const existingBase = getBaseProducts()
        const brandedProducts = newProducts.map((p: any, i: number) => ({
          ...p,
          id: `ai_${Date.now()}_${i}`,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
        
        saveBaseProducts([...existingBase, ...brandedProducts])

        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `Criei ${newProducts.length} novos produtos com sua marca! Eles já estão disponíveis no catálogo.` 
        }])

        toast({
          title: "Produtos gerados!",
          description: `${newProducts.length} novos itens adicionados ao catálogo.`,
        })

        // Trigger a refresh event
        window.dispatchEvent(new CustomEvent("products-updated"))
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Não consegui gerar produtos no momento. Tente novamente." }])
      }
    } catch (error) {
      console.error("Generate products error:", error)
      setMessages(prev => [...prev, { role: "assistant", content: "Erro ao gerar produtos. Verifique sua conexão." }])
    }
  }

  const runQuickAction = (action: string, label: string) => {
    toast({
      title: "Executando Ação AI",
      description: label,
    })

    if (action === "simulate-orders") {
      eventBus.emit("sandbox" as any, "order.created" as any, { count: 5 })
      setMessages(prev => [...prev, { role: "assistant", content: "Simulei 5 novos pedidos de diferentes colaboradores. Confira o dashboard de logística!" }])
    } else if (action === "unlock-achievements") {
      eventBus.emit("sandbox" as any, "achievement.unlocked" as any, { name: "Super Engajado" })
      setMessages(prev => [...prev, { role: "assistant", content: "Vários membros do time acabaram de desbloquear a conquista 'Super Engajado'!" }])
    } else if (action === "low-stock-alert") {
      setMessages(prev => [...prev, { role: "assistant", content: "Alerta: O estoque do seu produto mais popular está chegando ao fim. Deseja iniciar um novo processo de replicação?" }])
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-[350px] sm:w-[400px] shadow-2xl overflow-hidden bg-white/90 backdrop-blur-xl border border-slate-200">
              <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Yoobe AI Assistant</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 h-8 w-8">
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-3 border-b bg-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold gap-1 rounded-full whitespace-nowrap"
                  onClick={() => generateMoreProducts("Kit de Verão")}
                  disabled={isLoading}
                >
                  <Package className="h-3 w-3 text-purple-500" />
                  Gerar Itens
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold gap-1 rounded-full whitespace-nowrap"
                  onClick={() => runQuickAction("simulate-orders", "Simulando pedidos...")}
                >
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  Simular Pedidos
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold gap-1 rounded-full whitespace-nowrap"
                  onClick={() => runQuickAction("unlock-achievements", "Desbloqueando conquistas...")}
                >
                  <Zap className="h-3 w-3 text-yellow-500" />
                  Engajamento AI
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold gap-1 rounded-full whitespace-nowrap"
                  onClick={() => runQuickAction("low-stock-alert", "Alertas de estoque...")}
                >
                  <Gift className="h-3 w-3 text-pink-500" />
                  Logística Real
                </Button>
              </div>

              <CardContent className="p-4 h-[300px] flex flex-col">
                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                  {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-2", m.role === "user" ? "flex-row-reverse" : "")}>
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold",
                        m.role === "assistant" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                      )}>
                        {m.role === "assistant" ? "AI" : "EU"}
                      </div>
                      <div className={cn(
                        "rounded-xl p-2.5 text-xs shadow-sm max-w-[80%]",
                        m.role === "assistant" ? "bg-slate-100 text-slate-800" : "bg-blue-600 text-white"
                      )}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Pergunte ao assistente..."
                    className="h-9 text-xs rounded-full bg-slate-50"
                  />
                  <Button size="icon" onClick={handleSend} className="h-9 w-9 rounded-full bg-blue-600 shadow-lg shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
          isOpen ? "bg-slate-900 rotate-90" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-110"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 border-2 border-white"></span>
          </span>
        )}
      </Button>
    </div>
  )
}
