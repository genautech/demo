"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { 
  createCompany, 
  createUser, 
  addPoints, 
  saveProducts, 
  getProducts,
  saveBaseProducts,
  getBaseProducts,
  Env
} from "@/lib/storage"

export interface AIDiscoveryProfile {
  industry: string
  teamSize: string
  primaryGoal: string
  companyName: string
  colors: {
    primary: string
    secondary: string
  }
  logo?: string // Base64 encoded logo
}

export interface AIProduct {
  name: string
  description: string
  price: number
  priceInPoints: number
  category: string
  image: string
  stock: number
}

export function useAIDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const generateProfile = async (prompt: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would call our API route that talks to Gemini
      // For this demo, we'll simulate the AI response based on the prompt
      // We'll use the Gemini API via our backend route later
      const response = await fetch("/api/demo/ai", {
        method: "POST",
        body: JSON.stringify({ action: "generate-profile", prompt }),
      })
      
      if (!response.ok) throw new Error("Falha ao gerar perfil")
      
      const data = await response.json()
      return data.profile as AIDiscoveryProfile
    } catch (error) {
      console.error("AI Error:", error)
      toast({
        title: "Erro na IA",
        description: "Não foi possível gerar o perfil personalizado. Usando padrão.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIProducts = async (profile: AIDiscoveryProfile) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/demo/ai", {
        method: "POST",
        body: JSON.stringify({ action: "generate-products", profile }),
      })
      
      if (!response.ok) throw new Error("Falha ao gerar produtos")
      
      const data = await response.json()
      return data.products as AIProduct[]
    } catch (error: any) {
      console.error("AI Error:", error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const applyAIDiscovery = async (
    profile: AIDiscoveryProfile, 
    products: AIProduct[],
    userId?: string,
    userEmail?: string
  ) => {
    setIsLoading(true)
    try {
      // 1. Create Base Products (AI-generated logic)
      const baseProducts = products.map((p, i) => ({
        id: `ai_${Date.now()}_${i}`,
        name: p.name,
        description: p.description,
        price: p.price,
        priceInPoints: p.priceInPoints,
        category: p.category,
        image: p.image,
        stock: p.stock,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      
      // Update local storage BEFORE creating company so auto-seeding works
      const existingBase = getBaseProducts()
      saveBaseProducts([...existingBase, ...baseProducts])

      // 2. Create Company
      const company = createCompany({
        name: profile.companyName,
        alias: profile.companyName.substring(0, 4).toUpperCase(),
        primaryColor: profile.colors.primary,
        secondaryColor: profile.colors.secondary,
        logo: profile.logo, // Store Base64 logo
      })

      // 3. Create User if userId provided (for AI flow)
      let createdUser = null
      if (userId) {
        // Parse name from company name for demo purposes
        const nameParts = profile.companyName.split(" ")
        const firstName = nameParts[0] || "Demo"
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User"
        
        createdUser = createUser({
          id: userId,
          email: userEmail || `demo@${profile.companyName.toLowerCase().replace(/\s/g, "")}.com`,
          firstName,
          lastName,
          companyId: company.id,
        })
        
        // 4. Give initial points
        addPoints(userId, 1000, "Bônus de boas-vindas - Modo IA")
      }

      return { 
        companyId: company.id, 
        baseProducts,
        userId: createdUser?.id || userId,
      }
    } catch (error) {
      console.error("Apply Error:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateProfile,
    generateAIProducts,
    applyAIDiscovery,
    isLoading
  }
}
