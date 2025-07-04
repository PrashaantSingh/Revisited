import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/signin`, {
        // const res = await fetch(`http://localhost:3000/api/user/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (
          res.status === 401 &&
          data.message &&
          data.message.toLowerCase().includes("not verified")
        ) {
          setError("");
          navigate("/user/verification", { state: { email: form.email } });
          setIsLoading(false);
          return;
        }
        throw new Error(data.message);
      }
      localStorage.setItem("token", `Bearer ${data.token}`);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-dark text-white">
      <Header noSearch={true} noSignin={true} />
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-lg shadow-md w-full max-w-md bg-light-dark"
          autoComplete="off"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="off"
              required
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

          <div className="flex justify-start mt-2">
            <button
              type="button"
              className="text-blue-400 text-xs hover:underline focus:outline-none px-2 py-1 cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
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
            className={`cursor-pointer w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md mt-4 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
