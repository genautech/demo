"use client"

import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  RefreshCw,
  Users,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  Store,
  Tag,
  Settings,
  Eye,
  ArrowRight,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  getBudgets,
  getBaseProducts,
  getCompanies,
  getStores,
  getTagsV3,
  updateBudget,
  type BudgetStatus,
  type Budget,
  type BaseProduct,
  type Company,
  type Store,
  type Tag,
} from "@/lib/storage"
import Link from "next/link"

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

const BUDGET_STATUS_COLORS: Record<BudgetStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  reviewed: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  released: "bg-emerald-100 text-emerald-800",
  replicated: "bg-teal-100 text-teal-800",
}

const BUDGET_STATUS_LABELS: Record<BudgetStatus, string> = {
  draft: "Rascunho",
  submitted: "Enviado",
  reviewed: "Revisado",
  approved: "Aprovado",
  rejected: "Rejeitado",
  released: "Liberado",
  replicated: "Replicado",
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  const loadData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setBudgets(getBudgets())
      setBaseProducts(getBaseProducts())
      setCompanies(getCompanies())
      setStores(getStores())
      setTags(getTagsV3().filter((t) => t.scope === "global"))
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApproveBudget = (budgetId: string) => {
    updateBudget(budgetId, { status: "approved", approvedAt: new Date().toISOString() })
    loadData()
  }

  const handleRejectBudget = (budgetId: string) => {
    updateBudget(budgetId, { status: "rejected" })
    loadData()
  }

  const handleReleaseBudget = (budgetId: string) => {
    updateBudget(budgetId, { status: "released", releasedAt: new Date().toISOString() })
    loadData()
  }

  const pendingBudgets = budgets.filter((b) => b.status === "submitted" || b.status === "reviewed")
  const approvedBudgets = budgets.filter((b) => b.status === "approved")

  return (
    <PageContainer className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Geral</h1>
          <p className="mt-2 text-muted-foreground">Governança global e gatekeeping de orçamentos</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadData} variant="outline" className="gap-2 bg-transparent">
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orçamentos Pendentes</CardTitle>
            <div className="rounded-lg bg-blue-500 p-2">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingBudgets.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orçamentos Aprovados</CardTitle>
            <div className="rounded-lg bg-green-500 p-2">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedBudgets.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Prontos para liberação</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Catálogo Base</CardTitle>
            <div className="rounded-lg bg-purple-500 p-2">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{baseProducts.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Produtos globais</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Empresas</CardTitle>
            <div className="rounded-lg bg-amber-500 p-2">
              <Building className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{companies.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">Tenants ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Budgets - Gatekeeper */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Orçamentos Pendentes de Aprovação
          </CardTitle>
          <CardDescription>Revise e aprove ou rejeite orçamentos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pendingBudgets.length > 0 ? (
            <div className="space-y-4">
              {pendingBudgets.map((budget) => {
                const company = companies.find((c) => c.id === budget.companyId)
                return (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{budget.title}</h3>
                        <Badge className={BUDGET_STATUS_COLORS[budget.status]}>
                          {BUDGET_STATUS_LABELS[budget.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {company?.name || "Empresa desconhecida"} • Total: R$ {(budget.totalCash || 0).toFixed(2)} / {budget.totalPoints || 0} pontos
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Criado em {new Date(budget.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {budget.status === "submitted" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBudget(budget.id, { status: "reviewed", reviewedAt: new Date().toISOString() })}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Revisar
                          </Button>
                        </>
                      )}
                      {budget.status === "reviewed" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectBudget(budget.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeitar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveBudget(budget.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                        </>
                      )}
                      {budget.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleReleaseBudget(budget.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Liberar para Replicação
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Nenhum orçamento pendente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Catálogo Base
            </CardTitle>
            <CardDescription>Gerenciar produtos globais</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/super-admin/catalogo-base">
                Gerenciar Catálogo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Tags Globais
            </CardTitle>
            <CardDescription>Gerenciar tags e elegibilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/super-admin/tags">
                Gerenciar Tags
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Usuários Globais
            </CardTitle>
            <CardDescription>Gerenciar todos os usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/super-admin/users">
                Gerenciar Usuários
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Empresas & Lojas
            </CardTitle>
            <CardDescription>Gerenciar tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/super-admin/companies">
                Gerenciar Tenants
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* All Budgets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Todos os Orçamentos
          </CardTitle>
          <CardDescription>Visão geral de todos os orçamentos do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : budgets.length > 0 ? (
            <div className="space-y-2">
              {budgets.slice(0, 10).map((budget) => {
                const company = companies.find((c) => c.id === budget.companyId)
                return (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{budget.title}</span>
                      <Badge className={BUDGET_STATUS_COLORS[budget.status]}>
                        {BUDGET_STATUS_LABELS[budget.status]}
                      </Badge>
                      <span className="text-muted-foreground">{company?.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      R$ {(budget.totalCash || 0).toFixed(2)} / {budget.totalPoints || 0} pts
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Nenhum orçamento encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
