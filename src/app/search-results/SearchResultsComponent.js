"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../dashboard/components/Navbar";
import Footer from "../dashboard/components/Footer";
import { FiDownload } from "react-icons/fi";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    fetch("http://localhost:5000/master-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data.photos || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setLoading(false);
      });
  }, [query]);

  const handleSelect = (photo) => {
    setSelectedPhotos((prev) =>
      prev.includes(photo)
        ? prev.filter((p) => p !== photo)
        : [...prev, photo]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos);
    }
    setSelectAll(!selectAll);
  };

  const handleDownloadAll = async () => {
    if (selectedPhotos.length === 0) {
      alert("No images selected!");
      return;
    }

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    selectedPhotos.forEach((photo, index) => {
      const base64 = photo.image;
      zip.file(`image_${index + 1}.jpg`, base64, { base64: true });
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "selected_images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!query)
    return <p className="text-center mt-10">No search query provided.</p>;

  if (loading)
    return <p className="text-center mt-10 text-[#170645] font-semibold">Loading related photos...</p>;

  return (
    <div className="min-h-screen bg-white relative pb-24">
      <Navbar />
      <div className="p-4">
        {/* Header */}
        <div className="relative w-full mb-4 flex items-center">
          <h1 className="text-3xl font-extrabold text-[#170645] absolute left-1/2 transform -translate-x-1/2">
            Search Results for "{query}"
          </h1>
          <label className="ml-auto mr-3 flex items-center text-gray-600 cursor-pointer text-md">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 accent-[#170645]"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            Select All
          </label>
        </div>

        {/* Gallery */}
        {photos.length === 0 ? (
          <p className="text-center text-gray-600 mt-6">No related photos found.</p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="break-inside-avoid bg-white p-2 rounded-[30px] border-2 border-transparent hover:border-[#0084FF] hover:shadow-md"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="absolute top-4 right-4 z-10 w-4 h-4 accent-[#170645]"
                    checked={selectedPhotos.includes(photo)}
                    onChange={() => handleSelect(photo)}
                  />
                  <img
                    src={`data:image/jpeg;base64,${photo.image}`}
                    alt={`Photo ${i + 1}`}
                    className="w-full rounded-[30px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Download Button */}
        {photos.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={handleDownloadAll}
              className="min-w-[150px] px-4 py-2 bg-[#170645] text-yellow-500 rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
            >
              <FiDownload size={18} /> Download
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
