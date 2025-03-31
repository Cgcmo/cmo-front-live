"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCloudUploadAlt, FaDownload } from "react-icons/fa";
import Navbar from "../components/Navbar";



export default function ImageSearchPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [found, setFound] = useState(null);

  useEffect(() => {
    const imageUrl = sessionStorage.getItem("uploadedImage");
    if (imageUrl) {
      setUploadedImage(imageUrl);

      // Simulating search logic with animation
      setTimeout(() => {
        const isMatch = Math.random() > 0.5; // 50% chance of finding a match
        setFound(isMatch);
      }, 3000); // Simulated 3-second delay
    }
  }, [])
  const handleSelectAll = () => {
    setSelectAll(!selectAll); // This toggles the selectAll state
  };
  

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center gap-2 justify-end ml- 20 mt-3">
            <input type="checkbox" id="selectAll" className="w-4 h-4 cursor-pointer"  />
            <label htmlFor="selectAll" className="text-sm font-semibold cursor-pointer">Select All</label>
          </div>
      <main className="flex flex-col items-center justify-center min-h-screen">
        {uploadedImage ? (
          found === null ? (
            // Show loading animation while searching
            <div className="relative flex flex-col items-center">
              {/* Rotating Gradient Border */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 animate-spinSlow bg-gradient-to-br from-[#00008B] to-white rounded-full w-full h-full"></div>

                {/* Profile Image with Black Border */}
                <div className="relative w-32 h-32 rounded-full border-[6px] border-black overflow-hidden">
                  <img
                    src={uploadedImage}
                    alt="Searching..."
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <p className="mt-4 text-lg text-rgba(23, 6, 69, 1) text-2xl">Searching Related Photo...</p>
            </div>
          ) : found ? (
            // If match is found
            <div className="flex flex-col items-center ">
                {/* Match Found Text */}
                <p className="text-background: var(--P-Color, rgba(23, 6, 69, 1)); font-semibold text- rgba(23, 6, 69, 1)">Related Image Searches</p>

                {/* Uploaded Image Preview */}
                <img
                  src={uploadedImage}
                  alt="Uploaded Preview"
                  className="mt-4 w-full max-w-xs rounded-md shadow-md"
                />
                {/* Share & Download Buttons */}
                <div className="flex items-center space-x-4 mt-6">
                  {/* Share Button */}
                  <button className="relative flex items-center justify-center px-6 py-3 text-lg font-bold text-black bg-yellow-400 rounded-full shadow-lg hover:scale-105 transition-all">
                    <span className="absolute inset-0 blur-md bg-yellow-400 opacity-50"></span>
                    <span className="relative flex items-center gap-2 z-10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 6l6 6m0 0l-6 6m6-6H3"></path>
                      </svg>
                      Share
                    </span>
                  </button>
                  {/* Download Button */}
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = uploadedImage;
                      link.download = "matched-image.jpg";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="relative flex items-center justify-center px-6 py-3 text-lg font-bold text-yellow-400 bg-[#10002b] rounded-full shadow-lg hover:scale-105 transition-all"
                  >
                    <span className="absolute inset-0 blur-md bg-[#10002b] opacity-50"></span>
                    <span className="relative flex items-center gap-2 z-10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l3-3m-3 3l-3-3m9 9H9"></path>
                      </svg>
                      Download
                    </span>
                  </button>
                </div>
              </div>
              
          ) : (
            // If no match found
            <p className="text-red-600 text-lg font-semibold">❌ No matching images found.</p>
          )
        ) : (
          <p className="mt-4 text-lg text-gray-600">No image uploaded.</p>
        )}
        {/* AI Image Search Text */}
        <p className="mt-6 text-xl font-semibold">
          The latest <span className="text-background: var(--P-Color, rgba(23, 6, 69, 1));">AI</span> image search.
        </p>
      </main>
    </div>
  );
}
