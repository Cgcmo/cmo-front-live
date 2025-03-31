import { useRouter } from "next/navigation"; // Import useRouter
import { useState } from "react";

export default function AuthPage() {
  const router = useRouter(); // Initialize router

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Raipur");

  const chhattisgarhCities = [
    "Raipur", "Bilaspur", "Durg", "Jagdalpur", "Korba", "Ambikapur",
    "Rajnandgaon", "Raigarh", "Dhamtari", "Mahasamund", "Kanker",
    "Jashpur", "Balod", "Bemetara", "Baloda Bazar", "Kawardha",
    "Mungeli", "Sukma", "Bijapur", "Narayanpur", "Kondagaon",
    "Dantewada", "Gariaband"
  ];

  return (
    <div>
      <p className="text-xl font-bold text-center text-purple-900">AI Based CMO Gallery</p>
      <h2 className="text-xl font-bold text-center text-purple-900">Update Profile</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border w-full p-2 rounded-md mb-4"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border w-full p-2 rounded-md mb-4"
      />

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border w-full p-2 rounded-md mb-4"
      >
        {chhattisgarhCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* ✅ Updated Button with Confirmation Alert */}
      <button
        className="w-full bg-purple-900 text-white p-2 rounded-md"
        onClick={() => {
          if (window.confirm("Profile updated! Click OK to go to Dashboard.")) {
            router.push("/Dashboard"); // Redirect after user clicks OK
          }
        }}
      >
        Update Profile
      </button>
    </div>
  );
}
