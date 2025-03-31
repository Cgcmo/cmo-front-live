// src/app/search-results/page.jsx
"use client";
import { Suspense } from "react";
import Navbar from "../dashboard/components/Navbar";
import Footer from "../dashboard/components/Footer";
import dynamic from "next/dynamic";

const SearchResultsComponent = dynamic(() => import("@/components/SearchResultsComponent"), {
  ssr: false,
});

export default function SearchResults() {
  return (
    <div >
   
      <Suspense fallback={<p className="text-center mt-10">Loading search results...</p>}>
        <SearchResultsComponent />
      </Suspense>
   
    </div>
  );
}
