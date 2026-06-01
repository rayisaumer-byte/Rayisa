/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY_IF_NOT_SET",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper to check if API key is present
const hasApiKey = () => {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
};

// 1. API Endpoint: Chat & Advice proxy for parenting/baby nutrition
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format." });
    }

    if (!hasApiKey()) {
      return res.json({
        text: "Hi there! I am Rayiza's AI parenting assistant. (Note: Gemini API key is not fully configured in your dashboard yet, so I am running in demo mode!) For 6-month-old babies, I highly recommend starting with our Sprouted Ragi Powder as it is super easy on their delicate tummies and rich in calcium!",
        isMock: true
      });
    }

    // Prepare message structure for Gemini
    const systemInstruction = 
      "You are Rayiza, an affectionate mother from Kasaragod, Kerala, and an expert in infant nutrition, traditional recipes, and pure baby food. " +
      "You have launched 'Rayiza's Natural Products' to provide 100% natural, dehydrated baby food for infants aged 6 months and above. " +
      "The signature product range includes:\n" +
      "1. Sprouted Ragi Powder: Rich in calcium/iron, sprouted for easy digestion (6m+)\n" +
      "2. Natural Banana Powder: Made from raw Kerala bananas, great for healthy weight gain and deep nutrition (6m+)\n" +
      "3. ABC Powder (Apple, Beetroot, Carrot): Vibrant vitamin-packed mix for natural immunity and delicious taste (6m+)\n" +
      "4. Mixed Baby Food Kurukku: Comprehensive meal combining multi-grain nutrition with motherly care (6m+)\n\n" +
      "Rules for answering:\n" +
      "- Speak warmly, with supportive and encouraging motherly care. Use a gentle tone.\n" +
      "- Promote the power of organic, 100% natural foods; highlight that we have FSSAI certification and absolutely ZERO artificial additives, preservatives, or added sugar.\n" +
      "- Keep your responses practical and comforting, tailoring advice to the infant's typical age milestones when specified.\n" +
      "- Keep answers concise (under 200 words) so they are easy for busy parents to read.\n" +
      "- Advise them to consult their pediatrician for medically serious issues (such as severe allergies, slow developmental growth, or specific illnesses).";

    // Standard Chat with gemini-3.5-flash
    const formattedContents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Something went wrong while consulting the nutrition guide." });
  }
});

// 2. API Endpoint: Meal Plan Generator (conformance with structured JSON schema)
app.post("/api/mealplan", async (req, res) => {
  try {
    const { babyName, ageMonths, dietaryPreference, dailyRoutine } = req.body;

    if (!babyName || !ageMonths) {
      return res.status(400).json({ error: "Baby name and age in months are required." });
    }

    if (!hasApiKey()) {
      // Return beautiful mock response if Gemini API key isn't active
      return res.json({
        babyName,
        ageMonths,
        introText: `Welcome to Rayiza's family, dear ${babyName}! Since your little bundle is ${ageMonths} months old, physical milestones are happening fast. Here is a custom, nourishing nutrition schedule for your sweetheart.`,
        meals: [
          {
            timeOfDay: "Morning Breakfast",
            mealName: "Warm Sprouted Ragi Kurukku",
            productSuggested: "Sprouted Ragi Powder",
            benefits: "Rich in calcium and iron, promoting bone development while keeping digestion smooth.",
            instructions: "Mix 2 tablespoons of Ragi Powder with 1 cup of warm water or milk. Cook on a slow flame for 3–5 minutes, stirring continuously until thick and velvety."
          },
          {
            timeOfDay: "Afternoon Snack",
            mealName: "Sweet Banana Puree Mash",
            productSuggested: "Natural Banana Powder",
            benefits: "Provides sustained, healthy play energy from natural Kerala raw bananas.",
            instructions: "Whisk 1.5 tablespoons of Raw Banana Powder with formula, milk, or pure water. Simmer on low heat for 3 minutes. Serve lukewarm."
          }
        ],
        nutritionTips: [
          "Always start with single-ingredient meals for infants just embarking on solid foods.",
          "Ensure consistency is fluid-like at 6 months, and gradually thicken as they reach 8-9 months.",
          "Feed in a relaxed, upright position to support healthy digestion."
        ],
        safetyWarning: "Check feed temperature on the inside of your wrist first. Always supervise your baby during meals and let them lead."
      });
    }

    const prompt = `Generate a fully personalized baby feeding meal plan.
    Baby Name: ${babyName}
    Age in Months: ${ageMonths}
    Diet Preference focus: ${dietaryPreference}
    Daily Routine: ${dailyRoutine}
    
    Incorporate Rayiza's Natural Products signature range (Sprouted Ragi, Banana, ABC, and Mixed Kurukku) where appropriate. Provide the output in clean JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an infant nutritionist expert specializing in infant baby plans aged 6 to 24 months. Provide complete JSON objects matching the schema.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            babyName: { type: Type.STRING },
            ageMonths: { type: Type.NUMBER },
            introText: { type: Type.STRING, description: "A heartwarming, mother-care greeting for the parent and baby." },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeOfDay: { type: Type.STRING, description: "Meal serving time (e.g. Breakfast, Lunch, Mid-day)" },
                  mealName: { type: Type.STRING },
                  productSuggested: { type: Type.STRING, description: "The corresponding baby powder brand item to use." },
                  benefits: { type: Type.STRING },
                  instructions: { type: Type.STRING, description: "Short step-by-step preparation steps on heat with water/milk." }
                },
                required: ["timeOfDay", "mealName", "productSuggested", "benefits", "instructions"]
              }
            },
            nutritionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three expert baby feeding guidelines."
            },
            safetyWarning: { type: Type.STRING }
          },
          required: ["babyName", "ageMonths", "introText", "meals", "nutritionTips", "safetyWarning"]
        }
      }
    });

    const parsedPlan = JSON.parse(response.text.trim());
    res.json(parsedPlan);
  } catch (error: any) {
    console.error("Meal Plan Generation Error:", error);
    res.status(500).json({ error: "Failed to generate meal plan. Please check inputs." });
  }
});

// Setup Vite Dev server / static production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Middlewares loaded for Vite dev server.");
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rayiza Website running dynamically on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((e) => {
  console.error("Failed to boot up server backend express:", e);
});
