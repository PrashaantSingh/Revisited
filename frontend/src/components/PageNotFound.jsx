import { useNavigate } from "react-router";
import Header from "./Header";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header noSignup={true} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark">
        <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
        <h2 className="text-2xl text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded font-semibold"
        >
          Go Home
        </button>
      </div>
    </>
  );
}
