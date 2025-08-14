import { NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request){
  if(!process.env.OPENAI_API_KEY){
    return NextResponse.json({ error: 'Server missing OPENAI_API_KEY. Add it to .env.local and restart.' }, { status: 500 });
  }
  const { text } = await req.json();
  if(!text) return NextResponse.json({ error:'No text' }, { status:400 });

  const sys = 'You are a precise study assistant. Produce concise notes and JSON flashcards.';
  const user = `
From the TEXT below:
1) Create concise bullet notes (<=18 words each). Use **bold** for key terms. Return as Markdown.
2) Create 10 flashcards of simple, testable facts. Return a JSON array:
[{"front":"...","back":"...","tags":["topic"]}]
TEXT:
${text}`;

  const r = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [{ role:'system', content: sys }, { role:'user', content: user }]
  });

  const content = r.choices[0].message?.content || '';
  const match = content.match(/\[[\s\S]*\]$/);
  const flashcards = match ? JSON.parse(match[0]) : [];
  const notes = match ? content.replace(match[0],'').trim() : content;

  return NextResponse.json({ notes, flashcards });
}

