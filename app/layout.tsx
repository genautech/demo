import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CelebrationHandler } from "@/components/celebration-handler"
import { DemoWrapper } from "@/components/demo/demo-wrapper"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Yoobe Corporate Store",
  description: "Sistema de gestão de loja corporativa com gamificação",
  icons: {
    icon: "/logo-4yoonik.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={["light", "dark", "fun"]}
          enableSystem={false}
          disableTransitionOnChange
          storageKey="yoobe-theme"
        >
          <CelebrationHandler />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
