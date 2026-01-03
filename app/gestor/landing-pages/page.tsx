"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Palette,
} from "lucide-react"
import {
  getLandingPages,
  saveLandingPage,
  deleteLandingPage,
  type LandingPage,
} from "@/lib/storage"
import { toast } from "sonner"

export default function LandingPagesPage() {
  const router = useRouter()
  const [companyId, setCompanyId] = useState("company_1")
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        const cId = auth.companyId || "company_1"
        setCompanyId(cId)
        
        const pages = getLandingPages(cId)
        setLandingPages(pages)
      } catch (e) {
        console.error("Erro ao carregar dados:", e)
      }
    }
  }

  const handleDelete = (pageId: string) => {
    if (confirm("Tem certeza que deseja excluir esta landing page?")) {
      deleteLandingPage(companyId, pageId)
      toast.success("Landing page excluída!")
      loadData()
    }
  }

  const handleCopyUrl = (slug: string) => {
    const url = `${window.location.origin}/landing/${slug}`
    navigator.clipboard.writeText(url)
    toast.success("URL copiada!")
  }

  const handleDuplicate = (page: LandingPage) => {
    const duplicatedPage: LandingPage = {
      ...page,
      id: `lp_${Date.now()}`,
      title: `${page.title} (Cópia)`,
      slug: `${page.slug}-copia-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveLandingPage(duplicatedPage)
    toast.success("Landing page duplicada!")
    loadData()
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Landing Pages
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie landing pages customizáveis para onboarding e campanhas
          </p>
        </div>
        <Button 
          onClick={() => router.push('/gestor/landing-pages/new')} 
          data-tour="import-button"
          size="lg"
          className="gap-2"
        >
          <Plus className="h-5 w-5" />
          Nova Landing Page
        </Button>
      </div>

      {landingPages.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma landing page criada</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Crie sua primeira landing page para começar a personalizar a experiência dos seus usuários.
            </p>
            <Button 
              onClick={() => router.push('/gestor/landing-pages/new')} 
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Criar Landing Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {landingPages.map((page) => (
            <Card 
              key={page.id} 
              className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold truncate">{page.title}</h3>
                      <Badge variant={page.type === "onboarding" ? "default" : "secondary"}>
                        {page.type === "onboarding" ? "Onboarding" : "Campanha"}
                      </Badge>
                      {page.isActive ? (
                        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          Inativa
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {page.welcomeMessage || page.welcomeTitle}
                    </p>

                    {/* URL */}
                    <p className="text-xs text-muted-foreground font-mono mb-4 flex items-center gap-1">
                      <span className="opacity-60">URL:</span>
                      <span className="text-primary">/landing/{page.slug}</span>
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyUrl(page.slug)}
                        className="gap-1.5"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copiar URL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/landing/${page.slug}`, "_blank")}
                        className="gap-1.5"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Visualizar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/gestor/landing-pages/${page.id}/edit`)}
                        className="gap-1.5"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(page)}
                        className="gap-1.5"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Duplicar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(page.id)}
                        className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Excluir
                      </Button>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="hidden sm:flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-xl border-2 border-white shadow-md transition-transform hover:scale-110" 
                        style={{ backgroundColor: page.primaryColor }}
                        title="Cor primária"
                      />
                      <div 
                        className="w-10 h-10 rounded-xl border-2 border-white shadow-md transition-transform hover:scale-110" 
                        style={{ backgroundColor: page.secondaryColor }}
                        title="Cor secundária"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Palette className="h-3 w-3" />
                      Cores
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
