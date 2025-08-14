"use client";

import { useState } from 'react';
import AuthButton from '@/components/AuthButton';
import UploadZone from '@/components/UploadZone';
import LinkPaste from '@/components/LinkPaste';

export default function Home(){
  const [parsed, setParsed] = useState('');
  const [notes, setNotes] = useState('');
  const [cards, setCards] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mode, setMode] = useState<'pdf'|'link'>('pdf');

  return (
    <main className="max-w-md mx-auto px-5 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">StudyFlow</h1>
        <AuthButton />
      </div>

      <header className="rounded-3xl p-5 hero-gradient text-white shadow-lg">
        <h2 className="text-xl font-semibold">Create Study Materials From:</h2>

        {/* Segmented control */}
        <div className="mt-5 flex gap-4">
          <button
            type="button"
            aria-pressed={mode==='pdf'}
            onClick={()=>setMode('pdf')}
            className="inline-flex items-center gap-2 rounded-[20px] px-5 py-3 text-base font-semibold shadow-elev-1"
            style={{
              background: mode==='pdf' ? 'var(--danger)' : 'rgba(255,255,255,0.1)',
              color: mode==='pdf' ? '#ffffff' : 'rgba(255,255,255,0.7)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" opacity=".2"/><path d="M14 2v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            PDF
          </button>
          <button
            type="button"
            aria-pressed={mode==='link'}
            onClick={()=>setMode('link')}
            className="inline-flex items-center gap-2 rounded-[20px] px-5 py-3 text-base font-semibold shadow-elev-1"
            style={{
              background: mode==='link' ? '#3b3f52' : 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.7)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1"/><path d="M14 11a5 5 0 0 1-7 0l-1-1a5 5 0 0 1 0-7 5 5 0 0 1 7 0l1 1"/></svg>
            Link
          </button>
        </div>

        {/* Title input */}
        <div className="mt-4">
          <input
            className="w-full rounded-2xl bg-[rgba(255,255,255,0.08)] border border-white/30 px-4 py-3 text-white placeholder:text-white/28"
            placeholder="Add name for study set"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />
        </div>

        {/* Upload zone or link paste based on mode */}
        <div className="mt-4">
          {mode==='pdf' ? (
            <UploadZone onParsed={setParsed} variant="hero"/>
          ) : (
            <LinkPaste onParsed={setParsed} variant="hero"/>
          )}
        </div>

        {/* Title + Create appears after text is parsed */}
        {parsed && (
          <div className="mt-4 grid gap-3">
            <button
              className="rounded-2xl px-5 py-3 font-semibold shadow-elev-1"
              style={{ background: 'var(--primary)', color: '#fff' }}
              disabled={creating}
              onClick={async ()=>{
                if(!parsed) return; setCreating(true);
                try{
                  const r = await fetch('/api/generate',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: parsed }) });
                  const d = await r.json();
                  setNotes(d.notes || '');
                  setCards(d.flashcards || []);
                } finally { setCreating(false); }
              }}
            >{creating? 'Creating…' : 'Create'}</button>
          </div>
        )}
      </header>

      {/* Generation controls moved into the hero; nothing here */}

      {notes && (
        <section className="space-y-2">
          <h3 className="font-semibold text-lg">Notes (preview)</h3>
          <div className="rounded-xl border p-3 prose prose-sm max-w-none whitespace-pre-wrap bg-white">{notes}</div>
        </section>
      )}

      {cards?.length>0 && (
        <section className="space-y-2">
          <h3 className="font-semibold text-lg">Flashcards (preview)</h3>
          <ul className="space-y-2">
            {cards.map((c,i)=>(
              <li key={i} className="rounded-xl border p-3 bg-white">
                <div className="font-medium">{c.front}</div>
                <div className="text-sm opacity-80">{c.back}</div>
              </li>
            ))}
          </ul>
          <button
            className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white"
            disabled={saving}
            onClick={async ()=>{
              setSaving(true);
              const r = await fetch('/api/save',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ userId:'demo', title, notesMarkdown:notes, flashcards:cards })
              });
              const d = await r.json(); setSaving(false);
              if(d.setId) window.location.href = `/sets/${d.setId}`;
            }}
          >{saving? 'Saving…' : 'Save Set'}</button>
        </section>
      )}
    </main>
  );
}
