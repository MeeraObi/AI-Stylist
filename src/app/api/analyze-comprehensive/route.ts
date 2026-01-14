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
        Analyze these user photos. Return detailed JSON:
        {
            "profile_writeup": {
                "summary": "200 words on style vibe"
            },
            "first_looks": {
                "work": "Specific outfit description for work.",
                "travel": "Specific outfit description for travel.",
                "social": "Specific outfit description for social events."
            },
            "physical_desc": "Visual description of face/body for image gen (e.g. 'Male, short beard, square face, medium build')"
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
        console.error("Comprehensive Analysis Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
