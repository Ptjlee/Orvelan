import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

// We use the Route Handler to securely query Sanity using the token
export async function GET() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "diagnostic"] | order(created_at desc) {
        _id,
        created_at,
        company_name,
        email,
        raw_data,
        ai_summary,
        ai_key_findings,
        ai_action_plan
      }`
    );

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Failed to fetch diagnostics from Sanity:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
