// import { useRef, useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router";
// import Header from "../components/Header";

// export default function OtpVerification({ onVerify }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location?.state?.email;
//   useEffect(() => {
//     const handleGlobalPaste = (e) => {
//       const paste = (e.clipboardData || window.clipboardData)
//         .getData("text")
//         .replace(/\D/g, "")
//         .slice(0, 6);

//       if (!paste) return;

//       // Make sure the focused element is one of the OTP inputs
//       const active = document.activeElement;
//       const index = inputsRef.current.findIndex((el) => el === active);

//       if (index === 0) {
//         e.preventDefault();
//         const newOtp = [...otp];
//         for (let i = 0; i < paste.length; i++) {
//           newOtp[i] = paste[i];
//         }
//         setOtp(newOtp);
//         inputsRef.current[Math.min(paste.length, 5)]?.focus();
//       }
//     };

//     document.addEventListener("paste", handleGlobalPaste);
//     return () => document.removeEventListener("paste", handleGlobalPaste);
//   }, [otp]);

//   useEffect(() => {
//     if (!email) {
//       navigate("/signup");
//     }
//   }, [email, navigate]);

//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isVerifying, setIsVerifying] = useState(false);

//   const inputsRef = useRef([]);

//   // Autofocus on first input on mount
//   useEffect(() => {
//     if (inputsRef.current[0]) {
//       inputsRef.current[0].focus();
//     }
//   }, []);

//   // Allow pasting the full OTP into any input (not just the first)
//   const handlePaste = (e, index) => {
//     let paste = "";
//     if (e.clipboardData) {
//       paste = e.clipboardData.getData("text");
//     } else if (window.clipboardData) {
//       paste = window.clipboardData.getData("Text");
//     } else if (e.target.value) {
//       paste = e.target.value;
//     }
//     paste = paste.replace(/\D/g, "");
//     if (paste.length > 0) {
//       const arr = paste.slice(0, 6).split("");
//       const newOtp = [...otp];
//       for (let i = 0; i < arr.length && i + index < 6; i++) {
//         newOtp[i + index] = arr[i];
//       }
//       setOtp(newOtp);
//       setTimeout(() => {
//         if (inputsRef.current[Math.min(index + arr.length - 1, 5)]) {
//           inputsRef.current[Math.min(index + arr.length - 1, 5)].focus();
//         }
//       }, 0);
//       e.preventDefault();
//     }
//   };

//   const handleChange = (value, index) => {
//     // Only allow numeric input
//     if (/^\d?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       setError(""); // Clear error on input
//       // Move to next input
//       if (value && index < 5) {
//         inputsRef.current[index + 1]?.focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//     // Prevent non-numeric keys except navigation
//     if (
//       !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) &&
//       !/\d/.test(e.key)
//     ) {
//       e.preventDefault();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const fullOtp = otp.join("");

//     if (fullOtp.length !== 6) {
//       setError("Please enter the full 6-digit OTP.");
//       return;
//     }

//     setIsVerifying(true);
//     setError("");

//     try {
//       const res = await fetch("http://localhost:3000/api/user/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp: fullOtp }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setSuccessMessage("OTP Verified Successfully!");
//       setTimeout(() => {
//         onVerify(data);
//       }, 1000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   if (!email) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-dark">
//         <h2 className="text-white text-center">Redirecting...</h2>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header noSignup={true} />
//       <div className="min-h-screen flex items-center justify-center bg-dark">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-light-dark p-8 rounded-md w-full max-w-md shadow-md"
//         >
//           <h2 className="text-white text-2xl font-semibold mb-4 text-center">
//             Verify OTP
//           </h2>
//           <p className="text-gray-300 text-sm mb-6 text-center">
//             Enter the 6-digit OTP sent to{" "}
//             <span className="text-amber-400">{email}</span>
//           </p>

//           <div className="flex justify-between gap-2 mb-4">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 maxLength={1}
//                 ref={(el) => (inputsRef.current[index] = el)}
//                 value={digit}
//                 onChange={(e) => handleChange(e.target.value, index)}
//                 onKeyDown={(e) => handleKeyDown(e, index)}
//                 onPaste={(e) => handlePaste(e, index)}
//                 className="w-12 h-12 text-center text-xl bg-dark text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 inputMode="numeric"
//                 autoComplete="one-time-code"
//               />
//             ))}
//           </div>

//           {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//           {successMessage && (
//             <p className="text-green-500 text-sm mb-2">{successMessage}</p>
//           )}

//           <button
//             type="submit"
//             disabled={isVerifying}
//             className={`w-full py-2 rounded text-white text-sm font-semibold ${
//               isVerifying
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-amber-600 hover:bg-amber-700"
//             }`}
//           >
//             {isVerifying ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }

// import { useRef, useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router";
// import Header from "../components/Header";

// export default function OtpVerification({ onVerify }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location?.state?.email;

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isVerifying, setIsVerifying] = useState(false);
//   const inputsRef = useRef([]);

//   // Redirect if no email
//   useEffect(() => {
//     if (!email) navigate("/signup");
//   }, [email, navigate]);

