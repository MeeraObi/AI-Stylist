import { NextRequest, NextResponse } from "next/server";
import { genAI, IMAGE_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const prompt = formData.get("prompt") as string;
        const refFile = formData.get("ref_image") as File;

        if (!prompt) {
            return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: IMAGE_MODEL });

        const parts: any[] = [];

        // Always add reference image if provided, matching the user's Python logic
        if (refFile && refFile.size > 0) {
            const buffer = Buffer.from(await refFile.arrayBuffer());
            parts.push({
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: refFile.type,
                },
            });

            // Exact prompt phrasing from the user's working Python code
            const refinedPrompt = `A full body photograph of this person wearing a ${prompt}. High fashion photography, 8k. Ensure the person has the EXACT same face and body shape as the reference image.`;
            parts.push({ text: refinedPrompt });
        } else {
            parts.push({ text: `${prompt}. High fashion photography, 8k.` });
        }

        // Using standard modality config for Gemini 2.x+
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: {
                // @ts-ignore
                responseModalities: ["IMAGE"]
            }
        });

        const response = await result.response;
        const responseParts = response.candidates?.[0]?.content?.parts;

        if (responseParts) {
            for (const part of responseParts) {
                if (part.inlineData) {
                    return NextResponse.json({ image: part.inlineData.data });
                }
            }
        }

        // If no image, check for block reason or alternative response
        console.warn("No image in response:", JSON.stringify(response));
        return NextResponse.json({
            error: "No image generated",
            details: response.candidates?.[0]?.finishReason || "Unknown reason"
        }, { status: 500 });

    } catch (error: any) {
        console.error("Image Generation Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
