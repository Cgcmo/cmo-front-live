// app/search-results/page.jsx
import { Suspense } from "react";
import Navbar from "../dashboard/components/Navbar";
import Footer from "../dashboard/components/Footer";
import dynamic from "next/dynamic";

const SearchResultsComponent = dynamic(() => import("@/components/SearchResultsComponent"), {
  ssr: false,
});

export default function SearchResults() {
  return (
    <div className="min-h-screen bg-white relative pb-24">
      <Navbar />
      <Suspense fallback={<p className="text-center mt-10">Loading search results...</p>}>
        <SearchResultsComponent />
      </Suspense>
      <Footer />
    </div>
  );
}
