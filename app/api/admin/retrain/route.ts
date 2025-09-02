import { type NextRequest, NextResponse } from "next/server"
import { trainingBridge } from "@/lib/training-bridge"

export async function POST(request: NextRequest) {
  try {
    // Add basic authentication or API key check here in production
    const { force = false } = await request.json()

    // Check if training system is available
    const healthCheck = await trainingBridge.checkHealth()
    if (!healthCheck.healthy) {
      return NextResponse.json({
        success: false,
        error: "Training system is not available",
        details: healthCheck.error
      }, { status: 503 })
    }

    // Trigger retraining
    const result = await trainingBridge.triggerRetraining({ force })
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Retraining initiated successfully",
        jobId: result.jobId,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to trigger retraining"
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Retraining trigger error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Get training system status
  const healthCheck = await trainingBridge.getStatus()
    
    return NextResponse.json({
      pythonSystem: {
    healthy: healthCheck.healthy,
    error: healthCheck.error,
    knowledgeBaseSize: healthCheck.knowledgeBaseSize
      },
      lastChecked: new Date().toISOString()
    })

  } catch (error) {
    console.error("Training status check error:", error)
    return NextResponse.json({
      pythonSystem: {
        healthy: false,
        error: "Unable to connect to training system"
      },
      lastChecked: new Date().toISOString()
    })
  }
}
