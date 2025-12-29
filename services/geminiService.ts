import { GoogleGenAI, Type } from "@google/genai";
import { VibeConfig } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateVibeConfig = async (userPrompt: string): Promise<VibeConfig> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a lighting and atmosphere configuration for a DJ stage based on this mood: "${userPrompt}".
      Return a JSON object with hex colors and numeric values. 
      strobeSpeed should be between 0 (static) and 10 (manic). 
      intensity should be between 0.5 (dim) and 2.0 (bright).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryColor: { type: Type.STRING, description: "Hex color for main lights" },
            secondaryColor: { type: Type.STRING, description: "Hex color for accents/lasers" },
            fogColor: { type: Type.STRING, description: "Hex color for the volumetric fog" },
            strobeSpeed: { type: Type.NUMBER, description: "Speed of flashing lights 0-10" },
            intensity: { type: Type.NUMBER, description: "Brightness multiplier 0.5-2.0" },
            description: { type: Type.STRING, description: "Short description of the vibe generated" },
          },
          required: ["primaryColor", "secondaryColor", "fogColor", "strobeSpeed", "intensity", "description"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as VibeConfig;
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
