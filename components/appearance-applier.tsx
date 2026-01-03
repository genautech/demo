"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { resolveAppearance, getCompanyAppearance, DEFAULT_FUN_MODE_SETTINGS } from "@/lib/storage"

const USER_THEME_KEY = "yoobe_user_theme_preference"

export function AppearanceApplier() {
  const { setTheme, theme } = useTheme()
  const [hasUserPreference, setHasUserPreference] = useState(false)

  // Apply Fun Mode colors to CSS variables
  const applyFunModeColors = (companyId: string) => {
    const companyAppearance = getCompanyAppearance(companyId)
    const funSettings = companyAppearance.funSettings || DEFAULT_FUN_MODE_SETTINGS
    const root = document.documentElement

    // Apply Fun Mode colors as CSS custom properties
    root.style.setProperty("--fun-primary", funSettings.primaryColor)
    root.style.setProperty("--fun-secondary", funSettings.secondaryColor)
    root.style.setProperty("--fun-accent", funSettings.accentColor)
    
    console.log("Fun Mode colors applied:", {
      primary: funSettings.primaryColor,
      secondary: funSettings.secondaryColor,
      accent: funSettings.accentColor,
    })
  }

  useEffect(() => {
    // Check for saved user theme preference
    const savedTheme = localStorage.getItem("yoobe-theme") || localStorage.getItem(USER_THEME_KEY)
    if (savedTheme && ["light", "dark", "fun"].includes(savedTheme)) {
      setHasUserPreference(true)
    }

    // Get auth data
    const authData = localStorage.getItem("yoobe_auth")
    if (!authData) return

    try {
      const auth = JSON.parse(authData)
      const companyId = auth.companyId || "company_1"
      const storeId = auth.storeId

      // Resolve appearance (company default + store override)
      const appearance = resolveAppearance({ companyId, storeId })

      // Apply theme if no user preference
      if (!savedTheme) {
        setTheme(appearance.theme)
      }

      // Apply general color CSS variables
      const root = document.documentElement
      if (appearance.colors.primary) {
        root.style.setProperty("--app-primary", appearance.colors.primary)
        root.style.setProperty("--app-secondary", appearance.colors.secondary || appearance.colors.primary)
        root.style.setProperty("--app-background", appearance.colors.background || "#ffffff")
        root.style.setProperty("--app-accent", appearance.colors.accent || appearance.colors.primary)
      }

      // Always apply Fun Mode colors
      applyFunModeColors(companyId)
    } catch (error) {
      console.error("Error applying appearance:", error)
    }
  }, [setTheme])

  // Save user theme preference
  useEffect(() => {
    if (theme && ["light", "dark", "fun"].includes(theme)) {
      const savedTheme = localStorage.getItem("yoobe-theme")
      if (savedTheme === theme) {
        localStorage.setItem(USER_THEME_KEY, theme)
        setHasUserPreference(true)
      }
    }
  }, [theme])

  // Listen for appearance updates
  useEffect(() => {
    const handleAppearanceUpdate = () => {
      const authData = localStorage.getItem("yoobe_auth")
      if (!authData) return

      try {
        const auth = JSON.parse(authData)
        const companyId = auth.companyId || "company_1"
        const storeId = auth.storeId

        // Always apply Fun Mode colors
        applyFunModeColors(companyId)

        // Apply theme if no user preference
        if (!hasUserPreference) {
          const appearance = resolveAppearance({ companyId, storeId })
          setTheme(appearance.theme)
        }
      } catch (error) {
        console.error("Error updating appearance:", error)
      }
    }

    window.addEventListener("appearance-updated", handleAppearanceUpdate)
    return () => window.removeEventListener("appearance-updated", handleAppearanceUpdate)
  }, [setTheme, hasUserPreference])

  return null
}