//   // Focus first input
//   useEffect(() => {
//     inputsRef.current[0]?.focus();
//   }, []);

//   // Global Ctrl+V paste handler
//   useEffect(() => {
//     const onPaste = (e) => {
//       const pasted = e.clipboardData?.getData("text")?.replace(/\D/g, "");
//       if (!pasted || pasted.length < 1) return;

//       e.preventDefault();
//       const digits = pasted.slice(0, 6).split("");
//       const updatedOtp = [...otp];
//       for (let i = 0; i < 6; i++) {
//         updatedOtp[i] = digits[i] || "";
//       }
//       setOtp(updatedOtp);

//       // Move focus
//       const focusIndex = Math.min(digits.length, 5);
//       setTimeout(() => inputsRef.current[focusIndex]?.focus(), 0);
//     };

//     window.addEventListener("paste", onPaste);
//     return () => window.removeEventListener("paste", onPaste);
//   }, [otp]);

//   const handleChange = (val, idx) => {
//     if (!/^\d?$/.test(val)) return;

//     const newOtp = [...otp];
//     newOtp[idx] = val;
//     setOtp(newOtp);

//     if (val && idx < 5) {
//       inputsRef.current[idx + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e, idx) => {
//     if (e.key === "Backspace" && !otp[idx] && idx > 0) {
//       inputsRef.current[idx - 1]?.focus();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const fullOtp = otp.join("");
//     if (fullOtp.length !== 6) {
//       setError("Please enter all 6 digits.");
//       return;
//     }

//     setIsVerifying(true);
//     try {
//       const res = await fetch("http://localhost:3000/api/user/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp: fullOtp }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       setSuccessMessage("OTP Verified!");
//       setTimeout(() => onVerify(data), 1000);
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   return (
//     <>
//       <Header noSignup />
//       <div className="min-h-screen flex items-center justify-center bg-dark">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-light-dark p-8 rounded-md w-full max-w-md shadow-md"
//         >
//           <h2 className="text-white text-2xl font-semibold mb-4 text-center">
//             Verify OTP
//           </h2>
//           <p className="text-gray-300 text-sm mb-6 text-center">
//             Enter the 6-digit OTP sent to{" "}
//             <span className="text-amber-400">{email}</span>
//           </p>

//           <div className="flex justify-between gap-2 mb-4">
//             {otp.map((digit, i) => (
//               <input
//                 key={i}
//                 ref={(el) => (inputsRef.current[i] = el)}
//                 type="text"
//                 maxLength="1"
//                 value={digit}
//                 onChange={(e) => handleChange(e.target.value, i)}
//                 onKeyDown={(e) => handleKeyDown(e, i)}
//                 className="w-12 h-12 text-center text-xl bg-dark text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 inputMode="numeric"
//                 autoComplete="one-time-code"
//               />
//             ))}
//           </div>

//           {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//           {successMessage && (
//             <p className="text-green-500 text-sm mb-2">{successMessage}</p>
//           )}

//           <button
//             type="submit"
//             disabled={isVerifying}
//             className={`w-full py-2 rounded text-white text-sm font-semibold ${
//               isVerifying
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-amber-600 hover:bg-amber-700"
//             }`}
//           >
//             {isVerifying ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }

import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Header from "../components/Header";

export default function OtpVerification({ onVerify }) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  const inputsRef = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  // Autofocus first input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Global paste handler
  useEffect(() => {
    const onPaste = (e) => {
      const pasted = (e.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

      if (!pasted) return;

      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [otp]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");
      if (value && index < 5) inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (
      !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) &&
      !/\d/.test(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMessage("OTP Verified Successfully!");
      setTimeout(() => onVerify(data), 1000);
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.stopPropagation();
    if (isResending || resendTimer > 0) return;
    try {
      setIsResending(true);
      const API_URL = import.meta.env.VITE_API_URL;
      const res2 = await fetch(`${API_URL}/api/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "accountVerification" }),
      });
      const data = await res2.json();
      if (!res2.ok) throw new Error(data.message);
      setSuccessMessage("OTP resent successfully.");
      setResendTimer(30);
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <h2 className="text-white text-center">Redirecting...</h2>
      </div>
    );
  }

  return (
    <>
      <Header noSignup={true} />
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <form onSubmit={handleSubmit}>
          <h2 className="text-white text-2xl font-semibold mb-4 text-center">
            Account Verification OTP
          </h2>
          <p className="text-gray-300 text-sm mb-6 text-center">
            Enter the 6-digit OTP sent to{" "}
            <span className="text-amber-400">{email}</span>
          </p>

          <div className="flex justify-between gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => (inputsRef.current[index] = el)}
                value={digit}
                onChange={(e) => {
                  handleChange(e.target.value, index);
                  if (error) setError("");
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl bg-dark text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm mb-2">{successMessage}</p>
          )}

          <div className="text-center text-sm mt-2 mb-4">
            {resendTimer > 0 ? (
              <p className="text-gray-400">
                Resend available in{" "}
                <span className="text-white">{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-amber-400 hover:underline"
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className={`cursor-pointer w-full py-2 rounded text-white text-sm font-semibold ${
              isVerifying
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </>
  );
}
