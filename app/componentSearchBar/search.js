
"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
 
 
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="جستجوی محصول..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <button type="submit" className="btn btn-primary ml-2">جستجو</button>
    </form>
  );
};

export default SearchBar;
