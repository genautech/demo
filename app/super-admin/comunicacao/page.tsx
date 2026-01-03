"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PageContainer } from "@/components/page-container"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Megaphone,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import {
  getAdminBanner,
  updateAdminBanner,
  type AdminBanner,
} from "@/lib/storage"
import { toast } from "sonner"

const typeOptions = [
  { value: "info", label: "Informação", icon: Info },
  { value: "warning", label: "Aviso", icon: AlertTriangle },
  { value: "success", label: "Sucesso", icon: CheckCircle2 },
  { value: "promotion", label: "Promoção", icon: Megaphone },
] as const

export default function ComunicacaoPage() {
  const [banner, setBanner] = useState<AdminBanner | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadBanner()
  }, [])

  const loadBanner = () => {
    setIsLoading(true)
    const bannerData = getAdminBanner()
    setBanner(bannerData)
    setIsLoading(false)
  }

  const handleSave = () => {
    if (!banner) return

    setIsSaving(true)
    try {
      updateAdminBanner(banner)
      toast.success("Banner atualizado com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar banner")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = (checked: boolean) => {
    if (!banner) return
    setBanner({ ...banner, active: checked })
  }

  const handleFieldChange = (field: keyof AdminBanner, value: any) => {
    if (!banner) return
    setBanner({ ...banner, [field]: value })
  }

  const handlePreview = () => {
    if (!banner) return
    // Temporarily activate banner for preview
    const previewBanner = { ...banner, active: true }
    updateAdminBanner(previewBanner)
    toast.info("Banner ativado temporariamente para visualização. Recarregue a página para ver.")
    setTimeout(() => {
      // Restore original state after 5 seconds
      updateAdminBanner(banner)
    }, 5000)
  }

  if (isLoading || !banner) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunicação Yoobe</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie o banner de comunicação global exibido no topo da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePreview} variant="outline" className="gap-2">
            {banner.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Visualizar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Status do Banner
          </CardTitle>
          <CardDescription>Ative ou desative a exibição do banner</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="active" className="text-base font-medium">
                Banner Ativo
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {banner.active
                  ? "O banner está sendo exibido para todos os usuários"
                  : "O banner está desativado e não será exibido"}
              </p>
            </div>
            <Switch
              id="active"
              checked={banner.active}
              onCheckedChange={handleToggleActive}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Card */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Conteúdo do Banner</CardTitle>
          <CardDescription>Configure o título, mensagem e tipo de comunicação</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Comunicação</Label>
            <Select
              value={banner.type}
              onValueChange={(value) =>
                handleFieldChange("type", value as AdminBanner["type"])
              }
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={banner.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Ex: Bem-vindo à Yoobe!"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={banner.message}
              onChange={(e) => handleFieldChange("message", e.target.value)}
              placeholder="Digite a mensagem que será exibida no banner..."
              rows={4}
            />
          </div>

          {/* Background Image */}
          <div className="space-y-2">
            <Label htmlFor="backgroundImage">URL da Imagem de Fundo (Opcional)</Label>
            <Input
              id="backgroundImage"
              value={banner.backgroundImage || ""}
              onChange={(e) => handleFieldChange("backgroundImage", e.target.value || undefined)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <p className="text-xs text-muted-foreground">
              URL de uma imagem para usar como fundo do banner
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action Card */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Botão de Ação (CTA)</CardTitle>
          <CardDescription>
            Configure um botão de ação opcional no banner
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          {/* CTA Text */}
          <div className="space-y-2">
            <Label htmlFor="ctaText">Texto do Botão</Label>
            <Input
              id="ctaText"
              value={banner.ctaText || ""}
              onChange={(e) => handleFieldChange("ctaText", e.target.value || undefined)}
              placeholder="Ex: Saiba mais"
            />
          </div>

          {/* CTA Link */}
          <div className="space-y-2">
            <Label htmlFor="ctaLink">Link do Botão</Label>
            <Input
              id="ctaLink"
              value={banner.ctaLink || ""}
              onChange={(e) => handleFieldChange("ctaLink", e.target.value || undefined)}
              placeholder="/documentacao ou https://exemplo.com"
            />
            <p className="text-xs text-muted-foreground">
              Use um caminho relativo (ex: /documentacao) ou URL completa (ex: https://exemplo.com)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Opções adicionais de comportamento do banner</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dismissible" className="text-base font-medium">
                Permitir Fechamento
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {banner.dismissible
                  ? "Usuários podem fechar o banner (o fechamento será lembrado)"
                  : "Usuários não podem fechar o banner"}
              </p>
            </div>
            <Switch
              id="dismissible"
              checked={banner.dismissible}
              onCheckedChange={(checked) => handleFieldChange("dismissible", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {banner.active && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Visualização aproximada de como o banner aparecerá</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="border rounded-lg p-4 bg-muted/50">
              <div
                className={`
                  rounded-lg border p-4
                  ${
                    banner.type === "info"
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                      : banner.type === "warning"
                      ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                      : banner.type === "success"
                      ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                      : "bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {(() => {
                      const Icon = typeOptions.find((o) => o.value === banner.type)?.icon || Info
                      return <Icon className="h-5 w-5" />
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    {banner.title && (
                      <h3 className="font-semibold text-sm mb-1">{banner.title}</h3>
                    )}
                    <p className="text-sm leading-relaxed">{banner.message}</p>
                    {banner.ctaText && (
                      <div className="mt-3">
                        <Button size="sm">{banner.ctaText}</Button>
                      </div>
                    )}
                  </div>
                  {banner.dismissible && (
                    <div className="flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
