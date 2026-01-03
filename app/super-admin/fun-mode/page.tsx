"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Sparkles, Save, Check, RefreshCw, Palette, Shield } from "lucide-react"
import {
  FUN_COLOR_PALETTES,
  getGlobalFunModeConfig,
  saveGlobalFunModeConfig,
  DEFAULT_GLOBAL_FUN_CONFIG,
  type GlobalFunModeConfig,
  type FunColorPalette,
} from "@/lib/storage"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SuperAdminFunModePage() {
  const [config, setConfig] = useState<GlobalFunModeConfig>(DEFAULT_GLOBAL_FUN_CONFIG)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = () => {
    setIsLoading(true)
    const currentConfig = getGlobalFunModeConfig()
    setConfig(currentConfig)
    setIsLoading(false)
  }

  const handleSave = () => {
    setIsSaving(true)
    try {
      saveGlobalFunModeConfig(config)
      toast.success("Configurações do Fun Mode salvas com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar configurações")
    } finally {
      setIsSaving(false)
    }
  }

  const togglePalette = (paletteId: string) => {
    const isEnabled = config.availablePaletteIds.includes(paletteId)
    let newPaletteIds: string[]

    if (isEnabled) {
      // Don't allow removing the last palette
      if (config.availablePaletteIds.length <= 1) {
        toast.error("Pelo menos uma paleta deve estar disponível")
        return
      }
      newPaletteIds = config.availablePaletteIds.filter(id => id !== paletteId)
      
      // If removing the default palette, set a new default
      if (config.defaultPaletteId === paletteId) {
        setConfig({
          ...config,
          availablePaletteIds: newPaletteIds,
          defaultPaletteId: newPaletteIds[0],
        })
        return
      }
    } else {
      newPaletteIds = [...config.availablePaletteIds, paletteId]
    }

    setConfig({
      ...config,
      availablePaletteIds: newPaletteIds,
    })
  }

  const setDefaultPalette = (paletteId: string) => {
    if (!config.availablePaletteIds.includes(paletteId)) {
      // First enable the palette if not enabled
      setConfig({
        ...config,
        availablePaletteIds: [...config.availablePaletteIds, paletteId],
        defaultPaletteId: paletteId,
      })
    } else {
      setConfig({
        ...config,
        defaultPaletteId: paletteId,
      })
    }
  }

  const handleReset = () => {
    setConfig(DEFAULT_GLOBAL_FUN_CONFIG)
    toast.success("Configurações redefinidas para o padrão!")
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Configurações Fun Mode
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie quais paletas de cores e recursos do Fun Mode estão disponíveis para gestores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Redefinir
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Configurações Globais
          </CardTitle>
          <CardDescription>
            Controle as opções disponíveis para todos os gestores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-muted/30">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Permitir Cores Personalizadas</Label>
              <p className="text-sm text-muted-foreground">
                Permite que gestores ajustem cores individualmente além das paletas
              </p>
            </div>
            <Switch
              checked={config.allowCustomColors}
              onCheckedChange={(checked) => setConfig({ ...config, allowCustomColors: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Palette Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Paletas Disponíveis
          </CardTitle>
          <CardDescription>
            Selecione quais paletas de cores estarão disponíveis para os gestores escolherem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FUN_COLOR_PALETTES.map((palette) => {
              const isEnabled = config.availablePaletteIds.includes(palette.id)
              const isDefault = config.defaultPaletteId === palette.id

              return (
                <Card
                  key={palette.id}
                  className={cn(
                    "transition-all",
                    isEnabled
                      ? "ring-2 ring-primary/50 border-primary/50"
                      : "opacity-60 hover:opacity-80"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{palette.name}</h4>
                        <div className="flex items-center gap-1">
                          {isDefault && (
                            <Badge variant="default" className="text-[10px] px-1.5">
                              Padrão
                            </Badge>
                          )}
                          {isEnabled && !isDefault && (
                            <Badge variant="outline" className="text-[10px] px-1.5">
                              Ativo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed min-h-[32px]">
                        {palette.description}
                      </p>
                      
                      {/* Color Preview */}
                      <div className="flex gap-1 h-10 rounded-lg overflow-hidden shadow-inner">
                        {palette.preview.map((color, idx) => (
                          <div
                            key={idx}
                            className="flex-1"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant={isEnabled ? "default" : "outline"}
                          className="flex-1 h-8 text-xs"
                          onClick={() => togglePalette(palette.id)}
                        >
                          {isEnabled ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Ativa
                            </>
                          ) : (
                            "Ativar"
                          )}
                        </Button>
                        {isEnabled && !isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() => setDefaultPalette(palette.id)}
                          >
                            Definir Padrão
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/30 border">
              <p className="text-sm text-muted-foreground">Paletas Ativas</p>
              <p className="text-2xl font-bold">
                {config.availablePaletteIds.length} de {FUN_COLOR_PALETTES.length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border">
              <p className="text-sm text-muted-foreground">Paleta Padrão</p>
              <p className="text-lg font-bold">
                {FUN_COLOR_PALETTES.find(p => p.id === config.defaultPaletteId)?.name || "N/A"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border">
              <p className="text-sm text-muted-foreground">Cores Personalizadas</p>
              <p className="text-lg font-bold">
                {config.allowCustomColors ? "Permitido" : "Bloqueado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
