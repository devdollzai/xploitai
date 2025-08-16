
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* streamChat(history: Message[]) {
    // The Gemini API expects role/parts format.
    const contents = history.map(msg => ({
        role: msg.role,
        parts: msg.parts.map(part => ({ text: part.text }))
    }));

    try {
        const result = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                temperature: 0.45,
                topP: 0.15,
            }
        });

        for await (const chunk of result) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error streaming from Gemini:", error);
        yield "An error occurred while communicating with the AI. Please check the console for details.";
    }
}
