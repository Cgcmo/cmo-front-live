"use client";

import React, { useState, useEffect, useRef } from "react";

export default function RollingDatePicker({ onChange }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const years = Array.from({ length: 50 }, (_, i) => 2000 + i);
  const pickerRef = useRef(null);

  useEffect(() => {
    const selectedIndex = years.indexOf(selectedYear);
    if (pickerRef.current) {
      pickerRef.current.scrollTo({
        top: selectedIndex * 34,
        behavior: "smooth",
      });
    }
  }, [selectedYear]);

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollTop / 34);
    setSelectedYear(years[index]);
    if (onChange) onChange(years[index]);
  };

  return (
    <div className="w-[150px] h-[170px] overflow-hidden rounded-lg relative">
      <div
        className="h-full overflow-y-scroll scroll-snap-y-mandatory transform-style-preserve-3d pt-12 pb-12 no-scrollbar"
        ref={pickerRef}
        onScroll={handleScroll}
      >
        {years.map((year, index) => (
          <div
            key={index}
            className={`h-[34px] leading-[34px] text-center text-gray-500 text-sm transition-all transform ${
              year === selectedYear ? 'text-black text-lg font-bold scale-105 translate-z-[85px]' : ''
            }`}
            style={{
              transform: `rotateX(${(index - years.indexOf(selectedYear)) * 20}deg) translateZ(85px)`
            }}
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
}
