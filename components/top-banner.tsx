"use client"

import { useState, useEffect } from "react"
import { X, Info, AlertTriangle, CheckCircle2, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAdminBanner, type AdminBanner } from "@/lib/storage"
import Link from "next/link"

const typeConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-900 dark:text-blue-100",
    iconColor: "text-blue-600 dark:text-blue-400",
    buttonVariant: "default" as const,
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    textColor: "text-amber-900 dark:text-amber-100",
    iconColor: "text-amber-600 dark:text-amber-400",
    buttonVariant: "default" as const,
  },
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-900 dark:text-green-100",
    iconColor: "text-green-600 dark:text-green-400",
    buttonVariant: "default" as const,
  },
  promotion: {
    icon: Megaphone,
    bgColor: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-900 dark:text-purple-100",
    iconColor: "text-purple-600 dark:text-purple-400",
    buttonVariant: "default" as const,
  },
}

export function TopBanner() {
  const [banner, setBanner] = useState<AdminBanner | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const bannerData = getAdminBanner()
    setBanner(bannerData)

    // Check if user has dismissed this banner
    if (bannerData.dismissible && typeof window !== "undefined") {
      const dismissedKey = `yoobe_banner_dismissed_${bannerData.id}`
      const dismissed = localStorage.getItem(dismissedKey)
      setIsDismissed(!!dismissed)
    }
  }, [])

  const handleDismiss = () => {
    if (banner?.dismissible && typeof window !== "undefined") {
      const dismissedKey = `yoobe_banner_dismissed_${banner.id}`
      localStorage.setItem(dismissedKey, "true")
      setIsDismissed(true)
    }
  }

  // Don't render if banner is not active, is dismissed, or doesn't exist
  if (!banner || !banner.active || isDismissed) {
    return null
  }

  const config = typeConfig[banner.type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "relative w-full border-b",
        config.bgColor,
        config.borderColor,
        config.textColor
      )}
      style={
        banner.backgroundImage
          ? {
              backgroundImage: `url(${banner.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={cn("flex-shrink-0", config.iconColor)}>
            <Icon className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {banner.title && (
              <h3 className="font-semibold text-sm mb-1">{banner.title}</h3>
            )}
            <p className="text-sm leading-relaxed">{banner.message}</p>
          </div>

          {/* CTA Button */}
          {banner.ctaText && banner.ctaLink && (
            <div className="flex-shrink-0">
              {banner.ctaLink.startsWith("http") ? (
                <a href={banner.ctaLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant={config.buttonVariant} className="whitespace-nowrap">
                    {banner.ctaText}
                  </Button>
                </a>
              ) : (
                <Link href={banner.ctaLink}>
                  <Button size="sm" variant={config.buttonVariant} className="whitespace-nowrap">
                    {banner.ctaText}
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Dismiss Button */}
          {banner.dismissible && (
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", config.textColor, "hover:bg-black/5 dark:hover:bg-white/5")}
                onClick={handleDismiss}
                aria-label="Fechar banner"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
