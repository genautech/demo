'use client'

import * as React from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme, type Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useTheme } from 'next-themes'

// Material 3 Color tokens
const lightPalette = {
  primary: {
    main: '#16a34a', // Green-600
    light: '#22c55e',
    dark: '#15803d',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#8b5cf6', // Violet-500
    light: '#a78bfa',
    dark: '#7c3aed',
    contrastText: '#ffffff',
  },
  error: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#000000',
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff',
  },
  success: {
    main: '#16a34a',
    light: '#22c55e',
    dark: '#15803d',
    contrastText: '#ffffff',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
  },
  divider: '#e5e7eb',
}

// Dark mode palette - Enhanced contrast & readability
const darkPalette = {
  primary: {
    main: '#4ade80',     // Green-400 - more vibrant for dark mode
    light: '#86efac',    // Green-300
    dark: '#22c55e',     // Green-500
    contrastText: '#052e16', // Dark green for contrast
  },
  secondary: {
    main: '#a78bfa',     // Violet-400
    light: '#c4b5fd',    // Violet-300
    dark: '#8b5cf6',     // Violet-500
    contrastText: '#1e1b4b', // Dark violet
  },
  error: {
    main: '#f87171',     // Red-400
    light: '#fca5a5',    // Red-300
    dark: '#ef4444',     // Red-500
    contrastText: '#450a0a',
  },
  warning: {
    main: '#fbbf24',     // Amber-400
    light: '#fcd34d',    // Amber-300
    dark: '#f59e0b',     // Amber-500
    contrastText: '#451a03',
  },
  info: {
    main: '#60a5fa',     // Blue-400
    light: '#93c5fd',    // Blue-300
    dark: '#3b82f6',     // Blue-500
    contrastText: '#172554',
  },
  success: {
    main: '#4ade80',     // Green-400
    light: '#86efac',    // Green-300
    dark: '#22c55e',     // Green-500
    contrastText: '#052e16',
  },
  background: {
    default: '#0c0c14',  // Deeper, richer dark
    paper: '#151520',    // Slightly elevated
  },
  text: {
    primary: '#f1f5f9',  // Slate-100 - better readability
    secondary: '#94a3b8', // Slate-400 - improved contrast
  },
  divider: 'rgba(148, 163, 184, 0.12)', // Subtle but visible
}

// Fun mode palette - Vibrant & Modern (matches CSS globals)
const funPalette = {
  primary: {
    main: '#7c3aed',     // Electric Violet - oklch(0.62 0.24 275)
    light: '#a78bfa',    // Lighter violet
    dark: '#5b21b6',     // Deeper violet
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#06b6d4',     // Vibrant Cyan - oklch(0.72 0.2 195)
    light: '#22d3ee',    // Light cyan
    dark: '#0891b2',     // Deep cyan
    contrastText: '#0f172a',
  },
  error: {
    main: '#f43f5e',     // Rose-500
    light: '#fb7185',
    dark: '#e11d48',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',     // Amber-500
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#0f172a',
  },
  info: {
    main: '#3b82f6',     // Blue-500
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff',
  },
  success: {
    main: '#10b981',     // Emerald-500
    light: '#34d399',
    dark: '#059669',
    contrastText: '#0f172a',
  },
  background: {
    default: '#f8fafc',  // Light warm background - oklch(0.97 0.015 280)
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b',  // Slate-800
    secondary: '#64748b', // Slate-500
  },
  divider: 'rgba(124, 58, 237, 0.12)', // Primary with opacity
}

function createMuiTheme(mode: 'light' | 'dark' | 'fun'): Theme {
  const palette = mode === 'fun' ? funPalette : mode === 'dark' ? darkPalette : lightPalette
  // Fun mode is now light-based with vibrant colors
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      ...palette,
    },
    typography: {
      fontFamily: '"Inter", "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Don't reset body styles - let Tailwind handle that
          body: {
            backgroundColor: 'transparent',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: palette.primary.dark,
            },
          },
          outlined: {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
            },
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 16,
          },
          elevation1: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          },
          elevation2: {
            boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
          },
          elevation3: {
            boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '& fieldset': {
                borderWidth: 1.5,
              },
              '&:hover fieldset': {
                borderWidth: 1.5,
              },
              '&.Mui-focused fieldset': {
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
          filled: {
            '&.MuiChip-colorPrimary': {
              backgroundColor: palette.primary.main,
              color: palette.primary.contrastText,
            },
          },
          outlined: {
            borderWidth: 1.5,
          },
        },
      },
      MuiStepper: {
        styleOverrides: {
          root: {
            padding: '24px 0',
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            fontWeight: 500,
            '&.Mui-active': {
              fontWeight: 600,
            },
            '&.Mui-completed': {
              fontWeight: 500,
            },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            fontSize: '1.75rem',
            '&.Mui-active': {
              color: palette.primary.main,
            },
            '&.Mui-completed': {
              color: palette.success.main,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            padding: 0,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '1.25rem',
            fontWeight: 600,
            padding: '24px 24px 16px',
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: '8px 24px 24px',
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: '16px 24px 24px',
            gap: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: 24,
            '&:last-child': {
              paddingBottom: 24,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            '&.Mui-selected': {
              backgroundColor: palette.primary.main,
              color: palette.primary.contrastText,
              '&:hover': {
                backgroundColor: palette.primary.dark,
              },
            },
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            gap: 8,
          },
          grouped: {
            borderRadius: '12px !important',
            border: `1.5px solid ${palette.divider} !important`,
            margin: 0,
          },
        },
      },
    },
  })
}

interface MuiProviderProps {
  children: React.ReactNode
}

export function MuiProvider({ children }: MuiProviderProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const theme = React.useMemo(() => {
    const mode = (resolvedTheme as 'light' | 'dark' | 'fun') || 'light'
    return createMuiTheme(mode)
  }, [resolvedTheme])

  // Avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  )
}
