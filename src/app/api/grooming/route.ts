import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { desc } = await req.json();

        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        Act as a grooming expert. Based on this visual description: "${desc || "General features"}", provide:
        1. A specific tip for their Face Shape/Beard/Hair.
        2. Specific product categories.
        Return JSON: { "tip": "Your tip here.", "products": ["Product 1", "Product 2"] }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return NextResponse.json(JSON.parse(response.text()));
    } catch (error: any) {
        console.error("Grooming Error:", error);
        return NextResponse.json({
            tip: "Maintain a consistent grooming routine and stay hydrated.",
            products: ["Moisturizer", "Face Wash", "Hair Gel"]
        });
    }
}
