import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request){
  try {
    const fd = await req.formData();
    const file = fd.get('file') as File | null;
    if(!file) return NextResponse.json({ error:'No file' }, { status:400 });

    const buf = Buffer.from(await file.arrayBuffer());

    // Use the explicit ESM path to avoid bundling issues
    const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
    const { getDocument } = pdfjs as any;

    const loadingTask = getDocument({ data: buf });
    const pdf = await loadingTask.promise;

    let text = '';
    for (let p = 1; p <= pdf.numPages; p++){
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      text += (content.items as any[]).map((i:any)=>i.str).join(' ') + '\n';
    }
    return NextResponse.json({ text });
  } catch (err) {
    console.error('parse-pdf error', err);
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}

