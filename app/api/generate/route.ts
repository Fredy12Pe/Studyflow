import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const system = "You are a helpful study assistant. Create concise study notes and 6 clear Q/A flashcards from the provided text.";
    const user = `Text to study:\n\n${text}\n\nReturn JSON with keys: notes (markdown, concise), flashcards (array of 6 objects with question and answer).`;

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: system },
        { role: "user", content: [{ type: "text", text: user }] as any }
      ],
      response_format: { type: "json_object" }
    });

    const content = resp.choices?.[0]?.message?.content ?? "{}";

    return NextResponse.json({ output: JSON.parse(content) });
  } catch (error) {
    console.error("/api/generate error", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}

