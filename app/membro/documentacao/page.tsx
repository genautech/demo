"use client"

import { useState, useMemo, useEffect } from "react"
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
  Building,
  Menu,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HELP_TOPICS, type HelpTopic } from "@/lib/help-data"
import { cn } from "@/lib/utils"
import { UserRole } from "@/lib/roles"
import { PageContainer } from "@/components/page-container"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isNotebookMode, setIsNotebookMode] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("member")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        setUserRole(auth.role || "member")
      } catch (e) {}
    }
  }, [])

  const normalizedRole = userRole === "superAdmin" ? "manager" : userRole

  const filteredTopics = useMemo(() => {
    return HELP_TOPICS.filter((topic) => {
      // Filtrar por role - gestores veem tudo
      if (normalizedRole !== "manager" && topic.role !== "all" && topic.role !== normalizedRole) {
        return false
      }

      // Filtrar por categoria
      if (activeCategory !== "all" && topic.category !== activeCategory) {
        return false
      }

      // Filtrar por busca (inclui keywords)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = [
          topic.title,
          topic.description,
          topic.content,
          ...(topic.keywords || [])
        ].join(" ").toLowerCase()
        return searchableText.includes(query)
      }

      return true
    })
  }, [searchQuery, activeCategory, normalizedRole])

  const categories = [
    { id: "all", label: "Tudo", icon: HelpCircle },
    { id: "features", label: "Funcionalidades", icon: Zap },
    { id: "models", label: "Modelos de Cliente", icon: Building },
    { id: "fields", label: "Campos & Conceitos", icon: Info },
    { id: "technical", label: "Notebook Técnico", icon: Terminal },
  ]

  const handleStartTour = (tourId: string) => {
    if (typeof window !== "undefined" && (window as any).__startTour) {
      (window as any).__startTour(tourId)
    }
  }

  return (
    <PageContainer className="p-0 max-w-none">
      <div className="flex flex-col md:flex-row h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] overflow-hidden bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl mx-2 md:mx-6">
        
        {/* Mobile Header */}
        <div className="md:hidden border-b bg-slate-50 dark:bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-2xl shadow-md">
                🍌
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">Assistente da Demo</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Guia de Ajuda</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNotebookMode(!isNotebookMode)}
              className={cn(
                "gap-1",
                isNotebookMode && "bg-indigo-100 text-indigo-700 border-indigo-200"
              )}
            >
              <Terminal className="h-3 w-3" />
              <span className="text-[10px]">Notebook</span>
            </Button>
          </div>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar ajuda..." 
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setSelectedTopic(null)
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

        {/* Desktop Sidebar */}
        <div className="w-64 border-r hidden md:flex flex-col bg-slate-50/50 dark:bg-slate-900/20">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-2xl shadow-md">
                🍌
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">Assistente da Demo</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Guia de Ajuda</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar ajuda..." 
                className="pl-9 bg-white dark:bg-slate-900 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 pb-4">
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setSelectedTopic(null)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all",
                    activeCategory === cat.id 
                      ? "bg-primary text-primary-foreground font-medium shadow-lg scale-[1.02]" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="mt-8 mb-2 px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">Principais Tópicos</p>
            </div>
            <div className="space-y-1">
              {filteredTopics.slice(0, 8).map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-lg text-xs truncate transition-all",
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

          <div className="p-6 border-t bg-yellow-50/30 dark:bg-yellow-900/10">
            <div className="flex gap-3 items-start">
              <Sparkles className="h-5 w-5 text-yellow-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400">Notebook LLM</p>
                <p className="text-[10px] text-yellow-700 dark:text-yellow-500 mt-1 leading-relaxed">
                  Ative o modo técnico para ver a lógica por trás das features.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 mt-3 w-full text-[10px] font-bold border-yellow-200 bg-white/50 hover:bg-white"
                  onClick={() => setIsNotebookMode(!isNotebookMode)}
                >
                  {isNotebookMode ? "Desativar Notebook" : "Ativar Notebook"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-8 md:p-12 max-w-4xl mx-auto">
              {selectedTopic ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedTopic(null)}
                    className="mb-4 text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para visão geral
                  </Button>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className={cn(
                        "px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                        topicCategoryColor(selectedTopic.category)
                      )}>
                        {categories.find(c => c.id === selectedTopic.category)?.label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-widest px-3 py-1 font-bold opacity-60">
                        {selectedTopic.role === "all" ? "Acesso Global" : selectedTopic.role === "manager" ? "Acesso Gestor" : "Acesso Membro"}
                      </Badge>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{selectedTopic.title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">{selectedTopic.description}</p>
                  </div>

                  {/* Media Section with Fallback */}
                  <MediaWithFallback 
                    media={selectedTopic.media} 
                    title={selectedTopic.title}
                    category={selectedTopic.category}
                  />

                  <div className={cn(
                    "relative overflow-hidden transition-all duration-500",
                    isNotebookMode 
                      ? "bg-slate-900 rounded-2xl shadow-2xl border-l-8 border-indigo-500 p-8" 
                      : "bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8"
                  )}>
                    {isNotebookMode && (
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Terminal className="w-48 h-48 rotate-12" />
                      </div>
                    )}

                    {isNotebookMode && (
                      <div className="flex items-center gap-3 mb-6 text-indigo-400">
                        <Terminal className="h-5 w-5" />
                        <span className="uppercase tracking-[0.2em] text-xs font-black">AI System Integration Logic</span>
                      </div>
                    )}

                    <div className={cn(
                      "whitespace-pre-wrap leading-loose",
                      isNotebookMode 
                        ? "font-mono text-slate-100 text-sm" 
                        : "text-base md:text-lg text-slate-700 dark:text-slate-300 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:my-1"
                    )}>
                      {selectedTopic.content.split('\n').map((line, i) => {
                        // Handle headers (bold markdown)
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <h3 key={i} className="font-bold text-xl mt-6 mb-3 text-slate-900 dark:text-white">{line.replace(/\*\*/g, '')}</h3>
                        }
                        // Handle sub-headers (with colon)
                        if (line.startsWith('**') && line.includes(':**')) {
                          const [title, ...rest] = line.split(':**')
                          return (
                            <div key={i} className="mt-4 mb-2">
                              <span className="font-bold text-slate-900 dark:text-white">{title.replace('**', '')}:</span>
                              <span>{rest.join(':**')}</span>
                            </div>
                          )
                        }
                        // Handle list items
                        if (line.startsWith('•') || line.startsWith('-')) {
                          return <li key={i} className="ml-4 list-disc list-inside text-base">{line.slice(1).trim()}</li>
                        }
                        // Handle numbered items
                        if (/^\d+\./.test(line.trim())) {
                          return <li key={i} className="ml-4 list-decimal list-inside text-base">{line.replace(/^\d+\./, '').trim()}</li>
                        }
                        // Empty lines
                        if (!line.trim()) {
                          return <div key={i} className="h-3" />
                        }
                        // Regular text
                        return <p key={i} className="my-1">{line}</p>
                      })}
                    </div>
                    
                    {isNotebookMode && (
                      <div className="mt-12 p-6 bg-indigo-950/40 rounded-xl border border-indigo-800/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3 text-indigo-300 mb-4 border-b border-indigo-800/50 pb-2">
                          <Database className="h-4 w-4" />
                          <span className="text-xs font-black uppercase tracking-wider">Object Schema Definition</span>
                        </div>
                        <pre className="text-[12px] text-indigo-200/90 leading-relaxed overflow-x-auto">
                          {`/**\n * @module ${selectedTopic.category}\n * @id ${selectedTopic.id}\n */\n\ninterface ${selectedTopic.id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')} {\n  id: string;\n  intent: "${selectedTopic.description}";\n  rules: [\n    "role_restriction: ${selectedTopic.role}",\n    "visibility: ${selectedTopic.category}"\n  ];\n  metadata: {\n    author: "Assistente da Demo",\n    version: "2.5.0"\n  }\n}`}
                        </pre>
                      </div>
                    )}
                  </div>

                  {selectedTopic.tourId && (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-linear-to-r from-primary to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                      <Card className="relative border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                        <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                              <Zap className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-black text-xl tracking-tight">Experiência Interativa</h4>
                              <p className="text-sm text-muted-foreground">O Assistente da Demo pode te levar para um tour guiado agora.</p>
                            </div>
                          </div>
                          <Button 
                            size="lg" 
                            onClick={() => handleStartTour(selectedTopic.tourId!)} 
                            className="w-full sm:w-auto px-8 rounded-full font-bold shadow-lg shadow-primary/20"
                          >
                            Iniciar Tour Agora
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-8 md:space-y-12">
                  <div className="space-y-4">
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest">
                      Ajuda & Documentação
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                      Como podemos <span className="text-primary underline decoration-primary/30 underline-offset-4 md:underline-offset-8">ajudar?</span>
                    </h1>
                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                      Explore as funcionalidades da plataforma Yoobe com o guia interativo do Assistente da Demo.
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
                      <div className="text-2xl font-black text-blue-600">{HELP_TOPICS.filter(t => t.category === "features").length}</div>
                      <div className="text-xs text-blue-600/70 font-medium">Funcionalidades</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900">
                      <div className="text-2xl font-black text-purple-600">{HELP_TOPICS.filter(t => t.category === "models").length}</div>
                      <div className="text-xs text-purple-600/70 font-medium">Modelos</div>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900">
                      <div className="text-2xl font-black text-amber-600">{HELP_TOPICS.filter(t => t.category === "fields").length}</div>
                      <div className="text-xs text-amber-600/70 font-medium">Conceitos</div>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900">
                      <div className="text-2xl font-black text-indigo-600">{HELP_TOPICS.filter(t => t.category === "technical").length}</div>
                      <div className="text-xs text-indigo-600/70 font-medium">Técnico</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {filteredTopics.map((topic) => (
                      <Card 
                        key={topic.id} 
                        className="cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group border-slate-200 dark:border-slate-800"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <CardHeader className="p-6 pb-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-3">
                              {categories.find(c => c.id === topic.category)?.label}
                            </Badge>
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{topic.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredTopics.length === 0 && (
                    <div className="text-center py-12 md:py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <div className="text-5xl md:text-6xl mb-4">🍌?</div>
                      <h3 className="text-xl md:text-2xl font-bold">Nenhum resultado encontrado</h3>
                      <p className="text-muted-foreground mt-2 text-sm">O Assistente da Demo não encontrou o que você buscava.</p>
                      <Button 
                        variant="link" 
                        onClick={() => {setSearchQuery(""); setActiveCategory("all")}}
                        className="mt-4 font-bold"
                      >
                        Ver todos os tópicos
                      </Button>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      Buscas Populares
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["Pontos", "SKU", "tags", "pedidos", "gamificação", "landing pages", "orçamento", "catálogo"].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </PageContainer>
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
      <div className="rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center mb-4">
            {category === "features" ? (
              <Zap className="h-10 w-10 text-blue-500" />
            ) : category === "models" ? (
              <Building className="h-10 w-10 text-purple-500" />
            ) : category === "technical" ? (
              <Terminal className="h-10 w-10 text-indigo-500" />
            ) : (
              <Info className="h-10 w-10 text-amber-500" />
            )}
          </div>
          <h4 className="font-bold text-xl text-slate-700 dark:text-slate-200">{title}</h4>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            Demonstração visual disponível durante a apresentação ao vivo.
          </p>
          <Badge variant="secondary" className="mt-4">
            ✨ Captura de Tela em Breve
          </Badge>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Placeholder Visual</span>
          </div>
          <Badge variant="secondary" className="text-[9px] font-bold">DEMO</Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 group">
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
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 aspect-video">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded mt-4" />
              </div>
            </div>
          )}
          <img 
            src={media.url} 
            alt={title}
            className={cn(
              "w-full h-auto max-h-[500px] object-contain transition-all duration-500 group-hover:scale-[1.01]",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
        </div>
      )}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest opacity-70">
            {media.type === "gif" ? "Animação de Referência" : media.type === "video" ? "Vídeo Demonstrativo" : "Captura de Tela Real"}
          </span>
        </div>
        <Badge variant="secondary" className="text-[9px] font-bold">{media.type.toUpperCase()}</Badge>
      </div>
    </div>
  )
}
