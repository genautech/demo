"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Palette,
  Moon,
  Sun,
  Sparkles,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  Trophy,
  Upload,
  Zap,
  Image as ImageIcon,
} from "lucide-react"
import {
  getCompanyAppearance,
  saveCompanyAppearance,
  getStoreAppearance,
  saveStoreAppearance,
  getStoresByCompany,
  getCompanyAchievements,
  saveCompanyAchievements,
  LEVEL_CONFIG,
  DEFAULT_GAMIFICATION_SETTINGS,
  DEFAULT_FUN_MODE_SETTINGS,
  getAvailableFunPalettes,
  type CompanyAppearance,
  type StoreAppearance,
  type GamificationSettings,
  type BadgeStyle,
  type UserLevel,
  type LevelCustomization,
  type CompanyAchievement,
} from "@/lib/storage"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { UserStats } from "@/components/gamification/UserStats"
import { cn } from "@/lib/utils"

const BADGE_STYLE_OPTIONS: { value: BadgeStyle; label: string; description: string }[] = [
  { value: "default", label: "Padrão", description: "Estilo moderno com bordas suaves e gradientes" },
  { value: "minimal", label: "Minimalista", description: "Design limpo e discreto" },
  { value: "glass", label: "Glass", description: "Efeito vidro fosco com transparência" },
  { value: "corporate", label: "Corporativo", description: "Profissional com alto contraste" },
  { value: "fun", label: "Divertido", description: "Gradientes vibrantes e animações" },
]

const LEVEL_ORDER: UserLevel[] = ["bronze", "silver", "gold", "platinum", "diamond"]

const DEFAULT_LEVEL_ICONS: Record<UserLevel, string> = {
  bronze: "🏆",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
  diamond: "👑",
}

