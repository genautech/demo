"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDemoState } from "@/hooks/use-demo-state"
import { demoClient } from "@/lib/demoClient"
import { SetupStatusDTO } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: "connect", title: "Connect", description: "Configurar chaves de API", path: "/gestor/setup/1-connect" },
  { id: "catalog", title: "Catalog", description: "Importar produtos de demonstração", path: "/gestor/setup/2-catalog" },
  { id: "wallet", title: "Wallet", description: "Configurar carteira e usuários", path: "/gestor/setup/3-wallet" },
  { id: "webhooks", title: "Webhooks", description: "Configurar notificações", path: "/gestor/setup/4-webhooks" },
  { id: "test_order", title: "Test Order", description: "Realizar um pedido de teste", path: "/gestor/setup/5-test-order" },
  { id: "go_live", title: "Go-Live", description: "Simular entrada em produção", path: "/gestor/setup/6-go-live" },
]

export default function SetupPage() {
  const { env } = useDemoState()
  const router = useRouter()
  const [status, setStatus] = useState<SetupStatusDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    demoClient.getSetupStatus(env).then((res) => {
      setStatus(res)
      setLoading(false)
    })
  }, [env])

  if (loading || !status) return <div className="p-8 animate-pulse">Carregando setup...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Console Setup Wizard</h1>
        <p className="text-muted-foreground mt-2">
          Complete os passos abaixo para configurar sua integração Yoobe no ambiente {env}.
        </p>
      </div>

      <div className="grid gap-4">
        {steps.map((step, index) => {
          const stepStatus = status.steps[step.id as keyof typeof status.steps].status
          const isDone = stepStatus === "done"
          const isCurrent = !isDone && (index === 0 || status.steps[steps[index - 1].id as keyof typeof status.steps].status === "done")

          return (
            <Card key={step.id} className={cn("transition-all", isCurrent && "ring-2 ring-primary shadow-lg")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold",
                    isDone ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground text-muted-foreground"
                  )}>
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>
                  <div>
                    <CardTitle className={cn("text-lg", !isCurrent && !isDone && "text-muted-foreground")}>
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
                {isDone ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Concluído</Badge>
                ) : isCurrent ? (
                  <Button onClick={() => router.push(step.path)} size="sm" className="gap-2">
                    Começar <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Clock className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Badge({ children, variant, className }: any) {
  return (
    <div className={cn("px-2 py-0.5 rounded text-xs font-semibold border", className)}>
      {children}
    </div>
  )
}
