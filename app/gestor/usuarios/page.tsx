"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Coins,
  Plus,
  Minus,
  History,
  Search,
  TrendingUp,
  TrendingDown,
  Edit,
  Tag,
  X,
  MapPin,
  Trophy,
  ShoppingBag,
  UserPlus,
  Upload,
  Mail,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Eye,
} from "lucide-react"
import {
  getUsers,
  saveUsers,
  getUserTransactions,
  addPoints,
  deductPoints,
  getTags,
  addTagToUser,
  removeTagFromUser,
  getCurrencyName,
  createUser,
  getUserByEmail,
  updateUser,
  type User as UserType,
  type PointsTransaction,
  type UserLevel,
} from "@/lib/storage"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { UserDetailModal } from "@/components/modals"

function getFullName(user: UserType): string {
  return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Sem nome"
}

function getInitials(user: UserType): string {
  const first = user.firstName?.charAt(0) || ""
  const last = user.lastName?.charAt(0) || ""
  return (first + last).toUpperCase() || "?"
}

function getLevelColor(level: UserLevel): string {
  const colors: Record<UserLevel, string> = {
    bronze: "bg-amber-700 dark:bg-amber-600",
    silver: "bg-gray-500 dark:bg-gray-400",
    gold: "bg-yellow-500 dark:bg-yellow-400",
    platinum: "bg-slate-400 dark:bg-slate-300",
    diamond: "bg-cyan-500 dark:bg-cyan-400",
  }
  return colors[level] || "bg-gray-500"
}

