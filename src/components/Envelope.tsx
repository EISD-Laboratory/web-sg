"use strict";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface SimpleEnvelopeProps {
  status: "Passed" | "Failed";
}

export function Envelope({ status }: SimpleEnvelopeProps) {
  const [flapOpen, setFlapOpen] = useState(false);
  const [letterOut, setLetterOut] = useState(false);

  useEffect(() => {
    // Sequence: Open flap (600ms), then slide letter (1200ms)
    const flapTimer = setTimeout(() => {
      setFlapOpen(true);
      
      // Trigger confetti slightly after flap starts opening
      if (status === "Passed") {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 300); // 600ms + 300ms = 900ms total delay
      }
    }, 600);

    const letterTimer = setTimeout(() => setLetterOut(true), 1200);
    return () => {
      clearTimeout(flapTimer);
      clearTimeout(letterTimer);
    };
  }, [status]);

  const isPassed = status === "Passed";

  return (
    <div className="relative flex items-center justify-center pt-12 pb-8">
      {/* 
        Container Frame 
        Total Height: h-32 (128px)
        Envelope Body Height: h-20 (80px) -> occupies bottom 80px
        Flap Height: h-12 (48px) -> fits exactly in the top 48px when open
      */}
      <div className="relative h-32 w-48">

        {/* Confetti (Only if passed) */}
        {isPassed && letterOut && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  "absolute rounded-full animate-confetti opacity-0",
                  [
                    "bg-yellow-400 h-2 w-2", "bg-blue-400 h-1.5 w-3", "bg-pink-400 h-2 w-2",
                    "bg-green-400 h-1.5 w-1.5", "bg-purple-400 h-2.5 w-1.5", "bg-orange-400 h-2 w-2"
                  ][i % 6]
                )}
                style={{
                  top: "40%",
                  left: "50%",
                  animationDelay: `${i * 0.1}s`,
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-80px)`,
                }}
              />
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* LAYER 1 (z-10): Envelope Back Body          */}
        {/* Height: 20 (80px), Aligned Bottom           */}
        {/* ============================================ */}
        <div
          className={cn(
            "absolute bottom-0 w-full h-20 rounded-b-md shadow-sm z-10",
            isPassed ? "bg-primary" : "bg-gray-400"
          )}
        />

        {/* ============================================ */}
        {/* LAYER 2 (z-15): Top Flap                    */}
        {/* Position: Top-12 (48px from top).           */}
        {/* This aligns exactly with the top of the body (128 - 80 = 48). */}
        {/* Height: 12 (48px).                          */}
        {/* Origin: Top.                                */}
        {/* Closed (0deg): Hangs down over the body.    */}
        {/* Open (180deg): Flips up into the top space. */}
        {/* ============================================ */}
        <div
          className={cn(
            "absolute left-0 w-full h-12 z-15 origin-top transition-transform duration-700 ease-in-out",
            "top-12" 
          )}
          style={{
            transformStyle: "preserve-3d",
            transform: flapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
          }}
        >
          <svg
            viewBox="0 0 100 40" 
            className="w-full h-full drop-shadow-sm" 
            preserveAspectRatio="none"
          >
            {/* 
               Triangle pointing DOWN.
               Tip reaches bottom of the flap height.
            */}
            <path
              d="M0,0 L50,40 L100,0 Z"
              className={isPassed ? "fill-primary" : "fill-gray-500"}
            />
          </svg>
        </div>

        {/* ============================================ */}
        {/* LAYER 3 (z-20): Letter / Paper               */}
        {/* Slides up from inside                       */}
        {/* ============================================ */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-md shadow-sm border border-gray-100 z-20 transition-all duration-1000 ease-out flex flex-col items-center justify-center p-3",
            letterOut
              ? "bottom-[35%] h-[75%] opacity-100" // Sticks out nicely
              : "bottom-0 h-[60%] opacity-0"      // Hidden inside
          )}
        >
           {/* Content skeleton */}
           <div className="w-full space-y-2 opacity-60">
             <div className="h-1.5 w-1/3 bg-gray-300 rounded-full mx-auto" />
             <div className="h-1 w-full bg-gray-200 rounded-full" />
             <div className="h-1 w-5/6 bg-gray-200 rounded-full mx-auto" />
             <div className="h-1 w-full bg-gray-200 rounded-full" />
           </div>
           
           <div className={cn(
             "mt-3 text-[10px] font-bold uppercase tracking-widest",
             isPassed ? "text-primary" : "text-gray-400"
           )}>
             {isPassed ? "Accepted" : "Notice"}
           </div>
        </div>

        {/* ============================================ */}
        {/* LAYER 4 (z-30): Front Pocket                */}
        {/* Height: 20 (80px), Aligned Bottom           */}
        {/* ============================================ */}
        <div className="absolute bottom-0 w-full h-20 z-30 pointer-events-none rounded-b-md overflow-hidden">
           <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
              {/* Pocket shape */}
              <path 
                d="M0,0 L50,35 L100,0 L100,60 L0,60 Z" 
                className={isPassed ? "fill-primary" : "fill-gray-400"}
              />
              {/* Inner stroke for depth */}
              <path d="M0,0 L50,35 L100,0" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
           </svg>
        </div>

      </div>
    </div>
  );
}
