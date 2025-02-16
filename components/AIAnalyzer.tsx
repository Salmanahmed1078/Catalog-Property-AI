"use client"

import { useState } from "react"
import type { Product } from "@/types/product"
import { Loader2, Bot, Search, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface AIAnalyzerProps {
  products: Product[]
  onClose: () => void
  currentFilters: Record<string, unknown>
  onUpdateFilters: (filters: Record<string, unknown>) => void
}

interface AnalysisMatch {
  id: string
  reason: string
  confidence: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIAnalyzer({ products }: AIAnalyzerProps) {
  const [userRequirements, setUserRequirements] = useState("")
  const [matches, setMatches] = useState<AnalysisMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [contextProperties, setContextProperties] = useState<Product[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const analyzeProducts = async () => {
    if (!userRequirements.trim()) {
      setError("Please describe what you're looking for")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Add user message to chat history
      const newMessage: Message = {
        role: 'user',
        content: userRequirements
      }
      
      const updatedHistory = [...chatHistory, newMessage]
      setChatHistory(updatedHistory)

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          products, 
          userRequirements,
          chatHistory: updatedHistory,
          contextProperties
        }),
      })

      if (!response.ok) throw new Error("Analysis request failed")

      const data = await response.json()
      if (!data.matches && !data.response) throw new Error("Invalid response format")

      if (data.matches) {
        setMatches(data.matches)
        setContextProperties(data.matches.map(match => 
          products.find(p => p.id === match.id)
        ).filter(Boolean))
      }

      if (data.response) {
        setChatHistory([...updatedHistory, {
          role: 'assistant',
          content: data.response
        }])
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      setError(error instanceof Error ? error.message : "Analysis failed")
    } finally {
      setLoading(false)
      setUserRequirements("")
    }
  }

  const copyPropertyDetails = (property: Product, match: AnalysisMatch) => {
    const details = `Property: ${property.name}
Price: $${property.price.toLocaleString()}
Details: ${match.reason}
${property.tags ? `Features: ${property.tags.join(', ')}` : ''}`

    navigator.clipboard.writeText(details)
    setCopiedId(property.id)
    setUserRequirements(details)

    // Reset copy icon after 2 seconds
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const examples = [
    "I'm looking for a modern apartment in the city center with a budget of $300,000",
    "Find me a family home with at least 3 bedrooms and a garden",
    "Show me luxury properties with ocean views and a pool",
  ]

  return (
    <div className="space-y-6 p-4 w-full max-w-[600px] mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Example Queries:</label>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setUserRequirements(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {chatHistory.length > 0 && (
            <div className="space-y-4 mb-4">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-100 ml-auto max-w-[80%]' 
                      : 'bg-gray-100 mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          )}

          <Textarea
            value={userRequirements}
            onChange={(e) => setUserRequirements(e.target.value)}
            placeholder={
              chatHistory.length > 0
                ? "Ask a follow-up question about the properties..."
                : "Describe your ideal property... (e.g., 'I want a modern 3-bedroom house near the city center with a garden, budget around $500,000')"
            }
            className="min-h-[120px] resize-none"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={analyzeProducts}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {chatHistory.length > 0 ? "Processing..." : "Analyzing..."}
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                {chatHistory.length > 0 ? "Send Message" : "Find Matching Properties"}
              </>
            )}
          </Button>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Search className="h-4 w-4" />
            Recommended Properties
          </h3>
          <div className="space-y-4">
            {matches.map((match) => {
              const property = products.find((p) => p.id === match.id)
              if (!property) return null

              return (
                <Card key={match.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-semibold text-lg">{property.name}</h4>
                        <button
                          onClick={() => copyPropertyDetails(property, match)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          title="Copy property details to ask questions"
                        >
                          {copiedId === property.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">{match.reason}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">${property.price.toLocaleString()}</Badge>
                        {property.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link 
                      href={`/properties/${property.id}`} 
                      className="block p-2 text-center text-sm text-blue-600 hover:bg-gray-50 border-t"
                    >
                      View Full Details
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

