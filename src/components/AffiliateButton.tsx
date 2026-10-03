"use client";

import React from "react";
import { trackAffiliateClick } from "@/lib/tracking";
import { buildAffiliateUrl } from "@/lib/affiliate";

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
  const finalUrl = buildAffiliateUrl({
    store,
    rawUrl: href,
    productName,
    subId: sourcePage?.replace(/\//g, "-") || "daereview",
  });

  const handleClick = () => {
    trackAffiliateClick({
      store,
      targetUrl: finalUrl,
      productName,
      productId,
      sourcePage,
    });
  };

  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
