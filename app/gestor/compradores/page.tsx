"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  DollarSign,
  Building2,
  RefreshCw,
  UserPlus,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { 
  getCompanyBuyersByCompany,
  createCompanyBuyer,
  updateCompanyBuyer,
  deleteCompanyBuyer,
  getCostCentersByCompany,
  seedCostCenters,
  seedCompanyBuyers,
  type CompanyBuyer,
  type CostCenter,
} from "@/lib/storage"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ROLE_CONFIG = {
  buyer: { label: "Comprador", color: "bg-blue-100 text-blue-700", icon: Users },
  approver: { label: "Aprovador", color: "bg-purple-100 text-purple-700", icon: ShieldCheck },
  admin: { label: "Administrador", color: "bg-amber-100 text-amber-700", icon: ShieldAlert },
}

export default function CompradoresPage() {
  const [buyers, setBuyers] = useState<CompanyBuyer[]>([])
  const [costCenters, setCostCenters] = useState<CostCenter[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [companyId, setCompanyId] = useState<string>("company_1")
  const [isLoading, setIsLoading] = useState(true)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBuyer, setEditingBuyer] = useState<CompanyBuyer | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "buyer" as "buyer" | "approver" | "admin",
    spendLimit: "",
    costCenterIds: [] as string[],
    isActive: true,
  })

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
          loadData(auth.companyId)
        }
      } catch (error) {
        console.error("Error parsing auth:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const loadData = (companyId: string) => {
    // Seed demo data
    seedCostCenters(companyId)
    seedCompanyBuyers(companyId)
    
    // Load data
    const buyersData = getCompanyBuyersByCompany(companyId)
    const centersData = getCostCentersByCompany(companyId)
    setBuyers(buyersData)
    setCostCenters(centersData)
  }

  const filteredBuyers = buyers.filter(buyer => {
    const matchesSearch = 
      buyer.name.toLowerCase().includes(search.toLowerCase()) ||
      buyer.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || buyer.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleOpenModal = (buyer?: CompanyBuyer) => {
    if (buyer) {
      setEditingBuyer(buyer)
      setFormData({
        name: buyer.name,
        email: buyer.email,
        role: buyer.role,
        spendLimit: buyer.spendLimit.toString(),
        costCenterIds: buyer.costCenterIds,
        isActive: buyer.isActive,
      })
    } else {
      setEditingBuyer(null)
      setFormData({
        name: "",
        email: "",
        role: "buyer",
        spendLimit: "",
        costCenterIds: [],
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const spendLimit = parseFloat(formData.spendLimit) || 0

    if (editingBuyer) {
      // Update
      const updated = updateCompanyBuyer(editingBuyer.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        spendLimit,
        costCenterIds: formData.costCenterIds,
        isActive: formData.isActive,
      })
      
      if (updated) {
        toast.success("Comprador atualizado com sucesso")
        loadData(companyId)
      }
    } else {
      // Create
      createCompanyBuyer({
        companyId,
        userId: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        spendLimit,
        costCenterIds: formData.costCenterIds,
        isActive: formData.isActive,
      })
      
      toast.success("Comprador cadastrado com sucesso")
      loadData(companyId)
    }

    setIsModalOpen(false)
  }

  const handleToggleActive = (buyer: CompanyBuyer) => {
    const updated = updateCompanyBuyer(buyer.id, { isActive: !buyer.isActive })
    if (updated) {
      toast.success(buyer.isActive ? "Comprador desativado" : "Comprador ativado")
      loadData(companyId)
    }
  }

  const handleDelete = (buyer: CompanyBuyer) => {
    if (!confirm(`Tem certeza que deseja excluir ${buyer.name}?`)) return
    
    const deleted = deleteCompanyBuyer(buyer.id)
    if (deleted) {
      toast.success("Comprador excluído")
      loadData(companyId)
    }
  }

  const toggleCostCenter = (costCenterId: string) => {
    setFormData(prev => ({
      ...prev,
      costCenterIds: prev.costCenterIds.includes(costCenterId)
        ? prev.costCenterIds.filter(id => id !== costCenterId)
        : [...prev.costCenterIds, costCenterId]
    }))
  }

  // Stats
  const stats = {
    total: buyers.length,
    active: buyers.filter(b => b.isActive).length,
    admins: buyers.filter(b => b.role === "admin").length,
    approvers: buyers.filter(b => b.role === "approver").length,
    buyers: buyers.filter(b => b.role === "buyer").length,
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Compradores
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os compradores autorizados da empresa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => loadData(companyId)} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Comprador
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approvers}</p>
                <p className="text-xs text-muted-foreground">Aprovadores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.buyers}</p>
                <p className="text-xs text-muted-foreground">Compradores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os papéis</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="approver">Aprovadores</SelectItem>
                <SelectItem value="buyer">Compradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buyers List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      ) : filteredBuyers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum comprador encontrado</p>
            <Button variant="outline" onClick={() => handleOpenModal()} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Cadastrar Primeiro Comprador
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBuyers.map((buyer) => {
            const roleConfig = ROLE_CONFIG[buyer.role]
            const RoleIcon = roleConfig.icon
            const buyerCostCenters = costCenters.filter(cc => buyer.costCenterIds.includes(cc.id))
            
            return (
              <Card key={buyer.id} className={cn(
                "border-none shadow-sm hover:shadow-md transition-shadow",
                !buyer.isActive && "opacity-60"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-xl", roleConfig.color.split(" ")[0])}>
                        <RoleIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{buyer.name}</CardTitle>
                        <CardDescription className="text-xs flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" />
                          {buyer.email}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenModal(buyer)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(buyer)}>
                          {buyer.isActive ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(buyer)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={roleConfig.color}>
                      {roleConfig.label}
                    </Badge>
                    <Badge variant={buyer.isActive ? "default" : "secondary"}>
                      {buyer.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Limite</p>
                      <p className="font-semibold text-primary">
                        R$ {buyer.spendLimit.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Gasto</p>
                      <p className="font-semibold">
                        R$ {buyer.totalSpent.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  {buyerCostCenters.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Centros de Custo</p>
                      <div className="flex flex-wrap gap-1">
                        {buyerCostCenters.slice(0, 2).map(cc => (
                          <Badge key={cc.id} variant="outline" className="text-[10px]">
                            {cc.name}
                          </Badge>
                        ))}
                        {buyerCostCenters.length > 2 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{buyerCostCenters.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <ResponsiveModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingBuyer ? "Editar Comprador" : "Novo Comprador"}
        description={editingBuyer ? "Atualize as informações do comprador." : "Cadastre um novo comprador autorizado."}
      >
        <div className="space-y-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Papel</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Comprador
                    </div>
                  </SelectItem>
                  <SelectItem value="approver">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Aprovador
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      Administrador
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spendLimit">Limite de Gastos (R$)</Label>
              <Input
                id="spendLimit"
                type="number"
                placeholder="0,00"
                value={formData.spendLimit}
                onChange={(e) => setFormData({ ...formData, spendLimit: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Centros de Custo Permitidos</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {costCenters.map(cc => (
                <div
                  key={cc.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    formData.costCenterIds.includes(cc.id) 
                      ? "border-primary bg-primary/5" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => toggleCostCenter(cc.id)}
                >
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center",
                    formData.costCenterIds.includes(cc.id) 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground"
                  )}>
                    {formData.costCenterIds.includes(cc.id) && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{cc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Saldo: R$ {cc.availableBudget.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Label htmlFor="isActive">Comprador Ativo</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {editingBuyer ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </div>
        </div>
      </ResponsiveModal>
    </PageContainer>
  )
}
