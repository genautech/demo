# Grok AI Integration Documentation

## Overview

This document describes the comprehensive integration of Grok AI (xAI) throughout the Yoobe demo platform, providing advanced AI capabilities for gamification, recommendations, and insights.

## Architecture

### Core Components

1. **Grok API Client** (`lib/grok-api.ts`)
   - Centralized client for all Grok interactions
   - Rate limiting and error handling
   - Fallback mechanisms to Gemini
   - TypeScript interfaces for type safety

2. **API Routes**
   - `/api/demo/ai-enhanced` - Enhanced AI generation with Grok
   - `/api/demo/grok-chat` - Real-time chat interface
   - `/api/demo/grok-insights` - Team insights generation
   - `/api/demo/grok-dashboard-insights` - Dashboard analytics
   - `/api/gifts/recommend-enhanced` - Smart product recommendations

3. **UI Components**
   - `GrokChat` - Interactive chat interface
   - `SmartRecommendations` - AI-powered product suggestions
   - `DashboardInsights` - Performance analytics and predictions

## Features

### 1. Centralized Grok Client

The `lib/grok-api.ts` file provides:

```typescript
// Main client class
export class GrokClient {
  async chat(messages: GrokMessage[], options?: GrokConfig): Promise<GrokResponse>
  async chatStream(messages: GrokMessage[], options?: GrokConfig): Promise<ReadableStream>
  async generateText(prompt: string, options?: GrokConfig): Promise<string>
  async generateJSON<T>(prompt: string, options?: GrokConfig): Promise<T>
  async analyzeText(text: string, analysisType: string): Promise<string>
}

// Singleton pattern
export function getGrokClient(config?: GrokConfig): GrokClient

// Fallback utilities
export async function callGrokWithFallback<T>(prompt: string, fallback: T): Promise<T>
export async function callGrokJSONWithFallback<T>(prompt: string, fallback: T): Promise<T>
```

### 2. Enhanced AI Demo Route

`/api/demo/ai-enhanced` supports:
- Profile generation with Grok/Gemini toggle
- Product recommendations with AI enhancement
- Performance analysis and insights
- Error handling with graceful fallbacks

```javascript
POST /api/demo/ai-enhanced
{
  "action": "generate-profile|generate-products|analyze-performance",
  "prompt": "Custom prompt",
  "useGrok": true,  // Toggle between Grok and Gemini
  "profile": {},     // Company profile context
  "data": {}        // Performance data for analysis
}
```

### 3. Smart Product Recommendations

`/api/gifts/recommend-enhanced` provides:
- Context-aware product suggestions
- Budget-aware recommendations
- Stock availability analysis
- Creative thematic kits (not just individual products)

### 4. Real-time Chat Interface

`/api/demo/grok-chat` offers:
- Conversational AI assistance
- Provider switching (Grok/Gemini)
- Context-aware responses
- Specialized for gamification use cases

### 5. Dashboard Insights

`/api/demo/grok-dashboard-insights` delivers:
- Performance metrics analysis
- Predictive insights
- Strategic recommendations
- Time-based trends

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
- Real-time messaging
- Provider toggle
- Suggested actions
- Message history
- Typing indicators

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
- Campaign type selection
- Budget constraints
- Team insights display
- Stock availability
- Visual product cards

### DashboardInsights Component

```typescript
<DashboardInsights 
  companyId="company_1"
  timeRange="week|month|quarter|year"
  onRefresh={() => reloadData()}
/>
```

Features:
- Time range selection
- Performance metrics
- Predictive analytics
- Strategic recommendations
- Provider switching

## Configuration

### Environment Variables

```bash
# Required
GROK_API_KEY=your_xai_api_key_here

# Optional (fallback)
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Important**: Never commit real API keys. Use environment variables or `.env.local` files.

### Rate Limiting

Built-in rate limiting prevents API abuse:
- Default: 10 calls per second
- Automatic queue management
- Graceful handling of limits

### Error Handling

- Automatic fallback to Gemini on Grok failures
- Pre-configured fallback responses
- User-friendly error messages
- Logging for debugging

## Usage Examples

### 1. Enhanced Profile Generation

```javascript
const response = await fetch('/api/demo/ai-enhanced', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate-profile',
    prompt: 'Tech company focused on innovation',
    useGrok: true
  })
})
```

### 2. Smart Product Recommendations

```javascript
const response = await fetch('/api/gifts/recommend-enhanced', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'Onboarding kit for new developers',
    budget: 500,
    recipientCount: 10,
    useGrok: true
  })
})
```

### 3. Chat Interaction

```javascript
const response = await fetch('/api/demo/grok-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'How can I improve team engagement?' }
    ],
    provider: 'grok'
  })
})
```

## Best Practices

### 1. Error Handling

Always wrap Grok calls in try-catch blocks:

```typescript
try {
  const result = await grokClient.generateText(prompt)
  // Process result
} catch (error) {
  console.warn('Grok failed, using fallback:', error)
  // Use fallback logic
}
```

### 2. Rate Limiting

The built-in rate limiter prevents API abuse. For high-volume usage, consider:

- Implementing client-side debouncing
- Caching frequent responses
- Using streaming for long conversations

### 3. Prompt Engineering

- Be specific and contextual
- Include relevant data and constraints
- Use JSON structure for structured responses
- Provide fallback options

### 4. Performance Optimization

- Use the singleton `getGrokClient()`
- Enable streaming for long responses
- Cache frequent requests
- Monitor API usage costs

## Monitoring and Debugging

### Logging

All Grok interactions are logged with:
- Request/response details
- Error messages
- Performance metrics
- Provider usage statistics

### Health Checks

Use `/api/demo/grok-integration` to verify:
- API key validity
- Service availability
- Response times
- Error rates

## Security Considerations

1. **API Key Management**
   - Store keys in environment variables
   - Never expose keys to frontend
   - Rotate keys regularly

2. **Input Validation**
   - Sanitize user inputs
   - Validate message formats
   - Limit message lengths

3. **Content Filtering**
   - Implement content policies
   - Monitor for abuse
   - Log suspicious activity

## Future Enhancements

### Planned Features

1. **Advanced Analytics**
   - Conversation analytics
   - Usage patterns
   - ROI tracking

2. **Custom Models**
   - Fine-tuned Grok instances
   - Industry-specific prompts
   - Personalization layers

3. **Integration Expansion**
   - More product catalogs
   - CRM integration
   - Analytics platforms

4. **Performance Optimizations**
   - Response caching
   - Edge deployment
   - Real-time collaboration

## Support

For issues related to Grok integration:

1. Check environment variables
2. Verify API key validity
3. Review logs for specific errors
4. Test with fallback provider
5. Consult component documentation

## Conclusion

The Grok AI integration provides powerful, flexible AI capabilities throughout the platform while maintaining reliability through fallbacks and proper error handling. The modular design allows for easy maintenance and future enhancements.