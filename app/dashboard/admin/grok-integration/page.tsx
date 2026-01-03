"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Sparkles,
  Settings,
  BarChart3,
  Users
} from "lucide-react"
import { GrokChat } from "@/components/gestor/grok-chat"
import { SmartRecommendations } from "@/components/gestor/smart-recommendations"
import { DashboardInsights } from "@/components/gestor/dashboard-insights"
import { cn } from "@/lib/utils"

export default function GrokIntegrationPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            Integração Grok AI
          </h1>
          <p className="text-muted-foreground mt-2">
            Recursos avançados de IA powered by Grok para gamificação corporativa
          </p>
        </div>
        <Badge variant="default" className="text-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          Enhanced with Grok
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat AI
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Recomendações
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Chat Conversacional
                </CardTitle>
                <CardDescription>
                  Assistente AI inteligente para suporte e consultas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    • Respostas em tempo real com Grok AI
                  </p>
                  <p className="text-sm">
                    • Análise de performance e engajamento
                  </p>
                  <p className="text-sm">
                    • Recomendações personalizadas
                  </p>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("chat")}
                  >
                    Experimentar Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Recomendações Inteligentes
                </CardTitle>
                <CardDescription>
                  Sugestões de produtos baseadas em IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    • Análise de perfil da equipe
                  </p>
                  <p className="text-sm">
                    • Recomendações contextualizadas
                  </p>
                  <p className="text-sm">
                    • Otimização de orçamento
                  </p>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("recommendations")}
                  >
                    Ver Recomendações
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Insights de Dashboard
                </CardTitle>
                <CardDescription>
                  Análise preditiva de performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    • Métricas em tempo real
                  </p>
                  <p className="text-sm">
                    • Previsões de tendências
                  </p>
                  <p className="text-sm">
                    • Recomendações estratégicas
                  </p>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("insights")}
                  >
                    Ver Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Tecnologias Integradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Grok AI (Primary)</h4>
                  <p className="text-sm text-muted-foreground">
                    Modelo avançado da xAI para respostas rápidas e precisas
                  </p>
                  <Badge variant="default">Padrão</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Gemini AI (Fallback)</h4>
                  <p className="text-sm text-muted-foreground">
                    Google AI como alternativa de alta disponibilidade
                  </p>
                  <Badge variant="secondary">Backup</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Assistente AI com Grok</CardTitle>
              <CardDescription>
                Tire dúvidas, solicite análises ou obtenha recomendações em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GrokChat 
                title="Assistente Yoobe AI"
                placeholder="Digite sua pergunta sobre gamificação, produtos ou insights..."
                showProvider={true}
                defaultProvider="grok"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <SmartRecommendations 
            companyId="company_1"
            onRecommendationSelect={(rec) => {
              // Recommendation selected (debug removed for production)
            }}
          />
        </TabsContent>

        <TabsContent value="insights">
          <DashboardInsights 
            companyId="company_1"
            timeRange="month"
          />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações da IA
                </CardTitle>
                <CardDescription>
                  Configure como Grok AI deve se comportar no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Provedor Padrão</h4>
                  <div className="flex gap-2">
                    <Badge variant="default">Grok</Badge>
                    <Badge variant="outline">Gemini</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Grok é usado por padrão para melhor performance e insights. 
                    Gemini está disponível como backup para garantir disponibilidade.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Rate Limiting</h4>
                  <p className="text-sm text-muted-foreground">
                    Sistema implementado para respeitar limites da API e garantir performance estável.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Error Handling</h4>
                  <p className="text-sm text-muted-foreground">
                    Fallback automático para respostas pré-configuradas em caso de falha da API.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Cache e Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Respostas frequentes são cacheadas para melhor performance e redução de custos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status da Integração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Grok API</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Gemini API</span>
                    <Badge variant="secondary">Backup</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rate Limiting</span>
                    <Badge variant="outline">Configurado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Error Handling</span>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}