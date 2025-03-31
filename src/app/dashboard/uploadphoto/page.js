
"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import { FiShare, FiLink, FiDownload } from "react-icons/fi";
import Footer from "../components/Footer";
import JSZip from "jszip";


export default function UploadPhoto() {
  const [selectedDate, setSelectedDate] = useState("");
  const [file, setFile] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 16;
  const [selectAll, setSelectAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };



  const handleProceed = async () => {
    const eventSelect = document.querySelector("select").value;
    const selectedDate = document.querySelector('input[type="date"]').value;

    if (!eventSelect && !selectedDate && !file) {
      alert("Please select an event, a date, or upload a photo.");
      return;
    }

    setIsLoading(true);

    try {
      let eventPhotos = [];
      let datePhotos = [];
      let uploadPhotos = [];

      if (eventSelect && eventSelect !== "Select Event") {
        const eventResponse = await fetch("http://localhost:5000/fetch-album-photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify({ eventName: eventSelect }),
        });
        const eventData = await eventResponse.json();
        if (eventResponse.ok) {
          eventPhotos = eventData.photos;
        } else {
          console.warn("Event API:", eventData.error || "No photos found.");
        }
      }

      if (selectedDate) {
        const dateResponse = await fetch("http://localhost:5000/fetch-photos-by-date", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify({ date: selectedDate }),
        });
        const dateData = await dateResponse.json();
        if (dateResponse.ok) {
          datePhotos = dateData.photos;
        } else {
          console.warn("Date API:", dateData.error || "No photos found.");
        }
      }

      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result.split(",")[1];
          const uploadResponse = await fetch("http://localhost:5000/search-by-upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64String }),
          });
          const uploadData = await uploadResponse.json();
          if (uploadResponse.ok) {
            uploadPhotos = uploadData.photos;
          } else {
            console.warn("Upload API:", uploadData.error || "No photos found.");
          }

          const mergedPhotos = [...new Map([
            ...eventPhotos,
            ...datePhotos,
            ...uploadPhotos
          ].map(photo => [photo.photo_id, photo])).values()];

          if (mergedPhotos.length > 0) {
            setShowGallery(true);
            setImages(mergedPhotos);
          } else {
            alert("No photos found for the selected filters. If Searching with Photo Make sure Face is clear");
          }

          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      } else {
        const mergedPhotos = [...new Map([
          ...eventPhotos,
          ...datePhotos
        ].map(photo => [photo.photo_id, photo])).values()];

        if (mergedPhotos.length > 0) {
          setShowGallery(true);
          setImages(mergedPhotos);
        } else {
          alert("No photos found for the selected filters. If Searching with Photo Make sure Face is clear");
        }

        setIsLoading(false);
      }

    } catch (error) {
      console.error("Error fetching photos:", error);
      alert("Failed to fetch photos.");
      setIsLoading(false);
    }
  };



  const handleDownload = (src) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = src.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadC = async () => {
    try {
      await fetch("http://localhost:5000/increment-download-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      // Now proceed with the actual download logic...
      console.log("Download count incremented!");
      
    } catch (err) {
      console.error("Failed to update download count:", err);
    }
  };
  

  // Copy Image Link Function
  const handleCopyLink = (src) => {
    navigator.clipboard.writeText(window.location.origin + src)
      .then(() => alert("Image link copied!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  // Share Image Function
  const handleShare = (src) => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this image!",
        text: "Look at this image from our gallery.",
        url: window.location.origin + src
      }).catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedImages([]); // Unselect all
    } else {
      setSelectedImages(images.map((img) => `data:image/jpeg;base64,${img.image}`)); // Select all
    }
    setSelectAll(!selectAll);
  };
  
  // Handle Single Select
  const handleImageSelect = (src) => {
    setSelectedImages((prev) => {
      // If already selected, remove it
      if (prev.includes(src)) {
        return prev.filter((img) => img !== src);
      }
      // If not selected, add it
      return [...prev, src];
    });
  
    // Ensure Select All is only checked if all images are selected
    setSelectAll(selectedImages.length + 1 === images.length);
  };
  

  // Download Selected Images
  const handleDownloadAll = async () => {
    if (selectedImages.length === 0) {
      alert("No images selected!");
      return;
    }
  
    const zip = new JSZip();
  
    selectedImages.forEach((dataUrl, index) => {
      const base64 = dataUrl.split(",")[1]; // Strip the base64 prefix
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
    handleDownloadC();
  };
  

  // Copy All Selected Links
  const handleCopyAllLinks = () => {
    if (selectedImages.length === 0) return alert("No images selected!");
    const links = selectedImages.map((src) => window.location.origin + src).join("\n");
    navigator.clipboard.writeText(links).then(() => alert("All links copied!"));
  };

  // Share Selected Images
  const handleShareAll = async () => {
    if (selectedImages.length === 0) {
      alert("No images selected!");
      return;
    }
  
    // Convert base64 to File objects
    const files = selectedImages.map((dataUrl, index) => {
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
  
      return new File([ab], `image_${index + 1}.jpg`, { type: mimeString });
    });
  
    if (navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({
          title: "Check out these images!",
          text: "Shared via choicesay!",
          files,
        });
      } catch (err) {
        console.error("Error sharing files:", err);
        alert("Error sharing images.");
      }
    } else {
      alert("Sharing files is not supported on your device or browser.");
    }
  };
  

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  useEffect(() => {
    fetch("http://localhost:5000/get-events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white font-sans">
      <Navbar setShowGallery={setShowGallery} />
      {!showGallery ? (
        <div className="flex flex-col items-center min-h-screen bg-white font-sans">
          <h1 className="text-3xl font-extrabold text-[#170645]">Upload Photo</h1>
          <p className="text-sm text-[#170645] mt-1">& Event Details</p>
          <div className="flex items-center w-full max-w-md mt-4">
            <hr className="flex-grow border-gray-300" />
            <p className="mx-4 text-gray-500">Event Details</p>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="w-full max-w-md mt-6">
            <div className="p-4  bg-white">
              <div className="relative w-full mb-4">
                <select className="w-full p-3 border border-gray-300 rounded-full appearance-none text-[#170645] bg-white focus:outline-none">
                  <option value="">-- Select an Event --</option>
                  {events.map((event, index) => (
                    <option key={index} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-4 text-gray-400"></span>
              </div>
              <p className="text-sm font-medium ml-2 text-gray-600 mb-2">Select Date</p>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-full text-[#170645] bg-white focus:outline-none"
              />

              <div className="flex items-center w-full max-w-md mt-7 mb-6">
                <hr className="flex-grow border-gray-300" />
                <p className="mx-4 text-gray-500">Upload Photo</p>
                <hr className="flex-grow border-gray-300" />
              </div>

              <label
                htmlFor="file-upload"
                className="flex flex-row items-center justify-center w-full p-4 border border-gray-400 rounded-full cursor-pointer text-gray-600 mt-4 bg-white hover:bg-gray-100"
              >
                <img src="/up_ph.png" width={22} height={22} alt="Upload Icon" className="mr-2" />
                <p className="text-sm text-[#170645] font-semibold">Drag An Image Here Or Upload A File</p>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
              </label>
              {file && <p className="text-sm mt-2 text-gray-600 text-center">{file.name}</p>}
              <button onClick={handleProceed} className="w-full mt-6 bg-[#170645] text-yellow-500 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all">Proceed</button>
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white z-50">
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20">
                      {/* Circular Loading Spinner */}
                      <svg
                        aria-hidden="true"
                        className="absolute inset-0 w-20 h-20 animate-spin text-gray-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#170645"
                        />
                      </svg>
                      {/* Profile Image Inside Spinner */}
                      <img
                        src="/loader.png" // Replace with dynamic image if needed
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                        alt="User"
                      />
                    </div>
                    {/* Loading Text */}
                    <p className="mt-4 text-lg font-semibold text-gray-700">Searching Related Photo...</p>
                  </div>
                  <div className="absolute bottom-10 text-center">
                    <p className="text-lg font-bold text-gray-700">
                      The latest <span className="text-black font-bold">AI</span> image search.
                    </p>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        <div className="w-full p-4 mt-6">
          {/* <h1 className="text-3xl font-extrabold text-[#170645] text-center mb-4">Related Image Searches</h1>
          <div className="w-full relative">
            <label className="absolute top-full right-4 mt-2 text-lg flex items-center text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 w-4 h-4 accent-[#170645] "
                checked={selectAll}
                onChange={handleSelectAll}
              />
              Select All
            </label>
          </div> */}
           <div className="relative w-full mb-4 flex items-center">
    {/* Title: Centered */}
    <h1 className="text-3xl font-extrabold text-[#170645] absolute left-1/2 transform -translate-x-1/2">
      Related Image Searches
    </h1>

    {/* Select All Checkbox: Right-aligned */}
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
          <div className="flex flex-col sm:flex-row sm:justify-between items-center w-full mb-4">
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row gap-3 px-4 py-3 rounded-full ">
              <button
                onClick={handleShareAll}
                className="min-w-[150px] px-4 py-2 bg-yellow-400 text-black rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
              >
                <FiShare size={18} /> Share
              </button>
              <button
                
                onClick={() => { handleDownloadAll();}} 
                className="min-w-[150px] px-4 py-2 bg-[#170645] text-yellow-500 rounded-full flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md"
              >
                <FiDownload size={18} /> Download
              </button>
            </div>
          </div>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-4">
            {currentImages.map((image, index) => (
              <div key={index} className="break-inside-avoid bg-white p-2 rounded-[30px] transition 
               border-2 border-transparent hover:border-[#0084FF] hover:shadow-md">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="absolute top-4 right-4 z-10 w-4 h-4 accent-[#170645]"
                    checked={selectedImages.includes(`data:image/jpeg;base64,${image.image}`)}
  onChange={() => handleImageSelect(`data:image/jpeg;base64,${image.image}`)}
                  />
                  <img src={`data:image/jpeg;base64,${image.image}`} alt={image.title} className="w-full rounded-[30px]" />
                </div>
                <h3 className="text-[20px] font-bold text-black mt-2">{image.title}</h3>

                {/* <div className="flex gap-[10px] items-center mt-2">
               
                <button onClick={() => handleShare(image.src)} className="w-[2vw] h-[4vh] border border-gray-400 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-[rgba(23,6,69,1)] group-hover:text-white">
                  <FiShare size={18} className="text-gray-500 group-hover:text-white" />
                </button>
                <button onClick={() => handleCopyLink(image.src)} className="w-[30px] h-[30px] border border-gray-400 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-[rgba(23,6,69,1)] group-hover:text-white">
                  <FiLink size={18} className="text-gray-500 group-hover:text-white" />
                </button>
                <button onClick={() => handleDownload(image.src)} className="w-[30px] h-[30px] border border-gray-400 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-[rgba(23,6,69,1)] group-hover:text-white">
                  <FiDownload size={18} className="text-gray-500 group-hover:text-white" />
                </button>
              </div> */}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
  <>
    <div className="flex justify-center mt-6 mb-4 space-x-4">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500"
      >
        {"<<"}
      </button>
      <span className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-lg bg-[#170645] text-yellow-500"
      >
        {">>"}
      </button>
    </div>

    {/* Spacer below pagination to avoid overlap */}
    <div className="h-20" />
  </>
)}

        </div >
      )}
      <Footer />
    </div>
  );
}


