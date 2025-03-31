"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSlidersH } from "react-icons/fa";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";
import ModalPopup from "./ModalPopup";

export default function Navbar({ setShowGallery, setGalleryPhotos,fetchAlbums: fetchAlbumsProp,
    fetchAllStats: fetchAllStatsProp }) {
  const [showFilter, setShowFilter] = useState(false);
  const router = useRouter();
  const [eventList, setEventList] = useState([]); 
  const [categoryList, setCategoryList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  
  const fetchAlbums = async () => {
    try {
      const response = await fetch("http://localhost:5000/albums");
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };
  
  useEffect(() => {
    // Fetch Events
    fetch("http://localhost:5000/get-events")
      .then(res => res.json())
      .then(data => setEventList(data))
      .catch(err => console.error("Failed to fetch events:", err));
  
    // Fetch Categories (Departments)
    fetch("http://localhost:5000/departments")
      .then(res => res.json())
      .then(data => setCategoryList(data.map(d => d.name)))  // extract only names
      .catch(err => console.error("Failed to fetch departments:", err));
  
    // Fetch Districts
    fetch("http://localhost:5000/districts")
      .then(res => res.json())
      .then(data => setDistrictList(data.map(d => d.name)))
      .catch(err => console.error("Failed to fetch districts:", err));
  }, []);
  

  useEffect(() => {
    fetch("http://localhost:5000/search-suggestions")
      .then(res => res.json())
      .then(data => {
        const combined = [
          ...data.events.map(e => ({ type: "Event", name: e })),
          ...data.departments.map(d => ({ type: "Department", name: d })),
          ...data.districts.map(d => ({ type: "District", name: d })),
        ];
        setAllSuggestions(combined);
      });
  }, []);

  // Debounced input handler
  const debouncedSuggest = debounce((value) => {
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = allSuggestions.filter(s =>
      s.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 10));
  }, 300);
  

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value); // update immediately so input doesn't lag
    debouncedSuggest(value); // debounce only the suggestion logic
  };
  
  const handleSearch = (queryText = search) => {
  if (!queryText) return;
  router.push(`/search-results?q=${encodeURIComponent(queryText)}`);
};

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setSuggestions([]);
    handleSearch(name);
  };
  return (
    <nav className="w-full h-[80px] bg-white flex items-center px-4 md:px-6 justify-between">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-4">
        <img src="/CG logo.webp" alt="Logo" className="w-[60px] h-[60px] md:w-[71px] md:h-[71px]" />
      </div>

      {/* Middle Section: Search Bar (Hidden in Small Screens) */}
      {/* <div className="hidden md:flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-100 w-[600px] lg:w-[900px] h-[45px] px-3"> */}
        {/* <button onClick={() => setShowFilter(true)} className="px-4 py-2 text-gray-600 flex items-center gap-2">
          Filter <FaChevronDown className="text-sm" />
        </button>
        <span className="text-gray-400 px-3">|</span> */}
        <div className="hidden md:flex flex-col relative w-[600px] lg:w-[900px]">
  <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-100 h-[45px] px-3 z-10">
    <input
      type="text"
      placeholder="Search"
      value={search}
      onChange={handleChange}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      className="w-full bg-transparent text-gray-700 outline-none px-2"
    />
    <button onClick={() => handleSearch()} className="text-gray-500">✕</button>
    <span className="text-gray-400 px-3">|</span>
    <button className="text-gray-600 text-base">
  <FaSearch />
</button>
  </div>

  {suggestions.length > 0 && (
    <div className="absolute top-[48px] left-0  bg-gray-100 border rounded-md shadow-md w-full z-20 max-h-60 overflow-auto">
      {suggestions.map((s, i) => (
        <div
          key={i}
          onClick={() => handleSuggestionClick(s.name)}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between text-sm"
        >
          <span className="truncate text-black">{s.name}</span>
          <span className="text-xs text-blue-400">{s.type}</span>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Right Section: Buttons */}
      <div className="flex items-center gap-4">
        {/* Mobile View: Icons for Filter & Search */}
        <div className="relative md:hidden flex items-center gap-2 w-full justify-end px-2">
  {/* Menu Toggle Button */}
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="inline-flex items-center justify-center w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

 

  {/* Dropdown Panel */}
  {showDropdown && (
  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 w-[90vw] max-w-[173px]">
    <div className="bg-white border border-gray-200 rounded-lg p-1 shadow-md w-full  flex flex-col gap-2">
      {/* Search Bar */}
      <div className="flex items-center border border-gray-400 rounded-lg bg-gray-100 h-[40px] px-3 w-full">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full bg-transparent text-gray-700 outline-none px-2 text-sm"
        />
        {/* <button onClick={() => handleSearch()} className="text-gray-500">✕</button> */}
        <span className="text-gray-400 px-2">|</span>
        <button className="text-gray-600 text-base">
  <FaSearch />
</button>
      </div>

      {suggestions.length > 0 && (
    <div className="absolute top-[45px] left-0 bg-gray-100 border rounded-md shadow-md w-full z-50 max-h-60 overflow-auto">
      {suggestions.map((s, i) => (
        <div
          key={i}
          onClick={() => handleSuggestionClick(s.name)}
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex justify-between text-sm"
        >
          <span className="truncate text-black">{s.name}</span>
          <span className="text-xs text-blue-400">{s.type}</span>
        </div>
      ))}
    </div>
  )}
      {/* Search Photos Button */}
      <button
        onClick={() => {
          setShowGallery(false);
          router.push("/dashboard/uploadphoto");
          setShowDropdown(false);
        }}
        className="w-full bg-[#170645] text-yellow-300 rounded-lg shadow px-3 py-2 text-sm"
      >
        Search By Face
      </button>
    </div>
    
  </div>
  

  
)}

</div>




        {/* Search Button (Desktop Only) */}
        <button
          onClick={() => { setShowGallery(false); router.push("/dashboard/uploadphoto") }}
          className="hidden md:flex  bg-[#170645] text-yellow-300 rounded-full shadow-lg flex items-center justify-center px-7 py-3 transition-all"
        >
          Search By Face
        </button>

        {/* Create Event Button */}
<button
   onClick={() => setIsFolderModalOpen(true)}
  className="bg-[#170645] text-yellow-300 rounded-full px-7 py-3 shadow-md hover:shadow-lg transition text-sm md:text-base"
>
  Create Event
</button>

      </div>

      <ModalPopup 
  isOpen={isFolderModalOpen}
  setIsOpen={setIsFolderModalOpen}
  fetchAlbums={fetchAlbumsProp}
  fetchAllStats={fetchAllStatsProp}
/>




      {/* {showFilter && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 p-4 ">
          <div className="bg-white p-4 sm:p-6 rounded-[30px] shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex justify-end gap-3 mb-4">
              <button
                onClick={() => {
                  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => (checkbox.checked = false));
                  document.querySelectorAll('input[type="date"]').forEach((input) => (input.value = ""));
                }}
                className=" flex items-center justify-center h-8 bg-gray-200 text-gray-500 font-bold px-3 py-1 rounded-full text-sm hover:bg-red-600  gap-1"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="w-8 h-8 font-bold flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500"
              >
                X
              </button>
            </div>

            {[{ title: "Event", items:  eventList }, { title: "Category", items: categoryList }, { title: "District", items: districtList }].map((section, index) => (
              <div key={index}>
                <p className="text-lg font-semibold mb-2 text-black">{section.title}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 text-[#686868] font-semibold ">
                  {section.items.map((item, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 bg-gray-100 p-2 rounded-full border border-gray-300 hover:border-[#170645] cursor-pointer text-sm sm:text-base"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="truncate">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </nav>
  );
}



