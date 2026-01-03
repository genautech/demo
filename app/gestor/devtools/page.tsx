"use client"

import { useState } from "react"
import { useDemoState } from "@/hooks/use-demo-state"
import { SCENARIOS, seedScenario, resetDemo, ScenarioName } from "@/lib/seeders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Terminal, Database, Trash2, Zap, AlertTriangle, RefreshCw, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { PageContainer } from "@/components/page-container"

export default function DevtoolsPage() {
  const { env } = useDemoState()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSeed = async (name: ScenarioName) => {
    setLoading(name)
    try {
      await seedScenario(name, env)
      toast.success(`Cenário "${name}" aplicado com sucesso!`)
    } finally {
      setLoading(null)
    }
  }

  const handleReset = () => {
    if (confirm("ATENÇÃO: Isso apagará TODOS os dados da demo salvos localmente. Continuar?")) {
      resetDemo()
    }
  }

  return (
    <PageContainer className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
          <Terminal className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Demo DevTools</h1>
          <p className="text-muted-foreground text-sm">Ferramentas para gerenciar o estado da demonstração e simular cenários.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-orange-300 dark:border-orange-800">
            <CardHeader className="bg-orange-50/50 dark:bg-orange-900/20">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <Database className="h-5 w-5" /> Injeção de Cenários
              </CardTitle>
              <CardDescription>Popule o banco de dados local com dados pré-configurados para narrativa de venda.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
              {(Object.keys(SCENARIOS) as ScenarioName[]).map((name) => (
                <div key={name} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors group">
                  <div>
                    <p className="font-bold text-sm text-foreground">{name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                      {SCENARIOS[name].products.length} Produtos • {SCENARIOS[name].tags.join(", ")}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="group-hover:bg-primary group-hover:text-white"
                    disabled={!!loading}
                    onClick={() => handleSeed(name)}
                  >
                    {loading === name ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                    Aplicar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-red-300 dark:border-red-800">
            <CardHeader className="bg-red-50/50 dark:bg-red-900/20">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                <Trash2 className="h-5 w-5" /> Zona de Perigo
              </CardTitle>
              <CardDescription>Limpeza total do cache e storage da demonstração.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button variant="destructive" className="w-full gap-2" onClick={handleReset}>
                <RefreshCw className="h-4 w-4" /> Resetar Todos os Dados Locais
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-4 italic">
                Isso forçará um reload da página e retornará ao estado inicial.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status do Simulador</CardTitle>
              <CardDescription>Monitoramento em tempo real dos processos de background.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Fulfillment Simulator
                </div>
                <Badge variant="outline" className="text-[10px]">ATIVO</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Webhook Delivery Engine
                </div>
                <Badge variant="outline" className="text-[10px]">ATIVO</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground opacity-50">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                  Inventory Exception Injector
                </div>
                <Badge variant="outline" className="text-[10px]">INATIVO</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl shadow-2xl font-mono text-[11px] space-y-2">
            <p className="text-green-500 font-bold tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> SYSTEM_READY
            </p>
            <p>{">"} initializing demo_db_v3...</p>
            <p>{">"} current_env: {env}</p>
            <p>{">"} local_storage_usage: ~14kb</p>
            <p>{">"} active_sessions: 1</p>
            <p>{">"} simulation_speed: 1.0x (real-time)</p>
            <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-slate-500">v3.0.0-beta.demo</span>
              <span className="animate-pulse bg-green-500 h-3 w-1" />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
