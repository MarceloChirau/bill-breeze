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

/**
 * @param {string} base64Data - file bytes as base64
 * @param {string} mimeType - e.g. image/jpeg, application/pdf
 */
export async function processInvoice(base64Data, mimeType) {
  const genAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const response = await genAi.models.generateContent({
      model: "gemini-2.5-flash",
      //Gemini 2.5 Flash
      //gemini-2.0-flash
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
