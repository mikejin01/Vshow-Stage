import { GoogleGenerativeAI } from "@google/generative-ai";
import { VibeConfig } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const generateVibeConfig = async (userPrompt: string): Promise<VibeConfig> => {
  try {
    if (!apiKey) {
      console.warn("No API key found, using fallback vibe");
      throw new Error("No API key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a lighting and atmosphere configuration for a DJ stage based on this mood: "${userPrompt}".
    Return ONLY a valid JSON object with the following structure:
    {
      "primaryColor": "hex color for main lights",
      "secondaryColor": "hex color for accents/lasers",
      "fogColor": "hex color for the volumetric fog",
      "strobeSpeed": number between 0 (static) and 10 (manic),
      "intensity": number between 0.5 (dim) and 2.0 (bright),
      "description": "Short description of the vibe generated"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("No response from AI");
    
    // Extract JSON from response (remove markdown code blocks if present)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    return JSON.parse(jsonMatch[0]) as VibeConfig;
  } catch (error) {
    console.error("Failed to generate vibe:", error);
    // Fallback default
    return {
      primaryColor: "#ff0000",
      secondaryColor: "#0000ff",
      fogColor: "#101010",
      strobeSpeed: 5,
      intensity: 1,
      description: "Default Fallback Vibe",
    };
  }
};
