"use client"; // ✅ Ensures this component runs on the client

import React, { useState, useEffect } from "react";

export default function DepartmentsTab() {
  const [departmentName, setDepartmentName] = useState(""); // Store input value
  const [departments, setDepartments] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Track the department being edited
  const [editedName, setEditedName] = useState(""); // Store the edited name

  useEffect(() => {
    fetch("http://localhost:5000/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data));
  }, []);

  // Function to handle adding a department
  const handleAddDepartment = () => {
    if (departmentName.trim() !== "") {
      fetch("http://localhost:5000/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: departmentName })
      }).then(() => {
        setDepartments([...departments, { name: departmentName }]);
        setDepartmentName("");
      });
    }
  };

  // Function to enable editing mode
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedName(departments[index].name);
  };
  // Function to save the edited department name
  const handleSaveEdit = (index) => {
    if (editedName.trim() !== "") {
      fetch(`http://localhost:5000/departments/${departments[index].name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName })
      }).then(() => {
        const updatedDepartments = [...departments];
        updatedDepartments[index].name = editedName;
        setDepartments(updatedDepartments);
        setEditIndex(null);
      });
    }
  };

  const handleDelete = (name) => {
    fetch(`http://localhost:5000/departments/${name}`, { method: "DELETE" })
      .then(() => setDepartments(departments.filter(d => d.name !== name)));
  };


  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditIndex(null); // Exit editing mode without saving
  };

  return (
    <div className="overflow-x-auto">
      {/* Department Name Input and Add Button */}
      <div className="flex flex-col mt-3 sm:flex-row sm:items-center justify-center w-full gap-4">
        <input
          type="text"
          placeholder="Type Department To Add"
          className="w-full placeholder:font-bold text-center sm:w-auto p-3 border border-gray-300 rounded-full text-[#170645] focus:outline-[#170645] placeholder-[#170645]"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <button
          className="w-full sm:w-auto bg-[#170645] text-[#FFE100] px-6 py-3 rounded-full font-semibold shadow-lg"
          onClick={handleAddDepartment}
        >
          Add
        </button>
      </div>

      {/* Total Departments Count */}
      <div className="mt-1 font-semibold text-[#170645]">
        Total Tags | <span className="font-bold">{departments.length}</span>
      </div>

      {/* Table of Departments */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#D9D9D9] text-center text-[#170645]">
              <th className="p-2 border">No.</th>
              <th className="p-2 border">Department Name</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-[50px] text-[#170645] text-center">No data available</td>
            </tr>
          ) : (departments.map((department, index) => (
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
                    department.name
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
                        onClick={handleCancelEdit}
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
                  {/* <button onClick={() => handleDelete(department.name)} className="text-red-500 ml-2">Delete</button> */}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
