import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, temperature = 0.2 } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

  const model = process.env.OPENAI_FALLBACK_MODEL || "gpt-4o-mini"

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
    model,
        messages,
        temperature,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OpenAI API error: ${response.status} - ${errorText}`)
      return NextResponse.json({ error: `OpenAI API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    const message = data.choices[0]?.message?.content || "I apologize, but I cannot process your request at the moment."

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
