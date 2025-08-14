'use client';
import { useState } from 'react';

export default function AIComposer({ text, onResult }:{ text:string; onResult:(notes:string,cards:any[])=>void }){
  const [busy,setBusy]=useState(false);
  if(!text) return null;
  return (
    <div className="space-y-3">
      <button className="px-4 py-2 rounded-xl bg-blue-600 text-white" disabled={busy}
        onClick={async ()=>{
          setBusy(true);
          const r = await fetch('/api/generate',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text }) });
          const d = await r.json(); setBusy(false);
          onResult(d.notes || '', d.flashcards || []);
        }}
      >{busy? 'Generating…' : 'Generate Notes & Flashcards'}</button>

      <details className="rounded-xl border p-3">
        <summary className="cursor-pointer font-medium">Preview extracted text</summary>
        <pre className="whitespace-pre-wrap text-sm opacity-80">{text.slice(0,4000)}</pre>
      </details>
    </div>
  );
}


