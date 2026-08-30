"use client";

import { useState } from "react";
import { MousePointer2, X, Award } from "lucide-react";

export function Hero() {
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <section className="relative w-full overflow-hidden bg-transparent pt-32 pb-10 lg:pt-30 lg:pb-20">

      <div className="container relative z-10 mx-auto px-6 text-center lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center">

          {/* Main Heading */}
          <h1 className="mb-6 animate-fade-in-up stagger-0 text-5xl font-semibold tracking-tight text-slate-800 sm:text-6xl md:text-7xl lg:text-8xl">
            Study Group <br />
            <span className="text-secondary">in EISD Laboratory</span>
          </h1>

          {/* Description */}
          <p className="mb-8 animate-fade-in-up stagger-1 max-w-3xl text-lg leading-relaxed text-slate-500 sm:text-xl">
            A collaborative learning space at EISD Laboratory focused on building real digital solutions across Software Engineering, UI/UX Design, Technopreneurship, and Intelligent Systems.
          </p>

          {/* Register Button - Currently Disabled */}
          <div className="animate-fade-in-up stagger-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={handleClick}
              className="group relative inline-flex items-center justify-center rounded-full bg-white p-1.5 shadow-xl shadow-purple-500/30 transition-transform duration-160 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 active:scale-95 cursor-pointer"
            >
              <div className="flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#6366f1] to-[#a855f7] px-8 py-3.5 text-lg font-semibold text-white transition-all duration-200 ease-out group-hover:brightness-110">
                <MousePointer2 className="h-5 w-5 fill-white" />
                <span>Register Study Group</span>
              </div>
            </button>

            <a
              href="#certificate"
              className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 px-6 py-3 text-base font-semibold text-primary transition-all duration-200 ease-out hover:scale-105 hover:border-primary/40 hover:bg-primary/5 active:scale-95 sm:min-w-[200px]"
            >
              <Award className="h-5 w-5" />
              <span>Get Certificate</span>
            </a>
          </div>

          {/* Toast Notification */}
          <div
            className={`mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 shadow-lg transition-all duration-200 ease-out ${
              showToast
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <span className="text-sm text-amber-800">
              Registration is currently closed. Stay tuned for the next recruitment!
            </span>
            <button
              onClick={() => setShowToast(false)}
              className="shrink-0 rounded-full p-0.5 text-amber-500 hover:bg-amber-100 hover:text-amber-700 transition-colors duration-150 ease-out cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
