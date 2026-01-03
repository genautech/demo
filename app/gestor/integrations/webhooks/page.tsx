"use client"

import { useDemoState } from "@/hooks/use-demo-state"
import { useWebhooks, useWebhookDeliveries } from "@/hooks/use-console-data"
import { demoClient } from "@/lib/demoClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Webhook as WebhookIcon, Plus, Trash2, CheckCircle2, XCircle, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { eventBus } from "@/lib/eventBus"
import { WebhookEventType } from "@/lib/storage"

export default function WebhooksPage() {
  const { env } = useDemoState()
  const { webhooks, isLoading, mutate: mutateWebhooks } = useWebhooks(env)
  const { deliveries, mutate: mutateDeliveries } = useWebhookDeliveries(env)
  const [creating, setCreating] = useState(false)
  const [sending, setSending] = useState<string | null>(null)

  const handleCreate = async () => {
    const url = prompt("Digite a URL do Webhook:", "https://sua-api.com/webhooks/yoobe")
    if (!url) return

    setCreating(true)
    try {
      await demoClient.createWebhook(env, url, ["order.completed", "points.credit"])
      mutateWebhooks()
      toast.success("Webhook registrado!")
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Deseja remover este webhook?")) {
      await demoClient.deleteWebhook(env, id)
      mutateWebhooks()
      toast.info("Webhook removido.")
    }
  }

  const handleTest = async (eventType: WebhookEventType) => {
    setSending(eventType)
    try {
      await eventBus.emit(env, eventType, {
        test: true,
        timestamp: new Date().toISOString(),
        env
      })
      mutateDeliveries()
      toast.success(`Evento ${eventType} enviado para teste!`)
    } finally {
      setSending(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
            <Badge variant="secondary" className="text-[9px] font-bold uppercase py-0 px-1.5 h-4 bg-blue-100 text-blue-700 border-blue-200">DEMO</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Receba notificações JSON via HTTP POST para eventos no {env}. <span className="text-xs italic">(Modo demo: simulação local)</span></p>
        </div>
        <Button onClick={handleCreate} disabled={creating} className="gap-2">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Novo Webhook
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Endpoints Configurados</CardTitle>
            <CardDescription>Para quais URLs o Yoobe enviará eventos.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-4">Carregando...</TableCell></TableRow>
                ) : webhooks.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">Nenhum webhook configurado.</TableCell></TableRow>
                ) : (
                  webhooks.map((wh) => (
                    <TableRow key={wh.id}>
                      <TableCell className="font-mono text-xs">{wh.url}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {wh.events.map(e => (
                            <Badge key={e} variant="outline" className="text-[10px] uppercase">{e}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => handleDelete(wh.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Simulador de Eventos</CardTitle>
            <CardDescription>Dispare eventos manuais para testar sua integração.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Order Completed", type: "order.completed" },
                { label: "Points Credited", type: "points.credit" },
                { label: "Shipment Updated", type: "shipment.updated" }
              ].map(evt => (
                <Button 
                  key={evt.type} 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  disabled={!!sending}
                  onClick={() => handleTest(evt.type)}
                >
                  {sending === evt.type ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                  {evt.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Log de Entregas</CardTitle>
            <CardDescription>Histórico de tentativas de envio de webhooks.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Latência</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead className="text-right">Trace ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground italic">Nenhuma entrega registrada.</TableCell></TableRow>
                ) : (
                  deliveries.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {d.status === "ok" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={d.status === "ok" ? "text-green-700" : "text-red-700"}>
                            {d.responseCode}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{d.eventType}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{d.latencyMs}ms</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(d.lastAttemptAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-[10px] text-muted-foreground">
                        {d.traceId}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
