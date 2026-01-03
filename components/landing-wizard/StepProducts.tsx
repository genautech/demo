'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Checkbox from '@mui/material/Checkbox'
import { ShoppingBag, Sparkles, Search, Package, X, Loader2 } from 'lucide-react'
import type { StepProductsProps } from './types'

export function StepProducts({ 
  formData, 
  setFormData, 
  products,
  selectedProducts,
  setSelectedProducts,
  companyId,
}: StepProductsProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isAIDialogOpen, setIsAIDialogOpen] = React.useState(false)
  const [aiPrompt, setAiPrompt] = React.useState('')
  const [aiBudget, setAiBudget] = React.useState('')
  const [aiRecipientCount, setAiRecipientCount] = React.useState('')
  const [isAILoading, setIsAILoading] = React.useState(false)

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return products
    const query = searchQuery.toLowerCase()
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description?.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  const selectedProductIds = selectedProducts.map(p => p.productId)

  const toggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProducts(prev => prev.filter(p => p.productId !== productId))
    } else {
      setSelectedProducts(prev => [...prev, { productId, quantity: 1 }])
    }
  }

  const handleAIRecommendation = async () => {
    if (!aiPrompt.trim()) return

    setIsAILoading(true)
    try {
      const response = await fetch("/api/gifts/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: aiPrompt,
          budget: aiBudget ? parseInt(aiBudget) : undefined,
          recipientCount: aiRecipientCount ? parseInt(aiRecipientCount) : undefined,
          companyId,
        }),
      })

      const data = await response.json()

      if (response.ok && data.recommendations?.length > 0) {
        setSelectedProducts(data.recommendations.map((rec: { productId: string; quantity?: number }) => ({
          productId: rec.productId,
          quantity: rec.quantity || 1,
        })))
        setIsAIDialogOpen(false)
        setAiPrompt('')
        setAiBudget('')
        setAiRecipientCount('')
      }
    } catch (error) {
      console.error('[AI Recommendation] Error:', error)
    } finally {
      setIsAILoading(false)
    }
  }

  // Sync selectedProducts with formData.productIds
  React.useEffect(() => {
    const productIds = selectedProducts.map(p => p.productId)
    setFormData(prev => ({ ...prev, productIds }))
  }, [selectedProducts, setFormData])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="body1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBag size={18} />
            Produtos Disponíveis
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedProducts.length} produto(s) selecionado(s)
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Sparkles size={16} />}
          onClick={() => setIsAIDialogOpen(true)}
          sx={{ 
            borderColor: 'primary.main',
            color: 'primary.main',
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark', borderColor: 'primary.dark' },
            color: 'primary.contrastText',
          }}
        >
          Assistente IA
        </Button>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Buscar produtos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} />
            </InputAdornment>
          ),
        }}
      />

      {/* Selected Products Chips */}
      {selectedProducts.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedProducts.map(({ productId }) => {
            const product = products.find(p => p.id === productId)
            if (!product) return null
            return (
              <Chip
                key={productId}
                label={product.name}
                onDelete={() => toggleProduct(productId)}
                deleteIcon={<X size={14} />}
                color="primary"
                size="small"
              />
            )
          })}
        </Box>
      )}

      {/* Products Grid */}
      <Paper 
        variant="outlined" 
        sx={{ 
          maxHeight: 320, 
          overflow: 'auto',
          borderRadius: 2,
        }}
      >
        {filteredProducts.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Package size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
            <Typography color="text.secondary">
              {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {filteredProducts.map((product) => {
              const isSelected = selectedProductIds.includes(product.id)
              return (
                <Box
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    cursor: 'pointer',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                    transition: 'all 0.15s',
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                    },
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    sx={{ 
                      p: 0.5,
                      color: isSelected ? 'primary.contrastText' : 'text.secondary',
                      '&.Mui-checked': {
                        color: isSelected ? 'primary.contrastText' : 'primary.main',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      bgcolor: 'action.hover',
                      flexShrink: 0,
                    }}
                  >
                    {product.images?.[0] ? (
                      <Box
                        component="img"
                        src={product.images[0]}
                        alt={product.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <Package size={20} style={{ opacity: 0.4 }} />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      fontWeight={500} 
                      noWrap
                      sx={{ color: isSelected ? 'primary.contrastText' : 'text.primary' }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ color: isSelected ? 'primary.contrastText' : 'text.secondary', opacity: isSelected ? 0.8 : 1 }}
                    >
                      {product.pointsCost} pontos • Estoque: {product.stockQuantity}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Paper>

      {/* AI Dialog */}
      <Dialog 
        open={isAIDialogOpen} 
        onClose={() => !isAILoading && setIsAIDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={20} />
          Assistente de Campanhas
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Descreva o tipo de campanha que você precisa e nossa IA recomendará os produtos ideais.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Descreva a campanha"
              placeholder="Ex: Preciso de uma campanha de onboarding para 5 novos desenvolvedores..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              multiline
              rows={3}
              fullWidth
              disabled={isAILoading}
            />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Orçamento por pessoa (pontos)"
                type="number"
                value={aiBudget}
                onChange={(e) => setAiBudget(e.target.value)}
                size="small"
                disabled={isAILoading}
              />
              <TextField
                label="Número de destinatários"
                type="number"
                value={aiRecipientCount}
                onChange={(e) => setAiRecipientCount(e.target.value)}
                size="small"
                disabled={isAILoading}
              />
            </Box>

            {isAILoading && (
              <Alert 
                severity="info" 
                icon={<CircularProgress size={20} />}
                sx={{ mt: 1 }}
              >
                Analisando catálogo e gerando recomendações...
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsAIDialogOpen(false)} 
            disabled={isAILoading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleAIRecommendation}
            disabled={isAILoading || !aiPrompt.trim()}
            startIcon={isAILoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          >
            {isAILoading ? 'Processando...' : 'Obter Recomendações'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
