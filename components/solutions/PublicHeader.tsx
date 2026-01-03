"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="font-bold text-xl tracking-tight">Yoobe</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/solucoes/gamificacao" className="text-sm font-medium hover:text-primary transition-colors">
            Gamificação API
          </Link>
          <Link href="/solucoes/corporativo" className="text-sm font-medium hover:text-primary transition-colors">
            Enterprise
          </Link>
          <Link href="/documentacao" className="text-sm font-medium hover:text-primary transition-colors">
            Docs
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Começar Agora</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-background border-b p-4 space-y-4"
        >
          <nav className="flex flex-col gap-4">
            <Link href="/solucoes/gamificacao" className="text-lg font-medium">Gamificação API</Link>
            <Link href="/solucoes/corporativo" className="text-lg font-medium">Enterprise</Link>
            <Link href="/documentacao" className="text-lg font-medium">Docs</Link>
          </nav>
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/login">Começar Agora</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  )
}
