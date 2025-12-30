"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
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
} from "lucide-react"
import {
  getUsers,
  saveUsers,
  getUserTransactions,
  addBrents,
  deductBrents,
  getTags,
  addTagToUser,
  removeTagFromUser,
  type User as UserType,
  type BrentTransaction,
  type UserLevel,
} from "@/lib/storage"

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
    bronze: "bg-amber-700",
    silver: "bg-gray-400",
    gold: "bg-yellow-500",
    platinum: "bg-slate-300",
    diamond: "bg-cyan-400",
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
  const [userTransactions, setUserTransactions] = useState<BrentTransaction[]>([])

  // Dialog states
  const [isAddBrentsOpen, setIsAddBrentsOpen] = useState(false)
  const [isDeductBrentsOpen, setIsDeductBrentsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)

  // Form states
  const [brentsAmount, setBrentsAmount] = useState("")
  const [brentsDescription, setBrentsDescription] = useState("")
  const [newTag, setNewTag] = useState("")

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
    setUsers(getUsers())
    setAllTags(getTags())
  }, [])

  const filteredUsers = users.filter((user) => {
    const fullName = getFullName(user).toLowerCase()
    const userEmail = user.email || ""
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) || userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const userTags = user.tags || []
    const matchesTag = !tagFilter || userTags.includes(tagFilter)
    const matchesLevel = !levelFilter || user.level === levelFilter
    return matchesSearch && matchesTag && matchesLevel
  })

  const totalBrents = users.reduce((sum, user) => sum + (user.brents || 0), 0)
  const averageBrents = users.length > 0 ? Math.round(totalBrents / users.length) : 0
  const totalPurchases = users.reduce((sum, user) => sum + (user.totalPurchases || 0), 0)

  const handleAddBrents = () => {
    if (!selectedUser || !brentsAmount) return
    const amount = Number.parseInt(brentsAmount)
    if (isNaN(amount) || amount <= 0) return

    addBrents(selectedUser.id, amount, brentsDescription || "Adição manual de BRENTS")
    setUsers(getUsers())
    setBrentsAmount("")
    setBrentsDescription("")
    setIsAddBrentsOpen(false)
  }

  const handleDeductBrents = () => {
    if (!selectedUser || !brentsAmount) return
    const amount = Number.parseInt(brentsAmount)
    if (isNaN(amount) || amount <= 0) return

    deductBrents(selectedUser.id, amount, brentsDescription || "Dedução manual de BRENTS")
    setUsers(getUsers())
    setBrentsAmount("")
    setBrentsDescription("")
    setIsDeductBrentsOpen(false)
  }

  const openEditUser = (user: UserType) => {
    setSelectedUser(user)
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      address1: user.address?.address1 || "",
      address2: user.address?.address2 || "",
      city: user.address?.city || "",
      stateCode: user.address?.stateCode || "",
      zipcode: user.address?.zipcode || "",
    })
    setIsEditUserOpen(true)
  }

  const handleSaveUser = () => {
    if (!selectedUser || !editForm.firstName || !editForm.email) return

    const updatedUsers = users.map((u) =>
      u.id === selectedUser.id
        ? {
            ...u,
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
            updatedAt: new Date().toISOString(),
          }
        : u,
    )
    saveUsers(updatedUsers)
    setUsers(updatedUsers)
    setIsEditUserOpen(false)
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

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground">Gerencie usuários e BRENTS do programa de fidelidade</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">usuários cadastrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total BRENTS</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBrents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">em circulação</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média BRENTS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageBrents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">por usuário</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchases}</div>
              <p className="text-xs text-muted-foreground">realizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-[180px]">
                <Label>Tag</Label>
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <Label>Nível</Label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
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
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
            <CardDescription>Clique em um usuário para gerenciar BRENTS e informações</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>BRENTS</TableHead>
                  <TableHead>Compras</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {getInitials(user)}
                        </div>
                        <div>
                          <p className="font-medium">{getFullName(user)}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getLevelColor(user.level)} text-white`}>
                        <Trophy className="w-3 h-3 mr-1" />
                        {getLevelLabel(user.level)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{(user.brents || 0).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{user.totalPurchases || 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {(user.tags || []).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(user.tags || []).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(user.tags || []).length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsAddBrentsOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsDeductBrentsOpen(true)
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openHistory(user)}>
                          <History className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openTags(user)}>
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add BRENTS Dialog */}
        <Dialog open={isAddBrentsOpen} onOpenChange={setIsAddBrentsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar BRENTS</DialogTitle>
              <DialogDescription>
                Adicione BRENTS para {selectedUser ? getFullName(selectedUser) : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={brentsAmount}
                  onChange={(e) => setBrentsAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>Descrição (opcional)</Label>
                <Input
                  placeholder="Motivo da adição..."
                  value={brentsDescription}
                  onChange={(e) => setBrentsDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBrentsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddBrents}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deduct BRENTS Dialog */}
        <Dialog open={isDeductBrentsOpen} onOpenChange={setIsDeductBrentsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deduzir BRENTS</DialogTitle>
              <DialogDescription>Deduzir BRENTS de {selectedUser ? getFullName(selectedUser) : ""}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={brentsAmount}
                  onChange={(e) => setBrentsAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>Descrição (opcional)</Label>
                <Input
                  placeholder="Motivo da dedução..."
                  value={brentsDescription}
                  onChange={(e) => setBrentsDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeductBrentsOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeductBrents}>
                <Minus className="h-4 w-4 mr-2" />
                Deduzir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Histórico de BRENTS - {selectedUser ? getFullName(selectedUser) : ""}</DialogTitle>
              <DialogDescription>Saldo atual: {(selectedUser?.brents || 0).toLocaleString()} BRENTS</DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhuma transação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    userTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{new Date(tx.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          {tx.type === "credit" ? (
                            <Badge className="bg-green-500">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Crédito
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Débito
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className={
                            tx.type === "credit" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                          }
                        >
                          {tx.type === "credit" ? "+" : "-"}
                          {tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{tx.description}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tags Dialog */}
        <Dialog open={isTagsOpen} onOpenChange={setIsTagsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerenciar Tags - {selectedUser ? getFullName(selectedUser) : ""}</DialogTitle>
              <DialogDescription>Adicione ou remova tags para segmentação na loja</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nova tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(selectedUser?.tags || []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {(selectedUser?.tags || []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma tag adicionada</p>
                )}
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Tags disponíveis:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allTags
                    .filter((tag) => !(selectedUser?.tags || []).includes(tag))
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => {
                          setNewTag(tag)
                          handleAddTag()
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>Atualize as informações do usuário</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Sobrenome</Label>
                  <Input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </h4>
                <div className="grid gap-4">
                  <div>
                    <Label>Endereço</Label>
                    <Input
                      value={editForm.address1}
                      onChange={(e) => setEditForm({ ...editForm, address1: e.target.value })}
                      placeholder="Rua, número"
                    />
                  </div>
                  <div>
                    <Label>Complemento</Label>
                    <Input
                      value={editForm.address2}
                      onChange={(e) => setEditForm({ ...editForm, address2: e.target.value })}
                      placeholder="Apartamento, bloco, etc."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Cidade</Label>
                      <Input
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input
                        value={editForm.stateCode}
                        onChange={(e) => setEditForm({ ...editForm, stateCode: e.target.value })}
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label>CEP</Label>
                      <Input
                        value={editForm.zipcode}
                        onChange={(e) => setEditForm({ ...editForm, zipcode: e.target.value })}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveUser}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
