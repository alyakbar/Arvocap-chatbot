"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, User, Bot, Phone } from "lucide-react"
import Image from "next/image"

interface SourceRef {
  label: string
  sourceType: string
  url?: string
  score?: number
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isQuickReply?: boolean
  sources?: SourceRef[]
}

interface FAQ {
  id: string
  category: string
  question: string
  answer: string
  keywords: string[]
}

const faqs: FAQ[] = [
  // Company Overview
  {
    id: "1",
    category: "Company Overview",
    question: "What is ArvoCap Asset Managers Ltd?",
    answer:
      "ArvoCap Asset Managers Ltd is a licensed asset management company based in Nairobi, Kenya. It is regulated by the Capital Markets Authority (CMA), license number 190 issued on October 30, 2023.",
    keywords: ["company", "about", "arvocap", "what", "asset managers", "licensed", "regulated"],
  },
  {
    id: "2",
    category: "Company Overview", 
    question: "What is ArvoCap's mission?",
    answer: "To empower investors through innovative financial solutions and portfolio diversification.",
    keywords: ["mission", "purpose", "goal", "empower", "investors"],
  },
  {
    id: "3",
    category: "Money Market Fund",
    question: "What is the ArvoCap Money Market Fund?",
    answer: "A low-risk investment fund that invests in short-term, high-quality securities to provide stable returns.",
    keywords: ["money market", "low risk", "stable", "fund", "returns"],
  },
  {
    id: "4", 
    category: "Thamani Equity Fund",
    question: "What is the Thamani Equity Fund?",
    answer: "An aggressive growth fund that invests in equities for capital appreciation, suitable for high-risk investors.",
    keywords: ["thamani", "equity", "aggressive", "growth", "high risk"],
  },
  {
    id: "5",
    category: "General",
    question: "How can I get started with ArvoCap?",
    answer: "Contact our team at clients@arvocap.com or call +254 701 300 200 to discuss your investment goals.",
    keywords: ["get started", "contact", "invest", "begin"],
  }
]

const quickReplies = [
  "What is ArvoCap Asset Managers?",
  "Tell me about Money Market Fund", 
  "What is Thamani Equity Fund?",
  "What are the fees?",
  "How do I get started?",
  "Contact information",
]
  
type ChatResult = { message: string; usedKnowledge: boolean; sources?: SourceRef[] }

// Simple response cache for faster repeated queries
const responseCache = new Map<string, { result: ChatResult; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const callChatGPT = async (userQuery: string, faqContext?: string): Promise<ChatResult> => {
  try {
    // Check cache first for faster responses
    const cacheKey = userQuery.toLowerCase().trim()
    const cached = responseCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("🚀 Using cached response for faster delivery")
      return cached.result
    }

    // Always try Python chatbot first (same as CLI) - bypass FAQ context
    const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || "https://eb71521c4785.ngrok-free.app"
    
    try {
      console.log("🔗 Attempting to connect to Python API:", pythonApiUrl)
      const pythonResponse = await fetch(`${pythonApiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userQuery,
          conversation_id: `web_${Date.now()}`
        }),
        // Increase timeout for tunnel connections
        signal: AbortSignal.timeout(20000)
      })

      console.log("📡 Python API response status:", pythonResponse.status)
      
      if (pythonResponse.ok) {
        const pythonData = await pythonResponse.json()
        console.log("✅ Using trained Python chatbot response:", pythonData)
        const sources: SourceRef[] | undefined = Array.isArray(pythonData.sources)
          ? pythonData.sources.map((s: any) => ({
              label: s.label || s.metadata?.title || s.metadata?.url || 'Source',
              sourceType: s.sourceType || s.metadata?.sourceType || 'document',
              url: s.metadata?.url || (typeof s.label === 'string' && s.label.startsWith('http') ? s.label : undefined),
              score: typeof s.score === 'number' ? s.score : undefined
            }))
          : undefined
        const result: ChatResult = {
          message: pythonData.response || pythonData.message || "I'm here to help with your investment questions!",
          usedKnowledge: true,
          sources
        }
        // Cache successful responses
        responseCache.set(cacheKey, { result, timestamp: Date.now() })
        return result
      } else {
        const errorText = await pythonResponse.text()
        console.warn(`Python chatbot API responded with status ${pythonResponse.status}:`, errorText)
      }
    } catch (pythonError) {
      console.warn("Python trained chatbot not available, falling back to OpenAI:", pythonError)
    }

    // Fallback to OpenAI without FAQ context - let it use vector search results only
    let enhancedContext = ""
    let hasVectorResults = false
    
    // Only search vector database if Python API failed
    try {
      const knowledgeResponse = await fetch("/api/chatbot-knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userQuery,
          maxResults: 2  // Reduce to 2 for faster response
        }),
        // Increase timeout for tunnel connections
        signal: AbortSignal.timeout(15000)
      })

      if (knowledgeResponse.ok) {
        const knowledgeData = await knowledgeResponse.json()
        if (knowledgeData.hasResults && knowledgeData.results.length > 0) {
          hasVectorResults = true
          const vectorContext = knowledgeData.results
            .map((result: any, index: number) => `${index + 1}. ${result.content}`)
            .join("\n")
          
          enhancedContext = `Knowledge Base Information:\n${vectorContext}`
        }
      }
    } catch (vectorError) {
      console.warn("Vector search unavailable:", vectorError)
    }

    // Create system prompt for OpenAI based on available context
    let systemPrompt = `You are Arvocap's investment assistant. Always respond professionally and helpfully about investment topics, portfolio management, and financial advice.`
    
    if (hasVectorResults) {
      systemPrompt = `You are Arvocap's investment assistant with access to specific knowledge about the company's investment strategies and fund performance. Use the provided knowledge base information to give detailed, accurate responses about Arvocap's offerings.`
    }

    console.log("📤 Sending to OpenAI (fallback):", {
      query: userQuery,
      hasVectorResults,
      contextLength: enhancedContext.length
    })

    systemPrompt += enhancedContext ? `\n\nContext Information: ${enhancedContext}` : ""

    // OpenAI fallback API call
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery },
          ],
          temperature: 0.2,
        }),
        // Add timeout for OpenAI fallback
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API request failed:", response.status, errorData)

        if (faqContext) {
          return { message: faqContext, usedKnowledge: hasVectorResults }
        }

        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (!data.message) {
        console.error("Invalid API response:", data)
        if (faqContext) {
          return { message: faqContext, usedKnowledge: hasVectorResults }
        }
        throw new Error("Invalid API response")
      }

      return { message: data.message, usedKnowledge: hasVectorResults }
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)
      
      if (faqContext) {
        return { message: faqContext, usedKnowledge: false }
      }

      return {
        message: "I'm temporarily having trouble processing your request. Kindly rephrase the question?",
        usedKnowledge: false,
      }
    }

  } catch (error) {
    console.error("Main chat function error:", error)
    return {
      message: "I'm temporarily having trouble processing your request. Please try again in a moment.",
      usedKnowledge: false,
    }
  }
}

