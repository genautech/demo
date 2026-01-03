"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { UserRole, canAccess, hasRequiredLevel } from "@/lib/roles"
import { AppearanceApplier } from "./appearance-applier"

interface AuthGateProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function AuthGate({ children, requiredRole }: AuthGateProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    
    if (!authData) {
      if (pathname !== "/login" && !pathname.startsWith("/sandbox") && !pathname.startsWith("/onboarding") && !pathname.startsWith("/demo-guide") && !pathname.startsWith("/landing") && !pathname.startsWith("/campanha") && !pathname.startsWith("/solucoes")) {
        router.push("/login")
      } else {
        setIsAuthorized(true)
      }
      return
    }

    try {
      const auth = JSON.parse(authData)
      const userRole = (auth.role as UserRole) || "member"

      // 1. Verifica se tem o nível mínimo exigido pelo componente (se houver)
      if (requiredRole && !hasRequiredLevel(userRole, requiredRole)) {
        router.push("/dashboard")
        return
      }

      // 2. Verifica se o papel pode acessar a área específica baseada na URL
      const hasAccess = canAccess(userRole, pathname)

      if (!hasAccess) {
        // Redireciona para o dashboard se não tiver acesso à área atual
        router.push("/dashboard")
      } else {
        setIsAuthorized(true)
      }
    } catch (error) {
      console.error("Auth error:", error)
      localStorage.removeItem("yoobe_auth")
      router.push("/login")
    }
  }, [pathname, router, requiredRole])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <AppearanceApplier />
      {children}
    </>
  )
}
