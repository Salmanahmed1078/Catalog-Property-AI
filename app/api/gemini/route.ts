import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { Product } from "@/types/product";

// Types
interface ProductMatch {
  id: string;
  reason: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  products: Product[];
  userRequirements: string;
  chatHistory: Message[];
  contextProperties: Product[];
}

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { products, userRequirements, chatHistory, contextProperties } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // If this is the first message (no chat history), perform property search
    if (chatHistory.length <= 1) {
      const prompt = `You are a real estate expert. Analyze these properties and find matches based on the user's requirements. 
      Return exactly 3 best matching properties if possible.
      
      User Requirements: ${userRequirements}

      Available Properties:
      ${JSON.stringify(products, null, 2)}

      Return the response in the following JSON format:
      {
        "matches": [
          {
            "id": "property_id",
            "reason": "Explanation of why this property matches",
            "confidence": 0.95
          }
        ]
      }
      
      Only return the JSON, no other text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const matches = JSON.parse(text).matches;

      return NextResponse.json({ matches });
    } 
    // For follow-up questions, provide conversational responses
    else {
      const contextPropertiesInfo = contextProperties.map(prop => 
        `Property ${prop.id}: ${prop.name} - Price: $${prop.price} - ${prop.description || ''}`
      ).join('\n');

      const prompt = `You are a helpful real estate expert assistant. Use the following context to answer the user's question.
      
      Context Properties:
      ${contextPropertiesInfo}

      Previous Conversation:
      ${chatHistory.slice(0, -1).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

      Current Question: ${userRequirements}

      Provide a helpful, natural response about the properties in context. If the question is about properties not in context,
      politely ask the user to start a new property search with their requirements.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return NextResponse.json({ 
        response: response.text()
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}