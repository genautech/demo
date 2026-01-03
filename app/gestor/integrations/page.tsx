"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  Key, 
  Webhook, 
  Activity, 
  ExternalLink, 
  Puzzle,
  ArrowRight,
  ShieldCheck,
  Cpu
} from "lucide-react"
import Link from "next/link"
import { useDemoState } from "@/hooks/use-demo-state"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function IntegrationsPage() {
  const { env } = useDemoState()

  const integrations = [
    {
      title: "API Keys",
      description: "Gerencie chaves de acesso para integração com sistemas externos.",
      icon: <Key className="h-6 w-6 text-blue-600" />,
      href: "/gestor/integrations/api-keys",
      status: "Ativo",
      color: "bg-blue-50"
    },
    {
      title: "Webhooks",
      description: "Configure endpoints para receber notificações de eventos em tempo real.",
      icon: <Webhook className="h-6 w-6 text-purple-600" />,
      href: "/gestor/integrations/webhooks",
      status: "Configurar",
      color: "bg-purple-50"
    },
    {
      title: "Logs de Eventos",
      description: "Monitore o tráfego e depure integrações através do histórico de requisições.",
      icon: <Activity className="h-6 w-6 text-emerald-600" />,
      href: "/gestor/integrations/logs",
      status: "Monitorando",
      color: "bg-emerald-50"
    }
  ]

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Puzzle className="h-8 w-8 text-primary" />
            Integrações
          </h1>
          <p className="text-slate-500 font-medium">Conecte sua loja Yoobe com seu ecossistema de software.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Ambiente Atual:</span>
          <span className="text-xs font-black text-primary uppercase">{env}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute right-0 top-0 p-8 opacity-10">
            <Cpu className="h-40 w-40 rotate-12" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Documentação de Desenvolvedor
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Acesse guias detalhados e referências de API para automatizar seu fluxo de swag.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="font-bold" asChild>
              <Link href="/membro/documentacao">
                Abrir Docs <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="p-3 bg-slate-100 rounded-2xl text-slate-400">
            <Puzzle className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900 text-sm">Nova Conexão</p>
            <p className="text-xs text-slate-500">Solicite integração com ERPs ou RHMs customizados.</p>
          </div>
          <Button variant="outline" size="sm" className="w-full">Falar com Suporte</Button>
        </Card>
      </div>

      <div className="grid gap-6">
        {integrations.map((item) => (
          <Link href={item.href} key={item.title}>
            <Card className="group hover:shadow-md transition-all border-none shadow-sm cursor-pointer overflow-hidden">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className={cn("p-6 flex items-center justify-center sm:w-24", item.color)}>
                  {item.icon}
                </div>
                <div className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase py-0 px-2 h-5 border-slate-200 text-slate-500">{item.status}</Badge>
                      <Badge variant="secondary" className="text-[9px] font-bold uppercase py-0 px-1.5 h-4 bg-blue-100 text-blue-700 border-blue-200">DEMO</Badge>
                    </div>
                    <p className="text-sm text-slate-500 max-w-xl">{item.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
