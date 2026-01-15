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
            "works": "One specific sentence on what works well (e.g. 'Your strong jawline suits structured collars').",
            "tweaks": "One specific small tweak to improve (e.g. 'Avoid round necklines to balance your face shape').",
            "grooming": "Brief grooming tip.",
            "accessories": "Brief accessory tip.",
            "posture": "Brief posture observation."
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
