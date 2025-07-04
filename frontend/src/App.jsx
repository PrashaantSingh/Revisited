import "./App.css";
import AddQuestionForm from "./pages/AddQuestions";
import QuestionDetails from "./pages/QuestionDetails.jsx";
import Home from "./pages/Home";
import { Routes, Route, useNavigate, Navigate } from "react-router";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { useEffect } from "react";
import { useState } from "react";
import OtpVerification from "./pages/OtpVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetOtpVerification from "./pages/ResetOtpVerification.jsx";
import SetNewPassword from "./pages/SetNewPassword.jsx";
import PageNotFound from "./components/PageNotFound";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    async function getUser() {
      const token = localStorage.getItem("token");
      // if(token==undefined||token==null)setIsLoading(false);
      if (!token) return;
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/user/me`, {
          // const res = await fetch(` http://localhost:3000/api/user/me`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: token,
          },
        });

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    getUser();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-white text-center">Loading...</h2>
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Home
                  user={user}
                  error={error}
                  setError={setError}
                  setUser={setUser}
                  questions={questions}
                  setQuestions={setQuestions}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
          />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route
            path="/addQuestionsForm"
            element={
              <AddQuestionForm
                setQuestions={setQuestions}
                questions={questions}
              />
            }
          />

          <Route
            path="/questions/:id"
            element={
              <QuestionDetails
                setQuestions={setQuestions}
                questions={questions}
              />
            }
          />
          <Route
            path="/user/verification"
            element={
              <OtpVerification
                setUser={setUser}
                onVerify={(data) => {
                  localStorage.setItem("token", `Bearer ${data.token}`);
                  setUser(data.user);
                  navigate("/");
                }}
              />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-otp-verification"
            element={<ResetOtpVerification />}
          />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
