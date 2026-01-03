"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send, Bot, User, Sparkles, Brain, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  provider?: "grok" | "gemini"
}

interface ChatSuggestions {
  text: string
  icon: React.ReactNode
  category: string
}

interface GrokChatProps {
  className?: string
  onMessage?: (message: Message) => void
  placeholder?: string
  title?: string
  showProvider?: boolean
  defaultProvider?: "grok" | "gemini"
}

export function GrokChat({
  className,
  onMessage,
  placeholder = "Digite sua mensagem...",
  title = "Assistente AI",
  showProvider = true,
  defaultProvider = "grok"
}: GrokChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<"grok" | "gemini">(defaultProvider)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const suggestions: ChatSuggestions[] = [
    {
      text: "Analisar performance da equipe",
      icon: <TrendingUp className="w-4 h-4" />,
      category: "Análise"
    },
    {
      text: "Recomendar produtos para campanha",
      icon: <Sparkles className="w-4 h-4" />,
      category: "Produtos"
    },
    {
      text: "Gerar insights de engajamento",
      icon: <Brain className="w-4 h-4" />,
      category: "Insights"
    }
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      provider
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/demo/grok-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          provider
        })
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem")
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content || data.message || "Desculpe, não consegui processar sua solicitação.",
        timestamp: new Date(),
        provider: data.provider || provider
      }

      setMessages(prev => [...prev, assistantMessage])
      onMessage?.(assistantMessage)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
        provider
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: ChatSuggestions) => {
    setInput(suggestion.text)
  }

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            {title}
          </CardTitle>
          {showProvider && (
            <div className="flex items-center gap-2">
              <Badge 
                variant={provider === "grok" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setProvider("grok")}
              >
                Grok
              </Badge>
              <Badge 
                variant={provider === "gemini" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setProvider("gemini")}
              >
                Gemini
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[600px]">
          <ScrollArea 
            ref={scrollAreaRef}
            className="flex-1 pr-4"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Bot className="w-12 h-12 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Como posso ajudar?</h3>
                  <p className="text-sm text-muted-foreground">
                    Escolha uma sugestão abaixo ou digite sua própria pergunta
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full max-w-lg">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center gap-1"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.icon}
                      <span className="text-xs">{suggestion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === "assistant" && (
                          <>
                            <Bot className="w-3 h-3" />
                            {showProvider && message.provider && (
                              <Badge variant="outline" className="text-xs">
                                {message.provider}
                              </Badge>
                            )}
                          </>
                        )}
                        {message.role === "user" && <User className="w-3 h-3" />}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-sm">Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          <Separator className="my-4" />
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}