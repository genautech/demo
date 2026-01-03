import { NextRequest, NextResponse } from 'next/server'

const GROK_API_URL = 'https://api.x.ai/v1'
const GROK_MODEL = 'grok-3-latest'

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GrokResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: GrokMessage
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface GrokStreamResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason?: string
  }>
}

export interface GrokConfig {
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  stream?: boolean
}

export class GrokClient {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor(config: GrokConfig = {}) {
    this.apiKey = config.apiKey || process.env.GROK_API_KEY || ''
    this.model = config.model || GROK_MODEL
    this.baseUrl = config.apiKey?.includes('custom') ? GROK_API_URL : GROK_API_URL

    if (!this.apiKey) {
      throw new Error('Grok API key is required. Set GROK_API_KEY environment variable.')
    }
  }

  async chat(
    messages: GrokMessage[],
    options: Partial<GrokConfig> = {}
  ): Promise<GrokResponse> {
    const config = { ...this.defaultConfig(), ...options }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Grok API error: ${response.status} - ${errorText}`)
    }

    return response.json() as Promise<GrokResponse>
  }

  async chatStream(
    messages: GrokMessage[],
    options: Partial<GrokConfig> = {}
  ): Promise<ReadableStream> {
    const config = { ...this.defaultConfig(), ...options, stream: true }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Grok API error: ${response.status} - ${errorText}`)
    }

    return response.body!
  }

  async generateText(
    prompt: string,
    options: Partial<GrokConfig> = {}
  ): Promise<string> {
    const messages: GrokMessage[] = [
      { role: 'user', content: prompt }
    ]

    const response = await this.chat(messages, options)
    return response.choices[0]?.message?.content || ''
  }

  async generateJSON<T = any>(
    prompt: string,
    options: Partial<GrokConfig> = {}
  ): Promise<T> {
    const messages: GrokMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that always responds with valid JSON. Do not include any markdown code blocks or formatting in your response.'
      },
      { role: 'user', content: prompt }
    ]

    const response = await this.chat(messages, options)
    const content = response.choices[0]?.message?.content || ''
    
    try {
      return JSON.parse(content)
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${content}`)
    }
  }

  async analyzeText(
    text: string,
    analysisType: 'sentiment' | 'insights' | 'recommendations' | 'summary',
    context?: string
  ): Promise<string> {
    const prompts = {
      sentiment: `Analyze the sentiment of the following text and provide a detailed analysis: "${text}"`,
      insights: `Extract key insights and patterns from this text: "${text}" ${context ? `Context: ${context}` : ''}`,
      recommendations: `Based on this information, provide actionable recommendations: "${text}" ${context ? `Context: ${context}` : ''}`,
      summary: `Provide a comprehensive summary of the following text: "${text}"`
    }

    return this.generateText(prompts[analysisType])
  }

  private defaultConfig(): GrokConfig {
    return {
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1,
      stream: false
    }
  }
}

let grokClient: GrokClient | null = null

export function getGrokClient(config?: GrokConfig): GrokClient {
  if (!grokClient || config) {
    grokClient = new GrokClient(config)
  }
  return grokClient
}

export async function callGrokWithFallback<T = string>(
  prompt: string,
  fallback: T,
  options?: Partial<GrokConfig>
): Promise<T> {
  try {
    const client = getGrokClient()
    const result = await client.generateText(prompt, options)
    return result as T
  } catch (error) {
    console.warn('Grok API call failed, using fallback:', error)
    return fallback
  }
}

export async function callGrokJSONWithFallback<T>(
  prompt: string,
  fallback: T,
  options?: Partial<GrokConfig>
): Promise<T> {
  try {
    const client = getGrokClient()
    return await client.generateJSON<T>(prompt, options)
  } catch (error) {
    console.warn('Grok API JSON call failed, using fallback:', error)
    return fallback
  }
}

class RateLimiter {
  private lastCall = 0
  private minInterval: number

  constructor(callsPerSecond: number = 10) {
    this.minInterval = 1000 / callsPerSecond
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now()
    const timeSinceLastCall = now - this.lastCall
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastCall))
    }
    
    this.lastCall = Date.now()
  }
}

export const rateLimiter = new RateLimiter()

export class GrokError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'GrokError'
  }
}

export function handleGrokError(error: any): never {
  if (error instanceof GrokError) {
    throw error
  }

  if (error?.status === 401) {
    throw new GrokError('Invalid Grok API key', 'INVALID_API_KEY', 401)
  }

  if (error?.status === 429) {
    throw new GrokError('Rate limit exceeded', 'RATE_LIMITED', 429)
  }

  if (error?.status >= 500) {
    throw new GrokError('Grok API server error', 'SERVER_ERROR', error.status)
  }

  throw new GrokError(error?.message || 'Unknown Grok API error', 'UNKNOWN_ERROR')
}