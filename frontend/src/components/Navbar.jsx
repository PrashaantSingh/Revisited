import { useState } from "react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";

export default function Navbar({
  noSignin,
  noSignup,
  setUser,
  user,
  setIsLoggingOut,
}) {
  const navigate = useNavigate();
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
          <li className="text-red-600 hover:text-red-500">
            <button
              onClick={() => setIsLoggingOut(true)}
              className="cursor-pointer"
            >
              Log out
            </button>
          </li>
        )}
        {user && (
          <li>
            <NavLink
              className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-full cursor-pointer"
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
