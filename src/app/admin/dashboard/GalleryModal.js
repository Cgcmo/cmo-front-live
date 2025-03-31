import React, { useState } from "react";

const GalleryModal = ({ isOpen, setIsOpen, albumId, fetchPhotos, fetchAllStats }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);  // ✅ Track loading state

  if (!isOpen) return null;

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    const base64Images = await Promise.all([...files].map(toBase64));
    setUploadedImages(base64Images);
  };

  const handleSave = async () => {
    if (!uploadedImages.length) {
      alert("Please upload images before saving.");
      return;
    }

    setLoading(true); 

    try {
      const response = await fetch(`http://localhost:5000/upload-gallery/${albumId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: uploadedImages }),
      });

      if (response.ok) {
        alert("Photos uploaded successfully");

        // ✅ Fetch updated photos instantly
        fetchPhotos({ _id: albumId, images: [] }); // Ensure it fetches fresh data
        fetchAllStats();
        setIsOpen(false);
      } else {
        alert("Failed to upload photos");
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }finally {
        setLoading(false);  // ✅ Stop loading when finished
    }
  };

  // ✅ Fix: Define removeImage function
  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white rounded-[20px] w-full max-w-[130vh] h-full max-h-[80vh] p-[40px] relative flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-xl"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        <div className="overflow-y-auto flex-1">
        {/* Modal Header */}
        <h2 className="text-center text-2xl font-bold text-[#170645] mb-1">
          Upload Your Photo Gallery
        </h2>
        <p className="text-center text-[#170645] mb-5">
          Choose an image that will appear everywhere in our app.
        </p>

        <p className="text-black mb-3  flex justify-center  font-bold">Uploaded New Images</p>

        {/* Image Upload Box */}
        <label
          htmlFor="fileInput"
          className="border-dashed border-2 border-gray-400 rounded-lg py-12 text-center block cursor-pointer hover:bg-gray-100 transition"
        >
          <p className="text-[#170645]">Click or Drag & Drop To Upload Multiple Images</p>
          <p className="text-gray-400 text-sm">PNG, JPG, JPEG (Max 250KB per image)</p>
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/png, image/jpeg"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Uploaded Images Preview */}
        <div className="mt-8">
          <p className="text-black flex justify-center font-bold">Uploaded Images</p>
          <div className="grid grid-cols-5 gap-2 mt-4 bg-gray-200 rounded-lg p-8 relative">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative w-20 h-20">
                <img
                  src={`data:image/jpeg;base64,${image}`}
                  alt={`Uploaded ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <button
                  className="absolute top-1 right-1  bg-red-500 text-white text-xs px-1 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        

        {/* Save Button */}
        <div className="text-center mt-6">
          <button
            className="bg-[#170645] text-[#FFE100] px-6 py-3 w-full max-w-[50vh] rounded-full text-lg"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Save Now"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
