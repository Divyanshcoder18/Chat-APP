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
    <div className="w-full min-h-screen bg-bg-primary text-text-primary">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<VerifyUser />}>
          <Route path="/" element={
            <div className="h-screen overflow-hidden">
              <Home />
            </div>
          } />
        </Route>
      </Routes>

      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    </div>
  );
}

export default App;
