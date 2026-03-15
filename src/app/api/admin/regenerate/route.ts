import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { sanityClient } from "@/lib/sanity";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing diagnostic ID" }, { status: 400 });
    }

    // 1. Fetch from Sanity
    const doc = await sanityClient.getDocument(id);
    if (!doc || !doc.raw_data) {
      return NextResponse.json({ error: "Document or raw_data not found" }, { status: 404 });
    }

    const data = JSON.parse(doc.raw_data);
    const email = doc.email || "Unknown";
    const company = doc.company_name || "Unknown";

    // 2. Run Gemini
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
      aiSummary = JSON.stringify({ fr: responseText, en: responseText });
      aiKeyFindings = JSON.stringify({ fr: "Erreur de formatage.", en: "Formatting error." });
      aiActionPlan = JSON.stringify({ fr: "Erreur de formatage.", en: "Formatting error." });
    }

    // 3. Patch Sanity
    const updatedDoc = await sanityClient
      .patch(id)
      .set({
        ai_summary: aiSummary,
        ai_key_findings: aiKeyFindings,
        ai_action_plan: aiActionPlan
      })
      .commit();

    return NextResponse.json({ success: true, doc: updatedDoc });

  } catch (error: any) {
    console.error("Regenerate AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
