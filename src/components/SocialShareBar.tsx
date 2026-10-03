"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Copy,
  MessageCircle,
  Send,
  Share2
} from "lucide-react";

interface SocialShareBarProps {
  title: string;
  url?: string;
  category?: string;
}

export default function SocialShareBar({ title, url: initialUrl }: SocialShareBarProps) {
  const [currentUrl, setCurrentUrl] = useState(initialUrl || "");
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!initialUrl && typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    } else if (initialUrl) {
      setCurrentUrl(initialUrl);
    }
  }, [initialUrl]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(`${title} — Baca ulasan lengkapnya di DaeReview:`);

  // 100% Dynamic WhatsApp Share without any hardcoded phone number!
  // WhatsApp will dynamically prompt the user to choose ANY contact, group, or 'My Status' from their own account.
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        showToast("Tautan berhasil disalin ke clipboard!");
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      showToast("Gagal menyalin tautan.");
    }
  };

  const handleInstagramShare = async () => {
    // If mobile native share is available, Instagram will appear in the share sheet for Stories & Chats
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} - DaeReview`,
          url: currentUrl,
        });
        return;
      } catch {
        // User cancelled share sheet
      }
    }

    // Fallback on desktop: Copy link to clipboard and notify user, then open Instagram
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      }
      showToast("Link disalin! Siap ditempel di Instagram Story / DM.");
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    } catch {
      showToast("Gagal membagikan ke Instagram.");
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-fade-in flex items-center gap-1.5 pointer-events-none">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* WhatsApp Button (Dynamic Contact / Status Picker) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title="Bagikan ke WhatsApp (Chat & Status)"
        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#25D366] text-slate-700 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-108 active:scale-95"
        aria-label="Bagikan ke WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
      </a>

      {/* Instagram Button */}
      <button
        type="button"
        onClick={handleInstagramShare}
        title="Bagikan ke Instagram (Story & DM)"
        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] text-slate-700 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-108 active:scale-95"
        aria-label="Bagikan ke Instagram"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </button>

      {/* Facebook Button */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title="Bagikan ke Facebook"
        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#1877F2] text-slate-700 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-108 active:scale-95"
        aria-label="Bagikan ke Facebook"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>

      {/* X / Twitter Button */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title="Bagikan ke X (Twitter)"
        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-108 active:scale-95"
        aria-label="Bagikan ke X"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* Telegram Button */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title="Bagikan ke Telegram"
        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#0088cc] text-slate-700 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-108 active:scale-95"
        aria-label="Bagikan ke Telegram"
      >
        <Send className="w-3.5 h-3.5" />
      </a>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        title="Salin Tautan"
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-108 active:scale-95 ${
          copied
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
        }`}
        aria-label="Salin Tautan"
      >
        {copied ? (
          <Check className="w-4 h-4 stroke-[3]" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
