import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json({ success: false, error: "Missing Sanity configuration" }, { status: 500 });
    }

    // Delete the document from Sanity
    await sanityClient.delete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete from database" }, { status: 500 });
  }
}
