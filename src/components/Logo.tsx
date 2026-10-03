import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ className = "", size = "md", showTagline = false }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Clean Minimalist Vector Logo Icon matching selected brand identity */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-slate-900 group-hover:text-slate-800 transition-colors"
        >
          {/* Outer Stylized 'D' Shape with precise geometric curve */}
          <path
            d="M8 8H24C32.8366 8 40 15.1634 40 24C40 32.8366 32.8366 40 24 40H8V8Z"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-900"
          />

          {/* Integrated Clean Checkmark (Verified & Tested Quality) */}
          <path
            d="M16 24.5L22.5 31L34 16"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-900"
          />

          {/* Vibrant Coral Accent Dot (Active / Shopee / Trend indicator) */}
          <circle cx="28.5" cy="27" r="3.2" className="fill-orange-500" />
        </svg>
      </div>

      {/* Typography: Crisp Swiss Sans-Serif */}
      <div className="flex flex-col leading-none">
        <div className={`font-bold tracking-tight text-slate-900 flex items-center ${textSizes[size]}`}>
          <span>Dae</span>
          <span className="text-slate-700 font-semibold">Review</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 ml-0.5 mb-2 animate-pulse"></span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase text-slate-600 font-medium mt-1">
            Ulasan Teruji & Rekomendasi Pintar
          </span>
        )}
      </div>
    </Link>
  );
}
