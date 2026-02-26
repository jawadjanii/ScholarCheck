import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzePaper(fileBase64: string, mimeType: string): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `You are an elite senior editor and peer reviewer for Elsevier journals (e.g., The Lancet, Cell, Journal of Financial Economics, Artificial Intelligence). 
Your task is to provide a rigorous, constructive, and realistic evaluation of a submitted research paper.

Evaluate the paper based on:
1. Originality and Novelty.
2. Methodological Rigor.
3. Clarity of Writing and Structure.
4. Significance of Results.
5. Adherence to Elsevier's high standards.

Provide your response in JSON format according to the specified schema. Be honest about acceptance probability—Elsevier journals have very high rejection rates.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this research paper and provide a detailed report for Elsevier journal submission.",
          },
        ],
      },
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          acceptanceProbability: {
            type: Type.NUMBER,
            description: "Probability of acceptance in a top-tier Elsevier journal (0-100).",
          },
          overallVerdict: {
            type: Type.STRING,
            description: "A 2-3 sentence summary of the paper's potential.",
          },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          improvementSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              },
              required: ["section", "suggestion", "priority"],
            },
          },
          journalFit: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                journalName: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                fitScore: { type: Type.NUMBER },
              },
              required: ["journalName", "reasoning", "fitScore"],
            },
          },
          technicalChecklist: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                item: { type: Type.STRING },
                passed: { type: Type.BOOLEAN },
                comment: { type: Type.STRING },
              },
              required: ["item", "passed", "comment"],
            },
          },
        },
        required: [
          "acceptanceProbability",
          "overallVerdict",
          "strengths",
          "weaknesses",
          "improvementSuggestions",
          "journalFit",
          "technicalChecklist",
        ],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Invalid response format from AI");
  }
}
