import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, temperature = 0.2 } = await request.json()

    // Get the user's message from the messages array
    const userMessage = messages[messages.length - 1]?.content || ""
    
    if (!userMessage) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // Python backend URL (make sure your Python API server is running on port 8000)
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || "https://mathematical-hist-brazilian-invitations.trycloudflare.com"

    // Call your Python chatbot backend
    const response = await fetch(`${PYTHON_BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        conversation_id: null // You can implement conversation tracking later
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Python backend error: ${response.status} - ${errorText}`)
      return NextResponse.json({ 
        error: `Chatbot backend error: ${response.status}`,
        details: errorText 
      }, { status: response.status })
    }

    const data = await response.json()
    const message = data.response || "I apologize, but I cannot process your request at the moment."

    return NextResponse.json({ 
      message,
      conversation_id: data.conversation_id,
      sources: data.sources || []
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ 
      error: "Failed to connect to chatbot backend. Make sure Python API server is running on port 8000.",
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
