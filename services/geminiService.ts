/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, FunctionDeclaration, Type, Tool, Modality, SchemaType } from "@google/genai";
import { DesignBrief, ProfessionalDesignResult, SimulationConfig, FitAnalysisResult, ImageGenerationSize } from "../types";
import { fileToBase64 } from "../lib/utils";

const API_KEY = process.env.API_KEY!;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// ==========================================
// 1. الوحدة: المخرج الفني (تحليل السيناريو)
// ==========================================

/**
 * Get real weather/location info using Gemini 3 Flash and Google Search Grounding.
 */
export const getRealWeatherWithSearch = async (location: string): Promise<{ temp: number; condition: string; location: string; sources: string[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `What is the current typical weather in ${location} this time of year? Return temperature in Fahrenheit and condition.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        // Extract sources
        const sources: string[] = [];
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
             response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                 if (chunk.web?.uri) sources.push(chunk.web.uri);
             });
        }

        // Parse text loosely as we just need a summary for the next step, or use a second call to structure it.
        // For simplicity, we assume the text contains the info and we'll pass it to the Pro model.
        // But to fit the Type structure, let's extract some mock values if parsing fails, or assume the Pro model
        // will correct it. Here we just return the text description and sources.
        
        // We will default to a placeholder if search fails, but usually it returns text.
        return {
            temp: 0, // Will be inferred by Pro model from the context text
            condition: response.text || "Unknown",
            location: location,
            sources: sources
        };

    } catch (e) {
        console.warn("Weather search failed", e);
        return { temp: 72, condition: "Sunny (Default)", location, sources: [] };
    }
};

/**
 * الدالة الرئيسية لتحليل السيناريو وتوليد تصميم الأزياء.
 * Uses Gemini 3 Pro with Thinking Config for deep analysis.
 */
export const generateProfessionalDesign = async (brief: DesignBrief): Promise<ProfessionalDesignResult> => {
  
  // Step 1: Gather Real World Data (Search Grounding)
  const weatherInfo = await getRealWeatherWithSearch(brief.filmingLocation);
  
  const systemInstruction = `You are an expert AI Costume Stylist & Designer for Film/TV.
  Your Goal: Create a "Look" that fits the Drama (Script), Visuals (Camera), Production Reality (Budget/Weather), and **Character Psychology**.

  CORE LOGIC & CONSTRAINTS:
  1. **Psychological Mirroring:** The costume MUST reflect the character's internal arc, secrets, or transformation. How does the fit, texture, or condition expose their vulnerability or armor?
  2. **Script Rule:** Every item must have a dramatic reason.
  3. **Weather/Location Rule:** You MUST adapt the fabrics/layers to the REAL weather conditions provided: "${weatherInfo.condition}".
  4. **Continuity & Safety:** Consider stunts, multiple takes (copies needed), and actor safety (footwear).
  5. **Camera:** Avoid moire patterns (tight grids), pure white (burnout), or noisy fabrics unless requested.
  6. **Language:** The output content MUST be in **Professional Egyptian Arabic** (for descriptions/rationale), but the JSON keys must be in English.

  OUTPUT FORMAT GUIDELINES:
  - **dramaticDescription**: Write a compelling narrative explaining how this look visualizes the character's psychological state and the scene's mood.
  - **rationale**: Include specific points linking garment choices to emotional beats.
  `;

  // Use Thinking Config for complex reasoning
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction,
      thinkingConfig: { thinkingBudget: 32768 }, // Max thinking for Pro
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
            lookTitle: { type: Type.STRING },
            dramaticDescription: { type: Type.STRING },
            breakdown: {
                type: Type.OBJECT,
                properties: {
                    basics: { type: Type.STRING },
                    layers: { type: Type.STRING },
                    shoes: { type: Type.STRING },
                    accessories: { type: Type.STRING },
                    materials: { type: Type.STRING },
                    colorPalette: { type: Type.STRING }
                }
            },
            rationale: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            productionNotes: {
                type: Type.OBJECT,
                properties: {
                    copies: { type: Type.STRING },
                    distressing: { type: Type.STRING },
                    cameraWarnings: { type: Type.STRING },
                    weatherAlt: { type: Type.STRING },
                    budgetAlt: { type: Type.STRING }
                }
            },
            imagePrompt: { type: Type.STRING },
            realWeather: {
                type: Type.OBJECT,
                properties: {
                    temp: { type: Type.NUMBER },
                    condition: { type: Type.STRING },
                    location: { type: Type.STRING }
                }
            }
        }
      }
    },
  });

  const prompt = `
    Requesting Costume Design for:
    [A] Context: Project: ${brief.projectType}, Scene: ${brief.sceneContext}
    [B] Character: Profile: ${brief.characterProfile}, Psychology: ${brief.psychologicalState}
    [C] Constraints: Location: ${brief.filmingLocation}, Notes: ${brief.productionConstraints}
    
    Data from Location Search: ${weatherInfo.condition}. Use this to infer 'realWeather' fields.
    
    Generate the design JSON.
  `;

  const response = await chat.sendMessage({ message: prompt });
  
  // Parse JSON
  const jsonText = response.text;
  let designData: any;
  try {
      designData = JSON.parse(jsonText);
  } catch (e) {
      console.error("Failed to parse JSON", jsonText);
      throw new Error("Analysis failed. Please try again.");
  }

  // Inject sources from the search step
  if (designData.realWeather) {
      designData.realWeather.sources = weatherInfo.sources;
  }

  // Generate Concept Art using Pro Image Model
  const imagePrompt = `
    Cinematic full body shot. Movie still.
    Subject: ${designData.imagePrompt || brief.characterProfile}.
    Lighting: Cinematic, dramatic.
    Quality: 8k, highly detailed textures.
  `;

  const imageResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: imagePrompt }] },
      config: { 
          responseModalities: [Modality.IMAGE],
          imageConfig: { imageSize: '2K' } // Default to high quality
      }
  });

  let conceptArtUrl = '';
  for (const candidate of imageResponse.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
        if (part.inlineData) {
            conceptArtUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
        }
    }
  }

  return { ...designData, conceptArtUrl };
};

// ==========================================
// 2. الوحدة: محرك الواقعية (القياس والمحاكاة)
// ==========================================

/**
 * Generate a garment image using Gemini 3 Pro Image.
 */
export const generateGarmentAsset = async (description: string, size: ImageGenerationSize = '1K'): Promise<string> => {
    const prompt = `
        Generate a high-quality, photorealistic image of a single clothing item: ${description}.
        The item should be isolated on a plain white or transparent background.
        Flat lay photography style or ghost mannequin style.
        Professional fashion product photography.
        No models, no human body parts, just the garment.
        Centered, entire item visible.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: { 
            responseModalities: [Modality.IMAGE],
            imageConfig: { imageSize: size }
        }
    });

    let imageUrl = '';
    for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
            if (part.inlineData) {
                imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    if (!imageUrl) {
        throw new Error("Failed to generate garment image.");
    }

    return imageUrl;
};

