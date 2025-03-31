"use client";
import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";


const ModalPopup = ({ isOpen, setIsOpen, fetchAlbums, fetchAllStats }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(""); 
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);  // ✅ Track loading state
  const [districts, setDistricts] = useState([]);

  
 

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("http://localhost:5000/districts");
        if (response.ok) {
          const data = await response.json();
          setDistricts(data); // Update state with fetched districts
        } else {
          console.error("Failed to fetch districts");
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
  
    if (isOpen) {
      fetchDistricts();
    }
  }, [isOpen]);
  

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/departments");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data); // Update state with fetched departments
        } else {
          console.error("Failed to fetch departments");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
  
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);
   // ✅ Ensure modal does not render when closed

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !file) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      const base64Cover = await toBase64(file);
      const newAlbum = {
        name: eventName,
        date: eventDate,
        department,
        districts: [selectedDistrict],
        cover: base64Cover,
      };

      const response = await fetch("http://localhost:5000/create-album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlbum),
      });

      if (response.ok) {
        alert("Album created successfully");

        // ✅ Ensure onCreateAlbum is a function before calling it

        if (fetchAlbums) { // ✅ Ensure fetchAlbums exists before calling
          fetchAlbums();
          fetchAllStats();  // ✅ Fetch updated album list
        } else {
          console.error("❌ fetchAlbums is not a function!");
        }

        // Clear inputs and close modal after successful album creation
        setEventName("");
        setEventDate("");
        setDepartment("");
        setSelectedDistrict("");
        setFile(null);
        setIsOpen(false);

      } else {
        alert("Failed to create album. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file: " + error);
    } finally {
      setLoading(false);  // ✅ Stop loading when finished
    }
  };

  const addDistrict = (e) => {
    if (e.key === "Enter" && selectedDistrict.trim()) {
      setSelectedDistricts([...selectedDistricts, selectedDistrict.trim()]); // ✅ Use selectedDistricts
      setSelectedDistrict(""); // Clear input after adding
      e.preventDefault();
    }
  };



  // Remove District
  const removeDistrict = (dist) => {
    setSelectedDistricts(selectedDistricts.filter((d) => d !== dist));
  };
  const handleDistrictChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedDistricts(selectedOptions);
  };


  // Handle File Upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  if (!isOpen) return null;


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)} // Close modal when clicking outside
    >
      <div
        className="bg-white h-full max-h-[80vh] w-full max-w-[130vh] p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        <div className="max-h-[80vh] overflow-y-auto p-2">
          {/* Close Button (Fixed Click Functionality) */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <X size={24} className="text-gray-600" />
          </button>

          {/* Modal Heading */}
          <h2 className="text-center text-[#170645] text-2xl font-bold mb-2">Create Event</h2>

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

                <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="border text-[#170645] p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-[#170645]">
    <option value="" disabled>Select District</option>
    {districts.map(district => (
      <option key={district.name} value={district.name}>{district.name}</option>
    ))}
  </select>


              </div>

              {/* Department Input (Auto-Growing) */}
              <div className="flex flex-col w-full">
                <label className="text-l font-bold text-[#170645] ml-2 mb-1">Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="border text-[#170645] p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-[#170645]">
                <option value="" disabled>Select Department</option>
                {departments.map(dept => (
                    <option key={dept.name} value={dept.name}>{dept.name}</option>
                  ))}

              </select>
              </div>
            </div>


            {/* File Upload */}
            <div className="border-dashed border-2 border-gray-400 p-4 rounded-lg text-center cursor-pointer relative w-full max-w-[70hv] h-full max-h-[10hv] mx-auto">
              <input
                type="file"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => setFile(e.target.files[0])}
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
                disabled={loading}
              >
                {loading ? "Creating Event..." : "Submit Now"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalPopup;


