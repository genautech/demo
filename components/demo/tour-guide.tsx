"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import "@/styles/driver-custom.css"
import { getTourForRoute, type TourConfig, TOUR_CONFIGS } from "@/lib/tour-config"
import { getTourProgress, saveTourProgress, isTourCompleted } from "@/lib/storage"
import { getCompanyById } from "@/lib/storage"
import { UserRole } from "@/lib/roles"
import Image from "next/image"
import { toast } from "sonner"
import { HelpCenter } from "./help-center"

interface TourGuideProps {
  role: UserRole
  companyId?: string
  enabled?: boolean
}

// Helper para persistir tour pendente entre navegações
const PENDING_TOUR_KEY = 'yoobe_pending_tour'

function setPendingTour(tourId: string | null) {
  if (typeof window === 'undefined') return
  if (tourId) {
    sessionStorage.setItem(PENDING_TOUR_KEY, tourId)
  } else {
    sessionStorage.removeItem(PENDING_TOUR_KEY)
  }
}

function getPendingTour(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(PENDING_TOUR_KEY)
}

export function TourGuide({ role, companyId, enabled = true }: TourGuideProps) {
  const pathname = usePathname()
  const router = useRouter()
  const driverRef = useRef<any>(null)
  const [currentTour, setCurrentTour] = useState<TourConfig | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  // Inicializar driver.js apenas uma vez (separado do useEffect de tour)
  useEffect(() => {
    if (typeof window !== "undefined" && !driverRef.current) {
      driverRef.current = driver({
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        progressText: "Passo {{current}} de {{total}}",
        nextBtnText: "Bora! →",
        prevBtnText: "← Voltar",
        doneBtnText: "Fechar",
        closeBtnText: "Sair",
        onDestroyStarted: () => {
          setIsActive(false)
        },
        onDestroyed: () => {
          setIsActive(false)
        },
        onHighlightStarted: () => {
          setIsActive(true)
        },
      })
    }
  }, [])

  useEffect(() => {
    // Expor função para abrir ajuda via window
    if (typeof window !== "undefined") {
      (window as any).__openHelp = () => setIsHelpOpen(true)
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).__openHelp
      }
    }
  }, [])

  useEffect(() => {
    // Verificar se o tour está habilitado
    if (!enabled) {
      setCurrentTour(null)
      return
    }

    // Verificar configuração da empresa
    if (companyId) {
      const company = getCompanyById(companyId)
      if (company?.helpTourEnabled === false) {
        setCurrentTour(null)
        return
      }
    }

    // Mapear role para o formato do tour
    const tourRole = role === "superAdmin" ? "manager" : role

    // Obter tour para a rota atual
    const tour = getTourForRoute(pathname, tourRole as "manager" | "member")
    
    if (!tour) {
      setCurrentTour(null)
      return
    }

    // Sempre mostrar o tour, mesmo se já foi completado (permite reiniciar)
    setCurrentTour(tour)
  }, [pathname, role, companyId, enabled])

  // Iniciar tour pendente após navegação
  useEffect(() => {
    const pendingTourId = getPendingTour()
    const normalizedPath = pathname.split("?")[0]
    
    if (pendingTourId && driverRef.current) {
      const tourConfig = TOUR_CONFIGS.find(t => t.id === pendingTourId)
      
      // Verificar se chegamos na rota correta
      if (tourConfig && normalizedPath === tourConfig.route) {
        // Limpar o tour pendente
        setPendingTour(null)
        
        // Aguardar o DOM renderizar e iniciar o tour
        setTimeout(() => {
          startTour(pendingTourId, true) // skipNavigation = true
        }, 800)
      }
    }
  }, [pathname])

  const startTour = (tourId?: string, skipNavigation?: boolean) => {
    // Se um tourId for passado, buscar esse tour específico
    let tourToStart = currentTour
    if (tourId && typeof tourId === 'string') {
      tourToStart = TOUR_CONFIGS.find((t: any) => t.id === tourId) || currentTour
    }

    if (!driverRef.current || !tourToStart) {
      return
    }

    // Verificar se precisa navegar para a rota do tour
    const normalizedPath = pathname.split("?")[0]
    if (!skipNavigation && tourToStart.route && normalizedPath !== tourToStart.route) {
      // Salvar o tour pendente em sessionStorage e navegar
      setPendingTour(tourToStart.id)
      router.push(tourToStart.route)
      return
    }

    // Filtrar steps que têm elementos válidos no DOM
    const validSteps = tourToStart.steps.filter((step: any) => {
      try {
        const element = document.querySelector(step.element)
        return element !== null
      } catch {
        return false
      }
    })

    if (validSteps.length === 0) {
      console.warn("Nenhum elemento válido encontrado para o tour")
      if (tourId) {
        toast.error("Nenhum elemento deste tour foi encontrado na página atual.")
      }
      return
    }

    // Converter steps do tour para o formato do driver.js
    const driverSteps = validSteps.map((step) => {
      const driverStep: any = {
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          side: step.popover.side || "bottom",
          align: step.popover.align || "center",
        },
      }

      // Adicionar media se existir
      if (step.media) {
        const mediaHtml =
          step.media.type === "image" || step.media.type === "gif"
            ? `<div style="margin-top: 1rem; border-radius: 0.5rem; overflow: hidden; border: 1px solid #e5e7eb;"><img src="${step.media.url}" alt="${step.media.alt || ""}" style="width: 100%; height: auto; max-height: 300px; object-fit: contain;" /></div>`
            : step.media.type === "video"
            ? `<div style="margin-top: 1rem; border-radius: 0.5rem; overflow: hidden; border: 1px solid #e5e7eb;"><video src="${step.media.url}" controls style="width: 100%; height: auto; max-height: 256px;" autoplay loop muted></video></div>`
            : ""

        driverStep.popover.description = `${step.popover.description}${mediaHtml}`
      }

      return driverStep
    })

    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(() => {
      if (driverSteps.length > 0) {
        try {
          // Armazenar referência do driver para poder destruí-lo manualmente
          let currentDriver: any = null
          
          // Criar nova instância do driver com os steps configurados
          currentDriver = driver({
            showProgress: true,
            showButtons: ["next", "previous", "close"],
            progressText: "Passo {{current}} de {{total}}",
            nextBtnText: "Próximo →",
            prevBtnText: "← Anterior",
            doneBtnText: "Concluir ✓",
            closeBtnText: "✕",
            allowClose: true,
            steps: driverSteps,
            onCloseClick: () => {
              if (currentDriver) {
                currentDriver.destroy()
              }
              setIsActive(false)
            },
            onDestroyed: () => {
              setIsActive(false)
            },
          })
          
          const tourDriver = currentDriver
          
          // Iniciar o tour
          tourDriver.drive()
          setIsActive(true)
        } catch (error: any) {
          console.error("Error starting tour:", error)
        }
      }
    }, 100)
  }

  // Expor função para iniciar tour externamente via window
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__startTour = (tourId?: string) => {
        startTour(tourId)
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).__startTour
      }
    }
  }, [currentTour])

  // Não renderizar nada se estiver desabilitado
  if (!enabled) {
    return null
  }

  return (
    <HelpCenter 
      isOpen={isHelpOpen} 
      onClose={() => setIsHelpOpen(false)} 
      userRole={role} 
    />
  )
}

/**
 * Componente de botão de ajuda para o header
 * Pode ser usado no AppShell header
 */
export function TourHelpButton({ role, companyId, enabled = true }: { role: UserRole, companyId?: string, enabled?: boolean }) {
  const pathname = usePathname()
  const [isTourActive, setIsTourActive] = useState(false)

  useEffect(() => {
    // Listener para detectar quando o tour está ativo
    const checkTourActive = () => {
      const driverElement = document.querySelector('.driver-popover')
      setIsTourActive(driverElement !== null)
    }

    const interval = setInterval(checkTourActive, 500)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).__openHelp) {
      (window as any).__openHelp()
    }
  }

  if (!enabled || isTourActive) {
    return null
  }

  return (
    <button
      onClick={handleClick}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-linear-to-r from-yellow-400 to-amber-500 text-slate-900 hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
      title="Central de Ajuda - Assistente da Demo"
    >
      {/* Subtle glow effect */}
      <span className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <span className="relative text-lg">✨</span>
      <span className="relative hidden sm:inline">Ajuda</span>
      
      {/* Pulse indicator for attention */}
      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
      </span>
    </button>
  )
}
