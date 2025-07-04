import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    try {
      const res = await fetch(`${API_URL}/api/user/signup`, {
        // const res = await fetch(`http://localhost:3000/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (!res.ok) {
        let cleanedMessage = data.message
          .replace(/^User validation failed:\s*/, "")
          .replace(/^password:\s*/, "");

        throw new Error(cleanedMessage);
      }

      navigate("/user/verification", { state: { email: userData.email } });
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header noSearch={true} noSignup={true} />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <form
          onSubmit={handleSubmit}
          className="bg-light-dark p-8 rounded-lg shadow-md w-full max-w-md"
          autoComplete="off"
        >
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">
            Sign Up
          </h2>

          <label className="block mb-2 text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
            required
            className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />

          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="cursor-pointer" />
              ) : (
                <FiEye className="cursor-pointer" />
              )}
            </button>
          </div>

          <label className="block mb-2 text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <FiEyeOff className="cursor-pointer" />
              ) : (
                <FiEye className="cursor-pointer" />
              )}
            </button>
          </div>

          <p
            className={`text-xs h-4 mt-2 ${
              error ? "text-red-500 visible" : "invisible"
            }`}
          >
            {error || "placeholder"}
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md mt-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
