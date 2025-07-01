// import Actions from "../components/Actions";
import { useState } from "react";
import Header from "../components/Header";
import QuestionList from "../components/QuestionList";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router";
export default function Home({user,setUser,error,setError}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate=useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
             {isLoggingOut && (
        <ConfirmationModal
          text={"Do you want to Log out?"}
          onConfirm={handleLogout}
          onCancel={() => setIsLoggingOut(false)}
        />
      )}
      <Header
        error={error}
        setError={setError}
        setUser={setUser}
        noSignin={true}
        noSignup={true}
        loggedIn={true}
        user={user}
        setIsLoggingOut={setIsLoggingOut}
      />
      <QuestionList />
    </div>
  );
}
