import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking & framing by unauthorized third parties
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Strict Referrer Policy: Send full URL only to same origin, domain only to HTTPS cross-origin
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict browser features and device sensors
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Force HTTPS for all connections and subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // XSS Auditor protection for older browsers
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Turbopack settings
  turbopack: {
    root: process.cwd(),
  },
  // Security Headers applied to all routes
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Image CDN Domains Optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "down-id.img.susercontent.com", // Shopee CDN
      },
      {
        protocol: "https",
        hostname: "images.tokopedia.net", // Tokopedia CDN
      },
    ],
  },
};

export default nextConfig;
