import { NextRequest, NextResponse } from "next/server"
import { trainingBridge } from "@/lib/training-bridge"

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey } = await request.json()
    if (!apiKey || (provider && provider !== 'openai')) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }
    const result = await trainingBridge.setOpenAIKey(apiKey)
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Failed to set API key in Python service' }, { status: 502 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin settings error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
