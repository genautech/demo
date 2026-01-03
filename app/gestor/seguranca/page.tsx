"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Key,
  Shield,
  Users,
  UserPlus,
  Mail,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  LayoutDashboard,
  FileText,
  Wallet,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Tipos para gestão de acessos
interface AccessUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "viewer" | "editor" | "admin"
  permissions: {
    dashboard: boolean
    orcamentos: boolean
    budgets: boolean
  }
  status: "active" | "pending" | "inactive"
  invitedAt: string
  lastAccess?: string
}

// Dados iniciais de acessos (simulado)
const initialAccessUsers: AccessUser[] = [
  {
    id: "access_1",
    email: "maria.silva@empresa.com",
    firstName: "Maria",
    lastName: "Silva",
    role: "editor",
    permissions: { dashboard: true, orcamentos: true, budgets: false },
    status: "active",
    invitedAt: "2024-01-15T10:00:00Z",
    lastAccess: "2024-01-20T14:30:00Z",
  },
  {
    id: "access_2",
    email: "joao.santos@empresa.com",
    firstName: "João",
    lastName: "Santos",
    role: "viewer",
    permissions: { dashboard: true, orcamentos: false, budgets: false },
    status: "active",
    invitedAt: "2024-01-10T09:00:00Z",
    lastAccess: "2024-01-19T11:00:00Z",
  },
  {
    id: "access_3",
    email: "ana.costa@empresa.com",
    firstName: "Ana",
    lastName: "Costa",
    role: "admin",
    permissions: { dashboard: true, orcamentos: true, budgets: true },
    status: "pending",
    invitedAt: "2024-01-20T16:00:00Z",
  },
]

const PERMISSION_LABELS = {
  dashboard: { label: "Dashboard Gestor", icon: LayoutDashboard, description: "Acesso ao painel principal de gestão" },
  orcamentos: { label: "Orçamentos", icon: FileText, description: "Visualizar e gerenciar orçamentos" },
  budgets: { label: "Gestão de Verbas", icon: Wallet, description: "Controle de verbas e alocação" },
}

const ROLE_LABELS: Record<AccessUser["role"], { label: string; color: string }> = {
  viewer: { label: "Visualizador", color: "bg-slate-100 text-slate-700" },
  editor: { label: "Editor", color: "bg-blue-100 text-blue-700" },
  admin: { label: "Administrador", color: "bg-purple-100 text-purple-700" },
}

const STATUS_LABELS: Record<AccessUser["status"], { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Ativo", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-700", icon: Clock },
  inactive: { label: "Inativo", color: "bg-rose-100 text-rose-700", icon: XCircle },
}

