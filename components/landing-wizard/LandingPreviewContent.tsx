'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { 
  ShoppingBag, 
  ImageIcon, 
  Trophy, 
  Gift, 
  Award, 
  Crown, 
  Target, 
  Flame, 
  Stars, 
  Sparkles,
  PartyPopper,
  Zap,
} from 'lucide-react'
import type { WizardFormData } from './types'

interface LandingPreviewContentProps {
  data: WizardFormData
  products?: { id: string; name: string; pointsCost?: number; images?: string[] }[]
}

const BADGE_ICONS: Record<string, any> = {
  trophy: Trophy,
  gift: Gift,
  award: Award,
  crown: Crown,
  target: Target,
  flame: Flame,
  stars: Stars,
  sparkles: Sparkles,
}

export function LandingPreviewContent({ data, products = [] }: LandingPreviewContentProps) {
  const selectedProducts = products.filter(p => data.productIds?.includes(p.id))
  const BadgeIcon = data.badgeIcon ? BADGE_ICONS[data.badgeIcon] : null

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: data.backgroundColor || '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Particles Effect Overlay */}
      {data.enableParticles && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: data.secondaryColor,
              opacity: 0.6,
              top: '20%',
              left: '15%',
              animation: 'float 3s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: data.primaryColor,
              opacity: 0.6,
              top: '40%',
              right: '20%',
              animation: 'float 2.5s ease-in-out infinite 0.5s',
            },
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: 0.6 },
              '50%': { transform: 'translateY(-10px) scale(1.2)', opacity: 0.8 },
            },
          }}
        />
      )}

      {/* Confetti Indicator */}
      {data.enableConfetti && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(139, 92, 246, 0.9)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.6rem',
            fontWeight: 600,
          }}
        >
          <PartyPopper size={10} />
          Confetti
        </Box>
      )}

      {/* Badge Icon */}
      {BadgeIcon && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 10,
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: data.primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <BadgeIcon size={14} color="white" />
        </Box>
      )}

      {/* Points Reward Badge */}
      {data.pointsReward > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: BadgeIcon ? 42 : 8,
            left: 8,
            zIndex: 10,
          }}
        >
          <Chip
            icon={<Stars size={10} />}
            label={`+${data.pointsReward} pts`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.55rem',
              fontWeight: 700,
              bgcolor: 'rgba(245, 158, 11, 0.9)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white', fontSize: 10 },
            }}
          />
        </Box>
      )}

      {/* Banner */}
      {data.bannerUrl ? (
        <Box sx={{ position: 'relative', height: 120, bgcolor: 'grey.200' }}>
          <Box
            component="img"
            src={data.bannerUrl}
            alt="Banner"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {data.bannerText && (
            <Box 
              sx={{ 
                position: 'absolute', 
                inset: 0, 
                bgcolor: 'rgba(0,0,0,0.4)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 2,
              }}
            >
              <Typography 
                sx={{ 
                  color: 'white', 
                  fontWeight: 700, 
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {data.bannerText}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box 
          sx={{ 
            height: 120, 
            background: `linear-gradient(135deg, ${data.primaryColor}40, ${data.secondaryColor}40)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ImageIcon size={40} style={{ opacity: 0.3 }} />
        </Box>
      )}

      {/* Content */}
      <Box sx={{ p: 3, textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Welcome Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: data.textColor || '#1f2937', 
            mb: 1.5,
            fontSize: '1.25rem',
          }}
        >
          {data.welcomeTitle || 'Bem-vindo!'}
        </Typography>

        {/* Welcome Message */}
        <Typography 
          sx={{ 
            color: data.textColor || '#1f2937', 
            opacity: 0.75, 
            mb: 3,
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          {data.welcomeMessage || 'Sua mensagem de boas-vindas aqui.'}
        </Typography>

        {/* Products Grid */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 1.5, 
            mb: 3,
          }}
        >
          {selectedProducts.length > 0 ? (
            selectedProducts.slice(0, 4).map(p => (
              <Box 
                key={p.id} 
                sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.8)',
                  border: '1px solid',
                  borderColor: 'divider',
                  textAlign: 'left',
                }}
              >
                <Box 
                  sx={{ 
                    aspectRatio: '1', 
                    borderRadius: 1.5, 
                    bgcolor: 'grey.100', 
                    mb: 1,
                    overflow: 'hidden',
                  }}
                >
                  {p.images?.[0] ? (
                    <Box
                      component="img"
                      src={p.images[0]}
                      alt={p.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}
                    >
                      <ShoppingBag size={24} style={{ opacity: 0.3 }} />
                    </Box>
                  )}
                </Box>
                <Typography 
                  sx={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                  {p.pointsCost} pts
                </Typography>
              </Box>
            ))
          ) : (
            <Box 
              sx={{ 
                gridColumn: '1 / -1', 
                py: 4, 
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                opacity: 0.5,
              }}
            >
              <ShoppingBag size={28} />
              <Typography sx={{ fontSize: '0.75rem' }}>Nenhum produto selecionado</Typography>
            </Box>
          )}
        </Box>

        {/* CTA Button with Glow Effect */}
        <Button
          variant="contained"
          fullWidth
          sx={{ 
            bgcolor: data.primaryColor || '#16a34a',
            color: '#fff',
            py: 1.5,
            fontSize: '0.9rem',
            fontWeight: 600,
            borderRadius: 2,
            position: 'relative',
            overflow: 'visible',
            boxShadow: data.enableGlow 
              ? `0 0 20px ${data.primaryColor}60, 0 0 40px ${data.primaryColor}40, 0 4px 14px ${data.primaryColor}40`
              : `0 4px 14px ${data.primaryColor}40`,
            animation: data.enableGlow ? 'glow 2s ease-in-out infinite' : 'none',
            '@keyframes glow': {
              '0%, 100%': { 
                boxShadow: `0 0 20px ${data.primaryColor}60, 0 0 40px ${data.primaryColor}40, 0 4px 14px ${data.primaryColor}40`,
              },
              '50%': { 
                boxShadow: `0 0 30px ${data.primaryColor}80, 0 0 60px ${data.primaryColor}60, 0 4px 14px ${data.primaryColor}40`,
              },
            },
            '&:hover': { 
              bgcolor: data.primaryColor || '#16a34a', 
              filter: 'brightness(0.9)',
            },
            '& .MuiButton-startIcon': {
              marginRight: 1,
            },
          }}
          startIcon={data.enableGlow ? <Zap size={16} /> : undefined}
        >
          {data.ctaText || 'Acessar Loja'}
        </Button>

        {/* Animation Style Indicator */}
        {data.animationStyle && data.animationStyle !== 'fade' && (
          <Typography 
            sx={{ 
              mt: 1.5, 
              fontSize: '0.6rem', 
              color: 'text.secondary',
              opacity: 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            <Sparkles size={10} />
            Animação: {data.animationStyle}
          </Typography>
        )}

        {/* Tags indicator */}
        {data.assignedTags && data.assignedTags.length > 0 && (
          <Typography 
            sx={{ 
              mt: 1, 
              fontSize: '0.65rem', 
              color: 'text.secondary',
              opacity: 0.6,
            }}
          >
            +{data.assignedTags.length} tag(s) serão atribuídas
          </Typography>
        )}
      </Box>
    </Box>
  )
}
