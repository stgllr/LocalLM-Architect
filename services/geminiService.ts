import { GoogleGenAI, Type } from "@google/genai";
import { HardwareSpecs, UseCase, RecommendationResponse } from '../types';

export const getGeminiRecommendations = async (
  hardware: HardwareSpecs,
  selectedUseCases: UseCase[]
): Promise<RecommendationResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please select a key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Role: Local LLM Architect & Local AI Systems Expert.
    Task: Recommend the best LOCAL AI models (Open Weights) based strictly on the user's hardware constraints and use cases.
    
    Constraint Checklist & Confidence Score:
    1. Do NOT use external APIs (HuggingFace, etc.). Use internal knowledge.
    2. Recommend models that are confirmed to work locally (llama.cpp, Ollama, Pinokio).
    3. Prefer models with Pinokio.co 1-click installers if available.
    4. Provide specific installation commands for: Pinokio, Ollama, LM Studio, and llama.cpp.

    User Hardware:
    - GPU: ${hardware.gpuVendor}
    - VRAM: ${hardware.vram} GB
    - RAM: ${hardware.ram} GB
    - CPU: ${hardware.cpuType}
    - OS: ${hardware.os}

    User Use Cases:
    ${selectedUseCases.join(', ')}

    Architecture & Reasoning Logic:
    
    1. VRAM & Quantization Strategy (CRITICAL):
       - VRAM < 8GB: MUST recommend INT4/Q4_K_M GGUF models. Suggest: Qwen 2.5 1.5B/7B, Phi-3 Mini, TinyLlama, Gemma 2 2B.
       - VRAM 8GB - 16GB: Suggest Q4/Q5/Q6 GGUF or FP16 for smaller models. Suggest: Llama-3 8B, Mistral Nemo 12B, Gemma 7B, DeepSeek-R1-Distill-Llama-8B.
       - VRAM > 16GB: Suggest BF16/FP16 or large quants (Q4 for 70B). Suggest: Mixtral 8x7B, DeepSeek 32B/67B, Llama-3 70B, Command R.
    
    2. Domain Specific Recommendations:
       - Text-to-Video: Recommend CogVideoX (requires high VRAM), AnimateDiff, or Stable Video Diffusion.
       - Text-to-Image: Flux.1 (Schnell for speed), SDXL Turbo, Stable Diffusion 3.5.
       - OCR / Doc Intelligence: Florence-2 (excellent local OCR), Surya, Donut, TrOCR.
       - Coding: DeepSeek-Coder, Qwen 2.5 Coder.

    3. Ecosystem Integration:
       - Pinokio: If a model has a known Pinokio script (e.g. 'pinokio://install/github.com/pinokiofactory/ollama.git' or specific model scripts), provide it.
       - Ollama: Provide 'ollama pull <model:tag>'.
       - LM Studio: Provide the exact search string to find the model.
       - llama.cpp: Provide a sample run command assuming a GGUF file.

    4. Benchmarks & Scoring:
       - Use "LLM Arena" knowledge for ranking.
       - Prioritize Speed (tok/s) for Chat.
       - Prioritize Accuracy for Coding/OCR.

    Output Requirements:
    - Return JSON matching the schema.
    - Provide 4-6 distinct recommendations sorted by (Hardware Fit > Arena Score > Use Case).
    - 'pinokioLink': Valid pinokio:// URL or generic 'pinokio://install/github.com/pinokiofactory/ollama' if specific one unknown.
    - 'ollamaCommand': e.g., 'ollama pull qwen2.5:7b'.
    - 'lmStudioCommand': e.g., 'Search "Qwen 2.5 7B GGUF" in Home tab'.
    - 'llamaCppCommand': e.g., './llama-cli -m qwen2.5-7b-q4_k_m.gguf -p "Hello"'.
    - 'reason': Explain WHY it fits the VRAM/Hardware specifically.

  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Executive summary of the architecture strategy." },
            models: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  publisher: { type: Type.STRING },
                  type: { type: Type.STRING },
                  sizeParams: { type: Type.STRING },
                  vramReq: { type: Type.NUMBER },
                  recommendedQuantization: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reason: { type: Type.STRING, description: "Hardware fit explanation" },
                  score: { type: Type.NUMBER },
                  pinokioLink: { type: Type.STRING, nullable: true },
                  ollamaCommand: { type: Type.STRING, nullable: true },
                  lmStudioCommand: { type: Type.STRING, nullable: true },
                  llamaCppCommand: { type: Type.STRING, nullable: true },
                  installCommand: { type: Type.STRING, description: "Generic fallback" },
                  license: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  inferenceSpeed: { type: Type.STRING },
                  benchmarks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        maxScore: { type: Type.NUMBER },
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as RecommendationResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};