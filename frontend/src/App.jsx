import "./App.css";
import AddQuestionForm from "./pages/AddQuestions";
import QuestionDetails from "./pages/QuestionDetails.jsx";
import Home from "./pages/Home";
import { Routes, Route, useNavigate, Navigate } from "react-router";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { useContext } from "react";
import OtpVerification from "./pages/OtpVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetOtpVerification from "./pages/ResetOtpVerification.jsx";
import SetNewPassword from "./pages/SetNewPassword.jsx";
import PageNotFound from "./components/PageNotFound";
import { AppContext } from "./context/AppContext.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const { state, setUser } = useContext(AppContext);

  const navigate = useNavigate();

  return (
    <>
      {state.isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-white text-center">Loading...</h2>
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={state.user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              !state.user ? <Login setUser={setUser} /> : <Navigate to="/" />
            }
          />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/addQuestionsForm" element={<AddQuestionForm />} />

          <Route path="/questions/:id" element={<QuestionDetails />} />
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
