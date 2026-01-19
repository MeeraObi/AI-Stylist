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
            "works": "For Top, Bottom, and Layers (if any), write ONE concise phrase (max 4 words) if it looks good. Join with periods. Example: 'Great Top Fit. Perfect Jeans Length.'",
            "tweaks": "For Top, Bottom, and Layers (if any), write ONE concise phrase (max 4 words) if it needs a tweak. Join with periods. Example: 'Tuck in Shirt. Pants too long.'",
            "grooming": "Provide detailed advice (minimum 3 sentences) regarding grooming tailored to the user's appearance.",
            "accessories": "Provide detailed suggestions (minimum 3 sentences) for specific accessories to enhance the outfit.",
            "posture": "Provide detailed observations and advice (minimum 3 sentences) regarding posture."
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
