"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogType,
} from "@/components/ui/dialog"
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Store,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Settings,
} from "lucide-react"
import {
  getCompanies,
  getStores,
  getStoresByCompany,
  createCompany,
  updateCompany,
  getCompanyProductsByCompany,
  getUsersByCompany,
  getOrdersByCompany,
  getStoreSettings,
  saveStoreSettings,
  getCompanyAppearance,
  saveCompanyAppearance,
  LEVEL_CONFIG,
  DEFAULT_GAMIFICATION_SETTINGS,
  type Company,
  type Store,
  type StoreSettings,
  type UserLevel,
  type LevelCustomization,
} from "@/lib/storage"
import { Switch } from "@/components/ui/switch"
import { Coins, CreditCard, QrCode, Gift, Trophy, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { PageContainer } from "@/components/page-container"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { TrendingUp, Users as UsersIcon, Package as PackageIcon, ShoppingCart, Eye } from "lucide-react"

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    domain: "",
    logo: "",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    defaultPointsMultiplier: 1.0,
    allowMixedPayment: true,
    address: "",
    contactEmail: "",
    phone: "",
    category: "Corporate",
    // Redemption types
    allowPointsRedemption: true,
    allowPixRedemption: false,
    allowCardRedemption: false,
    allowFreeRedemption: true,
    // Gamification features
    gamificationEnabled: true,
    badgesEnabled: true,
  })
  
  const [levelCustomizations, setLevelCustomizations] = useState<Record<UserLevel, LevelCustomization>>({
    bronze: {},
    silver: {},
    gold: {},
    platinum: {},
    diamond: {},
  })
  
  const LEVEL_ORDER: UserLevel[] = ["bronze", "silver", "gold", "platinum", "diamond"]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setCompanies(getCompanies())
    setStores(getStores())
  }

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.alias.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenDialog = (company?: Company) => {
    if (company) {
      setEditingCompany(company)
      // Get store settings for this company
      const settings = getStoreSettings(company.id)
      // Get appearance settings for level customizations
      const appearance = getCompanyAppearance(company.id)
      const customizations = appearance?.gamification?.levelCustomizations || {}
      
      setFormData({
        name: company.name,
        alias: company.alias,
        domain: company.domain || "",
        logo: company.logo || "",
        primaryColor: company.primaryColor || "#10b981",
        secondaryColor: company.secondaryColor || "#059669",
        defaultPointsMultiplier: company.defaultPointsMultiplier || 1.0,
        allowMixedPayment: company.allowMixedPayment ?? true,
        address: company.address || "",
        contactEmail: company.contactEmail || "",
        phone: company.phone || "",
        category: company.category || "Corporate",
        // Redemption types from store settings
        allowPointsRedemption: settings.redemptionTypes?.points ?? true,
        allowPixRedemption: settings.redemptionTypes?.pix ?? false,
        allowCardRedemption: settings.redemptionTypes?.card ?? false,
        allowFreeRedemption: settings.redemptionTypes?.free ?? true,
        // Gamification features
        gamificationEnabled: settings.features?.gamification ?? true,
        badgesEnabled: settings.gamification?.badgesEnabled ?? true,
      })
      
      // Load level customizations
      setLevelCustomizations({
        bronze: customizations.bronze || {},
        silver: customizations.silver || {},
        gold: customizations.gold || {},
        platinum: customizations.platinum || {},
        diamond: customizations.diamond || {},
      })
    } else {
      setEditingCompany(null)
      setFormData({
        name: "",
        alias: "",
        domain: "",
        logo: "",
        primaryColor: "#10b981",
        secondaryColor: "#059669",
        defaultPointsMultiplier: 1.0,
        allowMixedPayment: true,
        address: "",
        contactEmail: "",
        phone: "",
        category: "Corporate",
        allowPointsRedemption: true,
        allowPixRedemption: false,
        allowCardRedemption: false,
        allowFreeRedemption: true,
        gamificationEnabled: true,
        badgesEnabled: true,
      })
      // Reset level customizations
      setLevelCustomizations({
        bronze: {},
        silver: {},
        gold: {},
        platinum: {},
        diamond: {},
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.alias) {
      toast.error("Nome e alias são obrigatórios")
      return
    }

    let companyId = editingCompany?.id

    if (editingCompany) {
      updateCompany(editingCompany.id, formData)
      toast.success("Empresa atualizada com sucesso")
    } else {
      const newCompany = createCompany(formData)
      companyId = newCompany.id
      toast.success("Empresa criada com sucesso")
    }

    // Update store settings for redemption types and gamification
    if (companyId) {
      const currentSettings = getStoreSettings(companyId)
      saveStoreSettings({
        ...currentSettings,
        companyId,
        redemptionTypes: {
          points: formData.allowPointsRedemption,
          pix: formData.allowPixRedemption,
          card: formData.allowCardRedemption,
          free: formData.allowFreeRedemption,
        },
        features: {
          ...currentSettings.features,
          gamification: formData.gamificationEnabled,
        },
        gamification: {
          ...currentSettings.gamification,
          badgesEnabled: formData.badgesEnabled,
        },
        updatedAt: new Date().toISOString(),
      })
      
      // Save level customizations to company appearance
      const appearance = getCompanyAppearance(companyId)
      // Filter out empty customizations
      const cleanCustomizations: Record<string, LevelCustomization> = {}
      for (const [level, custom] of Object.entries(levelCustomizations)) {
        const hasValues = Object.values(custom).some(v => v !== undefined && v !== "" && v !== null)
        if (hasValues) {
          cleanCustomizations[level] = custom
        }
      }
      
      saveCompanyAppearance({
        ...appearance,
        gamification: {
          ...(appearance.gamification || DEFAULT_GAMIFICATION_SETTINGS),
          levelCustomizations: cleanCustomizations,
        },
      })
    }

    setIsDialogOpen(false)
    loadData()
  }

  const getCompanyStats = (companyId: string) => {
    const companyStores = getStoresByCompany(companyId)
    const companyProducts = getCompanyProductsByCompany(companyId)
    const companyUsers = getUsersByCompany(companyId)
    const companyOrders = getOrdersByCompany(companyId)
    
    return {
      stores: companyStores.length,
      products: companyProducts.length,
      activeProducts: companyProducts.filter((p) => p.isActive).length,
      users: companyUsers.length,
      orders: companyOrders.length,
      totalRevenue: companyOrders.reduce((acc, o) => acc + (o.total || 0), 0)
    }
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Empresas</h1>
          <p className="text-muted-foreground text-sm">
            Administração global de tenants e configurações detalhadas
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Empresa
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou alias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Estatísticas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => {
                const stats = getCompanyStats(company.id)
                return (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: company.primaryColor || "#10b981" }}
                          >
                            {company.alias.substring(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.domain || "no-domain"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {company.alias}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Usuários</span>
                          <span className="text-sm font-semibold">{stats.users}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Produtos</span>
                          <span className="text-sm font-semibold">{stats.products}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Pedidos</span>
                          <span className="text-sm font-semibold">{stats.orders}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.isActive ? (
                        <Badge className="bg-green-500 text-white border-none">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inativa
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(company)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dashboard Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Painel da Empresa: {selectedCompany?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (() => {
            const stats = getCompanyStats(selectedCompany.id)
            return (
              <div className="space-y-6 py-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                        <UsersIcon className="h-3 w-3" /> Usuários
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black">{stats.users}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                        <PackageIcon className="h-3 w-3" /> Produtos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black">{stats.products}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" /> Pedidos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black">{stats.orders}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 border-amber-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Receita
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-black whitespace-nowrap">R$ {stats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold">Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">E-mail:</span>
                        <span className="font-medium">{selectedCompany.contactEmail || "não informado"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Telefone:</span>
                        <span className="font-medium">{selectedCompany.phone || "não informado"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Endereço:</span>
                        <span className="font-medium text-right max-w-[200px]">{selectedCompany.address || "não informado"}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold">Configurações Ativas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Multiplicador:</span>
                        <Badge variant="secondary">{selectedCompany.defaultPointsMultiplier}x</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Pagamento Misto:</span>
                        <Badge variant={selectedCompany.allowMixedPayment ? "default" : "outline"}>
                          {selectedCompany.allowMixedPayment ? "Sim" : "Não"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Alias SKU:</span>
                        <code className="bg-muted px-2 py-0.5 rounded">{selectedCompany.alias}</code>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Redemption & Gamification Info */}
                {(() => {
                  const settings = getStoreSettings(selectedCompany.id)
                  return (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Tipos de Resgate
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <Coins className="h-4 w-4 text-yellow-500" /> Pontos
                            </span>
                            <Badge variant={settings.redemptionTypes?.points ? "default" : "outline"}>
                              {settings.redemptionTypes?.points ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <QrCode className="h-4 w-4 text-green-500" /> PIX
                            </span>
                            <Badge variant={settings.redemptionTypes?.pix ? "default" : "outline"}>
                              {settings.redemptionTypes?.pix ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-blue-500" /> Cartão
                            </span>
                            <Badge variant={settings.redemptionTypes?.card ? "default" : "outline"}>
                              {settings.redemptionTypes?.card ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-purple-500" /> Gratuito
                            </span>
                            <Badge variant={settings.redemptionTypes?.free ? "default" : "outline"}>
                              {settings.redemptionTypes?.free ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Trophy className="h-4 w-4" /> Gamificação
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-yellow-500" /> Sistema de Gamificação
                            </span>
                            <Badge variant={settings.features?.gamification ? "default" : "outline"}>
                              {settings.features?.gamification ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-amber-500" /> Badges de Moeda
                            </span>
                            <Badge variant={settings.gamification?.badgesEnabled ? "default" : "outline"}>
                              {settings.gamification?.badgesEnabled ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          {settings.currency?.badgeType && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Tipo de Badge</span>
                              <Badge variant="secondary" className="capitalize">
                                {settings.currency.badgeType === 'gold' ? '🥇 Ouro' : 
                                 settings.currency.badgeType === 'silver' ? '🥈 Prata' : 
                                 settings.currency.badgeType === 'bronze' ? '🥉 Bronze' : '✨ Custom'}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )
                })()}
              </div>
            )
          })()}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Fechar Dashboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? "Editar Empresa" : "Nova Empresa"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados cadastrais e configurações de marca
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <ImageUpload 
                label="Logo da Empresa"
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                onRemove={() => setFormData({ ...formData, logo: "" })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Yoobe LTDA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alias">Alias (SKU Prefix) *</Label>
                <Input
                  id="alias"
                  value={formData.alias}
                  onChange={(e) =>
                    setFormData({ ...formData, alias: e.target.value.toUpperCase() })
                  }
                  placeholder="Ex: YOO"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">E-mail de Contato</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contato@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, Número, Bairro, Cidade - UF"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="domain">Domínio</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="Ex: yoobe.co"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporate">Corporativo</SelectItem>
                    <SelectItem value="Retail">Varejo</SelectItem>
                    <SelectItem value="Education">Educação</SelectItem>
                    <SelectItem value="Tech">Tecnologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#10b981"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="#059669"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="multiplier">Multiplicador de Pontos</Label>
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
              </div>
              <div className="space-y-2">
                <Label>Permissões</Label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="mixedPayment"
                    type="checkbox"
                    checked={formData.allowMixedPayment}
                    onChange={(e) =>
                      setFormData({ ...formData, allowMixedPayment: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="mixedPayment" className="text-sm font-normal cursor-pointer">
                    Permitir Pagamento Misto
                  </Label>
                </div>
              </div>
            </div>

            {/* Redemption Types Section */}
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Tipos de Resgate Permitidos
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure quais métodos de pagamento/resgate estarão disponíveis para esta empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-sm">Pontos</p>
                      <p className="text-xs text-muted-foreground">Resgate com saldo de pontos</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.allowPointsRedemption}
                    onCheckedChange={(checked) => setFormData({ ...formData, allowPointsRedemption: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <QrCode className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">PIX</p>
                      <p className="text-xs text-muted-foreground">Pagamento instantâneo via PIX</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.allowPixRedemption}
                    onCheckedChange={(checked) => setFormData({ ...formData, allowPixRedemption: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Cartão de Crédito/Débito</p>
                      <p className="text-xs text-muted-foreground">Pagamento com cartão</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.allowCardRedemption}
                    onCheckedChange={(checked) => setFormData({ ...formData, allowCardRedemption: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-sm">Resgate Gratuito</p>
                      <p className="text-xs text-muted-foreground">Itens sem custo</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.allowFreeRedemption}
                    onCheckedChange={(checked) => setFormData({ ...formData, allowFreeRedemption: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gamification Section */}
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  Funcionalidades de Gamificação
                </CardTitle>
                <CardDescription className="text-xs">
                  Habilite ou desabilite recursos de gamificação para esta empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-sm">Sistema de Gamificação</p>
                      <p className="text-xs text-muted-foreground">Pontos, rankings e conquistas</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.gamificationEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, gamificationEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-sm">Badges de Moeda</p>
                      <p className="text-xs text-muted-foreground">Ouro, Prata, Bronze para moeda</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.badgesEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, badgesEnabled: checked })}
                    disabled={!formData.gamificationEnabled}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Level Customization Section */}
            {formData.gamificationEnabled && (
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Níveis de Gamificação
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Personalize os pontos mínimos e multiplicadores para cada nível. Deixe em branco para usar os padrões.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {LEVEL_ORDER.map((level) => {
                    const config = LEVEL_CONFIG[level]
                    const customization = levelCustomizations[level] || {}
                    
                    return (
                      <div key={level} className="p-3 rounded-lg bg-muted/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-8 w-8 rounded-full flex items-center justify-center text-lg"
                              style={{ backgroundColor: customization.customColor || config.color }}
                            >
                              {level === "bronze" && "🏆"}
                              {level === "silver" && "🥈"}
                              {level === "gold" && "🥇"}
                              {level === "platinum" && "💎"}
                              {level === "diamond" && "👑"}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{customization.customLabel || config.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {(customization.customMinPoints ?? config.minPoints).toLocaleString()} pontos • {(customization.customMultiplier ?? config.multiplier)}x
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" style={{ borderColor: config.color, color: config.color }}>
                            {level.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid gap-3 md:grid-cols-4">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Nome</Label>
                            <Input
                              value={customization.customLabel || ""}
                              onChange={(e) => setLevelCustomizations({
                                ...levelCustomizations,
                                [level]: { ...customization, customLabel: e.target.value || undefined }
                              })}
                              placeholder={config.label}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Cor</Label>
                            <div className="flex gap-1">
                              <Input
                                type="color"
                                value={customization.customColor || config.color}
                                onChange={(e) => setLevelCustomizations({
                                  ...levelCustomizations,
                                  [level]: { ...customization, customColor: e.target.value }
                                })}
                                className="w-10 h-8 p-1"
                              />
                              <Input
                                value={customization.customColor || ""}
                                onChange={(e) => setLevelCustomizations({
                                  ...levelCustomizations,
                                  [level]: { ...customization, customColor: e.target.value || undefined }
                                })}
                                placeholder={config.color}
                                className="h-8 text-sm flex-1"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Pontos Mín.</Label>
                            <Input
                              type="number"
                              value={customization.customMinPoints ?? ""}
                              onChange={(e) => setLevelCustomizations({
                                ...levelCustomizations,
                                [level]: { 
                                  ...customization, 
                                  customMinPoints: e.target.value === "" ? undefined : parseInt(e.target.value) 
                                }
                              })}
                              placeholder={config.minPoints.toString()}
                              className="h-8 text-sm"
                              disabled={level === "bronze"}
                              min={0}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Multiplicador</Label>
                            <Input
                              type="number"
                              step="0.05"
                              value={customization.customMultiplier ?? ""}
                              onChange={(e) => setLevelCustomizations({
                                ...levelCustomizations,
                                [level]: { 
                                  ...customization, 
                                  customMultiplier: e.target.value === "" ? undefined : parseFloat(e.target.value) 
                                }
                              })}
                              placeholder={config.multiplier.toString()}
                              className="h-8 text-sm"
                              min={1}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="font-bold">
              {editingCompany ? "Salvar Alterações" : "Criar Empresa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
