"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Settings2, Sparkles, Building2, Users, Palette, Image as ImageIcon, Zap } from "lucide-react"
import { getCompanyById, updateCompany, simulateDemoUsers } from "@/lib/storage"
import { eventBus } from "@/lib/eventBus"

const demoCustomizerSchema = z.object({
  companyName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  userCount: z.number().min(1).max(1000),
  vertical: z.string().min(1, "Selecione um vertical"),
})

type DemoCustomizerFormValues = z.infer<typeof demoCustomizerSchema>

// Industry vertical presets
const VERTICAL_PRESETS = {
  tech: {
    name: "Tecnologia",
    primaryColor: "#3b82f6",
    secondaryColor: "#2563eb",
    description: "Startups e empresas de tecnologia",
  },
  finance: {
    name: "Financeiro",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    description: "Bancos, fintechs e serviços financeiros",
  },
  creative: {
    name: "Criativo",
    primaryColor: "#8b5cf6",
    secondaryColor: "#7c3aed",
    description: "Agências, design e marketing",
  },
  retail: {
    name: "Varejo",
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706",
    description: "Lojas físicas e e-commerce",
  },
  healthcare: {
    name: "Saúde",
    primaryColor: "#ef4444",
    secondaryColor: "#dc2626",
    description: "Hospitais, clínicas e saúde",
  },
  education: {
    name: "Educação",
    primaryColor: "#06b6d4",
    secondaryColor: "#0891b2",
    description: "Escolas, universidades e cursos",
  },
  corporate: {
    name: "Corporativo",
    primaryColor: "#64748b",
    secondaryColor: "#475569",
    description: "Grandes corporações tradicionais",
  },
}

