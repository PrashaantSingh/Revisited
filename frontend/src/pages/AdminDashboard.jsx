import { useEffect, useState } from "react";
import Header from "../components/Header";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAllUsers() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/admin/users`, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = await res.json();
        if (data?.success) {
          setAllUsers(
            data.users.sort((a, b) => {
              const aTime = new Date(a.lastActiveAt || 0).getTime();
              const bTime = new Date(b.lastActiveAt || 0).getTime();
              return bTime - aTime;
            })
          );
        }
      } catch (error) {
        console.error("Error loading all users:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getAllUsers();
  }, []);

  return (
    <>
      <Header noSignin={true} noSignup={true} loggedIn={true} />

      <div className="mt-10 w-[90%] mx-auto max-w-[1450px]">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Admin Dashboard
        </h1>

        {isLoading ? (
          <h2 className="text-white text-center text-xl animate-pulse">
            Loading users...
          </h2>
        ) : allUsers.length === 0 ? (
          <h2 className="text-white font-semibold text-3xl text-center">
            No users found.
          </h2>
        ) : (
          // ${user.role.toLowerCase()==='admin'?"border border-amber-500:""}
          <div className="space-y-4">
            {allUsers.map((user) => (
              <div
                key={user._id}
                className={`p-5 bg-light-dark rounded-lg border hover:border-gray-500 transition duration-200`}
              >
                <h2
                  // ${user.role.toLowerCase() === "admin" ? "text-amber-200" : "text-white "}
                  className={`text-xl font-semibold mb-3 text-white`}
                >
                  {user.name}{" "}
                  {user.role.toLowerCase() === "admin" && (
                    <span className="text-sm italic text-amber-200">
                      {"(admin)"}
                    </span>
                  )}
                </h2>
                <div className="text-gray-100 text-sm space-y-1 leading-relaxed">
                  <p>
                    <span className="text-gray-100 font-medium">Email:</span>{" "}
                    {user.email}
                  </p>
                  <p>
                    <span className="text-gray-100 font-medium">
                      Questions:
                    </span>{" "}
                    {user.totalQuestions ?? 0}
                  </p>
                  <p>
                    <span className="text-gray-100 font-medium">Streak:</span>{" "}
                    {user.streak ?? 0} 🔥
                  </p>
                  <p>
                    <span>Max Streak:</span> {user.maxStreak || 0}
                  </p>
                  <p>
                    <span>Total Active Days:</span> {user.totalActiveDays || 0}
                  </p>

                  <p>
                    <span className="text-gray-100 font-medium">
                      Last Active:
                    </span>{" "}
                    {user.lastActiveAt
                      ? new Date(user.lastActiveAt).toLocaleDateString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                          }
                        )
                      : "Never"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
