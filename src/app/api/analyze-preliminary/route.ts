import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        Analyze these photos for a quick stylist check. Return valid JSON:
        {
            "works": "Minimum 2 specific sentences on what works well. You MUST analyze all layers of clothes present (Top, Bottom, Outerwear/Layers).",
            "tweaks": "Minimum 2 specific sentences on small tweaks to improve the look or fit.",
            "grooming": "Minimum 2 sentences or tips regarding grooming tailored to the user's appearance.",
            "accessories": "Minimum 2 sentences suggesting specific accessories to enhance the outfit.",
            "posture": "Minimum 2 sentences regarding posture and how it affects their style presence."
        }
        `;

        const contents: any[] = [{ text: prompt }];
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            contents.push({
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: file.type,
                },
            });
        }

        const result = await model.generateContent({ contents: [{ role: "user", parts: contents }] });
        const response = await result.response;
        return NextResponse.json(JSON.parse(response.text()));
    } catch (error: any) {
        console.error("Preliminary Analysis Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
