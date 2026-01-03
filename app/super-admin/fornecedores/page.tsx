"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Check,
  X,
  Clock,
  Key,
  Copy,
  ExternalLink,
  Package,
  History,
  Zap,
  Globe,
  Phone,
  Mail,
  Settings,
} from "lucide-react"
import { 
  getSuppliers, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier,
  approveSupplier,
  countSupplierProducts,
  getSupplierTokens,
  createSupplierToken,
  revokeSupplierToken,
  getCompanies,
  type Supplier,
  type SupplierToken,
  type SupplierApiType,
  type SupplierStatus,
  type Company,
} from "@/lib/storage"
import { toast } from "sonner"
import Link from "next/link"

const API_TYPES: { value: SupplierApiType; label: string }[] = [
  { value: "spot_brindes", label: "Spot Brindes" },
  { value: "custom", label: "API Customizada" },
  { value: "manual", label: "Manual (sem API)" },
]

const STATUS_CONFIG: Record<SupplierStatus, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: "Ativo", color: "bg-green-100 text-green-800", icon: <Check className="h-3 w-3" /> },
  inactive: { label: "Inativo", color: "bg-gray-100 text-gray-800", icon: <X className="h-3 w-3" /> },
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
}

interface SupplierFormData {
  name: string
  slug: string
  apiType: SupplierApiType
  apiEndpoint: string
  apiKey: string
  email: string
  phone: string
  website: string
  cnpj: string
  address: string
  notes: string
  autoSyncPrices: boolean
  autoSyncStock: boolean
  syncInterval: number
}

const initialFormData: SupplierFormData = {
  name: "",
  slug: "",
  apiType: "manual",
  apiEndpoint: "",
  apiKey: "",
  email: "",
  phone: "",
  website: "",
  cnpj: "",
  address: "",
  notes: "",
  autoSyncPrices: false,
  autoSyncStock: false,
  syncInterval: 60,
}

