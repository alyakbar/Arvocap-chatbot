import { NextRequest, NextResponse } from "next/server"
import { setGoogleCredentials } from "@/lib/runtime-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      GOOGLE_SPREADSHEET_ID,
      GOOGLE_PROJECT_ID,
      GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_CLIENT_ID,
    } = body || {}

    if (!GOOGLE_SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    setGoogleCredentials({
      GOOGLE_SPREADSHEET_ID,
      GOOGLE_PROJECT_ID,
      GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_CLIENT_ID,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Google creds save error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
