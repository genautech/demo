"use client"

import Link from "next/link"
import { Linkedin, Instagram, Youtube } from "lucide-react"

const FOOTER_LINKS = {
  produto: [
    { label: "Funcionalidades", href: "/solucoes#features" },
    { label: "Planos", href: "/solucoes/planos" },
    { label: "Como Funciona", href: "/solucoes/planos#como-funciona" },
    { label: "FAQ", href: "/solucoes#faq" },
  ],
  empresa: [
    { label: "Sobre Nós", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "mailto:contato@yoobe.com.br" },
  ],
  recursos: [
    { label: "Documentação", href: "/documentacao" },
    { label: "Cases de Sucesso", href: "#" },
    { label: "Webinars", href: "#" },
    { label: "API Reference", href: "#" },
  ],
  legal: [
    { label: "Termos de Uso", href: "#" },
    { label: "Política de Privacidade", href: "#" },
    { label: "LGPD", href: "#" },
  ],
}

export function InstitutionalFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/solucoes" className="flex items-center gap-2.5 mb-6">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">
                Y
              </div>
              <span className="font-bold text-xl text-white">Yoobe</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              A plataforma completa de reconhecimento e recompensas para empresas que valorizam quem faz acontecer.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.produto.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.empresa.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.recursos.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 Yoobe. Todos os direitos reservados.
          </p>
          <p className="text-sm text-slate-500">
            Feito com 💚 no Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
