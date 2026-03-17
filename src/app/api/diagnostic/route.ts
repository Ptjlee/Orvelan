import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { sanityClient } from "@/lib/sanity";

export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const GOOGLE_FORM_VIEW_URL = "https://docs.google.com/forms/d/e/1FAIpQLScqwkvqVhJUCz8tnyfflARXZaz4kJJ8vlOJDCqrcvN5S8eGQQ/viewform";
const GOOGLE_FORM_POST_URL = "https://docs.google.com/forms/d/e/1FAIpQLScqwkvqVhJUCz8tnyfflARXZaz4kJJ8vlOJDCqrcvN5S8eGQQ/formResponse";

const BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Fetches the Google Form to get the required session cookie + hidden fields (fbzx, fvv, etc.)
// Google Forms requires the session cookie from the page load to be sent with the POST submission.
// Without it, Google records a timestamp but stores all field values as empty.
async function getFormSession(): Promise<{ cookieStr: string; hiddenFields: Record<string, string> }> {
  const getRes = await fetch(GOOGLE_FORM_VIEW_URL, {
    headers: {
      "User-Agent": BROWSER_UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "fr-FR,fr;q=0.9",
    },
    redirect: "follow"
  });

  // Capture the session cookie Google sets when loading the form
  const setCookieHeader = getRes.headers.get("set-cookie") || "";
  const cookies = setCookieHeader.split(",").map(c => c.split(";")[0].trim()).filter(Boolean);
  const cookieStr = cookies.join("; ");

  const html = await getRes.text();

  // Extract all hidden fields (fbzx, fvv, pageHistory, partialResponse, submissionTimestamp)
  const hiddenFields: Record<string, string> = {};
  const matches = html.matchAll(/name="([^"]+)"\s+value="([^"]*)"/g);
  for (const m of matches) {
    const name = m[1];
    const value = m[2].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    if (!name.startsWith("entry.")) {
      hiddenFields[name] = value;
    }
  }

  return { cookieStr, hiddenFields };
}

// Runs AI analysis + saves to Sanity in the background (after response is sent to client)
async function runBackgroundAnalysis(data: Record<string, string>, company: string, email: string) {
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

  const doc = {
    _type: 'diagnostic',
    company_name: company,
    email: email,
    raw_data: JSON.stringify(data),
    ai_summary: aiSummary,
    ai_key_findings: aiKeyFindings,
    ai_action_plan: aiActionPlan,
    created_at: new Date().toISOString()
  };

  if (process.env.SANITY_API_TOKEN) {
    await sanityClient.create(doc);
  } else {
    console.warn("SANITY_API_TOKEN is missing. Skipping database insert.");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = body.readableData ?? body;
    const rawEntryData: Record<string, string> | undefined = body.rawEntryData;

    const emailKey = Object.keys(data).find(k => k.toLowerCase().includes("e-mail") || k.toLowerCase().includes("email"));
    const companyKey = Object.keys(data).find(k => k.toLowerCase().includes("société") || k.toLowerCase().includes("company"));
    
    const email = emailKey ? data[emailKey] : "Unknown";
    const company = companyKey ? data[companyKey] : "Unknown";

    // 1. Load the Google Form page to get the session cookie + hidden fields.
    //    Google Forms uses a session cookie (S=spreadsheet_forms=...) paired with
    //    the fbzx token as CSRF protection. Both must be present for field data to be stored.
    if (rawEntryData) {
      try {
        const { cookieStr, hiddenFields } = await getFormSession();
        console.log("Session cookie:", cookieStr.substring(0, 80));
        console.log("Hidden fields:", Object.keys(hiddenFields));

        const formParams = new URLSearchParams();
        // Add session-bound hidden fields first
        Object.entries(hiddenFields).forEach(([key, value]) => {
          formParams.append(key, value);
        });
        // Add form answers
        Object.entries(rawEntryData).forEach(([key, value]) => {
          formParams.append(key, value);
        });

        const postHeaders: Record<string, string> = {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": BROWSER_UA,
          "Referer": GOOGLE_FORM_VIEW_URL,
          "Origin": "https://docs.google.com",
        };
        if (cookieStr) {
          postHeaders["Cookie"] = cookieStr;
        }

        const gfRes = await fetch(GOOGLE_FORM_POST_URL, {
          method: "POST",
          headers: postHeaders,
          body: formParams.toString(),
          redirect: "follow"
        });
        console.log("Google Forms relay status:", gfRes.status);
      } catch (gfError) {
        console.error("Google Forms relay error:", gfError);
      }
    }

    // 2. AI analysis + Sanity save run in background after response is sent
    runBackgroundAnalysis(data, company, email).catch(err => 
      console.error("Background AI analysis error:", err)
    );

    // 3. Return success to client immediately (~1-2 seconds)
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Diagnostic API Error:", error);
    return NextResponse.json({ error: "Server processing error" }, { status: 500 });
  }
}
