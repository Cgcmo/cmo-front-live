"use client";
import { Poppins } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // CSS Variable for Tailwind
});
export default function AuthPage() {
  const [showVideoThumbnail, setShowVideoThumbnail] = useState(false);
  const [mobile, setMobile] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const [showSignup, setShowSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleBackButton = () => {
      setShowOTP(false);
      setShowSignup(false);
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/record-visit", {
      method: "POST"
    }).catch((err) => console.error("Failed to record visit:", err));
  }, []);
  
  const handleSignUp = () => {
    let errors = [];

    if (!fullName.trim()) {
      errors.push("Full Name is required.");
    } else if (!/^[A-Za-z ]+$/.test(fullName)) {
      errors.push("Full Name should contain only alphabets.");
    }

    if (!mobile.trim()) {
      errors.push("Mobile number is required.");
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.push("Mobile number must be exactly 10 digits and start with 6-9.");
    }

    if (!email.trim()) {
      errors.push("Email is required.");
    } else if (!/^[\w.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
      errors.push("Please enter a valid email address.");
    }

    if (!password.trim()) {
      errors.push("Password is required.");
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      errors.push("Password must be at least 8 characters long and include a letter, a number, and a special character.");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    setShowOTP(true);
  };

  const handleSignIn = () => {
    if (!mobile) {
      alert("Mobile number is required.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }
    setShowOTP(true);
  };

  const handleOTPChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input field automatically
      if (value && index < otpRefs.length - 1) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleOTPKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleOTPSubmit = () => {
    if (otp.every((digit) => digit !== "")) {
      router.push("/dashboard"); // Redirect to dashboard
    } else {
      alert("Please enter the complete OTP.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowVideoThumbnail((prev) => !prev); // Toggle state every 2 seconds
    }, 4000); // Total cycle duration: 4 seconds (2s fade-out + 2s fade-in)

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100">
      {/* Left Side: Login Box */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 md:p-12">
        <img src="/CG logo.webp" alt="Logo" className="w-24 h-24 mb-4" />
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-[516px]">
          {session ? (
            <div className="text-center">
              <p className="text-xl font-bold text-[#170645]">Welcome, {session.user.name}</p>
              <img
                src={session.user.image}
                alt="Profile"
                className="w-12 h-12 rounded-full mx-auto mt-2"
              />
              <button
                onClick={() => signOut()}
                className="w-full bg-red-500 text-white p-3 mt-5 rounded-lg font-bold"
              >
                Logout
              </button>
            </div>
          ) : showOTP ? (
            <div className="text-center">
              <h2 className="text-2xl pt-2 font-bold text-[#170645]">Verification Code</h2>
              <p className="text-[#170645] pt-2 mt-2">We Have Sent The Verification Code To Your Mobile Number</p>
              <div className="flex justify-center gap-3 flex-wrap py-2 mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="w-12 h-12 text-center border-[#908AA0] text-[#170645] text-xl border rounded"
                  />
                ))}
              </div>
              <button onClick={handleOTPSubmit} className="w-full bg-[#170645] text-yellow-400 p-3 mt-5 mb-4 rounded-full text-lg font-bold">
                Confirm
              </button>
            </div>
          ) : showSignup ? (
            <div>
              <h2 className="text-3xl font-bold text-center text-[#170645]">AI Based CMO Gallery</h2>
              <p className="text-center text-[#170645] text-lg mt-1">One Click Download</p>
              <button onClick={async () => {
                  console.log("🔵 Google Sign-In button clicked");
                  const result = await signIn("google", { callbackUrl: "/dashboard" }); // ✅ Redirect to Dashboard after login
                  console.log("✅ Sign-in result:", result);
                }} className="flex items-center justify-center w-full border p-3 mt-4 rounded-lg hover:bg-gray-200" >
                <img src="/google pic.png" alt="Google" className="w-5 mr-2" />
                <p className="text-[#170645] font-normal">Sign Up With Google</p>
              </button>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-[#908AA0] text-sm">Or, Sign Up With Your Email</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Full Name" value={fullName}
                  onChange={(e) => setFullName(e.target.value)} className="border w-1/2 p-3 rounded-lg placeholder-[#170645] text-[#170645]" />
                <input type="text" placeholder="Mobile No." value={mobile} onChange={(e) => setMobile(e.target.value)} className="border w-1/2 p-3 rounded-lg placeholder-[#170645] text-[#170645]" />
              </div>
              <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="Email Id" className="border w-full p-3 rounded-lg mt-3 placeholder-[#170645] text-[#170645]" />
              <input type="password" placeholder="Create Your Password" value={password}
                onChange={(e) => setPassword(e.target.value)} className="border w-full p-3 rounded-lg mt-3 placeholder-[#170645] text-[#170645]" />
              <button onClick={handleSignUp} className="w-full bg-[#170645] text-[#FFE100] p-3 rounded-lg mt-4 text-lg font-bold">
                Sign Up
              </button>
              <div className="flex justify-center gap-6 mt-4">
                <button className="text-[#170645] hover:underline text-sm">Customer Support</button>
                <button className="text-[#170645] hover:underline text-sm">Terms of Service</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-center text-[#170645]">AI Based CMO Gallery</h2>
              <p className="text-center text-[#170645]">One Click Download</p>
              <button className="flex items-center justify-center w-full border p-2 mt-4 rounded-full hover:bg-gray-200" onClick={() => signIn("google")}>
                <img src="/google pic.png" alt="Google" className="w-5 mr-2" onClick={async () => {
                  console.log("🔵 Google Sign-In button clicked");
                  const result = await signIn("google", { callbackUrl: "/dashboard" }); // ✅ Redirect to Dashboard after login
                  console.log("✅ Sign-in result:", result);
                }} />
                <p className="text-[#170645]">Sign In With Google</p>
              </button>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-[#908AA0]">Or, Sign In With Phone No.</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <input
                type="text"
                placeholder="Mobile No."
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border w-full p-2 rounded-full mb-4 text-[#170645]"
              />
              <button onClick={handleSignIn} className="w-full bg-[#170645] text-yellow-400 p-2 rounded-full">
                Sign In
              </button>
              <p className="text-center text-[#170645] text-sm mt-3">
                Not Registered Yet? <span className="text-[#170645] font-bold cursor-pointer" onClick={() => setShowSignup(true)}>Register Now</span>
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button className="text-[#170645] hover:underline">Customer Support</button>
                <button className="text-[#170645] hover:underline">Terms of Service</button>
              </div>
            </div>
          )}
        </div>
        <p className="text-center text-black ml-[-10px] mt-6">Initiative By DPR Chhattisgarh</p>
      </div>

      <div className="hidden md:flex md:w-2/3 relative overflow-hidden items-center">
        <img
          src="/Group 198.png"
          alt="Main Display"
          className={`absolute w-full max-w-[856px] h-full object-cover top-0 bottom-0 left-1/2 transform -translate-x-1/2 rotate-[-1.32deg] transition-opacity duration-2000 ease-in-out ${showVideoThumbnail ? "opacity-0" : "opacity-100"
            }`}
        />
        <div
          className={`absolute w-[637px] h-[600px] mix-blend-multiply top-[45px] bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center cursor-pointer transition-opacity duration-2000 ease-in-out ${showVideoThumbnail ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => window.open("/video.mp4", "_blank")}
        >
          <img src="/cmpic.png" alt="Video Thumbnail" className="w-full h-full object-contain" />

        </div>
      </div>
    </div>
  );
}