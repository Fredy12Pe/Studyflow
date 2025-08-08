import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as unknown as { arrayBuffer?: () => Promise<ArrayBuffer> } | null;
    if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);
    const text = data.text || "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("/api/parse-pdf error", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}

