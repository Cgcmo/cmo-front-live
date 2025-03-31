"use client";
import React, { useState } from "react";
import { X, Upload } from "lucide-react";

const ModalPopup = ({ isOpen, setIsOpen, onCreateAlbum }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [department, setDepartment] = useState("");
  const [districts, setDistricts] = useState(["Raipur", "Durg", "Bilaspur", "Dhamtari"]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [file, setFile] = useState(null);

  // Handle District Selection
  const addDistrict = (e) => {
    if (e.key === "Enter" && selectedDistrict.trim()) {
      setDistricts([...districts, selectedDistrict.trim()]);
      setSelectedDistrict("");
      e.preventDefault();
    }
  };

  // Remove District
  const removeDistrict = (dist) => {
    setDistricts(districts.filter((d) => d !== dist));
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!eventName || !eventDate || !file) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const newAlbum = {
      name: eventName,
      cover: URL.createObjectURL(file), // Use uploaded image as cover
      images: [], // Empty initially
    };

    onCreateAlbum(newAlbum); // Pass new album to parent component

    // Clear input fields & close modal
    setEventName("");
    setEventDate("");
    setFile(null);
    setIsOpen(false);
  };

  // Prevent Modal from Rendering When Closed
  if (!isOpen) return null;

  return (
    <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={() => setIsOpen(false)} // Close modal when clicking outside
  >
    <div 
      className="bg-white h-full max-h-[90vh] w-full max-w-[90hv] p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
    >
      {/* Close Button (Fixed Click Functionality) */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
      >
        <X size={24} className="text-gray-600" />
      </button>

        {/* Modal Heading */}
        <h2 className="text-center text-[#170645] text-2xl font-bold mb-6">Create Event</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-10">
          {/* Event Name & Date */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="text-l ml-2 font-bold text-black mb-1">Event Name</label>
              <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="border p-3 w-full rounded-full outline-none focus:ring-2 focus:ring-[#170645] placeholder-[#170645] text-[#170645] text-md"
              />
            </div>
            <div className="flex flex-col w-full">
  <label className="text-l font-bold ml-2 text-black mb-1">Date</label>
  <div className="relative">
    {/* Date Input (Default Icon Color Changed) */}
    <input
      id="datePicker"
      type="date"
      value={eventDate}
      onChange={(e) => setEventDate(e.target.value)}
      className="border p-3 w-full rounded-full outline-none focus:ring-2 focus:ring-[#170645] text-[#170645] appearance-none"
    />
    
  </div>
</div>

          </div>

          {/* Districts & Department */}
<div className="flex flex-col sm:flex-row gap-4">
  {/* Districts Multi-Select (Auto-Growing & Focus Effect) */}
  <div className="flex flex-col w-full">
    <label className="text-l font-bold text-black ml-2 mb-1">Districts</label>
    <div
      className="border p-3 w-full rounded-lg min-h-[50px] flex flex-wrap items-center gap-2 overflow-auto  focus-within:ring-2 focus-within:ring-[#170645]"
    >
      {districts.map((dist) => (
        <span
          key={dist}
          className="bg-gray-200 text-black px-3 py-1 rounded-full flex items-center gap-1 text-sm"
        >
          {dist}
          <button
            onClick={() => removeDistrict(dist)}
            className="text-gray-600 hover:text-red-500"
          >
            ✕
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder="Type ..."
        value={selectedDistrict}
        onChange={(e) => setSelectedDistrict(e.target.value)}
        onKeyDown={addDistrict}
        className="outline-none flex-1 text-black bg-transparent placeholder-[#170645] resize-none min-h-[50px]"
        style={{ height: selectedDistrict.length > 20 ? "auto" : "50px" }}
      />
    </div>
  </div>

  {/* Department Input (Auto-Growing) */}
  <div className="flex flex-col w-full">
    <label className="text-l font-bold text-black ml-2 mb-1">Department</label>
    <input
      type="text"
      placeholder="Type..."
      value={department}
      onChange={(e) => setDepartment(e.target.value)}
      className="border text-black p-3 w-full rounded-full outline-none focus:ring-2 focus:ring-[#170645] placeholder-[#170645] resize-none min-h-[50px]"
      style={{ height: department.length > 20 ? "auto" : "50px" }}
    />
  </div>
</div>

          
          {/* File Upload */}
<div className="border-dashed border-2 border-gray-400 p-4 rounded-lg text-center cursor-pointer relative w-full max-w-[70hv] h-full max-h-[10hv] mx-auto">
  <input
    type="file"
    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
    onChange={handleFileUpload}
  />
  {file ? (
    <p className="text-gray-600 text-sm">{file.name}</p>
  ) : (
    <div className="flex items-center mt-4 mb-4 justify-center gap-3"> {/* Fixed alignment */}
      <img src="/Drag_i.png" alt="Upload Icon" className="w-[23px] h-[22px]" /> {/* Custom Icon on left */}
      <p className="text-[#170645] text-sm">Drag an Image Here or Upload a File</p>
    </div>
  )}
</div>

{/* Submit Button (Centered) */}
<div className="flex justify-center mt-4">
  <button
    type="submit"
    className="bg-[#170645] rounded-full text-[#FFE100] py-3 w-full max-w-[436px] text-lg font-semibold hover:bg-[#0f043a] transition"
  >
    Submit Now
  </button>
</div>

        </form>
      </div>
    </div>
  );
};

export default ModalPopup;
