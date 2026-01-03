"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Building,
  Save,
  RefreshCw,
  Palette,
  Globe,
  Store,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { FunModeToggle, QuickBrandSeeder } from "@/components/gestor/demo-controls"
import { DemoCustomizer } from "@/components/gestor/demo-customizer"
import {
  getCompanyById,
  updateCompany,
  getStoresByCompany,
  getCurrencyName,
  updateCompanyHelpSetting,
  type Company,
} from "@/lib/storage"
import { toast } from "sonner"

export default function ConsoleSettingsPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    domain: "",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    defaultPointsMultiplier: 1.0,
    allowMixedPayment: true,
    helpTourEnabled: true,
    demoFeaturesEnabled: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    const authData = localStorage.getItem("yoobe_auth")
    let companyIdValue = "company_1"
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          companyIdValue = auth.companyId
          setCompanyId(companyIdValue)
        }
      } catch {}
    }
    const companyData = getCompanyById(companyIdValue)
    if (companyData) {
      setCompany(companyData)
      setFormData({
        name: companyData.name,
        alias: companyData.alias,
        domain: companyData.domain || "",
        primaryColor: companyData.primaryColor || "#10b981",
        secondaryColor: companyData.secondaryColor || "#059669",
        defaultPointsMultiplier: companyData.defaultPointsMultiplier || 1.0,
        allowMixedPayment: companyData.allowMixedPayment ?? true,
        helpTourEnabled: companyData.helpTourEnabled ?? true,
        demoFeaturesEnabled: companyData.demoFeaturesEnabled ?? false,
      })
      const companyStores = getStoresByCompany(companyIdValue)
      setStores(companyStores)
    }
    setLoading(false)
  }

  const handleSave = () => {
    if (!company) return

    setSaving(true)
    try {
      updateCompany(company.id, formData)
      toast.success("Configurações salvas com sucesso")
      loadData()
    } catch (error) {
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!company) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Empresa não encontrada</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações da Empresa</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie as informações e configurações da sua empresa
          </p>
        </div>
        <Button onClick={loadData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Informações Básicas
          </CardTitle>
          <CardDescription>Dados principais da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alias">Alias</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="alias"
                  value={formData.alias}
                  onChange={(e) =>
                    setFormData({ ...formData, alias: e.target.value.toUpperCase() })
                  }
                  maxLength={10}
                />
                <Badge variant="outline" className="font-mono">
                  {formData.alias}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Usado para gerar SKUs únicos (ex: {formData.alias}-000123)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domínio</Label>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="Ex: yoobe.co"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Identidade Visual
          </CardTitle>
          <CardDescription>Personalize as cores da marca</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Primária</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  placeholder="#10b981"
                />
              </div>
              <div
                className="h-12 rounded-lg border"
                style={{ backgroundColor: formData.primaryColor }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  placeholder="#059669"
                />
              </div>
              <div
                className="h-12 rounded-lg border"
                style={{ backgroundColor: formData.secondaryColor }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Regras de Negócio
          </CardTitle>
          <CardDescription>Configurações de pontos e pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="multiplier">Multiplicador de Pontos Padrão</Label>
              <Input
                id="multiplier"
                type="number"
                step="0.1"
                min="0"
                value={formData.defaultPointsMultiplier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultPointsMultiplier: parseFloat(e.target.value) || 1.0,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Multiplicador aplicado ao cálculo de {getCurrencyName(companyId, true)} ganhos
              </p>
            </div>
            <div className="space-y-2">
              <Label>Pagamento Misto</Label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="mixedPayment"
                  type="checkbox"
                  checked={formData.allowMixedPayment}
                  onChange={(e) =>
                    setFormData({ ...formData, allowMixedPayment: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="mixedPayment" className="text-sm font-normal cursor-pointer">
                  Permitir pagamento parcial com pontos
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Usuários podem pagar parte em dinheiro e parte em {getCurrencyName(companyId, true)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Tour Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Ajuda e Tours Guiados
          </CardTitle>
          <CardDescription>Configure os tours guiados e ajuda contextual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ativar Tours Guiados</Label>
            <div className="flex items-center gap-2 pt-2">
              <input
                id="helpTourEnabled"
                type="checkbox"
                checked={formData.helpTourEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, helpTourEnabled: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="helpTourEnabled" className="text-sm font-normal cursor-pointer">
                Habilitar tours guiados e ajuda contextual
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Quando ativado, os usuários verão tours guiados ao acessar novas áreas e poderão usar o botão de ajuda para revisar funcionalidades.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Demo Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ferramentas de Demonstração
          </CardTitle>
          <CardDescription>Configure ferramentas para apresentações e demonstrações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ativar Ferramentas de Demo</Label>
            <div className="flex items-center gap-2 pt-2">
              <input
                id="demoFeaturesEnabled"
                type="checkbox"
                checked={formData.demoFeaturesEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, demoFeaturesEnabled: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="demoFeaturesEnabled" className="text-sm font-normal cursor-pointer">
                Habilitar ferramentas de demonstração na sidebar
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Quando ativado, as ferramentas de demo (Fun Mode, Quick Brand, Demo Setup) aparecerão na sidebar para facilitar apresentações e personalizações rápidas.
            </p>
          </div>

          {formData.demoFeaturesEnabled && (
            <div className="mt-6 pt-6 border-t space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Ferramentas Disponíveis</Label>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/30">
                  <FunModeToggle />
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    Ativa o tema "Fun Mode" com design Stitch
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/30">
                  <QuickBrandSeeder />
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    Aplica uma marca pré-configurada rapidamente
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/30">
                  <DemoCustomizer />
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    Personaliza a demo para apresentações
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Lojas da Empresa
          </CardTitle>
          <CardDescription>Lojas associadas a esta empresa</CardDescription>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Store className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhuma loja cadastrada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{store.name}</p>
                    {store.domain && (
                      <p className="text-sm text-muted-foreground">{store.domain}</p>
                    )}
                  </div>
                  {store.isActive ? (
                    <Badge className="bg-green-500 text-white border-none">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Ativa
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inativa</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={loadData}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
