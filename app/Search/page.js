// app/search/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
 
import ProductCard from "../component/home/ProductCard";
import { getSearchResults } from "../home/lib/searchbar/route";
 
const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        const results = await getSearchResults(query);
        setProducts(results);
      } catch (err) {
        console.error("خطا:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  if (loading) return <div>در حال جستجو...</div>;

  return (
    <section className="container">
      <h2 className="mb-4">نتایج جستجو برای: {query}</h2>
      {products.length === 0 ? (
        <p>هیچ محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchPage;
