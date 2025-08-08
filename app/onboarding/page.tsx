"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const force = searchParams.get("force");
    const done = typeof window !== "undefined" && localStorage.getItem("onboardingCompleted");
    if (done && !force) router.replace("/");
  }, [router, searchParams]);

  function handleStart() {
    setPressed(true);
    // Brief delay to show pressed visual state before navigating
    setTimeout(() => {
      try {
        localStorage.setItem("onboardingCompleted", "1");
      } catch {}
      router.replace("/");
    }, 120);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-end px-6 pb-12">
      <div className="w-full text-center flex flex-col items-center gap-3">
        <h1 className="text-white text-3xl font-bold leading-tight">
          Let’s Make Studying Easy
        </h1>
        <p className="text-white/90 text-base tracking-wide">
          From textbooks to cheat sheets AI transforms your material into
          bite-sized learning.
        </p>
      </div>

      <button
        aria-label="Get started"
        onClick={handleStart}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        className="mt-8 active:scale-95 transition-transform"
      >
        <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="42" cy="42" r="41.5" stroke="white"/>
          <circle cx="42.4444" cy="42" r="33.4444" fill={pressed ? "#BFBFBF" : "white"}/>
          <path opacity="0.4" d="M38.2025 43.1903L34.5033 43.5175C33.6731 43.5175 33 42.8378 33 41.9996C33 41.1613 33.6731 40.4817 34.5033 40.4817L38.2025 40.8088C38.8537 40.8088 39.3817 41.3419 39.3817 41.9996C39.3817 42.6583 38.8537 43.1903 38.2025 43.1903" fill={pressed ? "#FFFFFF" : "#1930FF"}/>
          <path d="M50.6247 43.1302C50.5669 43.1885 50.3509 43.4353 50.148 43.6402C48.9644 44.9234 45.8739 47.0218 44.2572 47.664C44.0117 47.7665 43.391 47.9846 43.0583 48C42.7408 48 42.4375 47.9262 42.1485 47.7808C41.7874 47.577 41.4994 47.2554 41.3401 46.8764C41.2387 46.6143 41.0794 45.8267 41.0794 45.8124C40.9212 44.9521 40.835 43.5531 40.835 42.0066C40.835 40.535 40.9212 39.1933 41.051 38.3187C41.0652 38.3033 41.2245 37.3262 41.3979 36.9914C41.7154 36.3789 42.3361 36 43.0005 36H43.0583C43.4914 36.0143 44.4012 36.3943 44.4012 36.4076C45.9317 37.0498 48.9491 39.0468 50.1622 40.3742C50.1622 40.3742 50.5047 40.7156 50.6531 40.9282C50.8844 41.2344 51 41.6134 51 41.9923C51 42.4153 50.8702 42.8085 50.6247 43.1302" fill={pressed ? "#FFFFFF" : "#1930FF"}/>
        </svg>
      </button>
    </div>
  );
}

