"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeModalProps {
  /** master on/off switch — set false to disable without removing the mount */
  enabled?: boolean;
  /** stop showing after this date (YYYY-MM-DD), e.g. a promo/competition deadline */
  expiresOn?: string;
  /** sessionStorage key, so a dismissal doesn't re-show until a new session */
  storageKey?: string;
  image: {
    src: string;
    alt: string;
  };
  buttonText: string;
  buttonHref: string;
  className?: string;
}

export function WelcomeModal({
  enabled = true,
  expiresOn,
  storageKey = "welcome-modal-dismissed",
  image,
  buttonText,
  buttonHref,
  className,
}: WelcomeModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (expiresOn && Date.now() > new Date(`${expiresOn}T23:59:59`).getTime()) return;
    if (sessionStorage.getItem(storageKey)) return;
    setMounted(true);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [enabled, expiresOn, storageKey]);

  const close = () => {
    setVisible(false);
    setZoomed(false);
    sessionStorage.setItem(storageKey, "1");
    setTimeout(() => setMounted(false), 300);
  };

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const handleBackdropClick = () => {
    if (zoomed) {
      setZoomed(false);
      return;
    }
    close();
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      className={cn(
        "fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-900 shadow-2xl transition-all duration-300",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          zoomed ? "w-[min(95vw,52rem,88vh)]" : "w-[min(90vw,28rem,68vh)]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(max-width: 640px) 95vw, 52rem"
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((z) => !z);
          }}
          className={cn("object-cover", zoomed ? "cursor-zoom-out" : "cursor-zoom-in")}
        />

        {!zoomed && (
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 cursor-pointer rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-black/60"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        )}

        {!zoomed && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/85 via-black/40 to-transparent p-5 pt-16 sm:p-6 sm:pt-20">
            <a
              href={buttonHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#6366f1] to-[#a855f7] px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            >
              {buttonText}
              <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
