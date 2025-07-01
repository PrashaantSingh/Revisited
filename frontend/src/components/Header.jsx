import Navbar from "./Navbar";
import Search from "./Search";
import { Navigate, useNavigate } from "react-router";
export default function Header({
  noSearch,
  noNav,
  noSignup,
  noSignin,
  loggedIn,
  user,
  setUser,
  error,
  setError,
  setIsLoggingOut,
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-light-dark">
      <div className="flex justify-between items-center text-white py-2.5 w-[90%] mx-auto">
        <h2
          className="text-amber-600 text-3xl cursor-pointer"
          id="logo"
          onClick={() => navigate("/")}
        >
          Revizited
        </h2>
        {/* {!noSearch && <Search />} */}
        {!noNav && (
          <Navbar
            error={error}
            setError={setError}
            setUser={setUser}
            noSignin={noSignin}
            noSignup={noSignup}
            loggedIn={loggedIn}
            user={user}
            setIsLoggingOut={setIsLoggingOut}
          />
        )}
      </div>
    </div>
  );
}
