import { type NextRequest, NextResponse } from "next/server"
import { trainingBridge } from "@/lib/training-bridge"

export async function POST(request: NextRequest) {
  try {
    const { url, depth = 2, chunkSize = 1000, chunkOverlap = 200 } = await request.json()

    if (!url) {
      return NextResponse.json({
        success: false,
        error: "No URL provided"
      }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({
        success: false,
        error: "Invalid URL format"
      }, { status: 400 })
    }

    // Check if training system is available
    const healthCheck = await trainingBridge.checkHealth()
    if (!healthCheck.healthy) {
      return NextResponse.json({
        success: false,
        error: "Training system is not available",
        details: healthCheck.error
      }, { status: 503 })
    }

    // Scrape website
    const result = await trainingBridge.scrapeWebsite({
      url,
      depth,
      chunkSize,
      chunkOverlap
    })
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully scraped ${result.pagesProcessed} pages`,
        pagesProcessed: result.pagesProcessed,
        chunksCreated: result.chunksCreated,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to scrape website",
        details: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Website scraping error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}
