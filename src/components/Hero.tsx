"use client";

import { useState } from "react";
import { MousePointer2, X } from "lucide-react";
// import Link from "next/link";

// ✅ To re-enable registration, uncomment the Link import above,
// set the REGISTRATION_LINK below, and swap the button section.
// const REGISTRATION_LINK = "https://forms.gle/YOUR_FORM_LINK_HERE";

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
          <h1 className="mb-6 text-5xl font-semibold tracking-tight text-slate-800 sm:text-6xl md:text-7xl lg:text-8xl">
            Study Group <br />
            <span className="text-secondary">in EISD Laboratory</span>
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-slate-500 sm:text-xl">
            A collaborative learning space at EISD Laboratory focused on building real digital solutions across Software Engineering, UI/UX Design, Technopreneurship, and Intelligent Systems.
          </p>

          {/* Register Button - Currently Disabled */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleClick}
              className="group relative inline-flex items-center justify-center rounded-full bg-white p-1.5 shadow-xl shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 active:scale-95 cursor-pointer"
            >
              <div className="flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#6366f1] to-[#a855f7] px-8 py-3.5 text-lg font-semibold text-white transition-all group-hover:brightness-110">
                <MousePointer2 className="h-5 w-5 fill-white" />
                <span>Register Study Group</span>
              </div>
            </button>
          </div>

          {/* Toast Notification */}
          <div
            className={`mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 shadow-lg transition-all duration-300 ${
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
              className="shrink-0 rounded-full p-0.5 text-amber-500 hover:bg-amber-100 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ✅ To re-enable registration, replace the button above with:
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <Link
              href={REGISTRATION_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center rounded-full bg-white p-1.5 shadow-xl shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 active:scale-95"
            >
              <div className="flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#6366f1] to-[#a855f7] px-8 py-3.5 text-lg font-semibold text-white transition-all group-hover:brightness-110">
                <MousePointer2 className="h-5 w-5 fill-white" />
                <span>Register Study Group</span>
              </div>
            </Link>
          </div>
          */}

        </div>
      </div>
    </section>
  );
}
