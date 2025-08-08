import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: `Fetch failed (${res.status})` }, { status: 502 });
    }
    const html = await res.text();

    const dom = new JSDOM(html, { url });
    const document = dom.window.document;
    const reader = new Readability(document);
    const article = reader.parse();

    // Fallback extraction if Readability fails
    let title = article?.title ?? document.querySelector("title")?.textContent ?? "Untitled";
    let text = article?.textContent ?? "";
    if (!text) {
      document.querySelectorAll("script,style,noscript").forEach((el) => el.remove());
      const bodyText = document.body?.textContent || "";
      text = bodyText.replace(/\s+/g, " ").trim();
    }

    return NextResponse.json({ title, text });
  } catch (error) {
    console.error("/api/parse-link error", error);
    return NextResponse.json({ error: "Failed to parse link" }, { status: 500 });
  }
}

