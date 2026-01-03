"use client"

import { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import { PageContainer } from "@/components/page-container"

// MUI Components
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'

import { Product, getCurrencyName } from "@/lib/storage"
import {
  Search,
  Box as BoxIcon,
  RefreshCw,
  Edit,
  AlertTriangle,
  Package,
  TrendingDown,
  Clock,
  X,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function EstoquePage() {
  const [search, setSearch] = useState("")
  const [stockFilter, setStockFilter] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState({ nome: "", sku: "", preco: "", estoque: "" })
  const [companyId, setCompanyId] = useState<string>("company_1")

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) {
          setCompanyId(auth.companyId)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Failed to parse auth data:", error)
        }
      }
    }
  }, [])

  const { data, isLoading, mutate } = useSWR("/api/products", fetcher)

  const products = data?.products || []
  const meta = data?.meta || {}

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
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
  }, [products, search, stockFilter])

  const totalFiltered = filteredProducts.length
  const totalPages = Math.ceil(totalFiltered / perPage)
  const paginatedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage)

  const totalStock = useMemo(() => products.reduce((acc: number, p: any) => acc + (p.estoque || 0), 0), [products])
  const lowStockProducts = useMemo(() => products.filter((p: any) => p.estoque > 0 && p.estoque < 10).length, [products])
  const outOfStockProducts = useMemo(() => products.filter((p: any) => !p.estoque || p.estoque <= 0).length, [products])

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

  const getStockChip = (stock: number) => {
    if (!stock || stock <= 0) {
      return <Chip label="Sem estoque" color="error" size="small" />
    }
    if (stock < 10) {
      return <Chip label="Baixo" color="warning" size="small" />
    }
    return <Chip label="Disponível" color="success" size="small" />
  }

  const clearFilters = () => {
    setSearch("")
    setStockFilter("")
    setPage(1)
  }

  const hasActiveFilters = search || stockFilter

  return (
    <PageContainer className="space-y-6">
      {/* Page Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Estoque</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Gestão de produtos
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={() => mutate()} 
          startIcon={<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />}
        >
          Atualizar
        </Button>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' } }}>
        <Card elevation={1}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Produtos</Typography>
                <Typography variant="h4" fontWeight="bold">{products.length}</Typography>
                <Typography variant="caption" color="text.secondary">produtos cadastrados</Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'action.hover' }}><Package size={20} /></Avatar>
            </Box>
          </CardContent>
        </Card>
        <Card elevation={1}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total em Estoque</Typography>
                <Typography variant="h4" fontWeight="bold">{totalStock}</Typography>
                <Typography variant="caption" color="text.secondary">unidades</Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'action.hover' }}><BoxIcon size={20} /></Avatar>
            </Box>
          </CardContent>
        </Card>
        <Card elevation={1}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Estoque Baixo</Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.main">{lowStockProducts}</Typography>
                <Typography variant="caption" color="text.secondary">abaixo de 10 un.</Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.light' }}><TrendingDown size={20} /></Avatar>
            </Box>
          </CardContent>
        </Card>
        <Card elevation={1}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Sem Estoque</Typography>
                <Typography variant="h4" fontWeight="bold" color="error.main">{outOfStockProducts}</Typography>
                <Typography variant="caption" color="text.secondary">produtos esgotados</Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'error.light' }}><AlertTriangle size={20} /></Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Source indicator with last update */}
      {meta.source && (
        <Card elevation={1}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: meta.source === "cubbo" ? "success.main" : "info.main" }} />
              <Typography variant="body2" color="text.secondary">
                Dados via {meta.source === "cubbo" ? "Cubbo" : "Tiny ERP"}
                {meta.fromCache && " (cache)"}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={16} />
              <Typography variant="body2" color="text.secondary">
                Última atualização: {meta.lastUpdate ? new Date(meta.lastUpdate).toLocaleString("pt-BR") : "N/A"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card elevation={1}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              placeholder="Buscar por nome, SKU ou código..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Filtrar estoque</InputLabel>
              <Select
                value={stockFilter}
                label="Filtrar estoque"
                onChange={(e) => {
                  setStockFilter(e.target.value)
                  setPage(1)
                }}
              >
                <MenuItem value="">Todos os produtos</MenuItem>
                <MenuItem value="available">Com estoque</MenuItem>
                <MenuItem value="low">Estoque baixo</MenuItem>
                <MenuItem value="out">Sem estoque</MenuItem>
              </Select>
            </FormControl>
            {hasActiveFilters && (
              <Button variant="outlined" onClick={clearFilters}>
                Limpar filtros
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card elevation={1}>
        <TableContainer>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : paginatedProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'action.hover', mx: 'auto', mb: 2 }}>
                <Package size={32} />
              </Avatar>
              <Typography color="text.secondary">Nenhum produto encontrado</Typography>
              {hasActiveFilters && (
                <Button onClick={clearFilters} sx={{ mt: 2 }}>
                  Limpar filtros
                </Button>
              )}
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="right">Estoque</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell width={48}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product: any) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: 'action.hover' }}>
                          <BoxIcon size={20} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">{product.nome}</Typography>
                          {product.categoria && (
                            <Typography variant="caption" color="text.secondary">{product.categoria}</Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.sku || product.codigo || "-"} 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium">
                        {product.preco?.toFixed(2) || "0.00"} {getCurrencyName(companyId, true).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium">{product.estoque || 0}</Typography>
                    </TableCell>
                    <TableCell>{getStockChip(product.estoque)}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => openEditDialog(product)}>
                        <Edit size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Página {page} de {totalPages} ({totalFiltered} itens)
            </Typography>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              size="small"
            />
          </Box>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog 
        open={!!editingProduct} 
        onClose={() => setEditingProduct(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Editar Produto</Typography>
          <IconButton onClick={() => setEditingProduct(null)} size="small">
            <Close size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Nome"
              value={editForm.nome}
              onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
              fullWidth
            />
            <TextField
              label="SKU / Código"
              value={editForm.sku}
              onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <TextField
                label={`Preço (${getCurrencyName(companyId, true).toUpperCase()})`}
                type="number"
                inputProps={{ step: "0.01" }}
                value={editForm.preco}
                onChange={(e) => setEditForm({ ...editForm, preco: e.target.value })}
              />
              <TextField
                label="Estoque"
                type="number"
                value={editForm.estoque}
                onChange={(e) => setEditForm({ ...editForm, estoque: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setEditingProduct(null)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}
