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
} from "@/components/ui/dialog"
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
import { PageContainer } from "@/components/page-container"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Shield,
  Building,
  RefreshCw,
} from "lucide-react"
import {
  getUsers,
  getCompanies,
  saveUsers,
  getTagsV3,
  createUser,
  deleteUser,
  getUserByEmail,
  type User,
  type Company,
  type Tag,
} from "@/lib/storage"
import { UserRole } from "@/lib/roles"
import { toast } from "sonner"

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    companyId: undefined,
    role: "member",
    points: 0,
    tags: [],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setUsers(getUsers())
    setCompanies(getCompanies())
    setTags(getTagsV3())
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase())
    
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    const matchesCompany = companyFilter === "all" || u.companyId === companyFilter
    
    return matchesSearch && matchesRole && matchesCompany
  })

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    const allUsers = getUsers()
    const index = allUsers.findIndex(u => u.id === userId)
    if (index > -1) {
      allUsers[index] = { ...allUsers[index], ...updates }
      saveUsers(allUsers)
      loadData()
      toast.success(`Usuário atualizado com sucesso`)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      companyId: undefined,
      role: "member",
      points: 0,
      tags: [],
    })
    setSelectedUser(null)
    setIsCreateMode(false)
  }

  const handleOpenCreateDialog = () => {
    resetForm()
    setIsCreateMode(true)
    setIsDialogOpen(true)
  }

  const handleOpenEditDialog = (user: User) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
      points: user.points,
      tags: user.tags || [],
    })
    setSelectedUser(user)
    setIsCreateMode(false)
    setIsDialogOpen(true)
  }

  const handleSaveUser = () => {
    // Validações
    if (!formData.firstName || !formData.lastName) {
      toast.error("Nome e sobrenome são obrigatórios")
      return
    }
    if (!formData.email) {
      toast.error("Email é obrigatório")
      return
    }

    // Verificar email único (apenas em modo criação ou se email mudou)
    if (isCreateMode || (selectedUser && formData.email !== selectedUser.email)) {
      const existingUser = getUserByEmail(formData.email)
      
      if (existingUser) {
        toast.error("Este email já está em uso")
        return
      }
    }

    try {
      if (isCreateMode) {
        // Criar novo usuário
        createUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          companyId: formData.companyId || undefined,
          role: (formData.role as UserRole) || "member",
          points: formData.points || 0,
          tags: formData.tags || [],
        })
        
        toast.success("Usuário criado com sucesso")
      } else if (selectedUser) {
        // Atualizar usuário existente
        handleUpdateUser(selectedUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          companyId: formData.companyId || undefined,
          role: (formData.role as UserRole) || selectedUser.role,
          points: formData.points ?? selectedUser.points,
          tags: formData.tags || [],
        })
      }
      loadData()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar usuário")
      console.error(error)
    }
  }

  const handleDeleteClick = (user: User) => {
    setDeleteConfirmUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmUser) {
      const success = deleteUser(deleteConfirmUser.id)
      if (success) {
        toast.success("Usuário deletado com sucesso")
        loadData()
      } else {
        toast.error("Erro ao deletar usuário")
      }
      setIsDeleteDialogOpen(false)
      setDeleteConfirmUser(null)
    }
  }

  const userStats = {
    total: users.length,
    superAdmins: users.filter(u => u.role === 'superAdmin').length,
    managers: users.filter(u => u.role === 'manager').length,
    members: users.filter(u => u.role === 'member').length,
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão Global de Usuários</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie todos os usuários do sistema, atribua papéis e tags
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={handleOpenCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Insights Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold">{userStats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold text-blue-600">{userStats.superAdmins}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gestores</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold text-green-600">{userStats.managers}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-2xl font-bold text-orange-600">{userStats.members}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os papéis</SelectItem>
                <SelectItem value="superAdmin">Super Admin</SelectItem>
                <SelectItem value="manager">Gestor</SelectItem>
                <SelectItem value="member">Membro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {companies.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const company = companies.find(c => c.id === user.companyId)
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company ? (
                        <div className="flex items-center gap-2">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{company.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sem empresa</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(user.tags || []).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] h-5">
                            {tag}
                          </Badge>
                        ))}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 rounded-full"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Select 
                          value={user.companyId || "none"} 
                          onValueChange={(val) => handleUpdateUser(user.id, { companyId: val === "none" ? undefined : val })}
                        >
                          <SelectTrigger className="w-[150px] h-8 text-xs">
                            <SelectValue placeholder="Sem empresa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sem empresa</SelectItem>
                            {companies.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Create/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateMode ? "Criar Novo Usuário" : `Editar Usuário: ${selectedUser?.firstName}`}
            </DialogTitle>
            <DialogDescription>
              {isCreateMode 
                ? "Preencha os dados para criar um novo usuário no sistema"
                : "Gerencie todas as informações do usuário"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="João"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Silva"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao.silva@example.com"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyId">Empresa</Label>
                <Select
                  value={formData.companyId || "none"}
                  onValueChange={(val) => setFormData({ ...formData, companyId: val === "none" ? undefined : val })}
                >
                  <SelectTrigger id="companyId">
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem empresa</SelectItem>
                    {companies.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Papel *</Label>
                <Select
                  value={formData.role || "member"}
                  onValueChange={(val) => setFormData({ ...formData, role: val as UserRole })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                    <SelectItem value="manager">Gestor</SelectItem>
                    <SelectItem value="member">Membro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Pontos Iniciais</Label>
              <Input
                id="points"
                type="number"
                min="0"
                value={formData.points || 0}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const isSelected = formData.tags?.includes(tag.name) || false
                  return (
                    <Badge 
                      key={tag.id}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const currentTags = formData.tags || []
                        const newTags = isSelected
                          ? currentTags.filter(t => t !== tag.name)
                          : [...currentTags, tag.name]
                        setFormData({ ...formData, tags: newTags })
                      }}
                    >
                      {tag.name}
                    </Badge>
                  )
                })}
                {tags.length === 0 && (
                  <span className="text-sm text-muted-foreground">Nenhuma tag disponível</span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false)
              resetForm()
            }}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {isCreateMode ? "Criar Usuário" : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{deleteConfirmUser?.firstName} {deleteConfirmUser?.lastName}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}
