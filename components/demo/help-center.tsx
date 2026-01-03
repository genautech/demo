"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Book, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Play, 
  Zap, 
  Code, 
  Settings, 
  Users, 
  ShoppingBag, 
  Database,
  Info,
  ExternalLink,
  Bot,
  Terminal,
  ArrowLeft,
  Sparkles,
  Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HELP_TOPICS, type HelpTopic, searchHelpTopics } from "@/lib/help-data"
import { cn } from "@/lib/utils"
import { UserRole } from "@/lib/roles"
import Link from "next/link"

interface HelpCenterProps {
  isOpen: boolean
  onClose: () => void
  userRole: UserRole
}

export function HelpCenter({ isOpen, onClose, userRole }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isNotebookMode, setIsNotebookMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  // SuperAdmin pode ver TUDO, manager vê manager+all, member vê member+all
  const isAdmin = userRole === "superAdmin"
  const normalizedRole = isAdmin ? "all" : userRole

  const filteredTopics = useMemo(() => {
    return HELP_TOPICS.filter((topic) => {
      // Admin vê tudo
      if (isAdmin) {
        // Só filtra por categoria se não for "all"
        if (activeCategory !== "all" && topic.category !== activeCategory) {
          return false
        }
      } else {
        // Filtrar por role para não-admins
        if (topic.role !== "all" && topic.role !== userRole) {
          // Manager também vê tópicos de member para entender a experiência
          if (userRole !== "manager" || topic.role !== "member") {
            return false
          }
        }
        // Filtrar por categoria
        if (activeCategory !== "all" && topic.category !== activeCategory) {
          return false
        }
      }

      // Busca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const searchableText = [
          topic.title,
          topic.description,
          topic.content,
          ...(topic.keywords || [])
        ].join(" ").toLowerCase()
        if (!searchableText.includes(query)) {
          return false
        }
      }

      return true
    })
  }, [searchQuery, activeCategory, userRole, isAdmin])

  // Helper para mostrar badge de role
  const getRoleBadge = (role: "manager" | "member" | "all") => {
    switch (role) {
      case "manager":
        return { label: "👔 Gestor", className: "bg-blue-100 text-blue-700 border-blue-200" }
      case "member":
        return { label: "👤 Membro", className: "bg-green-100 text-green-700 border-green-200" }
      case "all":
        return { label: "👥 Todos", className: "bg-slate-100 text-slate-700 border-slate-200" }
    }
  }

  const categories = [
    { id: "all", label: "Tudo", icon: HelpCircle },
    { id: "features", label: "Funcionalidades", icon: Zap },
    { id: "models", label: "Modelos de Cliente", icon: Building },
    { id: "fields", label: "Campos & Conceitos", icon: Info },
    { id: "technical", label: "Notebook Técnico", icon: Terminal },
  ]

  const handleStartTour = (tourId: string) => {
    if (typeof window !== "undefined" && (window as any).__startTour) {
      onClose()
      // Pequeno delay para o modal fechar
      setTimeout(() => {
        (window as any).__startTour(tourId)
      }, 300)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-x-[10%] md:inset-y-[5%] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl z-101 overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-4 md:px-6 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xl shadow-sm shrink-0">
                  ✨
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-base md:text-lg leading-none flex items-center gap-2 truncate">
                    <span className="hidden sm:inline">Central de Ajuda</span>
                    <span className="sm:hidden">Ajuda</span>
                    {isNotebookMode && (
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none text-[9px]">
                        Notebook
                      </Badge>
                    )}
                  </h2>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate">
                    <span className="font-bold text-primary">Assistente da Demo</span> te guia!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "gap-1 md:gap-2 text-xs font-bold transition-all h-8 px-2 md:px-3",
                    isNotebookMode ? "bg-indigo-50 text-indigo-700" : ""
                  )}
                  onClick={() => setIsNotebookMode(!isNotebookMode)}
                >
                  <Terminal className="h-4 w-4" />
                  <span className="hidden md:inline">Notebook LLM</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden p-3 border-b bg-white dark:bg-slate-950">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar ajuda..." 
                  className="pl-9 bg-slate-50 dark:bg-slate-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id)
                      setSelectedTopic(null)
                      if (cat.id === "technical") setIsNotebookMode(true)
                      else setIsNotebookMode(false)
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0",
                      activeCategory === cat.id 
                        ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                        : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                    )}
                  >
                    <cat.icon className="h-3 w-3" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* Sidebar */}
              <div className="w-64 border-r hidden md:flex flex-col bg-slate-50/50 dark:bg-slate-900/20 overflow-hidden min-h-0">
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar..." 
                      className="pl-9 bg-white dark:bg-slate-900"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 px-3 pb-4">
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id)
                          setSelectedTopic(null)
                          if (cat.id === "technical") setIsNotebookMode(true)
                          else setIsNotebookMode(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                          activeCategory === cat.id 
                            ? "bg-primary text-primary-foreground font-medium shadow-md" 
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <cat.icon className="h-4 w-4" />
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 mb-2 px-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tópicos Sugeridos</p>
                  </div>
                  <div className="space-y-1">
                    {filteredTopics.slice(0, 5).map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-all",
                          selectedTopic?.id === topic.id
                            ? "bg-slate-100 dark:bg-slate-800 text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                        )}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t bg-primary/5 dark:bg-primary/10">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-primary">Dica do Assistente</p>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        Tente o <strong>Notebook Mode</strong> para ver a lógica técnica por trás de cada funcionalidade!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative overflow-hidden min-h-0">
                <ScrollArea className="flex-1 min-h-0 p-6">
                  {selectedTopic ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="max-w-3xl mx-auto space-y-6"
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedTopic(null)}
                        className="mb-4 md:hidden"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                      </Button>

                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={cn(topicCategoryColor(selectedTopic.category))}>
                            {categories.find(c => c.id === selectedTopic.category)?.label}
                          </Badge>
                          <Badge variant="outline" className={cn("text-[10px] border", getRoleBadge(selectedTopic.role).className)}>
                            {getRoleBadge(selectedTopic.role).label}
                          </Badge>
                          {selectedTopic.tourId && (
                            <Badge variant="outline" className="text-[10px] border bg-primary/10 text-primary border-primary/30">
                              <Play className="h-3 w-3 mr-1" />
                              Tour Interativo
                            </Badge>
                          )}
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">{selectedTopic.title}</h1>
                        <p className="text-lg text-muted-foreground">{selectedTopic.description}</p>
                      </div>

                      {/* Media Section with Fallback */}
                      <MediaWithFallback 
                        media={selectedTopic.media} 
                        title={selectedTopic.title}
                        category={selectedTopic.category}
                      />

                      <div className={cn(
                        "prose dark:prose-invert max-w-none p-6 rounded-xl",
                        isNotebookMode 
                          ? "bg-slate-900 text-slate-100 font-mono text-sm border-l-4 border-indigo-500 shadow-inner" 
                          : "bg-slate-50 dark:bg-slate-900/50"
                      )}>
                        {isNotebookMode && (
                          <div className="flex items-center gap-2 mb-4 text-indigo-400 border-b border-indigo-900/50 pb-2">
                            <Code className="h-4 w-4" />
                            <span className="uppercase tracking-widest text-[10px] font-bold">LLM Notebook Logic Analysis</span>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap leading-loose">
                          {selectedTopic.content.split('\n').map((line, i) => {
                            // Handle headers (bold markdown)
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return <h4 key={i} className="font-bold text-lg mt-5 mb-2 text-slate-900 dark:text-white">{line.replace(/\*\*/g, '')}</h4>
                            }
                            // Handle sub-headers (with colon)
                            if (line.startsWith('**') && line.includes(':**')) {
                              const [title, ...rest] = line.split(':**')
                              return (
                                <div key={i} className="mt-3 mb-1">
                                  <span className="font-bold text-slate-900 dark:text-white">{title.replace('**', '')}:</span>
                                  <span>{rest.join(':**')}</span>
                                </div>
                              )
                            }
                            // Handle list items
                            if (line.startsWith('•') || line.startsWith('-')) {
                              return <li key={i} className="ml-4 list-disc list-inside text-sm">{line.slice(1).trim()}</li>
                            }
                            // Handle numbered items
                            if (/^\d+\./.test(line.trim())) {
                              return <li key={i} className="ml-4 list-decimal list-inside text-sm">{line.replace(/^\d+\./, '').trim()}</li>
                            }
                            // Empty lines
                            if (!line.trim()) {
                              return <div key={i} className="h-2" />
                            }
                            // Regular text
                            return <p key={i} className="my-0.5 text-sm">{line}</p>
                          })}
                        </div>
                        
                        {isNotebookMode && (
                          <div className="mt-8 p-4 bg-indigo-950/50 rounded-lg border border-indigo-800">
                            <div className="flex items-center gap-2 text-indigo-300 mb-2">
                              <Database className="h-4 w-4" />
                              <span className="text-xs font-bold">Data Schema & Business Rule</span>
                            </div>
                            <code className="text-[11px] text-indigo-200 whitespace-pre-wrap">
                              {`// Simulated logical trace for ${selectedTopic.id}
const ${selectedTopic.id}_logic = () => {
  return platform.modules.${selectedTopic.category}.execute({
    role: "${selectedTopic.role}",
    intent: "${selectedTopic.description}"
  });
}`}
                            </code>
                          </div>
                        )}
                      </div>

                      {selectedTopic.tourId && (
                        <Card className="border-primary/20 bg-primary/5">
                          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Zap className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">Quer ver isso na prática?</h4>
                                <p className="text-xs text-muted-foreground">Inicie um tour guiado agora mesmo.</p>
                              </div>
                            </div>
                            <Button size="sm" onClick={() => handleStartTour(selectedTopic.tourId!)} className="w-full sm:w-auto">
                              Iniciar Tour
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  ) : (
                    <div className="space-y-8">
                      <div className="text-center max-w-xl mx-auto py-8">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl mb-4">
                          ✨
                        </div>
                        <h2 className="text-2xl font-bold">O que você precisa saber?</h2>
                        <p className="text-muted-foreground mt-2">
                          Selecione um tópico na lateral ou explore nossas funcionalidades principais abaixo.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTopics.slice(0, 6).map((topic) => {
                          const roleBadge = getRoleBadge(topic.role)
                          return (
                            <Card 
                              key={topic.id} 
                              className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md group"
                              onClick={() => setSelectedTopic(topic)}
                            >
                              <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-[9px]">{categories.find(c => c.id === topic.category)?.label}</Badge>
                                    <Badge variant="outline" className={cn("text-[9px] border", roleBadge.className)}>{roleBadge.label}</Badge>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                </div>
                                <CardTitle className="text-base mt-2">{topic.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <p className="text-xs text-muted-foreground line-clamp-2">{topic.description}</p>
                                {topic.tourId && (
                                  <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-medium">
                                    <Play className="h-3 w-3" />
                                    Tour disponível
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>

                      {filteredTopics.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">Nenhum tópico encontrado para sua busca. 😢</p>
                          <Button 
                            variant="link" 
                            onClick={() => {setSearchQuery(""); setActiveCategory("all")}}
                            className="mt-2"
                          >
                            Limpar filtros
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* AI Assistant Mini-Bar */}
            <div className="h-14 border-t bg-slate-50 dark:bg-slate-900 flex items-center px-4 gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <Bot className="h-3 w-3" />
                <span className="hidden sm:inline">Dúvida rápida?</span>
              </div>
              <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
                {["Como ganho Pontos?", "O que é SKU?", "Como crio landing pages?", "Tags de visibilidade"].map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSearchQuery(q)}
                    className="px-3 h-7 bg-white dark:bg-slate-800 border rounded-full text-[10px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-medium">Assistente Online</span>
                </div>
                <Link 
                  href="/membro/documentacao" 
                  onClick={onClose}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Ver Documentação Completa
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function topicCategoryColor(category: string) {
  switch (category) {
    case "features": return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none"
    case "models": return "bg-purple-100 text-purple-700 hover:bg-purple-100 border-none"
    case "fields": return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none"
    case "technical": return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none"
    default: return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none"
  }
}

/**
 * Media component with fallback for missing images
 */
function MediaWithFallback({ 
  media, 
  title, 
  category 
}: { 
  media?: { type: "image" | "gif" | "video"; url: string }; 
  title: string;
  category: string;
}) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Reset states when media changes
  useMemo(() => {
    setHasError(false)
    setIsLoading(true)
  }, [media?.url])

  // Show placeholder if no media or error loading
  if (!media || hasError) {
    return (
      <div className="rounded-xl border shadow-lg overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center mb-4">
            {category === "features" ? (
              <Zap className="h-8 w-8 text-blue-500" />
            ) : category === "models" ? (
              <Building className="h-8 w-8 text-purple-500" />
            ) : category === "technical" ? (
              <Terminal className="h-8 w-8 text-indigo-500" />
            ) : (
              <Info className="h-8 w-8 text-amber-500" />
            )}
          </div>
          <h4 className="font-bold text-lg text-slate-700 dark:text-slate-200">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Demonstração visual disponível durante a apresentação ao vivo.
          </p>
          <Badge variant="secondary" className="mt-4 text-xs">
            ✨ Captura de Tela em Breve
          </Badge>
        </div>
        <div className="p-3 bg-white/80 dark:bg-black/50 backdrop-blur-sm border-t flex items-center gap-2">
          <Play className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Placeholder Visual</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
      {media.type === "video" ? (
        <video 
          src={media.url} 
          controls 
          autoPlay 
          loop 
          muted 
          className="w-full aspect-video object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-2 w-24 bg-slate-200 dark:bg-slate-800 rounded mt-3" />
              </div>
            </div>
          )}
          <img 
            src={media.url} 
            alt={title}
            className={cn(
              "w-full h-auto max-h-[400px] object-contain transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
        </div>
      )}
      <div className="p-3 bg-white/80 dark:bg-black/50 backdrop-blur-sm border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-medium uppercase tracking-wider">
            {media.type === "gif" ? "Animação de Referência" : media.type === "video" ? "Vídeo Demonstrativo" : "Captura de Tela Real"}
          </span>
        </div>
        <Badge variant="outline" className="text-[9px]">
          {media.type.toUpperCase()}
        </Badge>
      </div>
    </div>
  )
}
