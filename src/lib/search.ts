import {
  BUYING_GUIDES,
  MOCK_PRODUCTS,
  MOCK_NEWS,
  BuyingGuide,
  Product,
  NewsArticle
} from "@/data/mockData";

export interface SearchResults {
  query: string;
  guides: BuyingGuide[];
  products: Product[];
  news: NewsArticle[];
  totalCount: number;
}

export function searchDaeReview(rawQuery: string): SearchResults {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return {
      query: "",
      guides: [],
      products: [],
      news: [],
      totalCount: 0,
    };
  }

  // 1. Search Buying Guides (ProductNation Roundups)
  const guides = BUYING_GUIDES.filter((guide) => {
    return (
      guide.title.toLowerCase().includes(query) ||
      guide.subtitle.toLowerCase().includes(query) ||
      guide.excerpt.toLowerCase().includes(query) ||
      guide.categoryName.toLowerCase().includes(query) ||
      guide.category.toLowerCase().includes(query) ||
      guide.products.some((p) => p.name.toLowerCase().includes(query))
    );
  });

  // 2. Search Products
  const products = MOCK_PRODUCTS.filter((prod) => {
    return (
      prod.name.toLowerCase().includes(query) ||
      prod.tagline.toLowerCase().includes(query) ||
      prod.category.toLowerCase().includes(query) ||
      prod.verdict.toLowerCase().includes(query) ||
      Object.entries(prod.specs).some(([k, v]) =>
        k.toLowerCase().includes(query) || v.toLowerCase().includes(query)
      )
    );
  });

  // 3. Search News & Trends
  const news = MOCK_NEWS.filter((item) => {
    return (
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  return {
    query,
    guides,
    products,
    news,
    totalCount: guides.length + products.length + news.length,
  };
}
