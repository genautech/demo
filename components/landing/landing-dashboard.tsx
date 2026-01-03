"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, ExternalLink, TrendingUp, Users, Sparkles } from "lucide-react"
import {
  getLandingPages,
  type LandingPage,
} from "@/lib/storage"
import Link from "next/link"

interface LandingDashboardProps {
  companyId: string
}

export function LandingDashboard({ companyId }: LandingDashboardProps) {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [activePages, setActivePages] = useState<LandingPage[]>([])
  const [latestPage, setLatestPage] = useState<LandingPage | null>(null)

  useEffect(() => {
    const pages = getLandingPages(companyId)
    setLandingPages(pages)
    
    const active = pages.filter(p => p.isActive)
    setActivePages(active)
    
    if (active.length > 0) {
      const latest = active.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0]
      setLatestPage(latest)
    } else {
      setLatestPage(null)
    }
  }, [companyId])

  const totalProducts = landingPages.reduce((sum, page) => sum + (page.productIds?.length || 0), 0)

  // Se não houver landing pages ativas, mostrar card de CTA
  if (activePages.length === 0) {
    return (
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Landing Pages
          </CardTitle>
          <CardDescription>
            Crie páginas customizáveis para onboarding e campanhas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Landing Pages</strong> são páginas super customizáveis que você pode usar para:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-2">
              <li><strong>Onboarding:</strong> Dar boas-vindas a novos colaboradores com um kit especial</li>
              <li><strong>Campanhas:</strong> Criar hotsites para eventos, promoções ou ações específicas</li>
              <li><strong>Hotsites:</strong> Qualquer outra coisa que você imaginar!</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Você pode customizar cores, textos, produtos em destaque e até atribuir tags automaticamente aos usuários que acessarem!
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/gestor/landing-pages">
              <Plus className="h-4 w-4 mr-2" />
              Criar Minha Primeira Landing Page
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Se houver landing pages ativas, mostrar estatísticas e atalhos
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Landing Pages
            </CardTitle>
            <CardDescription>
              Gerencie suas páginas de onboarding e campanhas
            </CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/gestor/landing-pages">
              <Plus className="h-4 w-4 mr-2" />
              Nova
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas Rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{landingPages.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activePages.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Ativas</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalProducts}</div>
            <div className="text-xs text-muted-foreground mt-1">Produtos</div>
          </div>
        </div>

        {/* Última Landing Page */}
        {latestPage && (
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-sm">{latestPage.title}</p>
                <p className="text-xs text-muted-foreground">
                  {latestPage.type === "onboarding" ? "Onboarding" : "Campanha"}
                </p>
              </div>
              <Badge variant={latestPage.isActive ? "default" : "secondary"} className="text-xs">
                {latestPage.isActive ? "Ativa" : "Inativa"}
              </Badge>
            </div>
            <div className="flex gap-2 mt-3">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/landing/${latestPage.slug}`} target="_blank">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Ver
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/gestor/landing-pages">
                  Gerenciar
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Atalho Rápido */}
        <Button asChild variant="outline" className="w-full">
          <Link href="/gestor/landing-pages">
            <FileText className="h-4 w-4 mr-2" />
            Ver Todas as Landing Pages
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
