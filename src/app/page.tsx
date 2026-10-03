"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import TrendingNews from "@/components/TrendingNews";
import BuyingGuidesHub from "@/components/BuyingGuidesHub";
import ComparisonTable from "@/components/ComparisonTable";
import Footer from "@/components/Footer";
import { MOCK_PRODUCTS, Product } from "@/data/mockData";
import { getAllProducts, PRODUCTS_UPDATE_EVENT } from "@/lib/dynamicProducts";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    setProducts(getAllProducts());

    const handleUpdate = () => {
      setProducts(getAllProducts());
    };

    window.addEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(PRODUCTS_UPDATE_EVENT, handleUpdate);
  }, []);

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
        <ComparisonTable products={products} />
      </main>

      {/* Footer with Compliance & Transparency */}
      <Footer />
    </div>
  );
}
