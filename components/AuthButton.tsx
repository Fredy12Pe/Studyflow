'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function AuthButton(){
  const [user,setUser]=useState<User|null>(null);
  useEffect(()=>onAuthStateChanged(auth,setUser),[]);
  if(!user){
    return <button onClick={()=>signInWithPopup(auth,new GoogleAuthProvider())}
      className="px-4 py-2 rounded-xl bg-black text-white">Sign in with Google</button>;
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{user.displayName || user.email}</span>
      <button onClick={()=>signOut(auth)} className="px-3 py-1 rounded-xl bg-gray-200">Sign out</button>
    </div>
  );
}