export function DemoCustomizer() {
  const [open, setOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<DemoCustomizerFormValues>({
    resolver: zodResolver(demoCustomizerSchema),
    defaultValues: {
      companyName: "",
      logoUrl: "",
      userCount: 50,
      vertical: "",
    },
  })

  // Load current company data
  useEffect(() => {
    if (open) {
      const authData = localStorage.getItem("yoobe_auth")
      if (authData) {
        try {
          const auth = JSON.parse(authData)
          if (auth.companyId) {
            const company = getCompanyById(auth.companyId)
            if (company) {
              form.setValue("companyName", company.name)
              form.setValue("logoUrl", company.logo || "")
              
              // Detect vertical from colors
              const preset = Object.entries(VERTICAL_PRESETS).find(
                ([_, preset]) => preset.primaryColor === company.primaryColor
              )
              if (preset) {
                form.setValue("vertical", preset[0])
                setSelectedPreset(preset[0])
              }

              // Count current users
              const users = JSON.parse(localStorage.getItem("yoobe_users_v3") || "[]")
              form.setValue("userCount", users.length || 50)
            }
          }
        } catch (error) {
          console.error("Error loading company data:", error)
        }
      }
    }
  }, [open, form])

  const applyPreset = (presetKey: string) => {
    const preset = VERTICAL_PRESETS[presetKey as keyof typeof VERTICAL_PRESETS]
    if (preset) {
      form.setValue("vertical", presetKey)
      setSelectedPreset(presetKey)
      toast({
        title: "Preset aplicado!",
        description: `Tema ${preset.name} selecionado`,
      })
    }
  }

  const onSubmit = async (values: DemoCustomizerFormValues) => {
    try {
      const authData = localStorage.getItem("yoobe_auth")
      if (!authData) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        })
        return
      }

      const auth = JSON.parse(authData)
      if (!auth.companyId) {
        toast({
        title: "Erro",
        description: "Empresa não encontrada",
        variant: "destructive",
      })
        return
      }

      // Get preset colors if vertical is selected
      let primaryColor = "#10b981"
      let secondaryColor = "#059669"
      if (values.vertical && VERTICAL_PRESETS[values.vertical as keyof typeof VERTICAL_PRESETS]) {
        const preset = VERTICAL_PRESETS[values.vertical as keyof typeof VERTICAL_PRESETS]
        primaryColor = preset.primaryColor
        secondaryColor = preset.secondaryColor
      }

      // Update company
      const updated = updateCompany(auth.companyId, {
        name: values.companyName,
        logo: values.logoUrl || undefined,
        primaryColor,
        secondaryColor,
      })

      if (!updated) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a empresa",
          variant: "destructive",
        })
        return
      }

      // Simulate users for demo
      simulateDemoUsers(values.userCount, auth.companyId)
      
      // Store demo config
      if (typeof window !== "undefined") {
        localStorage.setItem("yoobe_demo_config", JSON.stringify({
          userCount: values.userCount,
          vertical: values.vertical,
          appliedAt: new Date().toISOString(),
        }))
      }

      // Trigger celebration
      eventBus.emit("sandbox" as any, "celebration.test" as any, {
        type: "demo_ready",
        companyName: values.companyName,
      })

      toast({
        title: "Demo personalizada! 🎉",
        description: `${values.companyName} está pronta para apresentação`,
      })

      // Reload to apply changes
      setTimeout(() => {
        window.location.reload()
      }, 1000)

      setOpen(false)
    } catch (error) {
      console.error("Error applying demo customization:", error)
      toast({
        title: "Erro",
        description: "Não foi possível aplicar as personalizações",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold gap-2 group-data-[collapsible=icon]:px-2"
          title="Personalizar Demo para Lead"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span className="group-data-[collapsible=icon]:hidden">Demo Setup</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Personalizar Demo</DialogTitle>
              <DialogDescription>
                Configure a plataforma para impressionar seu lead
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Presets Rápidos por Vertical
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(VERTICAL_PRESETS).map(([key, preset]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedPreset === key
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => applyPreset(key)}
                >
                  <CardContent className="p-3">
                    <div
                      className="h-8 w-full rounded mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${preset.primaryColor} 0%, ${preset.secondaryColor} 100%)`,
                      }}
                    />
                    <p className="text-xs font-semibold text-center">{preset.name}</p>
                    <p className="text-[10px] text-muted-foreground text-center mt-0.5">
                      {preset.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Nome da Empresa
            </Label>
            <Input
              id="companyName"
              placeholder="Ex: TechCorp Solutions"
              {...form.register("companyName")}
            />
            {form.formState.errors.companyName && (
              <p className="text-xs text-red-500">
                {form.formState.errors.companyName.message}
              </p>
            )}
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logoUrl" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              URL do Logo (opcional)
            </Label>
            <Input
              id="logoUrl"
              type="url"
              placeholder="https://exemplo.com/logo.png"
              {...form.register("logoUrl")}
            />
            {form.formState.errors.logoUrl && (
              <p className="text-xs text-red-500">{form.formState.errors.logoUrl.message}</p>
            )}
            {form.watch("logoUrl") && (
              <div className="mt-2 p-2 border rounded-lg bg-slate-50">
                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                <img
                  src={form.watch("logoUrl")}
                  alt="Logo preview"
                  className="h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* User Count */}
          <div className="space-y-2">
            <Label htmlFor="userCount" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Número de Usuários (Simulado)
            </Label>
            <Input
              id="userCount"
              type="number"
              min="1"
              max="1000"
              placeholder="50"
              {...form.register("userCount", { valueAsNumber: true })}
            />
            {form.formState.errors.userCount && (
              <p className="text-xs text-red-500">
                {form.formState.errors.userCount.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Quantidade de membros que aparecerão na demo (leaderboard, estatísticas, etc.)
            </p>
          </div>

          {/* Vertical Selection */}
          <div className="space-y-2">
            <Label htmlFor="vertical" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Vertical/Indústria
            </Label>
            <Select
              value={form.watch("vertical")}
              onValueChange={(value) => {
                form.setValue("vertical", value)
                setSelectedPreset(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um vertical" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VERTICAL_PRESETS).map(([key, preset]) => (
                  <SelectItem key={key} value={key}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.vertical && (
              <p className="text-xs text-red-500">{form.formState.errors.vertical.message}</p>
            )}
          </div>

          {/* Preview */}
          {form.watch("vertical") && VERTICAL_PRESETS[form.watch("vertical") as keyof typeof VERTICAL_PRESETS] && (
            <div className="p-4 rounded-lg border-2 border-dashed bg-slate-50">
              <p className="text-sm font-semibold mb-3 text-center">Preview da Marca</p>
              <div
                className="h-24 rounded-lg shadow-lg flex items-center justify-center transition-all"
                style={{
                  background: `linear-gradient(135deg, ${
                    VERTICAL_PRESETS[form.watch("vertical") as keyof typeof VERTICAL_PRESETS].primaryColor
                  } 0%, ${
                    VERTICAL_PRESETS[form.watch("vertical") as keyof typeof VERTICAL_PRESETS].secondaryColor
                  } 100%)`,
                }}
              >
                {form.watch("logoUrl") ? (
                  <img
                    src={form.watch("logoUrl")}
                    alt="Logo"
                    className="h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-white/90" />
                )}
              </div>
              <p className="text-xs text-center mt-2 text-slate-600">
                {form.watch("companyName") || "Nome da Empresa"}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
              <Sparkles className="mr-2 h-4 w-4" />
              Aplicar Demo Personalizada
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
