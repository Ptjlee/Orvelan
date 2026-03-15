import { createClient } from "@sanity/client";

// Ensure build doesn't crash if env vars are missing during compilation
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || "placeholder";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-03-15",
  useCdn: false, // Set to false to always get the latest data exactly when it's updated
  token, // Token is required for mutations (creating the document)
});
