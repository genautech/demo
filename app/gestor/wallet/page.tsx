"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Search,
  Filter,
  History,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
} from "lucide-react"
import { 
  getTeamBudgets, 
  allocateBudget,
  approveBudgetRequest,
  rejectBudgetRequest,
  type TeamBudget,
  type BudgetRequest,
  type BudgetTransaction,
} from "@/lib/storage"
import { TeamBudgetCard } from "@/components/budget/team-budget-card"
import { BudgetRequestModal, AllocateBudgetModal } from "@/components/budget/budget-request-modal"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function WalletPage() {
  const [companyId, setCompanyId] = useState("company_1")
  const [budgets, setBudgets] = useState<TeamBudget[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBudget, setSelectedBudget] = useState<TeamBudget | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("teams")

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
  }, [])

  useEffect(() => {
    loadBudgets()
  }, [companyId])

  const loadBudgets = () => {
    const teamBudgets = getTeamBudgets(companyId)
    setBudgets(teamBudgets)
  }

  // Calculate totals
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0)
  const totalUsed = budgets.reduce((sum, b) => sum + b.usedAmount, 0)
  const totalAvailable = budgets.reduce((sum, b) => sum + b.availableAmount, 0)
  const pendingRequests = budgets.reduce(
    (sum, b) => sum + b.requests.filter(r => r.status === "pending").length, 
    0
  )

  const filteredBudgets = budgets.filter(b => 
    b.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.teamId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // All transactions from all teams
  const allTransactions = budgets
    .flatMap(b => b.history.map(h => ({ ...h, teamName: b.teamName })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // All pending requests
  const allPendingRequests = budgets
    .flatMap(b => b.requests.filter(r => r.status === "pending").map(r => ({ ...r, teamName: b.teamName })))

  const handleAllocate = (teamId: string) => {
    const budget = budgets.find(b => b.teamId === teamId)
    if (budget) {
      setSelectedBudget(budget)
      setIsAllocateModalOpen(true)
    }
  }

  const handleViewRequests = (teamId: string) => {
    const budget = budgets.find(b => b.teamId === teamId)
    if (budget) {
      setSelectedBudget(budget)
      setIsRequestModalOpen(true)
    }
  }

  const handleApproveRequest = (requestId: string, notes?: string) => {
    if (!selectedBudget) return
    
    const success = approveBudgetRequest(
      companyId, 
      selectedBudget.teamId, 
      requestId, 
      "admin",
      notes
    )
    
    if (success) {
      toast.success("Solicitação aprovada com sucesso!")
      loadBudgets()
      // Update selected budget
      const updated = getTeamBudgets(companyId).find(b => b.teamId === selectedBudget.teamId)
      setSelectedBudget(updated || null)
    } else {
      toast.error("Erro ao aprovar solicitação")
    }
  }

  const handleRejectRequest = (requestId: string, notes?: string) => {
    if (!selectedBudget) return
    
    const success = rejectBudgetRequest(
      companyId, 
      selectedBudget.teamId, 
      requestId, 
      "admin",
      notes
    )
    
    if (success) {
      toast.success("Solicitação rejeitada")
      loadBudgets()
      const updated = getTeamBudgets(companyId).find(b => b.teamId === selectedBudget.teamId)
      setSelectedBudget(updated || null)
    } else {
      toast.error("Erro ao rejeitar solicitação")
    }
  }

  const handleAllocateBudget = (amount: number, description: string) => {
    if (!selectedBudget) return
    
    const success = allocateBudget(
      companyId,
      selectedBudget.teamId,
      amount,
      description,
      "admin"
    )
    
    if (success) {
      toast.success(`R$ ${amount.toLocaleString("pt-BR")} alocados com sucesso!`)
      loadBudgets()
    } else {
      toast.error("Erro ao alocar verba")
    }
  }

  const getTransactionIcon = (type: BudgetTransaction["type"]) => {
    switch (type) {
      case "allocation":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "usage":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "transfer_in":
        return <ArrowDownLeft className="h-4 w-4 text-blue-600" />
      case "transfer_out":
        return <ArrowUpRight className="h-4 w-4 text-orange-600" />
      case "adjustment":
        return <History className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionLabel = (type: BudgetTransaction["type"]) => {
    switch (type) {
      case "allocation": return "Alocação"
      case "usage": return "Utilização"
      case "transfer_in": return "Transferência (entrada)"
      case "transfer_out": return "Transferência (saída)"
      case "adjustment": return "Ajuste"
    }
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gestão de Verbas</h1>
            <p className="text-muted-foreground">
              Gerencie orçamentos e alocações entre times e departamentos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {pendingRequests > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 gap-1 py-2 px-3">
              <AlertCircle className="h-4 w-4" />
              {pendingRequests} solicitação{pendingRequests > 1 ? "ões" : ""} pendente{pendingRequests > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-sm bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Building className="h-3 w-3" />
                Orçamento Total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">
                R$ {totalAllocated.toLocaleString("pt-BR")}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Alocado para {budgets.length} times
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Utilizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-red-600">
                R$ {totalUsed.toLocaleString("pt-BR")}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {totalAllocated > 0 ? Math.round((totalUsed / totalAllocated) * 100) : 0}% do orçamento
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Disponível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-green-600">
                R$ {totalAvailable.toLocaleString("pt-BR")}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Saldo livre para uso
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Users className="h-3 w-3" />
                Times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">
                {budgets.length}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Departamentos com orçamento
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="teams" className="gap-2">
            <Users className="h-4 w-4" />
            Times
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2 relative">
            <Clock className="h-4 w-4" />
            Solicitações
            {pendingRequests > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px] flex items-center justify-center">
                {pendingRequests}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Teams Tab */}
        <TabsContent value="teams" className="mt-6">
          <div className="space-y-6">
            {/* Search */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar time..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Team Budget Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBudgets.map((budget) => (
                <TeamBudgetCard
                  key={budget.id}
                  budget={budget}
                  onAllocate={handleAllocate}
                  onViewRequests={handleViewRequests}
                />
              ))}
            </div>

            {filteredBudgets.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">Nenhum time encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar sua busca
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Solicitações Pendentes</CardTitle>
              <CardDescription>
                Aprove ou rejeite solicitações de verba dos times
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allPendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {allPendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-yellow-100">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">{request.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.teamName} • Solicitado por {request.requestedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-black text-primary">
                          R$ {request.amount.toLocaleString("pt-BR")}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              const budget = budgets.find(b => b.teamId === request.teamId)
                              if (budget) {
                                setSelectedBudget(budget)
                                handleApproveRequest(request.id)
                              }
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const budget = budgets.find(b => b.teamId === request.teamId)
                              if (budget) {
                                setSelectedBudget(budget)
                                handleRejectRequest(request.id)
                              }
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium">Nenhuma solicitação pendente</p>
                  <p className="text-sm text-muted-foreground">
                    Todas as solicitações foram processadas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Transações</CardTitle>
              <CardDescription>
                Acompanhe todas as movimentações de verba
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTransactions.slice(0, 20).map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(tx.type)}
                          <span className="text-xs font-medium">
                            {getTransactionLabel(tx.type)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{(tx as any).teamName}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-bold",
                          tx.amount >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {tx.amount >= 0 ? "+" : ""}R$ {Math.abs(tx.amount).toLocaleString("pt-BR")}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {tx.performedBy}
                      </TableCell>
                    </TableRow>
                  ))}
                  {allTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhuma transação registrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BudgetRequestModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        budget={selectedBudget}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      <AllocateBudgetModal
        open={isAllocateModalOpen}
        onOpenChange={setIsAllocateModalOpen}
        budget={selectedBudget}
        onAllocate={handleAllocateBudget}
      />
    </PageContainer>
  )
}
