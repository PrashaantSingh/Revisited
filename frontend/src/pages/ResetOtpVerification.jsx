import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Header from "../components/Header";

export default function ResetOtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.userEmail;

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  const inputsRef = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!userEmail) navigate("/forgot-password");
  }, [userEmail, navigate]);

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
      const res = await fetch(
        "http://localhost:3000/api/user/verify-password-reset-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail, otp: fullOtp }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMessage("OTP Verified Successfully!");
      setTimeout(() => {
        navigate("/set-new-password", { state: { userEmail, otp: fullOtp } });
      }, 1000);
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
      const res = await fetch("http://localhost:3000/api/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, type: "passwordReset" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMessage("OTP resent successfully.");
      setResendTimer(30);
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <h2 className="text-white text-center">Redirecting...</h2>
      </div>
    );
  }

  return (
    <>
      <Header noSignup={true} />
      <div className="min-h-screen h-[100vh] flex items-center justify-center bg-dark">
        <form
          onSubmit={handleSubmit}
          className="bg-light-dark p-8 rounded-md w-full max-w-md shadow-md"
        >
          <h2 className="text-white text-2xl font-semibold mb-4 text-center">
            Verify OTP
          </h2>
          <p className="text-gray-300 text-sm mb-6 text-center">
            Enter the 6-digit OTP sent to{" "}
            <span className="text-amber-400">{userEmail}</span>
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
            className={`w-full py-2 rounded text-white text-sm font-semibold ${
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
