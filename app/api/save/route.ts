import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function POST(req: Request){
  const { userId, title, notesMarkdown, flashcards } = await req.json();
  if(!userId || !title) return NextResponse.json({ error:'Missing fields' }, { status:400 });

  const setRef = await addDoc(collection(db,'study_sets'), {
    userId, title, createdAt: serverTimestamp(), sourceType:'pdf_or_link'
  });

  if (notesMarkdown){
    await addDoc(collection(db,'notes'), {
      setId: setRef.id, markdown: notesMarkdown, createdAt: serverTimestamp()
    });
  }

  if (Array.isArray(flashcards)){
    const col = collection(db,'flashcards');
    for (const c of flashcards){
      await addDoc(col, {
        setId: setRef.id,
        front: c.front, back: c.back, tags: c.tags || [],
        ease: 2.5, interval: 0, dueAt: new Date().toISOString(), reps: 0,
        createdAt: serverTimestamp()
      });
    }
  }

  return NextResponse.json({ setId: setRef.id });
}


