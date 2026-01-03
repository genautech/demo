'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { Palette, HelpCircle, Rocket, Megaphone, Link as LinkIcon } from 'lucide-react'
import type { StepProps } from './types'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
        {label}
      </Typography>
      <Paper 
        variant="outlined" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          p: 1,
          borderRadius: 2,
        }}
      >
        <Box
          component="input"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            width: 40,
            height: 40,
            border: 'none',
            borderRadius: 1.5,
            cursor: 'pointer',
            '&::-webkit-color-swatch-wrapper': { p: 0 },
            '&::-webkit-color-swatch': { 
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: 1,
            },
          }}
        />
        <TextField
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
          }}
        />
      </Paper>
    </Box>
  )
}

export function StepIdentity({ formData, setFormData, errors, setErrors }: StepProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, title: value }))
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setFormData(prev => ({ ...prev, slug: value }))
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: undefined }))
    }
  }

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newType: string | null) => {
    if (newType) {
      setFormData(prev => ({ ...prev, type: newType as 'onboarding' | 'campaign' }))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Title */}
      <TextField
        label="Título da Landing Page"
        placeholder="Ex: Kit de Onboarding 2025"
        value={formData.title}
        onChange={handleTitleChange}
        error={!!errors.title}
        helperText={errors.title || 'Nome interno para identificação da página'}
        required
        fullWidth
      />

      {/* Slug */}
      <TextField
        label="Slug (URL)"
        placeholder="kit-onboarding-2025"
        value={formData.slug}
        onChange={handleSlugChange}
        error={!!errors.slug}
        helperText={
          errors.slug 
            ? errors.slug 
            : formData.slug 
              ? `URL: /landing/${formData.slug}`
              : 'Identificador único na URL (letras, números e hífens)'
        }
        required
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon size={18} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="O slug é a parte da URL que identifica sua landing page. Use apenas letras minúsculas, números e hífens.">
                <IconButton size="small" edge="end">
                  <HelpCircle size={18} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      {/* Type Selection */}
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
          Tipo de Página
        </Typography>
        <ToggleButtonGroup
          value={formData.type}
          exclusive
          onChange={handleTypeChange}
          fullWidth
          sx={{ 
            '& .MuiToggleButton-root': { 
              py: 1.5,
              gap: 1,
            } 
          }}
        >
          <ToggleButton value="onboarding">
            <Rocket size={20} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" fontWeight={600}>Onboarding</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Boas-vindas a novos colaboradores
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="campaign">
            <Megaphone size={20} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" fontWeight={600}>Campanha</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Promoções e eventos especiais
              </Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Colors */}
      <Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom 
          fontWeight={500}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
        >
          <Palette size={16} />
          Cores da Página
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <ColorPicker
            label="Cor Primária"
            value={formData.primaryColor}
            onChange={(value) => setFormData(prev => ({ ...prev, primaryColor: value }))}
          />
          <ColorPicker
            label="Cor Secundária"
            value={formData.secondaryColor}
            onChange={(value) => setFormData(prev => ({ ...prev, secondaryColor: value }))}
          />
        </Box>
      </Box>
    </Box>
  )
}