export function ArvocapChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [formStep, setFormStep] = useState(0) // 0: name, 1: email, 2: issue
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    issue: ""
  })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Preload Python API connection on component mount for faster first response
  useEffect(() => {
    const preloadAPI = async () => {
      try {
        const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || "https://basics-julia-mod-billion.trycloudflare.com"
        await fetch(`${pythonApiUrl}/test`, { method: "GET", signal: AbortSignal.timeout(10000) })
        console.log("🚀 Python API preloaded for faster responses")
      } catch (error) {
        console.log("⚠️ Python API preload failed (will fallback when needed)")
      }
    }
    preloadAPI()
  }, [])

  // Generate unique ID for messages
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: "0",
        type: "bot",
        content:
          "Hello! I'm ArvoCap Asset Managers' AI assistant. I'm here to help answer your questions about our investment funds, including our Money Market Fund and Thamani Equity Fund, fees, minimum investments, and more. How can I assist you today?",
        timestamp: new Date(),
      }
      setMessages([greeting])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    // Scroll to bottom when messages change
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
      // Fallback for scroll area
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight
        }
      }
    }
    
    // Small delay to ensure DOM is updated
    setTimeout(scrollToBottom, 100)
  }, [messages, isTyping])

  const findBestMatch = (query: string): FAQ | null => {
    const queryLower = query.toLowerCase()
    console.log("Searching for:", queryLower)

    const exactMatch = faqs.find((faq) => faq.question.toLowerCase() === queryLower)
    if (exactMatch) {
      console.log("Found exact match:", exactMatch.question)
      return exactMatch
    }

    // More strict keyword matching - require at least 2 keyword matches or longer keywords
    const keywordMatches = faqs.filter((faq) => {
      const matchingKeywords = faq.keywords.filter(keyword => queryLower.includes(keyword))
      // Only match if we have 2+ keywords OR at least one keyword that's 4+ characters
      return matchingKeywords.length >= 2 || matchingKeywords.some(k => k.length >= 4)
    })

    if (keywordMatches.length > 0) {
      const bestMatch = keywordMatches.reduce((best, current) => {
        const bestMatches = best.keywords.filter((k) => queryLower.includes(k)).length
        const currentMatches = current.keywords.filter((k) => queryLower.includes(k)).length
        return currentMatches > bestMatches ? current : best
      })
      console.log("Found keyword match:", bestMatch.question)
      return bestMatch
    }

    console.log("No match found - will use OpenAI for general response")
    return null
  }

  const isGeneralQuery = (query: string): boolean => {
    const queryLower = query.toLowerCase().trim()
    
    // Check for greetings and general queries that should go to OpenAI
    const generalPatterns = [
      /^(hi|hello|hey|good morning|good afternoon|good evening)/,
      /^(how are you|what.*you|who.*you|can you help)/,
      /^(thank you|thanks|bye|goodbye)/,
      /^(what.*arvocap|tell me about|explain|describe)/,
      /^(i need|i want|i would like|i'm interested)/,
      /^(help|support|assistance)/
    ]
    
    return generalPatterns.some(pattern => pattern.test(queryLower)) || queryLower.length <= 20
  }

  const handleSendMessage = async (content: string, isQuickReply = false) => {
    if (!content.trim()) return

    // Hide any existing contact form when new message is sent
    setShowContactForm(false)
    setFormStep(0)

    const userMessage: Message = {
      id: generateUniqueId(),
      type: "user",
      content,
      timestamp: new Date(),
      isQuickReply,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Skip FAQ matching completely - always use Python chatbot (same as CLI)
  let botResponse: string | null = null
  let botSources: SourceRef[] | undefined = undefined
    let shouldShowContactForm = false

    // Always use Python chatbot directly (no FAQ interference)
    try {
  const result = await callChatGPT(content) // Remove FAQ context to get pure Python/OpenAI response
  botResponse = result.message
  botSources = result.sources
      
      // Only show contact form if the response explicitly suggests it
      if (!result.usedKnowledge && (!botResponse || botResponse.includes("connect you with") || botResponse.includes("talk to human"))) {
        shouldShowContactForm = false
        // Auto-focus input so user can continue typing
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    } catch (e) {
      console.warn("Automated response pipeline failed:", e)
      botResponse = "I'm having trouble connecting to our AI service. Please try again or use the Talk to Human button."
    }

    // Final fallback if no response
    if (!botResponse || botResponse.trim().length === 0) {
      botResponse = "I couldn't process your request right now. Please try rephrasing or use the Talk to Human button below."
      shouldShowContactForm = false
      setTimeout(() => inputRef.current?.focus(), 0)
    }

    const botMessage: Message = {
      id: generateUniqueId(),
      type: "bot",
      content: botResponse,
      timestamp: new Date(),
      sources: botSources
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)

    // Show contact form only for complex queries that need human assistance
    if (shouldShowContactForm) {
      console.log("Complex query - showing contact form in 500ms")
      setTimeout(() => {
        console.log("Setting showContactForm to true")
        setShowContactForm(true)
        setFormStep(0)
      }, 500)
    }
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply, true)
  }

  const handleConnectHuman = () => {
    setShowContactForm(true)
    const humanMessage: Message = {
      id: generateUniqueId(),
      type: "bot",
      content: "I'd be happy to connect you with one of our investment specialists. Please fill out the form below and we'll get back to you within 2 business hours.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, humanMessage])
  }

  const handleSubmitContactForm = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.issue) {
      alert("Please fill in all fields")
      return
    }

    // Show immediate success message (optimistic UI)
    const submissionMessage: Message = {
      id: generateUniqueId(),
      type: "bot",
      content: `Thank you, ${contactForm.name}! Your inquiry has been submitted successfully. Our team will contact you at ${contactForm.email} within 2 business hours regarding: "${contactForm.issue}"\n\nYou can also reach us directly at:\n📧 Email: invest@arvocap.com\n📞 Phone: +254 701 300 200\n\n✅ Your information is being saved to our secure database.`,
      timestamp: new Date(),
    }
    
    // Immediately update UI
    setMessages((prev) => [...prev, submissionMessage])
    setShowContactForm(false)
    setFormStep(0)
    
    // Store form data for background save
    const formDataToSave = { ...contactForm }
    setContactForm({ name: "", email: "", issue: "" })

    // Save to backend in background (fire and forget)
    fetch('/api/save-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formDataToSave.name,
        email: formDataToSave.email,
        issue: formDataToSave.issue,
      }),
    })
    .then(response => {
      if (response.ok) {
        console.log('✅ Contact data saved successfully in background')
        // Optionally update the last message to show data was saved
        setMessages(prev => prev.map((msg, index) => 
          index === prev.length - 1 
            ? { ...msg, content: msg.content.replace('is being saved to our secure database', 'has been securely saved to our database') }
            : msg
        ))
      } else {
        console.warn('⚠️ Background save had issues, but user already confirmed')
      }
    })
    .catch(error => {
      console.error('❌ Background save failed:', error)
      // Could optionally show a subtle notification, but don't interrupt user flow
    })
  }

  const handleNextStep = () => {
    const currentStep = formStep
    const currentValue = currentStep === 0 ? contactForm.name : currentStep === 1 ? contactForm.email : contactForm.issue
    
    if (!currentValue.trim()) {
      return // Don't proceed if current field is empty
    }

    if (formStep < 2) {
      setFormStep(formStep + 1)
    } else {
      handleSubmitContactForm()
    }
  }

  const getFormStepData = () => {
    const steps = [
      { label: "Name", placeholder: "Please enter your full name", value: contactForm.name, field: "name" },
      { label: "Email", placeholder: "Please enter your email address", value: contactForm.email, field: "email" },
      { label: "Issue/Question", placeholder: "Please describe your question or concern", value: contactForm.issue, field: "issue" }
    ]
    return steps[formStep]
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        style={{ backgroundColor: '#B78A2E', color: 'white' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#A67825'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#B78A2E'
        }}
        size="icon"
      >
        <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
      </Button>
    )
  }

  // Debug logging
  if (showContactForm) {
    console.log("Rendering contact form - showContactForm:", showContactForm, "formStep:", formStep)
  }

  return (
    <Card className="fixed bottom-3 right-3 md:bottom-6 md:right-6 w-[calc(100vw-1.5rem)] max-w-md md:w-[420px] h-[calc(100vh-2rem)] max-h-[95vh] md:h-[85vh] shadow-2xl border-0 bg-card animate-in slide-in-from-bottom-4 transition-all duration-300 z-50 flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground p-3 md:p-4 rounded-t-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center p-1">
              <Image
                src="/images/arvocap-logo.png"
                alt="Arvocap Logo"
                width={28}
                height={28}
                className="object-contain md:w-8 md:h-8"
              />
            </div>
            <div>
              <h3 className="font-semibold text-base md:text-lg">ArvoCap Assistant</h3>
              <p className="text-xs md:text-sm text-primary-foreground/80">Licensed Asset Managers</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 p-0 text-lg md:text-xl"
          >
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1 min-h-0">
        <ScrollArea className="flex-1 p-3 md:p-4 min-h-0" ref={scrollAreaRef}>
          <div className="space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div
                  className={`flex gap-2 md:gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "bot" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[calc(100%-3rem)] md:max-w-[280px] p-2 md:p-3 rounded-lg whitespace-pre-line text-sm md:text-base ${
                      message.type === "user"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.content}
                    {/* Add inline reference links for websites only */}
                    {message.type === 'bot' && message.sources && message.sources.length > 0 && 
                      message.sources
                        .filter((s: SourceRef) => s.sourceType === 'webpage' && s.url)
                        .map((source: SourceRef, idx: number) => {
                          const refNumber = idx + 1;
                          return (
                            <span key={idx}>
                              {' '}
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                                title={source.label}
                              >
                                [{refNumber}]
                              </a>
                            </span>
                          );
                        })
                    }
                  </div>
                  {message.type === "user" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 md:h-4 md:w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 md:gap-3 justify-start">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted text-muted-foreground p-2 md:p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce typing-dot delay-0" />
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce typing-dot delay-150" />
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce typing-dot delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Contact Form */}
          {showContactForm && (
            <div className="p-4 bg-muted/50 border rounded-lg mx-3 mb-3">
              <h4 className="font-semibold text-sm mb-3">Contact Our Team - Step {formStep + 1} of 3</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {getFormStepData().label}
                  </label>
                  <Input
                    type={formStep === 1 ? "email" : "text"}
                    placeholder={getFormStepData().placeholder}
                    value={getFormStepData().value}
                    onChange={(e) => {
                      const field = getFormStepData().field as keyof typeof contactForm
                      setContactForm(prev => ({...prev, [field]: e.target.value}))
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleNextStep()}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleNextStep}
                    size="sm"
                    className="flex-1 h-8"
                    disabled={!getFormStepData().value.trim()}
                  >
                    {formStep === 2 ? "Submit" : "Next"}
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowContactForm(false)
                      setFormStep(0)
                      setContactForm({ name: "", email: "", issue: "" })
                    }}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Invisible div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {messages.length === 1 && (
          <div className="p-3 md:p-4 border-t bg-muted/30 flex-shrink-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 font-medium">Quick questions:</p>
            <div className="flex flex-wrap gap-1 md:gap-2">
              {quickReplies.map((reply, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors text-xs py-1 px-2 leading-tight"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 md:p-4 border-t bg-background flex-shrink-0">
          <div className="flex gap-2 mb-2 md:mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectHuman}
              className="text-xs flex items-center gap-1 bg-transparent h-8"
            >
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">Talk to Human</span>
              <span className="sm:hidden">Human</span>
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              className="flex-1 text-sm md:text-base h-9 md:h-10"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="bg-primary hover:bg-primary/90 h-9 w-9 md:h-10 md:w-10 flex-shrink-0"
            >
              <Send className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>

          <div className="text-center mt-2 md:mt-3">
            <p className="text-xs text-muted-foreground">
              powered by{" "}
              <a
                href="https://iqbalagency.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                IQBAL AGENCY
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
