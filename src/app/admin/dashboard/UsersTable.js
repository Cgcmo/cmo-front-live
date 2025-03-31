
// "use client";

// import React, { useState } from "react";
// import Switch from "./Switch"; // Import your custom switch
// import "./ToggleSwitch.css"; // Ensure styles are applied
// import Cookies from "js-cookie";
// import axios from "axios";

// export default function UsersTable() {
//   const [editIndex, setEditIndex] = useState(null);
//   const [editedUser, setEditedUser] = useState({});
//   const [filter, setFilter] = useState("All");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [users, setUsers] = useState([
//     { id: 1, name: "Sneha Roy", role: "Admin", district: "Durg", mobile: "9235468505", email: "sneharoy17@gmail.com", status: true },
//     { id: 2, name: "Disha Sahu", role: "User", district: "Bastar", mobile: "9235468505", email: "dishasahu65@gmail.com", status: true },
//     { id: 3, name: "Shyam Shing", role: "User", district: "Balod", mobile: "9235468505", email: "shyamshing@gmail.com", status: true },
//     { id: 4, name: "Suriya Kumar", role: "User", district: "Bijapur", mobile: "9235468505", email: "suriyakumar25@gmail.com", status: true },
//     { id: 5, name: "Leshika Tandan", role: "Admin", district: "Durg", mobile: "9235468505", email: "leshikatandan156@gmail.com", status: true },
//     { id: 6, name: "Pratik Raj", role: "User", district: "Bilaspur", mobile: "9235468505", email: "pratikraj11@gmail.com", status: true },
//     { id: 7, name: "Aditi Shign", role: "User", district: "Dhamtari", mobile: "9235468505", email: "aditishign152@gmail.com", status: true },
//   ]);
  

//   const toggleStatus = (id) => {
//     setUsers((prevUsers) =>
//       prevUsers.map((user) =>
//         user.id === id ? { ...user, status: !user.status } : user
//       )
//     );
//   };

//   const handleEdit = (index, user) => {
//     setEditIndex(index);
//     setEditedUser({ ...user });
//   };

//   const handleInputChange = (e, field) => {
//     setEditedUser({ ...editedUser, [field]: e.target.value });
//   };

//   const handleSave = (index) => {
//     users[index] = { ...editedUser };
//     setEditIndex(null);
//   };

//   const handleCancel = () => {
//     setEditIndex(null);
//   };


//   const filteredUsers = users.filter(user => {
//     if (filter === "All") return true;
//     if (filter === "Admin") return user.role === "Admin";
//     if (filter === "User") return user.role === "User";
//     if (filter === "Limited Access") return !user.status;
//     return true;
//   });

//   return (
//     <div className="mt-4 overflow-x-auto">
//       <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-4 w-full sm:w-auto">
//         {/* Filter Dropdown */}
//         <div className="relative">
//           <select
//             className="border text-center border-gray-400 text-md rounded-full py-2 text-gray-700  w-full sm:w-auto"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             style={{ textAlign: "center", textAlignLast: "center" }}
//           >
//             <option value="All" style={{ textAlign: "center", textAlignLast: "center" }}>All</option>
//             <option value="User" style={{ textAlign: "center", textAlignLast: "center" }} >User</option>
//             <option value="Admin" style={{ textAlign: "center", textAlignLast: "center" }}>Admin</option>
//             <option value="Limited Access" style={{ textAlign: "center", textAlignLast: "center" }}>Limited Access</option>
//           </select>
//         </div>
//         {/* Add Staff Button */}
//         <button className="bg-[#170645] text-md font text-yellow-400 px-[35px] py-2 rounded-full shadow-xxl w-full sm:w-auto" onClick={() => setIsModalOpen(true)} >
//           Add Staff
//         </button>
//       </div>

