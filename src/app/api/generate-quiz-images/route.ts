import { NextRequest, NextResponse } from "next/server";
import { genAI, IMAGE_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const refFile = formData.get("ref_image") as File;

        if (!refFile) {
            return NextResponse.json({ error: "No reference image provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: IMAGE_MODEL });
        const buffer = Buffer.from(await refFile.arrayBuffer());
        const base64Image = buffer.toString("base64");
        const mimeType = refFile.type;

        const styles = [
            { id: 'minimalist', name: 'Minimalist clean aesthetic outfit' },
            { id: 'trendy', name: 'Trendy streetwear outfit with layers' },
            { id: 'preppy', name: 'Old Money classic preppy outfit' },
            { id: 'bohemian', name: 'Bohemian chic relaxed outfit' },
            { id: 'formal', name: 'Formal evening party suit' }
        ];

        const generatedResults = [];

        // Generate images sequentially to avoid overwhelming rate limits, 
        // mimicking the user's Python loop with a slight delay if needed (though API might handle it)
        for (const style of styles) {
            const prompt = `A full body photograph of this person wearing a ${style.name}. High fashion photography, 8k. Ensure the person has the EXACT same face and body shape as the reference image.`;

            try {
                const result = await model.generateContent({
                    contents: [{
                        role: "user",
                        parts: [
                            { inlineData: { data: base64Image, mimeType } },
                            { text: prompt }
                        ]
                    }],
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
                            generatedResults.push({
                                style: style.id,
                                image: part.inlineData.data
                            });
                        }
                    }
                }
            } catch (err) {
                console.error(`Error generating style ${style.id}:`, err);
            }
        }

        return NextResponse.json({ images: generatedResults });

    } catch (error: any) {
        console.error("Quiz Image Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
