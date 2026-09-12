"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { CERTIFICATES } from "@/data/certificates";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Download, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

function CertificateResult() {
  const searchParams = useSearchParams();
  const nimParam = searchParams.get("nim");

  const student = (() => {
    if (!nimParam) return null;
    return CERTIFICATES.find((c) => c.nim.trim() === nimParam.trim()) || null;
  })();

  const searched = !!nimParam;

  useEffect(() => {
    if (!student) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#6366f1", "#a855f7", "#00d97a"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#6366f1", "#a855f7", "#00d97a"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#00d97a"],
    });

    frame();
  }, [student]);

  if (!searched) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground">No search parameters provided.</p>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-24 sm:px-6 sm:pt-32 md:px-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 animate-fade-in-up text-center">
            <Award className="h-20 w-20 text-gray-300" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Certificate Not Found
            </h1>
            <p className="text-lg text-muted-foreground">
              No certificate found for NIM <span className="font-semibold text-foreground">{nimParam}</span>. Please double-check your NIM.
            </p>
            <Link
              href="/#certificate"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 ease-out hover:border-primary/40 hover:bg-primary/5 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-12 pt-24 sm:px-6 sm:pt-32 md:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="flex w-full flex-col items-center space-y-6">

          {/* Icon */}
          <div className="animate-fade-in-up stagger-0 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#6366f1] to-[#a855f7] shadow-lg shadow-purple-500/30">
            <Award className="h-10 w-10 text-white" />
          </div>

          {/* Congratulatory Text */}
          <div className="animate-fade-in-up stagger-1 text-center space-y-2 max-w-3xl px-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl">
              Congratulations<br />
              {student.name}!
            </h1>
            <p className="text-lg text-muted-foreground">
              NIM: <span className="font-mono font-semibold text-foreground">{student.nim}</span>
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Below are your certificate{student.certificates.length > 1 ? "s" : ""} from the{" "}
              <span className="font-semibold text-secondary">{student.division}</span> division, team{" "}
              <span className="font-semibold text-primary">{student.team_name}</span>.
            </p>
          </div>

          {/* Certificate Buttons */}
          <div className="animate-fade-in-up stagger-2 flex flex-col items-center gap-3 mt-2">
            <p className="text-sm font-medium text-muted-foreground">
              Your Certificate{student.certificates.length > 1 ? "s" : ""}
            </p>
            {student.certificates.map((cert, i) => (
              <a
                key={cert.title}
                href={cert.drive_link}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-fade-in-up inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-160 ease-out transition-shadow duration-200 ease-out hover:-translate-y-0.5 shadow-sm hover:shadow-md sm:min-w-[280px] sm:px-8 sm:py-3.5 sm:text-base bg-linear-to-r from-[#6366f1] to-[#a855f7] hover:brightness-110 shadow-purple-500/30 hover:shadow-purple-500/40 active:scale-[0.97]"
                style={{ animationDelay: `${(i + 3) * 60}ms` }}
              >
                <Download className="h-5 w-5" />
                {cert.title}
              </a>
            ))}
          </div>

          {/* Back Link */}
          <Link
            href="/#certificate"
            className="animate-fade-in-up stagger-5 inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 ease-out hover:border-primary/40 hover:bg-primary/5 active:scale-95 mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Search Another NIM
          </Link>
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
            <CertificateResult />
        </Suspense>
        <Footer />
      </main>
    </div>
  );
}
