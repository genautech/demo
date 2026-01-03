"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Shield, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const roleConfig = {
  manager: { icon: Shield, label: "Gestor", color: "text-blue-600" },
  member: { icon: UserIcon, label: "Membro", color: "text-emerald-600" },
  superAdmin: { icon: Users, label: "Admin", color: "text-slate-700" },
}

export function PerspectiveSwitcher() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentRole, setCurrentRole] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        setCurrentRole(auth.role)
      } catch (e) {
        console.error("Error parsing auth data", e)
      }
    }
  }, [])

  if (!mounted) return null

  const switchRole = (role: string) => {
    const authData = localStorage.getItem("yoobe_auth")
    if (!authData) return

    try {
      const auth = JSON.parse(authData)
      const newAuth = { ...auth, role }
      localStorage.setItem("yoobe_auth", JSON.stringify(newAuth))
      setCurrentRole(role)

      toast({
        title: `Perspectiva alterada`,
        description: `Visualizando como ${roleConfig[role as keyof typeof roleConfig].label}`,
        duration: 2000,
      })

      // Redirect to appropriate dashboard
      if (role === "manager") router.push("/gestor/catalog")
      else if (role === "member") router.push("/membro/gamificacao")
      else router.push("/super-admin/conductor")
      
      // Force reload to update permissions and shell
      setTimeout(() => window.location.reload(), 500)
    } catch (e) {
      console.error("Error switching role", e)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={currentRole} onValueChange={switchRole}>
        <SelectTrigger className="h-8 w-[130px] text-xs bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:bg-muted/50 transition-all">
          <SelectValue placeholder="Perspectiva" />
        </SelectTrigger>
        <SelectContent align="end" className="w-[140px]">
          {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => {
            const config = roleConfig[role]
            const Icon = config.icon
            
            return (
              <SelectItem key={role} value={role} className="text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-3.5 w-3.5", config.color)} />
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
