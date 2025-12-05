/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login/Login.jsx";
import Signup from "./register/Signup.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import ChatPage from "./chat/ChatPage.jsx";
import Homepage from "./Homepage/Homepage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
*/
import Login from "./login/Login.jsx";
import Register from "./register/Register.jsx";
import Home from "./home/Home.jsx";
import { VerifyUser } from "./utils/VerifyUser.jsx";

import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* MAIN WRAPPER */}
      <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">

        {/* ROUTES */}
        <Routes>

          {/* LOGIN PAGE */}
          <Route
            path="/login"
            element={
              <div className="w-full h-full flex items-center justify-center bg-white shadow-lg rounded-xl p-6 max-w-md">
                <Login />
              </div>
            }
          />

          {/* REGISTER PAGE */}
          <Route
            path="/register"
            element={
              <div className="w-full h-full flex items-center justify-center bg-white shadow-lg rounded-xl p-6 max-w-md">
                <Register />
              </div>
            }
          />

          {/* PROTECTED ROUTES */}
          <Route element={<VerifyUser />}>
            <Route
              path="/"
              element={
                <div className="w-full h-full">
                  <Home />
                </div>
              }
            />
          </Route>
        </Routes>

        {/* TOAST NOTIFICATIONS */}
        <ToastContainer position="top-center" autoClose={2000} theme="dark" />

      </div>
    </>
  );
}

export default App;
