"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePropertyDescription(propertyData: any) {
  try {
    // 1. Validar que haya datos mínimos
    if (!propertyData.title || !propertyData.property_type) {
      return { success: false, error: "Please provide at least a Title and Property Type." };
    }

    // 2. Construir el Prompt con los datos del formulario
    const prompt = `
      Act as an expert real estate copywriter. Write a compelling, professional, and SEO-friendly property description for a real estate listing.
      
      Property Details:
      - Title: ${propertyData.title}
      - Type: ${propertyData.property_type}
      - Location: ${propertyData.city || "Unknown location"}
      - Key Features: ${propertyData.bedrooms} Beds, ${propertyData.bathrooms} Baths, ${propertyData.usable_area}m².
      - Highlights: ${propertyData.main_features?.join(", ") || "No specific highlights provided"}
      - Condition: ${propertyData.condition}
      
      Tone: Professional, inviting, and persuasive.
      Language: English (UK).
      Length: About 2 paragraphs.
      
      Do not include "Introduction:" or headers, just the text.
    `;

    // 3. Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo", // O "gpt-4o" si tienes acceso y quieres más calidad
    });

    const text = completion.choices[0].message.content;

    return { success: true, data: text };

  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return { success: false, error: "Failed to generate description. Check API Key." };
  }
}