"use client";

import React from "react";
import Script from "next/script";

interface GoogleTagsProps {
  gaId?: string;
  gscVerificationId?: string;
  adsenseClientId?: string;
}

export default function GoogleTags({
  gaId = process.env.NEXT_PUBLIC_GA_ID || "",
  gscVerificationId = process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_ID || "",
}: GoogleTagsProps) {
  // Sitelinks Search Box Schema for Google Search Engine Rank #1 boost
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DaeReview",
    alternateName: "DaeReview Indonesia",
    url: "https://daereview.daeroom.my.id",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://daereview.daeroom.my.id/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DaeReview",
    url: "https://daereview.daeroom.my.id",
    logo: "https://daereview.daeroom.my.id/icon.svg",
    sameAs: [
      "https://daeroom.my.id",
      "https://twitter.com/daereview",
      "https://instagram.com/daereview",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: ["Indonesian", "English"],
    },
  };

  return (
    <>
      {/* Sitelinks Searchbox & Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Google Search Console Verification Meta */}
      {gscVerificationId && (
        <meta name="google-site-verification" content={gscVerificationId} />
      )}

      {/* Google Analytics 4 (GA4) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Google AdSense / Publisher Tag Verification */}
      {adsenseClientId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
    </>
  );
}
