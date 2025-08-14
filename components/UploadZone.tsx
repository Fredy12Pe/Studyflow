'use client';
import { useState } from 'react';

export default function UploadZone({ onParsed, variant='light' }:{ onParsed:(t:string)=>void; variant?: 'light'|'hero' }){
  const [busy,setBusy]=useState(false);

  async function handleFile(f: File){
    setBusy(true);
    const fd = new FormData(); fd.append('file', f);
    try {
      const r = await fetch('/api/parse-pdf',{ method:'POST', body: fd });
      const txt = await r.text();
      let d: any = {};
      try { d = JSON.parse(txt); } catch { d = { text: '' }; }
      onParsed(d.text || '');
    } finally {
      setBusy(false);
    }
  }

  const isHero = variant === 'hero';

  return (
    <div className={isHero
        ? "rounded-[28px] neon-dashed p-6 text-center surface/0"
        : "rounded-2xl border-2 border-dashed p-6 text-center bg-white/70"}
    >
      <input id="pdfInput" className="hidden" type="file" accept="application/pdf"
        onChange={(e)=>{ const f=e.target.files?.[0]; if(f) handleFile(f); }} />
      <label htmlFor="pdfInput" className={isHero
        ? "inline-block px-5 py-3 rounded-full bg-rose-500 text-white cursor-pointer font-semibold"
        : "inline-block px-4 py-2 rounded-full bg-rose-500 text-white cursor-pointer"}
      >
        Upload PDF
      </label>
      <p className={isHero ? "mt-2 text-sm text-white/80" : "mt-2 text-sm opacity-70"}>
        {busy? 'Processing…' : 'Drop file here or tap to upload'}
      </p>
    </div>
  );
}


