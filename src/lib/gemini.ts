import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.warn("⚠️ WARNING: GOOGLE_API_KEY not found in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

export const TEXT_MODEL = "gemini-2.0-flash-exp";
export const IMAGE_MODEL = "gemini-2.5-flash-image"; // Updated to the specialized image generation model
