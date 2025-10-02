"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm DOLT's virtual assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const phoneNumber = "5491112345678" // WhatsApp number in international format
  const message = "Hello! I'm interested in DOLT's maintenance services."

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
    setIsOpen(false) // Optionally close chat after opening WhatsApp
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response (frontend only - no actual AI integration)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("service") || input.includes("book")) {
      return "You can book our services by visiting the Services page. We offer HVAC, plumbing, electrical, and IoT installation services."
    } else if (input.includes("price") || input.includes("cost")) {
      return "Our services range from $100 to $250 depending on the type. Visit our Services page for detailed pricing."
    } else if (input.includes("contact") || input.includes("phone") || input.includes("email")) {
      return "You can reach us at contact@dolt.com or call +54 11 1234-5678. We're available 24/7!"
    } else if (input.includes("location") || input.includes("area")) {
      return "We serve major cities across Latin America, including Argentina, Brazil, Chile, and Colombia."
    } else {
      return "I'm here to help! You can ask me about our services, pricing, contact information, or service areas."
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FF6B35] text-white rounded-full shadow-lg hover:bg-[#ff5722] transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#FF6B35] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">DOLT Assistant</h3>
                <p className="text-xs text-white/80">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* WhatsApp Button in Header */}
              <button
                onClick={openWhatsApp}
                className="hover:bg-white/40 rounded-full p-2 transition-colors"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5 text-green-500" />
              </button>
              {/* Close Button */}
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === "user" ? "bg-[#FF6B35] text-white" : "bg-neutral-100 text-neutral-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none text-sm"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-[#FF6B35] text-white rounded-full flex items-center justify-center hover:bg-[#ff5722] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}