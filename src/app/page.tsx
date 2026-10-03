"use client";

import React from "react";
import Header from "@/components/Header";
import TrendingNews from "@/components/TrendingNews";
import BuyingGuidesHub from "@/components/BuyingGuidesHub";
import ComparisonTable from "@/components/ComparisonTable";
import Footer from "@/components/Footer";
import { MOCK_PRODUCTS } from "@/data/mockData";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation Header */}
      <Header />

      <main className="flex-1">
        {/* Top Cover Hero: Trending News & Market Intel */}
        <TrendingNews />

        {/* Core ProductNation.co Experience: Editorial Buying Guides & Category Hub */}
        <BuyingGuidesHub />

        {/* Technical Specification Matrix */}
        <ComparisonTable products={MOCK_PRODUCTS} />
      </main>

      {/* Footer with Compliance & Transparency */}
      <Footer />
    </div>
  );
}