/**
 * Edit an existing garment image using text prompt (Nano Banana).
 */
export const editGarmentImage = async (file: File, editPrompt: string): Promise<string> => {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || 'image/png';

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { mimeType, data: base64Data } },
                { text: editPrompt }
            ]
        }
    });

    let imageUrl = '';
    for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
            if (part.inlineData) {
                imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    if (!imageUrl) throw new Error("Failed to edit image.");
    return imageUrl;
};


/**
 * Transcribe Audio using Gemini 3 Flash.
 */
export const transcribeAudio = async (audioFile: File): Promise<string> => {
    const base64Data = await fileToBase64(audioFile);
    
    // Check if type is supported (wav, mp3, aac, flac, etc)
    // Gemini supports common formats.
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: audioFile.type, data: base64Data } },
                { text: "Transcribe this audio exactly as spoken." }
            ]
        }
    });
    
    return response.text || "";
};

/**
 * Analyze Video for Style/Content using Gemini 3 Pro.
 */
export const analyzeVideoContent = async (videoFile: File): Promise<string> => {
    const base64Data = await fileToBase64(videoFile);
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: videoFile.type, data: base64Data } },
                { text: "Analyze this video. Describe the visual style, costume era, and general mood suitable for a costume design brief." }
            ]
        }
    });
    
    return response.text || "";
};


/**
 * Virtual Try-On using Image-to-Image.
 */
