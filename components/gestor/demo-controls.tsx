"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDemoState } from "@/hooks/use-demo-state"
import { useTheme } from "next-themes"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Env } from "@/lib/storage"
import { Sparkles, Palette, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { getCompanyById } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export function DemoBadge() {
  const { isMounted } = useDemoState()
  if (!isMounted) return null

  return (
    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 px-3 py-1 font-bold tracking-wider">
      DEMO MODE
    </Badge>
  )
}

export function EnvSwitcher() {
  const { env, toggleEnv, isMounted } = useDemoState()
  if (!isMounted) return null

  return (
    <Select value={env} onValueChange={(val) => toggleEnv(val as Env)}>
      <SelectTrigger className="w-[140px] h-8 text-xs font-semibold bg-secondary/50 border-none shadow-none focus:ring-0">
        <div className="flex items-center gap-2 capitalize">
          <div className={`h-2 w-2 rounded-full ${env === "sandbox" ? "bg-orange-500" : "bg-green-500"}`} />
          <SelectValue placeholder="Ambiente" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sandbox" className="text-xs">Sandbox</SelectItem>
        <SelectItem value="production" className="text-xs">Production (Demo)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export function FunModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isFunMode = theme === "fun"

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isFunMode ? "light" : "fun")}
      className="h-8 text-xs font-semibold bg-secondary/50 border-none shadow-none hover:bg-secondary/70 gap-2"
      title={isFunMode ? "Desativar Fun Mode" : "Ativar Fun Mode (Stitch Design)"}
    >
      <Sparkles className={`h-3.5 w-3.5 ${isFunMode ? "text-primary" : "text-muted-foreground"}`} />
      <span className="group-data-[collapsible=icon]:hidden">
        {isFunMode ? "Fun Mode" : "Fun"}
      </span>
    </Button>
  )
}

export function QuickBrandSeeder() {
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleQuickBrand = () => {
    try {
      const authData = localStorage.getItem("yoobe_auth")
      if (!authData) return

      const auth = JSON.parse(authData)
      if (!auth.companyId) return

      const company = getCompanyById(auth.companyId)
      if (!company) return

      // Quick brand presets for demo
      const presets = [
        { primary: "#10b981", secondary: "#059669", name: "Verde Corporativo" },
        { primary: "#3b82f6", secondary: "#2563eb", name: "Azul Profissional" },
        { primary: "#8b5cf6", secondary: "#7c3aed", name: "Roxo Moderno" },
        { primary: "#f59e0b", secondary: "#d97706", name: "Laranja Energético" },
      ]

      const randomPreset = presets[Math.floor(Math.random() * presets.length)]
      
      // Update company colors
      const companies = JSON.parse(localStorage.getItem("yoobe_companies_v3") || "[]")
      const index = companies.findIndex((c: any) => c.id === auth.companyId)
      if (index > -1) {
        companies[index] = {
          ...companies[index],
          primaryColor: randomPreset.primary,
          secondaryColor: randomPreset.secondary,
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem("yoobe_companies_v3", JSON.stringify(companies))
        
        toast({
          title: "Marca atualizada!",
          description: `Aplicado tema: ${randomPreset.name}`,
        })

        // Trigger page refresh to apply new colors
        window.location.reload()
      }
    } catch (error) {
      console.error("Error applying quick brand:", error)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleQuickBrand}
      className="h-8 text-xs font-semibold gap-2 group-data-[collapsible=icon]:px-2"
      title="Aplicar marca rápida (demo)"
    >
      <Palette className="h-3.5 w-3.5" />
      <span className="group-data-[collapsible=icon]:hidden">Quick Brand</span>
    </Button>
  )
}
