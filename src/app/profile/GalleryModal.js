import React, { useState } from "react";

const GalleryModal = ({ isOpen, setIsOpen, onSaveImages }) => {
  const [uploadedImages, setUploadedImages] = useState([]); // Store uploaded images

  if (!isOpen) return null;

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file); // Create preview URL
      newImages.push(imageUrl);
    }

    setUploadedImages([...uploadedImages, ...newImages]);
  };

  // Remove Image from Preview
  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  // Save Images and Close Modal
  const handleSave = () => {
    onSaveImages(uploadedImages); // Pass images to parent component
    setUploadedImages([]); // Clear modal state
    setIsOpen(false); // Close modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-[20px] w-full w-[200vh] h-full h-[90vh] p-[50px] relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-xl"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 className="text-center text-2xl font-bold text-[#170645] mb-2">
          Upload Your Photo Gallery
        </h2>
        <p className="text-center text-[#170645] mb-4">
          Choose an image that will appear everywhere in our app.
        </p>

        <p className="text-black font-bold">Uploaded New Images</p>

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
          <p className="text-black font-bold">Uploaded Images</p>
          <div className="grid grid-cols-5 gap-2 mt-4 bg-gray-200 rounded-lg p-8 relative">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative w-20 h-20">
                <img
                  src={image}
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
          >
            Save Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
