import { NextRequest, NextResponse } from "next/server";
import { genAI, TEXT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];
        const userInfoStr = formData.get("userInfo") as string;
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
        const name = userInfo.name || "the user";

        const model = genAI.getGenerativeModel({
            model: TEXT_MODEL,
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        Analyze these user photos. 
        IMPORTANT: Refer to the user as "${name}" throughout the response. Do NOT use "he", "she", or generic pronouns unless necessary for grammar, but prioritize using the name.
        
        Return detailed JSON:
        {
            "profile_writeup": {
                "summary": "200 words on style vibe, using the name '${name}'."
            },
            "first_looks": {
                "work": "Specific outfit description for work, referring to ${name}.",
                "travel": "Specific outfit description for travel, referring to ${name}.",
                "social": "Specific outfit description for social events, referring to ${name}."
            },
            "physical_desc": "Visual description of face/body for image gen (e.g. 'Male, short beard, square face, medium build')",
            "style_tweaks": [
                "Detailed actionable tip 1 to improve the look (max 10 words)",
                "Detailed actionable tip 2 to improve the look (max 10 words)",
                "Detailed actionable tip 3 to improve the look (max 10 words)"
            ]
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
