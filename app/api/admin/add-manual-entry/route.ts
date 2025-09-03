import { type NextRequest, NextResponse } from "next/server"
import { trainingBridge } from "@/lib/training-bridge"

export async function POST(request: NextRequest) {
  try {
    const { title, content, chunkSize = 1000, chunkOverlap = 200 } = await request.json()

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: "Title and content are required"
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

    // Add manual entry
    const result = await trainingBridge.addManualEntry({
      title,
      content,
      chunkSize,
      chunkOverlap
    })
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Manual entry added successfully",
        chunksCreated: result.chunksCreated,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to add manual entry",
        details: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Manual entry error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}
