"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Menu, X, ChevronDown, Building2, Code2, CreditCard } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function InstitutionalHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/solucoes" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            Y
          </div>
          <span className="font-bold text-xl tracking-tight">Yoobe</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-medium">
                Soluções
                <ChevronDown className="ml-1 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem asChild>
                <Link href="/solucoes" className="cursor-pointer flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">Visão Geral</div>
                    <div className="text-xs text-muted-foreground">Escolha sua solução</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/solucoes/plataforma" className="cursor-pointer flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <div className="font-medium">Plataforma Completa</div>
                    <div className="text-xs text-muted-foreground">Para RH e Gestores</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/solucoes/api" className="cursor-pointer flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">API para Integradores</div>
                    <div className="text-xs text-muted-foreground">Para CTOs e Partners</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" asChild className="font-medium">
            <Link href="/solucoes/planos">
              <CreditCard className="mr-2 w-4 h-4" />
              Planos
            </Link>
          </Button>

          <Button variant="ghost" asChild className="font-medium">
            <Link href="/documentacao">Docs</Link>
          </Button>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild className="font-semibold shadow-sm">
            <Link href="#agendar-demo">Agendar Demo</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 shadow-lg"
        >
          <nav className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
              Soluções
            </div>
            <Link 
              href="/solucoes" 
              className="px-4 py-3 rounded-lg hover:bg-muted font-medium flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Visão Geral
            </Link>
            <Link 
              href="/solucoes/plataforma" 
              className="px-4 py-3 rounded-lg hover:bg-muted font-medium flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <Building2 className="w-4 h-4 text-violet-500" />
              Plataforma Completa
            </Link>
            <Link 
              href="/solucoes/api" 
              className="px-4 py-3 rounded-lg hover:bg-muted font-medium flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <Code2 className="w-4 h-4 text-primary" />
              API para Integradores
            </Link>
            <Link 
              href="/solucoes/planos" 
              className="px-4 py-3 rounded-lg hover:bg-muted font-medium flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Planos e Preços
            </Link>
            <Link 
              href="/documentacao" 
              className="px-4 py-3 rounded-lg hover:bg-muted font-medium"
              onClick={() => setIsOpen(false)}
            >
              Documentação
            </Link>
          </nav>
          <div className="flex flex-col gap-2 pt-4 mt-4 border-t">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="w-full font-semibold">
              <Link href="#agendar-demo">Agendar Demo</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  )
}
