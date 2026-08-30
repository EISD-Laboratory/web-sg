"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CERTIFICATES } from "@/data/certificates";
import { Search } from "lucide-react";

export function CertificateChecker() {
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedNim = nim.trim();
    if (!trimmedNim) return;

    const found = CERTIFICATES.find((r) => r.nim.trim() === trimmedNim);
    if (found) {
      router.push(`/announcement?nim=${encodeURIComponent(trimmedNim)}`);
    } else {
      setError("Certificate not found. Please double-check your NIM.");
    }
  };

  return (
    <section id="certificate" className="scroll-mt-[250px] py-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 sm:gap-12">
            <div className="h-px min-w-[20px] flex-1 bg-gray-300"></div>
            <h2 className="animate-fade-in-up stagger-0 text-xl font-bold tracking-tight text-[#1C1629] sm:text-4xl text-center">
              Certificate Checker
            </h2>
            <div className="h-px min-w-[20px] flex-1 bg-gray-300"></div>
          </div>
          <p className="animate-fade-in-up stagger-1 mt-4 text-center text-lg text-muted-foreground">
            Look up and download your certificate by entering your NIM below.
          </p>
        </div>

        {/* Check Form Box */}
        <div className="animate-fade-in-up stagger-2 mx-auto max-w-xl overflow-hidden rounded-2xl border border-black/5 bg-white p-5 sm:p-8 shadow-sm transition-shadow duration-300 ease hover:shadow-md">
          <form className="flex flex-col gap-6" onSubmit={handleSearch}>
            <div className="space-y-2">
              <label htmlFor="nim" className="text-sm font-medium text-foreground">
                NIM
              </label>
              <input
                type="text"
                id="nim"
                placeholder="Enter your NIM"
                value={nim}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setNim(val);
                  setError("");
                }}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-all duration-200 ease-out focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <p
              className={`text-sm text-red-500 text-center transition-all duration-200 ease-out ${
                error ? "opacity-100 max-h-10" : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              {error || "\u00A0"}
            </p>

            <button
              type="submit"
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#6366f1] to-[#a855f7] px-4 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform duration-160 ease-out transition-shadow duration-200 ease-out hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-500/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              Search Certificate
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
