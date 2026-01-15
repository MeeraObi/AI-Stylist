import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { context } = await req.json();
        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        Act as a personal shopper for the Indian market (Myntra, Ajio, Amazon).
        The user is interested in this style context: "${context || "Fashion"}".
        
        TASK: Identify the 4 most important VISIBLE CLOTHING items to recreate this look.
        
        PRIORITY ORDER (Select 4):
        1. Outerwear (Jacket, Blazer, Coat) - If present, this is priority #1.
        2. Tops (Shirt, T-shirt, Polo)
        3. Bottoms (Trousers, Jeans, Chinos)
        4. Footwear (Shoes, Sneakers, Loafers)
        5. Accessories (Only include if there are fewer than 4 clothing items).

        RULES:
        - Match colors EXACTLY (e.g., if description says 'Navy shirt', search 'Navy Blue Shirt').
        - Be specific on fit (e.g., 'Slim fit', 'Oversized').
        
        Return JSON: 
        { 
            "results": [ 
                { "name": "Specific Item Name", "store": "Myntra/Ajio/Amazon", "price": "₹1500-3000" }
            ] 
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json(JSON.parse(text));
    } catch (error: any) {
        console.error("Shop India Error:", error);
        return NextResponse.json({
            results: [
                { name: "Premium Slim Fit Blazer", store: "Myntra", price: "₹2,999" },
                { name: "Oxford Button-Down Shirt", store: "Ajio", price: "₹1,499" },
                { name: "Tailored Chino Trousers", store: "Myntra", price: "₹1,899" },
                { name: "Classic Urban Sneakers", store: "Amazon", price: "₹2,499" }
            ]
        });
    }
}
