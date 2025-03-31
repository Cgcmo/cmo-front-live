
"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, BarChart2, Users, Image, User } from 'lucide-react';
import './ToggleSwitch.css';
import CustomBarChart from './CustomBarChart';
import ModalPopup from "./ModalPopup";
import Profile from "./Profile"; 
import EventCard from "./EventCard";
import AllPhotos from "./AllPhotos"; 
import Navbar from '@/app/dashboard/components/Navbar';

function App() {
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState("All Photos");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  

  const [users, setUsers] = useState([
    { id: 1, name: "Sneha Roy", district: "Durg", mobile: "9235468505", email: "sneharoy17@gmail.com", status: true },
    { id: 2, name: "Disha Sahu", district: "Bastar", mobile: "9235468505", email: "dishasahu65@gmail.com", status: true },
    { id: 3, name: "Shyam Shing", district: "Balod", mobile: "9235468505", email: "shyamshing@gmail.com", status: true },
    { id: 4, name: "Suriya Kumar", district: "Bijapur", mobile: "9235468505", email: "suriyakumar25@gmail.com", status: true },
    { id: 5, name: "Leshika Tandan", district: "Durg", mobile: "9235468505", email: "leshikatandan156@gmail.com", status: true },
    { id: 6, name: "Pratik Raj", district: "Bilaspur", mobile: "9235468505", email: "pratikraj11@gmail.com", status: true },
    { id: 7, name: "Aditi Shign", district: "Dhamtari", mobile: "9235468505", email: "aditishign152@gmail.com", status: true },
  ]);
  
  const eventNames = ["Rajyotsava", "Mahtarivandan Yojna", "Mor Awas Mor Adhikar"];

  const handleDownload = () => {
    if (selectedImages.length === 0) {
      alert("No images selected for download.");
      return;
    }
  
    selectedImages.forEach((image) => {
      const link = document.createElement("a");
      link.href = image; // Assuming image URLs are valid direct links
      link.download = image.split("/").pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  
    alert(`Downloading ${selectedImages.length} images.`);
  };
  
  const Switch = ({ checked, onChange }) => {
    return (
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
      </label>
    );
  };

  const handleSelectAll = (event) => {
    setIsSelectAll(event.target.checked);
  };
  
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.district.toLowerCase().includes(search.toLowerCase()) ||
    user.mobile.includes(search) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total User", count: "149", image: "/tuser.png", bg: "#A889FC80" },
    { label: "Total Download", count: "378", image: "/tdownload.png", bg: "#A1C181" },
    { label: "Total Image", count: "72", image: "/timage.png", bg: "#90C0F6" },
    { label: "Total Event", count: "25", image: "/tevent.png", bg: "#F6CB90" },
  ];

  const toggleStatus = (id) => {
    setUsers((users) =>
      users.map((user) =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };


  // Sample data for the chart
  const chartData = [
    { day: "1", value: 50 },
    { day: "2", value: 20 },
    { day: "3", value: 75 },
    { day: "4", value: 90 },
    { day: "5", value: 55 },
    { day: "6", value: 10 },
    { day: "7", value: 100 },
  ];



  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} setShowFilter={setShowFilter} setShowGallery={setShowGallery}   />

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-[30px] shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setShowFilter(false)}
                className="text-xl text-gray-500"
              >
                ✖
              </button>
              <button
                onClick={() => {
                  document
                    .querySelectorAll('input[type="checkbox"]')
                    .forEach((checkbox) => (checkbox.checked = false));
                  document
                    .querySelectorAll('input[type="date"]')
                    .forEach((input) => (input.value = ""));
                }}
                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
              >
                Clear All
              </button>
            </div>

            {/* Event Section */}
            <div>
              <p className="text-lg font-semibold mb-2 text-black">Event</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
                {[
                  "Azadi Ka Amrit Mahotsav",
                  "Rajim Kumbh Mela",
                  "Rajutsav 2025",
                  "Harihar Chhattisgarh",
                  "Mahatari Vandan Yojna",
                  "Chhattisgarh Yojna",
                ].map((event, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="truncate">{event}</span>
                  </label>
                ))}
              </div>
              <div className="border-b border-gray-300 my-4"></div>
            </div>

            {/* Category Section */}
            <div className="mt-2">
              <p className="text-lg font-semibold mb-2 text-black">Category</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
                {[
                  "Azadi Ka Amrit Mahotsav",
                  "Rajim Kumbh Mela",
                  "Rajutsav 2025",
                  "Harihar Chhattisgarh",
                  "Mahatari Vandan Yojna",
                  "Chhattisgarh Yojna",
                  "Ujjwala Yojna",
                ].map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="truncate">{category}</span>
                  </label>
                ))}
              </div>
              <div className="border-b border-gray-300 my-4"></div>
            </div>

            {/* District Section */}
            <div className="mt-2">
              <p className="text-lg font-semibold mb-2 text-black">Districts</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-gray-600">
                {[
                  "Balod", "Sukma", "Dantewada", "Bastar", "Kondagaon", "Narayanpur", "Kanker",
                  "Kawardha", "Baloda Bazar", "Balrampur", "Bemetara", "Bijapur", "Bilaspur",
                  "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa",
                  "Jashpur", "Korba", "Koriya", "Mahasamund", "Mungeli", "Raigarh", "Raipur",
                  "Rajnandgaon", "Surajpur", "Surguja",
                ].map((district, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="truncate">{district}</span>
                  </label>
                ))}
              </div>
              <div className="border-b border-gray-300 my-4"></div>
            </div>

            {/* Date Range Section */}
            <div className="mt-4">
              <p className="text-lg font-semibold mb-2 text-black">Date</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Date From</label>
                  <input
                    type="date"
                    className="border p-2 w-full rounded-md text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Date To</label>
                  <input
                    type="date"
                    className="border p-2 w-full rounded-md text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1a0645] via-[#170645] to-[#000000ee] text-white p-6 md:p-12 flex flex-col md:flex-row justify-between items-center rounded-b-[30px] md:rounded-b-[100px]">
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Welcome To CMO Gallery</h1>
          <p className="text-base sm:text-lg mt-2 mb-4">Here's Everything You Need To Know To Get Started.</p>
          <p className="text-lg sm:text-xl font-semibold mt-6">Rajyotsava 2024 New Raipur</p>
        </div>
        <img
          src="/CM.png"
          alt="admin"
          className="w-[200px] h-[220px] sm:w-[280px] sm:h-[300px] md:w-[345px] md:h-[365px] drop-shadow-lg transition-transform duration-300 hover:scale-105 object-cover"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Stats and Graph Section */}
      <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Stats Section */}
        <div className="flex flex-col flex-1">
          <h2 className="text-2xl font-semibold text-[#170645] mb-4 text-center lg:text-left">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mx-auto mt-[50px]">
            {stats.map((item, index) => (
              <div
                key={index}
                className="w-full h-full max-w-[200px] h-[200px] aspect-square mx-auto rounded-[25px] flex flex-col items-center justify-center shadow-md transition-all duration-300 hover:border-2 hover:border-[#170645]"
                style={{ backgroundColor: item.bg }}
              >
                <div className="w-8 h-8 mb-2 mt-2 flex items-center justify-center">
                  <img src={item.image} alt="Stat Icon" className="w-[20px] h-[20px]" />
                </div>
                <p className="text-lg font-bold text-[#170645]">{item.count}</p>
                <h3 className="text-md mb-2 ml-4 mr-4 font-normal text-[#170645]">{item.label}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex-1 mt-8 lg:mt-0">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-[#170645]">Total User</h2>
            <p className="text-green-600 font-semibold">75% ↑</p>
          </div>
          <CustomBarChart />
        </div>
      </div>

      {/* Tabs & Gallery */}
      <div className="p-4 sm:p-6">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center border-b pb-2 gap-4">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2 sm:pb-0">
            {["All Photos", "My Downloads", "Profile Update"].map((tab) => (
              <button
                key={tab}
                className={`px-3 sm:px-4 py-2 font-semibold text-[#170645] whitespace-nowrap ${currentTab === tab ? "border-b-2 border-[#170645] font-bold" : "font-light"
                  }`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {currentTab === "All Photos" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:ml-auto">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  className="w-4 h-4 cursor-pointer"
                  onChange={handleSelectAll}
                  checked={isSelectAll}
                />
                <label htmlFor="selectAll" className="text-sm cursor-pointer text-[#686868]">Select All</label>
              </div>
              <button
                className="bg-[#170645] text-[#FFE100] w-full sm:w-[174px] h-[40px] sm:h-[54px] rounded-lg font-normal"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          )}
        </div>

        
        {currentTab === "All Photos" && <AllPhotos isSelectAll={isSelectAll}  setSelectedImages={setSelectedImages} />}

        {/* My Downloads Tab Content */}
        
      {currentTab === "My Downloads" && (
        <EventCard />
      )}


        {/* Profile Update Tab Content */}
        {currentTab === "Profile Update" && <Profile  />}
          
          

        

      </div>
    </div>
  );
}

export default App;