//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-[#D9D9D9] text-center text-[#170645] font-normal">
//             <th className="p-2 border">No.</th>
//             <th className="p-2 border">Full Name</th>
//             <th className="p-2 border">Role</th>
//             <th className="p-2 border">District</th>
//             <th className="p-2 border">Mobile No.</th>
//             <th className="p-2 border">Email Id</th>
//             <th className="p-2 border">Action</th> {/* New column for Edit button */}
//             <th className="p-2 border">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user, index) => (
//               <tr key={user.id} className="text-[#170645] text-center border-b">
//                 <td className="p-2">{index + 1}</td>
//                 <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.name} onChange={(e) => handleInputChange(e, "name")} className="p-1 border border-gray-300 rounded w-full" /> : user.name}</td>
//                 <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.role} onChange={(e) => handleInputChange(e, "role")} className="p-1 border border-gray-300 rounded w-full" /> : user.role}</td>
//                 <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.district} onChange={(e) => handleInputChange(e, "district")} className="p-1 border border-gray-300 rounded w-full" /> : user.district}</td>
//                 <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.mobile} onChange={(e) => handleInputChange(e, "mobile")} className="p-1 border border-gray-300 rounded w-full" /> : user.mobile}</td>
//                 <td className="p-2 max-w-[150px] truncate">{editIndex === index ? <input type="text" value={editedUser.email} onChange={(e) => handleInputChange(e, "email")} className="p-1 border border-gray-300 rounded w-full" /> : user.email}</td>
//                 <td className="p-2 flex justify-center items-center gap-2">{editIndex === index ? (<><button className="text-green-600 font-semibold" onClick={() => handleSave(index)}>Save</button><button className="text-red-600 font-semibold" onClick={handleCancel}>Cancel</button></>) : (<button className="flex items-center text-blue-600" onClick={() => handleEdit(index, user)}><img src="/edit-icon.png" alt="Edit" className="w-4 h-4 mr-1" />Edit</button>)}</td>
//                 <td className="p-2 text-center"><Switch checked={user.status} onChange={() => toggleStatus(user.id)} /></td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="p-[50px] text-center text-[#170645]">No data found for this filter</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="relative bg-white p-6 rounded-2xl shadow-lg w-[90%] sm:w-[400px]">
//             {/* Close Button */}
//             <button
//               className="absolute rounded-full bg-gray-300 w-[30px] h-[30px] top-4 right-4 text-gray-500 hover:text-black text-lg"
//               onClick={() => setIsModalOpen(false)}
//             >
//               x
//             </button>

//             {/* Modal Title */}
//             <h2 className="text-[27px] font-bold text-center text-[#170645] mb-4">
//               Add Staff
//             </h2>

//             {/* Form Inputs */}
//             <form>
//               <input type="text" placeholder="Full Name" className="w-full p-3 text-sm border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" />
//               <input type="email" placeholder="Email" className="w-full p-3 text-sm border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" />
//               <input type="tel" placeholder="Mobile No." className="w-full text-sm p-3 border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" />
//               <input type="password" placeholder="Password" className="w-full p-3 text-sm border-gray-400 text-[#170645] placeholder-[#170645] border rounded-full mb-3 focus:outline-none" />
//               {/* Dropdowns */}
//               <select className="w-full p-3 border-gray-400 text-sm  text-[#170645] border rounded-full mb-3 bg-white focus:outline-none">
//                 <option>District</option>
//               </select>
//               <select className="w-full p-3 text-sm text-[#170645] border-gray-400 border rounded-full mb-4 bg-white focus:outline-none">
//                 <option>Access</option>
//               </select>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-[#170645] text-yellow-400 font-bold py-3 rounded-full hover:opacity-90"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>



//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import Switch from "./Switch"; // Import your custom switch
import "./ToggleSwitch.css"; // Ensure styles are applied


