// import Actions from "../components/Actions";
import { useContext } from "react";
import Header from "../components/Header";
import QuestionList from "../components/QuestionList";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";
export default function Home() {
  const { state, setIsLoggingOut, setQuestions, setUser } =
    useContext(AppContext);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("questions");
    localStorage.removeItem("user");
    setUser(null);
    setQuestions([]);
    setIsLoggingOut(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      {state.isLoggingOut && (
        <ConfirmationModal
          onClose={() => setIsLoggingOut(false)}
          text={"Do you want to Log out?"}
          onConfirm={handleLogout}
          onCancel={() => setIsLoggingOut(false)}
        />
      )}
      <Header noSignin={true} noSignup={true} loggedIn={true} />
      <QuestionList />
    </div>
  );
}
