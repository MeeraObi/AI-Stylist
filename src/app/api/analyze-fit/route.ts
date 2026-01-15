import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        Analyze this mirror selfie of a person's outfit.
        1. Verdict: 'Good to go' or 'Needs adjustment'.
        2. Reason: Specifically mention fit, color match, or proportions.
        Return JSON: { "verdict": "Good to go", "reason": "The shoulder fit is perfect and colors match well." }
        `;

        const buffer = Buffer.from(await file.arrayBuffer());
        const contents = [
            { text: prompt },
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: file.type,
                },
            }
        ];

        const result = await model.generateContent({ contents: [{ role: "user", parts: contents }] });
        const response = await result.response;
        return NextResponse.json(JSON.parse(response.text()));
    } catch (error: any) {
        console.error("Analyze Fit Error:", error);
        return NextResponse.json({
            verdict: "Needs Check",
            reason: "Could not analyze the fit at this moment. Ensure the lighting is good and the full outfit is visible."
        });
    }
}
