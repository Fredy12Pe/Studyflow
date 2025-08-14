'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function SetPage({ params }:{ params:{ id:string } }){
  const [set, setSet] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);

  useEffect(()=>{ (async()=>{
    const d = await getDoc(doc(db,'study_sets',params.id));
    if(d.exists()) setSet({ id:d.id, ...d.data() });
    const snap = await getDocs(query(collection(db,'flashcards'), where('setId','==',params.id)));
    setCards(snap.docs.map(x=>({ id:x.id, ...x.data() })));
  })(); },[params.id]);

  if(!set) return <main className="p-6">Loading…</main>;

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{set.title}</h1>
      <div className="text-sm opacity-70">{cards.length} cards</div>
      <button className="px-4 py-2 rounded-xl bg-blue-600 text-white"
        onClick={()=>window.location.href=`/review/${params.id}`}>Review Next Set</button>
    </main>
  );
}


