'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { nextSchedule, Rating } from '@/lib/srs';

export default function Review({ params }:{ params:{ id:string } }){
  const [cards,setCards]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [showBack,setShowBack]=useState(false);

  useEffect(()=>{ (async()=>{
    const snap=await getDocs(query(collection(db,'flashcards'), where('setId','==',params.id)));
    const all = snap.docs.map(d=>({id:d.id,...d.data()}));
    const due = all.filter(c=> (c.dueAt ? new Date(c.dueAt) : new Date()) <= new Date());
    setCards(due.length ? due : all);
  })(); },[params.id]);

  const card = cards[idx];
  if(!card) return <main className="p-6">No cards due 🎉</main>;

  async function grade(r: Rating){
    const { ease, interval, dueAt } = nextSchedule(card.ease, card.interval, r);
    await updateDoc(doc(db,'flashcards',card.id), { ease, interval, dueAt, reps:(card.reps||0)+1 });
    setShowBack(false);
    setIdx(i => (i+1<cards.length ? i+1 : 0));
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <div className="rounded-2xl border p-6 min-h-[180px] bg-white shadow-sm">
        <div className="text-lg font-medium">{showBack ? card.back : card.front}</div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-xl bg-gray-200" onClick={()=>setShowBack(s=>!s)}>
          {showBack ? 'Show Front' : 'Show Back'}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button className="px-3 py-2 rounded-lg bg-rose-500 text-white" onClick={()=>grade('again')}>Again</button>
        <button className="px-3 py-2 rounded-lg bg-amber-500 text-white" onClick={()=>grade('hard')}>Hard</button>
        <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={()=>grade('good')}>Good</button>
        <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white" onClick={()=>grade('easy')}>Easy</button>
      </div>
      <div className="text-sm opacity-70">{idx+1} / {cards.length} due</div>
    </main>
  );
}


