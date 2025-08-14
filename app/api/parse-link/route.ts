import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
export const runtime = 'nodejs';

export async function POST(req: Request){
  const { url } = await req.json();
  if(!url) return NextResponse.json({ error:'No URL' }, { status:400 });
  const html = await fetch(url).then(r=>r.text());
  const dom = new JSDOM(html, { url });
  const article = new Readability(dom.window.document).parse();
  return NextResponse.json({
    title: article?.title || 'Untitled',
    text: article?.textContent || ''
  });
}

