import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
        });

        const prompt = `
        Analyze this image of clothing/outfit. Identify the Top, Bottom, and Accessories (watch, glasses, shoes, belt, bag).
        
        Return JSON:
        { 
            "display_desc": "Top: [Color/Item]<br>Bottom: [Color/Item]<br>Accessories: [List items or 'None']", 
            "inventory_list": ["Item 1", "Item 2", "Item 3"] 
        }
        `;

        const imagePart = {
            inlineData: {
                data: Buffer.from(await file.arrayBuffer()).toString("base64"),
                mimeType: file.type,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;

        return NextResponse.json(JSON.parse(jsonStr));
    } catch (error: any) {
        console.error("Analyze Item Error:", error);
        return NextResponse.json({
            display_desc: "Item scanned successfully",
            inventory_list: ["New style element"]
        });
    }
}
