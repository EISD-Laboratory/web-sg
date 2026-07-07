"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Software Development", href: "/software-development" },
  { name: "UI/UX Design", href: "/ui-ux-design" },
  { name: "Technopreneur", href: "/technopreneur" },
  { name: "Intelligence System", href: "/intelligence-system" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile menu on route change (adjusting state during render avoids cascading effects)
  if (prevPathname !== null && prevPathname !== pathname) {
    setMobileMenuOpen(false);
    setPrevPathname(pathname);
  }
  if (prevPathname === null) {
    setPrevPathname(pathname);
  }

  // Play animation on route change
  useEffect(() => {
    if (videoRef.current && isVideoReady) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [pathname, isVideoReady]);

  const handleMouseEnter = () => {
    if (videoRef.current && isVideoReady) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Safe toggle with debounce protection
  const handleMenuToggle = () => {
    if (isToggling) return; // Prevent rapid clicks
    setIsToggling(true);
    setMobileMenuOpen(!mobileMenuOpen);
    setTimeout(() => setIsToggling(false), 300); // 300ms debounce
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 z-110 -translate-x-1/2 w-[90%] max-w-5xl rounded-full border border-white/20 bg-white/95 md:bg-white/90 backdrop-blur-sm md:backdrop-blur-xl shadow-lg shadow-black/5 transition-all">
        <div className="flex h-14 items-center justify-between px-2 pl-6 pr-2">
          {/* Left: Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2"
            onMouseEnter={handleMouseEnter}
          >
            <div className="relative h-10 w-10 overflow-hidden">
               {/* Static Image (Shown until video is ready) */}
               {!isVideoReady && (
                 <Image 
                    src="/images/logo-eisd.png" 
                    alt="EISD Logo" 
                    fill
                    sizes="40px"
                    className="object-contain scale-[1.2]"
                    priority
                 />
               )}
               
               {/* Video Animation (Hidden until loaded) */}
               <video
                ref={videoRef}
                src="/video/animasi-logo-eisd.webm"
                muted
                playsInline
                className={cn(
                  "h-full w-full object-contain scale-[2.5] transition-opacity duration-500 mix-blend-multiply",
                  isVideoReady ? "opacity-100" : "opacity-0"
                )}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  if (isFinite(video.duration)) {
                      video.currentTime = video.duration;
                  }
                }}
                onCanPlay={() => setIsVideoReady(true)}
               />
            </div>
          </Link>
          {/* Center: Desktop Nav Links */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative text-xs font-medium transition-colors hover:text-primary lg:text-sm",
                    isActive ? "text-primary font-bold" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: CTA Button */}
          <div className="hidden md:flex">
            <Link
              href="https://wa.me/6282193199898"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#6366f1] to-[#a855f7] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 hover:brightness-110 active:scale-95"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={handleMenuToggle}
            disabled={isToggling}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-100 bg-background/95 backdrop-blur-sm pt-24 md:hidden">
          <div className="flex flex-col items-center gap-6 p-6 pointer-events-auto">
            {navLinks.map((link) => {
               const isActive = pathname === link.href;
               return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary font-bold" : "text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="https://wa.me/6282193199898"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 group relative inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#6366f1] to-[#a855f7] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all active:scale-95"
              onClick={() => setMobileMenuOpen(false)}
            >
             Contact Us
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
