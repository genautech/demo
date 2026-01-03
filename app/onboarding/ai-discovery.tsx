"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Send, Bot, User, Loader2, Upload, Image as ImageIcon } from "lucide-react"
import { useAIDemo, AIDiscoveryProfile, AIProduct } from "@/hooks/use-ai-demo"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: "assistant" | "user"
  content: string
  products?: AIProduct[]
}

interface AIDiscoveryProps {
  onComplete: (profile: AIDiscoveryProfile, products: AIProduct[]) => void
}

export function AIDiscovery({ onComplete }: AIDiscoveryProps) {
  const { generateProfile, generateAIProducts, isLoading } = useAIDemo()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Olá! Eu sou seu assistente de onboarding inteligente. Qual é o nome da sua empresa e o que vocês fazem?" 
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [logoBase64, setLogoBase64] = useState<string | null>(null)
  const [showLogoUpload, setShowLogoUpload] = useState(false)
  const [profile, setProfile] = useState<AIDiscoveryProfile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

    const generatedProfile = await generateProfile(userMessage)
    
    if (generatedProfile) {
      const profileWithLogo = { ...generatedProfile, logo: logoBase64 || undefined }
      setProfile(profileWithLogo)
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Entendido! Detectei que a ${generatedProfile.companyName} atua no setor de ${generatedProfile.industry}. Vou preparar uma experiência personalizada para seu time de ${generatedProfile.teamSize} pessoas.` 
      }])

      setShowLogoUpload(true)
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Para personalizar ainda mais, você pode enviar o logo da sua empresa. Isso fará com que os swags gerados tenham sua marca! (Opcional - você pode pular)" 
      }])
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, envie uma imagem menor que 2MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setLogoBase64(base64)
      toast({
        title: "Logo carregado!",
        description: "Sua marca será aplicada aos produtos gerados.",
      })
      setShowLogoUpload(false)
      
      if (profile) {
        generateProductsWithLogo({ ...profile, logo: base64 })
      }
    }
    reader.readAsDataURL(file)
  }

  const generateProductsWithLogo = async (profileWithLogo: AIDiscoveryProfile) => {
    setMessages(prev => [...prev, { 
      role: "assistant", 
      content: "Gerando swags exclusivos com sua marca..." 
    }])
    
    const products = await generateAIProducts(profileWithLogo)
    
    if (products.length > 0) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Criei ${products.length} produtos exclusivos com sua marca! Estamos prontos para começar a demo.`,
        products: products
      }])
      
      setIsFinalizing(true)
      
      setTimeout(() => {
        onComplete(profileWithLogo, products)
      }, 2000)
    }
  }

  const skipLogoUpload = () => {
    setShowLogoUpload(false)
    if (profile) {
      generateProductsWithLogo(profile)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-md">
      <div className="bg-linear-to-r from-yellow-400 via-orange-500 to-pink-500 p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white">Modo Inteligente</h3>
          <p className="text-white/80 text-xs">AI-Powered Demo Onboarding</p>
        </div>
      </div>
      
      <CardContent className="p-6 h-[400px] flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  m.role === "assistant" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                )}>
                  {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "rounded-2xl p-3 text-sm shadow-sm",
                  m.role === "assistant" 
                    ? "bg-slate-100 text-slate-800 rounded-tl-none" 
                    : "bg-blue-600 text-white rounded-tr-none"
                )}>
                  {m.content}
                  
                  {m.products && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {m.products.map((p, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-3 border-2 border-slate-100 shadow-md overflow-hidden group hover:border-yellow-400 transition-all">
                          <div className="aspect-square bg-slate-50 rounded-xl mb-3 relative overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-yellow-400 text-[10px] font-black px-2 py-1 rounded-full text-white shadow-lg">
                              EXCLUSIVO
                            </div>
                          </div>
                          <p className="text-xs font-black truncate text-slate-800">{p.name}</p>
                          <p className="text-[10px] font-bold text-yellow-600 mt-1">{p.priceInPoints} pontos</p>
                          <p className="text-[9px] text-slate-500 line-clamp-1 mt-1">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {(isLoading || isFinalizing) && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-slate-100 rounded-2xl p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">Processando...</span>
              </div>
            </div>
          )}
        </div>

        {showLogoUpload && (
          <div className="mb-4 p-4 bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <ImageIcon className="h-5 w-5 text-yellow-600" />
              <p className="text-sm font-semibold text-slate-800">Enviar Logo da Empresa</p>
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Escolher Imagem
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipLogoUpload}
              >
                Pular
              </Button>
            </div>
            {logoBase64 && (
              <div className="mt-3 flex items-center gap-2">
                <img src={logoBase64} alt="Logo" className="h-8 w-8 object-contain rounded" />
                <span className="text-xs text-slate-600">Logo carregado com sucesso!</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Diga-nos sobre sua empresa..."
            disabled={isLoading || isFinalizing || showLogoUpload}
            className="rounded-full bg-slate-50 border-slate-200 focus:ring-yellow-500"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || isFinalizing || !inputValue.trim() || showLogoUpload}
            className="rounded-full bg-linear-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-lg"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
