import Navbar from "./Navbar";
import Search from "./Search";
import { Navigate, useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";
export default function Header({ noNav, noSignup, noSignin, loggedIn }) {
  const navigate = useNavigate();
  // const {} = useContext(AppContext);
  return (
    <div className="bg-light-dark">
      <div className="flex justify-between items-center text-white py-2.5 w-[95%] sm:w-[90%] mx-auto max-w-[1450px]">
        <h2
          className="text-amber-600 text-xl sm:text-2xl cursor-pointer font-logo"
          id="logo"
          onClick={() => navigate("/")}
        >
          Revizited
        </h2>
        {/* {!noSearch && <Search />} */}
        {!noNav && (
          <Navbar noSignin={noSignin} noSignup={noSignup} loggedIn={loggedIn} />
        )}
      </div>
    </div>
  );
}
