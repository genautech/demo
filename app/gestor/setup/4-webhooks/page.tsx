"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemoState } from "@/hooks/use-demo-state"
import { demoClient } from "@/lib/demoClient"
import { WebhookDTO, WebhookDeliveryDTO, WebhookEventType } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Webhook, ArrowRight, Loader2, Send, CheckCircle2, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import { eventBus } from "@/lib/eventBus"

export default function WebhooksStep() {
  const { env } = useDemoState()
  const router = useRouter()
  const [webhook, setWebhook] = useState<WebhookDTO | null>(null)
  const [deliveries, setDeliveries] = useState<WebhookDeliveryDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [url, setUrl] = useState("https://meu-sistema.com.br/api/yoobe-webhook")

  useEffect(() => {
    setLoading(true)
    demoClient.getWebhooks(env).then(res => {
      if (res.length > 0) setWebhook(res[0])
      setLoading(false)
    })
    demoClient.getWebhookDeliveries(env).then(setDeliveries)
  }, [env])

  const handleCreateWebhook = async () => {
    setLoading(true)
    try {
      const res = await demoClient.createWebhook(env, url, ["order.completed", "points.credit"])
      setWebhook(res)
      toast.success("Webhook registrado!")
    } finally {
      setLoading(false)
    }
  }

  const handleSendTest = async () => {
    setSending(true)
    try {
      // Trigger a real simulation through event bus
      await eventBus.emit(env, "order.completed", {
        orderId: "ord_demo_123",
        status: "completed",
        timestamp: new Date().toISOString()
      })
      
      const res = await demoClient.getWebhookDeliveries(env)
      setDeliveries(res)
      
      if (res.some(d => d.status === "ok")) {
        await demoClient.updateSetupStep(env, "webhooks", "done")
      }
      
      toast.success("Evento de teste enviado!")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.push("/gestor/setup")} className="mb-4">
          ← Voltar para visão geral
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Step 4: Webhooks</h1>
        <p className="text-muted-foreground mt-2">
          Receba notificações em tempo real no seu sistema sempre que algo importante acontecer.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5 text-primary" />
              Configuração de Webhook
            </CardTitle>
            <CardDescription>
              URL do seu endpoint que receberá os payloads JSON via POST.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!webhook ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL de Destino</Label>
                  <Input 
                    id="webhook-url" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    placeholder="https://sua-api.com/webhooks/yoobe"
                  />
                </div>
                <Button onClick={handleCreateWebhook} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Webhook className="h-4 w-4 mr-2" />}
                  Salvar Webhook
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{webhook.url}</p>
                    <p className="text-xs text-muted-foreground">Assinado com: {webhook.secretMasked}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setWebhook(null)}>Editar</Button>
                </div>
                <Button onClick={handleSendTest} disabled={sending} variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Enviar Evento de Teste (order.completed)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {webhook && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Entregas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {deliveries.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4 italic">
                  Nenhuma entrega registrada ainda.
                </p>
              ) : (
                <div className="space-y-2">
                  {deliveries.slice(0, 5).map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 text-sm bg-card border rounded-lg">
                      <div className="flex items-center gap-3">
                        {d.status === "ok" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-mono text-xs">{d.eventType}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{d.latencyMs}ms</span>
                        <span>{new Date(d.lastAttemptAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {deliveries.some(d => d.status === "ok") && (
                <div className="pt-6 border-t mt-6 flex justify-end">
                  <Button onClick={() => router.push("/gestor/setup/5-test-order")} className="gap-2">
                    Próximo Passo: Test Order <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
