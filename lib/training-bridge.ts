/**
 * Bridge configuration for connecting Next.js with Python training system
 */

export interface TrainingSystemConfig {
  apiUrl: string
  timeout: number
  retryAttempts: number
  fallbackToOpenAI: boolean
}

export interface VectorSearchParams {
  query: string
  maxResults: number
  scoreThreshold: number
}

export interface KnowledgeSearchResult {
  content: string
  metadata: Record<string, any>
  score: number
}

export class TrainingBridge {
  private config: TrainingSystemConfig
  
  constructor(config?: Partial<TrainingSystemConfig>) {
    this.config = {
      apiUrl: process.env.PYTHON_API_URL || "http://localhost:8000",
      timeout: 5000,
      retryAttempts: 2,
      fallbackToOpenAI: true,
      ...config
    }
  }

  /**
   * Search the vector database for relevant knowledge
   */
  async searchKnowledge(params: VectorSearchParams): Promise<KnowledgeSearchResult[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const response = await fetch(`${this.config.apiUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: params.query,
          max_results: params.maxResults,
          score_threshold: params.scoreThreshold
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Python API error: ${response.status}`)
      }

      const data = await response.json()
      return this.transformResults(data.results || [])

    } catch (error) {
      console.warn("Vector search failed:", error)
      return []
    }
  }

  /**
   * Get enhanced context by combining FAQ and vector search results
   */
  async getEnhancedContext(query: string, faqContext?: string): Promise<string> {
    const vectorResults = await this.searchKnowledge({
      query,
      maxResults: 3,
      scoreThreshold: 0.7
    })

    let enhancedContext = ""

    // Add FAQ context if available
    if (faqContext) {
      enhancedContext += `FAQ Answer: ${faqContext}\n\n`
    }

    // Add vector search results
    if (vectorResults.length > 0) {
      enhancedContext += "Additional Knowledge Base:\n"
      vectorResults.forEach((result, index) => {
        enhancedContext += `${index + 1}. ${result.content}\n`
      })
      enhancedContext += "\n"
    }

    return enhancedContext.trim()
  }

  /**
   * Check if the Python training system is healthy
   */
  async checkHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(`${this.config.apiUrl}/health`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      return { healthy: response.ok }
    } catch (error) {
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Get detailed status including knowledge base size
   */
  async getStatus(): Promise<{ healthy: boolean; knowledgeBaseSize?: number; error?: string }> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      const response = await fetch(`${this.config.apiUrl}/status`, { signal: controller.signal })
      clearTimeout(timeoutId)
      if (!response.ok) return { healthy: false, error: `Status ${response.status}` }
      const data = await response.json()
      return {
        healthy: true,
        knowledgeBaseSize: typeof data.knowledge_base_size === 'number' ? data.knowledge_base_size : undefined
      }
    } catch (error) {
      return { healthy: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Transform Python API results to our interface
   */
  private transformResults(results: any[]): KnowledgeSearchResult[] {
    return results.map(item => ({
      content: item.content || item.text || "",
      metadata: item.metadata || {},
      score: item.score || item.distance || 0
    }))
  }

  /**
   * Trigger retraining of the knowledge base
   */
  async triggerRetraining(options?: { force?: boolean }): Promise<{ success: boolean; jobId?: string }> {
    try {
      const response = await fetch(`${this.config.apiUrl}/retrain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ background_tasks: false, processed_data_file: 'processed_data.json', ...(options || {}) })
      })

      if (!response.ok) {
        throw new Error(`Retraining failed: ${response.status}`)
      }

      const data = await response.json()
      return { success: data.success, jobId: data.job_id || data.jobId }
    } catch (error) {
      console.error("Retraining trigger failed:", error)
      return { success: false }
    }
  }

  /**
   * Set the OpenAI API key in the Python service at runtime
   */
  async setOpenAIKey(apiKey: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.config.apiUrl}/admin/set_api_key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider: 'openai', api_key: apiKey })
      })

      if (!response.ok) {
        throw new Error(`Set API key failed: ${response.status}`)
      }
      const data = await response.json()
      return { success: !!data.success }
    } catch (error) {
      console.error("Setting OpenAI API key failed:", error)
      return { success: false }
    }
  }
}

// Default instance
export const trainingBridge = new TrainingBridge()

// Helper function for backward compatibility
export async function searchVectorDatabase(query: string, maxResults = 3): Promise<KnowledgeSearchResult[]> {
  return trainingBridge.searchKnowledge({
    query,
    maxResults,
    scoreThreshold: 0.6
  })
}
