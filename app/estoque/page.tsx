"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Box,
  RefreshCw,
  Edit,
  AlertTriangle,
  Package,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
} from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function EstoquePage() {
  const [search, setSearch] = useState("")
  const [stockFilter, setStockFilter] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editForm, setEditForm] = useState({ nome: "", sku: "", preco: "", estoque: "" })

  const { data, isLoading, mutate } = useSWR("/api/products", fetcher)

  const products = data?.products || []
  const meta = data?.meta || {}

  const filteredProducts = products.filter((p: any) => {
    const searchLower = search.toLowerCase()
    const matchesSearch =
      !search ||
      p.nome?.toLowerCase().includes(searchLower) ||
      p.sku?.toLowerCase().includes(searchLower) ||
      p.codigo?.toLowerCase().includes(searchLower)

    let matchesStock = true
    if (stockFilter === "available") {
      matchesStock = p.estoque > 0
    } else if (stockFilter === "low") {
      matchesStock = p.estoque > 0 && p.estoque < 10
    } else if (stockFilter === "out") {
      matchesStock = !p.estoque || p.estoque <= 0
    }

    return matchesSearch && matchesStock
  })

  const totalFiltered = filteredProducts.length
  const totalPages = Math.ceil(totalFiltered / perPage)
  const paginatedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage)

  const totalStock = products.reduce((acc: number, p: any) => acc + (p.estoque || 0), 0)
  const lowStockProducts = products.filter((p: any) => p.estoque > 0 && p.estoque < 10).length
  const outOfStockProducts = products.filter((p: any) => !p.estoque || p.estoque <= 0).length

  const openEditDialog = (product: any) => {
    setEditingProduct(product)
    setEditForm({
      nome: product.nome || "",
      sku: product.sku || product.codigo || "",
      preco: product.preco?.toString() || "",
      estoque: product.estoque?.toString() || "0",
    })
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editForm.nome,
          sku: editForm.sku,
          preco: Number.parseFloat(editForm.preco),
          estoque: Number.parseInt(editForm.estoque),
        }),
      })
      mutate()
      setEditingProduct(null)
    } catch (error) {
      console.error("Erro ao salvar:", error)
    }
  }

  const getStockBadge = (stock: number) => {
    if (!stock || stock <= 0) {
      return <Badge variant="destructive">Sem estoque</Badge>
    }
    if (stock < 10) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Baixo</Badge>
    }
    return <Badge className="bg-green-600 hover:bg-green-700">Disponível</Badge>
  }

  const clearFilters = () => {
    setSearch("")
    setStockFilter("")
    setPage(1)
  }

  const hasActiveFilters = search || stockFilter

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
            <p className="mt-1 text-muted-foreground">Gestão de produtos</p>
          </div>
          <Button onClick={() => mutate()} variant="outline" className="gap-2">
            <RefreshCw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Atualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">produtos cadastrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total em Estoque</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
              <p className="text-xs text-muted-foreground">unidades</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
              <TrendingDown className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">produtos abaixo de 10 un.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sem Estoque</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{outOfStockProducts}</div>
              <p className="text-xs text-muted-foreground">produtos esgotados</p>
            </CardContent>
          </Card>
        </div>

        {/* Source indicator with last update */}
        {meta.source && (
          <div className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`h-2 w-2 rounded-full ${meta.source === "cubbo" ? "bg-green-500" : "bg-blue-500"}`} />
              Dados via {meta.source === "cubbo" ? "Cubbo" : "Tiny ERP"}
              {meta.fromCache && " (cache)"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Última atualização: {meta.lastUpdate ? new Date(meta.lastUpdate).toLocaleString("pt-BR") : "N/A"}
            </div>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, SKU ou código..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10"
                />
              </div>
              <Select
                value={stockFilter}
                onValueChange={(value) => {
                  setStockFilter(value === "all" ? "" : value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar estoque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os produtos</SelectItem>
                  <SelectItem value="available">Com estoque</SelectItem>
                  <SelectItem value="low">Estoque baixo</SelectItem>
                  <SelectItem value="out">Sem estoque</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Nenhum produto encontrado</p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Limpar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Box className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{product.nome}</p>
                              {product.categoria && (
                                <p className="text-xs text-muted-foreground">{product.categoria}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            {product.sku || product.codigo || "-"}
                          </code>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {product.preco?.toFixed(2) || "0.00"} BRTS
                        </TableCell>
                        <TableCell className="text-right font-medium">{product.estoque || 0}</TableCell>
                        <TableCell>{getStockBadge(product.estoque)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          {totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Página {page} de {totalPages} ({totalFiltered} itens)
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Exibir:</span>
                  <Select
                    value={perPage.toString()}
                    onValueChange={(value) => {
                      setPerPage(Number(value))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>Atualize as informações do produto</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={editForm.nome}
                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Código</Label>
                <Input
                  id="sku"
                  value={editForm.sku}
                  onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (BRTS)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={editForm.preco}
                    onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={editForm.estoque}
                    onChange={(e) => setEditForm({ ...editForm, estoque: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
