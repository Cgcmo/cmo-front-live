"use client";
import { useState, useEffect, useRef } from "react";
import RollingDatePicker from './RollingDatePicker';

<RollingDatePicker onChange={(year) => console.log(year)} />

export default function ThreeDDatePicker({ isOpen = false, onClose }) {
  if (!isOpen) return null; // Prevent rendering when closed

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 30 }, (_, i) => 2020 + i);

  const [selectedMonth, setSelectedMonth] = useState("April");
  const [selectedDay, setSelectedDay] = useState(17);
  const [selectedYear, setSelectedYear] = useState(2024);

  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const yearRef = useRef(null);

  useEffect(() => {
    alignScroll(monthRef, months.indexOf(selectedMonth));
    alignScroll(dayRef, selectedDay - 1);
    alignScroll(yearRef, years.indexOf(selectedYear));
  }, [isOpen]);

  const alignScroll = (ref, index) => {
    if (ref.current) {
      const itemHeight = 40;
      ref.current.scrollTop = index * itemHeight;
    }
  };

  const handleScroll = (e, type) => {
    const itemHeight = 40;
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);

    if (type === "month") setSelectedMonth(months[index]);
    if (type === "day") setSelectedDay(days[index]);
    if (type === "year") setSelectedYear(years[index]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-[90%] max-w-md text-center border border-gray-200">
        <h2 className="text-2xl font-extrabold text-[#170645]">Select Date</h2>

        <div className="border-b border-gray-300 my-3"></div>

        {/* ✅ 3D Time Capsule Picker */}
        <div className="flex flex-col items-center justify-center h-[300px] overflow-y-scroll">
        <RollingDatePicker onChange={(year) => console.log(year)} />
</div>
        <div className="border-b border-gray-300 my-3"></div>

        {/* Proceed Button */}
        <button
          className="mt-6 w-full bg-[#170645] text-yellow-300 p-3 rounded-full font-semibold text-center text-lg shadow-md hover:bg-[#0f0435] transition-all"
          onClick={onClose}
        >
          Confirm Date
        </button>
      </div>
    </div>
  );
}
