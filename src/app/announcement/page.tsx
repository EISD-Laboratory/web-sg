"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RESULTS, WA_LINKS } from "@/data/results";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Envelope } from "@/components/Envelope";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const nimParam = searchParams.get("nim");

  const result = (() => {
    if (!nimParam) return null;
    return RESULTS.find(
      (r) =>
        r.nim.trim() === nimParam.trim()
    ) || null;
  })();

  const searched = !!nimParam;

  if (!searched) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
             <p className="text-muted-foreground">No search parameters provided.</p>
             <Link href="/" className="text-primary hover:underline">Return Home</Link>
        </div>
     )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-12 pt-24 sm:px-6 sm:pt-32 md:px-12">

      {/* Container: Matches Hero/Divisions container style */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        
        {/* Main Content Wrapper */}
        <div className="flex w-full flex-col items-center animate-fade-in-up space-y-4">
             
             {/* 1. Envelope Icon */}
             <Envelope status={result ? result.status : "Failed"} />

             {/* 2. Main Announcement Text */}
             <div className="text-center space-y-4 max-w-3xl px-4">
                 {result ? (
                    result.status === "Passed" ? (
                       /* PASSED STATE */
                       <>
                           <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl lg:text-6xl">
                               Welcome On Board!
                           </h1>
                           <p className="text-xl text-muted-foreground sm:text-2xl">
                                Dear <span className="font-semibold text-foreground">{result.name}</span> <span className="text-base text-muted-foreground/80">({result.nim})</span>,
                           </p>
                           <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                                We are pleased to inform you that you have been accepted into the <span className="font-bold text-primary">EISD Study Group</span> for the <span className="font-semibold text-secondary">{result.division}</span> division.
                           </p>
                       </>
                    ) : (
                       /* FAILED STATE */
                       <>
                           <h1 className="text-3xl font-bold tracking-tight text-slate-700 sm:text-4xl md:text-5xl lg:text-6xl">
                               Thank You for Applying
                           </h1>
                           <p className="text-xl text-muted-foreground sm:text-2xl">
                                Dear <span className="font-semibold text-foreground">{result.name}</span> <span className="text-base text-muted-foreground/80">({result.nim})</span>,
                           </p>
                           <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                               Thank you for your interest. Unfortunately, we are unable to accept your application at this time. Don&apos;t be discouraged, keep learning!
                           </p>
                       </>
                    )
                 ) : (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-muted-foreground">Data not found.</p>
                        <Link href="/" className="text-primary hover:underline">Return Home</Link>
                    </div>
                 )}
             </div>

             {/* 3. Actions - Only show Join Group for Passed students */}
             {result?.status === "Passed" ? (
                  <div className="flex justify-center mt-8">
                        <a
                            href={WA_LINKS.general}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md sm:min-w-[240px] sm:px-8 sm:py-3.5 sm:text-base bg-linear-to-r from-[#6366f1] to-[#a855f7] hover:brightness-110 shadow-purple-500/30 hover:shadow-purple-500/40"
                        >
                            <MessageCircle className="h-5 w-5 fill-white/20" />
                            Join Group
                        </a>
                  </div>
             ) : null}
        </div>
      </div>
    </div>
  );
}


export default function AnnouncementPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <main className="relative min-h-screen w-full bg-[#FDFDFD] text-foreground">
        <Navbar />
        <Suspense fallback={
              <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
        }>
            <ResultsContent />
        </Suspense>
        <Footer />
      </main>
    </div>
  );
}
