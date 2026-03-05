import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Attachment {
  name: string;
  type?: string;
}

export interface CleanedConversation {
  title: string;
  messages: ChatMessage[];
  attachments?: Attachment[];
}

export async function cleanConversation(rawText: string): Promise<CleanedConversation> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a lossless chat log parser. Your task is to extract the FULL conversation between a User and an AI Assistant from the provided raw text.
    
    CRITICAL RULES:
    1. DO NOT SUMMARIZE. Every single word spoken by the user and the assistant must be preserved exactly as it is.
    2. PRESERVE ALL FORMATTING. Keep all Markdown, code blocks, bold text, italics, lists, and emojis exactly as they appear in the original text.
    3. REMOVE ONLY UI NOISE. Strip out elements like "Copy", "Regenerate", "Share", timestamps (e.g., "10:45 AM"), "Like/Dislike" buttons, "Draft 1", "Draft 2", and model name labels (e.g., "Claude 3.5 Sonnet", "GPT-4o") if they are just UI headers.
    4. DETECT ATTACHMENTS: Look for any files or documents that were attached to the conversation (e.g., "BTL GRNDS.docx", "image.png", "data.csv"). List them in an 'attachments' array.
    5. STRUCTURE: Return a JSON object with a descriptive 'title', an array of 'messages', and an array of 'attachments'.
    6. MESSAGE OBJECT: Each message must have 'role' ("user" or "assistant") and 'content' (the full, unedited text of that turn).
    
    Raw Text to parse:
    ${rawText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          messages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING, enum: ["user", "assistant"] },
                content: { type: Type.STRING }
              },
              required: ["role", "content"]
            }
          },
          attachments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ["name"]
            }
          }
        },
        required: ["title", "messages"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as CleanedConversation;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to clean the conversation. Please try again.");
  }
}
