import { type NextRequest, NextResponse } from "next/server"

interface VectorSearchRequest {
  query: string
  maxResults?: number
}

interface VectorSearchResult {
  content: string
  metadata: Record<string, any>
  score: number
}

interface KnowledgeResponse {
  results: VectorSearchResult[]
  hasResults: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 3 }: VectorSearchRequest = await request.json()

    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Check if Python training system is available
    const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000"
    
    try {
      const response = await fetch(`${pythonApiUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          max_results: maxResults
        }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        console.warn(`Python API responded with status ${response.status}`)
        return NextResponse.json({ 
          results: [], 
          hasResults: false,
          message: "Knowledge base temporarily unavailable"
        })
      }

      const data = await response.json()
      
      // Transform Python API response to our format
      const results: VectorSearchResult[] = (data.results || []).map((item: any) => ({
        content: item.content || item.text || "",
        metadata: item.metadata || {},
        score: item.score || item.distance || 0
      }))

      const knowledgeResponse: KnowledgeResponse = {
        results,
        hasResults: results.length > 0
      }

      return NextResponse.json(knowledgeResponse)

    } catch (fetchError) {
      console.warn("Python training system not available:", fetchError)
      
      // Return empty results when Python system is not available
      return NextResponse.json({ 
        results: [], 
        hasResults: false,
        message: "Knowledge base not available"
      })
    }

  } catch (error) {
    console.error("Chatbot knowledge API error:", error)
    return NextResponse.json(
      { error: "Failed to search knowledge base" }, 
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000"
    
    const response = await fetch(`${pythonApiUrl}/health`, {
      signal: AbortSignal.timeout(3000)
    })
    
    if (response.ok) {
      return NextResponse.json({ 
        status: "healthy", 
        pythonSystem: "connected",
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({ 
        status: "degraded", 
        pythonSystem: "disconnected",
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    return NextResponse.json({ 
      status: "degraded", 
      pythonSystem: "unavailable",
      timestamp: new Date().toISOString()
    })
  }
}
