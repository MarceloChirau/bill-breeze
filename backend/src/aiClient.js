import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const INSTRUCTIONS = `You are the BillBreeze Financial Assistant. Your job is to help users manage their expenses. Always return data in JSON format when asked for extractions. Be professional, concise, and accurate with numbers. If you are unsure about a value, mark it as null.

Extract the following details from this invoice (image or PDF): vendor name, dates, total amount, tax, currency, and any payment references you see. Return strictly valid JSON.

Include a property called ai_analysis. In this field, analyze the bill contextually (e.g. estimated vs actual, consumption hints if visible, payment due urgency).

You can follow this kind of shape (example only; use real values from the document):
{
  "invoice_details": {
    "vendor": "string",
    "invoice_number": "string",
    "invoice_type": "string",
    "issue_date": "string",
    "due_date": "string",
    "payment_password": "string",
    "next_measurement_date": "string",
    "provider_number": "string",
    "contract_number": "string"
  },
  "customer": {
    "full_name": "string",
    "address": "string",
    "property_address": "string"
  },
  "financials": {
    "total_payable_amount": 0,
    "net_consumption_amount": 0,
    "total_taxes_and_fees": 0,
    "currency": "EUR"
  },
  "consumption_stats": {
    "total_kwh": 0,
    "period_days": 0,
    "daily_avg_kwh": 0,
    "cost_per_kwh_net": 0,
    "cost_per_kwh_gross": 0
  },
  "ai_analysis": "string"
}`;


//checking which models are available with my api:
// const client=new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const models=await client.models.list();

// models.pageInternal.forEach(model=>{
//   console.log(model.name);
// })


/*
models/gemini-2.5-flash
models/gemini-2.5-pro
models/gemini-2.0-flash
models/gemini-2.0-flash-001
models/gemini-2.0-flash-lite-001
models/gemini-2.0-flash-lite
models/gemini-2.5-flash-preview-tts
models/gemini-2.5-pro-preview-tts
models/gemma-3-1b-it
models/gemma-3-4b-it
models/gemma-3-12b-it
models/gemma-3-27b-it
models/gemma-3n-e4b-it
models/gemma-3n-e2b-it
models/gemma-4-26b-a4b-it
models/gemma-4-31b-it
models/gemini-flash-latest
models/gemini-flash-lite-latest
models/gemini-pro-latest
models/gemini-2.5-flash-lite
models/gemini-2.5-flash-image
models/gemini-3-pro-preview
models/gemini-3-flash-preview
models/gemini-3.1-pro-preview
models/gemini-3.1-pro-preview-customtools
models/gemini-3.1-flash-lite-preview
models/gemini-3-pro-image-preview
models/nano-banana-pro-preview
models/gemini-3.1-flash-image-preview
models/lyria-3-clip-preview
models/lyria-3-pro-preview
models/gemini-3.1-flash-tts-preview
models/gemini-robotics-er-1.5-preview
models/gemini-robotics-er-1.6-preview
models/gemini-2.5-computer-use-preview-10-2025
models/deep-research-pro-preview-12-2025
models/gemini-embedding-001
models/gemini-embedding-2-preview
models/aqa
models/imagen-4.0-generate-001
models/imagen-4.0-ultra-generate-001
models/imagen-4.0-fast-generate-001
models/veo-2.0-generate-001
models/veo-3.0-generate-001
models/veo-3.0-fast-generate-001
models/veo-3.1-generate-preview
models/veo-3.1-fast-generate-preview
models/veo-3.1-lite-generate-preview
models/gemini-2.5-flash-native-audio-latest
models/gemini-2.5-flash-native-audio-preview-09-2025
*/






export async function processInvoice(base64Data, mimeType) {
  const genAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const response = await genAi.models.generateContent({
      model: "gemini-2.5-flash-lite",

      //gemini-3.0-flash
      //gemini-2.5-flash
      //gemini-2.0-flash
      //gemini-flash-latest
      //gemini-2.5-flash-lite
      contents: [
        {
          role: "user",
          parts: [
            { text: INSTRUCTIONS },
            {
              inlineData: {
                data: base64Data,
                mimeType,
              },
            },
          ],
        },
      ],
    });

    const text = response.text;
    if (text == null || text === "") {
      throw new Error("Empty model response");
    }
    return text;
  } catch (err) {
   

      console.error("processInvoice:", err?.message ?? err);
      throw err;
    }
  
}
