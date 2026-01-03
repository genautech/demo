'use client'

import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Fade from '@mui/material/Fade'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileText, 
  Type, 
  ShoppingBag, 
  Settings,
  Eye,
  Loader2,
  ImageIcon,
} from 'lucide-react'
import type { LandingPage } from '@/lib/storage'
import type { 
  LandingWizardProps, 
  WizardFormData, 
  ValidationErrors,
} from './types'
import { WIZARD_STEPS, DEFAULT_FORM_DATA } from './types'
import { StepIdentity } from './StepIdentity'
import { StepContent } from './StepContent'
import { StepProducts } from './StepProducts'
import { StepSettings } from './StepSettings'
import { MuiProvider } from '../mui-theme-provider'

// Custom styled connector for the stepper
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
}))

// Custom step icon
interface CustomStepIconProps {
  active?: boolean
  completed?: boolean
  icon: React.ReactNode
  stepNumber: number
}

function CustomStepIcon({ active, completed, icon, stepNumber }: CustomStepIconProps) {
  const icons: Record<number, React.ReactNode> = {
    1: <FileText size={20} />,
    2: <Type size={20} />,
    3: <ShoppingBag size={20} />,
    4: <Settings size={20} />,
  }

  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: completed 
          ? 'success.main' 
          : active 
            ? 'primary.main' 
            : 'action.disabledBackground',
        color: completed || active ? 'primary.contrastText' : 'text.disabled',
        transition: 'all 0.3s ease',
        boxShadow: active ? 4 : 0,
        transform: active ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {completed ? <Check size={22} /> : icons[stepNumber]}
    </Box>
  )
}

