import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Types
interface ProductMatch {
  id: string;
  reason: string;
}

interface RequestBody {
  products: any[];
  userRequirements: string;
}

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: Request) {
  try {
    // Input validation
    const body = await request.json() as RequestBody;
    if (!body.products || !Array.isArray(body.products) || !body.userRequirements) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Structure prompt
    const prompt = `
      Task: Analyze properties and match user requirements.
      Properties: ${JSON.stringify(body.products)}
      Requirements: ${body.userRequirements}
      
      Instructions:
      1. Consider price, location, features, and amenities
      2. Return only properties that closely match requirements
      3. Provide brief explanation for each match
      
      Response format (strict JSON array):
      [{"id": "propertyId", "reason": "explanation"}]
      
      Maximum 5 matches.
    `;

    // Generate response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Validate response
    let matches: ProductMatch[];
    try {
      matches = JSON.parse(text);
      if (!Array.isArray(matches) || !matches.every(m => m.id && m.reason)) {
        throw new Error("Invalid response format");
      }
    } catch {
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }

    return NextResponse.json({ matches });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" }, 
      { status: 500 }
    );
  }
}