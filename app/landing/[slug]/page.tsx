"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getLandingPageBySlug,
  getCompanyProductsByCompany,
  createUser,
  getUsers,
  getUserByEmail,
  addTagToEmployee,
  getCompanyById,
  type LandingPage,
  type CompanyProduct,
  type User,
} from "@/lib/storage"
import { toast } from "sonner"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ShoppingBag, ArrowRight, Mail, CheckCircle2, Eye, AlertTriangle, X, ExternalLink } from "lucide-react"

export default function LandingPageViewer() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const isPreviewMode = searchParams?.get("preview") === "true"

  const [landingPage, setLandingPage] = useState<LandingPage | null>(null)
  const [products, setProducts] = useState<CompanyProduct[]>([])
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [companyId, setCompanyId] = useState("company_1")
  const [showPreviewBanner, setShowPreviewBanner] = useState(true)

  useEffect(() => {
    if (!slug) return

    const page = getLandingPageBySlug(slug)
    if (!page) {
      toast.error("Landing page não encontrada")
      setIsLoading(false)
      return
    }

    setLandingPage(page)
    setCompanyId(page.companyId)

    // Load products
    const companyProducts = getCompanyProductsByCompany(page.companyId)
    const selectedProducts = companyProducts.filter((p) =>
      page.productIds.includes(p.id)
    )
    setProducts(selectedProducts)

    // Check if user is already authenticated (skip in preview mode)
    if (!isPreviewMode) {
      const authData = localStorage.getItem("yoobe_auth")
      if (authData) {
        try {
          const auth = JSON.parse(authData)
          const user = getUserByEmail(auth.email)
          if (user) {
            setEmail(user.email)
          }
        } catch (e) {
          // Ignore
        }
      }
    }

    setIsLoading(false)
  }, [slug, isPreviewMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast.error("Por favor, insira um email válido")
      return
    }

    if (!landingPage) return

    setIsSubmitting(true)

    try {
      // Check if user exists
      let user = getUserByEmail(email)
      const company = getCompanyById(landingPage.companyId)

      if (!user) {
        // Create new user
        try {
          const firstName = email.split("@")[0].split(".")[0] || "Usuário"
          const lastName = email.split("@")[0].split(".")[1] || "Novo"

          user = createUser({
            email,
            firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
            lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
            role: "member",
            points: 0,
            tags: [],
            companyId: landingPage.companyId,
          })
        } catch (error) {
          // Se email já existe, tentar buscar novamente
          user = getUserByEmail(email)
          if (!user) {
            toast.error(error instanceof Error ? error.message : "Erro ao criar usuário")
            return
          }
        }
      }

      // Assign tags from landing page
      for (const tagId of landingPage.assignedTags) {
        addTagToEmployee(user.id, tagId)
      }

      // Set auth
      const authData = {
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: landingPage.companyId,
        storeId: company?.stores?.[0]?.id || null,
      }
      localStorage.setItem("yoobe_auth", JSON.stringify(authData))

      toast.success("Bem-vindo! Redirecionando para a loja de campanha...")
      
      // Redirect to campaign store with landing page slug
      setTimeout(() => {
        router.push(`/campanha/loja?lp=${slug}`)
      }, 1000)
    } catch (error) {
      console.error("Erro ao processar:", error)
      toast.error("Erro ao processar sua solicitação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Landing page não encontrada</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle preview mode navigation
  const handlePreviewNavigation = () => {
    if (!landingPage) return
    router.push(`/campanha/loja?lp=${slug}&preview=true`)
  }

  // Apply custom styles
  const styles = {
    "--primary-color": landingPage.primaryColor,
    "--secondary-color": landingPage.secondaryColor,
    "--background-color": landingPage.backgroundColor,
    "--text-color": landingPage.textColor,
  } as React.CSSProperties

  return (
    <div className="min-h-screen" style={styles}>
      {/* Preview Mode Banner */}
      {isPreviewMode && showPreviewBanner && (
        <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 px-4 py-3 shadow-md">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Modo Preview</p>
                <p className="text-xs opacity-80">
                  Esta é uma visualização prévia. Nenhuma ação será salva.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-amber-950"
                onClick={handlePreviewNavigation}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Ver Loja
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-amber-950 hover:bg-amber-600/20"
                onClick={() => setShowPreviewBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Section */}
      {landingPage.bannerUrl && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden">
          <Image
            src={landingPage.bannerUrl}
            alt={landingPage.title}
            fill
            className="object-cover"
            unoptimized
          />
          {landingPage.bannerText && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
                {landingPage.bannerText}
              </h2>
            </div>
          )}
        </div>
      )}

      <div
        className="container mx-auto px-4 py-12"
        style={{ backgroundColor: landingPage.backgroundColor }}
      >
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: landingPage.textColor }}
          >
            {landingPage.welcomeTitle}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8"
            style={{ color: landingPage.textColor, opacity: 0.8 }}
          >
            {landingPage.welcomeMessage}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            <h2
              className="text-2xl md:text-3xl font-bold mb-6 text-center"
              style={{ color: landingPage.textColor }}
            >
              Produtos Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-48 bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        {product.price > 0
                          ? `R$ ${product.price.toFixed(2)}`
                          : `${product.pointsCost} pts`}
                      </Badge>
                      {product.stockQuantity > 0 ? (
                        <Badge variant="outline" className="text-green-600">
                          Em estoque
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          Esgotado
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Email Capture Form or Preview CTA */}
        <div className="max-w-md mx-auto">
          <Card
            className="border-2"
            style={{
              borderColor: landingPage.primaryColor,
              backgroundColor: landingPage.backgroundColor,
            }}
          >
            <CardContent className="p-6">
              {isPreviewMode ? (
                // Preview Mode - Show CTA to go directly to store
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <Eye
                      className="h-12 w-12 mx-auto mb-4"
                      style={{ color: landingPage.primaryColor }}
                    />
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: landingPage.textColor }}
                    >
                      Modo Preview
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: landingPage.textColor, opacity: 0.7 }}
                    >
                      Visualize como a loja ficará para seus usuários
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    style={{
                      backgroundColor: landingPage.primaryColor,
                      color: "#ffffff",
                    }}
                    onClick={handlePreviewNavigation}
                  >
                    {landingPage.ctaText || "Acessar Loja de Campanha"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        No modo preview, você pode navegar pela loja sem que dados sejam salvos.
                        {landingPage.assignedTags.length > 0 && (
                          <span className="block mt-1">
                            Tags que seriam atribuídas: {landingPage.assignedTags.length}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Normal Mode - Email capture form
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center mb-6">
                    <Mail
                      className="h-12 w-12 mx-auto mb-4"
                      style={{ color: landingPage.primaryColor }}
                    />
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: landingPage.textColor }}
                    >
                      Acesse a Loja Agora
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: landingPage.textColor, opacity: 0.7 }}
                    >
                      Digite seu email para começar a resgatar seus produtos
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    style={{
                      backgroundColor: landingPage.primaryColor,
                      color: "#ffffff",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        {landingPage.ctaText || "Acessar Loja de Campanha"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {landingPage.assignedTags.length > 0 && (
                    <div className="pt-4 border-t">
                      <p
                        className="text-xs text-center"
                        style={{ color: landingPage.textColor, opacity: 0.6 }}
                      >
                        Ao acessar, você receberá tags especiais para acesso exclusivo
                      </p>
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
