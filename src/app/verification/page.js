"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!isNaN(value) && value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to the next input if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleConfirm = () => {
    const otp = code.join(""); // Combine OTP digits
    if (otp === "123456") { //  Replace with actual OTP logic
      localStorage.setItem("otpVerified", "true"); // Store verification
      router.push("/profile-update"); //  Redirect to Profile Update
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* Logo on Top */}
      <img src="/img_1.png" alt="Logo" className="w-24 mx-auto mb-4" />

      {/* Verification Box */}
      <div className="bg-white shadow-lg p-6 rounded-lg w-full md:w-1/3">
        <h2 className="text-xl font-bold text-center text-purple-900">Verification Code</h2>
        <p className="text-sm text-center text-gray-500">
          We Have Sent The Verification Code To Your Mobile Number
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-center my-4">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-10 border text-center text-xl rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-purple-900 text-white p-2 rounded-md hover:bg-purple-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
