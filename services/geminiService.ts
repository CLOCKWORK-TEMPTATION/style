/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, FunctionDeclaration, Type, Tool, Modality } from "@google/genai";
import { DesignBrief, ProfessionalDesignResult, SimulationConfig } from "../types";

const API_KEY = process.env.API_KEY!;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// ==========================================
// 1. MODULE: COSTUME DIRECTOR (Script Analysis)
// ==========================================

const realWeatherTool: FunctionDeclaration = {
  name: "get_filming_location_conditions",
  description: "Get the current weather for the filming location to determine fabric choice and actor comfort.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The city where filming is taking place.",
      },
    },
    required: ["location"],
  },
};

const tools: Tool[] = [{ functionDeclarations: [realWeatherTool] }];

const mockWeatherService = (location: string) => {
    const conditions = ["Sunny & Humid", "Overcast & Chilly", "Rainy", "Dry Heat", "Windy"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * (95 - 40) + 40);
    return {
        location: location,
        temp: temp,
        condition: condition
    };
};

export const generateProfessionalDesign = async (brief: DesignBrief): Promise<ProfessionalDesignResult> => {
  const systemInstruction = `You are an expert AI Costume Stylist & Designer for Film/TV.
  Your Goal: Create a "Look" that fits the Drama (Script), Visuals (Camera), Production Reality (Budget/Weather), and **Character Psychology**.

  CORE LOGIC & CONSTRAINTS:
  1. **Psychological Mirroring:** The costume MUST reflect the character's internal arc, secrets, or transformation. How does the fit, texture, or condition expose their vulnerability or armor?
  2. **Script Rule:** Every item must have a dramatic reason.
  3. **Weather/Location Rule:** You MUST adapt the fabrics/layers to the REAL weather of the location provided via the tool.
  4. **Continuity & Safety:** Consider stunts, multiple takes (copies needed), and actor safety (footwear).
  5. **Camera:** Avoid moire patterns (tight grids), pure white (burnout), or noisy fabrics unless requested.
  6. **Language:** The output content MUST be in ARABIC (Formal & Professional terms), but the JSON keys must be in English.

  OUTPUT FORMAT GUIDELINES:
  - **dramaticDescription**: Write a compelling narrative explaining how this look visualizes the character's psychological state and the scene's mood. Do not just list items here; explain the *emotion* of the look.
  - **rationale**: Include specific points linking garment choices to emotional beats (e.g., "Loose collar represents loss of control").
  
  Return a raw JSON object matching the schema provided. Do not use Markdown code blocks.
  `;

  const model = 'gemini-2.5-flash';
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
      tools: tools,
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
            imagePrompt: { type: Type.STRING }
        }
      }
    },
  });

  const prompt = `
    Requesting Costume Design for:
    [A] Context: Project: ${brief.projectType}, Scene: ${brief.sceneContext}
    [B] Character: Profile: ${brief.characterProfile}, Psychology: ${brief.psychologicalState}
    [C] Constraints: Location: ${brief.filmingLocation}, Notes: ${brief.productionConstraints}
    
    Step 1: Call the weather tool for ${brief.filmingLocation}.
    Step 2: Generate the costume design JSON in Arabic. 
    **IMPORTANT:** In 'dramaticDescription' and 'rationale', explicitly explain how the costume reflects the character's psychological transformation in this scene.
    Step 3: Include an English image prompt in the 'imagePrompt' field.
  `;

  let response = await chat.sendMessage({ message: prompt });

  let realWeather = { temp: 70, condition: "Unknown", location: brief.filmingLocation };
  const functionCalls = response.functionCalls;
  if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "get_filming_location_conditions") {
          const args = call.args as any;
          realWeather = mockWeatherService(args.location);
          response = await chat.sendMessage({
              message: [{
                  functionResponse: {
                      name: call.name,
                      id: call.id,
                      response: { result: realWeather }
                  }
              }]
          });
      }
  }

  const jsonText = response.text;
  let designData: any;
  try {
      designData = JSON.parse(jsonText);
  } catch (e) {
      console.error("Failed to parse JSON", jsonText);
      throw new Error("Analysis failed. Please try again.");
  }

  const imagePrompt = `
    Cinematic full body shot. Movie still.
    Subject: ${designData.imagePrompt || brief.characterProfile}.
    Lighting: Cinematic, dramatic.
    Quality: 8k, highly detailed textures.
  `;

  const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: { responseModalities: [Modality.IMAGE] }
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

  return { ...designData, conceptArtUrl, realWeather };
};


// ==========================================
// 2. MODULE: REALISM ENGINE (Virtual Fitting & Simulation)
// ==========================================

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * دالة توليد صورة لقطعة ملابس بناءً على وصف نصي.
 * تستخدم لتوسيع خزانة الملابس.
 */
export const generateGarmentAsset = async (description: string): Promise<string> => {
    const prompt = `
        Generate a high-quality, photorealistic image of a single clothing item: ${description}.
        The item should be isolated on a plain white or transparent background.
        Flat lay photography style or ghost mannequin style.
        Professional fashion product photography.
        No models, no human body parts, just the garment.
        Centered, entire item visible.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { responseModalities: [Modality.IMAGE] }
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
 * دالة القياس الافتراضي مع دعم محرك المحاكاة الفيزيائية والإضاءة.
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

    // بناء أوامر المحاكاة بناءً على الإعدادات
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
 * دالة اختبار الضغط الديناميكي (فيديو) باستخدام نموذج Veo.
 * تقوم بتوليد فيديو قصير يظهر الممثل يتحرك بالزي لاختبار الانسيابية.
 */
export const generateStressTestVideo = async (
    fittedImageUrl: string,
    actionType: string
): Promise<string> => {
    
    // تحويل Data URL إلى Base64 خام
    const base64Data = fittedImageUrl.split(',')[1];

    const prompt = `A cinematic video of this character ${actionType}. 
    Focus on the fabric movement, weight, and lighting interaction. 
    High quality, photorealistic 1080p, film grain.`;

    // 1. بدء عملية التوليد
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

    // 2. حلقة الانتظار (Polling)
    console.log("Starting video generation...");
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // انتظار 5 ثواني
        operation = await ai.operations.getVideosOperation({ operation: operation });
        console.log("Polling video status...");
    }

    // 3. استخراج الرابط
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!downloadLink) {
        throw new Error("Video generation failed or no URI returned.");
    }

    // إرفاق مفتاح API للتحميل
    return `${downloadLink}&key=${API_KEY}`;
};