// Preview component
function LandingPreview({ data, products }: { data: WizardFormData; products: { id: string; name: string; pointsCost?: number; images?: string[] }[] }) {
  const selectedProducts = products.filter(p => data.productIds?.includes(p.id))

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        height: 'fit-content',
        maxHeight: 500,
      }}
    >
      {/* Browser Chrome */}
      <Box sx={{ bgcolor: 'grey.100', px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f57' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#febc2e' }} />
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28c840' }} />
        </Box>
        <Box 
          sx={{ 
            flex: 1, 
            bgcolor: 'white', 
            borderRadius: 1, 
            px: 1.5, 
            py: 0.5, 
            fontSize: '0.7rem',
            color: 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          yoobe.co/landing/{data.slug || '...'}
        </Box>
      </Box>

      {/* Page Content */}
      <Box 
        sx={{ 
          bgcolor: data.backgroundColor || '#ffffff',
          maxHeight: 440,
          overflow: 'auto',
        }}
      >
        {/* Banner */}
        {data.bannerUrl ? (
          <Box sx={{ position: 'relative', height: 100, bgcolor: 'grey.200' }}>
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
                  p: 1,
                }}
              >
                <Typography 
                  variant="body2" 
                  fontWeight={700} 
                  sx={{ color: 'white', textAlign: 'center' }}
                >
                  {data.bannerText}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box 
            sx={{ 
              height: 100, 
              background: `linear-gradient(135deg, ${data.primaryColor}33, ${data.secondaryColor}33)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon size={32} style={{ opacity: 0.3 }} />
          </Box>
        )}

        {/* Content */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            fontWeight={700} 
            sx={{ color: data.textColor || '#1f2937', mb: 1 }}
          >
            {data.welcomeTitle || 'Bem-vindo!'}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: data.textColor || '#1f2937', 
              opacity: 0.7, 
              mb: 3,
              fontSize: '0.75rem',
              lineHeight: 1.5,
            }}
          >
            {data.welcomeMessage || 'Sua mensagem de boas-vindas aqui.'}
          </Typography>

          {/* Products */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 3 }}>
            {selectedProducts.length > 0 ? (
              selectedProducts.slice(0, 4).map(p => (
                <Paper key={p.id} variant="outlined" sx={{ p: 1, borderRadius: 1.5, textAlign: 'left' }}>
                  <Box 
                    sx={{ 
                      aspectRatio: '1', 
                      borderRadius: 1, 
                      bgcolor: 'grey.100', 
                      mb: 0.5,
                      overflow: 'hidden',
                    }}
                  >
                    {p.images?.[0] && (
                      <Box
                        component="img"
                        src={p.images[0]}
                        alt={p.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" fontWeight={600} noWrap sx={{ display: 'block' }}>
                    {p.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    {p.pointsCost} pts
                  </Typography>
                </Paper>
              ))
            ) : (
              <Box 
                sx={{ 
                  gridColumn: '1 / -1', 
                  py: 4, 
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  opacity: 0.5,
                }}
              >
                <ShoppingBag size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
                <Typography variant="caption">Nenhum produto</Typography>
              </Box>
            )}
          </Box>

          {/* CTA Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{ 
              bgcolor: data.primaryColor || '#16a34a',
              '&:hover': { bgcolor: data.primaryColor || '#16a34a', filter: 'brightness(0.9)' },
              py: 1.25,
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {data.ctaText || 'Acessar Loja'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

function LandingWizardContent({
  open,
  onClose,
  onSave,
  editingPage,
  companyId,
  products,
  tags,
  existingPages,
}: LandingWizardProps) {
  const [activeStep, setActiveStep] = React.useState(0)
  const [formData, setFormData] = React.useState<WizardFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = React.useState<ValidationErrors>({})
  const [selectedProducts, setSelectedProducts] = React.useState<{ productId: string; quantity: number }[]>([])
  const [isSaving, setIsSaving] = React.useState(false)

  // Initialize form data when editing
  React.useEffect(() => {
    if (editingPage) {
      setFormData({
        title: editingPage.title,
        slug: editingPage.slug,
        type: editingPage.type as 'onboarding' | 'campaign',
        primaryColor: editingPage.primaryColor || '#16a34a',
        secondaryColor: editingPage.secondaryColor || '#8b5cf6',
        welcomeTitle: editingPage.welcomeTitle || 'Bem-vindo!',
        welcomeMessage: editingPage.welcomeMessage || '',
        ctaText: editingPage.ctaText || 'Acessar Loja',
        bannerUrl: editingPage.bannerUrl || '',
        bannerText: editingPage.bannerText || '',
        backgroundColor: editingPage.backgroundColor || '#ffffff',
        textColor: editingPage.textColor || '#1f2937',
        productIds: editingPage.productIds || [],
        assignedTags: editingPage.assignedTags || [],
        isActive: editingPage.isActive ?? true,
      })
      setSelectedProducts((editingPage.productIds || []).map(id => ({ productId: id, quantity: 1 })))
    } else {
      setFormData(DEFAULT_FORM_DATA)
      setSelectedProducts([])
    }
    setActiveStep(0)
    setErrors({})
  }, [editingPage, open])

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {}

    if (step === 0) {
      if (!formData.title.trim()) {
        newErrors.title = 'Título é obrigatório'
      }
      if (!formData.slug.trim()) {
        newErrors.slug = 'Slug é obrigatório'
      } else {
        const slugNormalized = formData.slug.toLowerCase().replace(/\s+/g, '-')
        const existingPage = existingPages.find(
          p => p.slug === slugNormalized && p.id !== editingPage?.id
        )
        if (existingPage) {
          newErrors.slug = 'Este slug já está em uso'
        }
      }
    }

    if (step === 1) {
      if (!formData.welcomeTitle.trim()) {
        newErrors.welcomeTitle = 'Título de boas-vindas é obrigatório'
      }
      if (!formData.ctaText.trim()) {
        newErrors.ctaText = 'Texto do botão é obrigatório'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setErrors({})
    setActiveStep(prev => prev - 1)
  }

  const handleSave = async () => {
    // Validate all steps
    for (let step = 0; step < WIZARD_STEPS.length; step++) {
      if (!validateStep(step)) {
        setActiveStep(step)
        return
      }
    }

    setIsSaving(true)
    try {
      const landingPage: LandingPage = {
        id: editingPage?.id || `lp_${Date.now()}`,
        companyId,
        title: formData.title,
        slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
        type: formData.type,
        welcomeTitle: formData.welcomeTitle,
        welcomeMessage: formData.welcomeMessage,
        ctaText: formData.ctaText,
        bannerUrl: formData.bannerUrl || undefined,
        bannerText: formData.bannerText || undefined,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        backgroundColor: formData.backgroundColor,
        textColor: formData.textColor,
        productIds: formData.productIds,
        assignedTags: formData.assignedTags,
        isActive: formData.isActive,
        createdAt: editingPage?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await onSave(landingPage)
      onClose()
    } catch (error) {
      console.error('Error saving landing page:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const renderStepContent = () => {
    const commonProps = { formData, setFormData, errors, setErrors }

    switch (activeStep) {
      case 0:
        return <StepIdentity {...commonProps} />
      case 1:
        return <StepContent {...commonProps} />
      case 2:
        return (
          <StepProducts 
            {...commonProps} 
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            companyId={companyId}
          />
        )
      case 3:
        return <StepSettings {...commonProps} tags={tags} />
      default:
        return null
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={isSaving ? undefined : onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          maxHeight: '95vh',
          borderRadius: 4,
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {editingPage ? 'Editar Landing Page' : 'Nova Landing Page'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure sua página em {WIZARD_STEPS.length} passos simples
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={isSaving}>
            <X size={24} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Stepper */}
      <Box sx={{ px: 3, pt: 3 }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          connector={<CustomConnector />}
        >
          {WIZARD_STEPS.map((step, index) => (
            <Step key={step.id}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon {...props} stepNumber={index + 1} />
                )}
              >
                <Typography variant="body2" fontWeight={activeStep === index ? 600 : 400}>
                  {step.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {step.description}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <DialogContent sx={{ display: 'flex', gap: 3, pt: 3 }}>
        {/* Form */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Fade in key={activeStep}>
            <Box>{renderStepContent()}</Box>
          </Fade>
        </Box>

        {/* Preview */}
        <Box 
          sx={{ 
            width: 320, 
            flexShrink: 0,
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <Typography 
            variant="overline" 
            color="text.secondary" 
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
          >
            <Eye size={14} />
            Preview em Tempo Real
          </Typography>
          <LandingPreview data={formData} products={products} />
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={activeStep === 0 ? onClose : handleBack}
          disabled={isSaving}
          startIcon={<ArrowLeft size={18} />}
          sx={{ mr: 'auto' }}
        >
          {activeStep === 0 ? 'Cancelar' : 'Voltar'}
        </Button>

        {activeStep < WIZARD_STEPS.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowRight size={18} />}
          >
            Próximo
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving}
            color="success"
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <Check size={18} />}
          >
            {isSaving ? 'Salvando...' : 'Finalizar e Salvar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

// Export wrapped with MuiProvider
export function LandingWizard(props: LandingWizardProps) {
  return (
    <MuiProvider>
      <LandingWizardContent {...props} />
    </MuiProvider>
  )
}
