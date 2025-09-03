import { type NextRequest, NextResponse } from "next/server"
import { trainingBridge } from "@/lib/training-bridge"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Item ID is required"
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

    // Delete knowledge base item
    const result = await trainingBridge.deleteKnowledgeItem(id)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Item deleted successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to delete item",
        details: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Knowledge base delete error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}
