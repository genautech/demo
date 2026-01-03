"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  getDemoById, 
  loadDemoContext, 
  type SavedDemo 
} from "@/lib/storage"
import { 
  Loader2, 
  Building, 
  User, 
  Calendar, 
  ArrowRight, 
  AlertCircle,
  PlayCircle,
  Layers,
  Link2,
  Home
} from "lucide-react"

export default function DemoAccessPage() {
  const router = useRouter()
  const params = useParams()
  const demoId = params.id as string
  
  const [demo, setDemo] = useState<SavedDemo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!demoId) {
      setError("ID da demo não informado")
      setIsLoading(false)
      return
    }

    // Tentar carregar a demo
    const foundDemo = getDemoById(demoId)
    
    if (!foundDemo) {
      setError("Demo não encontrada")
      setIsLoading(false)
      return
    }

    if (foundDemo.status === "archived") {
      setError("Esta demo foi arquivada e não está mais disponível")
      setIsLoading(false)
      return
    }

    setDemo(foundDemo)
    setIsLoading(false)
  }, [demoId])

  const handleAccessDemo = () => {
    if (!demo) return
    
    setIsRedirecting(true)
    
    // Carregar o contexto da demo (auth, company, etc.)
    const success = loadDemoContext(demo.id)
    
    if (success) {
      // Redirecionar para o dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } else {
      setError("Não foi possível carregar a demo. Os dados podem estar corrompidos.")
      setIsRedirecting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Carregando demo...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-md shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Demo Não Encontrada</CardTitle>
              <CardDescription className="text-base">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 font-mono mb-2">ID solicitado:</p>
                <p className="font-mono text-sm text-slate-700">{demoId}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => router.push("/demos")} className="w-full">
                  <Layers className="mr-2 h-4 w-4" />
                  Ver Demos Disponíveis
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Ir para Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!demo) return null

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Header com cores da demo */}
          <div 
            className="p-8 text-center text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${demo.colors.primary} 0%, ${demo.colors.secondary} 100%)`
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm shadow-xl">
                <Building className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-black mb-2 drop-shadow-lg">
                {demo.companyName}
              </h1>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Demo Yoobe
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Informações da Demo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <User className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Criado por</p>
                  <p className="text-sm font-semibold text-slate-800">{demo.creatorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Criada em</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(demo.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                  <Link2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    Acesso Público à Demo
                  </p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Esta é uma demonstração interativa da plataforma Yoobe. 
                    Você pode explorar todas as funcionalidades como se fosse o gestor da empresa.
                  </p>
                </div>
              </div>
            </div>

            {/* Detalhes */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs capitalize">
                {demo.vertical}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {demo.userCount} usuários simulados
              </Badge>
              <Badge variant="outline" className="text-xs">
                ID: {demo.id.split("_")[1]}
              </Badge>
            </div>

            {/* Botão de Acesso */}
            <Button 
              size="lg" 
              className="w-full shadow-lg bg-primary hover:bg-primary/90"
              onClick={handleAccessDemo}
              disabled={isRedirecting}
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Carregando demo...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Acessar Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Yoobe Swag Track • Gamificação Corporativa
        </p>
      </motion.div>
    </div>
  )
}
