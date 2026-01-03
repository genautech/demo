"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  getSavedDemos, 
  deleteSavedDemo, 
  archiveDemo, 
  restoreDemo,
  loadDemoContext,
  getActiveDemos,
  getArchivedDemos,
  type SavedDemo 
} from "@/lib/storage"
import { 
  Plus, 
  Search, 
  Building, 
  User, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Archive, 
  RotateCcw,
  PlayCircle,
  Layers,
  CheckCircle2,
  MoreVertical,
  Link2,
  ArrowLeft
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DemosHubPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [demos, setDemos] = useState<SavedDemo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [demoToDelete, setDemoToDelete] = useState<SavedDemo | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadDemos = () => {
    const allDemos = getSavedDemos()
    setDemos(allDemos)
  }

  useEffect(() => {
    loadDemos()
  }, [])

  const filteredDemos = demos.filter(demo => {
    const matchesSearch = 
      demo.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demo.creatorEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTab = activeTab === "active" 
      ? demo.status === "active" 
      : demo.status === "archived"
    
    return matchesSearch && matchesTab
  })

  const handleCopyLink = (demo: SavedDemo) => {
    navigator.clipboard.writeText(demo.shareableLink)
    setCopiedId(demo.id)
    toast({
      title: "Link copiado!",
      description: "Cole o link para compartilhar a demo.",
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAccessDemo = (demo: SavedDemo) => {
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

  const handleArchive = (demo: SavedDemo) => {
    archiveDemo(demo.id)
    loadDemos()
    toast({
      title: "Demo arquivada",
      description: `${demo.companyName} foi arquivada com sucesso.`,
    })
  }

  const handleRestore = (demo: SavedDemo) => {
    restoreDemo(demo.id)
    loadDemos()
    toast({
      title: "Demo restaurada",
      description: `${demo.companyName} foi restaurada.`,
    })
  }

  const handleDelete = () => {
    if (!demoToDelete) return
    
    deleteSavedDemo(demoToDelete.id)
    loadDemos()
    setDeleteDialogOpen(false)
    setDemoToDelete(null)
    toast({
      title: "Demo excluída",
      description: "A demo foi excluída permanentemente.",
    })
  }

  const confirmDelete = (demo: SavedDemo) => {
    setDemoToDelete(demo)
    setDeleteDialogOpen(true)
  }

  const activeDemosCount = demos.filter(d => d.status === "active").length
  const archivedDemosCount = demos.filter(d => d.status === "archived").length

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Minhas Demos</h1>
            <p className="text-slate-600 mt-1">Gerencie e acesse suas demos salvas</p>
          </div>
        </div>
        <Button onClick={() => router.push("/onboarding")} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Nova Demo
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar por empresa, criador ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "archived")}>
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Layers className="h-4 w-4" />
              Ativas ({activeDemosCount})
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2">
              <Archive className="h-4 w-4" />
              Arquivadas ({archivedDemosCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Empty State */}
      {filteredDemos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Layers className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {activeTab === "active" ? "Nenhuma demo ativa" : "Nenhuma demo arquivada"}
              </h3>
              <p className="text-slate-500 text-center max-w-md mb-6">
                {activeTab === "active" 
                  ? "Crie sua primeira demo para começar a apresentar a plataforma Yoobe."
                  : "Demos arquivadas aparecerão aqui."}
              </p>
              {activeTab === "active" && (
                <Button onClick={() => router.push("/onboarding")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Nova Demo
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Demo Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredDemos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
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
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAccessDemo(demo)}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Acessar Demo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyLink(demo)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(demo.shareableLink, "_blank")}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Abrir em Nova Aba
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {demo.status === "active" ? (
                          <DropdownMenuItem onClick={() => handleArchive(demo)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Arquivar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleRestore(demo)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restaurar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => confirmDelete(demo)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                        onClick={() => handleCopyLink(demo)}
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
                      onClick={() => handleAccessDemo(demo)}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Acessar
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCopyLink(demo)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Demo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a demo "{demoToDelete?.companyName}"?
              <br />
              Esta ação não pode ser desfeita e o link deixará de funcionar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
