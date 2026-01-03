# Grok AI Integration

## Status: Implemented

**Created**: 2026-01-02
**Last Updated**: 2026-01-02
**Owner**: Auto Claude

## Overview

Integração completa do Grok AI (xAI) na plataforma Yoobe, fornecendo capacidades avançadas de IA para gamificação, recomendações e insights.

## Architecture

### Core Components

1. **Grok API Client** (`lib/grok-api.ts`)
   - Cliente centralizado para todas as interações com Grok
   - Rate limiting e tratamento de erros
   - Mecanismos de fallback para Gemini
   - Interfaces TypeScript para type safety

2. **API Routes**
   - `/api/demo/ai-enhanced` - Geração aprimorada com Grok
   - `/api/demo/grok-chat` - Interface de chat em tempo real
   - `/api/demo/grok-insights` - Geração de insights de equipe
   - `/api/demo/grok-dashboard-insights` - Analytics do dashboard
   - `/api/gifts/recommend-enhanced` - Recomendações inteligentes de produtos

3. **UI Components**
   - `GrokChat` - Interface de chat interativo
   - `SmartRecommendations` - Sugestões de produtos com IA
   - `DashboardInsights` - Analytics de performance e predições

## Features Implemented

### 1. Centralized Grok Client

O arquivo `lib/grok-api.ts` fornece:

```typescript
// Classe principal do cliente
export class GrokClient {
  async chat(messages: GrokMessage[], options?: GrokConfig): Promise<GrokResponse>
  async chatStream(messages: GrokMessage[], options?: GrokConfig): Promise<ReadableStream>
  async generateText(prompt: string, options?: GrokConfig): Promise<string>
  async generateJSON<T>(prompt: string, options?: GrokConfig): Promise<T>
  async analyzeText(text: string, analysisType: string): Promise<string>
}

// Padrão singleton
export function getGrokClient(config?: GrokConfig): GrokClient

// Utilitários de fallback
export async function callGrokWithFallback<T>(prompt: string, fallback: T): Promise<T>
export async function callGrokJSONWithFallback<T>(prompt: string, fallback: T): Promise<T>
```

### 2. Enhanced AI Demo Route

`/api/demo/ai-enhanced` suporta:
- Geração de perfis com toggle Grok/Gemini
- Recomendações de produtos com aprimoramento de IA
- Análise de performance e insights
- Tratamento de erros com fallbacks graciosos

### 3. Smart Product Recommendations

`/api/gifts/recommend-enhanced` oferece:
- Sugestões de produtos context-aware
- Recomendações considerando orçamento
- Análise de disponibilidade de estoque
- Kits temáticos criativos (não apenas produtos individuais)

### 4. Real-time Chat Interface

`/api/demo/grok-chat` fornece:
- Assistência conversacional com IA
- Troca de provider (Grok/Gemini)
- Respostas context-aware
- Especializado para casos de uso de gamificação

### 5. Dashboard Insights

`/api/demo/grok-dashboard-insights` entrega:
- Análise de métricas de performance
- Insights preditivos
- Recomendações estratégicas
- Tendências baseadas em tempo

## UI Components

### GrokChat Component

```typescript
<GrokChat 
  title="Assistente AI"
  placeholder="Digite sua mensagem..."
  showProvider={true}
  defaultProvider="grok"
  onMessage={(message) => console.log(message)}
/>
```

Features:
- Mensagens em tempo real
- Toggle de provider
- Ações sugeridas
- Histórico de mensagens
- Indicadores de digitação

### SmartRecommendations Component

```typescript
<SmartRecommendations 
  companyId="company_1"
  budget={1000}
  recipientCount={50}
  campaignType="onboarding|recognition|wellness|engagement"
  onRecommendationSelect={(rec) => handleSelection(rec)}
/>
```

Features:
- Seleção de tipo de campanha
- Restrições de orçamento
- Display de insights de equipe
- Disponibilidade de estoque
- Cards visuais de produtos

### DashboardInsights Component

```typescript
<DashboardInsights 
  companyId="company_1"
  timeRange="week|month|quarter|year"
  onRefresh={() => reloadData()}
/>
```

Features:
- Seleção de período
- Métricas de performance
- Analytics preditivo
- Recomendações estratégicas
- Troca de provider

## Configuration

### Environment Variables

```bash
# Obrigatório
GROK_API_KEY=xai-...

# Opcional (fallback)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Rate Limiting

Rate limiting embutido previne abuso da API:
- Padrão: 10 chamadas por segundo
- Gerenciamento automático de fila
- Tratamento gracioso de limites

### Error Handling

- Fallback automático para Gemini em falhas do Grok
- Respostas de fallback pré-configuradas
- Mensagens de erro amigáveis
- Logging para debugging

## Files Created/Modified

| File | Change |
|------|--------|
| `lib/grok-api.ts` | Novo arquivo - Cliente centralizado |
| `app/api/demo/ai-enhanced/route.ts` | Novo arquivo - API route |
| `app/api/demo/grok-chat/route.ts` | Novo arquivo - Chat API |
| `app/api/demo/grok-insights/route.ts` | Novo arquivo - Insights API |
| `app/api/demo/grok-dashboard-insights/route.ts` | Novo arquivo - Dashboard insights |
| `app/api/gifts/recommend-enhanced/route.ts` | Novo arquivo - Recomendações |
| `components/gestor/grok-chat.tsx` | Novo arquivo - Chat component |
| `components/gestor/smart-recommendations.tsx` | Novo arquivo - Recommendations component |
| `components/gestor/dashboard-insights.tsx` | Novo arquivo - Insights component |
| `components/gifts/AIRecommendationView.tsx` | Novo arquivo - Visualization component |

## Best Practices

### 1. Error Handling
Sempre envolver chamadas Grok em try-catch blocks.

### 2. Rate Limiting
O rate limiter embutido previne abuso da API. Para alto volume, considerar:
- Debouncing no lado do cliente
- Cache de respostas frequentes
- Streaming para conversas longas

### 3. Prompt Engineering
- Ser específico e contextual
- Incluir dados e restrições relevantes
- Usar estrutura JSON para respostas estruturadas
- Fornecer opções de fallback

### 4. Performance Optimization
- Usar o singleton `getGrokClient()`
- Habilitar streaming para respostas longas
- Cachear requisições frequentes
- Monitorar custos de uso da API

## Related Tracks

- `ai-recommendations-visualization`
- `ai-simulated-demo`
- `design-system-modernization`

## Next Steps

1. Integrar com sistema de notificações
2. Adicionar analytics de conversações
3. Implementar modelos customizados
4. Expansão de integrações
5. Otimizações de performance
