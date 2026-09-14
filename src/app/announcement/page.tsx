"use client";

import { useEffect, useState } from "react";
import { StudentCertificate } from "@/data/certificates";
import { CERTIFICATE_NIM_STORAGE_KEY } from "@/lib/certificate-session";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Envelope } from "@/components/Envelope";
import { Download, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";

function CertificateResult() {
  const [nim, setNim] = useState<string | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [student, setStudent] = useState<StudentCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(CERTIFICATE_NIM_STORAGE_KEY);
    setNim(stored);
    setCheckedStorage(true);
    if (!stored) setLoading(false);
  }, []);

  const searched = checkedStorage && !!nim;

  useEffect(() => {
    if (!nim) return;

    let cancelled = false;

    fetch(`/api/certificates?nim=${encodeURIComponent(nim)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setStudent(data);
      })
      .catch(() => {
        if (!cancelled) setStudent(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [nim]);

  if (!checkedStorage || loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

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
              No certificate found for NIM <span className="font-semibold text-foreground">{nim}</span>. Please double-check your NIM.
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
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-12 pt-24 sm:px-6 sm:pt-32 md:px-12">
      <div className="mx-auto flex w-full flex-col items-center">
        <div className="flex w-full flex-col items-center space-y-6">

          {/* Envelope */}
          <Envelope status="Passed" />

          {/* Congratulatory Text */}
          <div className="animate-fade-in-up stagger-1 text-center space-y-2 max-w-3xl px-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl">
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
            <div className="w-full flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              {student.certificates.map((cert, i) => (
                <a
                  key={cert.title}
                  href={cert.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-fade-in-up flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform duration-160 ease-out transition-shadow duration-200 ease-out hover:-translate-y-0.5 shadow-sm hover:shadow-md sm:w-auto sm:min-w-[300px] sm:px-8 sm:py-3.5 sm:text-base active:scale-[0.97]"
                  style={{ animationDelay: `${(i + 3) * 60}ms` }}
                >
                  <Download className="h-5 w-5" />
                  {cert.title}
                </a>
              ))}
            </div>
          </div>

          {/* Back Link */}
          <Link
            href="/#certificate"
            className="animate-fade-in-up stagger-5 inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 ease-out hover:border-primary/40 hover:bg-primary/5 active:scale-95 mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
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
        <CertificateResult />
        <Footer />
      </main>
    </div>
  );
}
