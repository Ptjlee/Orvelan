import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { sanityClient } from "@/lib/sanity";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Dynamically identify the email and company name from the form questions
    // Since questions can be in French or English, we check keys for keywords.
    const emailKey = Object.keys(data).find(k => k.toLowerCase().includes("e-mail") || k.toLowerCase().includes("email"));
    const companyKey = Object.keys(data).find(k => k.toLowerCase().includes("société") || k.toLowerCase().includes("company"));
    
    const email = emailKey ? data[emailKey] : "Unknown";
    const company = companyKey ? data[companyKey] : "Unknown";

    // 1. Ask Gemini to analyze the diagnostic data
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            summary_fr: { type: SchemaType.STRING, description: "Résumé exécutif en français" },
            summary_en: { type: SchemaType.STRING, description: "Executive summary in English" },
            key_findings_fr: { type: SchemaType.STRING, description: "Constats clés détaillés en français" },
            key_findings_en: { type: SchemaType.STRING, description: "Detailed key findings in English" },
            action_plan_fr: { type: SchemaType.STRING, description: "Plan d'action en français" },
            action_plan_en: { type: SchemaType.STRING, description: "Action plan in English" }
          },
          required: ["summary_fr", "summary_en", "key_findings_fr", "key_findings_en", "action_plan_fr", "action_plan_en"]
        }
      }
    });
    const contextStr = JSON.stringify(data, null, 2);

    const prompt = `
Vous êtes un consultant expert en stratégie des organisations et performance d'entreprise. 
Voici les réponses au diagnostic de l'entreprise suivante:
- Entreprise: ${company}
- Contact: ${email}
- Données brutes (Questions et Réponses du dirigeant):
${contextStr}

Votre tâche professionnelle consiste à fournir 3 éléments clés (qui doivent tous être fournis à la fois en Français et en Anglais):
1. "summary": Un résumé exécutif (Executive Summary) concis et percutant.
2. "key_findings": Une analyse approfondie des constats clés (Key Findings), beaucoup plus longue et détaillée que le résumé, identifiant les problèmes et fragilités profondes basés sur les réponses spécifiques.
3. "action_plan": Un plan d'action immédiat et des recommandations stratégiques, étape par étape.

Important:
Renvoie UNIQUEMENT un objet JSON valide avec exactement ces 6 clés, sans aucun formatage markdown additionnel :
{
  "summary_fr": "Résumé en français...",
  "summary_en": "Summary in english...",
  "key_findings_fr": "Analyse détaillée en français...",
  "key_findings_en": "Detailed analysis in english...",
  "action_plan_fr": "Plan d'action en français...",
  "action_plan_en": "Action plan in english..."
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up if Gemini accidentally returns ```json
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let aiSummary = "{}";
    let aiKeyFindings = "{}";
    let aiActionPlan = "{}";

    try {
      const parsed = JSON.parse(responseText);
      aiSummary = JSON.stringify({ fr: parsed.summary_fr, en: parsed.summary_en });
      aiKeyFindings = JSON.stringify({ fr: parsed.key_findings_fr, en: parsed.key_findings_en });
      aiActionPlan = JSON.stringify({ fr: parsed.action_plan_fr, en: parsed.action_plan_en });
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", err);
      // Fallback
      aiSummary = JSON.stringify({ fr: responseText, en: responseText });
      aiKeyFindings = JSON.stringify({ fr: "Erreur de formatage.", en: "Formatting error." });
      aiActionPlan = JSON.stringify({ fr: "Erreur de formatage.", en: "Formatting error." });
    }

    // 2. Insert into Sanity 'diagnostic' document type
    const doc = {
      _type: 'diagnostic',
      company_name: company,
      email: email,
      raw_data: JSON.stringify(data), // We stringify to avoid dynamic key schema errors in Sanity
      ai_summary: aiSummary,
      ai_key_findings: aiKeyFindings,
      ai_action_plan: aiActionPlan,
      created_at: new Date().toISOString()
    };

    try {
      if (process.env.SANITY_API_TOKEN) {
        await sanityClient.create(doc);
      } else {
        console.warn("SANITY_API_TOKEN is missing. Skipping database insert.");
      }
    } catch (dbError) {
      console.error("Sanity insert error:", dbError);
      return NextResponse.json({ error: "Failed to store in database" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Diagnostic API Error:", error);
    return NextResponse.json({ error: "Server processing error" }, { status: 500 });
  }
}
