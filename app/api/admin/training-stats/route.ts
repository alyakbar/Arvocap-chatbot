import { type NextRequest, NextResponse } from "next/server"
import { trainingBridge } from "@/lib/training-bridge"

export async function GET() {
  try {
    // Get training statistics
    const result = await trainingBridge.getTrainingStats()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        totalDocuments: result.totalDocuments || 0,
        totalWebsites: result.totalWebsites || 0,
        manualEntries: result.manualEntries || 0,
        knowledgeBaseSize: result.knowledgeBaseSize || 0,
        lastTrained: result.lastTrained || null
      })
    } else {
      return NextResponse.json({
        success: false,
        totalDocuments: 0,
        totalWebsites: 0,
        manualEntries: 0,
        knowledgeBaseSize: 0,
        lastTrained: null,
        error: result.error
      })
    }

  } catch (error) {
    console.error("Training stats fetch error:", error)
    return NextResponse.json({
      success: false,
      totalDocuments: 0,
      totalWebsites: 0,
      manualEntries: 0,
      knowledgeBaseSize: 0,
      lastTrained: null,
      error: "Internal server error"
    })
  }
}
