'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileText, 
  Type, 
  ShoppingBag, 
  Settings,
  Save,
  X,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getLandingPages,
  saveLandingPage,
  getCompanyProductsByCompany,
  getTagsV3,
  type LandingPage,
  type CompanyProduct,
  type Tag,
} from '@/lib/storage'
import { MuiProvider } from '@/components/mui-theme-provider'
import { DeviceMockup } from '@/components/landing-wizard/DeviceMockup'
import { LandingPreviewContent } from '@/components/landing-wizard/LandingPreviewContent'
import { StepIdentity } from '@/components/landing-wizard/StepIdentity'
import { StepContent } from '@/components/landing-wizard/StepContent'
import { StepProducts } from '@/components/landing-wizard/StepProducts'
import { StepSettings } from '@/components/landing-wizard/StepSettings'
import type { WizardFormData, ValidationErrors } from '@/components/landing-wizard/types'
import { WIZARD_STEPS, DEFAULT_FORM_DATA } from '@/components/landing-wizard/types'

// Custom Stepper Connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 2,
  },
}))

// Custom Step Icon
interface CustomStepIconProps {
  active?: boolean
  completed?: boolean
  stepNumber: number
}

function CustomStepIcon({ active, completed, stepNumber }: CustomStepIconProps) {
  const icons: Record<number, React.ReactNode> = {
    1: <FileText size={20} />,
    2: <Type size={20} />,
    3: <ShoppingBag size={20} />,
    4: <Settings size={20} />,
  }

  return (
    <Box
      sx={{
        width: 48,
        height: 48,
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
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: active ? '0 4px 20px rgba(22, 163, 74, 0.4)' : 'none',
        transform: active ? 'scale(1.15)' : 'scale(1)',
        border: active ? '3px solid' : 'none',
        borderColor: 'primary.light',
      }}
    >
      {completed ? <Check size={24} strokeWidth={3} /> : icons[stepNumber]}
    </Box>
  )
}

function NewLandingPageContent() {
  const router = useRouter()
  const [activeStep, setActiveStep] = React.useState(0)
  const [formData, setFormData] = React.useState<WizardFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = React.useState<ValidationErrors>({})
  const [selectedProducts, setSelectedProducts] = React.useState<{ productId: string; quantity: number }[]>([])
  const [isSaving, setIsSaving] = React.useState(false)
  
  // Data
  const [companyId, setCompanyId] = React.useState('company_1')
  const [products, setProducts] = React.useState<CompanyProduct[]>([])
  const [tags, setTags] = React.useState<Tag[]>([])
  const [existingPages, setExistingPages] = React.useState<LandingPage[]>([])

  // Load data
  React.useEffect(() => {
    const authData = localStorage.getItem('yoobe_auth')
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        const cId = auth.companyId || 'company_1'
        setCompanyId(cId)
        
        const pages = getLandingPages(cId)
        setExistingPages(pages)
        
        const companyProducts = getCompanyProductsByCompany(cId)
        setProducts(companyProducts.filter(p => p.isActive && p.status === 'active' && (p.stockQuantity || 0) > 0))
        
        const allTags = getTagsV3()
        setTags(allTags)
      } catch (e) {
        console.error('Erro ao carregar dados:', e)
      }
    }
  }, [])

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
        const existingPage = existingPages.find(p => p.slug === slugNormalized)
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
    if (activeStep === 0) {
      router.push('/gestor/landing-pages')
    } else {
      setActiveStep(prev => prev - 1)
    }
  }

  const handleSave = async () => {
    for (let step = 0; step < WIZARD_STEPS.length; step++) {
      if (!validateStep(step)) {
        setActiveStep(step)
        return
      }
    }

    setIsSaving(true)
    try {
      const landingPage: LandingPage = {
        id: `lp_${Date.now()}`,
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
        // Gamification fields
        enableConfetti: formData.enableConfetti,
        enableParticles: formData.enableParticles,
        enableGlow: formData.enableGlow,
        animationStyle: formData.animationStyle,
        badgeIcon: formData.badgeIcon,
        pointsReward: formData.pointsReward,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as LandingPage

      saveLandingPage(landingPage)
      toast.success('Landing page criada com sucesso!')
      router.push('/gestor/landing-pages')
    } catch (error) {
      console.error('Error saving landing page:', error)
      toast.error('Erro ao criar landing page')
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, py: 2 }}>
          {/* Top Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => router.push('/gestor/landing-pages')}>
                <ArrowLeft size={20} />
              </IconButton>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Nova Landing Page
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure sua página em {WIZARD_STEPS.length} passos
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Chip 
                label={`Passo ${activeStep + 1} de ${WIZARD_STEPS.length}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/gestor/landing-pages')}
                startIcon={<X size={16} />}
              >
                Cancelar
              </Button>
            </Box>
          </Box>

          {/* Stepper */}
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
                  <Typography variant="body2" fontWeight={activeStep === index ? 700 : 500}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Paper>

      {/* Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, py: 4 }}>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' },
            gap: 4,
            alignItems: 'start',
          }}
        >
          {/* Form Panel */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {WIZARD_STEPS[activeStep].label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {WIZARD_STEPS[activeStep].description}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {renderStepContent()}
          </Paper>

          {/* Preview Panel */}
          <Box 
            sx={{ 
              position: 'sticky',
              top: 200,
              display: { xs: 'none', lg: 'block' },
            }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50',
              }}
            >
              <Typography 
                variant="overline" 
                sx={{ 
                  display: 'block',
                  textAlign: 'center',
                  mb: 2,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  color: 'text.secondary',
                }}
              >
                Preview em Tempo Real
              </Typography>
              
              <DeviceMockup slug={formData.slug}>
                <LandingPreviewContent data={formData} products={products} />
              </DeviceMockup>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Paper 
        elevation={0}
        sx={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          zIndex: 100,
        }}
      >
        <Box 
          sx={{ 
            maxWidth: 1400, 
            mx: 'auto', 
            px: 3, 
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowLeft size={18} />}
          >
            {activeStep === 0 ? 'Cancelar' : 'Voltar'}
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep < WIZARD_STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowRight size={18} />}
                sx={{ px: 4 }}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
                color="success"
                startIcon={isSaving ? null : <Save size={18} />}
                sx={{ px: 4 }}
              >
                {isSaving ? 'Salvando...' : 'Criar Landing Page'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Bottom padding for fixed footer */}
      <Box sx={{ height: 80 }} />
    </Box>
  )
}

export default function NewLandingPage() {
  return (
    <MuiProvider>
      <NewLandingPageContent />
    </MuiProvider>
  )
}
