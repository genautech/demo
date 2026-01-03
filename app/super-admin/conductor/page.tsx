"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Book, 
  RefreshCw, 
  FileText, 
  Code, 
  Settings, 
  Rocket,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Terminal,
  Copy,
  Check
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"

// Professional markdown renderer with syntax highlighting
const MarkdownRenderer = ({ content }: { content: string }) => {
  const { theme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark" || resolvedTheme === "fun"
  const codeStyle = isDark ? vscDarkPlus : oneLight
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className={cn(
      "prose prose-slate dark:prose-invert max-w-none",
      "prose-headings:font-bold prose-headings:tracking-tight",
      "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:border-b prose-h1:pb-2",
      "prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:pb-2",
      "prose-h3:text-xl prose-h3:mt-5 prose-h3:mb-2",
      "prose-p:mb-4 prose-p:leading-relaxed",
      "prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2",
      "prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2",
      "prose-li:my-1",
      "prose-code:text-sm prose-code:font-mono prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
      "prose-pre:bg-muted prose-pre:p-0 prose-pre:rounded-lg prose-pre:overflow-hidden",
      "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-table:border-collapse prose-table:w-full",
      "prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-muted prose-th:font-semibold",
      "prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2",
      "prose-strong:font-bold prose-strong:text-foreground",
      "prose-em:italic",
      isDark && "prose-invert"
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: {
            inline?: boolean
            className?: string
            children?: React.ReactNode
            [key: string]: unknown
          }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
            
            return !inline && match ? (
              <div className="relative group my-4">
                <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
                  <span className="text-xs font-mono text-muted-foreground">{match[1]}</span>
                  <button
                    onClick={() => copyToClipboard(codeString, codeId)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 text-xs rounded transition-colors",
                      "hover:bg-muted",
                      copiedCode === codeId ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    {copiedCode === codeId ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={codeStyle}
                  language={match[1]}
                  PreTag="div"
                  className="m-0! rounded-b-lg"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    borderBottomLeftRadius: '0.5rem',
                    borderBottomRightRadius: '0.5rem',
                  }}
                  codeTagProps={{
                    style: {}
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
                {children}
              </code>
            )
          },
          table({ children }: { children?: React.ReactNode }) {
            return (
              <div className="my-6 overflow-x-auto">
                <table className="min-w-full border-collapse border border-border">
                  {children}
                </table>
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

interface ConductorFile {
  name: string
  path: string
  content: string
  lastModified: string
}

interface ConductorTrack {
  name: string
  plan: string
  lastModified: string
}

export default function ConductorSpecsPage() {
  const { theme } = useTheme()
  const isFunMode = theme === "fun"
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState<ConductorFile[]>([])
  const [tracks, setTracks] = useState<ConductorTrack[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadSpecs = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/conductor?action=list")
      const data = await response.json()
      
      if (data.success) {
        setFiles(data.files || [])
        setTracks(data.tracks || [])
        if (data.files && data.files.length > 0 && !selectedFile) {
          setSelectedFile(data.files[0].name)
        }
      } else {
        setError(data.error || "Erro ao carregar especificações")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao conectar com a API")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSpecs()
  }, [])

  const getFileIcon = (fileName: string) => {
    if (fileName.includes("CHANGELOG")) return Clock
    if (fileName.includes("product")) return Book
    if (fileName.includes("tech-stack")) return Code
    if (fileName.includes("workflow")) return Settings
    if (fileName.includes("DEPLOY")) return Rocket
    if (fileName.includes("README")) return FileText
    return FileText
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const currentFile = files.find(f => f.name === selectedFile)

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isFunMode 
                ? "bg-linear-to-br from-purple-500 to-pink-500" 
                : "bg-primary/10"
            )}>
              <Terminal className={cn(
                "h-6 w-6",
                isFunMode ? "text-white" : "text-primary"
              )} />
            </div>
            Conductor Specs
          </h1>
          <p className="mt-2 text-muted-foreground">
            Visualização e acompanhamento das especificações do projeto
          </p>
        </div>
        <Button 
          onClick={loadSpecs} 
          variant="outline" 
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Atualizar
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className={cn(
            "grid w-full",
            isFunMode ? "bg-slate-800/90 border-slate-700" : "",
            "grid-cols-4"
          )}>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="docs">Documentação</TabsTrigger>
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className={cn(
                isFunMode && "bg-slate-800/90 border-slate-700"
              )}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Arquivos</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{files.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Documentos principais
                  </p>
                </CardContent>
              </Card>

              <Card className={cn(
                isFunMode && "bg-slate-800/90 border-slate-700"
              )}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Tracks</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tracks.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Features implementadas
                  </p>
                </CardContent>
              </Card>

              <Card className={cn(
                isFunMode && "bg-slate-800/90 border-slate-700"
              )}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold">
                    {files.length > 0 
                      ? formatDate(files[0].lastModified).split(",")[0]
                      : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {files.length > 0 
                      ? formatDate(files[0].lastModified).split(",")[1]
                      : ""}
                  </p>
                </CardContent>
              </Card>

              <Card className={cn(
                isFunMode && "bg-slate-800/90 border-slate-700"
              )}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold text-green-600">Sincronizado</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Conductor ativo
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((file) => {
                const Icon = getFileIcon(file.name)
                return (
                  <motion.div
                    key={file.name}
                    whileHover={isFunMode ? { scale: 1.02, y: -2 } : {}}
                  >
                    <Card 
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedFile === file.name && "ring-2 ring-primary",
                        isFunMode && "bg-slate-800/90 border-slate-700 hover:border-primary/50"
                      )}
                      onClick={() => setSelectedFile(file.name)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            isFunMode 
                              ? "bg-linear-to-br from-purple-500/20 to-pink-500/20" 
                              : "bg-primary/10"
                          )}>
                            <Icon className={cn(
                              "h-5 w-5",
                              isFunMode ? "text-purple-400" : "text-primary"
                            )} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{file.name.replace(".md", "")}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Atualizado {formatDate(file.lastModified)}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {/* File List */}
              <Card className={cn(
                "lg:col-span-1",
                isFunMode && "bg-slate-800/90 border-slate-700"
              )}>
                <CardHeader>
                  <CardTitle className="text-sm">Arquivos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-4 space-y-1">
                      {files.map((file) => {
                        const Icon = getFileIcon(file.name)
                        return (
                          <button
                            key={file.name}
                            onClick={() => setSelectedFile(file.name)}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                              selectedFile === file.name
                                ? isFunMode
                                  ? "bg-linear-to-r from-purple-500/20 to-pink-500/20 text-white"
                                  : "bg-primary/10 text-primary"
                                : "hover:bg-muted",
                              isFunMode && selectedFile !== file.name && "hover:bg-slate-700/50"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="truncate">{file.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* File Content */}
              <Card className={cn(
                "lg:col-span-3",
                isFunMode && "bg-slate-800/90 border-slate-700"
              )}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {currentFile?.name || "Selecione um arquivo"}
                    </CardTitle>
                    {currentFile && (
                      <Badge variant="outline" className="text-xs">
                        {formatDate(currentFile.lastModified)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {currentFile ? (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className={cn(
                        "prose prose-sm max-w-none",
                        isFunMode && "prose-invert",
                        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4",
                        "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3",
                        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
                        "[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm",
                        "[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto",
                        "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:space-y-1",
                        "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:space-y-1",
                      )}>
                        <ReactMarkdown>{currentFile.content}</ReactMarkdown>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Selecione um arquivo para visualizar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tracks Tab */}
          <TabsContent value="tracks" className="space-y-4">
            <div className="grid gap-4">
              {tracks.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Code className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Nenhum track encontrado</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                tracks.map((track, idx) => (
                  <motion.div
                    key={track.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={cn(
                      isFunMode && "bg-slate-800/90 border-slate-700"
                    )}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            {track.name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {formatDate(track.lastModified)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <MarkdownRenderer content={track.plan} />
                          </motion.div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Changelog Tab */}
          <TabsContent value="changelog" className="space-y-4">
            {(() => {
              const changelogFile = files.find(f => f.name === "CHANGELOG.md")
              return changelogFile ? (
                <Card className={cn(
                  isFunMode && "bg-slate-800/90 border-slate-700"
                )}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Histórico de Mudanças
                    </CardTitle>
                    <CardDescription>
                      Última atualização: {formatDate(changelogFile.lastModified)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[700px] pr-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MarkdownRenderer content={changelogFile.content} />
                      </motion.div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Changelog não encontrado</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })()}
          </TabsContent>
        </Tabs>
      )}
    </PageContainer>
  )
}
