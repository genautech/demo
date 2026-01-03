'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Slider from '@mui/material/Slider'
import { 
  ImageIcon, 
  Type, 
  MessageSquare, 
  Sparkles, 
  PartyPopper, 
  Zap, 
  Stars,
  Trophy,
  Gift,
  Award,
  Crown,
  Target,
  Flame,
} from 'lucide-react'
import type { StepProps } from './types'

const BADGE_ICONS = [
  { id: 'trophy', icon: Trophy, label: 'Troféu' },
  { id: 'gift', icon: Gift, label: 'Presente' },
  { id: 'award', icon: Award, label: 'Medalha' },
  { id: 'crown', icon: Crown, label: 'Coroa' },
  { id: 'target', icon: Target, label: 'Alvo' },
  { id: 'flame', icon: Flame, label: 'Fogo' },
  { id: 'stars', icon: Stars, label: 'Estrelas' },
  { id: 'sparkles', icon: Sparkles, label: 'Brilhos' },
]

const ANIMATION_STYLES = [
  { id: 'fade', label: 'Fade' },
  { id: 'slide', label: 'Slide' },
  { id: 'bounce', label: 'Bounce' },
  { id: 'scale', label: 'Scale' },
]

export function StepContent({ formData, setFormData, errors, setErrors }: StepProps) {
  const [bannerError, setBannerError] = React.useState(false)

  const handleWelcomeTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, welcomeTitle: value }))
    if (errors.welcomeTitle) {
      setErrors(prev => ({ ...prev, welcomeTitle: undefined }))
    }
  }

  const handleCtaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, ctaText: value }))
    if (errors.ctaText) {
      setErrors(prev => ({ ...prev, ctaText: undefined }))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Welcome Title */}
      <TextField
        label="Título de Boas-Vindas"
        placeholder="Bem-vindo!"
        value={formData.welcomeTitle}
        onChange={handleWelcomeTitleChange}
        error={!!errors.welcomeTitle}
        helperText={errors.welcomeTitle || 'Título principal que aparece na página'}
        required
        fullWidth
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex' }}>
              <Type size={18} />
            </Box>
          ),
        }}
      />

      {/* Welcome Message */}
      <TextField
        label="Mensagem de Boas-Vindas"
        placeholder="Estamos felizes em tê-lo conosco. Resgate seu kit de onboarding agora!"
        value={formData.welcomeMessage}
        onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
        helperText="Descrição que aparece abaixo do título"
        multiline
        rows={3}
        fullWidth
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, mt: 1, color: 'text.secondary', display: 'flex', alignSelf: 'flex-start' }}>
              <MessageSquare size={18} />
            </Box>
          ),
        }}
      />

      {/* CTA Button Text */}
      <TextField
        label="Texto do Botão (Call to Action)"
        placeholder="Acessar Loja"
        value={formData.ctaText}
        onChange={handleCtaChange}
        error={!!errors.ctaText}
        helperText={errors.ctaText || 'Texto do botão principal de ação'}
        required
        fullWidth
      />

      {/* Banner Section */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2.5, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)',
        }}
      >
        <Typography 
          variant="body2" 
          fontWeight={600} 
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
        >
          <ImageIcon size={18} />
          Banner (Opcional)
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="URL do Banner"
            placeholder="https://exemplo.com/banner.jpg"
            value={formData.bannerUrl}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, bannerUrl: e.target.value }))
              setBannerError(false)
            }}
            helperText="Insira a URL de uma imagem para o banner do topo"
            fullWidth
            size="small"
          />

          {formData.bannerUrl && (
            <Box 
              sx={{ 
                position: 'relative', 
                borderRadius: 2, 
                overflow: 'hidden',
                height: 120,
                bgcolor: 'action.hover',
              }}
            >
              {!bannerError ? (
                <Box
                  component="img"
                  src={formData.bannerUrl}
                  alt="Preview do banner"
                  onError={() => setBannerError(true)}
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Alert severity="warning" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  Não foi possível carregar a imagem. Verifique a URL.
                </Alert>
              )}
            </Box>
          )}

          <TextField
            label="Texto sobre o Banner"
            placeholder="Texto de destaque sobre a imagem"
            value={formData.bannerText}
            onChange={(e) => setFormData(prev => ({ ...prev, bannerText: e.target.value }))}
            helperText="Texto que aparece sobreposto ao banner"
            fullWidth
            size="small"
          />
        </Box>
      </Paper>

      {/* Gamification Section */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2.5, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, rgba(139,92,246,0.05) 0%, rgba(236,72,153,0.05) 100%)',
          border: '1px solid',
          borderColor: 'secondary.light',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: 2, 
              bgcolor: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} color="white" />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Efeitos de Gamificação
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Adicione efeitos visuais para engajar usuários
            </Typography>
          </Box>
          <Chip 
            label="PRO" 
            size="small" 
            color="secondary" 
            sx={{ ml: 'auto', fontWeight: 700, fontSize: '0.65rem' }} 
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Effect Toggles */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.enableConfetti}
                onChange={(e) => setFormData(prev => ({ ...prev, enableConfetti: e.target.checked }))}
                color="secondary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PartyPopper size={16} />
                <Typography variant="body2">Confetti ao entrar</Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.enableParticles}
                onChange={(e) => setFormData(prev => ({ ...prev, enableParticles: e.target.checked }))}
                color="secondary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Stars size={16} />
                <Typography variant="body2">Partículas flutuantes</Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.enableGlow}
                onChange={(e) => setFormData(prev => ({ ...prev, enableGlow: e.target.checked }))}
                color="secondary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Zap size={16} />
                <Typography variant="body2">Efeito Glow no CTA</Typography>
              </Box>
            }
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Animation Style */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            Estilo de Animação
          </Typography>
          <ToggleButtonGroup
            value={formData.animationStyle}
            exclusive
            onChange={(_, value) => value && setFormData(prev => ({ ...prev, animationStyle: value }))}
            size="small"
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.8rem',
              },
            }}
          >
            {ANIMATION_STYLES.map(style => (
              <ToggleButton key={style.id} value={style.id}>
                {style.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Badge Icon */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            Ícone de Badge (aparece no header)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {BADGE_ICONS.map(badge => {
              const Icon = badge.icon
              const isSelected = formData.badgeIcon === badge.id
              return (
                <Box
                  key={badge.id}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    badgeIcon: isSelected ? '' : badge.id 
                  }))}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid',
                    borderColor: isSelected ? 'secondary.main' : 'divider',
                    bgcolor: isSelected ? 'secondary.light' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                  title={badge.label}
                >
                  <Icon size={20} style={{ color: isSelected ? '#8b5cf6' : '#6b7280' }} />
                </Box>
              )
            })}
          </Box>
        </Box>

        {/* Points Reward */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              Pontos de Recompensa
            </Typography>
            <Chip 
              label={`${formData.pointsReward} pts`} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
          </Box>
          <Slider
            value={formData.pointsReward}
            onChange={(_, value) => setFormData(prev => ({ ...prev, pointsReward: value as number }))}
            min={0}
            max={500}
            step={10}
            color="secondary"
            valueLabelDisplay="auto"
            sx={{
              '& .MuiSlider-thumb': {
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Pontos concedidos ao usuário ao acessar esta landing page
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
