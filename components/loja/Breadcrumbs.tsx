"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getCompanyProductById, getProducts, getCompanyById } from "@/lib/storage"
import { getDemoProductById } from "@/lib/demo-products"
import { Home } from "lucide-react"

export function StoreBreadcrumbs() {
  const pathname = usePathname()
  const [productName, setProductName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Only show breadcrumbs on store pages
  if (!pathname.startsWith("/loja")) {
    return null
  }

  useEffect(() => {
    // Extract product ID from pathname if on product detail page
    const productMatch = pathname.match(/^\/loja\/produto\/(.+)$/)
    if (productMatch) {
      const productId = productMatch[1]
      setIsLoading(true)

      // Try to fetch product name
      let found: any = null

      // Check if it's a CompanyProduct (starts with cp_)
      if (productId.startsWith("cp_")) {
        found = getCompanyProductById(productId)
      }

      // If not found, try Product V2
      if (!found) {
        const products = getProducts()
        found = products.find((p) => p.id === productId)
      }

      // If still not found, try Demo Products
      if (!found) {
        found = getDemoProductById(productId)
      }

      if (found) {
        setProductName(found.name)
      } else {
        setProductName("Produto")
      }

      setIsLoading(false)
    } else {
      setProductName(null)
    }
  }, [pathname])

  // Build breadcrumb items based on pathname
  const getBreadcrumbItems = () => {
    const items: Array<{ label: string; href?: string }> = []

    // Always start with Home
    items.push({ label: "Início", href: "/dashboard" })

    // Add Loja
    items.push({ label: "Loja", href: "/loja" })

    // Handle different store routes
    if (pathname === "/loja/checkout") {
      items.push({ label: "Checkout" })
    } else if (pathname.startsWith("/loja/pedido/")) {
      const orderMatch = pathname.match(/^\/loja\/pedido\/(.+)$/)
      const orderId = orderMatch ? orderMatch[1] : null
      items.push({ label: "Pedido", href: "/loja" })
      if (orderId) {
        items.push({ label: `#${orderId.slice(0, 8)}` })
      }
    } else if (pathname.startsWith("/loja/produto/")) {
      if (isLoading) {
        items.push({ label: "Carregando..." })
      } else if (productName) {
        items.push({ label: productName })
      } else {
        items.push({ label: "Produto" })
      }
    } else if (pathname.startsWith("/loja/send-gifts")) {
      items.push({ label: "Enviar Presentes" })
    }

    return items
  }

  const items = getBreadcrumbItems()

  if (items.length <= 1) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-foreground font-medium">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href || "#"} className="hover:text-foreground">
                      {index === 0 && <Home className="h-3.5 w-3.5 mr-1 inline" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
