
"use client";
import { Poppins } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // CSS Variable for Tailwind
});
export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  


  const col1DefaultImages = [
    "/ban-01.png",
    "/ban-02.png",
    "/ban-03.png",
  ];

  const col2DefaultImages = [
    "/ban-04.png",
    "/ban-03.png",
    "/ban-02.png",
  ];

  const col3DefaultImages = [
    "/ban-02.png",
    "/ban-04.png",
    "/ban-01.png",
  ];

  // State for each column, initialized with unique default images
  const [col1Images, setCol1Images] = useState(col1DefaultImages);
  const [col2Images, setCol2Images] = useState(col2DefaultImages);
  const [col3Images, setCol3Images] = useState(col3DefaultImages);


  const handleLogin = async () => {
    setIsLoading(true);
  
    if ((!username && !mobile) || !password) {
      alert("Please enter either Username or Mobile and Password.");
      setIsLoading(false);
      return;
    }
  
    // ✅ Validate Mobile Number (if entered)
    const trimmedMobile = mobile.startsWith("+91") ? mobile.slice(3) : mobile;
    if (mobile && !/^[6-9]\d{9}$/.test(trimmedMobile)) {
      alert("Please enter a valid 10-digit mobile number starting with 6-9.");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: username || trimmedMobile,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.error || "Login failed!");
        setIsLoading(false);
        return;
      }
  
      // ✅ Store user session using Cookies
      Cookies.set("adminLoggedIn", "true", { expires: 1, path: "/admin" });
      Cookies.set("loggedInUserId", data.userId, { expires: 1, path: "/" });

      alert("Login successful!");
      router.push("/admin/dashboard"); // Redirect to dashboard
  
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  
    setIsLoading(false);
  };

  
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scrollDownSlow {
        from { transform: translateY(-50%); }
        to { transform: translateY(0%); }
      }

      @keyframes scrollDownFast {
        from { transform: translateY(-50%); }
        to { transform: translateY(0%); }
      }

      @keyframes scrollUpMedium {
        from { transform: translateY(0%); }
        to { transform: translateY(-50%); }
      }

      .scroll-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      .col1 {
        animation-name: scrollDownSlow;
        animation-duration: 40s; /* Slow Speed */
      }

      .col2 {
        animation-name: scrollUpMedium;
        animation-duration: 30s; /* Medium Speed */
      }

      .col3 {
        animation-name: scrollDownFast;
        animation-duration: 20s; /* Fast Speed */
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);





  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100">
      {/* Left Side: Login Box */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 md:p-12">
        <img src="/CG logo.webp" alt="Logo" className="w-24 h-24 mb-4" />
        <div className="bg-white rounded-2xl ml-[30px] shadow-lg p-6 w-full max-w-[516px]">
        {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              {/* Circular Loading Spinner */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-20 h-20 animate-spin text-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
              <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5d57b6" />
                <stop offset="50%" stopColor="#3b3bbb" />
                <stop offset="100%" stopColor="#170645" />
              </linearGradient>
            </defs>

                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="url(#spinnerGradient)"
                />
              </svg>
              {/* Profile Image Inside Spinner */}
              <img
                src="/CM.png"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                alt="User"
              />
            </div>
            {/* Loading Text */}
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Logging...
            </p>
          </div>
          <div className="absolute bottom-10 text-center">
            <p className="text-lg font-bold text-gray-700">
              The latest <span className="text-black font-bold">AI</span> image search.
            </p>
          </div>
        </div>
      )}

            <div>
              <h2 className="text-2xl font-bold text-center text-[#170645]">AI Based CMO Gallery</h2>
              <p className="text-center text-[#170645] mt-2">Admin Login</p>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border w-full mt-4 p-2 pl-5 rounded-full mb-4 placeholder-[#170645] text-[#170645]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full mt-1 p-2 pl-5 placeholder-[#170645] rounded-full mb-4 text-[#170645]"
              />

              <button onClick={handleLogin} className="w-full mt-1 bg-[#170645] text-[#FFE100] p-2 rounded-full">
                Sign In
              </button>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-[#908AA0]">Or, Login With Mobile</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <input
                type="text"
                placeholder="Mobile No."
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border pl-5 placeholder-[#170645] w-full p-2 rounded-full mb-4 text-[#170645]"
              />
              <button onClick={handleLogin} className="w-full bg-[#170645] text-[#FFE100] p-2 rounded-full">
                Proceed
              </button>
              <div className="flex justify-center gap-4 mt-4">
                <button className="text-[#170645] hover:underline">Customer Support</button>
                <button className="text-[#170645] hover:underline">Terms of Service</button>
              </div>
            </div>
        
        </div>
        <p className="text-center text-black ml-[-10px] mt-6">Initiative By DPR Chhattisgarh</p>
      </div>

      <div className="hidden md:flex md:w-2/3 relative overflow-hidden items-center">
        <div
          className="absolute w-full max-w-[656px] h-full top-0 bottom-0 left-1/2 transform -translate-x-1/2 rotate-[-1.32deg] transition-opacity duration-2000 ease-in-out"
        >

          <div className="grid grid-cols-3 gap-1">
            {/* Column 1 - Moves Down */}
            <div className="relative space-y-2 overflow-hidden">
              <div className="scroll-column col1">
                {[...col1Images, ...col1Images].map((src, index) => (
                  <img key={`col1-${index}`} src={src} alt={`Column 1 - ${index}`} className="w-[30vh] rounded-lg" />
                ))}
              </div>
            </div>

            {/* Column 2 - Moves Up */}
            <div className="relative space-y-2 overflow-hidden">
              <div className="scroll-column col2">
                {[...col2Images, ...col2Images].map((src, index) => (
                  <img key={`col2-${index}`} src={src} alt={`Column 2 - ${index}`} className="w-[30vh] rounded-lg" />
                ))}
              </div>
            </div>

            {/* Column 3 - Moves Down */}
            <div className="relative space-y-2 overflow-hidden">
              <div className="scroll-column col3">
                {[...col3Images, ...col3Images].map((src, index) => (
                  <img key={`col3-${index}`} src={src} alt={`Column 3 - ${index}`} className="w-[30vh] rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
