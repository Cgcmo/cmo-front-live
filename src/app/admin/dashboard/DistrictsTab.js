"use client"; // ✅ Ensures this component runs on the client

import React, { useState, useEffect } from "react";

export default function DistrictsTab() {
  const [districtName, setDistrictName] = useState(""); // Store input value
  const [districts, setDistricts] = useState([]);

  const [editIndex, setEditIndex] = useState(null); // Track the district being edited
  const [editedName, setEditedName] = useState(""); // Store the edited name

  // Function to handle adding a district

  useEffect(() => {
    fetch("http://localhost:5000/districts")
      .then((res) => res.json())
      .then((data) => setDistricts(data));
  }, []);

  // Function to enable editing mode
  const handleAddDistrict = () => {
    if (districtName.trim() !== "") {
      fetch("http://localhost:5000/districts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: districtName })
      }).then(() => {
        setDistricts([...districts, { name: districtName }]);
        setDistrictName("");
      });
    }
  };


  const handleEdit = (index) => {
    if (index >= 0 && index < districts.length) {
      setEditIndex(index);
      setEditedName(districts[index].name);
    }
  };
  const handleSaveEdit = (index) => {
    if (editedName.trim() !== "" && index >= 0 && index < districts.length) {
      fetch(`http://localhost:5000/districts/${districts[index].name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      }).then(() => {
        const updatedDistricts = [...districts];
        updatedDistricts[index].name = editedName;
        setDistricts(updatedDistricts);
        setEditIndex(null);
      });
    }
  };
  
  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditIndex(null); // Exit editing mode without saving
  };

  const handleDelete = (name) => {
    fetch(`http://localhost:5000/districts/${name}`, { method: "DELETE" })
      .then(() => setDistricts(districts.filter(d => d.name !== name)));
  };

  return (
    <div className="overflow-x-auto ">
      {/* District Name Input and Add Button */}
      <div className="flex flex-col mt-3 sm:flex-row sm:items-center justify-center w-full gap-4">
        <input
          type="text"
          placeholder="Type District To Add"
          className="w-full placeholder:font-bold text-center sm:w-auto p-3 border border-gray-300 rounded-full text-[#170645] focus:outline-[#170645] placeholder-[#170645]"
          value={districtName}
          onChange={(e) => setDistrictName(e.target.value)}
        />
        <button
          className="w-full sm:w-auto bg-[#170645] text-[#FFE100] px-6 py-3 rounded-full font-semibold shadow-lg"
          onClick={handleAddDistrict}
        >
          Add
        </button>
      </div>

      {/* Total Districts Count */}
      <div className="mt-1 font-semibold text-[#170645]">
        Total Tags | <span className="font-bold">{districts.length}</span>
      </div>

      {/* Table of Districts */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#D9D9D9] text-center text-[#170645]">
              <th className="p-2 border">No.</th>
              <th className="p-2 border">District Name</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
          {districts.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-[50px]  text-center text-[#170645]">No data available</td>
            </tr>
          ) : (districts.map((district, index) => (
              <tr key={index} className="text-[#170645] text-center border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  {editIndex === index ? (
                    <input
                      type="text"
                      className="p-1 border border-gray-300 rounded"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    district.name
                  )}
                </td>
                <td className="p-2 flex justify-center items-center gap-2">
                  {editIndex === index ? (
                    <>
                      <button
                        className="text-green-600 font-semibold"
                        onClick={() => handleSaveEdit(index)}
                      >
                        Save
                      </button>
                      <button
                        className="text-red-600 font-semibold"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                   
                    <button
                      className="flex items-center text-green-600"
                      onClick={() => handleEdit(index)}
                    >
                      <img src="/edit-icon.png" alt="Edit" className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  )}
                  {/* <button onClick={() => handleDelete(district.name)} className="text-red-500 ml-2">Delete</button> */}
                  </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
