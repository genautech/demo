"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getCompanyById } from "@/lib/storage"

interface BrandedProductImageProps {
  productImage: string
  companyId?: string
  className?: string
  logoSize?: "sm" | "md" | "lg"
  logoPosition?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export function BrandedProductImage({
  productImage,
  companyId,
  className,
  logoSize = "md",
  logoPosition = "center",
}: BrandedProductImageProps) {
  const [logo, setLogo] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>(productImage || "/placeholder.jpg")

  useEffect(() => {
    // Reset error state when productImage changes
    setImageError(false)
    setImageSrc(productImage || "/placeholder.jpg")
  }, [productImage])

  useEffect(() => {
    if (companyId) {
      const company = getCompanyById(companyId)
      if (company?.logo) {
        setLogo(company.logo)
      }
    } else {
      // Try to get from auth
      if (typeof window !== "undefined") {
        const authData = localStorage.getItem("yoobe_auth")
        if (authData) {
          try {
            const auth = JSON.parse(authData)
            if (auth.companyId) {
              const company = getCompanyById(auth.companyId)
              if (company?.logo) {
                setLogo(company.logo)
              }
            }
          } catch (e) {
            // Ignore
          }
        }
      }
    }
  }, [companyId])

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
      setImageSrc("/placeholder.jpg")
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  }

  const positionClasses = {
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-muted", className)}>
      <img
        src={imageSrc}
        alt="Product"
        className="w-full h-full object-cover"
        onError={handleImageError}
        loading="lazy"
      />
      {logo && (
        <div
          className={cn(
            "absolute z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border-2 border-white/50",
            sizeClasses[logoSize],
            positionClasses[logoPosition]
          )}
        >
          <img
            src={logo}
            alt="Company Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      )}
    </div>
  )
}
