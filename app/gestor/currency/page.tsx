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
  Coins, 
  Sparkles, 
  Save, 
  Eye, 
  Palette,
  Type,
  Zap,
  TrendingUp,
  Trophy,
  Bell,
  BarChart3,
  Settings2,
  Percent,
  CreditCard,
} from "lucide-react"
import { 
  getStoreSettings, 
  saveStoreSettings,
  getCompanyById,
  updateCompany,
  type StoreSettings,
} from "@/lib/storage"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const EMOJI_OPTIONS = ["⚡", "💎", "🌟", "⭐", "🔥", "💰", "🎯", "🏆", "✨", "🚀", "💫", "🎁"]
const SYMBOL_OPTIONS = ["₿", "★", "◆", "●", "♦", "⬢", "◉", "◈", "✦", "⟐"]

const COLOR_PRESETS = [
  { name: "Ouro", primary: "#FFD700", secondary: "#FFA500" },
  { name: "Esmeralda", primary: "#10b981", secondary: "#059669" },
  { name: "Safira", primary: "#3b82f6", secondary: "#1d4ed8" },
  { name: "Rubi", primary: "#ef4444", secondary: "#dc2626" },
  { name: "Ametista", primary: "#8b5cf6", secondary: "#7c3aed" },
  { name: "Diamante", primary: "#06b6d4", secondary: "#0891b2" },
]

const BADGE_TYPES = [
  { id: 'gold' as const, name: 'Ouro', colors: { primary: '#FFD700', secondary: '#FFA500' }, icon: '🥇' },
  { id: 'silver' as const, name: 'Prata', colors: { primary: '#C0C0C0', secondary: '#A0A0A0' }, icon: '🥈' },
  { id: 'bronze' as const, name: 'Bronze', colors: { primary: '#CD7F32', secondary: '#8B4513' }, icon: '🥉' },
  { id: 'custom' as const, name: 'Personalizado', colors: { primary: '#8b5cf6', secondary: '#7c3aed' }, icon: '✨' },
]

