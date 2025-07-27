import { useContext } from "react";
import { NavLink } from "react-router";
// import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";
import { BiSolidDashboard } from "react-icons/bi";

export default function Navbar({ noSignin, noSignup }) {
  const { state, setIsLoggingOut } = useContext(AppContext);
  const user = state.user;
  // const navigate = useNavigate();
  return (
    <nav>
      <ul className="flex justify-between items-center gap-5">
        {!noSignin && (
          <li>
            <NavLink to="/login">Sign in</NavLink>
          </li>
        )}
        {!noSignup && (
          <li>
            <NavLink to="/signup">Sign up</NavLink>
          </li>
        )}
        {!user && <li>About</li>}
        {user && (
          <li className="text-red-600 hover:text-red-500 text-sm sm:text-md">
            <button
              onClick={() => setIsLoggingOut(true)}
              className="cursor-pointer"
            >
              Log out
            </button>
          </li>
        )}
        {user?.role == "admin" && (
          <li>
            <NavLink to="/admin/users">
              <BiSolidDashboard className="sm:text-2xl text-amber-600 cursor-pointer text-xl" />
            </NavLink>
          </li>
        )}
        {user && (
          <li>
            <NavLink
              className="bg-amber-600 hover:bg-amber-500 sm:px-4 sm:py-2 rounded-full cursor-pointer sm:text-sm px-2.5 py-1.5 text-xs"
              to="/addQuestionsForm"
            >
              Add notes
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
