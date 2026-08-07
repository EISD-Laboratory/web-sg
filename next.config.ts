import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-inline' needed: Next.js App Router injects inline <script> tags for RSC hydration
  "script-src 'self' 'unsafe-inline'",
  // 'unsafe-inline' needed: React inline style={{}} usage + Next.js built-in error pages
  "style-src 'self' 'unsafe-inline'",
  // next/font self-hosts Inter at build time, no external font CDN needed
  "font-src 'self'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "connect-src 'self'",
  // required by canvas-confetti (Envelope.tsx), which spawns a Worker from a blob URL
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspDirectives },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            // Starts conservative (6 months, no "preload"/includeSubDomains) since
            // this is a real custom domain on Hostinger DNS whose subdomain HTTPS
            // coverage hasn't been verified. Raise max-age and add includeSubDomains/
            // preload once confirmed every subdomain (if any) is HTTPS-only.
            key: "Strict-Transport-Security",
            value: "max-age=15552000",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
