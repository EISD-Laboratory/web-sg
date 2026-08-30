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
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setFlapOpen(true);
      setLetterOut(true);
      return;
    }

    const flapTimer = setTimeout(() => {
      setFlapOpen(true);

      if (status === "Passed") {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 300);
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

        {/* Envelope Back Body */}
        <div
          className={cn(
            "absolute bottom-0 w-full h-20 rounded-b-md shadow-sm z-10",
            isPassed ? "bg-primary" : "bg-gray-400"
          )}
        />

        {/* Top Flap */}
        <div
          className={cn(
            "absolute left-0 w-full h-12 z-15 origin-top transition-transform duration-700",
            "top-12"
          )}
          style={{
            transformStyle: "preserve-3d",
            transform: flapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
            transitionTimingFunction: "var(--ease-in-out)",
          }}
        >
          <svg
            viewBox="0 0 100 40"
            className="w-full h-full drop-shadow-sm"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L50,40 L100,0 Z"
              className={isPassed ? "fill-primary" : "fill-gray-500"}
            />
          </svg>
        </div>

        {/* Letter / Paper */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-md shadow-sm border border-gray-100 z-20 flex flex-col items-center justify-center p-3",
            letterOut
              ? "bottom-[35%] h-[75%] opacity-100 transition-all duration-1000"
              : "bottom-0 h-[60%] opacity-0 transition-all duration-500"
          )}
          style={{
            transitionTimingFunction: "var(--ease-out)",
          }}
        >
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

        {/* Front Pocket */}
        <div className="absolute bottom-0 w-full h-20 z-30 pointer-events-none rounded-b-md overflow-hidden">
           <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,0 L50,35 L100,0 L100,60 L0,60 Z"
                className={isPassed ? "fill-primary" : "fill-gray-400"}
              />
              <path d="M0,0 L50,35 L100,0" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
           </svg>
        </div>

      </div>
    </div>
  );
}
