import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { context } = await req.json();
        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
        });

        const prompt = `
        Act as a personal shopper for the Indian market (Myntra, Ajio, Amazon).
        Context: "${context || "Normal stylish aesthetic"}".
        
        Create 3 DISTINCT complete outfits (Work, Casual, Social).
        For each category, identify 3 key items (Top, Bottom, Accessories).
        
        Return STRICT JSON format with categories as keys:
        {
            "Work": [ 
                { "name": "Specific Item Name", "store": "Myntra/Ajio/Amazon", "price": "₹1500-3000" },
                ... (3 items)
            ],
            "Casual": [ ... ],
            "Social": [ ... ]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;

        return NextResponse.json(JSON.parse(jsonStr));
    } catch (error: any) {
        console.error("Shop India Error:", error);
        return NextResponse.json({
            Work: [
                { name: "Premium Slim Fit Blazer", store: "Myntra", price: "₹2,999" },
                { name: "Oxford Button-Down Shirt", store: "Ajio", price: "₹1,499" },
                { name: "Tailored Chino Trousers", store: "Myntra", price: "₹1,899" }
            ],
            Casual: [
                { name: "Organic Cotton Tee", store: "Myntra", price: "₹899" },
                { name: "Relaxed Fit Cargo Pants", store: "Amazon", price: "₹1,299" },
                { name: "Classic Urban Sneakers", store: "Amazon", price: "₹2,499" }
            ],
            Social: [
                { name: "Linen Party Shirt", store: "Ajio", price: "₹1,699" },
                { name: "Dark Wash Stretch Denim", store: "Myntra", price: "₹2,299" },
                { name: "Leather Chelsea Boots", store: "Ajio", price: "₹3,499" }
            ]
        });
    }
}
