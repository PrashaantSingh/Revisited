import { useState } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onRequestReset(userEmail) {
    const res = await fetch(
      "http://localhost:3000/api/user/request-password-reset",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userEmail }),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send OTP.");
    }
    navigate("/reset-otp-verification", { state: { userEmail } });
    return data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await onRequestReset(email.trim());
      setSuccess("If this email exists, an OTP has been sent.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-[100vh] flex flex-col bg-dark">
      <Header noSignup={true} />
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-light-dark p-8 rounded-md w-full max-w-md shadow-md"
        >
          <h2 className="text-white text-2xl font-semibold mb-4 text-center">
            Forgot Password
          </h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            required
            className="w-full mb-4 p-2 border border-gray-300 rounded-md text-white bg-transparent"
          />
          {error && (
            <p className="text-red-500 text-sm mb-2" aria-live="assertive">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-sm mb-2" aria-live="polite">
              {success}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !email}
            className="cursor-pointer w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-md mt-2 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
