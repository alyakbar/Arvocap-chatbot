"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, User, Bot, Phone } from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isQuickReply?: boolean
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
    category: "Company Overview",
    question: "What is ArvoCap's vision?",
    answer: "To leverage technology and market insights to deliver client-centered investment outcomes.",
    keywords: ["vision", "technology", "market insights", "client-centered"],
  },
  {
    id: "4",
    category: "Company Overview",
    question: "What are ArvoCap's values?",
    answer: "Integrity, innovation, and collaboration.",
    keywords: ["values", "integrity", "innovation", "collaboration"],
  },
  {
    id: "5",
    category: "Company Overview",
    question: "Where is ArvoCap's office located?",
    answer: "Reliable Towers, 8th Floor – Wing B, Mogotio Road, Westlands, Nairobi, Kenya.",
    keywords: ["office", "location", "address", "nairobi", "westlands", "reliable towers"],
  },
  {
    id: "6",
    category: "Support & Contact",
    question: "How can I contact ArvoCap?",
    answer: "Phone: +254 701 300 200 | Email: invest@arvocap.com | Website: www.arvocap.com",
    keywords: ["contact", "phone", "email", "website", "reach", "support"],
  },
  {
    id: "7",
    category: "Company Overview",
    question: "Who are ArvoCap's custodians and trustees?",
    answer: "NCBA Bank Kenya PLC.",
    keywords: ["custodian", "trustee", "ncba", "bank"],
  },
  {
    id: "8",
    category: "Company Overview",
    question: "Who audits ArvoCap's funds?",
    answer: "King'ori Kamau & Company (CPAK).",
    keywords: ["audit", "auditor", "kingori", "kamau", "cpak"],
  },
  {
    id: "9",
    category: "Company Overview",
    question: "Does ArvoCap have an app?",
    answer:
      "Yes. The ArvoCap Investment App allows you to manage investments, track performance, and make financial decisions easily.",
    keywords: ["app", "mobile", "investment app", "track", "performance"],
  },
  {
    id: "10",
    category: "Company Overview",
    question: "Is ArvoCap regulated?",
    answer: "Yes. ArvoCap Asset Managers Ltd is licensed and regulated by the CMA (Kenya).",
    keywords: ["regulated", "licensed", "cma", "capital markets authority"],
  },
  {
    id: "11",
    category: "Company Overview",
    question: "Does past performance guarantee future returns?",
    answer:
      "No. Past performance is not necessarily a guide to future performance. Investors may not recover the full amount invested.",
    keywords: ["past performance", "future returns", "guarantee", "risk", "disclaimer"],
  },

  // Money Market Fund
  {
    id: "12",
    category: "Money Market Fund",
    question: "What is the ArvoCap Money Market Fund?",
    answer:
      "It is a low-risk collective investment scheme (unit trust) that invests in short-term government securities, treasury bills, corporate bonds, and deposits. It provides higher returns than a bank savings account while ensuring liquidity and capital preservation.",
    keywords: ["money market fund", "mmf", "low risk", "unit trust", "government securities", "treasury bills"],
  },
  {
    id: "13",
    category: "Money Market Fund",
    question: "When was the Money Market Fund launched?",
    answer: "June 3, 2024.",
    keywords: ["launched", "launch date", "money market", "june 2024"],
  },
  {
    id: "14",
    category: "Money Market Fund",
    question: "What is the minimum investment in the Money Market Fund?",
    answer: "KES 3,000 minimum; top-ups from KES 1,000.",
    keywords: ["minimum investment", "money market", "kes 3000", "top up", "minimum"],
  },
  {
    id: "15",
    category: "Money Market Fund",
    question: "What is the fund's risk category?",
    answer: "Category 1 (lowest risk level on the SRRI scale 1–7).",
    keywords: ["risk category", "category 1", "srri", "lowest risk", "money market"],
  },
  {
    id: "16",
    category: "Money Market Fund",
    question: "What are the fees for the Money Market Fund?",
    answer: "Management fee: 2% per year. No entry or exit fees. No performance fees.",
    keywords: ["fees", "management fee", "2%", "no entry fee", "no exit fee", "money market"],
  },
  {
    id: "17",
    category: "Money Market Fund",
    question: "What were the monthly returns in 2024?",
    answer: "June 16.2%, July 16.9%, August 17.2%, September 16.8%, October 16.7%, November 16.5%, December 15.32%.",
    keywords: ["returns", "2024", "monthly returns", "performance", "16%", "money market"],
  },
  {
    id: "18",
    category: "Money Market Fund",
    question: "What was the average return of the fund in 2024?",
    answer: "The average effective annual yield for the first 7 months was 16.5% (net of fees).",
    keywords: ["average return", "16.5%", "annual yield", "2024", "net of fees"],
  },
  {
    id: "19",
    category: "Money Market Fund",
    question: "What is the fund's asset allocation?",
    answer: "Government Securities 18.39%, Term & Call Deposits 80.16%, Cash 1.45%.",
    keywords: ["asset allocation", "government securities", "deposits", "cash", "allocation"],
  },
  {
    id: "20",
    category: "Money Market Fund",
    question: "What is the current AUM?",
    answer: "The Unit Trust AUM was KES 550.33 million as of December 2024.",
    keywords: ["aum", "assets under management", "550 million", "december 2024"],
  },

  // Thamani Equity Fund
  {
    id: "21",
    category: "Thamani Equity Fund",
    question: "What is the ArvoCap Thamani Equity Fund?",
    answer:
      "It is a CMA-regulated collective investment scheme (unit trust) that invests mainly in equities for capital growth. It is sometimes referred to as 'ArvoCap Thamani' or simply 'Thamani Fund'.",
    keywords: ["thamani", "equity fund", "equities", "capital growth", "unit trust"],
  },
  {
    id: "22",
    category: "Thamani Equity Fund",
    question: "What is the investment objective of the Thamani Fund?",
    answer:
      "To achieve above-market risk-adjusted returns through investing in high-value, liquid stocks tracked by the NSE 25 Index, with a mid-to-long-term capital growth view.",
    keywords: ["investment objective", "above-market returns", "nse 25", "capital growth", "thamani"],
  },
  {
    id: "23",
    category: "Thamani Equity Fund",
    question: "What is the fund's investment strategy?",
    answer: "Active equity allocation with tactical positioning, hedging using single stock and equity index futures.",
    keywords: ["investment strategy", "active equity", "tactical positioning", "hedging", "futures"],
  },
  {
    id: "24",
    category: "Thamani Equity Fund",
    question: "What is the benchmark for the Thamani Fund?",
    answer: "NSE 25 Index.",
    keywords: ["benchmark", "nse 25", "index", "thamani"],
  },
  {
    id: "25",
    category: "Thamani Equity Fund",
    question: "What does the Thamani Fund invest in?",
    answer:
      "Listed NSE equities (60–100%, target 80%), Cash & equivalents (0–100%, target 10%), Derivatives (0–20%, target 10%).",
    keywords: ["investment allocation", "nse equities", "cash", "derivatives", "80%", "thamani"],
  },
  {
    id: "26",
    category: "Thamani Equity Fund",
    question: "What is the minimum investment in the Thamani Fund?",
    answer: "KES 100,000 initial and KES 100,000 top-up.",
    keywords: ["minimum investment", "kes 100000", "initial", "top up", "thamani"],
  },
  {
    id: "27",
    category: "Thamani Equity Fund",
    question: "Is there a lock-in period for the Thamani Fund?",
    answer: "Yes, 6 months for all new investments.",
    keywords: ["lock-in period", "6 months", "lock in", "thamani"],
  },
  {
    id: "28",
    category: "Thamani Equity Fund",
    question: "What is the risk profile of the Thamani Fund?",
    answer: "Aggressive – suitable for investors seeking high returns with significant market risk.",
    keywords: ["risk profile", "aggressive", "high returns", "market risk", "thamani"],
  },
  {
    id: "29",
    category: "Thamani Equity Fund",
    question: "What fees apply to the Thamani Fund?",
    answer:
      "Initial fee: 0.5% upfront. Annual management fee: 2.0% of average AUM (daily prorated, payable quarterly). Performance fee: 20% of annual net returns (only if positive).",
    keywords: ["fees", "0.5%", "2%", "20%", "management fee", "performance fee", "thamani"],
  },

  // General Investor Info
  {
    id: "30",
    category: "General Investor Info",
    question: "How does ArvoCap tailor strategies to individual needs?",
    answer:
      "Through investor profiling and personalized portfolio construction based on goals, risk preferences, and financial history.",
    keywords: ["tailor", "personalized", "investor profiling", "portfolio construction", "individual needs"],
  },
  {
    id: "31",
    category: "General Investor Info",
    question: "How does ArvoCap address market volatility and risk?",
    answer: "Through diversification, derivatives hedging (e.g., in Thamani Fund), and stress simulations.",
    keywords: ["market volatility", "risk management", "diversification", "hedging", "stress simulations"],
  },
  {
    id: "32",
    category: "General Investor Info",
    question: "How can I monitor my investments?",
    answer: "Via monthly fact sheets, performance reports, and real-time dashboards on digital portals.",
    keywords: ["monitor", "fact sheets", "performance reports", "dashboards", "digital portals"],
  },
  {
    id: "33",
    category: "General Investor Info",
    question: "Can I schedule a consultation with ArvoCap?",
    answer: "Yes. Consultations can be booked through the website or contact channels.",
    keywords: ["consultation", "schedule", "book", "meeting", "appointment"],
  },
  {
    id: "34",
    category: "General Investor Info",
    question: "What sets ArvoCap apart from competitors?",
    answer: "Bespoke strategies, advanced analytics, diversified sub-funds, and regulatory compliance.",
    keywords: ["competitive advantage", "bespoke", "advanced analytics", "diversified", "compliance"],
  },

  // Funds Overview
  {
    id: "35",
    category: "Funds Overview",
    question: "How many funds does ArvoCap have?",
    answer: "ArvoCap manages 10 funds under its Unit Trust Scheme, approved by the Capital Markets Authority (CMA).",
    keywords: ["funds", "10 funds", "unit trust", "cma approved", "how many"],
  },
  {
    id: "36",
    category: "Fixed Income Funds",
    question: "What is the ArvoCap Ngao Fixed Income Distribution Fund?",
    answer: "It invests in government and corporate bonds and pays investors regular income distributions.",
    keywords: ["ngao", "fixed income", "distribution", "bonds", "regular income"],
  },
  {
    id: "37",
    category: "Fixed Income Funds",
    question: "What is the ArvoCap Almasi Fixed Income Accumulation Fund?",
    answer: "It invests in bonds, but instead of paying out income, it reinvests earnings to compound over time.",
    keywords: ["almasi", "fixed income", "accumulation", "bonds", "compound", "reinvest"],
  },
  {
    id: "38",
    category: "Special Funds",
    question: "What is the ArvoCap Eurofix Fixed Income Special Fund?",
    answer:
      "A USD-denominated fund investing in fixed income assets. It provides currency diversification and hedges against KES volatility.",
    keywords: ["eurofix", "usd", "fixed income", "currency diversification", "kes volatility"],
  },
  {
    id: "39",
    category: "Equity Funds",
    question: "What is the ArvoCap Africa Equity Special Fund?",
    answer: "It invests in Pan-African equities, providing exposure to growth opportunities across the continent.",
    keywords: ["africa equity", "pan-african", "equities", "continent", "growth opportunities"],
  },
  {
    id: "40",
    category: "Equity Funds",
    question: "What is the ArvoCap Global Equity Special Fund?",
    answer: "It invests in global equities, offering investors access to developed and emerging international markets.",
    keywords: ["global equity", "international markets", "developed", "emerging", "global"],
  },
  {
    id: "41",
    category: "Special Funds",
    question: "What is the ArvoCap Multi-Asset Strategy Special Fund?",
    answer: "A USD fund that mixes equities, bonds, and alternatives to balance risk and returns.",
    keywords: ["multi-asset", "usd fund", "equities", "bonds", "alternatives", "balance risk"],
  },
  {
    id: "42",
    category: "Sharia Funds",
    question: "What is the ArvoCap Global Sharia Equity Special Fund?",
    answer: "A USD-denominated fund that invests in Shariah-compliant global equities, aligned with Islamic finance.",
    keywords: ["global sharia", "usd", "shariah-compliant", "islamic finance", "global equities"],
  },
  {
    id: "43",
    category: "Sharia Funds",
    question: "What is the ArvoCap Mabruk Sharia Special Fund?",
    answer: "A Kenya Shariah-compliant fund offering ethical investments in the local market.",
    keywords: ["mabruk", "sharia", "kenya", "ethical investments", "local market"],
  },
]

