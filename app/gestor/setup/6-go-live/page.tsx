"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDemoState } from "@/hooks/use-demo-state"
import { demoClient } from "@/lib/demoClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Rocket, ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export default function GoLiveStep() {
  const { env, toggleEnv } = useDemoState()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleGoLive = async () => {
    setLoading(true)
    try {
      // Simulate duplicating config to production
      await new Promise(r => setTimeout(r, 2000))
      await demoClient.updateSetupStep(env, "go_live", "done")
      
      setCompleted(true)
      toast.success("Ambiente de Produção (Simulado) ativado!")
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchToProd = () => {
    toggleEnv("production")
    router.push("/gestor/integrations/api-keys")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.push("/gestor/setup")} className="mb-4">
          ← Voltar para visão geral
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Step 6: Go-Live</h1>
        <p className="text-muted-foreground mt-2">
          Você concluiu todos os passos do setup. Agora é hora de ativar o ambiente de produção.
        </p>
      </div>

      {!completed ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="text-center">
            <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Pronto para o Lançamento?</CardTitle>
            <CardDescription>
              Ao clicar no botão abaixo, simularemos a migração das suas configurações de Sandbox para Produção.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {[
                "Replicação de Catálogo",
                "Migração de Webhooks",
                "Provisionamento de Chaves Live",
                "Configuração de Política de Pontos"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={handleGoLive} disabled={loading} className="w-full mt-6 py-6 text-lg font-bold gap-3">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
              Ativar Modo Produção
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50/30 shadow-xl scale-105 transition-all">
          <CardHeader className="text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Parabéns! 🎉</CardTitle>
            <CardDescription className="text-base">
              Sua conta Yoobe está configurada e pronta para operar em produção.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center p-8 pt-0">
            <p className="text-sm text-muted-foreground mb-8">
              Lembre-se: em modo demo, o ambiente de produção também é simulado localmente no seu navegador.
            </p>
            <div className="grid gap-4">
              <Button onClick={handleSwitchToProd} size="lg" className="w-full font-bold">
                Acessar Dashboard de Produção
              </Button>
              <Button variant="outline" onClick={() => router.push("/gestor/integrations/api-keys")}>
                Ver Chaves de API
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