export const generateVirtualFit = async (
    modelFile: File, 
    garmentFile: File, 
    garmentDescription: string, 
    context?: string,
    simConfig?: SimulationConfig
): Promise<string> => {
    const modelBase64 = await fileToBase64(modelFile);
    const garmentBase64 = await fileToBase64(garmentFile);

    let physicsPrompt = "";
    if (simConfig) {
        physicsPrompt = `
        [PHYSICS & LIGHTING ENGINE SETTINGS]
        - **Fabric Physics:** Simulate '${simConfig.physics}' weight. 
           ${simConfig.physics === 'heavy' ? 'Fabric should hang heavily with minimal folds.' : ''}
           ${simConfig.physics === 'flow' ? 'Fabric should react dynamically to air, showing movement.' : ''}
           ${simConfig.physics === 'wet' ? 'Fabric must appear damp, darker, and clinging to the skin.' : ''}
        - **Lighting Synthesis:** Apply '${simConfig.lighting}' lighting.
           ${simConfig.lighting === 'dramatic' ? 'High contrast, noir-style shadows.' : ''}
           ${simConfig.lighting === 'neon' ? 'Cyberpunk style colored rim lights (pink/blue).' : ''}
        - **Pose Estimation:** Adapt the garment to the actor's '${simConfig.action}' pose rigorously.
        ${simConfig.actorConstraints ? `- **ACTOR CONSTRAINTS / SAFETY:** ${simConfig.actorConstraints}. (Priority: High - Ensure these constraints modify the fit visually).` : ''}
        `;
    }

    const prompt = `
        Act as a professional high-end VFX compositor for film.
        Task: Realistically digitally dress the person in the 'Model Image' with the clothing item from the 'Garment Image'.
        
        Garment Description: ${garmentDescription}
        
        ${context ? `
        [CONTEXT & ENVIRONMENT]
        ${context}
        ` : ''}

        ${physicsPrompt}

        Requirements:
        1. **Computer Vision Match:** The clothing must perfectly align with the actor's skeleton rig and posture.
        2. **Photorealism:** Match the film grain, resolution, and sensor noise of the Model Image.
        3. **Integrity:** Do NOT change the model's face, hair, or background. Only replace the clothing.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/png', data: modelBase64 } }, 
                { inlineData: { mimeType: 'image/png', data: garmentBase64 } }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE],
        }
    });

    let generatedImageUrl = '';
    for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
            if (part.inlineData) {
                generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    if (!generatedImageUrl) {
        throw new Error("Failed to generate virtual fit image.");
    }

    return generatedImageUrl;
};

/**
 * Safety & Comfort Analytics using Gemini 3 Pro (Image Understanding).
 */
export const analyzeFitCompatibility = async (
    fittedImageUrl: string,
    constraints: string = "None"
): Promise<FitAnalysisResult> => {
    // Extract base64
    const base64Data = fittedImageUrl.split(',')[1];

    const prompt = `
    Analyze this generated costume fit image for a film production safety report.
    
    Actor Constraints Provided: "${constraints}"
    
    Evaluate the following criteria strictly:
    1. **Safety:** Are there tripping hazards (too long), choking hazards (tight neck), or visibility issues?
    2. **Comfort:** Does the fabric look too heavy, tight, or restrictive given the constraints?
    3. **Movement:** Will this restrict running or fighting if required?

    Return a JSON object with:
    - compatibilityScore: (Number 0-100)
    - safetyIssues: (Array of strings, e.g., "Hemline trip hazard")
    - fabricNotes: (String description of how the fabric sits)
    - movementPrediction: (String prediction of movement range)

    Response Language: English for JSON keys, **Arabic** for values.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Stronger model for analysis
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/png', data: base64Data } }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    compatibilityScore: { type: Type.NUMBER },
                    safetyIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                    fabricNotes: { type: Type.STRING },
                    movementPrediction: { type: Type.STRING }
                }
            }
        }
    });

    const text = response.text;
    if (!text) throw new Error("Analysis failed to generate text.");
    
    return JSON.parse(text) as FitAnalysisResult;
};

/**
 * Stress Test Video using Veo.
 */
export const generateStressTestVideo = async (
    fittedImageUrl: string,
    actionType: string
): Promise<string> => {
    
    const base64Data = fittedImageUrl.split(',')[1];

    const prompt = `A cinematic video of this character ${actionType}. 
    Focus on the fabric movement, weight, and lighting interaction. 
    High quality, photorealistic 1080p, film grain.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        image: {
            imageBytes: base64Data,
            mimeType: 'image/png',
        },
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '1080p',
            aspectRatio: '9:16' // Portrait for actor fit check
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!downloadLink) {
        throw new Error("Video generation failed or no URI returned.");
    }

    return `${downloadLink}&key=${API_KEY}`;
};