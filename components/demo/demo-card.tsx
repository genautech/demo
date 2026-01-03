"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { loadDemoContext, type SavedDemo } from "@/lib/storage"
import { 
  Building, 
  User, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Archive, 
  RotateCcw,
  PlayCircle,
  MoreVertical,
  Link2,
  CheckCircle2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DemoCardProps {
  demo: SavedDemo
  onArchive?: (demo: SavedDemo) => void
  onRestore?: (demo: SavedDemo) => void
  onDelete?: (demo: SavedDemo) => void
  onAccess?: (demo: SavedDemo) => void
  showActions?: boolean
  compact?: boolean
}

export function DemoCard({ 
  demo, 
  onArchive, 
  onRestore, 
  onDelete,
  onAccess,
  showActions = true,
  compact = false
}: DemoCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(demo.shareableLink)
    setCopiedId(demo.id)
    toast({
      title: "Link copiado!",
      description: "Cole o link para compartilhar a demo.",
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAccessDemo = () => {
    if (onAccess) {
      onAccess(demo)
      return
    }
    
    const success = loadDemoContext(demo.id)
    if (success) {
      router.push("/dashboard")
    } else {
      toast({
        title: "Erro ao acessar demo",
        description: "Não foi possível carregar o contexto da demo.",
        variant: "destructive",
      })
    }
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
      >
        <div 
          className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${demo.colors.primary} 0%, ${demo.colors.secondary} 100%)`
          }}
        >
          <Building className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate">{demo.companyName}</h4>
          <p className="text-xs text-slate-500 truncate">{demo.creatorEmail}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleCopyLink}>
            {copiedId === demo.id ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button size="sm" onClick={handleAccessDemo}>
            <PlayCircle className="h-4 w-4 mr-1" />
            Acessar
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Color Header */}
        <div 
          className="h-24 relative"
          style={{
            background: `linear-gradient(135deg, ${demo.colors.primary} 0%, ${demo.colors.secondary} 100%)`
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          {showActions && (
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAccessDemo}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Acessar Demo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(demo.shareableLink, "_blank")}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir em Nova Aba
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {demo.status === "active" && onArchive ? (
                    <DropdownMenuItem onClick={() => onArchive(demo)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Arquivar
                    </DropdownMenuItem>
                  ) : demo.status === "archived" && onRestore ? (
                    <DropdownMenuItem onClick={() => onRestore(demo)}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restaurar
                    </DropdownMenuItem>
                  ) : null}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(demo)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="absolute -bottom-8 left-4">
            <div className="h-16 w-16 rounded-xl bg-white shadow-lg flex items-center justify-center border-2 border-white">
              <Building className="h-8 w-8 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="pt-12 pb-4 flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg text-slate-900 truncate pr-2">
                {demo.companyName}
              </h3>
              <Badge variant="outline" className="text-xs capitalize shrink-0">
                {demo.vertical}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span className="truncate">{demo.creatorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{new Date(demo.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </div>

          {/* Link Section */}
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-xs font-mono text-slate-600 truncate flex-1">
                {demo.shareableLink}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 shrink-0"
                onClick={handleCopyLink}
              >
                {copiedId === demo.id ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={handleAccessDemo}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Acessar
            </Button>
            <Button 
              variant="outline"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Export for index
export default DemoCard
