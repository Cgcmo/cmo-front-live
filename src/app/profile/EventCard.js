

import React from "react";

const events = [
  {
    image: "/cmpic.png",
    title: "CII Young Indians Conference",
    lastDownload: "02 Nov 2024",
    photoCount: 20,
  },
  {
    image: "/cmpic.png",
    title: "Startup India Summit",
    lastDownload: "15 Jan 2025",
    photoCount: 35,
  },
  {
    image: "/cmpic.png",
    title: "Tech Innovation Expo",
    lastDownload: "08 Mar 2025",
    photoCount: 50,
  },
];

const EventCard = () => {
  return (
    <div className="p-6 space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex items-center p-4 bg-gray-200 rounded-2xl shadow-md max-w-screen mx-auto">
          {/* Image Section */}
          <img
            src={event.image} 
            alt={event.title}
            className="w-[107px] h-[97px] rounded-lg object-cover"
          />

          {/* Text Content */}
          <div className="ml-8">
            <h2 className="text-lg text-black font-bold">{event.title}</h2>
            <p className="text-sm font-semibold text-[#170645]">
              <span className="font-semibold text-[#170645]">Last Download :</span> {event.lastDownload}
            </p>
            <p className="text-[#170645] text-sm font-semibold mt-1">{event.photoCount} Photos</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventCard;
