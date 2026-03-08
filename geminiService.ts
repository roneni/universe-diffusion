import { GoogleGenAI } from '@google/genai';
import { ModelType } from './types';

// Initialize with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

// For Pro model, we need the user's API key
export const checkProAuth = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    return await (window as any).aistudio.hasSelectedApiKey();
  }
  return false;
};

export const openAuthDialog = async (): Promise<void> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    await (window as any).aistudio.openSelectKey();
  }
};

const getProAi = () => {
  // Always create a new instance to get the latest key
  return new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || 'dummy_key' });
};

export const generateUniverseImage = async (
  prompt: string, 
  aspectRatio: string, 
  modelType: ModelType,
  resolution: string = "1K"
): Promise<string> => {
  // Use Nano Banana 2 (gemini-3.1-flash-image-preview) for FLASH
  // Use gemini-3-pro-image-preview for PRO
  
  const modelName = modelType === ModelType.PRO 
    ? 'gemini-3-pro-image-preview' 
    : 'gemini-3.1-flash-image-preview'; // Nano Banana 2

  const aiInstance = getProAi();

  const response = await aiInstance.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: resolution
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated");
};

export const editUniverseImage = async (
  imageB64: string,
  prompt: string,
  modelType: ModelType,
  resolution: string = "1K"
): Promise<string> => {
  const modelName = modelType === ModelType.PRO 
    ? 'gemini-3-pro-image-preview' 
    : 'gemini-3.1-flash-image-preview'; // Nano Banana 2

  const aiInstance = getProAi();

  // Extract base64 data and mime type
  const match = imageB64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image format");
  const mimeType = match[1];
  const data = match[2];

  const response = await aiInstance.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        {
          inlineData: {
            data: data,
            mimeType: mimeType
          }
        },
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        imageSize: resolution
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated");
};

export const analyzeCoverImage = async (imageB64: string): Promise<string> => {
  const match = imageB64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image format");
  const mimeType = match[1];
  const data = match[2];

  const aiInstance = getProAi();

  const response = await aiInstance.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: data,
            mimeType: mimeType
          }
        },
        { text: "Analyze this image and provide a highly detailed, evocative prompt that could be used to recreate its essence, mood, and style in an image generation model. Focus on lighting, composition, textures, and artistic techniques. Do not include introductory text, just output the prompt." }
      ]
    }
  });

  return response.text || "";
};

export const enhancePromptWithThinking = async (prompt: string): Promise<string> => {
  const aiInstance = getProAi();
  const response = await aiInstance.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `You are an expert prompt engineer for a state-of-the-art image generation model. 
Take the following user prompt and enhance it to be a highly detailed, breathtaking, and creative prompt that will generate a masterpiece. 
Focus on lighting, camera angles, textures, atmosphere, and artistic style. 
Do not add generic terms like "masterpiece" or "trending on artstation". Instead, use specific, evocative language that paints a vivid picture.
Keep the core subject of the user's prompt intact, but elevate the execution.
Do not include any introductory or concluding text, just output the enhanced prompt.

Original prompt: ${prompt}`,
  });

  return response.text || prompt;
};
