
import { GoogleGenAI, Type } from "@google/genai";
import { Email, GeminiSummary } from "../types";

// Initialize the client globally using process.env.API_KEY as a named parameter.
// The SDK requires initializing via new GoogleGenAI({ apiKey: ... }).
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSimulatedEmails = async (count: number = 3, targetEmail: string = "user@example.com"): Promise<Email[]> => {
  const prompt = `Generate ${count} realistic "temporary email" messages for ${targetEmail}. Include verification codes, welcome emails, or security alerts. Return JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sender: { type: Type.STRING },
              senderEmail: { type: Type.STRING },
              subject: { type: Type.STRING },
              snippet: { type: Type.STRING },
              body: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["sender", "senderEmail", "subject", "snippet", "body", "tags"],
          },
        },
      },
    });

    // Directly access the .text property of GenerateContentResponse as per guidelines (it's a getter, not a method).
    const responseText = response.text || "[]";
    const data = JSON.parse(responseText);
    return data.map((item: any, index: number) => ({
      ...item,
      id: `sim-${Date.now()}-${index}`,
      date: new Date().toISOString(),
      read: false,
    }));
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return [];
  }
};

export const summarizeEmailContent = async (emailBody: string): Promise<GeminiSummary | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this email and list action items: \n\n${emailBody}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { 
              type: Type.STRING, 
              description: "The mood classification: Positive, Neutral, Negative, or Urgent." 
            },
          },
          required: ["summary", "actionItems", "sentiment"],
        },
      },
    });

    // Ensure we handle potential undefined output before parsing JSON.
    const responseText = response.text || "null";
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return null;
  }
};
