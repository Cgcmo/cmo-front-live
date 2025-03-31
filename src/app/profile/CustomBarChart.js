"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { day: "1", value: 50 },
  { day: "2", value: 20 },
  { day: "3", value: 75 },
  { day: "4", value: 90 },
  { day: "5", value: 55 },
  { day: "6", value: 10 },
  { day: "7", value: 100 },
];

function CustomBarChart() {
  return (
    <div className="bg-[#ECECEC] p-4  rounded-[20px] shadow-md w-full mt-5 h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
          {/* Y-Axis Grid Lines */}
          <CartesianGrid stroke="#A0A0A0" strokeWidth={2} strokeDasharray="4 4" vertical={false} />
          
          {/* X and Y Axes */}
          <XAxis dataKey="day" tick={{ fill: "#686868" }} />
          <YAxis tick={{ fill: "#686868" }} domain={[0, 100]} />
          
          {/* Tooltip on hover */}
          <Tooltip cursor={{ fill: "rgba(23, 6, 69, 0.2)" }} />
          
          {/* Bars */}
          <Bar dataKey="value" fill="#170645" radius={[5, 5, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;