export default function GamificationPage() {
  const [companyId, setCompanyId] = useState("company_1")
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("moeda")
  
  // Form state - Moeda
  const [currencyName, setCurrencyName] = useState("")
  const [currencyPlural, setCurrencyPlural] = useState("")
  const [currencyAbbreviation, setCurrencyAbbreviation] = useState("")
  const [currencySymbol, setCurrencySymbol] = useState("")
  const [currencyIcon, setCurrencyIcon] = useState("")
  
  // Form state - Aparência
  const [primaryColor, setPrimaryColor] = useState("#FFD700")
  const [secondaryColor, setSecondaryColor] = useState("#FFA500")
  const [badgesEnabled, setBadgesEnabled] = useState(true)
  const [badgeType, setBadgeType] = useState<'gold' | 'silver' | 'bronze' | 'custom'>('gold')
  
  // Form state - Engajamento
  const [showDashboard, setShowDashboard] = useState(true)
  const [showRankings, setShowRankings] = useState(true)
  const [showTicker, setShowTicker] = useState(true)
  const [celebrateAchievements, setCelebrateAchievements] = useState(true)
  
  // Form state - Regras
  const [pointsMultiplier, setPointsMultiplier] = useState(1.0)
  const [allowMixedPayment, setAllowMixedPayment] = useState(true)

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Failed to parse auth data:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    const storeSettings = getStoreSettings(companyId)
    setSettings(storeSettings)
    
    // Initialize Moeda form
    setCurrencyName(storeSettings.currency?.name || "ponto")
    setCurrencyPlural(storeSettings.currency?.plural || "pontos")
    setCurrencyAbbreviation(storeSettings.currency?.abbreviation || "PTS")
    setCurrencySymbol(storeSettings.currency?.symbol || "★")
    setCurrencyIcon(storeSettings.currency?.icon || "⭐")
    
    // Initialize Aparência form
    setPrimaryColor(storeSettings.currency?.primaryColor || "#FFD700")
    setSecondaryColor(storeSettings.currency?.secondaryColor || "#FFA500")
    setBadgesEnabled(storeSettings.gamification?.badgesEnabled ?? true)
    setBadgeType(storeSettings.currency?.badgeType ?? 'gold')
    
    // Initialize Engajamento form
    setShowDashboard(storeSettings.gamification?.showDashboard ?? true)
    setShowRankings(storeSettings.gamification?.showRankings ?? true)
    setShowTicker(storeSettings.gamification?.showTicker ?? true)
    setCelebrateAchievements(storeSettings.gamification?.celebrateAchievements ?? true)
    
    // Load company settings for Regras
    const company = getCompanyById(companyId)
    if (company) {
      setPointsMultiplier(company.defaultPointsMultiplier || 1.0)
      setAllowMixedPayment(company.allowMixedPayment ?? true)
    }
  }, [companyId])

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      // Save store settings
      const updated: StoreSettings = {
        ...settings,
        currency: {
          name: currencyName,
          plural: currencyPlural,
          abbreviation: currencyAbbreviation.toUpperCase(),
          symbol: currencySymbol,
          icon: currencyIcon,
          primaryColor,
          secondaryColor,
          badgeType,
        },
        gamification: {
          showDashboard,
          showRankings,
          showTicker,
          celebrateAchievements,
          badgesEnabled,
        },
        updatedAt: new Date().toISOString(),
      }
      
      saveStoreSettings(updated)
      setSettings(updated)
      
      // Save company settings (multiplier)
      updateCompany(companyId, {
        defaultPointsMultiplier: pointsMultiplier,
        allowMixedPayment,
      })
      
      toast.success("Configurações de gamificação salvas com sucesso!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao salvar configurações"
      if (process.env.NODE_ENV === 'development') {
        console.error("Error saving gamification settings:", error)
      }
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setPrimaryColor(preset.primary)
    setSecondaryColor(preset.secondary)
  }

  // Preview component
  const CurrencyPreview = () => (
    <div 
      className="p-6 rounded-2xl text-center space-y-4"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
        borderColor: primaryColor,
        borderWidth: 2,
      }}
    >
      <div 
        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl shadow-lg"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        }}
      >
        {currencyIcon}
      </div>
      <div>
        <h3 className="text-xl font-black" style={{ color: primaryColor }}>
          1.250 {currencyAbbreviation}
        </h3>
        <p className="text-xs text-muted-foreground">
          {currencyName} disponível
        </p>
      </div>
      <Badge 
        className="text-xs font-bold"
        style={{ 
          backgroundColor: primaryColor,
          color: secondaryColor === "#FFA500" || secondaryColor === "#FFD700" ? "#000" : "#fff" 
        }}
      >
        {currencySymbol} 500 {currencyPlural}
      </Badge>
    </div>
  )

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20">
            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gamificação</h1>
            <p className="text-muted-foreground text-sm">
              Configure sua moeda virtual, aparência e regras de engajamento
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 self-start">
          <Save className="h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar Tudo"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content - Tabs */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
              <TabsTrigger value="moeda" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Coins className="h-4 w-4" />
                <span className="hidden sm:inline">Moeda</span>
              </TabsTrigger>
              <TabsTrigger value="aparencia" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Aparência</span>
              </TabsTrigger>
              <TabsTrigger value="engajamento" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Engajamento</span>
              </TabsTrigger>
              <TabsTrigger value="regras" className="gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Regras</span>
              </TabsTrigger>
            </TabsList>

            {/* Moeda Tab */}
            <TabsContent value="moeda" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-primary" />
                    Identidade da Moeda
                  </CardTitle>
                  <CardDescription>
                    Defina o nome e abreviação da sua moeda personalizada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currencyName">Nome (singular)</Label>
                      <Input
                        id="currencyName"
                        placeholder="Ex: ponto, coin, star"
                        value={currencyName}
                        onChange={(e) => setCurrencyName(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Ex: "Você ganhou 1 {currencyName || "ponto"}"
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currencyPlural">Nome (plural)</Label>
                      <Input
                        id="currencyPlural"
                        placeholder="Ex: pontos, coins, stars"
                        value={currencyPlural}
                        onChange={(e) => setCurrencyPlural(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Ex: "Você tem 500 {currencyPlural || "pontos"}"
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currencyAbbreviation">Abreviação</Label>
                      <Input
                        id="currencyAbbreviation"
                        placeholder="Ex: BRTS, PTS, STR"
                        value={currencyAbbreviation}
                        onChange={(e) => setCurrencyAbbreviation(e.target.value.toUpperCase())}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currencySymbol">Símbolo</Label>
                      <div className="space-y-2">
                        <Input
                          id="currencySymbol"
                          placeholder="Ex: ₿, ★, ◆"
                          value={currencySymbol}
                          onChange={(e) => setCurrencySymbol(e.target.value)}
                          maxLength={2}
                        />
                        <div className="flex flex-wrap gap-1">
                          {SYMBOL_OPTIONS.map((symbol) => (
                            <button
                              key={symbol}
                              onClick={() => setCurrencySymbol(symbol)}
                              className={cn(
                                "w-8 h-8 rounded-lg border text-lg hover:bg-muted transition-colors",
                                currencySymbol === symbol && "ring-2 ring-primary bg-primary/10"
                              )}
                            >
                              {symbol}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aparência Tab */}
            <TabsContent value="aparencia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Ícone e Cores
                  </CardTitle>
                  <CardDescription>
                    Personalize a aparência visual da sua moeda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Icon Selection */}
                  <div className="space-y-3">
                    <Label>Ícone / Emoji</Label>
                    <div className="flex flex-wrap gap-2">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setCurrencyIcon(emoji)}
                          className={cn(
                            "w-12 h-12 rounded-xl border-2 text-2xl hover:scale-110 transition-all",
                            currencyIcon === emoji && "ring-2 ring-primary border-primary bg-primary/10"
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Label htmlFor="customIcon" className="text-xs">Ou digite:</Label>
                      <Input
                        id="customIcon"
                        className="w-20"
                        placeholder="🎁"
                        value={currencyIcon}
                        onChange={(e) => setCurrencyIcon(e.target.value)}
                        maxLength={2}
                      />
                    </div>
                  </div>

                  {/* Color Presets */}
                  <div className="space-y-3">
                    <Label>Paleta de Cores</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => applyColorPreset(preset)}
                          className={cn(
                            "p-3 rounded-xl border-2 text-center transition-all hover:scale-105",
                            primaryColor === preset.primary && "ring-2 ring-offset-2 ring-primary"
                          )}
                          style={{ 
                            background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` 
                          }}
                        >
                          <span className="text-xs font-bold text-white drop-shadow-md">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Cor Primária</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          id="primaryColor"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-14 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="font-mono uppercase"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          id="secondaryColor"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="h-10 w-14 rounded-lg cursor-pointer"
                        />
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badge Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Sistema de Badges
                  </CardTitle>
                  <CardDescription>
                    Configure o estilo visual dos badges
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Ativar Sistema de Badges</p>
                        <p className="text-xs text-muted-foreground">Exibir badges visuais em toda plataforma</p>
                      </div>
                    </div>
                    <Switch checked={badgesEnabled} onCheckedChange={setBadgesEnabled} />
                  </div>

                  {badgesEnabled && (
                    <div className="space-y-3">
                      <Label>Estilo do Badge</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {BADGE_TYPES.map((badge) => (
                          <button
                            key={badge.id}
                            onClick={() => {
                              setBadgeType(badge.id)
                              if (badge.id !== 'custom') {
                                setPrimaryColor(badge.colors.primary)
                                setSecondaryColor(badge.colors.secondary)
                              }
                            }}
                            className={cn(
                              "p-4 rounded-xl border-2 text-center transition-all hover:scale-105 flex flex-col items-center gap-2",
                              badgeType === badge.id && "ring-2 ring-offset-2 ring-primary border-primary"
                            )}
                            style={{ 
                              background: `linear-gradient(135deg, ${badge.colors.primary}20, ${badge.colors.secondary}20)`,
                              borderColor: badgeType === badge.id ? badge.colors.primary : undefined
                            }}
                          >
                            <span className="text-3xl">{badge.icon}</span>
                            <span className="text-sm font-bold" style={{ color: badge.colors.primary }}>
                              {badge.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Engajamento Tab */}
            <TabsContent value="engajamento" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Elementos de Engajamento
                  </CardTitle>
                  <CardDescription>
                    Ative ou desative elementos visuais de gamificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Dashboard da Moeda</p>
                        <p className="text-xs text-muted-foreground">Exibir gráficos e estatísticas em tempo real</p>
                      </div>
                    </div>
                    <Switch checked={showDashboard} onCheckedChange={setShowDashboard} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Rankings</p>
                        <p className="text-xs text-muted-foreground">Mostrar top acumuladores e gastadores</p>
                      </div>
                    </div>
                    <Switch checked={showRankings} onCheckedChange={setShowRankings} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Ticker de Transações</p>
                        <p className="text-xs text-muted-foreground">Ticker animado com últimas transações</p>
                      </div>
                    </div>
                    <Switch checked={showTicker} onCheckedChange={setShowTicker} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Celebrar Conquistas</p>
                        <p className="text-xs text-muted-foreground">Animações de confetti ao atingir metas</p>
                      </div>
                    </div>
                    <Switch checked={celebrateAchievements} onCheckedChange={setCelebrateAchievements} />
                  </div>
                </CardContent>
              </Card>

              {/* Link to Achievements Dashboard */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-yellow-500/20 rounded-xl">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Conquistas do Time</p>
                        <p className="text-sm text-muted-foreground">Veja o progresso e conquistas da equipe</p>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <a href="/gestor/achievements">Ver Conquistas</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Regras Tab */}
            <TabsContent value="regras" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Regras de Pontuação
                  </CardTitle>
                  <CardDescription>
                    Configure multiplicadores e regras de negócio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="multiplier" className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Multiplicador de Pontos
                      </Label>
                      <Input
                        id="multiplier"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={pointsMultiplier}
                        onChange={(e) => setPointsMultiplier(parseFloat(e.target.value) || 1.0)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Multiplicador aplicado ao cálculo de {currencyPlural || "pontos"} ganhos (padrão: 1.0)
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                      <p className="text-sm font-medium">Exemplo de cálculo:</p>
                      <p className="text-xs text-muted-foreground">
                        Compra de R$ 100,00
                      </p>
                      <p className="text-lg font-bold text-primary">
                        = {Math.round(100 * pointsMultiplier)} {currencyPlural || "pontos"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Pagamento Misto</p>
                        <p className="text-xs text-muted-foreground">Permitir pagamento parcial com {currencyPlural || "pontos"}</p>
                      </div>
                    </div>
                    <Switch checked={allowMixedPayment} onCheckedChange={setAllowMixedPayment} />
                  </div>
                </CardContent>
              </Card>

              {/* Link to Currency Dashboard */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Dashboard da Moeda</p>
                        <p className="text-sm text-muted-foreground">Analíticos e métricas de uso</p>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <a href="/gestor/currency-dashboard">Ver Dashboard</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-primary" />
                Preview
              </CardTitle>
              <CardDescription>
                Visualização da moeda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CurrencyPreview />

              {/* Sample Usage */}
              <div className="space-y-2 pt-4 border-t text-sm">
                <p className="font-medium text-xs uppercase text-muted-foreground">Exemplo de uso:</p>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <span>{currencyIcon}</span>
                  <span>+500 {currencyAbbreviation}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  <span>{currencyIcon}</span>
                  <span>-250 {currencyAbbreviation}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
