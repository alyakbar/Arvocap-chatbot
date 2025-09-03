import { type NextRequest, NextResponse } from "next/server"
import { trainingBridge } from "@/lib/training-bridge"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const documents = formData.getAll('documents') as File[]
    const ocrEnabled = formData.get('ocrEnabled') === 'true'
    const chunkSize = parseInt(formData.get('chunkSize') as string) || 1000
    const chunkOverlap = parseInt(formData.get('chunkOverlap') as string) || 200

    if (!documents.length) {
      return NextResponse.json({
        success: false,
        error: "No documents provided"
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

    // Process documents
    const result = await trainingBridge.uploadDocuments({
      documents,
      ocrEnabled,
      chunkSize,
      chunkOverlap
    })
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully processed ${documents.length} document(s)`,
        documentsProcessed: documents.length,
        chunksCreated: result.chunksCreated,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to process documents",
        details: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Document upload error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}
