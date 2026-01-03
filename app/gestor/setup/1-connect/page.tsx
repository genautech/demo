"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemoState } from "@/hooks/use-demo-state"
import { demoClient } from "@/lib/demoClient"
import { ApiKeyDTO } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Copy, Check, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function ConnectStep() {
  const { env } = useDemoState()
  const router = useRouter()
  const [apiKey, setApiKey] = useState<ApiKeyDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    demoClient.getApiKeys(env).then(keys => {
      if (keys.length > 0) setApiKey(keys[0])
    })
  }, [env])

  const handleGenerateKey = async () => {
    setLoading(true)
    try {
      const key = await demoClient.createApiKey(env, "Minha Chave de API")
      setApiKey(key)
      toast.success("Chave de API gerada com sucesso!")
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTimeout(async () => {
      await demoClient.updateSetupStep(env, "connect", "done")
      setTesting(false)
      toast.success("Conexão testada com sucesso! TraceId: " + Math.random().toString(36).substring(7))
      router.push("/gestor/setup/2-catalog")
    }, 1500)
  }

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey.prefix + "********************")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.info("Chave copiada!")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.push("/gestor/setup")} className="mb-4">
          ← Voltar para visão geral
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Step 1: Connect</h1>
        <p className="text-muted-foreground mt-2">
          Gere sua chave de API para autenticar suas requisições. No modo demo, simulamos o processo de provisionamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Keys ({env})
          </CardTitle>
          <CardDescription>
            Sua chave secreta para acessar a API do Yoobe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!apiKey ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed">
              <p className="text-sm text-muted-foreground mb-4">Você ainda não possui chaves geradas.</p>
              <Button onClick={handleGenerateKey} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                Gerar Chave de API
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Chave</Label>
                <Input value={apiKey.name} readOnly className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    value={apiKey.prefix + "********************"} 
                    readOnly 
                    className="font-mono bg-slate-50"
                  />
                  <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Criada em {new Date(apiKey.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-4 border-t flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Status: <span className="text-green-600 font-semibold">Ativa</span>
                </div>
                <Button onClick={handleTestConnection} disabled={testing} variant="default" className="gap-2">
                  {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Testar Conexão
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
