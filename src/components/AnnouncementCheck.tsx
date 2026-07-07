"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RESULTS } from "@/data/results";
import { Search } from "lucide-react";

export function AnnouncementCheck() {
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedNim = nim.trim();
    if (!trimmedNim) return;

    const found = RESULTS.find((r) => r.nim.trim() === trimmedNim);
    if (found) {
      router.push(`/announcement?nim=${encodeURIComponent(trimmedNim)}`);
    } else {
      setError("Data not found, please double-check your NIM.");
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 sm:gap-12">
            <div className="h-px min-w-[20px] flex-1 bg-gray-300"></div>
            <h2 className="text-xl font-bold tracking-tight text-[#1C1629] sm:text-4xl text-center">
              Study Group Announcement
            </h2>
            <div className="h-px min-w-[20px] flex-1 bg-gray-300"></div>
          </div>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            Check your acceptance status by entering your details below.
          </p>
        </div>

        {/* Check Form Box */}
        <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-black/5 bg-white p-5 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
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
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#6366f1] to-[#a855f7] px-4 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:pointer-events-none disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              Check Status
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
