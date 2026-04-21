import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const INSTRUCTIONS = `You are the BillBreeze Financial Assistant. Your job is to help users manage their expenses. Always return data in JSON format when asked for extractions. Be professional, concise, and accurate with numbers. If you are unsure about a value, mark it as null.

Extract the following details from this invoice (image or PDF): vendor name, dates, total amount, tax, currency, and any payment references you see.
Analyze the invoice type and set the category to one of these: ["electricity", "water", "internet", "telecom"].
Always include a raw_data_snapshot object.
Set raw_data_snapshot.raw_ai_response to null (do NOT embed raw JSON or long text inside this field). The backend will store the raw model response safely.
Instructions for Consumption Fields:
unit: Extract the exact unit of measurement found on the invoice (e.g., "kWh" for electricity, "m3" for water, "GB" for internet, "min" for telecom).
 If no unit is explicitly stated, infer the standard unit for that category.
total_usage: Extract the numerical value of the total usage.
period_days: Extract the number of days the billing period covers.

If category is "electricity" i want to give you heads up that:
"contract_number": is Λογ. Συμβολαιου
"invoice_number" is Αρ.Παραστατικου
"payment_password": is  Κωδικος ηλεκτρονικης πληρωμης
"regulated_charges": is Ρυθμιζομενες χρεωσεις
"advance_charges": is Εναντι Καταναλωσης
"municipality_fees":is Διαφορα_Δημος-ΕΡΤ
"vat": is ΦΠΑ 

If category is "water" i want to give you heads up that:
"contract_number": is ΑΡΙΘΜΟΣ ΜΗΤΡΩΟΥ
"due_date": is ΛΗΞΗ ΠΡΟΘΕΣΜΙΑΣ ΛΗΞΗ
"net_consumption_amount": is ΣΥΝΟΛΟ ΤΙΜΗΜΑΤΟΣ
"period_days": is ΗΜΕΡΕΣ ΚΑΤΑΝ.
"total_usage": is ΚΑΤΑΝΑΛΩΣΗ

Important: Do not calculate :total_taxes_and_fees, net_consumption_amount, daily_average, cost_per_unit_net, or cost_per_unit_gross,cost_per_day_net,cost_per_day_gross yourself. Set these values to null in your output. My backend system will perform these calculations to ensure mathematical accuracy.
Leave ai_model_used, timestamp, and processing_latency_ms as null—these will be populated by the backend system.
Return strictly valid JSON.
JSON validity rules (must follow):
- All property names must be double-quoted (e.g., "total_payable_amount": 12.34)
- Use double quotes for all strings (no single quotes)
- No trailing commas
- No comments, no extra text before/after the JSON object
Include a property called ai_analysis. In this field, analyze the bill contextually (e.g. estimated vs actual, consumption hints if visible, payment due urgency).
You can follow this kind of shape (example only; use real values from the document):
{
"category":"string",
"raw_data_snapshot":{
"ai_model_used": "string",
  "timestamp": "string",
  "raw_ai_response": "string",
  "processing_latency_ms": number
},
  "invoice_details": {
    "vendor": "string",
    "invoice_number": "string",
    "invoice_type": "string",
    "issue_date": "Date",
    "due_date": "Date",
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
    "charges_supply_vendor": 0,
    "regulated_charges": 0,
    "advance_charges": 0,
    "municipality_fees": 0,
    "vat": 0,
    "total_payable_amount": 0,
    "net_consumption_amount": 0,
    "total_taxes_and_fees": 0,
    "currency": "EUR"
  },
  "consumption": {
    "unit": "kWh",            
    "total_usage": 0,         
    "period_days": 0,         
    "daily_average": 0,       
    "cost_per_unit_net": 0,   
    "cost_per_unit_gross": 0,
    "cost_per_day_net": 0,
    "cost_per_day_gross": 0
  },
  "ai_analysis": "string"
}`;

//daily_average, cost_per_unit_net, or cost_per_unit_gross

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
      model: "gemini-flash-lite-latest",

      //gemini-2.5-flash
      //gemini-2.0-flash
      //gemini-flash-latest
      //gemini-2.5-flash-lite
      //gemini-3-pro-preview
      //gemma-3-1b-it
      //gemini-embedding-2-preview
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
