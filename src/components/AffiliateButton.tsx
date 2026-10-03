"use client";

import React from "react";
import { trackAffiliateClick } from "@/lib/tracking";

interface AffiliateButtonProps {
  store: "shopee" | "tokopedia" | "tiktok";
  href: string;
  productName: string;
  productId?: string;
  sourcePage?: string;
  className?: string;
  children: React.ReactNode;
}

export default function AffiliateButton({
  store,
  href,
  productName,
  productId,
  sourcePage,
  className,
  children,
}: AffiliateButtonProps) {
  const handleClick = () => {
    trackAffiliateClick({
      store,
      targetUrl: href,
      productName,
      productId,
      sourcePage,
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
