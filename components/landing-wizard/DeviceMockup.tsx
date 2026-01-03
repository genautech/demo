'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DeviceMockupProps {
  children: React.ReactNode
  slug?: string
}

// iPhone Frame Component
function IPhoneFrame({ children, slug }: { children: React.ReactNode; slug?: string }) {
  const currentTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })

  return (
    <Box
      sx={{
        position: 'relative',
        width: 280,
        height: 580,
        mx: 'auto',
      }}
    >
      {/* iPhone Frame */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          borderRadius: '44px',
          boxShadow: `
            0 0 0 2px #3d3d3d,
            0 20px 60px rgba(0,0,0,0.4),
            0 10px 20px rgba(0,0,0,0.2),
            inset 0 2px 4px rgba(255,255,255,0.1)
          `,
          p: '12px',
        }}
      >
        {/* Screen Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '36px',
            overflow: 'hidden',
            bgcolor: '#000',
          }}
        >
          {/* Dynamic Island */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 34,
              bgcolor: '#000',
              borderRadius: '20px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {/* Camera */}
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#1a1a2e',
                boxShadow: 'inset 0 0 2px rgba(59, 130, 246, 0.5)',
              }}
            />
          </Box>

          {/* Status Bar */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 54,
              px: 2.5,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              pb: 0.5,
              zIndex: 5,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
            }}
          >
            {/* Time */}
            <Typography 
              sx={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: 'white',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display"',
              }}
            >
              {currentTime}
            </Typography>
            
            {/* Status Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Signal size={14} color="white" />
              <Wifi size={14} color="white" />
              <Battery size={14} color="white" fill="white" />
            </Box>
          </Box>

          {/* Screen Content */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'auto',
              borderRadius: '36px',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {children}
          </Box>

          {/* Home Indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 134,
              height: 5,
              bgcolor: 'rgba(255,255,255,0.3)',
              borderRadius: '3px',
              zIndex: 10,
            }}
          />
        </Box>
      </Box>

      {/* Side Buttons */}
      {/* Volume Up */}
      <Box
        sx={{
          position: 'absolute',
          left: -2,
          top: 120,
          width: 3,
          height: 30,
          bgcolor: '#2d2d2d',
          borderRadius: '2px 0 0 2px',
        }}
      />
      {/* Volume Down */}
      <Box
        sx={{
          position: 'absolute',
          left: -2,
          top: 160,
          width: 3,
          height: 30,
          bgcolor: '#2d2d2d',
          borderRadius: '2px 0 0 2px',
        }}
      />
      {/* Power Button */}
      <Box
        sx={{
          position: 'absolute',
          right: -2,
          top: 140,
          width: 3,
          height: 50,
          bgcolor: '#2d2d2d',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </Box>
  )
}

// Desktop Browser Frame Component
function DesktopFrame({ children, slug }: { children: React.ReactNode; slug?: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        mx: 'auto',
      }}
    >
      {/* Browser Window */}
      <Box
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: `
            0 25px 50px rgba(0,0,0,0.25),
            0 10px 20px rgba(0,0,0,0.15),
            0 0 0 1px rgba(0,0,0,0.1)
          `,
          bgcolor: 'background.paper',
        }}
      >
        {/* Title Bar */}
        <Box
          sx={{
            height: 40,
            bgcolor: '#f5f5f5',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            gap: 1,
          }}
        >
          {/* Window Controls */}
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f57' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#febc2e' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28c840' }} />
          </Box>

          {/* URL Bar */}
          <Box
            sx={{
              flex: 1,
              mx: 2,
              height: 28,
              bgcolor: 'white',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: 8, color: 'white', fontWeight: 700 }}>🔒</Typography>
            </Box>
            <Typography 
              sx={{ 
                fontSize: '12px', 
                color: 'text.secondary',
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              yoobe.co/landing/{slug || '...'}
            </Typography>
          </Box>
        </Box>

        {/* Browser Content */}
        <Box
          sx={{
            height: 380,
            overflow: 'auto',
            bgcolor: 'white',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { 
              bgcolor: 'rgba(0,0,0,0.2)', 
              borderRadius: 3,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export function DeviceMockup({ children, slug }: DeviceMockupProps) {
  const [device, setDevice] = React.useState<'mobile' | 'desktop'>('mobile')

  const handleDeviceChange = (_: React.MouseEvent<HTMLElement>, newDevice: string | null) => {
    if (newDevice) {
      setDevice(newDevice as 'mobile' | 'desktop')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      {/* Device Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={device}
          exclusive
          onChange={handleDeviceChange}
          size="small"
          sx={{
            bgcolor: 'action.hover',
            borderRadius: 2,
            p: 0.5,
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '8px !important',
              px: 2,
              py: 0.75,
              gap: 0.75,
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 500,
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'background.paper',
                },
              },
            },
          }}
        >
          <ToggleButton value="mobile">
            <Smartphone size={16} />
            Mobile
          </ToggleButton>
          <ToggleButton value="desktop">
            <Monitor size={16} />
            Desktop
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Device Preview */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 2,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%' }}
          >
            {device === 'mobile' ? (
              <IPhoneFrame slug={slug}>{children}</IPhoneFrame>
            ) : (
              <DesktopFrame slug={slug}>{children}</DesktopFrame>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  )
}