export default function SegurancaPage() {
  const router = useRouter()
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>([])
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  
  // New access dialog
  const [isNewAccessOpen, setIsNewAccessOpen] = useState(false)
  const [newAccessForm, setNewAccessForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "viewer" as AccessUser["role"],
    permissions: {
      dashboard: true,
      orcamentos: false,
      budgets: false,
    },
  })
  
  // Edit access dialog
  const [isEditAccessOpen, setIsEditAccessOpen] = useState(false)
  const [selectedAccess, setSelectedAccess] = useState<AccessUser | null>(null)
  const [editAccessForm, setEditAccessForm] = useState({
    role: "viewer" as AccessUser["role"],
    permissions: {
      dashboard: true,
      orcamentos: false,
      budgets: false,
    },
  })

  useEffect(() => {
    // Carregar acessos do localStorage ou usar dados iniciais
    const stored = localStorage.getItem("yoobe_access_users")
    if (stored) {
      try {
        setAccessUsers(JSON.parse(stored))
      } catch {
        setAccessUsers(initialAccessUsers)
      }
    } else {
      setAccessUsers(initialAccessUsers)
      localStorage.setItem("yoobe_access_users", JSON.stringify(initialAccessUsers))
    }
  }, [])

  const saveAccessUsers = (users: AccessUser[]) => {
    setAccessUsers(users)
    localStorage.setItem("yoobe_access_users", JSON.stringify(users))
  }

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Preencha todos os campos")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não conferem")
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("A nova senha deve ter pelo menos 8 caracteres")
      return
    }
    
    // Simular alteração de senha
    toast.success("Senha alterada com sucesso!")
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleAddAccess = () => {
    if (!newAccessForm.email || !newAccessForm.firstName) {
      toast.error("Email e nome são obrigatórios")
      return
    }
    
    // Verificar se email já existe
    if (accessUsers.some(u => u.email.toLowerCase() === newAccessForm.email.toLowerCase())) {
      toast.error("Este email já possui acesso")
      return
    }
    
    const newUser: AccessUser = {
      id: `access_${Date.now()}`,
      email: newAccessForm.email,
      firstName: newAccessForm.firstName,
      lastName: newAccessForm.lastName,
      role: newAccessForm.role,
      permissions: { ...newAccessForm.permissions },
      status: "pending",
      invitedAt: new Date().toISOString(),
    }
    
    const updated = [...accessUsers, newUser]
    saveAccessUsers(updated)
    
    toast.success(`Convite enviado para ${newAccessForm.email}`)
    setIsNewAccessOpen(false)
    setNewAccessForm({
      email: "",
      firstName: "",
      lastName: "",
      role: "viewer",
      permissions: { dashboard: true, orcamentos: false, budgets: false },
    })
  }

  const openEditAccess = (user: AccessUser) => {
    setSelectedAccess(user)
    setEditAccessForm({
      role: user.role,
      permissions: { ...user.permissions },
    })
    setIsEditAccessOpen(true)
  }

  const handleSaveAccess = () => {
    if (!selectedAccess) return
    
    const updated = accessUsers.map(u => 
      u.id === selectedAccess.id 
        ? { ...u, role: editAccessForm.role, permissions: { ...editAccessForm.permissions } }
        : u
    )
    saveAccessUsers(updated)
    
    toast.success("Permissões atualizadas")
    setIsEditAccessOpen(false)
    setSelectedAccess(null)
  }

  const handleRemoveAccess = (userId: string) => {
    const updated = accessUsers.filter(u => u.id !== userId)
    saveAccessUsers(updated)
    toast.success("Acesso removido")
  }

  const handleResendInvite = (user: AccessUser) => {
    toast.success(`Convite reenviado para ${user.email}`)
  }

  const activeCount = accessUsers.filter(u => u.status === "active").length
  const pendingCount = accessUsers.filter(u => u.status === "pending").length

  return (
    <PageContainer className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/gestor/perfil")} className="rounded-xl">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Segurança e Acessos</h1>
          <p className="text-muted-foreground">Gerencie sua senha e controle quem pode acessar o painel de gestão.</p>
        </div>
      </div>

      {/* Alterar Senha */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Mantenha sua conta segura atualizando sua senha periodicamente.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Senha Atual</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="pr-10 h-11 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="pr-10 h-11 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita a nova senha"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="pr-10 h-11 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword} className="rounded-xl gap-2">
              <Lock className="h-4 w-4" />
              Alterar Senha
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gestão de Acessos */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Gestão de Acessos</CardTitle>
                <CardDescription>Controle quem pode acessar o Dashboard, Orçamentos e Gestão de Verbas.</CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsNewAccessOpen(true)} className="rounded-xl gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Acesso
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{accessUsers.length}</p>
                  <p className="text-xs text-slate-500 font-medium">Total de acessos</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{activeCount}</p>
                  <p className="text-xs text-emerald-600 font-medium">Acessos ativos</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
                  <p className="text-xs text-amber-600 font-medium">Convites pendentes</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lista de Acessos */}
          {accessUsers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Nenhum acesso configurado</p>
              <p className="text-sm text-slate-400">Clique em "Novo Acesso" para convidar colaboradores.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Usuário</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Função</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Permissões</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessUsers.map((user) => {
                    const StatusIcon = STATUS_LABELS[user.status].icon
                    return (
                      <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {user.firstName.charAt(0)}{user.lastName?.charAt(0) || ""}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{user.firstName} {user.lastName}</p>
                              <p className="text-[10px] text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px] font-bold border-none", ROLE_LABELS[user.role].color)}>
                            {ROLE_LABELS[user.role].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.permissions.dashboard && (
                              <Badge variant="outline" className="text-[9px] gap-1 py-0.5">
                                <LayoutDashboard className="h-3 w-3" />
                                Dashboard
                              </Badge>
                            )}
                            {user.permissions.orcamentos && (
                              <Badge variant="outline" className="text-[9px] gap-1 py-0.5">
                                <FileText className="h-3 w-3" />
                                Orçamentos
                              </Badge>
                            )}
                            {user.permissions.budgets && (
                              <Badge variant="outline" className="text-[9px] gap-1 py-0.5">
                                <Wallet className="h-3 w-3" />
                                Verbas
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px] font-bold border-none gap-1", STATUS_LABELS[user.status].color)}>
                            <StatusIcon className="h-3 w-3" />
                            {STATUS_LABELS[user.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {user.status === "pending" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleResendInvite(user)}
                                className="h-8 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              >
                                <Mail className="h-3.5 w-3.5 mr-1" />
                                Reenviar
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditAccess(user)}
                              className="h-8 w-8 text-slate-400 hover:text-slate-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveAccess(user.id)}
                              className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog: Novo Acesso */}
      <Dialog open={isNewAccessOpen} onOpenChange={setIsNewAccessOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Convidar Novo Acesso</DialogTitle>
            <DialogDescription>
              Envie um convite para um colaborador acessar o painel de gestão.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Nome *</Label>
                <Input
                  placeholder="Maria"
                  value={newAccessForm.firstName}
                  onChange={(e) => setNewAccessForm({ ...newAccessForm, firstName: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Sobrenome</Label>
                <Input
                  placeholder="Silva"
                  value={newAccessForm.lastName}
                  onChange={(e) => setNewAccessForm({ ...newAccessForm, lastName: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="colaborador@empresa.com"
                  value={newAccessForm.email}
                  onChange={(e) => setNewAccessForm({ ...newAccessForm, email: e.target.value })}
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Função</Label>
              <Select
                value={newAccessForm.role}
                onValueChange={(value: AccessUser["role"]) => setNewAccessForm({ ...newAccessForm, role: value })}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Visualizador - Apenas visualiza</SelectItem>
                  <SelectItem value="editor">Editor - Pode editar dados</SelectItem>
                  <SelectItem value="admin">Administrador - Acesso total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase text-slate-500">Permissões de Acesso</Label>
              {(Object.keys(PERMISSION_LABELS) as Array<keyof typeof PERMISSION_LABELS>).map((key) => {
                const perm = PERMISSION_LABELS[key]
                const Icon = perm.icon
                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50">
                        <Icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{perm.label}</p>
                        <p className="text-xs text-slate-400">{perm.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={newAccessForm.permissions[key]}
                      onCheckedChange={(checked) => 
                        setNewAccessForm({ 
                          ...newAccessForm, 
                          permissions: { ...newAccessForm.permissions, [key]: checked } 
                        })
                      }
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsNewAccessOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddAccess} className="rounded-xl gap-2">
              <UserPlus className="h-4 w-4" />
              Enviar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar Acesso */}
      <Dialog open={isEditAccessOpen} onOpenChange={setIsEditAccessOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Permissões</DialogTitle>
            <DialogDescription>
              {selectedAccess && `Atualize as permissões de ${selectedAccess.firstName} ${selectedAccess.lastName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Função</Label>
              <Select
                value={editAccessForm.role}
                onValueChange={(value: AccessUser["role"]) => setEditAccessForm({ ...editAccessForm, role: value })}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Visualizador - Apenas visualiza</SelectItem>
                  <SelectItem value="editor">Editor - Pode editar dados</SelectItem>
                  <SelectItem value="admin">Administrador - Acesso total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase text-slate-500">Permissões de Acesso</Label>
              {(Object.keys(PERMISSION_LABELS) as Array<keyof typeof PERMISSION_LABELS>).map((key) => {
                const perm = PERMISSION_LABELS[key]
                const Icon = perm.icon
                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50">
                        <Icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{perm.label}</p>
                        <p className="text-xs text-slate-400">{perm.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={editAccessForm.permissions[key]}
                      onCheckedChange={(checked) => 
                        setEditAccessForm({ 
                          ...editAccessForm, 
                          permissions: { ...editAccessForm.permissions, [key]: checked } 
                        })
                      }
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsEditAccessOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveAccess} className="rounded-xl gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