const quickReplies = [
  "What is ArvoCap Asset Managers?",
  "Tell me about Money Market Fund",
  "What is Thamani Equity Fund?",
  "What are the fees?",
  "How do I get started?",
  "Contact information",
]

const callChatGPT = async (userQuery: string, faqContext?: string): Promise<string> => {
  try {
    const systemPrompt = `You are ArvoCap Asset Managers' official AI assistant. You respond in a professional, premium, and reassuring tone that reflects our brand as a leading licensed asset management firm in Kenya. You prioritize clarity, accuracy, and trustworthiness in all responses. 

Key guidelines:
- Always maintain a professional, client-focused approach suitable for investment services
- Keep responses concise but informative (2-4 sentences)
- Use bullet points for step-by-step instructions when appropriate
- If you're unsure about specific financial details, politely state that you'll connect the user with a human representative
- Never hallucinate financial advice, specific returns, or investment recommendations beyond what's in our FAQ
- Always redirect complex investment inquiries or specific financial advice to human representatives
- Remember we offer Money Market Fund (low-risk, 16.5% average returns) and Thamani Equity Fund (aggressive growth)
- We are regulated by CMA Kenya, license number 190

${faqContext ? `Context from our FAQ: ${faqContext}` : ""}`

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
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("API request failed:", response.status, errorData)

      if (faqContext) {
        return faqContext
      }

      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (!data.message) {
      console.error("Invalid API response:", data)
      if (faqContext) {
        return faqContext
      }
      throw new Error("Invalid API response")
    }

    return data.message
  } catch (error) {
    console.error("ChatGPT API error:", error)

    if (faqContext) {
      return faqContext
    }

    return "I apologize, but I'm having trouble accessing my enhanced responses right now. However, I can still help you with questions about our investment funds, fees, and services. Could you please rephrase your question or try asking about our Money Market Fund or Thamani Equity Fund?"
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

    console.log("No match found - will show contact form")
    return null
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

    const matchedFAQ = findBestMatch(content)
    let botResponse: string

    if (matchedFAQ) {
      botResponse = await callChatGPT(content, matchedFAQ.answer)
    } else {
      // No FAQ match found - show contact form
      botResponse = "I don't have specific information about that question in my knowledge base. Let me help you connect with our investment specialists who can provide you with detailed assistance. Please fill out the form below:"
    }

    const botMessage: Message = {
      id: generateUniqueId(),
      type: "bot",
      content: botResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)

    // Show contact form after bot message if no FAQ match
    if (!matchedFAQ) {
      console.log("No FAQ match - showing contact form in 500ms")
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
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 z-50"
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
    <Card className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] max-w-sm md:w-96 h-[calc(100vh-1rem)] max-h-[90vh] md:h-[700px] shadow-2xl border-0 bg-card animate-in slide-in-from-bottom-4 duration-300 z-50 flex flex-col">
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
              <div
                key={message.id}
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
                </div>
                {message.type === "user" && (
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3 md:h-4 md:w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 md:gap-3 justify-start">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted text-muted-foreground p-2 md:p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
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