export default function AppearancePage() {
  const { setTheme } = useTheme()
  const [companyId, setCompanyId] = useState("company_1")
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [stores, setStores] = useState<any[]>([])
  const [appearance, setAppearance] = useState<CompanyAppearance | null>(null)
  const [storeAppearance, setStoreAppearance] = useState<StoreAppearance | null>(null)
  const [isEditingStore, setIsEditingStore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])
  
  // Scroll to hash section on load
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "")
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 500) // Wait for page to load
    }
  }, [isLoading])

  const loadData = () => {
    setIsLoading(true)
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        const cId = auth.companyId || "company_1"
        setCompanyId(cId)

        const companyAppearance = getCompanyAppearance(cId)
        setAppearance(companyAppearance)

        const companyStores = getStoresByCompany(cId)
        setStores(companyStores)
      } catch (e) {
        console.error("Erro ao carregar dados:", e)
      }
    }
    setIsLoading(false)
  }

  const handleSelectStore = (storeId: string | null) => {
    setSelectedStoreId(storeId)
    setIsEditingStore(storeId !== null)
    if (storeId && appearance) {
      const storeApp = getStoreAppearance(storeId, companyId)
      setStoreAppearance(storeApp || null)
    } else {
      setStoreAppearance(null)
    }
  }

  const handleApplyPreset = (theme: "light" | "dark" | "fun") => {
    if (!appearance) return

    const updated = {
      ...appearance,
      theme,
      updatedAt: new Date().toISOString(),
    }

    if (isEditingStore && selectedStoreId && storeAppearance) {
      const updatedStore: StoreAppearance = {
        ...storeAppearance,
        theme,
        updatedAt: new Date().toISOString(),
      }
      setStoreAppearance(updatedStore)
    } else {
      setAppearance(updated)
    }

    setTheme(theme)
    toast.success(`Tema ${theme} aplicado!`)
  }

  const handleSave = () => {
    if (!appearance) return

    setIsSaving(true)
    try {
      if (isEditingStore && selectedStoreId && storeAppearance) {
        saveStoreAppearance(storeAppearance)
        toast.success("Aparência da loja salva com sucesso!")
      } else {
        saveCompanyAppearance(appearance)
        toast.success("Aparência da empresa salva com sucesso!")
      }

      // Disparar evento para reaplicar aparência
      window.dispatchEvent(new Event("appearance-updated"))
    } catch (error) {
      toast.error("Erro ao salvar aparência")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    if (!appearance) return

    const updated = {
      ...appearance,
      sections: {
        ...appearance.sections,
        [sectionId]: {
          ...appearance.sections[sectionId],
          enabled,
        },
      },
      updatedAt: new Date().toISOString(),
    }

    if (isEditingStore && selectedStoreId && storeAppearance) {
      const updatedStore: StoreAppearance = {
        ...storeAppearance,
        sections: {
          ...(storeAppearance.sections || {}),
          [sectionId]: {
            enabled,
          },
        },
        updatedAt: new Date().toISOString(),
      }
      setStoreAppearance(updatedStore)
    } else {
      setAppearance(updated)
    }
  }

  const handleSectionMove = (sectionId: string, direction: "up" | "down") => {
    if (!appearance) return

    const currentOrder = [...appearance.sectionOrder]
    const index = currentOrder.indexOf(sectionId)
    if (index === -1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= currentOrder.length) return

    ;[currentOrder[index], currentOrder[newIndex]] = [currentOrder[newIndex], currentOrder[index]]

    const updated = {
      ...appearance,
      sectionOrder: currentOrder,
      updatedAt: new Date().toISOString(),
    }

    if (isEditingStore && selectedStoreId && storeAppearance) {
      const updatedStore: StoreAppearance = {
        ...storeAppearance,
        sectionOrder: currentOrder,
        updatedAt: new Date().toISOString(),
      }
      setStoreAppearance(updatedStore)
    } else {
      setAppearance(updated)
    }
  }

  const handleSectionUpdate = (sectionId: string, field: string, value: any) => {
    if (!appearance) return

    const updated = {
      ...appearance,
      sections: {
        ...appearance.sections,
        [sectionId]: {
          ...appearance.sections[sectionId],
          [field]: value,
        },
      },
      updatedAt: new Date().toISOString(),
    }

    if (isEditingStore && selectedStoreId && storeAppearance) {
      const updatedStore: StoreAppearance = {
        ...storeAppearance,
        sections: {
          ...(storeAppearance.sections || {}),
          [sectionId]: {
            ...(storeAppearance.sections?.[sectionId] || {}),
            [field]: value,
          },
        },
        updatedAt: new Date().toISOString(),
      }
      setStoreAppearance(updatedStore)
    } else {
      setAppearance(updated)
    }
  }

  const handleColorChange = (colorKey: string, value: string) => {
    if (!appearance) return

    const updated = {
      ...appearance,
      colors: {
        ...appearance.colors,
        [colorKey]: value,
      },
      updatedAt: new Date().toISOString(),
    }

    if (isEditingStore && selectedStoreId && storeAppearance) {
      const updatedStore: StoreAppearance = {
        ...storeAppearance,
        colors: {
          ...(storeAppearance.colors || {}),
          [colorKey]: value,
        },
        updatedAt: new Date().toISOString(),
      }
      setStoreAppearance(updatedStore)
    } else {
      setAppearance(updated)
    }
  }

  const handleGamificationChange = (key: keyof GamificationSettings, value: any) => {
    if (!appearance) return

    const currentGamification = appearance.gamification || DEFAULT_GAMIFICATION_SETTINGS
    const updated = {
      ...appearance,
      gamification: {
        ...currentGamification,
        [key]: value,
      },
      updatedAt: new Date().toISOString(),
    }

    setAppearance(updated)
  }

  const handleLevelCustomization = (level: UserLevel, field: keyof LevelCustomization, value: string | number | undefined) => {
    if (!appearance) return

    const currentGamification = appearance.gamification || DEFAULT_GAMIFICATION_SETTINGS
    const currentCustomizations = currentGamification.levelCustomizations || {}
    const currentLevelCustom = currentCustomizations[level] || {}

    // If value is empty/undefined, remove the field
    const hasValue = value !== undefined && value !== "" && value !== null
    const updatedLevelCustom = hasValue
      ? { ...currentLevelCustom, [field]: value }
      : Object.fromEntries(
          Object.entries(currentLevelCustom).filter(([k]) => k !== field)
        )

    // If all fields are empty, remove the level customization
    const hasValues = Object.values(updatedLevelCustom).some((v) => v !== undefined && v !== "" && v !== null)

    const updatedCustomizations = hasValues
      ? { ...currentCustomizations, [level]: updatedLevelCustom }
      : Object.fromEntries(
          Object.entries(currentCustomizations).filter(([k]) => k !== level)
        )

    const updated = {
      ...appearance,
      gamification: {
        ...currentGamification,
        levelCustomizations: updatedCustomizations,
      },
      updatedAt: new Date().toISOString(),
    }

    setAppearance(updated)
  }


  if (isLoading || !appearance) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    )
  }

  const currentAppearance = isEditingStore && storeAppearance ? storeAppearance : appearance
  const effectiveTheme = (isEditingStore && storeAppearance?.theme) || appearance.theme
  const effectiveColors = isEditingStore && storeAppearance?.colors
    ? { ...appearance.colors, ...storeAppearance.colors }
    : appearance.colors

  return (
    <PageContainer className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Palette className="h-8 w-8 text-primary" />
            Aparência da Loja
          </h1>
          <p className="mt-2 text-muted-foreground">
            Personalize o tema, cores e seções da loja do cliente
          </p>
        </div>
        <div className="flex gap-2">
          {stores.length > 0 && (
            <select
              value={selectedStoreId || ""}
              onChange={(e) => handleSelectStore(e.target.value || null)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Empresa (padrão)</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {isEditingStore && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Editando loja específica:</strong> As alterações aqui sobrescreverão as configurações padrão da empresa.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="theme" className="w-full">
        <TabsList>
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="fun-mode" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Fun Mode
          </TabsTrigger>
          <TabsTrigger value="sections">Seções</TabsTrigger>
          <TabsTrigger value="gamification" className="gap-2">
            <Trophy className="h-4 w-4" />
            Gamificação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Presets de Tema</CardTitle>
              <CardDescription>Escolha um tema pré-configurado para a loja</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    effectiveTheme === "light" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleApplyPreset("light")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Sun className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold">Light</h3>
                    </div>
                    <div className="h-24 rounded-lg bg-gradient-to-br from-white to-gray-100 border-2 border-gray-200"></div>
                    <p className="text-sm text-muted-foreground mt-4">Tema claro e limpo</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    effectiveTheme === "dark" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleApplyPreset("dark")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Moon className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold">Dark</h3>
                    </div>
                    <div className="h-24 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700"></div>
                    <p className="text-sm text-muted-foreground mt-4">Tema escuro moderno</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    effectiveTheme === "fun" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleApplyPreset("fun")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold">Fun</h3>
                    </div>
                    <div className="h-24 rounded-lg bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 border-2 border-purple-300"></div>
                    <p className="text-sm text-muted-foreground mt-4">Tema colorido e animado</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paleta de Cores</CardTitle>
              <CardDescription>Personalize as cores principais da loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={effectiveColors.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={effectiveColors.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      placeholder="#10b981"
                    />
                  </div>
                  <div
                    className="h-12 rounded-lg border"
                    style={{ backgroundColor: effectiveColors.primary }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={effectiveColors.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={effectiveColors.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      placeholder="#059669"
                    />
                  </div>
                  <div
                    className="h-12 rounded-lg border"
                    style={{ backgroundColor: effectiveColors.secondary }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fun-mode" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Configurações do Fun Mode
              </CardTitle>
              <CardDescription>
                Escolha uma paleta de cores para o modo divertido. Clique em "Salvar" para aplicar as mudanças.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Palette Selection */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Escolha uma Paleta
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {getAvailableFunPalettes().map((palette) => {
                    const currentPalette = appearance.funSettings?.selectedPaletteId || "violet-cyan"
                    const isSelected = currentPalette === palette.id
                    return (
                      <div
                        key={palette.id}
                        onClick={() => {
                          const updated = {
                            ...appearance,
                            funSettings: {
                              ...(appearance.funSettings || DEFAULT_FUN_MODE_SETTINGS),
                              selectedPaletteId: palette.id,
                              primaryColor: palette.primaryColor,
                              secondaryColor: palette.secondaryColor,
                              accentColor: palette.accentColor,
                            },
                            updatedAt: new Date().toISOString(),
                          }
                          setAppearance(updated)
                        }}
                        className={cn(
                          "cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-lg",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{palette.name}</span>
                            {isSelected && (
                              <Badge variant="default" className="text-[10px]">Selecionada</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{palette.description}</p>
                          <div className="flex gap-1 h-10 rounded-lg overflow-hidden shadow-inner">
                            <div className="flex-1" style={{ backgroundColor: palette.primaryColor }} />
                            <div className="flex-1" style={{ backgroundColor: palette.secondaryColor }} />
                            <div className="flex-1" style={{ backgroundColor: palette.accentColor }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Preview
              </CardTitle>
              <CardDescription>
                Visualização das cores selecionadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Primária</Label>
                  <div
                    className="h-16 rounded-lg flex items-center justify-center text-white font-medium shadow-md"
                    style={{ backgroundColor: appearance.funSettings?.primaryColor || DEFAULT_FUN_MODE_SETTINGS.primaryColor }}
                  >
                    {appearance.funSettings?.primaryColor || DEFAULT_FUN_MODE_SETTINGS.primaryColor}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Secundária</Label>
                  <div
                    className="h-16 rounded-lg flex items-center justify-center text-white font-medium shadow-md"
                    style={{ backgroundColor: appearance.funSettings?.secondaryColor || DEFAULT_FUN_MODE_SETTINGS.secondaryColor }}
                  >
                    {appearance.funSettings?.secondaryColor || DEFAULT_FUN_MODE_SETTINGS.secondaryColor}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Destaque</Label>
                  <div
                    className="h-16 rounded-lg flex items-center justify-center text-white font-medium shadow-md"
                    style={{ backgroundColor: appearance.funSettings?.accentColor || DEFAULT_FUN_MODE_SETTINGS.accentColor }}
                  >
                    {appearance.funSettings?.accentColor || DEFAULT_FUN_MODE_SETTINGS.accentColor}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seções da Loja</CardTitle>
              <CardDescription>Configure quais seções aparecem e em que ordem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appearance.sectionOrder.map((sectionId, index) => {
                  const section = appearance.sections[sectionId]
                  if (!section) return null

                  const isEnabled = isEditingStore && storeAppearance?.sections?.[sectionId]
                    ? storeAppearance.sections[sectionId].enabled !== undefined
      ? storeAppearance.sections[sectionId].enabled
      : section.enabled
                    : section.enabled

                  return (
                    <Card key={sectionId} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">{index + 1}</Badge>
                                <h3 className="font-semibold">{section.title || sectionId}</h3>
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={(checked) => handleSectionToggle(sectionId, checked)}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSectionMove(sectionId, "up")}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSectionMove(sectionId, "down")}
                                  disabled={index === appearance.sectionOrder.length - 1}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`${sectionId}-title`}>Título</Label>
                                <Input
                                  id={`${sectionId}-title`}
                                  value={section.title || ""}
                                  onChange={(e) => handleSectionUpdate(sectionId, "title", e.target.value)}
                                  placeholder="Título da seção"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`${sectionId}-subtitle`}>Subtítulo</Label>
                                <Input
                                  id={`${sectionId}-subtitle`}
                                  value={section.subtitle || ""}
                                  onChange={(e) => handleSectionUpdate(sectionId, "subtitle", e.target.value)}
                                  placeholder="Subtítulo da seção"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-6">
          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Configurações de Gamificação
              </CardTitle>
              <CardDescription>
                Controle como o sistema de níveis e badges é exibido para os membros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Ativar Gamificação</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir sistema de níveis, badges e progresso na plataforma
                  </p>
                </div>
                <Switch
                  checked={appearance.gamification?.enabled ?? true}
                  onCheckedChange={(checked) => handleGamificationChange("enabled", checked)}
                />
              </div>

              {appearance.gamification?.enabled !== false && (
                <>
                  {/* Visibility Settings */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Exibir para Membros</Label>
                        <p className="text-xs text-muted-foreground">
                          Mostrar badge de nível para usuários membros
                        </p>
                      </div>
                      <Switch
                        checked={appearance.gamification?.showBadgeForMembers ?? true}
                        onCheckedChange={(checked) => handleGamificationChange("showBadgeForMembers", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Exibir na Loja</Label>
                        <p className="text-xs text-muted-foreground">
                          Mostrar badge de nível na área da loja
                        </p>
                      </div>
                      <Switch
                        checked={appearance.gamification?.showBadgeInStore ?? true}
                        onCheckedChange={(checked) => handleGamificationChange("showBadgeInStore", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Barra de Progresso</Label>
                        <p className="text-xs text-muted-foreground">
                          Mostrar progresso até o próximo nível
                        </p>
                      </div>
                      <Switch
                        checked={appearance.gamification?.showProgressBar ?? true}
                        onCheckedChange={(checked) => handleGamificationChange("showProgressBar", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label className="font-medium">Saldo de Pontos</Label>
                        <p className="text-xs text-muted-foreground">
                          Exibir saldo de pontos no badge
                        </p>
                      </div>
                      <Switch
                        checked={appearance.gamification?.showPointsBalance ?? true}
                        onCheckedChange={(checked) => handleGamificationChange("showPointsBalance", checked)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Badge Style Selector */}
          {appearance.gamification?.enabled !== false && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Estilo do Badge
                </CardTitle>
                <CardDescription>
                  Escolha como o badge de nível será exibido visualmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {BADGE_STYLE_OPTIONS.map((style) => (
                    <Card
                      key={style.value}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        appearance.gamification?.badgeStyle === style.value
                          ? "ring-2 ring-primary border-primary"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => handleGamificationChange("badgeStyle", style.value)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{style.label}</h4>
                            {appearance.gamification?.badgeStyle === style.value && (
                              <Badge variant="default" className="text-[10px] px-1.5">
                                Ativo
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {style.description}
                          </p>
                          {/* Mini preview */}
                          <div className={cn(
                            "h-12 rounded-lg flex items-center justify-center gap-2 text-xs",
                            style.value === "default" && "bg-gradient-to-r from-card to-card/95 border-2 border-primary/20",
                            style.value === "minimal" && "bg-card/50 border border-border/50",
                            style.value === "glass" && "bg-white/10 backdrop-blur border border-white/20",
                            style.value === "corporate" && "bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700",
                            style.value === "fun" && "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 border-2 border-purple-400/40"
                          )}>
                            <div
                              className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: LEVEL_CONFIG.gold.color }}
                            >
                              🥇
                            </div>
                            <span className="font-bold">Ouro</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Level Customization */}
          {appearance.gamification?.enabled !== false && (
            <Card id="gamificacao">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Personalização de Níveis
                </CardTitle>
                <CardDescription>
                  Customize ícones, nomes, cores, pontos mínimos e multiplicadores para cada nível. Deixe em branco para usar os padrões.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LEVEL_ORDER.map((level) => {
                    const config = LEVEL_CONFIG[level]
                    const customization = appearance.gamification?.levelCustomizations?.[level] || {}
                    
                    return (
                      <Card key={level} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Level Preview */}
                            <div
                              className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                              style={{ backgroundColor: customization.customColor || config.color }}
                            >
                              {customization.customIcon?.startsWith("http") ? (
                                <img 
                                  src={customization.customIcon} 
                                  alt={level} 
                                  className="h-8 w-8 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                  }}
                                />
                              ) : (
                                customization.customIcon || DEFAULT_LEVEL_ICONS[level]
                              )}
                            </div>

                            <div className="flex-1 space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">{customization.customLabel || config.label}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    A partir de {(customization.customMinPoints ?? config.minPoints).toLocaleString("pt-BR")} pontos • Multiplicador {(customization.customMultiplier ?? config.multiplier)}x
                                  </p>
                                </div>
                                <Badge 
                                  variant="outline"
                                  style={{ borderColor: config.color, color: config.color }}
                                >
                                  {level.toUpperCase()}
                                </Badge>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                                <div className="space-y-2">
                                  <Label htmlFor={`${level}-icon`} className="text-xs">
                                    Ícone (emoji ou URL)
                                  </Label>
                                  <Input
                                    id={`${level}-icon`}
                                    value={customization.customIcon || ""}
                                    onChange={(e) => handleLevelCustomization(level, "customIcon", e.target.value)}
                                    placeholder={DEFAULT_LEVEL_ICONS[level]}
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`${level}-label`} className="text-xs">
                                    Nome Personalizado
                                  </Label>
                                  <Input
                                    id={`${level}-label`}
                                    value={customization.customLabel || ""}
                                    onChange={(e) => handleLevelCustomization(level, "customLabel", e.target.value)}
                                    placeholder={config.label}
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`${level}-color`} className="text-xs">
                                    Cor Personalizada
                                  </Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id={`${level}-color`}
                                      type="color"
                                      value={customization.customColor || config.color}
                                      onChange={(e) => handleLevelCustomization(level, "customColor", e.target.value)}
                                      className="w-12 h-9 p-1"
                                    />
                                    <Input
                                      value={customization.customColor || ""}
                                      onChange={(e) => handleLevelCustomization(level, "customColor", e.target.value)}
                                      placeholder={config.color}
                                      className="h-9 flex-1"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`${level}-minPoints`} className="text-xs">
                                    Pontos Mínimos
                                  </Label>
                                  <Input
                                    id={`${level}-minPoints`}
                                    type="number"
                                    value={customization.customMinPoints ?? ""}
                                    onChange={(e) => {
                                      const value = e.target.value === "" ? undefined : parseInt(e.target.value)
                                      handleLevelCustomization(level, "customMinPoints", value)
                                    }}
                                    placeholder={config.minPoints.toString()}
                                    className="h-9"
                                    disabled={level === "bronze"}
                                    min={0}
                                  />
                                  {level === "bronze" && (
                                    <p className="text-[10px] text-muted-foreground">Bronze sempre começa em 0</p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`${level}-multiplier`} className="text-xs">
                                    Multiplicador
                                  </Label>
                                  <Input
                                    id={`${level}-multiplier`}
                                    type="number"
                                    step="0.05"
                                    value={customization.customMultiplier ?? ""}
                                    onChange={(e) => {
                                      const value = e.target.value === "" ? undefined : parseFloat(e.target.value)
                                      handleLevelCustomization(level, "customMultiplier", value)
                                    }}
                                    placeholder={config.multiplier.toString()}
                                    className="h-9"
                                    min={1}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Reset Button */}
                <div className="mt-6 pt-4 border-t flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!appearance) return
                      const updated = {
                        ...appearance,
                        gamification: {
                          ...(appearance.gamification || DEFAULT_GAMIFICATION_SETTINGS),
                          levelCustomizations: {},
                        },
                        updatedAt: new Date().toISOString(),
                      }
                      setAppearance(updated)
                      toast.success("Personalizações de níveis redefinidas!")
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Redefinir para Padrão
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Preview */}
          {appearance.gamification?.enabled !== false && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Preview ao Vivo
                </CardTitle>
                <CardDescription>
                  Visualize como o badge aparecerá para os usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Versão Compacta (Header)</Label>
                    <div className="p-4 rounded-lg border-2 bg-muted/30">
                      <UserStats compact forceStyle={appearance.gamification?.badgeStyle || "default"} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Versão Expandida (Dashboard)</Label>
                    <div className="p-4 rounded-lg border-2 bg-muted/30">
                      <UserStats forceStyle={appearance.gamification?.badgeStyle || "default"} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
