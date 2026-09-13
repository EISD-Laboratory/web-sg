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
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 },
            colors: ["#00d97a", "#00e681", "#494ca0", "#FFC53D", "#ffffff"],
          });
        }, 350);
      }
    }, 600);

    const letterTimer = setTimeout(() => setLetterOut(true), 1150);
    return () => {
      clearTimeout(flapTimer);
      clearTimeout(letterTimer);
    };
  }, [status]);

  const isPassed = status === "Passed";

  return (
    <div className="flex justify-center px-4 pt-20 pb-10">
      <div className="relative">
        {/* soft brand glow — lifts envelope off the page, no hard border */}
        {isPassed && (
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 rounded-full bg-secondary/15 blur-3xl"
          />
        )}

        <div className="relative" style={{ perspective: "1200px" }}>
          <div
            className={cn(
              "relative w-60 h-32 sm:w-64 sm:h-36",
              "rounded-b-2xl",
              isPassed ? "bg-[#00d97a]" : "bg-slate-200"
            )}
            style={{
              transformStyle: "preserve-3d",
              boxShadow: isPassed
                ? "0 24px 48px -16px rgba(0, 217, 122, 0.4), 0 4px 12px -4px rgba(0, 168, 94, 0.25)"
                : "0 16px 32px -16px rgba(100, 116, 139, 0.4)",
            }}
          >
            {/* mouth interior — full-bleed so no corner notches, fades in as flap lifts */}
            <div
              aria-hidden
              className={cn(
                "absolute inset-x-0 top-0 h-6 rounded-t-sm transition-opacity duration-500",
                isPassed ? "bg-[#007a46]" : "bg-slate-400"
              )}
              style={{ opacity: flapOpen ? 1 : 0 }}
            />

            {/* Letter — white card, purple greeting pinned to top */}
            <div
              aria-hidden
              className="absolute bottom-1 left-1/2 w-[76%] h-[86%] rounded-lg bg-white flex flex-col items-center px-3 overflow-hidden"
              style={{
                paddingTop: 8,
                opacity: letterOut ? 1 : 0,
                transform: letterOut
                  ? "translateX(-50%) translateY(-68px) scale(1)"
                  : "translateX(-50%) translateY(14px) scale(0.94)",
                transition:
                  "transform 1.4s cubic-bezier(0.23, 1, 0.32, 1) 0.15s, opacity 0.45s ease-out",
                zIndex: 20,
                boxShadow:
                  "0 8px 20px -8px rgba(15, 23, 42, 0.18), 0 1px 3px rgba(15, 23, 42, 0.08)",
              }}
            >
              <div
                className={cn(
                  "text-[10px] font-extrabold uppercase whitespace-nowrap",
                  isPassed ? "text-primary" : "text-slate-400"
                )}
                style={{ letterSpacing: "0.18em" }}
              >
                {isPassed ? "Congratulations" : "Notice"}
              </div>
              <div
                className={cn(
                  "mt-1.5 h-[3px] w-10 rounded-full",
                  isPassed ? "bg-secondary/60" : "bg-slate-200"
                )}
              />
              <div className="mt-2.5 h-1.5 w-[45%] self-start rounded-full bg-slate-200" />
              <div className="mt-1.5 h-1.5 w-[60%] self-start rounded-full bg-slate-100" />
              <div className="mt-1.5 h-1.5 w-[52%] self-start rounded-full bg-slate-100" />
            </div>

            {/* Left pocket — slightly deeper shade for 3D */}
            <div
              className="absolute bottom-0 h-full w-full"
              style={{ zIndex: 30 }}
            >
              <div
                className={cn(
                  "h-full w-full rounded-b-2xl",
                  isPassed ? "bg-[#00c26f]" : "bg-slate-300"
                )}
                style={{
                  clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                }}
              />
            </div>

            {/* Right pocket — lightest, catches the light */}
            <div
              className="absolute bottom-0 h-full w-full"
              style={{ zIndex: 30 }}
            >
              <div
                className={cn(
                  "h-full w-full rounded-b-2xl",
                  isPassed ? "bg-[#00dd80]" : "bg-slate-200"
                )}
                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
              />
            </div>

            {/* Top flap — darkest brand, auto-opens once */}
            <div
              aria-hidden
              className="absolute top-0 h-1/2 w-full origin-top"
              style={{
                zIndex: flapOpen ? 10 : 40,
                transform: flapOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                transition: "transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={cn(
                  "h-full w-full",
                  isPassed ? "bg-[#00a85e]" : "bg-slate-400"
                )}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%, 0 0)",
                  boxShadow: flapOpen
                    ? "none"
                    : "0 6px 12px -6px rgba(0, 168, 94, 0.45)",
                }}
              />
              {/* flap sheen — only while closed so the open backface stays clean */}
              {isPassed && !flapOpen && (
                <div
                  className="absolute inset-0 bg-white/10"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%, 0 0)" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
