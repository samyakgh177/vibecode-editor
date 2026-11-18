import { scanTemplateDirectory } from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import { STATIC_TEMPLATES } from "@/lib/templates-data";
import path from "path";
import { NextRequest } from "next/server";
import fs from "fs";

function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data)); // Ensures it's serializable
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findUnique({
    where: { id },
  });

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const rawKey = (playground.template || "REACT").toUpperCase();
  const templateKey = (rawKey in STATIC_TEMPLATES ? rawKey : "REACT") as keyof typeof STATIC_TEMPLATES;

  // 1. High-speed, 100% reliable static template (works across Vercel serverless without filesystem latency or ENOENT)
  if (STATIC_TEMPLATES[templateKey]) {
    return Response.json(
      { success: true, templateJson: STATIC_TEMPLATES[templateKey] },
      { status: 200 }
    );
  }

  // 2. Dynamic filesystem scan fallback
  const templatePath = templatePaths[templateKey as keyof typeof templatePaths] || templatePaths.REACT;

  try {
    const inputPath = path.join(process.cwd(), templatePath);
    if (fs.existsSync(inputPath)) {
      const result = await scanTemplateDirectory(inputPath);
      if (validateJsonStructure(result.items)) {
        return Response.json(
          { success: true, templateJson: result },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Error scanning template directory:", error);
  }

  // 3. Guaranteed fallback to REACT template
  return Response.json(
    { success: true, templateJson: STATIC_TEMPLATES.REACT },
    { status: 200 }
  );
}