export default function UsersTable({fetchAllStats}) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    district: "",
  }); 

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/update-user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !currentStatus }),
      });
  
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: !currentStatus } : user
          )
        );
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  

  // const handleEdit = (index, user) => {
  //   setEditIndex(index);
  //   setEditedUser({ ...user });
  // };

  const handleInputChange = (e, field) => {
    setEditedUser({ ...editedUser, [field]: e.target.value });
  };

  // const handleSave = (index) => {
  //   users[index] = { ...editedUser };
  //   setEditIndex(null);
  // };

  const handleCancel = () => {
    setEditIndex(null);
  };


  const filteredUsers = users.filter(user => {
    if (filter === "All") return true;
    if (filter === "Admin") return user.role === "Admin";
    if (filter === "User") return user.role === "User";
    if (filter === "Limited Access") return !user.status;
    return true;
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value,
    }));
  };

  const handleEdit = (index, user) => {
    setEditIndex(index);
    setEditedUser({ ...user });
  };

  // Handle Input Change in Editable Fields
  const handleEditChange = (e, field) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [field]: e.target.value,
    }));
  };

  // ✅ Save Edited Data to Backend
  const handleSave = async (index) => {
    const { name, email, mobile, password, district } = editedUser;

  // ✅ 1. Check if all fields are filled
  if (!name || !email || !mobile || !district) {
    alert("All fields are required.");
    return;
  }

  // ✅ 2. Validate Mobile Number (10 digits, numbers only)
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    alert("Mobile number must be exactly 10 digits and contain only numbers.");
    return;
  }

  // ✅ 3. Validate Email Format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    alert("Invalid email format. Please enter a valid email address.");
    return;
  }

  // ✅ 4. Validate Password (Only if it's being edited)
  if (password && password.length > 0) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
  }
    try {
      const response = await fetch(`http://localhost:5000/update-user/${editedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedUsers = [...users];
        updatedUsers[index] = { ...editedUser };
        setUsers(updatedUsers);
        setEditIndex(null);
      } else {
        console.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Submit Form to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password, district } = newStaff;

    // ✅ 1. Check if all fields are filled
    if (!name || !email || !mobile || !password || !district) {
      alert("All fields are required.");
      return;
    }
  
    // ✅ 2. Validate Mobile Number (10 digits, numbers only)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      alert("Mobile number must be exactly 10 digits and contain only numbers.");
      return;
    }
  
    // ✅ 3. Validate Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/add-staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      if (response.ok) {
        fetchUsers();
        fetchAllStats(); // Refresh user table
        setIsModalOpen(false);
        setNewStaff({ name: "", email: "", mobile: "", password: "", district: "" });
      } else {
        console.error("Failed to add staff");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-4 w-full sm:w-auto">
        {/* Filter Dropdown */}
        <div className="relative">
          <select
            className="border text-center border-gray-400 text-md rounded-full py-2 text-gray-700  w-full sm:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ textAlign: "center", textAlignLast: "center" }}
          >
            <option value="All" style={{ textAlign: "center", textAlignLast: "center" }}>All</option>
            <option value="User" style={{ textAlign: "center", textAlignLast: "center" }} >User</option>
            <option value="Admin" style={{ textAlign: "center", textAlignLast: "center" }}>Admin</option>
            <option value="Limited Access" style={{ textAlign: "center", textAlignLast: "center" }}>Limited Access</option>
          </select>
        </div>
        {/* Add Staff Button */}
        <button className="bg-[#170645] text-md font text-yellow-400 px-[35px] py-2 rounded-full shadow-xxl w-full sm:w-auto" onClick={() => setIsModalOpen(true)} >
          Add Staff
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#D9D9D9] text-center text-[#170645] font-normal">
            <th className="p-2 border">No.</th>
            <th className="p-2 border">Full Name</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">District</th>
            <th className="p-2 border">Mobile No.</th>
            <th className="p-2 border">Email Id</th>
            <th className="p-2 border">Action</th> {/* New column for Edit button */}
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.id} className="text-[#170645] text-center border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.name} onChange={(e) => handleInputChange(e, "name")} className="p-1 border border-gray-300 rounded w-full" /> : user.name}</td>
                <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.role} onChange={(e) => handleInputChange(e, "role")} className="p-1 border border-gray-300 rounded w-full" /> : user.role}</td>
                <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.district} onChange={(e) => handleInputChange(e, "district")} className="p-1 border border-gray-300 rounded w-full" /> : user.district}</td>
                <td className="p-2">{editIndex === index ? <input type="text" value={editedUser.mobile} onChange={(e) => handleInputChange(e, "mobile")} className="p-1 border border-gray-300 rounded w-full" /> : user.mobile}</td>
                <td className="p-2 max-w-[150px] truncate">{editIndex === index ? <input type="text" value={editedUser.email} onChange={(e) => handleInputChange(e, "email")} className="p-1 border border-gray-300 rounded w-full" /> : user.email}</td>
                <td className="p-2 flex justify-center items-center gap-2">{editIndex === index ? (<><button className="text-green-600 font-semibold" onClick={() => handleSave(index)}>Save</button><button className="text-red-600 font-semibold" onClick={handleCancel}>Cancel</button></>) : (<button className="flex items-center text-blue-600" onClick={() => handleEdit(index, user)}><img src="/edit-icon.png" alt="Edit" className="w-4 h-4 mr-1" />Edit</button>)}</td>
                <td className="p-2 text-center"><Switch checked={user.status} onChange={() => toggleStatus(user._id, user.status)} /></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="p-[50px] text-center text-[#170645]">No data found for this filter</td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-[90%] sm:w-[400px]">
            {/* Close Button */}
            <button
              className="absolute rounded-full bg-gray-300 w-[30px] h-[30px] top-4 right-4 text-gray-500 hover:text-black text-lg"
              onClick={() => setIsModalOpen(false)}
            >
              x
            </button>

            {/* Modal Title */}
            <h2 className="text-[27px] font-bold text-center text-[#170645] mb-4">
              Add Staff
            </h2>

            {/* Form Inputs */}
            <form onSubmit= {handleSubmit}>
              <input type="text" name="name" placeholder="Full Name" className="w-full p-3 text-sm border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" value={newStaff.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" className="w-full p-3 text-sm border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" value={newStaff.email} onChange={handleChange} required/>
              <input type="tel"  name="mobile" placeholder="Mobile No." className="w-full text-sm p-3 border border-gray-400 text-[#170645] placeholder-[#170645] rounded-full mb-3 focus:outline-none" value={newStaff.mobile} onChange={handleChange} required maxLength="10" />
              <input type="password" name="password" placeholder="Password" className="w-full p-3 text-sm border-gray-400 text-[#170645] placeholder-[#170645] border rounded-full mb-3 focus:outline-none" value={newStaff.password} onChange={handleChange} required  />
              {/* Dropdowns */}
              <select  name="district" className="w-full p-3 border-gray-400 text-sm  text-[#170645] border rounded-full mb-3 bg-white focus:outline-none" value={newStaff.district} onChange={handleChange} required >
              <option value="">Select District</option>
              <option>Balod</option>
      <option>Baloda Bazar</option>
      <option>Balrampur</option>
      <option>Bastar</option>
      <option>Bemetara</option>
      <option>Bijapur</option>
      <option>Bilaspur</option>
      <option>Dantewada (South Bastar)</option>
      <option>Dhamtari</option>
      <option>Durg</option>
      <option>Gariaband</option>
      <option>Gaurela-Pendra-Marwahi</option>
      <option>Janjgir-Champa</option>
      <option>Jashpur</option>
      <option>Kabirdham (Kawardha)</option>
      <option>Kanker (North Bastar)</option>
      <option>Kondagaon</option>
      <option>Korba</option>
      <option>Koriya</option>
      <option>Mahasamund</option>
      <option>Mungeli</option>
      <option>Narayanpur</option>
      <option>Raigarh</option>
      <option>Raipur</option>
      <option>Rajnandgaon</option>
      <option>Sukma</option>
      <option>Surajpur</option>
      <option>Surguja</option>
              </select>
              {/* <select className="w-full p-3 text-sm text-[#170645] border-gray-400 border rounded-full mb-4 bg-white focus:outline-none">
                <option>Access</option>
              </select> */}
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#170645] text-yellow-400 font-bold py-3 rounded-full hover:opacity-90"
                
              > Submit
              </button>
            </form>
          </div>
        </div>
      )}

    </div>



  );
}
