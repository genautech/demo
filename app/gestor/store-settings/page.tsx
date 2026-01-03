"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Sliders, 
  Coins, 
  Trophy, 
  CreditCard, 
  Gift, 
  Zap, 
  Save, 
  Truck,
  ArrowRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getStoreSettings, saveStoreSettings, type StoreSettings } from "@/lib/storage"
import { toast } from "sonner"
import { PageContainer } from "@/components/page-container"

export default function StoreSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [companyId, setCompanyId] = useState<string>("company_1")

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    let companyIdValue = "company_1"
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        companyIdValue = auth.companyId || companyIdValue
        setCompanyId(companyIdValue)
      } catch (e) {}
    }

    const currentSettings = getStoreSettings(companyIdValue)
    // Garantir que currency existe
    if (!currentSettings.currency) {
      currentSettings.currency = { name: "ponto", plural: "pontos" }
    }
    setSettings(currentSettings)
    setIsLoading(false)
  }, [])

  const handleToggleRedemption = (key: keyof StoreSettings['redemptionTypes']) => {
    if (!settings) return
    setSettings({
      ...settings,
      redemptionTypes: {
        ...settings.redemptionTypes,
        [key]: !settings.redemptionTypes[key]
      }
    })
  }

  const handleToggleFeature = (key: keyof StoreSettings['features']) => {
    if (!settings) return
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [key]: !settings.features[key]
      }
    })
  }

  const handleSave = () => {
    if (!settings) return
    // Garantir que currency existe antes de salvar
    if (!settings.currency) {
      settings.currency = { name: "ponto", plural: "pontos" }
    }
    saveStoreSettings(settings)
    toast.success("Configurações salvas com sucesso!")
  }

  if (isLoading || !settings) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sliders className="h-8 w-8 text-primary" />
            Configurações da Loja
          </h1>
          <p className="mt-2 text-muted-foreground">Controle as funcionalidades e regras da sua vitrine corporativa.</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="redemption">Resgate</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FeatureToggle 
              title="Swag Track" 
              description="Permite que usuários acompanhem o envio de itens físicos em tempo real."
              icon={<Truck className="h-5 w-5 text-primary" />}
              enabled={settings.features.swagTrack}
              onToggle={() => handleToggleFeature('swagTrack')}
            />
            <FeatureToggle 
              title="Send Gifts" 
              description="Habilita a função de agendar presentes para outros membros da equipe."
              icon={<Gift className="h-5 w-5 text-primary" />}
              enabled={settings.features.sendGifts}
              onToggle={() => handleToggleFeature('sendGifts')}
            />
            <FeatureToggle 
              title="Cashback Automático" 
              description={`Retorna uma porcentagem em ${settings.currency?.plural || "pontos"} para cada resgate realizado.`}
              icon={<Coins className="h-5 w-5 text-primary" />}
              enabled={settings.features.cashback}
              onToggle={() => handleToggleFeature('cashback')}
            />
            <FeatureToggle 
              title="Sistema de Conquistas" 
              description="Habilita Badges e Achievements para engajamento do usuário."
              icon={<Trophy className="h-5 w-5 text-primary" />}
              enabled={settings.features.achievements}
              onToggle={() => handleToggleFeature('achievements')}
            />
          </div>

          {/* Link to Gamification Settings */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Configurações de Gamificação</p>
                    <p className="text-sm text-muted-foreground">Configure moeda, cores, badges e regras de pontuação</p>
                  </div>
                </div>
                <Button asChild className="gap-2">
                  <a href="/gestor/currency">
                    Configurar
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redemption" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modos de Resgate Permitidos</CardTitle>
              <CardDescription>Selecione como os membros podem adquirir itens na loja.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{settings.currency?.plural?.toUpperCase() || "PONTOS"} (Pontos)</p>
                    <p className="text-sm text-muted-foreground">Uso de saldo acumulado na plataforma.</p>
                  </div>
                </div>
                <Switch checked={settings.redemptionTypes.points} onCheckedChange={() => handleToggleRedemption('points')} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">PIX / Pagamento Direto</p>
                    <p className="text-sm text-muted-foreground">Permite compra direta via PIX sem necessidade de pontos.</p>
                  </div>
                </div>
                <Switch checked={settings.redemptionTypes.pix} onCheckedChange={() => handleToggleRedemption('pix')} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Cartão de Crédito/Débito</p>
                    <p className="text-sm text-muted-foreground">Permite pagamento com cartão de crédito ou débito.</p>
                  </div>
                </div>
                <Switch checked={settings.redemptionTypes.card ?? false} onCheckedChange={() => handleToggleRedemption('card')} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Resgate Gratuito</p>
                    <p className="text-sm text-muted-foreground">Itens sem custo para o usuário (ex: onboarding).</p>
                  </div>
                </div>
                <Switch checked={settings.redemptionTypes.free} onCheckedChange={() => handleToggleRedemption('free')} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalização Visual</CardTitle>
              <CardDescription>Configure a aparência e layout da loja do cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use o editor completo de aparência para personalizar temas, cores, seções e layouts.
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <a href="/gestor/appearance">Abrir Editor de Aparência</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

function FeatureToggle({ title, description, icon, enabled, onToggle }: any) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onToggle}>
      <CardContent className="p-6 flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{title}</p>
            <Switch checked={enabled} onCheckedChange={onToggle} />
          </div>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
