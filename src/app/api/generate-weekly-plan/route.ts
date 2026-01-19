import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { context } = await req.json();

        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
        });

        const prompt = `
        Act as a fashion stylist. Create a 5-day weekly outfit plan (Monday to Friday) for someone with this style DNA: "${context || "Normal stylish aesthetic"}".
        
        For each day, provide:
        1. A catchy 'title' for the look.
        2. A 'desc' describing the clothing items (e.g., 'Navy chinos paired with a beige linen shirt').
        
        Return strictly valid JSON in this format:
        {
            "week": [
                { "day": "Monday", "title": "Outfit Title", "desc": "Detailed clothing description..." },
                { "day": "Tuesday", "title": "Outfit Title", "desc": "Detailed clothing description..." },
                { "day": "Wednesday", "title": "Outfit Title", "desc": "Detailed clothing description..." },
                { "day": "Thursday", "title": "Outfit Title", "desc": "Detailed clothing description..." },
                { "day": "Friday", "title": "Outfit Title", "desc": "Detailed clothing description..." }
            ]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Find JSON block if it's wrapped in markdown
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;

        return NextResponse.json(JSON.parse(jsonStr));
    } catch (error: any) {
        console.error("Weekly Plan Error:", error);
        return NextResponse.json({
            week: [
                { day: "Monday", title: "Smart Casual", desc: "Navy chinos and a light blue shirt." },
                { day: "Tuesday", title: "Business Professional", desc: "Grey suit trousers and a white textured shirt." },
                { day: "Wednesday", title: "Mid-week Relaxed", desc: "Dark wash denim and a beige polo." },
                { day: "Thursday", title: "Creative Professional", desc: "Black trousers and a patterned button-down." },
                { day: "Friday", title: "Weekend Ready", desc: "Olive chinos and a casual cream t-shirt." }
            ]
        });
    }
}
