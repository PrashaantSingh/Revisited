import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Header from "../components/Header";

export default function SetNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { userEmail, otp } = useLocation().state || {};

  useEffect(() => {
    if (!userEmail) {
      navigate("/forgot-password");
    }

    if (!otp) {
      navigate("/reset-otp-verification");
    }
  }, []);

  async function onSetPassword(userEmail) {
    const res = await fetch("http://localhost:3000/api/user/reset-password", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userEmail, otp, newPassword: password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not update the password.");
    }
    navigate("/");
    return data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await onSetPassword(userEmail, password);
      setSuccess("Password reset successfully!");
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!userEmail || !otp) {
    return (
      <div className="min-h-screen h-[100vh] flex flex-col bg-dark">
        <Header noSignup={true} />
        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-white text-center">Redirecting...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-[100vh] flex flex-col bg-dark">
      <Header noSignup={true} />
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-light-dark p-8 rounded-md w-full max-w-md shadow-md"
        >
          <h2 className="text-white text-2xl font-semibold mb-4 text-center">
            Set New Password
          </h2>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            required
            className="w-full mb-4 p-2 border border-gray-300 rounded-md text-white"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            required
            className="w-full mb-4 p-2 border border-gray-300 rounded-md text-white"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-md mt-2 cursor-pointer"
          >
            {loading ? "Resetting..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
