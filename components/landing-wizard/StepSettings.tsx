'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { Tag, Settings, Check, Shield } from 'lucide-react'
import type { StepTagsProps } from './types'

export function StepSettings({ formData, setFormData, tags }: StepTagsProps) {
  const toggleTag = (tagId: string) => {
    const currentTags = formData.assignedTags
    if (currentTags.includes(tagId)) {
      setFormData(prev => ({
        ...prev,
        assignedTags: currentTags.filter(id => id !== tagId),
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        assignedTags: [...currentTags, tagId],
      }))
    }
  }

  const selectedTagNames = tags
    .filter(t => formData.assignedTags.includes(t.id))
    .map(t => t.name)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Tags Section */}
      <Box>
        <Typography 
          variant="body1" 
          fontWeight={600} 
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
        >
          <Tag size={18} />
          Tags Automáticas
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Usuários que acessarem esta página receberão estas tags automaticamente
        </Typography>

        {selectedTagNames.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {selectedTagNames.map(name => (
              <Chip 
                key={name} 
                label={name} 
                size="small" 
                color="primary"
                icon={<Check size={14} />}
              />
            ))}
          </Box>
        )}

        <Paper 
          variant="outlined" 
          sx={{ 
            maxHeight: 240, 
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          {tags.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Tag size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
              <Typography color="text.secondary">
                Nenhuma tag disponível
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {tags.map((tag) => {
                const isSelected = formData.assignedTags.includes(tag.id)
                return (
                  <Box
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
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
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={500}
                          sx={{ color: isSelected ? 'primary.contrastText' : 'text.primary' }}
                        >
                          {tag.name}
                        </Typography>
                        {tag.isEligibilityGate && (
                          <Chip
                            label="Elegibilidade"
                            size="small"
                            icon={<Shield size={12} />}
                            sx={{ 
                              height: 20, 
                              fontSize: '0.65rem',
                              bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : 'warning.light',
                              color: isSelected ? 'primary.contrastText' : 'warning.dark',
                            }}
                          />
                        )}
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isSelected ? 'primary.contrastText' : 'text.secondary',
                          opacity: isSelected ? 0.8 : 1,
                        }}
                      >
                        {tag.slug}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isSelected ? 'primary.contrastText' : 'divider',
                        bgcolor: isSelected ? 'primary.contrastText' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {isSelected && <Check size={14} style={{ color: 'var(--mui-palette-primary-main)' }} />}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}
        </Paper>
      </Box>

      <Divider />

      {/* Status Section */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="body1" 
              fontWeight={600}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Settings size={18} />
              Status da Página
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formData.isActive 
                ? 'A página está ativa e pode ser acessada publicamente' 
                : 'A página está inativa e não pode ser acessada'}
            </Typography>
          </Box>
          <Switch
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            color="primary"
          />
        </Box>
      </Paper>
    </Box>
  )
}
