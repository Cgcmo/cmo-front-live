import React, { useState, useEffect } from "react";
import GalleryModal from "./GalleryModal";

const AllPhotos = ({ isSelectAll, setSelectedImages: updateSelectedImages }) => {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [albums, setAlbums] = useState([
    { images: ["/001.png", "/002.png", "/003.png", "/004.png", "/005.png", "/006.png"] },
    
  ]);

  const handleSaveImages = (newImages) => {
    setAlbums((prevAlbums) => [
      { images: [...prevAlbums.flatMap(album => album.images), ...newImages] },
    ]);
  };

  const toggleImageSelection = (image) => {
    setSelected((prevSelected) =>
      prevSelected.includes(image)
        ? prevSelected.filter((img) => img !== image)
        : [...prevSelected, image]
    );
  };

  // Handle 'Select All' functionality
  useEffect(() => {
    if (isSelectAll) {
      const allImages = albums.flatMap(album => album.images);
      setSelected(allImages);
      if (updateSelectedImages) updateSelectedImages(allImages);
    } else {
      setSelected([]);
      if (updateSelectedImages) updateSelectedImages([]);
    }
  }, [isSelectAll, albums, updateSelectedImages]);

  useEffect(() => {
    if (updateSelectedImages) updateSelectedImages(selected);
  }, [selected, updateSelectedImages]);

  return (
    <div className="mt-4 h-[500px] overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albums.flatMap(album => album.images).map((image, index) => (
          <div key={index} className="relative p-1 rounded-3xl border border-white border-[2px] overflow-hidden hover:border-[#0084FF] hover:shadow-md transition hover:rounded-3xl">
            <input
              type="checkbox"
              className="absolute top-4 left-4 w-4 h-4 cursor-pointer"
              checked={selected.includes(image)}
              onChange={() => toggleImageSelection(image)}
            />
            <img
              src={image}
              alt={`Photo ${index + 1}`}
              className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] object-cover rounded-[25px] cursor-pointer"
              onClick={() => toggleImageSelection(image)}
            />
          </div>
        ))}
      </div>
      <GalleryModal isOpen={isGalleryModalOpen} setIsOpen={setIsGalleryModalOpen} onSaveImages={handleSaveImages} />
    </div>
  );
};

export default AllPhotos;