function getLevelLabel(level: UserLevel): string {
  const labels: Record<UserLevel, string> = {
    bronze: "Bronze",
    silver: "Prata",
    gold: "Ouro",
    platinum: "Platina",
    diamond: "Diamante",
  }
  return labels[level] || level
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tagFilter, setTagFilter] = useState("")
  const [levelFilter, setLevelFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [userTransactions, setUserTransactions] = useState<PointsTransaction[]>([])
  const [companyId, setCompanyId] = useState<string>("company_1")

  // UI states
  const [isAddPointsOpen, setIsAddPointsOpen] = useState(false)
  const [isDeductPointsOpen, setIsDeductPointsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

  // Form states
  const [pointsAmount, setPointsAmount] = useState("")
  const [pointsDescription, setPointsDescription] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newUserForm, setNewUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [inviteEmail, setInviteEmail] = useState("")
  const [importFile, setImportFile] = useState<File | null>(null)

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    stateCode: "",
    zipcode: "",
  })

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch {}
    }
    setUsers(getUsers())
    setAllTags(getTags())
  }, [])

  const filteredUsers = users.filter((user) => {
    const fullName = getFullName(user).toLowerCase()
    const userEmail = user.email || ""
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) || userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const userTags = user.tags || []
    const matchesTag = !tagFilter || tagFilter === "all" || userTags.includes(tagFilter)
    const matchesLevel = !levelFilter || levelFilter === "all" || user.level === levelFilter
    return matchesSearch && matchesTag && matchesLevel
  })

  const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0)
  const averagePoints = users.length > 0 ? Math.round(totalPoints / users.length) : 0
  const totalPurchases = users.reduce((sum, user) => sum + (user.totalPurchases || 0), 0)

  const handleAddPoints = () => {
    if (!selectedUser || !pointsAmount) return
    const amount = Number.parseInt(pointsAmount)
    if (isNaN(amount) || amount <= 0) return

    const currencyPlural = getCurrencyName(companyId, true)
    addPoints(selectedUser.id, amount, pointsDescription || `Adição manual de ${currencyPlural.toUpperCase()}`)
    setUsers(getUsers())
    setPointsAmount("")
    setPointsDescription("")
    setIsAddPointsOpen(false)
  }

  const handleDeductPoints = () => {
    if (!selectedUser || !pointsAmount) return
    const amount = Number.parseInt(pointsAmount)
    if (isNaN(amount) || amount <= 0) return

    const currencyPlural = getCurrencyName(companyId, true)
    deductPoints(selectedUser.id, amount, pointsDescription || `Dedução manual de ${currencyPlural.toUpperCase()}`)
    setUsers(getUsers())
    setPointsAmount("")
    setPointsDescription("")
    setIsDeductPointsOpen(false)
  }

  const openEditUser = (user: UserType) => {
    setSelectedUser(user)
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "" ,
      email: user.email || "" ,
      phone: user.phone || "" ,
      address1: user.address?.address1 || "" ,
      address2: user.address?.address2 || "" ,
      city: user.address?.city || "" ,
      stateCode: user.address?.stateCode || "" ,
      zipcode: user.address?.zipcode || "" ,
    })
    setIsEditUserOpen(true)
  }

  const handleSaveUser = () => {
    if (!selectedUser || !editForm.firstName || !editForm.email) {
      toast.error("Nome e email são obrigatórios")
      return
    }

    try {
      // Usar updateUser que valida email único
      const updated = updateUser(selectedUser.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        address: {
          address1: editForm.address1,
          address2: editForm.address2,
          city: editForm.city,
          stateCode: editForm.stateCode,
          zipcode: editForm.zipcode,
          country: "BR",
        },
      })
      
      if (updated) {
        setUsers(getUsers())
        setIsEditUserOpen(false)
        toast.success("Usuário atualizado com sucesso")
      } else {
        toast.error("Usuário não encontrado")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar usuário")
    }
  }

  const openHistory = (user: UserType) => {
    setSelectedUser(user)
    setUserTransactions(getUserTransactions(user.id))
    setIsHistoryOpen(true)
  }

  const openTags = (user: UserType) => {
    setSelectedUser(user)
    setIsTagsOpen(true)
  }

  const handleAddTag = () => {
    if (!selectedUser || !newTag.trim()) return
    addTagToUser(selectedUser.id, newTag.trim())
    setUsers(getUsers())
    setSelectedUser(getUsers().find((u) => u.id === selectedUser.id) || null)
    setNewTag("")
  }

  const handleRemoveTag = (tag: string) => {
    if (!selectedUser) return
    removeTagFromUser(selectedUser.id, tag)
    setUsers(getUsers())
    setSelectedUser(getUsers().find((u) => u.id === selectedUser.id) || null)
  }

  const handleAddUser = () => {
    if (!newUserForm.firstName || !newUserForm.email) {
      toast.error("Nome e email são obrigatórios")
      return
    }

    try {
      // Verificar email único antes de criar
      const existingUser = getUserByEmail(newUserForm.email)
      
      if (existingUser) {
        toast.error("Este email já está em uso")
        return
      }

      // Usar createUser que valida email único
      const newUser = createUser({
        email: newUserForm.email,
        firstName: newUserForm.firstName,
        lastName: newUserForm.lastName || "",
        phone: newUserForm.phone || "",
        role: "member",
        points: 0,
        companyId: companyId,
        tags: [],
      })

      setUsers(getUsers())
      setNewUserForm({ firstName: "", lastName: "", email: "", phone: "" })
      setIsAddUserOpen(false)
      toast.success("Usuário criado com sucesso")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar usuário")
    }
  }

  const handleInviteUser = () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      return
    }
    setInviteEmail("")
    setIsInviteUserOpen(false)
    alert(`Convite enviado para ${inviteEmail}! (Simulação)`)
  }

  const handleImportCSV = async () => {
    if (!importFile) return
    setImportFile(null)
    setIsImportOpen(false)
    alert(`Arquivo processado! (Simulação)`)
  }

  const handleExportCSV = () => {
    alert("CSV exportado com sucesso! (Simulação)")
  }

  return (
    <>
      <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Usuários</h1>
          <p className="text-muted-foreground font-medium">Gerencie o time e a distribuição de {getCurrencyName(companyId, true)}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="rounded-xl border-border">
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)} className="rounded-xl border-border">
            <Upload className="h-4 w-4 mr-2" /> Importar
          </Button>
          <Button size="sm" onClick={() => setIsAddUserOpen(true)} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <UserPlus className="h-4 w-4 mr-2" /> Novo Usuário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Usuários", value: users.length, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
          { label: `Total ${getCurrencyName(companyId, true)}`, value: totalPoints.toLocaleString(), icon: Coins, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
          { label: "Média p/ Usuário", value: averagePoints.toLocaleString(), icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
          { label: "Total Compras", value: totalPurchases, icon: ShoppingBag, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">{stat.label}</CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl border-border"
              />
            </div>
            <div className="w-[180px]">
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="h-11 rounded-xl border-border font-medium">
                  <SelectValue placeholder="Todas as tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="h-11 rounded-xl border-border font-medium">
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Prata</SelectItem>
                  <SelectItem value="gold">Ouro</SelectItem>
                  <SelectItem value="platinum">Platina</SelectItem>
                  <SelectItem value="diamond">Diamante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Membro</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tier</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{getCurrencyName(companyId, true).toUpperCase()}</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/5">
                        {getInitials(user)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">{getFullName(user)}</p>
                        <p className="text-[10px] text-muted-foreground font-medium truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-[9px] font-black border-none text-white", getLevelColor(user.level))}>
                      {getLevelLabel(user.level).toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-foreground">{(user.points || 0).toLocaleString()}</span>
                      <span className="text-[9px] font-black text-muted-foreground uppercase">{getCurrencyName(companyId, true)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => { setSelectedUser(user); setIsViewDetailsOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver Detalhes</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30" onClick={() => { setSelectedUser(user); setIsAddPointsOpen(true); }}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Crédito</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30" onClick={() => { setSelectedUser(user); setIsDeductPointsOpen(true); }}>
                            <Minus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Débito</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={() => openHistory(user)}>
                            <History className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Histórico</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={() => openTags(user)}>
                            <Tag className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Tags</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-muted" onClick={() => openEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>

    {/* Add Points Dialog */}
      <Dialog open={isAddPointsOpen} onOpenChange={setIsAddPointsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground">Lançar Crédito</DialogTitle>
            <DialogDescription className="font-medium">Bonifique {selectedUser ? getFullName(selectedUser) : "o membro"}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Quantidade</Label>
              <div className="relative">
                <Input type="number" placeholder="0" value={pointsAmount} onChange={(e) => setPointsAmount(e.target.value)} className="h-12 rounded-xl border-border font-black pl-10 focus-visible:ring-primary" />
                <Plus className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Motivo</Label>
              <Input placeholder="Ex: Meta batida, Premiação mensal..." value={pointsDescription} onChange={(e) => setPointsDescription(e.target.value)} className="h-12 rounded-xl border-border font-medium" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsAddPointsOpen(false)} className="font-bold text-muted-foreground">Cancelar</Button>
            <Button onClick={handleAddPoints} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black px-8 rounded-xl shadow-lg shadow-emerald-600/20">Confirmar Crédito</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    {/* Deduct Points Dialog */}
      <Dialog open={isDeductPointsOpen} onOpenChange={setIsDeductPointsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground">Lançar Débito</DialogTitle>
            <DialogDescription className="font-medium text-rose-600 dark:text-rose-400">Remover saldo de {selectedUser ? getFullName(selectedUser) : "o membro"}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Quantidade</Label>
              <div className="relative">
                <Input type="number" placeholder="0" value={pointsAmount} onChange={(e) => setPointsAmount(e.target.value)} className="h-12 rounded-xl border-border font-black pl-10 focus-visible:ring-primary" />
                <Minus className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500 dark:text-rose-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Motivo</Label>
              <Input placeholder="Ex: Estorno de pedido, Ajuste manual..." value={pointsDescription} onChange={(e) => setPointsDescription(e.target.value)} className="h-12 rounded-xl border-border font-medium" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDeductPointsOpen(false)} className="font-bold text-muted-foreground">Cancelar</Button>
            <Button onClick={handleDeductPoints} variant="destructive" className="font-black px-8 rounded-xl shadow-lg shadow-rose-600/20">Confirmar Débito</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <ResponsiveModal
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        title={
          <span className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Histórico - {selectedUser ? getFullName(selectedUser) : ""}
          </span>
        }
        description={<>Saldo atual: <span className="text-primary font-bold">{(selectedUser?.points || 0).toLocaleString()} {getCurrencyName(companyId, true)}</span></>}
        maxWidth="2xl"
        footer={
          <Button variant="outline" onClick={() => setIsHistoryOpen(false)} className="w-full font-bold h-12 rounded-xl border-border text-muted-foreground">
            Fechar Histórico
          </Button>
        }
      >
        <div className="space-y-4">
          {userTransactions.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <History className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground font-medium">Nenhuma transação encontrada</p>
            </div>
          ) : (
            userTransactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all group shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {new Date(tx.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  {tx.type === "credit" ? (
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-none font-bold text-[10px]">CRÉDITO</Badge>
                  ) : (
                    <Badge className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-none font-bold text-[10px]">DÉBITO</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{tx.description}</p>
                    {tx.orderNumber && (
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">Pedido: #{tx.orderNumber}</p>
                    )}
                  </div>
                  <div className={cn(
                    "text-lg font-black shrink-0",
                    tx.type === "credit" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )}>
                    {tx.type === "credit" ? "+" : "-"}
                    {(tx.amount || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ResponsiveModal>

      {/* Edit User Modal */}
      <ResponsiveModal
        open={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        title={
          <span className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Editar Usuário
          </span>
        }
        description="Atualize as informações cadastrais e endereço de entrega principal."
        maxWidth="2xl"
        className="space-y-6"
        footer={
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="ghost" onClick={() => setIsEditUserOpen(false)} className="text-muted-foreground font-bold h-12 rounded-xl sm:flex-1">
              Descartar
            </Button>
            <Button onClick={handleSaveUser} className="bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-xl shadow-lg shadow-primary/20 uppercase tracking-wider sm:flex-1">
              Salvar Alterações
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Nome</Label>
              <Input
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="h-12 rounded-xl border-border focus-visible:ring-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Sobrenome</Label>
              <Input
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="h-12 rounded-xl border-border focus-visible:ring-primary font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">E-mail Corporativo</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="h-12 rounded-xl border-border focus-visible:ring-primary font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Telefone</Label>
              <Input 
                value={editForm.phone} 
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} 
                className="h-12 rounded-xl border-border focus-visible:ring-primary font-medium"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-xs font-black uppercase text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Logística / Endereço
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Rua e Número</Label>
                <Input
                  value={editForm.address1}
                  onChange={(e) => setEditForm({ ...editForm, address1: e.target.value })}
                  placeholder="Ex: Av. Paulista, 1000"
                  className="h-12 rounded-xl border-border focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Complemento</Label>
                <Input
                  value={editForm.address2}
                  onChange={(e) => setEditForm({ ...editForm, address2: e.target.value })}
                  placeholder="Apartamento, bloco, etc."
                  className="h-12 rounded-xl border-border focus-visible:ring-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Cidade</Label>
                  <Input
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="h-12 rounded-xl border-border focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">UF</Label>
                  <Input
                    value={editForm.stateCode}
                    onChange={(e) => setEditForm({ ...editForm, stateCode: e.target.value })}
                    placeholder="SP"
                    maxLength={2}
                    className="h-12 rounded-xl border-border text-center uppercase focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">CEP</Label>
                  <Input
                    value={editForm.zipcode}
                    onChange={(e) => setEditForm({ ...editForm, zipcode: e.target.value })}
                    placeholder="00000-000"
                    className="h-12 rounded-xl border-border font-mono text-xs focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveModal>

      {/* Tags Modal */}
      <ResponsiveModal
        open={isTagsOpen}
        onOpenChange={setIsTagsOpen}
        title={
          <span className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Gerenciar Tags
          </span>
        }
        description={`Segmente ${selectedUser ? getFullName(selectedUser) : "o usuário"} para resgates e campanhas.`}
        maxWidth="md"
        className="space-y-6"
        footer={
          <Button variant="outline" onClick={() => setIsTagsOpen(false)} className="w-full font-bold h-12 rounded-xl border-border text-muted-foreground">
            Concluir Edição
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Adicionar Nova Tag</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Time Vendas, Gestor..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="h-12 rounded-xl border-border focus-visible:ring-primary"
              />
              <Button onClick={handleAddTag} className="bg-primary hover:bg-primary/90 rounded-xl h-12 px-5">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-black uppercase text-muted-foreground tracking-wider">Tags Atuais</Label>
            <div className="flex flex-wrap gap-2 p-5 border border-border rounded-2xl bg-muted/30 min-h-[120px]">
              {(selectedUser?.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-card border border-border text-foreground px-3 py-1.5 rounded-full flex items-center gap-2 group hover:border-rose-200 dark:hover:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all cursor-default">
                  <span className="font-bold text-xs">{tag}</span>
                  <button onClick={() => handleRemoveTag(tag)} className="text-muted-foreground group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
              {(selectedUser?.tags || []).length === 0 && (
                <div className="w-full flex flex-col items-center justify-center py-4 text-muted-foreground">
                  <Tag className="h-8 w-8 opacity-10 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-tighter">Nenhuma tag vinculada</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-black uppercase text-primary tracking-wider">Sugestões Rápidas</Label>
            <div className="flex flex-wrap gap-2">
              {allTags
                .filter((tag) => !(selectedUser?.tags || []).includes(tag))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/5 hover:text-primary hover:border-primary/20 border-border text-muted-foreground px-3 py-1.5 rounded-full transition-all"
                    onClick={() => {
                      setNewTag(tag)
                      handleAddTag()
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1.5" />
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </ResponsiveModal>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground">Novo Membro</DialogTitle>
            <DialogDescription className="font-medium">Cadastre um usuário manualmente no sistema.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Nome *</Label>
                <Input placeholder="João" value={newUserForm.firstName} onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Sobrenome</Label>
                <Input placeholder="Silva" value={newUserForm.lastName} onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })} className="h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">E-mail *</Label>
              <Input type="email" placeholder="joao@empresa.com" value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Telefone</Label>
              <Input placeholder="(11) 99999-9999" value={newUserForm.phone} onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })} className="h-11 rounded-xl" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsAddUserOpen(false)} className="font-bold text-muted-foreground">Cancelar</Button>
            <Button onClick={handleAddUser} className="bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-xl shadow-lg shadow-primary/20">Criar Usuário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={isInviteUserOpen} onOpenChange={setIsInviteUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground">Convidar Membro</DialogTitle>
            <DialogDescription className="font-medium">O convite será enviado por e-mail.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">E-mail do Convidado</Label>
              <div className="relative">
                <Input type="email" placeholder="nome@empresa.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="h-12 rounded-xl pl-10" />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic mt-1">O link de onboarding será válido por 24 horas.</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsInviteUserOpen(false)} className="font-bold text-muted-foreground">Cancelar</Button>
            <Button onClick={handleInviteUser} className="bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-xl shadow-lg shadow-primary/20">Enviar Convite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground">Importação em Massa</DialogTitle>
            <DialogDescription className="font-medium">Carregue sua base de usuários via CSV ou Excel.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group bg-muted/30">
              <div className="p-4 bg-card rounded-full w-fit mx-auto shadow-sm group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Clique para selecionar ou arraste o arquivo</p>
                <p className="text-xs text-muted-foreground font-medium">CSV, XLSX ou XLS (Max. 5MB)</p>
              </div>
              <Input type="file" accept=".csv,.xlsx" onChange={(e) => { const file = e.target.files?.[0]; if (file) setImportFile(file); }} className="hidden" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Formato Esperado</Label>
              <div className="bg-muted rounded-xl p-4 font-mono text-[10px] text-muted-foreground">
                email, nome, sobrenome, telefone, tags
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsImportOpen(false)} className="font-bold text-muted-foreground">Cancelar</Button>
            <Button onClick={handleImportCSV} disabled={!importFile} className="bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-xl">Iniciar Importação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        open={isViewDetailsOpen}
        onOpenChange={setIsViewDetailsOpen}
        companyId={companyId}
        onEdit={(user) => {
          setIsViewDetailsOpen(false)
          openEditUser(user)
        }}
        onAddPoints={(user) => {
          setIsViewDetailsOpen(false)
          setSelectedUser(user)
          setIsAddPointsOpen(true)
        }}
        onViewHistory={(user) => {
          setIsViewDetailsOpen(false)
          openHistory(user)
        }}
      />
    </>
  )
}

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
