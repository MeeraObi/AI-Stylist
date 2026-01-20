import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { context, lookDescription, activeTab } = await req.json();
        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
        });

        // Use the specific look description if available to narrow down the search
        const specificLook = lookDescription ? `
        FOCUS specifically on this look description: "${lookDescription}".
        Ensure all items suggested MATCH this description perfectly.
        ` : `Context: "${context || "Normal stylish aesthetic"}"`;

        const prompt = `
        Act as a personal shopper for the Indian market (Myntra, Ajio, Amazon).
        ${specificLook}
        
        Create 3 DISTINCT complete outfits (Work, Casual, Social).
        
        IMPORTANT: For "Work", "Casual", and "Social", YOU MUST PROVIDE A LIST OF ITEMS THAT FORM A COMPLETE OUTFIT including ALL LAYERS.
        Include: Top (Shirt/Blouse), Bottom (Pants/Skirt), Outerwear (Blazer/Jacket/Cardigan if applicable), Shoes, and Accessories.
        
        Return STRICT JSON format with categories as keys:
        {
            "Work": [ 
                { "name": "Specific Item Name", "store": "Myntra/Ajio/Amazon", "price": "₹1500-3000" },
                ... (at least 4-5 items per look)
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
