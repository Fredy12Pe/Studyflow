'use client';
import { useState } from 'react';

export default function LinkPaste({ onParsed, variant='light' }:{ onParsed:(t:string)=>void; variant?: 'light'|'hero' }){
  const [url,setUrl]=useState('');
  const [busy,setBusy]=useState(false);

  const isHero = variant === 'hero';

  return (
    <div className="flex gap-2">
      <input
        className={isHero
          ? "flex-1 rounded-xl bg-[rgba(255,255,255,0.08)] border border-white/30 px-3 py-3 text-white placeholder:text-white/60"
          : "flex-1 rounded-xl border px-3 py-2"}
        placeholder="Paste article link"
        value={url} onChange={(e)=>setUrl(e.target.value)}
      />
      <button
        className={isHero ? "px-4 py-3 rounded-xl bg-violet-600 text-white" : "px-4 py-2 rounded-xl bg-violet-600 text-white"}
        onClick={async ()=>{
          if(!url) return; setBusy(true);
          const r = await fetch('/api/parse-link', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ url }) });
          const d = await r.json(); setBusy(false); onParsed(d.text || '');
        }}
      >{busy? 'Parsing…' : 'Parse'}</button>
    </div>
  );
}


