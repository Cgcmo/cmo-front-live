"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


function CustomBarChart({ onPercentageChange }) {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/visitor-stats");
        const data = await response.json();

        // Format data for recharts (x as day number or short name)
        const formatted = data.map((item, index) => ({
          day: `Day ${index + 1}`, // or use: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
          value: item.count,
        }));

        setChartData(formatted);
        if (data.length >= 7) {
          const day6 = data[5].count;
          const day7 = data[6].count;
          const change = day6 === 0 ? 100 : ((day7 - day6) / day6) * 100;

          // Send value to parent
          onPercentageChange && onPercentageChange(change.toFixed(2));
        }
      } catch (err) {
        console.error("Failed to fetch visitor stats:", err);
      }
    };

    fetchVisitorStats();
    const interval = setInterval(fetchVisitorStats, 10000);

    // Clear on unmount
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          color: "#FFE100",
        }}>
          <p style={{ margin: 0, color: "#170645", fontWeight: "bold" }}>{label}</p>
          <p style={{ margin: 0, color: "#170645", fontWeight: "bold" }}>
            Visitors: <span style={{ color: "#FF5733", fontWeight: "bold" }}>{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-[#ECECEC] p-4  rounded-[20px] shadow-md w-full mt-5 h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
          {/* Y-Axis Grid Lines */}
          <CartesianGrid stroke="#A0A0A0" strokeWidth={2} strokeDasharray="4 4" vertical={false} />
          
          {/* X and Y Axes */}
          <XAxis dataKey="day" tick={{ fill: "#686868" }} />
          <YAxis tick={{ fill: "#686868" }} domain={[0, 'dataMax + 10']} />
          
          {/* Tooltip on hover */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Bars */}
          <Bar dataKey="value" fill="#170645" radius={[5, 5, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;