export default function FornecedoresPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [tokens, setTokens] = useState<SupplierToken[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)
  
  // Form states
  const [formData, setFormData] = useState<SupplierFormData>(initialFormData)
  
  // Token form state
  const [tokenForm, setTokenForm] = useState({
    companyId: "",
    permissions: ["add_supplier", "link_products", "sync_data"] as string[],
    expiresInDays: 30,
    maxUses: 0,
  })
  const [newToken, setNewToken] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoading(true)
    try {
      const suppliersData = getSuppliers()
      // Adicionar contagem de produtos
      const suppliersWithCounts = suppliersData.map(s => ({
        ...s,
        productsCount: countSupplierProducts(s.id),
      }))
      setSuppliers(suppliersWithCounts)
      setTokens(getSupplierTokens())
      setCompanies(getCompanies())
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar fornecedores")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingSupplier(null)
    setFormData(initialFormData)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      slug: supplier.slug,
      apiType: supplier.apiType,
      apiEndpoint: supplier.apiEndpoint || "",
      apiKey: supplier.apiKey || "",
      email: supplier.contactInfo.email || "",
      phone: supplier.contactInfo.phone || "",
      website: supplier.contactInfo.website || "",
      cnpj: supplier.metadata.cnpj || "",
      address: supplier.metadata.address || "",
      notes: supplier.metadata.notes || "",
      autoSyncPrices: supplier.syncSettings.autoSyncPrices,
      autoSyncStock: supplier.syncSettings.autoSyncStock,
      syncInterval: supplier.syncSettings.syncInterval,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Nome é obrigatório")
      return
    }

    const supplierData: Partial<Supplier> = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      apiType: formData.apiType,
      apiEndpoint: formData.apiEndpoint || undefined,
      apiKey: formData.apiKey || undefined,
      contactInfo: {
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
      },
      metadata: {
        cnpj: formData.cnpj || undefined,
        address: formData.address || undefined,
        notes: formData.notes || undefined,
      },
      syncSettings: {
        autoSyncPrices: formData.autoSyncPrices,
        autoSyncStock: formData.autoSyncStock,
        syncInterval: formData.syncInterval,
      },
    }

    try {
      if (editingSupplier) {
        updateSupplier(editingSupplier.id, supplierData)
        toast.success("Fornecedor atualizado com sucesso")
      } else {
        createSupplier({ ...supplierData, status: "active" }, "super_admin")
        toast.success("Fornecedor criado com sucesso")
      }
      setIsDialogOpen(false)
      loadData()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar fornecedor")
    }
  }

  const handleDelete = () => {
    if (!deletingSupplier) return
    
    try {
      deleteSupplier(deletingSupplier.id)
      toast.success("Fornecedor excluído com sucesso")
      setIsDeleteDialogOpen(false)
      setDeletingSupplier(null)
      loadData()
    } catch (error) {
      console.error("Erro ao excluir:", error)
      toast.error("Erro ao excluir fornecedor")
    }
  }

  const handleApprove = (supplier: Supplier) => {
    try {
      approveSupplier(supplier.id, "super_admin")
      toast.success("Fornecedor aprovado com sucesso")
      loadData()
    } catch (error) {
      console.error("Erro ao aprovar:", error)
      toast.error("Erro ao aprovar fornecedor")
    }
  }

  const handleCreateToken = () => {
    if (!tokenForm.companyId) {
      toast.error("Selecione uma empresa")
      return
    }

    try {
      const expiresAt = tokenForm.expiresInDays > 0 
        ? new Date(Date.now() + tokenForm.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined

      const token = createSupplierToken(
        tokenForm.companyId,
        tokenForm.permissions as SupplierToken["permissions"],
        "super_admin",
        {
          expiresAt,
          maxUses: tokenForm.maxUses > 0 ? tokenForm.maxUses : undefined,
        }
      )
      
      setNewToken(token.token)
      toast.success("Token criado com sucesso")
      loadData()
    } catch (error) {
      console.error("Erro ao criar token:", error)
      toast.error("Erro ao criar token")
    }
  }

  const handleRevokeToken = (tokenId: string) => {
    try {
      revokeSupplierToken(tokenId)
      toast.success("Token revogado")
      loadData()
    } catch (error) {
      console.error("Erro ao revogar:", error)
      toast.error("Erro ao revogar token")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copiado para a área de transferência")
  }

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCount = suppliers.filter(s => s.status === "active").length
  const pendingCount = suppliers.filter(s => s.status === "pending").length
  const totalProducts = suppliers.reduce((acc, s) => acc + (s.productsCount || 0), 0)

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Fornecedores</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie fornecedores, APIs de integração e tokens de autorização
          </p>
        </div>
        <Button className="gap-2" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{suppliers.length}</p>
                <p className="text-sm text-muted-foreground">Total de Fornecedores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-sm text-muted-foreground">Produtos Vinculados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
          <TabsTrigger value="tokens">Tokens de Autorização</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por nome ou slug..." 
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={loadData}>
                  <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Tipo de API</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Última Sinc.</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Nenhum fornecedor encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{supplier.name}</p>
                              <p className="text-xs text-muted-foreground">{supplier.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            {supplier.apiType === "spot_brindes" && <Zap className="h-3 w-3" />}
                            {supplier.apiType === "custom" && <Globe className="h-3 w-3" />}
                            {supplier.apiType === "manual" && <Settings className="h-3 w-3" />}
                            {API_TYPES.find(t => t.value === supplier.apiType)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`gap-1 ${STATUS_CONFIG[supplier.status].color}`}>
                            {STATUS_CONFIG[supplier.status].icon}
                            {STATUS_CONFIG[supplier.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{supplier.productsCount || 0}</span>
                        </TableCell>
                        <TableCell>
                          {supplier.syncSettings.lastSync ? (
                            <span className="text-sm text-muted-foreground">
                              {new Date(supplier.syncSettings.lastSync).toLocaleDateString('pt-BR')}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {supplier.status === "pending" && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-green-600"
                                onClick={() => handleApprove(supplier)}
                                title="Aprovar"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleOpenEdit(supplier)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Link href={`/super-admin/fornecedores/logs?supplierId=${supplier.id}`}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                title="Ver Logs"
                              >
                                <History className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setDeletingSupplier(supplier)
                                setIsDeleteDialogOpen(true)
                              }}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tokens de Autorização</CardTitle>
                  <CardDescription>
                    Tokens permitem que gestores adicionem fornecedores via API
                  </CardDescription>
                </div>
                <Button onClick={() => { setNewToken(null); setIsTokenDialogOpen(true) }}>
                  <Key className="h-4 w-4 mr-2" />
                  Novo Token
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Nenhum token criado
                      </TableCell>
                    </TableRow>
                  ) : (
                    tokens.map((token) => {
                      const company = companies.find(c => c.id === token.companyId)
                      const isExpired = token.expiresAt && new Date(token.expiresAt) < new Date()
                      
                      return (
                        <TableRow key={token.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                {token.token.substring(0, 12)}...
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(token.token)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{company?.name || token.companyId}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {token.permissions.map(p => (
                                <Badge key={p} variant="secondary" className="text-[10px]">
                                  {p.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {token.usedCount}
                            {token.maxUses ? ` / ${token.maxUses}` : ''}
                          </TableCell>
                          <TableCell>
                            {token.expiresAt ? (
                              <span className={isExpired ? "text-red-600" : ""}>
                                {new Date(token.expiresAt).toLocaleDateString('pt-BR')}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Nunca</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {!token.isActive ? (
                              <Badge variant="destructive">Revogado</Badge>
                            ) : isExpired ? (
                              <Badge variant="destructive">Expirado</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {token.isActive && !isExpired && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => handleRevokeToken(token.id)}
                              >
                                Revogar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Supplier Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
            <DialogDescription>
              Preencha as informações do fornecedor para cadastro ou edição.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do fornecedor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="slug-do-fornecedor"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de API</Label>
              <Select 
                value={formData.apiType} 
                onValueChange={(value: SupplierApiType) => setFormData({ ...formData, apiType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {API_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.apiType !== "manual" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">Endpoint da API</Label>
                  <Input
                    id="apiEndpoint"
                    value={formData.apiEndpoint}
                    onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                    placeholder="https://api.fornecedor.com/v1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Chave da API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="••••••••••••"
                  />
                </div>
              </>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Informações de Contato</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@fornecedor.com"
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
              <div className="space-y-2 mt-4">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://fornecedor.com"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Dados Fiscais</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Endereço completo"
                />
              </div>
            </div>

            {formData.apiType !== "manual" && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Configurações de Sincronização</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Sincronizar Preços Automaticamente</p>
                      <p className="text-xs text-muted-foreground">Atualizar preços dos produtos periodicamente</p>
                    </div>
                    <Switch
                      checked={formData.autoSyncPrices}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoSyncPrices: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Sincronizar Estoque Automaticamente</p>
                      <p className="text-xs text-muted-foreground">Atualizar disponibilidade dos produtos</p>
                    </div>
                    <Switch
                      checked={formData.autoSyncStock}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoSyncStock: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="syncInterval">Intervalo de Sincronização (minutos)</Label>
                    <Input
                      id="syncInterval"
                      type="number"
                      min={5}
                      value={formData.syncInterval}
                      onChange={(e) => setFormData({ ...formData, syncInterval: parseInt(e.target.value) || 60 })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas adicionais sobre o fornecedor..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Token Dialog */}
      <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Token de Autorização</DialogTitle>
            <DialogDescription>
              Tokens permitem que gestores adicionem fornecedores via API externa.
            </DialogDescription>
          </DialogHeader>
          
          {newToken ? (
            <div className="space-y-4 py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 mb-2">Token criado com sucesso!</p>
                <p className="text-xs text-green-600 mb-3">
                  Copie o token abaixo. Ele não será exibido novamente.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-white px-3 py-2 rounded border font-mono break-all">
                    {newToken}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(newToken)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button className="w-full" onClick={() => setIsTokenDialogOpen(false)}>
                Fechar
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Empresa *</Label>
                  <Select 
                    value={tokenForm.companyId} 
                    onValueChange={(value) => setTokenForm({ ...tokenForm, companyId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Expiração (dias)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={tokenForm.expiresInDays}
                    onChange={(e) => setTokenForm({ ...tokenForm, expiresInDays: parseInt(e.target.value) || 0 })}
                    placeholder="0 = nunca expira"
                  />
                  <p className="text-xs text-muted-foreground">0 = token nunca expira</p>
                </div>

                <div className="space-y-2">
                  <Label>Limite de Usos</Label>
                  <Input
                    type="number"
                    min={0}
                    value={tokenForm.maxUses}
                    onChange={(e) => setTokenForm({ ...tokenForm, maxUses: parseInt(e.target.value) || 0 })}
                    placeholder="0 = sem limite"
                  />
                  <p className="text-xs text-muted-foreground">0 = sem limite de uso</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTokenDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateToken}>Criar Token</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Fornecedor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o fornecedor &quot;{deletingSupplier?.name}&quot;?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}
